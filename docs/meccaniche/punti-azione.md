# Scheda di lettura: la giornata a punti azione

Regola del [REPERTORIO](../REPERTORIO-GIOCHI-LAIKA.md) §6: una scheda di lettura prima di costruire una meccanica.

**Meccanica:** la giornata a punti azione (REPERTORIO §3.8).

**Gioco e progetto letto, URL, licenza, file e funzioni lette, data:** X-COM, progetto [OpenXcom](https://github.com/OpenXcom/OpenXcom). **Nessun file è stato letto in questa sessione (3 novembre 2026)**: la rete della sessione ammette solo i registri dei pacchetti e GitHub non è stato interrogato per questo. La regola sotto è scritta dalla conoscenza generale del gioco e va confrontata con i file (per esempio le unità di tempo di un soldato) prima di dichiarare la scheda completa. Licenza del progetto da verificare. Il codice di LAIKA è scritto da zero.

**La regola in parole semplici:** ogni giorno chi gioca ha un numero fisso di punti. Ogni azione costa uno o più punti. Finiti i punti la giornata chiude. Chi non spende un punto non lo conserva per domani.

**I parametri che si possono cambiare:** punti per giornata, costo di ogni azione, azioni ripetibili o una volta sola, probabilità di riuscita (che può dipendere da una metrica), effetti.

**Che cosa rende il gioco interessante (il trucco di design):** i punti sono pochi e le informazioni incomplete. Indagare costa un punto e non cambia il mondo ma cambia quello che si sa: il giocatore paga per vedere. Le informazioni arrivano da due persone che le leggono in modo opposto.

**Uso in LAIKA e atti:** I.4 (le giornate del soviet) e I.6 (il soldato che non spara); poi Atto II (giornate di luglio) e Atto III (Kornilov, la notte del palazzo).

**Contratto dati nel kit (costruito il 3 novembre 2026):** turno di una partita di sole decisioni con `market: { who, text, points, offers }`; ogni offerta ha `cost` (default 1), `repeat`, `chance` con `success` e `failure`, `at: {x, y}` e `short` per il punto sulla scena. Vedi `docs/CREARE-UN-GIOCO.md`.

**Che cosa non si prende:** il combattimento, la mappa tattica, gli asset e i testi del gioco originale.
