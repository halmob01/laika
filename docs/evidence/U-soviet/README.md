# Evidenze di U-soviet (II.2 Il soviet: le letture che contano, 5 novembre 2026)

- `bilanciamento.txt`: uscita di `LAIKA_RAPPORTO=1 node --test tests/laika-soviet.test.js`: sciopero, cassa, fiducia, repressione, linea e crisi dei cinque piani ripetuti per le tre giornate (media su quattro semi). Moderati: sciopero 25, repressione 21, trattano col prefetto; radicali: sciopero 83, repressione 67; dare peso a entrambi lascia la linea a 50.
- `03-giorno1-inizio-telefono.png`, `07-giorno2-moderati-telefono.png`, `07-giorno2-radicali-telefono.png`: la sala sul telefono (390x844) con i nove punti su tre file; il secondo giorno, dopo la scelta, «Il prefetto · 2» è aperto per i moderati e «I treni · 2» per i radicali. `soviet-sala.png`: la scena con tavolo, telegrafo e bandiera.
- Percorso sul telefono (script di prova dell'autore): tre giornate giocate con il piano moderato e con il piano radicale; in ogni momento nove etichette, nessuna sovrapposta e nessuna fuori dalla scena; nessun errore in console.
- Test: `tests/laika-soviet.test.js` (5 test, pochi secondi; verificato a mano che il test fallisce se «Trattare» non dipende dalla linea), `tests/unita-ludiche.test.js` (l'unità non ha problemi), `tests/units.test.js`, `tests/p1.test.js`.
- Limiti: `npm run test:browser` completo e WebKit si affidano alla CI. Nessun aneddoto trovato sul soviet del 1905 (MATRICE).
