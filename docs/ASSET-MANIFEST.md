# LAIKA — Inventario degli asset e dei font (P0)

> **Aggiornamento 20 ottobre 2026.** I disegni utilizzabili nelle scene sono ora registrati in [bottega/catalogo.json](../bottega/catalogo.json) con stato, epoca d'uso e fonte; questo inventario resta il registro di provenienza dei materiali originali e dei prototipi. I prototipi elencati qui non sono stati modificati.

Baseline: `eb6ab8326045add19606e85c1f707ecba6407afa`, 19 ottobre 2026, dopo i merge #4, #5 e #6. Inventario di authoring, non approvazione artistica o storica. Le quattro tavole WebP sono state aperte e osservate in P0; gli SVG e i cataloghi sono stati esaminati nel sorgente. Nessuna nuova sessione browser locale riuscita: evidenze CI e limiti in [P0-BASELINE](archivio/P0-BASELINE.md).

## Provenienza e licenze comuni

I prototipi e il primo kit provengono dai materiali forniti dall'utente; la galleria Atto 0 include completamenti dell'assistente descritti in [LAIKA-ASSET-DIRECTION](archivio/LAIKA-ASSET-DIRECTION.md). Non è presente una licenza generale degli asset nel repository: la provenienza non prova un diritto di ridistribuzione. Registrare autore/licenza prima della pubblicazione. I percorsi qui sotto sono riferimenti ai sorgenti originali, che vanno conservati; le versioni di produzione nasceranno in `games/laika/assets/` durante P2. In P0 nessun file grafico è stato modificato.

## Tavole e prototipi

| Percorso / anteprima | Ruolo e periodo | Decisione | Provenienza, licenza e dubbio aperto |
|---|---|---|---|
| [01-cronologia-urss.webp](../references/laika/01-cronologia-urss.webp) | Composizioni 1917–1991 | Solo riferimento | Tavola utente, copia WebP; cronologia e monumenti non convalidati |
| [02-vita-quotidiana.webp](../references/laika/02-vita-quotidiana.webp) | Quotidianità, industria e spazio sovietici | Solo riferimento; fuori A0/A1 | Tavola utente; non trasporre abiti/edifici nel 1861–1907 |
| [03-eventi-tragici.webp](../references/laika/03-eventi-tragici.webp) | Rivoluzione, carestia, repressione, guerra, Černobyl' | Riferimento di tono | Tavola utente; uniformi, simboli e datazioni da controllare |
| [04-rivoluzione-tappe.webp](../references/laika/04-rivoluzione-tappe.webp) | Storyboard 1917 e seguito | Riferimento compositivo | Tavola utente; edifici sovietici e immagini simboliche non sono prove storiche |
| JPEG originali delle tavole | Materiali originali | Conservare se recuperati | Non presenti in repo; i documenti li collocano nella conversazione sorgente, non in questa sessione |
| [home originale](../prototypes/laika-home/index.html) | Identità e tre scenari dimostrativi | Conservare, non sostituire il player in P0 | Utente; contorni Propaganda da verificare; CTA dimostrative |
| [home v2](../prototypes/laika-home/index-v2.html) | Direzione delle figure organiche | Adattare in P2/P3 | Utente; non è home di produzione; font e wordmark non pronti per rilascio |
| [primo kit](../prototypes/laika-kit/kit-forme-laika.html) | 20 simboli, 5 scene di epoche diverse | Conservare; selezionare per periodo | Utente; runtime inline semplificato, da non copiare nel motore |
| [galleria Atto 0](../prototypes/laika-kit/index.html) e [dataset](../prototypes/laika-kit/atto0-study.json) | 14 simboli, 4 composizioni | Ricomporre | Frammento utente + completamenti assistente; usa il renderer reale; non è un corso storico |
| [motion lab](../prototypes/motion-lab/index.html) | Regia, 48 figure, scena dimostrativa | Banco tecnico | Studio dell'assistente con geometrie derivate; 410 layer/346 tracce; non validato come evento storico |

## Primo kit: tutti i 20 simboli

Ogni ID della tabella si trova in [kit-forme-laika.html](../prototypes/laika-kit/kit-forme-laika.html), consultabile come catalogo su server HTTP. Licenza: da chiarire per il materiale fornito; le decisioni cronologiche sono filtri d'uso, non autenticazioni dei disegni.

| ID | Ruolo / periodo compatibile da verificare | Decisione e dubbio |
|---|---|---|
| `env-vysotka` | Architettura staliniana | Archiviare per atti successivi; esclusa da A0/A1 |
| `env-panelki` | Quartieri sovietici del dopoguerra | Archiviare; esclusi da A0/A1 |
| `env-diga-cantiere` | Grande cantiere di industrializzazione | Adattare solo con opera/data identificata; non usare come Russia rurale generica |
| `env-cosmodromo` | Corsa allo spazio | Archiviare; escluso da A0/A1 |
| `env-monumento-cosmo` | Monumento dell'era spaziale | Archiviare; escluso da A0/A1 |
| `env-palazzo-inverno` | Facciata imperiale presunta | Verificare edificio e prospettiva o sostituire; facciata generica non documentaria |
| `env-reattore` | Industria nucleare / Černobyl' | Archiviare; escluso da A0/A1 |
| `env-isba-rurale` | Villaggio | Adattare; verificare regione, materiali e scala |
| `obj-gru` | Cantiere | Adattare a tecnologia e data dell'episodio |
| `obj-treno` | Trasporti | Ridisegnare variante imperiale: rimuovere segni sovietici solo dopo verifica del mezzo |
| `obj-tram` | Trasporto urbano | Verificare città, linea ed epoca prima del riuso |
| `obj-cielo-cosmista` | Segno grafico cosmista | Archiviare; eventuale tema esterno ai fatti, non paesaggio ottocentesco |
| `obj-torretta` | Controllo / repressione | Non usare come segno indistinto di qualunque regime; verificare contesto |
| `obj-tribuna` | Assemblea sovietica | Adattare o sostituire per il 1905; non retrodatare iconografia |
| `folla-bandiere` | Folla e stendardi | Sostituire con famiglia organica; verificare bandiere e gesti del corteo |
| `char-contadino` | Figura rurale geometrica | Conservare come confronto tecnico; nuova figura organica P2 |
| `char-operaio` | Figura operaia geometrica | Conservare come confronto; abiti e posa da rifare/verificare |
| `char-cappotto` | Figura in soprabito | Conservare come confronto; adattamento organico P2 |
| `char-alfiere` | Portatore di bandiera | Adattare figura e simbolo a un evento documentato |
| `laika-dog` | Marca LAIKA / riferimento al 1957 | Riuso possibile come marca esterna alla scena; non presenza nel 1861 |

## Studio Atto 0: tutti i 14 simboli

Percorso comune: [atto0-study.json](../prototypes/laika-kit/atto0-study.json), anteprima [galleria](../prototypes/laika-kit/index.html). I primi undici riprendono il frammento utente recuperabile; gli ultimi tre sono completamenti/ricostruzioni dell'assistente. Il frammento non era un HTML completo. Licenza/provenienza finale da registrare anche per i derivati.

| ID | Ruolo / periodo | Decisione e dubbio aperto |
|---|---|---|
| `env-appezzamenti` | Terra, A0 | Riuso/adattamento; confini simbolici, non mappa catastale |
| `char-proprietario` | Proprietà, A0 | Adattare alla famiglia organica; vestiti e rappresentazione sociale |
| `char-funzionario` | Amministrazione, A0 | Adattare; ruolo e uniforme da documentare |
| `char-famiglia-contadina` | Famiglia rurale, A0 | Adattare pose, età, abiti e contatto col suolo |
| `env-assemblea-mir` | Comunità rurale, A0 | Ricomporre; composizione e poteri del mir da verificare |
| `env-fabbrica-800` | Industria ottocentesca, A0.4 | Adattare; regione, tecnologia e rapporto persona/edificio |
| `char-operaio-800` | Lavoro industriale, A0.4 | Adattare; gesto, condizioni e abiti |
| `res-documento` | Documento, A0/A1 | Riuso come icona; non inventare facsimile o decreto |
| `res-monete` | Obblighi/risorse, A0 | Riuso; non attribuire valuta o valori storici all'indice simulato |
| `res-grano` | Sussistenza, A0 | Riuso; distinguere simbolo e dato produttivo |
| `res-attrezzi` | Lavoro agricolo, A0 | Adattare forma a luogo/epoca |
| `char-soldato-zarista` | Apparato militare, futuro Atto II | Conservare; uniforme ricostruita non verificata, non pronta per A1.2 |
| `env-coda-pane` | Crisi del 1917, Atto II | Conservare per seguito; non illustrare con questa scena il 1905 |
| `char-persona-coda` | Civile in attesa, Atto II | Adattare; provenienza ricostruita e abiti da verificare |

Composizioni presenti: `scena-terra`, `scena-mir`, `scena-fabbrica800`, `scena-pane`. Le prime tre richiedono ricomposizione responsive e figure coerenti; l'ultima resta per il 1917. Il conteggio di quattro scene non significa quattro unità didattiche completate.

## Figure SVG e materiali mancanti

| Percorso / anteprima | Ruolo / periodo | Decisione | Provenienza / dubbio |
|---|---|---|---|
| [human-a](../prototypes/laika-kit/figure/human-a.svg), [b](../prototypes/laika-kit/figure/human-b.svg), [c](../prototypes/laika-kit/figure/human-c.svg), [d](../prototypes/laika-kit/figure/human-d.svg), [e](../prototypes/laika-kit/figure/human-e.svg) | Cinque silhouette statiche v2 | Adattare, conservando gli originali | Tracciati della home utente, gruppi/ID aggiunti; non rig articolati; human-b e giunzioni da rivedere |
| `games/motion-study/assets/human-{a,b,c}.svg` | Tre figure animate della prova motion | Banco tecnico; non confondere con le cinque v2 | Seconda prova dell'assistente, sei parti; [provenienza](../games/motion-study/assets/README.md); stile non approvato per produzione |
| [city.svg](../games/motion-study/assets/city.svg), [flag.svg](../games/motion-study/assets/flag.svg) | Città/bandiera dello studio | Adattare solo dopo verifica d'epoca | Geometrie derivate dal prototipo 1917; non prove sul 1905 |
| `madrepatria_tavola_svg_v8.svg` | Riferimento citato nella review motion | Non disponibile nella repo | Nessun esame diretto in P0; non adatto automaticamente al 1905 |
| Famiglia rurale, passaggio villaggio/fabbrica, corteo 1905, assemblea, quadro istituzionale | Nuovi asset A0/A1 | Da creare in P2–P5 | Disegni di produzione assenti; [brief](BRIEF-HOME-ATTI.md) vincolante per scopo e revisioni |

## Font e marchio

| Risorsa | Presenza / licenza osservata | Decisione e azione successiva |
|---|---|---|
| Propaganda, Otto Lerma | File font assente. Il brand registra licenza «Free for Personal Use» nell'archivio dell'autore, non esaminabile qui. Contorni LAIKA incorporati nei due prototipi | Conservare prototipi; verificare incorporamento e ridistribuzione dei contorni prima del rilascio. Fino ad allora wordmark testuale provvisorio come da piano |
| Roboto Condensed | Dichiarato nel CSS; nessun font locale, `@font-face` o licenza allegata | Direzione lettura/UI del piano. Acquisire distribuzione ufficiale e licenza effettiva in P1/P3; non dichiararlo già caricato |
| IBM Plex Sans Condensed | Solo candidata nel vecchio brand, nessun file | Il piano recente sceglie Roboto Condensed: non aggiungere una seconda famiglia per preferenza dell'agente |
| Monospace e fallback di sistema | Stack CSS, nessun file distribuito | Conservare fallback; verificare leggibilità, misure e caricamento del font scelto nella home di produzione |

Gli originali visuali restano consultabili; le immagini raster sono solo materiale di lavoro. Nessun asset/font LAIKA deve entrare nei moduli generici di `src/`.

## Studi originali aggiunti il 20 ottobre 2026

Tre nuovi HTML integrali, forniti dall'utente nella PR #12 e conservati con gli stessi blob Git in [prototypes/laika-studi-originali](../prototypes/laika-studi-originali/README.md). Il [manifest di authoring](../prototypes/laika-studi-originali/manifest.json) registra nomi originali, provenienza, dimensioni, SHA-256 e catalogo: 21 elementi Fase A, 15 edifici/varianti Fase B, studio personaggi con 13 pose, 13 varianti, 11 azioni e 12 oggetti, oltre a folle/ambienti/mezzi.

**DA VERIFICARE, normalizzare, gestire e implementare correttamente a livello tecnico. L'accettazione della PR non certifica l'idoneità alla produzione.** Inventario dettagliato, discrepanze del sorgente e verifiche d'integrazione in [LAIKA-STUDI-SPERIMENTALI](LAIKA-STUDI-SPERIMENTALI.md). Non sono asset runtime già approvati; nessun originale è modificato o importato nel motore.
