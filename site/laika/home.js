import {composePack} from '../../src/visual/compose.js';
import {createStage} from '../../src/visual/stage.js';
import {validateRegistry} from '../../src/shell/registry.js';
import {validatePack} from '../../src/validation/game-pack.js';
import {readProgress} from '../../src/storage/index.js';

const $ = id => document.getElementById(id);
const media = matchMedia('(prefers-reduced-motion: reduce)');

// Hero: tre schede scena della bottega, compilate da scripts/build-home.js.
async function avviaTavola() {
  const host = $('scena'), bottoni = [...document.querySelectorAll('.data')];
  const pack = composePack(await (await fetch('./site/laika/hero.json')).json());
  const stages = new Map(pack.stages.map(s => [s.id, s]));
  let fermato = false, visibile = true, attuale = null;
  const stage = createStage(host, { reducedMotion: media.matches || fermato });

  function mostra(id, { anima = true } = {}) {
    const st = stages.get(id); if (!st) return;
    attuale = id;
    host.setAttribute('aria-label', st.label);
    stage.mount(st, {}, { intro: anima && !media.matches && !fermato });
    if (!visibile && stage.active) stage.pause();
    const intro = st.sequences?.find(s => s.id === st.introSequence);
    $('didascalia').textContent = intro?.caption || st.label;
  }

  function scegli(bottone) {
    if (bottone.getAttribute('aria-pressed') === 'true') return;
    const prima = bottoni.find(b => b.getAttribute('aria-pressed') === 'true');
    for (const b of bottoni) { b.setAttribute('aria-pressed', String(b === bottone)); b.classList.remove('rettificata', 'protocollata'); }
    if (prima && !media.matches) { void prima.offsetWidth; prima.classList.add('rettificata'); bottone.classList.add('protocollata'); }
    $('luogo').textContent = bottone.dataset.luogo;
    $('hero').dataset.epoca = bottone.dataset.epoca;
    const anno = $('anno'); anno.classList.remove('cambio'); anno.firstElementChild.textContent = bottone.querySelector('.cifra').textContent;
    if (!media.matches) { void anno.offsetWidth; anno.classList.add('cambio'); }
    mostra(bottone.dataset.scena);
  }

  bottoni.forEach((b, i) => {
    b.addEventListener('click', () => scegli(b));
    b.addEventListener('keydown', e => {
      const passo = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!passo) return;
      e.preventDefault(); const altro = bottoni[(i + passo + bottoni.length) % bottoni.length]; altro.focus(); scegli(altro);
    });
  });

  $('pausa').addEventListener('click', () => {
    fermato = !fermato;
    $('pausa').setAttribute('aria-pressed', String(fermato));
    $('pausa').textContent = fermato ? 'Riprendi il movimento' : 'Ferma il movimento';
    stage.setReducedMotion(media.matches || fermato);
  });
  $('rivedi').addEventListener('click', () => { if (attuale) mostra(attuale); });
  media.addEventListener?.('change', () => stage.setReducedMotion(media.matches || fermato));

  // Nessun lavoro fuori schermo o a pagina nascosta.
  const aggiorna = () => {
    const attivo = visibile && !document.hidden;
    if (!attivo && stage.active) stage.pause();
    else if (attivo && stage.paused) stage.resume();
  };
  new IntersectionObserver(([e]) => { visibile = e.isIntersecting; aggiorna(); }, { threshold: 0.15 }).observe(host);
  document.addEventListener('visibilitychange', aggiorna);

  mostra(bottoni.find(b => b.getAttribute('aria-pressed') === 'true').dataset.scena);
}

// Stato del percorso: sola lettura, nessuna scrittura visitando la home.
async function leggiProgressi() {
  const config = validateRegistry(await (await fetch('./config.json')).json());
  const item = config.games.find(g => g.id === 'laika'); if (!item) return;
  const game = validatePack(await (await fetch(item.manifest)).json());
  let storage; try { storage = window.localStorage; } catch {}
  const p = readProgress(game, storage), testo = $('progress');
  const messaggi = {
    new: 'Nessuna pratica aperta a tuo nome.',
    complete: 'Pratica completata e archiviata.',
    incompatible: 'Il percorso è stato aggiornato: il progresso salvato non è più utilizzabile. Aprendo il percorso potrai ricominciare.'
  };
  testo.textContent = messaggi[p.status] || 'Pratica aperta: ' + p.actTitle + ', «' + p.episodeTitle + '».';
  const riprendi = p.status === 'resumable';
  $('resume').hidden = !riprendi; $('inizia').hidden = riprendi;
}

avviaTavola().catch(() => { $('didascalia').textContent = 'La scena non si è caricata. Il resto della pagina funziona normalmente.'; });
const dopo = window.requestIdleCallback || (f => setTimeout(f, 300));
dopo(() => leggiProgressi().catch(() => {}));
