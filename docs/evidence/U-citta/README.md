# Evidenze di U-citta (I.3 In città, 5 novembre 2026)

- `bilanciamento.txt`: uscita di `LAIKA_RAPPORTO=1 node --test tests/laika-citta.test.js`: per tre casi (risposte alle richieste, credito del negozio), forze, debito, legami, lettura, numero di crisi e crisi scattate di ciascun piano ripetuto per tutte le otto settimane, con le forze settimana per settimana.
- `trascrizione-allievo-I3.md`: partita completa dell'allievo finto (`npm run allievo`, telefono 390x844, scelte casuali con seme 7) dell'Atto I; tutti i controlli finali «ok».
- `088-salario.png`, `109-salario-esito.png`: il salario (assegnazione e esito di una settimana); `206-confronto-card.png`: la scena del confronto di fine atto.
- Test: `tests/laika-citta.test.js` (6 test, circa 16 secondi), `tests/unita-ludiche.test.js`, `tests/laika-i1.test.js`, `tests/units.test.js`.
- `npm test`: 171 test, 170 passati al primo giro; l'unico fallito era il conteggio degli episodi dell'unità in `tests/units.test.js` (da 7 a 8), corretto.
- Limite: `npm run test:browser` non rieseguito in locale (Chromium locale instabile dopo i riavvii della sessione); si affida alla CI su Chromium e WebKit.
