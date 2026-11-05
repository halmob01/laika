# Evidenze di U-petizione (II.1 La petizione, 5 novembre 2026)

- `bilanciamento.txt`: uscita di `LAIKA_RAPPORTO=1 node --test tests/laika-petizione.test.js`: consenso, fiducia nello zar, polizia, righe economiche, politiche e di pace e crisi di sei piani ripetuti per le tre sere, con due modi di rispondere a chi bussa. «Politica» tre sere: righe politiche 100 ma polizia 77 e arresti; «Economica»: righe economiche 100 e polizia 18; «Tutto»: «Chiede tutto» senza crisi.
- `03-sera1-posti-telefono.png`, `04-esito-sera1-telefono.png`, `17-domenica-telefono.png`: la prima sera sul telefono (390x844) con i sei punti e i loro nomi sulla scena, l'esito della sera e la fine della partita (con il giudizio della petizione); `petizione-putilov.png`, `petizione-domenica.png`: le due scene.
- `trascrizione-allievo-I.md`: partita completa dell'allievo finto (`npm run allievo`, telefono 390x844, scelte casuali con seme 7), passa anche per II.1; tutti i controlli finali «ok».
- Percorso sul telefono (script di prova dell'autore): tre sere giocate; sei etichette per sera, nessuna sovrapposta o fuori scena; nessun errore in console.
- Test: `tests/laika-petizione.test.js` (4 test), `tests/unita-ludiche.test.js` (nessun problema per l'unità), `tests/units.test.js`, `tests/laika-i1.test.js` (otto verifiche).
- Limiti: `npm run test:browser` completo e WebKit si affidano alla CI.

## Revisione indipendente (G4)

- Primo giro (5 novembre 2026): NON PASSA per due documenti: `atto-2.md` aveva ancora la scheda vecchia di II.1-e2 sotto una parentesi (riscritta; la vecchia è in `docs/archivio/ATTO-2-II1-e2-v1-2026-11-05.md`) e il contenuto della petizione non era registrato (ora riga «da riscontrare» in MATRICE e nella scheda). Il revisore ha provato 3000 partite casuali (nessun blocco, probabilità scritte corrette) e 11 mutazioni (10 colte dal test). Sistemate le osservazioni facili: data nello stesso ordine, spiegazione di V8 senza anticipare II.3.
