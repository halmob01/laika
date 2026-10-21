# Stato del kit — aggiornamento P1, 20 ottobre 2026

> **21 ottobre 2026, sera.** Il percorso ha un piano generale in sette atti: [PIANO-ATTI-LAIKA](PIANO-ATTI-LAIKA.md). Le fasi in [PIANO-LAIKA](PIANO-LAIKA.md) §4 sono riallineate: la prossima unità da costruire è I.1 (ex A0.1). Documenti superati in [archivio](archivio/README.md).

> **21 ottobre 2026, separazione.** Build del hero reso generico: `scripts/build-home.js [site/<progetto>]` legge `site/<progetto>/hero.config.json` (scene, tema, uscita); un test impedisce di riscrivere nomi di scene o temi nel suo codice. Tema predefinito della bottega (`componiScene`, `npm run scena`) da `laika` a `neutro`. Documentati i livelli in `docs/CREARE-UN-GIOCO.md` («Dove sta ogni cosa», «Una home per un nuovo progetto») e la regola di separazione in `AGENTS.md`.

> **21 ottobre 2026, hero costruttivista.** Terza revisione dell'utente: illustrazioni confermate senza modifiche; impaginazione in chiave costruttivista-editoriale. Titolo a fasce sfalsate (nera, contorno, rossa), piano rosso in diagonale con la denominazione in verticale lungo il bordo, occhiello d'edizione, disco rosso nel cielo che cambia posto a ogni data, linee di costruzione; data attiva come blocco rosso; circolare su fasce alternate; numeri dei fascicoli in blocchi tagliati. Contratto P1 e id invariati.

> **21 ottobre 2026, home cemento.** Seconda revisione dell'utente: tono ironico solo in etichette, titoli di sezione e claim; testi di lettura in registro storico-divulgativo; piede con fonti e accessibilità eliminato (resta una riga tecnica con il link ai laboratori). Palette grigia (tema `laika-grigio` della bottega, variabili in `site/laika/home.css`), cielo coperto più scuro in alto, circolare su parete di pannelli prefabbricati. Scene del hero rifatte con figure minuscole in luoghi grandiosi: kit `prototypes/kit-luoghi-monumentali/` ridisegnato a mano (tratto d'inchiostro irregolare, campiture fuori registro, motivo `grana-luoghi`, tratteggi) con palazzo imperiale, colonna, grande fabbrica, ponte ad archi in ferro, riva in granito, pianura, casa padronale, chiesa, isbe, betulle, foschia e `luogo-folla` (massa di sagome minuscole per le folle lontane, mossa con `transfer`). Fumo rifatto a scarabocchio di pastello. 1917 ambientato su un ponte della Neva. Posa `zappa` con `zappa-in-mano`; il compilatore unisce i clip identici delle folle. `hero.json` 396 KB non compressi, 69 KB compressi: soglie dei test portate a 450/100 KB (Node) e 700 KB trasferiti senza compressione (browser).

> **20 ottobre 2026, home manifesto.** Home ricomposta dopo la revisione dell'utente: LAIKA come dorso verticale, titolo «Come cambia un mondo?» in Propaganda, scena senza riquadro fino al bordo, linea del tempo come suolo, cuneo e data gigante che cambiano composizione a ogni epoca; stato tecnico spostato nel piede.

> **20 ottobre 2026, bozza home (P3, prima parte).** `index.html` diventa la home LAIKA secondo BRAND-DESIGN: marchio Propaganda (tracciati del prototipo, uso autorizzato dall'utente), Roboto Condensed locale con licenza OFL, tavola di situazione con le date 1861, 1905 e 1917 come schede scena della bottega (`site/laika/scene/`, compilate in `site/laika/hero.json` da `npm run build:home`). Unità A0.1 ancora da fare.

> **20 ottobre 2026, sera.** Piano rivisto dopo la bottega: fasi, stato e modelli consigliati (Claude e GPT) in [PIANO-LAIKA §4 e §7](PIANO-LAIKA.md); P2 ridotta al gate visivo, nuova P2b (test instabile e disegni mancanti), P3 prossima. PR #14 chiusa, PR #16 aperta.

## Aggiornamento bottega — 20 ottobre 2026

Nuova cartella `bottega/`: disegni neutri estratti dagli studi originali eseguendone le funzioni (65 simboli, 2 motivi, 3 parametri di ruvidità), figura articolata a 14 giunture con le tabelle di pose dello studio personaggi, formazioni, ricette di movimento e compilatore della scheda scena. Il motore riceve estensioni generiche: palette a token e ricolorazione per istanza, pose del rig sulle istanze (`rigPose`, `joints`), pose del rig con traslazioni, motivi di riempimento, canale `scaleX` per lo specchio, opacità statica delle istanze, attributi tipografici in elenco chiuso. Nessuna condizione su un gioco specifico. `build:laika` compone le schede elencate in `course.scene` con il tema del corso (oggi nessuna: manifest invariato).

Verifiche locali: 77/77 test Node; suite browser Chromium completa, con il nuovo test `browser-bottega` (103 confronti al pixel con gli originali, 7 scene di esempio, galleria a 390 px, movimento ridotto). Il test preesistente `browser-original-studies` è risultato instabile in locale (confronto screenshot del poster: una esecuzione fallisce, la successiva passa) senza modifiche ai file confrontati. WebKit non disponibile in locale: affidato alla CI. Telefono reale non verificato.

Aggiornamento 21/10/2026: rimosso `browser-original-studies` (instabile, ridondante con `laika-originals.test.js`). Suite Chromium locale completa: exit 0. La home approvata (commit 8d54a78, ce9410e, 69d8a91) era rimasta fuori da `main` perché la PR #19 era stata unita alla revisione precedente; portata in `main` con una nuova PR.

P1 collega home e player (`play.html`), routing legacy, presentazione opzionale, contesto degli episodi e riepilogo dei progressi senza scritture. Aggiunti build deterministico e scheletro LAIKA interno con due atti tecnici: nessun contenuto storico finito. **55/55 test Node e suite locali Chromium/WebKit superati**; limiti, commit, review e immagini in [HANDOFF-P1](archivio/HANDOFF-P1.md). Nessun deploy o merge della PR P1.

## Baseline precedente P0 — 19 ottobre 2026

Base verificata: `main` a **eb6ab8326045add19606e85c1f707ecba6407afa**, dopo i merge #1–#6. Evidenze, comandi e limiti in [P0-BASELINE](archivio/P0-BASELINE.md); storico nel [REPORT-TEST](REPORT-TEST.md).

## Implementato alla baseline P0

- Core puro, atti, ruoli, bivi in avanti, condizioni, effetti differiti, diario, ledger ricostruibile e salvataggi locali versionati con import/export.
- Sei tipi: narrative, choice, resource_allocation, role_crisis, source_comparison, assessment. Verifica formativa separata dagli indicatori di simulazione; nessun voto sulle posizioni politiche.
- Tre giochi registrati: biblioteca, quartiere e messaggio. Quest'ultimo prova tre atti senza metriche, due rami convergenti e quesiti con prerequisiti fra atti.
- SVG persistente, simboli nei pack, istanze con posa e quattro preset; clip/keyframe, gruppi, sfasamento, pivot/skew, camera 2D, ritagli, seek, didascalie e ripetizioni finite. Pausa/ripresa, replay, skip, reload e reduced motion; nessuna libreria runtime aggiunta.
- Limiti correnti letti in `choreography.js` e `stage.js`: **1200 layer, 700 tracce per sequenza, fine entro 30000 ms, 24 iterazioni e 32 keyframe per traccia**. Interpolazione base `stage.duration` distinta, massimo 5000 ms. Non sono budget artistici o prestazioni garantite.
- Motion study separato: 48 figure, 410 layer, 346 tracce, 16 secondi. HTML autonomo generabile con `python3 scripts/build-motion-preview.py`.
- Due prototipi di home; primo kit da 20 simboli; galleria Atto 0 da 14 simboli/quattro scene con renderer reale; cinque figure v2 statiche, non rig di produzione.
- Authoring minimo `create:game`, validazione da config, regressioni e skill didattica fuori dal runtime.
- Archivio delle fonti di lavoro, due TXT estratti dagli appunti, inventario e matrice di lavoro. Fonte didattica prioritaria: «La Rivoluzione Russa».

## Verifiche della baseline P0

[CI del main esatto](https://github.com/halmob01/riv-russa/actions/runs/39294716760): **48/48 test Node** e suite browser completata in Chromium e WebKit/Linux. Copre i tre pack tramite il contratto pubblico; test quantitativi dettagliati su due, salvataggi/restore, focus/tastiera, geometrie, posizioni delle risposte nel DOM, reduced motion, motion study e galleria LAIKA.

Locale P0: tre pack validi, build HTML autonomo e otto test Python della skill riusciti. `npm test` incontra `spawnSync python3 EPERM`; diagnosi senza isolamento: 47/48 pass, un caso bloccato. L'import SVG eseguito direttamente in Python coincide col simbolo runtime, ma non sostituisce il test completo. `npm run test:browser` è bloccato da `listen EPERM` prima del browser: nessuna nuova sessione locale riuscita.

Pacing con video in CI: Chromium mediana 16,7 ms, p95 16,8 ms, zero intervalli >50 ms; WebKit mediana 20 ms, p95 40 ms, 11 intervalli >50 ms. Il test registra queste misure senza imporre una soglia: non sono una certificazione di 60 fps o di long task su telefono. Intervalli RAF e long task sono misure diverse.

## Stato del prodotto e prossimo incarico

P0 consegna documenti riallineati, [inventario asset/font](ASSET-MANIFEST.md), [matrice fonti](FONTI-MATRICE-LAIKA.md) e handoff. **P1 è il prossimo incarico**: routing home/player, presentation/context, lettura pubblica progressi, build deterministico e scheletro LAIKA.

Non esistono ancora homepage integrata, `site/laika/`, `games/laika/`, nuovi contratti presentation/context o otto unità storiche giocabili. Gli studi non sono il corso. Le fonti servono agli agenti anche per frasi, aneddoti e dettagli localizzati; Fitzpatrick è un riferimento da aggiungere.

Aperti: fonti primarie e verifica storica puntuale; marchio Propaganda, font locale/licenza; rig e qualità visiva; misure sulle scene effettive; telefono reale/Safari, screen reader, studenti e durata didattica. P1 può procedere nei propri confini senza dichiarare risolti questi punti.

Il kit non comprende audio, meccaniche autonome di mappe/assemblee, editor visuale, archivio multi-partita o migrazioni universali. Prima di aggiungere atti a un corso distribuito resta la compatibilità append-only dei salvataggi prevista dal piano. Nessun deploy o merge eseguito in P0.
