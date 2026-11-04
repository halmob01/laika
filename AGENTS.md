# Istruzioni per gli agenti

Repository di un **kit di giochi didattici** (motore riutilizzabile) e del primo corso costruito con esso, **LAIKA**, sulla Rivoluzione russa e l'URSS. Lingua di lavoro: italiano. Non usare emoji nei file.

**Regola di stile per tutti i testi del gioco e della home:** in italiano non si mette la virgola prima di «e», «ed», «o», «od», «né» (niente «virgola di Oxford»). Se la frase senza virgola diventa ambigua o troppo lunga, si spezza in due frasi o si usa il punto e virgola. Il test `tests/laika-virgola.test.js` la controlla.

## Dopo il riordino (4 novembre 2026)

Il riordino di struttura e documenti è finito ([docs/laika/RIORDINO.md](docs/laika/RIORDINO.md)). Il lavoro riparte dall'elenco «Da fare» di [docs/laika/STATO.md](docs/laika/STATO.md), un incarico per PR. Le proposte P-01–P-05 di [DECISIONI](docs/laika/DECISIONI.md) aspettano la risposta del docente: finché non c'è, non si costruisce nulla che ne dipenda.

## Le regole che non si toccano

1. **Il canone e le decisioni non si cambiano.** La struttura del percorso (atti, unità, numeri, titoli, gioco di ogni unità) sta solo in `games/laika/canone.json`; le decisioni del docente stanno solo in `docs/laika/DECISIONI.md`. Un agente non li modifica se il docente non lo ha chiesto in modo esplicito; se una scheda o un gioco non ci stanno, si ferma e scrive una proposta (P-…) in DECISIONI.
2. **Un gioco approvato non si sostituisce con una versione più semplice.** Se non si riesce a costruirlo, la PR dice che cosa manca e l'unità resta «da fare» o «da rifare» nel canone.
3. **Un incarico, un'unità, una PR.** Non si costruisce l'unità successiva prima che il docente abbia provato la precedente.
4. **Le unità si chiamano con il nome stabile** del canone (`citta`, `soviet`), anche negli identificatori del gioco. Il numero (I.3, II.2) si legge dal canone e non si usa come nome.
5. **Niente riquadri «Aggiornamento» sopra testo vecchio.** Quando una cosa cambia si riscrive il testo e la versione vecchia va in `docs/archivio/` con la data.
6. **Ogni PR comincia con «Che cosa cambia nella struttura»**, anche se la risposta è «niente».

## Che cosa leggere

Prima questo file. Poi, secondo il lavoro, al massimo questi:

| Lavoro | Leggi |
|---|---|
| Un'unità o un episodio di LAIKA | la riga dell'unità in [docs/laika/CANONE.md](docs/laika/CANONE.md); la sua scheda in `docs/laika/atti/atto-N.md`; la sua scheda di gioco in `docs/laika/giochi/`; i suoi elementi del kit in [docs/laika/PIANO-KIT.md](docs/laika/PIANO-KIT.md) |
| Un gioco nuovo | [docs/laika/GIOCHI.md](docs/laika/GIOCHI.md); la scheda di gioco (si scrive e si fa approvare prima del codice, D-017) |
| Testi e fatti storici | [docs/laika/fonti/FONTI.md](docs/laika/fonti/FONTI.md); [MATRICE](docs/laika/fonti/MATRICE.md) per registrare i prelievi |
| Scene, disegni, animazioni | [bottega/README.md](bottega/README.md) |
| Home, player, aspetto | [docs/laika/BRAND-DESIGN.md](docs/laika/BRAND-DESIGN.md) |
| Motore e contratto dati | [docs/CREARE-UN-GIOCO.md](docs/CREARE-UN-GIOCO.md), [docs/MOTION.md](docs/MOTION.md) |
| Come si lavora (verifiche, modelli, consegna) | [docs/laika/METODO.md](docs/laika/METODO.md) |
| Il senso del percorso | [docs/laika/PERCORSO.md](docs/laika/PERCORSO.md) |

Mappa completa dei documenti e ordine di autorità: [docs/README.md](docs/README.md). `docs/archivio/` è storia: non vale come istruzione.

Poi: controlla branch e modifiche locali (non resettare lavoro altrui, non fare merge se il docente non l'ha chiesto, mai force-push su `main`) ed esegui `npm test`.

## Dove si lavora

| Cartella | Contenuto | Regola |
|---|---|---|
| `src/` | motore generico | niente nomi, fatti, disegni o colori di un gioco specifico; ogni estensione con test |
| `bottega/` | disegni, figura articolata, formazioni, azioni, compilatore delle scene | neutra: solo token colore, nessun testo storico |
| `games/<gioco>/` | contenuti, schede scena, domande, fonti | LAIKA: si modificano i sorgenti in `source/` e si rigenera `game.json` con `npm run build:laika`; la struttura è in `canone.json` |
| `site/<progetto>/` | home, tema, font, schede scena e `hero.config.json` del hero | il build `npm run build:home -- site/<progetto>` è generico: nessun nome di scena o tema nel suo codice |
| `prototypes/`, `references/` | originali forniti dall'utente; kit della bottega (`prototypes/kit-*`) | gli originali dell'utente **non si modificano**: si creano derivati altrove. I `kit-*` si cambiano solo con la procedura del README della bottega |
| `docs/` | documenti del kit; `docs/laika/` per il corso; `docs/archivio/` per la storia | vedi [docs/README.md](docs/README.md) |

Regola di separazione: il motore (`src/`) e la bottega (`bottega/`) restano riutilizzabili da qualunque progetto. La parte generica di un'esigenza di LAIKA va nel motore o nella bottega (con test), quella specifica nei file del progetto.

## Scene e animazioni: non disegnare a mano

Per illustrare un episodio si scrive una **scheda scena** JSON (`bottega/README.md`): simboli dal catalogo, figure con pose e varianti, azioni (`walk`, `gather`, `speak`, `raise`, `queue`, `confront`, `replace`, `reveal`, `camera`…). Niente tracce di animazione, coordinate di articolazioni o SVG dentro le scene. Controllo con `npm run scena -- percorso/scena.json`; anteprima con `npm run serve` e `/bottega/galleria.html`. Se manca un disegno non si improvvisa: si segnala e si segue `bottega/CONTRATTO-KIT.md`. Si rispetta l'epoca indicata nel catalogo.

## Contenuti storici

Fonte prioritaria: gli appunti «La Rivoluzione Russa» in `references/fonti/` (D-001). Si distinguono fatti documentati, simulazione e ipotesi; non si inventano citazioni, pagine o dati; i prelievi si registrano secondo `docs/laika/fonti/FONTI.md`. Le metriche del gioco sono indici della simulazione. Le note di lavoro («da riscontrare», «bozza») non compaiono mai nei testi per lo studente (D-010).

## Documenti: ogni PR li aggiorna

Una PR non è finita finché i documenti non dicono la verità (D-022). Nella stessa PR:
- una scelta del docente va in `docs/laika/DECISIONI.md` e, se tocca la struttura, in `games/laika/canone.json` (poi `npm run canone`);
- un cambiamento di una scheda d'episodio va nel suo `docs/laika/atti/atto-N.md`; di un gioco, nella sua scheda in `docs/laika/giochi/`; dell'aspetto, in `docs/laika/BRAND-DESIGN.md`;
- una novità del motore o del contratto dati va in `docs/CREARE-UN-GIOCO.md`;
- lo stato (che cosa è in `main`, che cosa manca, con le evidenze) va in `docs/laika/STATO.md`;
- i `README` e la tabella delle cartelle sopra si aggiornano se cambia ciò che descrivono.

Se due documenti si contraddicono si corregge quello che sbaglia rispetto a DECISIONI e canone. La descrizione della PR elenca i documenti toccati.

## Verifiche e consegna

- `npm test` (Node) e, se tocchi visual, bottega o pagine, `npm run test:browser` (Chromium/WebKit; in CI entrambi). A fine unità anche una partita dell'allievo finto (`npm run serve`, poi `npm run allievo`).
- Non dichiarare verificato ciò che non hai eseguito: scrivi comandi, risultati e limiti.
- Una PR per incarico, con descrizione, evidenze e ciò che resta aperto ([METODO](docs/laika/METODO.md) §6).
