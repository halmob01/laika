# Evidenze di U-concessioni (II.3 Che cosa concede lo zar, 5 novembre 2026)

- `bilanciamento.txt`: uscita di `LAIKA_RAPPORTO=1 node --test tests/laika-concessioni.test.js`: carta, poteri veri, piazza, reazione dello zar e crisi di cinque piani ripetuti per le tre stagioni, con il soviet che ha trattato o no (media su tre semi). Con la trattativa: «trattare» dà poteri 39 e reazione 33 senza crisi; senza la trattativa «minaccia» dà piazza 93 ma reazione 61 e lo zar scioglie la Duma.
- `04-stagione1-telefono.png`, `08-stagione2-telefono.png`: la sala sul telefono (390x844) con cinque punti su due file; «Il ministro» è chiuso perché il soviet non ha trattato (nel percorso di prova non si passa dal soviet). `concessioni-sala.png`: la scena.
- Percorso sul telefono: `UNIT=concessioni PLAN=chiedere,piazza,duma,sciopero node scripts/percorso-punti-telefono.cjs`: tre stagioni, nessuna etichetta sovrapposta o fuori scena, nessun errore in console.
- Test: `tests/laika-concessioni.test.js` (4 test), `tests/unita-ludiche.test.js` (nessun problema per l'unità), `tests/units.test.js`, `tests/laika-i1.test.js`.
- Limiti: `npm run test:browser` completo e WebKit si affidano alla CI. Un solo aneddoto registrato (Baletta, C36); il granduca Nikolaj non è riscontrato e non si usa (MATRICE).

## Revisione indipendente (G4)

- Primo giro (5 novembre 2026): NON PASSA per un solo difetto: nella prima stagione «Mandare deputati in Duma» era chiuso senza dire perché (ora «(dal 1906)»; il test controlla le tre etichette delle azioni chiuse). Il revisore ha provato 3000 partite casuali (nessun blocco), 11 mutazioni (10 colte) e ha confermato che il granduca Nikolaj non è in nessuna fonte dell'archivio. Sistemate anche la regia della scheda della scena e il test sulla reazione dello sciopero.
