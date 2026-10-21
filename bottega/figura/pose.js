// Tabelle della figura articolata. Fonte: studio personaggi.html (POSES, ACTIONS, VARIANTS),
// copiate una volta e diventate dati modificabili. Il test bottega verifica che le voci
// originali restino uguali allo studio; nuove pose si AGGIUNGONO in fondo.
//
// Angoli in gradi, nello stesso sistema dello studio:
//   shL/elL spalla e gomito del braccio dietro, shR/elR del braccio davanti,
//   hipL/knL anca e ginocchio della gamba dietro, hipR/knR della gamba davanti,
//   lean inclinazione del corpo attorno al bacino, yOff abbassamento del corpo.
// Campi facoltativi: prop (oggetto in mano), extras (elementi di scena legati alla posa),
// bodyHint (corpo suggerito dallo studio).

export const POSE = {
  in_piedi:       { label: 'In piedi',        shL: 22, elL: 5,  shR: -22, elR: -5,  hipL: 10, knL: 0,  hipR: -10, knR: 0,  lean: 0,  yOff: 0 },
  cammina_1:      { label: 'Cammina 1',       shL: 35, elL: 15, shR: -30, elR: 20,  hipL: 26, knL: -8, hipR: -24, knR: 18, lean: 5,  yOff: 0 },
  cammina_2:      { label: 'Cammina 2',       shL: -28,elL: 15, shR: 32,  elR: 10,  hipL: -22,knL: 15, hipR: 25,  knR: -5, lean: 5,  yOff: 0, bodyHint: 'donna' },
  corre:          { label: 'Corre',           shL: 55, elL: 45, shR: -55, elR: 50,  hipL: 48, knL: -35,hipR: -45, knR: 45, lean: 18, yOff: 2 },
  braccia_alzate: { label: 'Braccia alzate',  shL: 145,elL: 15, shR: -145,elR: -15, hipL: 12, knL: 0,  hipR: -12, knR: 0,  lean: 0,  yOff: 0 },
  gira:           { label: 'Gira',            shL: 48, elL: 10, shR: -35, elR: -10, hipL: 28, knL: 10, hipR: -18, knR: 25, lean: -4, yOff: 0, bodyHint: 'donna' },
  indica:         { label: 'Indica',          shL: 25, elL: 5,  shR: -82, elR: 0,   hipL: 12, knL: 0,  hipR: -10, knR: 0,  lean: 2,  yOff: 0 },
  saluta:         { label: 'Saluta',          shL: 22, elL: 5,  shR: -135,elR: -15, hipL: 10, knL: 0,  hipR: -10, knR: 0,  lean: 0,  yOff: 0 },
  parla:          { label: 'Parla (gesto)',   shL: 20, elL: 10, shR: -45, elR: -55, hipL: 8,  knL: 0,  hipR: -8,  knR: 0,  lean: 0,  yOff: 0, bodyHint: 'donna' },
  mani_fianchi:   { label: 'Mani fianchi',    shL: 42, elL: -65,shR: -42, elR: 65,  hipL: 14, knL: 0,  hipR: -14, knR: 0,  lean: 0,  yOff: 0 },
  seduto:         { label: 'Seduto',          shL: -15,elL: -45,shR: -25, elR: -50, hipL: -85,knL: 85, hipR: -80, knR: 80, lean: 4,  yOff: 18, extras: ['sgabello'] },
  inginocchiato:  { label: 'Inginocchiato',   shL: -10,elL: -40,shR: -25, elR: -55, hipL: -75,knL: 90, hipR: 25,  knR: 95, lean: 12, yOff: 22 },
  a_terra:        { label: 'A terra',         shL: 15, elL: -25,shR: -110,elR: 40,  hipL: 8,  knL: 0,  hipR: -12, knR: 10, lean: -84,yOff: 44 },
  // Azioni specifiche: stessa struttura, con oggetto associato.
  porta_bandiera: { label: 'Porta bandiera',  shL: 28,  elL: -10, shR: -65, elR: -25, hipL: 20, knL: 0,  hipR: -18, knR: 8,  lean: 6,  yOff: 0, prop: 'bandiera' },
  manifesta:      { label: 'Manifesta',       shL: 148, elL: 15,  shR: -148,elR: -15, hipL: 12, knL: 0,  hipR: -12, knR: 0,  lean: 0,  yOff: 0 },
  lancia:         { label: 'Lancia sasso',    shL: 45,  elL: 15,  shR: -115,elR: -10, hipL: 28, knL: -5, hipR: -28, knR: 18, lean: 14, yOff: 0, prop: 'sasso-lanciato' },
  sbarra:         { label: 'Sbarra bastone',  shL: 25,  elL: -20, shR: -55, elR: -15, hipL: 18, knL: 0,  hipR: -18, knR: 5,  lean: 5,  yOff: 0, prop: 'bastone-lungo' },
  tiene_cartello: { label: 'Tiene cartello',  shL: 145, elL: 20,  shR: -145,elR: -20, hipL: 12, knL: 0,  hipR: -12, knR: 0,  lean: 0,  yOff: 0, prop: 'cartello-alzato' },
  usa_fucile:     { label: 'Usa fucile',      shL: -45, elL: -35, shR: -72, elR: -15, hipL: 16, knL: 0,  hipR: -16, knR: 5,  lean: 6,  yOff: 0, prop: 'fucile-in-mano' },
  spara:          { label: 'Spara',           shL: -50, elL: -35, shR: -78, elR: -10, hipL: 24, knL: 5,  hipR: -24, knR: 12, lean: 12, yOff: 0, prop: 'fucile-sparo' },
  con_megafono:   { label: 'Con megafono',    shL: 20,  elL: 10,  shR: -75, elR: -35, hipL: 14, knL: 0,  hipR: -14, knR: 0,  lean: 2,  yOff: 0, prop: 'megafono-in-mano' },
  costruisce:     { label: 'Costruisce',      shL: -35, elL: -20, shR: 30,  elR: 15,  hipL: 18, knL: 5,  hipR: -18, knR: 5,  lean: 15, yOff: 0, prop: 'mattone-in-mano', extras: ['mattoni-cantiere'] },
  lavora:         { label: 'Lavora martello', shL: 20,  elL: 15,  shR: -95, elR: -25, hipL: 18, knL: 5,  hipR: -16, knR: 5,  lean: 10, yOff: 0, prop: 'martello-in-mano', extras: ['mattoni-officina'] },
  legge:          { label: 'Legge giornale',  shL: -45, elL: -30, shR: -55, elR: -35, hipL: 10, knL: 0,  hipR: -10, knR: 0,  lean: 4,  yOff: 0, prop: 'giornale-in-mano' },
  // Aggiunta 20 ottobre 2026: lavoro dei campi.
  zappa:          { label: 'Zappa',           shL: -30, elL: -35, shR: -50, elR: -20, hipL: 24, knL: 10, hipR: -20, knR: 12, lean: 24, yOff: 2,  prop: 'zappa-in-mano' }
};

// Varianti dello studio: corpo, copricapo, abito, accessorio.
export const VARIANTI = {
  nessuna:        { label: 'Base (uomo)',    body: 'uomo',    hat: null,       coat: null,       acc: null },
  donna:          { label: 'Donna',          body: 'donna',   hat: 'chignon',  coat: 'gonna',    acc: null },
  bambino:        { label: 'Bambino',        body: 'bambino', hat: null,       coat: null,       acc: null },
  cappello:       { label: 'Cappello',       body: 'uomo',    hat: 'fedora',   coat: null,       acc: null },
  cappello_largo: { label: 'Cappello largo', body: 'uomo',    hat: 'largo',    coat: null,       acc: 'bastone' },
  cappotto:       { label: 'Cappotto',       body: 'uomo',    hat: 'fedora',   coat: 'cappotto', acc: null },
  vestito:        { label: 'Vestito',        body: 'donna',   hat: 'chignon',  coat: 'vestito',  acc: null },
  scialle:        { label: 'Scialle',        body: 'donna',   hat: 'chignon',  coat: 'scialle',  acc: null },
  zaino:          { label: 'Zaino',          body: 'uomo',    hat: null,       coat: null,       acc: 'zaino' },
  borsa:          { label: 'Borsa',          body: 'donna',   hat: 'chignon',  coat: 'gonna',    acc: 'borsa' },
  bastone:        { label: 'Bastone',        body: 'uomo',    hat: 'berretto', coat: 'cappotto', acc: 'bastone' },
  mantello:       { label: 'Mantello',       body: 'uomo',    hat: 'fedora',   coat: 'mantello', acc: null },
  clero:          { label: 'Clero',          body: 'uomo',    hat: 'saturno',  coat: 'clero',    acc: null }
};

// Ruoli: colore della figura come scambio di token, più eventuali segni.
export const RUOLI = {
  popolo:       { label: 'Popolo',           recolor: {} },
  protagonista: { label: 'Protagonista',     recolor: { ink: 'red' } },
  esercito:     { label: 'Esercito/polizia', recolor: { ink: 'blue' } },
  partigiano:   { label: 'Partigiano',       recolor: {}, fascia: true }
};

// Corpi: scala relativa dello studio.
export const CORPI = { uomo: 1, donna: 0.94, bambino: 0.72 };
