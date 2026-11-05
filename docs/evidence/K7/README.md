# Evidenze di K7 (il giudizio dell'anno sa quando una risorsa è arrivata al minimo, 5 novembre 2026)

- Motivo: la revisione indipendente di U-servitu (secondo giro) ha misurato che in circa il 19% degli anni (541 su 2880, 360 partite) la previsione dice «ne mancano N per arrivare al raccolto» e il giudizio dice «Si mangia fino al raccolto»: le crisi del grano scattano una sola volta per partita.
- Codice: `src/core/turns.js` (`noteFloors`, `result.floored`, `verdicts[].floored`, validazione).
- Test: `tests/turns.test.js`, «giudizi: «floored» vale quando…»: il giudizio vale con e senza crisi, un id sbagliato non si valida, e il test fallisce se si toglie la funzione (provato a mano il 5 novembre 2026).
- Documentazione: `docs/CREARE-UN-GIOCO.md`.
- Nessun cambiamento ai giochi: tutti i giochi esistenti restano identici finché non usano `floored`.
