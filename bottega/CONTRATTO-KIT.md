# Contratto per un nuovo kit grafico

Testo da allegare quando si chiede a un modello (o a un collaboratore) un nuovo kit di disegni per la bottega: edifici, mezzi, oggetti, ambienti, elementi atmosferici. Un kit che lo rispetta si importa senza modifiche con `npm run bottega:importa` e viene verificato al pixel. Per le **persone** non si fa un kit nuovo: si estende la figura articolata esistente (pose, varianti, oggetti in mano; vedi `bottega/README.md`).

Copiare da qui in giù.

---

**Vincoli tecnici: il kit deve essere integrabile in un motore di animazione esistente.**

Consegna un unico file HTML autonomo (CSS e JavaScript inline, nessuna risorsa esterna) con un'interfaccia di anteprima e, in uno `<script>`, le funzioni di disegno descritte sotto. Lo stile è quello degli studi LAIKA: forme piene e semplificate, inchiostro quasi nero, rosso usato con parsimonia, azzurri per edifici e mezzi, nessun effetto 3D realistico, nessuna sfumatura.

1. **Palette in una costante.** All'inizio dello script `const C = { bg: '#f6f1e3', ink: '#161614', red: '#e02a1b', … };`, con i colori tra apici singoli e a sei cifre. Nei disegni i colori si scrivono **solo** come `${C.nome}`, mai come codici esadecimali. Ogni chiave viene tradotta in un token del progetto (`paper`, `ink`, `red`, `blue`, `sand`, `concrete-light`, `concrete-mid`, `concrete-dark`, `sky`, `tree`): usa questi significati.
2. **Catalogo in una costante.** `const ITEMS = [{ id: 'nome_voce', label: 'Nome leggibile' }, …];` con id in minuscolo e underscore.
3. **Una funzione di disegno pura per famiglia**, per esempio `function drawItem(id, ox = 0, oy = 0) { … return markup; }`: riceve parametri, **restituisce una stringa SVG** e non tocca il DOM. Niente `innerHTML`, `document`, `requestAnimationFrame`, `Math.random` o variabili globali modificate dentro queste funzioni. L'anteprima della pagina usa queste funzioni, ma resta separata.
4. **Elementi ammessi**: `g`, `path`, `rect`, `circle`, `ellipse`, `line`, `polygon`, `polyline`, `text` (solo se il testo fa parte dell'oggetto, con `font-family` `monospace`, `sans-serif` o `serif`). **Non ammessi**: `image`, `use`, `symbol`, `mask`, `clipPath`, `foreignObject`, gradienti, CSS, classi, `style`, `tspan`.
5. **Attributi ammessi**: geometria (`x`, `y`, `width`, `height`, `cx`, `cy`, `r`, `rx`, `ry`, `x1`…`y2`, `d`, `points`), `fill`, `stroke`, `stroke-width`, `stroke-linecap`, `stroke-linejoin`, `opacity`, `transform` con soli `translate(x y)`, `scale(s)` uniforme, `rotate(a)` o `rotate(a cx cy)`, più gli attributi di testo `font-size`, `font-weight`, `text-anchor`, `letter-spacing`. Tracciati con comandi **assoluti** (M, L, C, Q, A, H, V, Z, maiuscoli).
6. **Nessuno sfondo e nessuna didascalia nei disegni**: ogni pezzo è trasparente. Titoli e cornici stanno solo nell'anteprima.
7. **Appoggio a terra**: tutti i pezzi di una famiglia poggiano su una stessa linea orizzontale dichiarata (per esempio `const GROUND_Y = 150;`), centrati orizzontalmente sul punto di disegno. Gli oggetti sospesi (lampioni, insegne) poggiano sul loro sostegno.
8. **Parti animabili**: le parti che dovranno muoversi (ruote, telo di una bandiera, fumo, braccio di una gru, sportelli) sono un elemento o un `g` con `id` semantico in minuscolo e trattini (`ruota-1`, `telo`, `fumo`), unico nel pezzo, e con il perno `data-pivot="x y"` nelle coordinate del pezzo. Non animarle nel kit con funzioni del tempo: il movimento lo aggiunge il motore.
9. **Motivi e ruvidità (facoltativi)**: al massimo un `<pattern>` per la grana (piccoli segni, `patternUnits="userSpaceOnUse"`) e un filtro ruvido composto soltanto da `feTurbulence` + `feDisplacementMap`, restituiti da una funzione `getDefs()`. Nei disegni il motivo si usa con `fill="url(#id-del-motivo)"`; il filtro non si applica dentro le funzioni di disegno.
10. **Avvio separato**: le chiamate che avviano l'anteprima (costruzione dell'interfaccia, primo disegno, ciclo di animazione) stanno in fondo allo script, dopo una riga che contiene esattamente `// AVVIO`. Tutto ciò che precede deve poter essere eseguito senza browser.
11. **Deterministico**: stessa chiamata, stesso markup. Se serve variazione, un parametro `seed`.
12. **Coerenza storica**: per ogni voce indica in un commento epoca e luogo a cui il disegno si riferisce e se è un archetipo generico. Evita insegne, bandiere e uniformi inventate.

---

## Dopo la consegna (per chi integra)

Seguire «Aggiungere disegni → Una famiglia nuova» in `bottega/README.md`: salvare l'HTML intatto in `prototypes/<nome-kit>/`, aggiungere la voce `KIT` nell'importatore, importare, registrare nel catalogo, eseguire `npm test` e `npm run test:browser`.
