# LAIKA — Consegna P0: baseline, inventari e fonti

19 ottobre 2026. Incarico: P0 di [INCARICHI-LAIKA](../INCARICHI-LAIKA.md). **P0 documentale consegnato con i limiti sotto; nessuna implementazione P1.**

## Base e metodo

Repo `halmob01/riv-russa`, base `main` a **`eb6ab8326045add19606e85c1f707ecba6407afa`**, dopo il merge #6; #4 e #5 già integrate. Branch P0: `docs/p0-baseline-fonti`. Il commit finale documentale è identificato nella PR P0; il commit runtime verificato resta la base, invariata da questa consegna.

Non c'era un checkout precedente nella sessione. Il clone via shell fallisce perché il proxy non è raggiungibile; nessun reset di file o rami altrui. Recuperato l'albero Git completo dal connettore, ricostruiti **89 file testuali** e verificato lo SHA del blob di ciascuno prima delle modifiche. Non è dichiarato un clone Git riuscito. Nessun `AGENTS.md` nell'albero.

Letti README, tutti i documenti di `docs/`, README dei riferimenti/asset, piano e incarichi, configurazione, package, workflow, script/test browser e contratti pertinenti. Letti i riferimenti della skill. Letti entrambi i DOCX con `word/document.xml`: 99 paragrafi negli appunti russi e 30 nella cornice; verificati SHA-256/ZIP e corrispondenza ai TXT, senza alterare gli originali. Tutti i 14 allegati originali corrispondono per dimensioni/SHA Git al manifest nell'albero della base. Non è una lettura integrale dei libri.

Aperte e osservate le quattro tavole WebP; esaminati sorgenti SVG, cataloghi e contratti. JPEG originali e tavola Madrepatria citati nello storico non sono presenti in repo né recuperati qui. Nessuna nuova revisione artistica in browser dichiarata.

## Verifiche sul commit esatto

| Comando / controllo | Ambiente | Esito e limite |
|---|---|---|
| `npm test` | Locale, Node 24.19.0 | Tre pack validati; un file test fallisce nell'avvio di Python: `spawnSync EPERM`. Non tutto verde localmente |
| `node --test --test-isolation=none --test-reporter=tap tests/*.test.js tests/legacy/*.test.cjs` | Locale, diagnosi senza modificare la suite | 48 test: 47 pass, uno bloccato nell'import SVG via subprocess |
| `python3 scripts/svg-to-symbol.py games/motion-study/assets/human-a.svg human-a` | Locale | JSON uguale al simbolo `human-a` del manifest; controllo parziale, non sostituto dell'intero caso bloccato |
| `python3 scripts/build-motion-preview.py` | Locale | Generato `dist/motion-study.html`, non pubblicato |
| `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s .agents/skills/verifiche-didattiche/scripts -p 'test_*.py'` | Locale, Python 3.12.14 | 8/8 pass: verifica dello strumento, non dei contenuti LAIKA |
| `npm run test:browser` | Locale | Bloccato da `listen EPERM` su 127.0.0.1:4173 prima del browser |
| `npm test` e `npm run test:browser` | GitHub Actions sul main esatto | **48/48 Node e suite browser PASS** in entrambi i job Chromium/WebKit; log letti in P0 |
| Limiti motion | Sorgenti choreography/stage | 1200 layer, 700 tracce, 30000 ms, 24 iterazioni, 32 keyframe; interpolazione base `stage.duration` ≤5000 ms |
| Manifest fonti | Albero Git e DOCX locali | 14 originali presenti, dimensioni/SHA Git coerenti; SHA-256/ZIP dei due DOCX verificati in P0 |
| Integrità della patch P0 | Confronto con la base | Solo Markdown; nessun runtime, test, asset, configurazione o dipendenza modificati |

CI: [run 39294716760](https://github.com/halmob01/riv-russa/actions/runs/39294716760), evento push, SHA base esatto. Job `118204126946` Chromium e `118204127411` WebKit, entrambi `completed/success`. Il workflow usa Node 22 e Playwright **1.58.2** dichiarato in package; non esiste lockfile nella base. Le installazioni locali disponibili hanno versioni diverse: non sono state sostituite alla dipendenza del progetto per dichiarare un pass.

Browser: contratto pubblico sui tre giochi, percorsi quantitativi dettagliati sui primi due; focus/tastiera, geometrie, restore, isolamento salvataggi, risposte nel DOM e reduced motion. Galleria: 14 simboli/quattro scene, playback/pausa/skip/reduced motion a 390 e 1280 px. Motion study: seek, pausa, replay, reload, 320/390 px, HTML autonomo e pacing. Queste sono regressioni tecniche delle demo, non accettazione della futura home o del corso storico.

| Pacing con video in CI | Mediana | p95 | Intervalli >50 ms |
|---|---:|---:|---:|
| Chromium | 16,7 ms | 16,8 ms | 0 |
| WebKit | 20 ms | 40 ms | 11 |

Il test registra, non impone queste soglie: non certifica 60 fps. Gli intervalli RAF non misurano direttamente i long task. Linux/WebKit non equivale a Safari su telefono. Il dato WebKit richiede nuova misura sulla scena effettiva in P2/P6, non una modifica del motore in P0.

## Decisioni e conflitti risolti

| Punto | Correzione documentale |
|---|---|
| 36 test e limiti motion precedenti | Stato corrente distinto dallo storico: 48 Node in CI, limiti verificati nel codice |
| PR #4/#5 descritte come ancora da unire | Merge effettuati; le vecchie formule conservano il loro contesto storico |
| Palette Canva bordeaux/giallo | Antecedente conservato; corrente crema/rosso/nero/azzurro secondo piano e brand recenti |
| Font alternativi | Roboto Condensed previsto, file/licenza assenti; IBM Plex era candidata, non seconda famiglia autorizzata |
| Fonti ridotte a bibliografia | Uso per frasi, aneddoti, dati e dettagli; scheda con localizzazione e contesto |
| Sheila Fitzpatrick | Da aggiungere; conoscenze pregresse utili per ricerca/confronti, attribuzioni precise da riscontrare; nessun testo dichiarato acquisito |
| P0 confuso con prodotto | Home/player e pack storico ancora da implementare in P1 e fasi successive |

## Deliverable e handoff

- [ASSET-MANIFEST](../ASSET-MANIFEST.md): tavole, prototipi, tutti i 20 simboli del primo kit e i 14 dell'Atto 0, composizioni, figure, font e materiali mancanti, con periodo/uso/decisione/provenienza e dubbi.
- [FONTI-LAIKA](../FONTI-LAIKA.md) e [matrice](../FONTI-MATRICE-LAIKA.md): priorità degli appunti, uso concreto, Fitzpatrick, 24 controlli localizzati e scheda di prelievo. Nessuna rettifica storica conclusa o citazione libraria inventata.
- Stato, report, motion, progetto, brand e direzione asset riallineati; piano/brief/incarichi/indici collegati alla baseline. Conservato lo storico delle verifiche precedenti.

**Preview e prove visive:** nessuna nuova preview pubblicata o video locale. Cataloghi e motion lab si aprono dalla repo con `npm run serve`. Gli artifact della run CI conservano immagini/video della base, non nuove prove artistiche P0: non sono stati scaricati e giudicati come approvazione visiva in questa sessione.

**Fonti e licenze da chiarire:** Fitzpatrick e fonti primarie da acquisire/localizzare; Miéville solo scheda HOEPLI; edizione Losurdo e completezza/attribuzione trascrizione da verificare. Diritti dei contorni Propaganda e distribuzione locale/licenza di Roboto Condensed aperti; provenienza/licenze asset da completare prima del rilascio.

**Non verificato:** telefono reale/Safari, screen reader, studenti, tempi didattici, nuova home, rig/scene di produzione e verifica storica puntuale. Nessun deploy o merge eseguito.

**Prossimo incarico:** P1 di [INCARICHI-LAIKA](../INCARICHI-LAIKA.md), dalla base aggiornata dopo la review/integrazione di P0: routing, presentation/context, API riepilogo progressi, build deterministico e scheletro LAIKA. Fonti/font aperti non bloccano la scaffolding tecnica, ma non vanno mascherati con contenuti/marchio dichiarati definitivi. Nessun avvio automatico di P2–P7.
