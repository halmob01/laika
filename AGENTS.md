# Istruzioni per gli agenti

Repository di un **kit di giochi didattici** (motore riutilizzabile) e del primo corso costruito con esso, **LAIKA** sulla Rivoluzione russa. Lingua di lavoro: italiano. Non usare emoji nei file.

**Regola di stile per tutti i testi del gioco e della home:** in italiano non si mette la virgola prima di «e», «ed», «o», «od», «né» (niente «virgola di Oxford»). Se la frase senza virgola diventa ambigua o troppo lunga, si spezza in due frasi o si usa il punto e virgola. Il test `tests/laika-virgola.test.js` la controlla.

## Prima di tutto

1. Leggi questo file e il documento della parte che tocchi:
   - scene, disegni, animazioni → `bottega/README.md`;
   - contenuti, atti, episodi → `docs/PIANO-ATTI-LAIKA.md` (schede degli episodi), `docs/PIANO-LAIKA.md`, `docs/BRIEF-HOME-ATTI.md`, `docs/FONTI-LAIKA.md`;
   - motore e contratto dati → `docs/CREARE-UN-GIOCO.md`, `docs/MOTION.md`;
   - fase corrente, incarichi e modello consigliato → `docs/PIANO-LAIKA.md` §4 e §7, `docs/INCARICHI-LAIKA.md`.
2. Controlla branch e modifiche locali. Non resettare lavoro altrui, non fare merge, non fare force-push su `main`.
3. Esegui `npm test` prima e dopo.

## Dove si lavora

| Cartella | Contenuto | Regola |
|---|---|---|
| `src/` | motore generico | niente nomi, fatti, disegni o colori di un gioco specifico; ogni estensione con test |
| `bottega/` | disegni, figura articolata, formazioni, azioni, compilatore delle scene | neutra: solo token colore, nessun testo storico |
| `games/<gioco>/` | contenuti, schede scena, domande, fonti | LAIKA: si modificano i sorgenti in `source/` e si rigenera `game.json` con `npm run build:laika` |
| `site/<progetto>/` | home, tema, font, schede scena e `hero.config.json` del hero | il build `npm run build:home -- site/<progetto>` è generico: nessun nome di scena o tema nel suo codice |
| `prototypes/`, `references/` | originali forniti dall'utente; kit della bottega (`prototypes/kit-*`) | gli originali dell'utente **non si modificano**: si creano derivati altrove. I `kit-*` si cambiano solo con la procedura del README della bottega (reimportazione e confronto al pixel) |
| `docs/` | piano, decisioni, stato | aggiornare lo stato solo con evidenze |

Regola di separazione: il motore (`src/`) e la bottega (`bottega/`) restano riutilizzabili da qualunque progetto. Se un'esigenza di LAIKA richiede codice nuovo, la parte generica va nel motore o nella bottega (con test) e la parte specifica nei file del progetto. Vedi «Dove sta ogni cosa» in `docs/CREARE-UN-GIOCO.md`.

## Scene e animazioni: non disegnare a mano

Per illustrare un episodio si scrive una **scheda scena** JSON (`bottega/README.md`): si scelgono simboli dal catalogo, si posizionano figure con pose e varianti, si descrivono le azioni (`walk`, `gather`, `speak`, `raise`, `queue`, `confront`, `replace`, `reveal`, `camera`…). Non si scrivono tracce di animazione, coordinate di articolazioni o SVG dentro le scene.

- Controllo: `npm run scena -- percorso/scena.json`. Gli errori indicano scena, sequenza e passo.
- Anteprima: `npm run serve`, poi `http://localhost:4173/bottega/galleria.html` (scheda «Prova una scena»).
- Se manca un disegno: non improvvisarlo. Segnalalo e, se richiesto, segui «Aggiungere disegni» nel README della bottega. Per nuovi kit si usa `bottega/CONTRATTO-KIT.md`.
- Rispetta l'epoca indicata nel catalogo: niente architettura o simboli successivi alla data della scena.

## Contenuti storici

Fonte prioritaria: gli appunti «La Rivoluzione Russa» in `references/fonti/`. Distingui fatti documentati, simulazione e ipotesi; non inventare citazioni, pagine o dati; registra le fonti secondo `docs/FONTI-LAIKA.md`. Le metriche del gioco sono indici della simulazione, non statistiche storiche.

## Verifiche e consegna

- `npm test` (Node) e, se tocchi visual, bottega o pagine, `npm run test:browser` (Chromium/WebKit; in CI entrambi).
- Non dichiarare verificato ciò che non hai eseguito: scrivi comandi, risultati e limiti.
- Una PR per incarico, con descrizione, evidenze (anche screenshot della galleria) e ciò che resta aperto.
