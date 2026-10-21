/* Epica e romanzo — motore narrativo indipendente, versione 1.
 * Nessuna dipendenza da DOM, mappa, Medioevo, punteggi o framework.
 * Compatibile con script browser classici e require() in Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EpicaEngine = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const VERSION = 1;
  const clamp = value => Math.max(0, Math.min(100, value));
  const fail = message => { throw new Error(message); };
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const isText = v => typeof v === 'string' && v.trim().length > 0;

  function validateStory(story) {
    if (!record(story) || !isText(story.id) || !isText(story.title)) fail('Storia senza ID o titolo');
    if (!Array.isArray(story.stats) || story.stats.length < 1) fail('La storia richiede indicatori');
    if (!Array.isArray(story.scenes) || !story.scenes.length) fail('La storia richiede scene');
    const stats = new Set();
    story.stats.forEach(s => {
      if (!record(s) || !isText(s.id) || !isText(s.label) || !Number.isInteger(s.start) || s.start < 0 || s.start > 100 || stats.has(s.id) || s.id === '__proto__' || s.id === 'constructor') fail('Indicatore non valido');
      stats.add(s.id);
    });
    const ids = new Set();
    story.scenes.forEach(scene => {
      if (!record(scene) || !isText(scene.id) || !isText(scene.title) || !isText(scene.text) || ids.has(scene.id)) fail('Scena non valida');
      ids.add(scene.id);
      if (scene.type === 'narrative') {
        if (scene.choices !== undefined) fail('Una scena narrativa non può avere scelte');
        if (scene.interactive !== undefined) {
          if (!['roles','views'].includes(scene.interactive) ||
              !Array.isArray(scene.panels) || scene.panels.length < 2 || scene.panels.length > 4)
            fail('Pannelli della scena non validi');
          const panelIds = new Set();
          scene.panels.forEach(panel => {
            if (!record(panel) || !isText(panel.id) || !isText(panel.label) ||
                !isText(panel.name) || !isText(panel.text) || panelIds.has(panel.id))
              fail('Contenuto di un pannello non valido');
            panelIds.add(panel.id);
          });
        }
      } else if (scene.type === 'decision' || scene.type === 'reflection') {
        if (!Array.isArray(scene.choices) || scene.choices.length < 2) fail('Scelta con meno di due alternative');
        const choices = new Set();
        scene.choices.forEach(c => {
          if (!record(c) || !isText(c.id) || !isText(c.label) || !isText(c.feedback) || !isText(c.why) || choices.has(c.id)) fail('Alternativa non valida');
          choices.add(c.id);
          if (scene.type === 'reflection' && c.effects && Object.keys(c.effects).length) fail('Una riflessione non cambia gli indicatori');
          validateEffects(c.effects || {}, stats);
        });
        validateEffects(scene.afterEffects || {}, stats);
      } else fail('Tipo di scena sconosciuto: ' + scene.type);
    });
    return story;
  }

  function validateEffects(effects, allowed) {
    if (!record(effects)) fail('Effetti non validi');
    Object.keys(effects).forEach(k => {
      if (!allowed.has(k) || !Number.isInteger(effects[k]) || Math.abs(effects[k]) > 100) fail('Effetto non valido per ' + k);
    });
  }

  function newSession(story) {
    validateStory(story);
    const values = Object.create(null);
    story.stats.forEach(s => { values[s.id] = s.start; });
    return { version: VERSION, storyId: story.id, index: 0, phase: 'scene', values, decisions: [], last: null };
  }

  function currentScene(story, session) {
    checkSession(story, session);
    return session.phase === 'end' ? null : story.scenes[session.index];
  }

  function checkSession(story, session) {
    if (!record(session) || session.version !== VERSION || session.storyId !== story.id) fail('Sessione non compatibile');
    if (!Number.isInteger(session.index) || session.index < 0 || session.index >= story.scenes.length) fail('Indice scena non valido');
    if (!['scene', 'outcome', 'end'].includes(session.phase)) fail('Fase non valida');
    if (!record(session.values) || !Array.isArray(session.decisions)) fail('Sessione non valida');
    if (session.phase === 'outcome' && !record(session.last)) fail('Esito mancante');
    if (session.phase === 'outcome' && story.scenes[session.index].type === 'narrative') fail('Esito in scena narrativa');
    if (session.phase === 'end' && session.index !== story.scenes.length - 1) fail('Fine incongruente');
    const allowed = new Set(story.stats.map(s => s.id));
    if (Object.keys(session.values).length !== allowed.size) fail('Misure incompatibili');
    for (const id of allowed) if (!own(session.values, id) || !Number.isInteger(session.values[id]) || session.values[id] < 0 || session.values[id] > 100) fail('Valore misura non valido');
    return session;
  }

  // La variazione mostrata è quella effettiva, anche se il limite 0–100 è raggiunto.
  function changeValues(values, effects, stats) {
    validateEffects(effects, new Set(stats.map(s => s.id)));
    const next = Object.assign(Object.create(null), values);
    const changes = [];
    for (const s of stats) {
      const requested = effects[s.id] || 0;
      if (requested === 0) continue;
      const value = clamp(next[s.id] + requested);
      const delta = value - next[s.id];
      next[s.id] = value;
      if (delta !== 0) changes.push({ id: s.id, label: s.label, delta, value });
    }
    return { values: next, changes };
  }

  function select(story, session, choiceId) {
    validateStory(story);
    checkSession(story, session);
    const scene = currentScene(story, session);
    if (session.phase !== 'scene' || scene.type === 'narrative') fail('Non è il momento di scegliere');
    const choice = scene.choices.find(c => c.id === choiceId);
    if (!choice) fail('Scelta inesistente');
    const first = changeValues(session.values, choice.effects || {}, story.stats);
    const second = changeValues(first.values, scene.afterEffects || {}, story.stats);
    const changes = Object.create(null);
    first.changes.concat(second.changes).forEach(c => { changes[c.id] = (changes[c.id] || 0) + c.delta; });
    const actual = story.stats.filter(s => changes[s.id]).map(s => ({ id: s.id, label: s.label, delta: changes[s.id], value: second.values[s.id] }));
    const last = {
      sceneId: scene.id, choiceId: choice.id, label: choice.label,
      feedback: choice.feedback, why: choice.why, canonical: !!scene.canonical,
      changes: actual, afterText: scene.afterText || null
    };
    return {
      version: VERSION, storyId: session.storyId, index: session.index, phase: 'outcome',
      values: second.values, decisions: session.decisions.concat([{ sceneId: scene.id, choiceId: choice.id, changes: actual }]),
      last
    };
  }

  function advance(story, session) {
    validateStory(story);
    checkSession(story, session);
    if (session.phase === 'end') fail('La storia è già conclusa');
    const scene = story.scenes[session.index];
    if (session.phase === 'scene' && scene.type !== 'narrative') fail('Occorre scegliere prima di proseguire');
    const lastScene = session.index === story.scenes.length - 1;
    return {
      version: VERSION, storyId: session.storyId,
      index: lastScene ? session.index : session.index + 1,
      phase: lastScene ? 'end' : 'scene',
      values: Object.assign(Object.create(null), session.values),
      decisions: session.decisions.slice(), last: null
    };
  }

  function recap(story, session) {
    checkSession(story, session);
    const initial = Object.create(null);
    story.stats.forEach(s => { initial[s.id] = s.start; });
    const values = story.stats.map(s => ({ id: s.id, label: s.label, before: initial[s.id], after: session.values[s.id], delta: session.values[s.id] - initial[s.id] }));
    return { storyId: story.id, title: story.title, insight: story.insight || '', values, decisions: session.decisions.map(d => ({ sceneId: d.sceneId, choiceId: d.choiceId, changes: d.changes })) };
  }

  function restore(story, raw) {
    try {
      validateStory(story);
      if (typeof raw === 'string') raw = JSON.parse(raw);
      checkSession(story, raw);
      if (raw.decisions.length > story.scenes.filter(s => s.type !== 'narrative').length) fail('Troppe decisioni');
      // Ricostruisce lo stato dalle decisioni realmente consentite dalla storia.
      // Evita sessioni corrotte, risultati inventati e valori di un vecchio schema.
      let reconstructed = newSession(story);
      let n = 0;
      while (true) {
        if (reconstructed.index === raw.index && reconstructed.phase === raw.phase) break;
        if (reconstructed.phase === 'end') fail('Progressione incoerente');
        const scene = story.scenes[reconstructed.index];
        if (reconstructed.phase === 'scene' && scene.type !== 'narrative') {
          const entry = raw.decisions[n++];
          if (!entry || entry.sceneId !== scene.id) fail('Cronologia incoerente');
          reconstructed = select(story, reconstructed, entry.choiceId);
        } else reconstructed = advance(story, reconstructed);
      }
      if (n !== raw.decisions.length || JSON.stringify(reconstructed.values) !== JSON.stringify(raw.values)) fail('Misure incoerenti');
      return reconstructed;
    } catch (_) { return null; }
  }

  return { VERSION, validateStory, newSession, currentScene, select, advance, recap, restore, clamp };
});
