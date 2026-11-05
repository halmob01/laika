# Evidenze di H-testi (la home, 5 novembre 2026)

- Fonte dei testi: `docs/laika/TESTI-HOME.md` (consegnato dal docente il 5 novembre 2026). Differenze applicate a `index.html`: il manifesto («La rivoluzione non è un pranzo di gala. Si confida nella collaborazione dei presenti», senza punto finale come nel file del docente), gli Atti VI, VII e IX, più la frase dell'Atto II aggiornata alla verità («tre sere alle officine Putilov, sei ore fra firme, richieste, padre Gapon e polizia»). Tolti su indicazione del docente: «Edizione didattica» (occhiello), «Sezione storica» (protocollo della testata), «I progressi restano in questo browser» (piede).
- CSS (`site/laika/home.css`): sui telefoni stretti (fino a 420 px) il manifesto è a 32 px e con rientri più piccoli, perché «collaborazione» è più larga delle frasi di prima e causava uno scorrimento orizzontale a 360 px (misurato: 441 px di larghezza contro 360).
- Schermate (`manifesto-telefono.png`, `manifesto-desktop.png`, `fascicoli-*.png`, `piede-*.png`, `testata-*.png`): la home sul telefono (390x844) e su desktop (1440x900).
- Test: `node scripts/browser-solo.cjs home` (nuovo script che esegue solo `tests/browser-home.cjs`): «Home PASS» a 360, 390, 768 e 1440 px, 659 KB per il primo quadro (il budget di 500 KB era già superato: restano 626/659 KB, argomento di U-sito). `npm test`.
- Limiti: WebKit e `npm run test:browser` completo in CI; nessun telefono vero.

## Revisione indipendente (G4)

- Primo e secondo giro (5 novembre 2026): NON PASSA, per documenti rimasti indietro e non per la home (il testo visibile coincide con quello del docente salvo le eccezioni dichiarate; nessuno scorrimento a 360, 390, 768 e 1440 px): `PASSAGGIO.md` elencava U-concessioni fra le cose da fare e diceva che II.3 non legge `tratta_prefetto` (lo legge dal 5 novembre); la stessa frase era in `atto-2.md`, `soviet.md` e `STATO.md`. Cercate e corrette tutte con una ricerca su `docs/laika`.
