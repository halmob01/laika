// I.3 «Il salario»: bilanciamento sul motore vero (G3 di METODO §7).
// Regola dichiarata nella scheda (docs/laika/giochi/salario.md): con la stessa mossa ogni settimana non si regge fino in fondo;
// nessuna strategia è la migliore su tutti gli indicatori insieme; strategie diverse portano a esiti diversi; ogni posto serve;
// i rischi hanno probabilità scritta.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newSession, transition} from '../src/runner/index.js';
const game = JSON.parse(fs.readFileSync(new URL('../games/laika/game.json', import.meta.url), 'utf8'));
const ep = game.acts[0].episodes.find(e => e.id === 'a1-citta-salario');
const t = (s, step, extra = {}) => transition(game, s, { type: 'turn', step, ...extra }).nextState;
// Un piano è l'elenco dei posti in ordine di priorità con le monete che si vogliono dare; le monete che avanzano vanno al pane.
const PIANI = {
  fissa: [['pane', 3], ['stanza', 2], ['carbone', 2], ['villaggio', 1]],
  equilibrata: [['stanza', 3], ['pane', 3], ['villaggio', 1]],
  caldo: [['stanza', 3], ['carbone', 3], ['villaggio', 1]],
  casa: [['stanza', 3], ['villaggio', 3], ['pane', 2]],
  studio: [['stanza', 3], ['corso', 2], ['pane', 3]]
};
const NOMI = Object.keys(PIANI);
function gioca(blocchi, politica, credito, seed, perSettimana) {
  let s = newSession(game, seed, ep.id), n = 0;
  const sett = [];
  while (s.currentAct.game.phase !== 'done' && s.currentAct.phase === 'scene' && n++ < 600) {
    const g = s.currentAct.game, turno = g.turn;
    if (g.phase === 'cards') s = t(s, 'card');
    else if (g.phase === 'place') {
      let resto = g.rules.tokens;
      const dati = {};
      for (const [p, k] of PIANI[blocchi[Math.floor(turno / 3)]]) { const x = Math.min(k, resto, ep.places.find(q => q.id === p).max ?? 99); dati[p] = (dati[p] || 0) + x; resto -= x; }
      for (const [p, k] of Object.entries(g.rules.min)) if ((dati[p] || 0) < k && p in dati === false) { /* obbligo non coperto dal piano: resta scoperto */ }
      dati.pane = (dati.pane || 0) + resto;
      for (const [p, k] of Object.entries(dati)) for (let i = 0; i < k; i++) s = t(s, 'place', { placeId: p, delta: 1 });
      s = t(s, 'confirm');
    } else if (g.phase === 'result') {
      const a = s.currentAct;
      sett.push({ forze: a.resources.forze, debito: a.metrics.debito, legami: a.metrics.legami, lettura: a.metrics.lettura, crisi: a.game.fired.length });
      s = t(s, 'continue');
    } else if (g.phase === 'event') { const ch = ep.turns[turno].event.choices; s = t(s, 'choose', { choiceId: ch[Math.min(politica, ch.length - 1)].id }); }
    else if (g.phase === 'eventResult') s = t(s, 'continue');
    else if (g.phase === 'market') {
      if (credito) for (const o of ep.turns[turno].market.offers) { if (o.id.startsWith('pane')) s = t(s, 'buy', { offerId: o.id }); }
      s = t(s, 'leave');
    } else break;
  }
  const a = s.currentAct;
  return { ok: a.phase === 'outcome', forze: a.resources.forze, debito: a.metrics.debito, legami: a.metrics.legami, lettura: a.metrics.lettura, crisi: a.game.fired.length, fired: a.game.fired.join(), sett };
}
const STRATEGIE = [];
for (const a of NOMI) for (const b of NOMI) for (const c of NOMI) STRATEGIE.push([a, b, c]);
const CASI = [{ politica: 0, credito: false }, { politica: 1, credito: false }, { politica: 0, credito: true }];
const risultati = CASI.map(caso => ({ ...caso, r: STRATEGIE.map(st => {
  const out = ['a', 'b'].map(seed => gioca(st, caso.politica, caso.credito, 'sal-' + seed));
  const media = k => out.reduce((n, x) => n + x[k], 0) / out.length;
  return { st, ok: out.every(x => x.ok), forze: media('forze'), debito: media('debito'), legami: media('legami'), lettura: media('lettura'), crisi: media('crisi'), fired: out.map(x => x.fired).join('|'), sett: out[0].sett };
}) }));

if (process.env.LAIKA_RAPPORTO) for (const c of risultati) {
  console.log('Caso', c.politica, c.credito ? 'credito' : 'no credito');
  for (const nome of NOMI) { const x = c.r.find(y => y.st.every(p => p === nome)); console.log('  ' + nome.padEnd(8), [x.forze, x.debito, x.legami, x.lettura, x.crisi].map(v => String(Math.round(v)).padStart(5)).join(''), x.fired, ' forze:', x.sett.map(w => Math.round(w.forze)).join(' ')); }
}
test('Il salario: tutte le strategie arrivano in fondo', () => {
  for (const c of risultati) for (const x of c.r) assert.ok(x.ok, x.st.join('/'));
});
// Ogni ripartizione fissa delle otto monete fra i cinque posti (nei limiti dei posti), ripetuta per tutte le otto settimane.
// Nelle settimane con sette monete si toglie una moneta dal pane (o dal posto più pieno).
function giocaFissa(alloc, politica, seed) {
  let s = newSession(game, seed, ep.id), n = 0;
  while (s.currentAct.game.phase !== 'done' && s.currentAct.phase === 'scene' && n++ < 600) {
    const g = s.currentAct.game;
    if (g.phase === 'cards') s = t(s, 'card');
    else if (g.phase === 'place') {
      const d = { ...alloc }; let extra = Object.values(d).reduce((a, b) => a + b, 0) - g.rules.tokens;
      while (extra-- > 0) { const k = d.pane > 0 ? 'pane' : Object.keys(d).sort((a, b) => d[b] - d[a])[0]; d[k]--; }
      for (const [p, k] of Object.entries(d)) for (let i = 0; i < k; i++) s = t(s, 'place', { placeId: p, delta: 1 });
      s = t(s, 'confirm');
    } else if (g.phase === 'result') s = t(s, 'continue');
    else if (g.phase === 'event') { const ch = ep.turns[g.turn].event.choices; s = t(s, 'choose', { choiceId: ch[Math.min(politica, ch.length - 1)].id }); }
    else if (g.phase === 'eventResult') s = t(s, 'continue');
    else if (g.phase === 'market') s = t(s, 'leave');
    else break;
  }
  return s.currentAct.game.fired.length;
}
test('Il salario: con la stessa mossa ogni settimana non si regge fino in fondo (tutte le ripartizioni fisse)', () => {
  let provate = 0;
  for (let pane = 0; pane <= 8; pane++) for (let stanza = 0; stanza <= 3; stanza++) for (let carbone = 0; carbone <= 8; carbone++) for (let corso = 0; corso <= 2; corso++) {
    const villaggio = 8 - pane - stanza - carbone - corso;
    if (villaggio < 0) continue;
    const alloc = { pane, stanza, carbone, corso, villaggio };
    // La partita più favorevole: si risponde con prudenza alle richieste (seconda scelta), senza credito.
    for (const seed of ['fx-a', 'fx-b']) { provate++; assert.ok(giocaFissa(alloc, 1, seed) > 0, 'la mossa fissa ' + JSON.stringify(alloc) + ' arriva in fondo senza crisi (seme ' + seed + ')'); }
  }
  assert.ok(provate > 500, 'ripartizioni provate: ' + provate);
  // Anche i cinque piani, ripetuti per tutte le otto settimane, in tutti i casi.
  for (const c of risultati) for (const nome of NOMI) {
    const x = c.r.find(y => y.st.every(p => p === nome));
    assert.ok(x.crisi > 0, 'caso ' + JSON.stringify({ p: c.politica, c: c.credito }) + ', ' + nome + ' ogni settimana: nessuna crisi');
  }
});
test('Il salario: cambiando mossa a tempo si arriva in fondo senza crisi, ma ogni scelta ha un prezzo', () => {
  const noCredito = risultati.filter(c => !c.credito && c.politica === 1).flatMap(c => c.r);
  assert.ok(noCredito.some(x => x.crisi === 0), 'esiste una strategia senza crisi');
  const buona = noCredito.find(x => x.crisi === 0 && x.st.join() === 'equilibrata,caldo,equilibrata');
  assert.ok(buona && buona.forze >= 50, 'equilibrata, poi carbone nel freddo, poi di nuovo equilibrata: arriva in fondo con le forze alte');
  for (const id of ['a-letto', 'dormitorio', 'silenzio']) assert.ok(risultati.some(c => c.r.some(x => x.fired.includes(id))), id + ': nessuna strategia la provoca');
  // Chi compra a credito finisce nel dormitorio più spesso di chi non lo fa.
  const dorm = c => c.r.filter(x => x.fired.includes('dormitorio')).length;
  assert.ok(dorm(risultati[2]) > dorm(risultati[0]), 'il credito porta al debito');
});
test('Il salario: nessuna strategia è la migliore su tutti gli indicatori insieme', () => {
  const verso = { forze: 1, debito: -1, legami: 1, lettura: 1 };
  for (const c of risultati) {
    const best = {};
    for (const k of Object.keys(verso)) best[k] = Math.max(...c.r.map(x => x[k] * verso[k]));
    const tutti = c.r.filter(x => Object.keys(verso).every(k => x[k] * verso[k] >= best[k] - 1e-9));
    assert.equal(tutti.length, 0, 'caso ' + JSON.stringify({ p: c.politica, c: c.credito }) + ': strategia ottima su tutto: ' + (tutti[0]?.st || []).join('/'));
  }
});
test('Il salario: strategie diverse portano a esiti diversi', () => {
  for (const c of risultati) {
    const profili = new Set(c.r.map(x => [x.forze, x.debito * 5, x.legami, x.lettura].map(v => Math.round(v / 20)).join(':')));
    assert.ok(profili.size >= 3, 'solo ' + profili.size + ' esiti diversi');
  }
});
test('Il salario: ogni posto serve, i rischi sono scritti prima, gli eventi di pressione ci sono', () => {
  const nelPiano = new Set(Object.values(PIANI).flatMap(p => p.map(x => x[0])));
  for (const p of ep.places) assert.ok(nelPiano.has(p.id), p.id + ': nessun piano la usa');
  assert.equal(ep.tokens, 8);
  assert.equal(ep.rules.min.stanza, 2);
  assert.ok(ep.control.chance.base > 0 && ep.control.chance.base < 1, 'la padrona di casa ha una probabilità scritta');
  assert.ok(ep.luck.length >= 3 && ep.luck.every(l => l.weight > 0), 'gli imprevisti hanno probabilità scritte');
  assert.ok(ep.turns.length >= 8 && ep.shows.length >= 2 && ep.shows.length <= 5);
  // L'affitto sale, il freddo dura, la fabbrica si ferma un giorno: la pressione sta nelle regole delle settimane.
  assert.equal(ep.turns[2].rules.min.stanza, 3, 'l\'affitto sale a tre monete');
  assert.ok(ep.turns.some(x => x.rules?.upkeep?.some(u => u.id === 'forze' && u.delta < 0)), 'c\'è un freddo che dura');
  assert.ok(ep.turns.some(x => x.rules?.tokensDelta < 0), 'c\'è una settimana con meno monete');
  // Il carbone non dà forze fuori dal freddo e nel freddo è un obbligo: non si può sostituire con il pane.
  assert.equal(ep.places.find(p => p.id === 'carbone').perToken[0].delta, 0);
  assert.equal(ep.turns[3].rules.min.carbone, 3, 'nel freddo il carbone è un obbligo');
  assert.ok(ep.turns[3].rules.places.carbone.perToken[0].delta > 0 && ep.turns[6].rules.min.carbone === 0, 'il carbone serve solo nel freddo');
  // La stanza persa non si ripaga: il dormitorio scatta solo dopo l'aumento dell'affitto.
  assert.ok(JSON.stringify(ep.crises.find(c => c.id === 'dormitorio').when).includes('affitto_alzato') && ep.turns[2].effects.some(x => x.id === 'affitto_alzato'));
  assert.ok(ep.turns.some(x => x.event?.choices.some(c => c.chance)), 'c\'è una scelta con probabilità scritta (la multa)');
});
test('Il salario: chi ha perso la stanza non la paga più, nemmeno dopo l\'aumento dell\'affitto', () => {
  let s = newSession(game, 'dorm', ep.id), n = 0, fuori = null;
  while (s.currentAct.game.phase !== 'done' && s.currentAct.phase === 'scene' && n++ < 600) {
    const g = s.currentAct.game;
    if (g.phase === 'cards') s = t(s, 'card');
    else if (g.phase === 'place') { for (let i = 0; i < g.rules.tokens; i++) s = t(s, 'place', { placeId: 'pane', delta: 1 }); s = t(s, 'confirm'); }
    else if (g.phase === 'result') { if (g.fired.includes('dormitorio')) fuori ??= g.turn; s = t(s, 'continue'); }
    else if (g.phase === 'event') s = t(s, 'choose', { choiceId: ep.turns[g.turn].event.choices[0].id });
    else if (g.phase === 'eventResult') s = t(s, 'continue');
    else if (g.phase === 'market') s = t(s, 'leave');
    else break;
  }
  const g = s.currentAct.game;
  assert.ok(g.fired.includes('dormitorio') && fuori >= 2, 'il dormitorio scatta, ma non prima della settimana 3 (turno ' + fuori + ')');
  assert.equal(g.rules.min.stanza, 0, 'dopo il dormitorio la stanza non è più un obbligo');
});
