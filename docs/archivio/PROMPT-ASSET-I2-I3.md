# Prompt per costruire gli asset di I.2 e I.3

Versione 1 · 30 ottobre 2026 · da usare con un agente (o un modello) che **non** legge la repository.

Sono **quattro** prompt, ciascuno breve abbastanza da non bloccare l'agente (modifica del 30 ottobre 2026: prima erano due, troppo lunghi). Ogni prompt qui sotto è autonomo: contiene il contesto, la palette, le regole tecniche del contratto dei kit e l'elenco dei pezzi. Si incolla per intero in una conversazione nuova. Il modello risponde con **un file HTML** per prompt (quattro kit). Il file si salva senza modificarlo in `prototypes/<nome-kit>/` e lo integra chi lavora sulla repository, con la procedura «Una famiglia nuova» di [bottega/README.md](../bottega/README.md).

Ai disegni non si dà nessuna autonomia storica: il modello propone, il docente controlla. I quattro prompt possono essere chiesti in parallelo.

Voci da riscontrare dal docente dopo la consegna: l'aspetto dell'assemblea del mir (all'aperto, davanti all'isba di chi presiede **[da riscontrare]**), il disegno della cella, il foglio con il razzo (ricostruzione, non copia del progetto di Kibalčič).

## Prompt 1 — Villaggio 1: piazzale, isba, pozzo

~~~~
Contesto. Stai disegnando un kit di illustrazioni vettoriali per un videogioco didattico italiano sulla Rivoluzione russa (progetto LAIKA). Non hai accesso al codice del progetto: tutto ciò che serve è in questo messaggio. Il kit sarà importato da un motore che ridisegna ogni pezzo e lo confronta al pixel con il tuo originale, quindi le regole tecniche qui sotto sono vincolanti, non consigli.

Stile. Forme piene e semplificate, contorno a inchiostro quasi nero, rosso usato con parsimonia (un solo accento per scena), azzurri e grigi freddi per costruzioni e mezzi, sabbia per legno e terra. Nessun 3D realistico, nessuna sfumatura. Tratto leggermente irregolare, come disegnato a mano, ma deterministico. Nessuna persona nel kit: le figure umane le aggiunge il motore sopra i tuoi disegni. Nessun testo leggibile, nessuna insegna, bandiera, stemma o scritta cirillica inventata.

Palette: usa ESATTAMENTE questa costante, con questi valori e questi nomi di chiave, e nei disegni scrivi i colori solo come `${C.nome}`:

const C = {
  bg: '#f6f1e3', p2: '#ece5d3', ink: '#161614', red: '#e02a1b', sand: '#decba8',
  cLight: '#c9d6df', cMid: '#8ea8b8', cDark: '#4f6b7c', sky: '#b8cbd8', tree: '#97b0c0'
};

Il pezzo con `GROUND_Y = 400` e centrato in x = 0 è la convenzione del kit; l'anteprima mostra ogni pezzo in `viewBox="-640 0 1280 420"`. Gli ambienti-sfondo riempiono quella larghezza (da -620 a +620) e tengono libera una fascia di terreno davanti (da y = 330 a 400) dove il motore posiziona fino a dieci figure alte circa 70 unità. Gli oggetti isolati sono più piccoli e ognuno dichiara la propria larghezza nel catalogo (`width`).

Consegna: un solo file HTML autonomo. In cima un commento con titolo, autore «modello», data e la dichiarazione «Rispetta CONTRATTO-KIT». Per ogni voce un commento con epoca, luogo e se è un archetipo generico. Prima di consegnare verifica da solo: nessun colore esadecimale dentro le funzioni di disegno; nessun elemento o attributo fuori dall'elenco; tutte le funzioni di disegno eseguibili con Node senza browser (puoi provarlo copiando lo script prima della riga `// AVVIO`); stessa chiamata, stesso markup; ogni parte animabile con id e `data-pivot`.

Il contratto tecnico completo segue.

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
COMPITO: kit «Villaggio e assemblea del mir» (nome del file: kit-villaggio-mir-1.html)

Epoca e luogo: villaggio contadino della Russia europea centrale, 1861–1904 (dopo l'emancipazione dei servi). Edifici di legno, tetti di paglia o di assicelle, nessuna elettricità, nessuna architettura posteriore al 1904. Il mir è l'assemblea del villaggio: i capifamiglia si riuniscono all'aperto davanti alla casa di chi presiede e decidono, per esempio, come dividere le strisce di terra. Serve uno sfondo dove otto o dieci figure possano stare in cerchio, e gli oggetti che raccontano le decisioni.

Costante GROUND_Y = 400. Voci del catalogo (id e larghezza):

1. `mir_piazzale` (sfondo, 1240): una piazza di terra battuta tra le isbe. A sinistra e a destra due o tre isbe di legno con camino; sullo sfondo, lontano, il campanile di una piccola chiesa di legno con cupola a cipolla sopra una linea di campi; un recinto di pali; due o tre betulle. Il centro è vuoto. Parti animabili: `fumo-1`, `fumo-2` (sbuffi dal camino, pivot alla base), `betulla-1` (chioma).
2. `mir_isba_presidente` (260): isba più grande delle altre con una piccola scala di legno davanti (il portico, dove sta chi presiede), finestre incorniciate, un panchetto. Parte animabile `porta` con `data-pivot`.
3. `mir_pozzo` (110): pozzo a bilanciere con secchio. Parte animabile `bilanciere` (pivot sul perno) e `secchio`.

Questo è il primo di due kit dello stesso villaggio: consegna solo i pezzi elencati e usa lo stesso stile degli altri.
Attenzioni storiche: archetipo generico; niente icone o scritte inventate sulle isbe; un solo accento rosso per pezzo (per esempio le tende di una finestra).

~~~~

## Prompt 2 — Villaggio 2: strisce, registro, covone

~~~~
Contesto. Stai disegnando un kit di illustrazioni vettoriali per un videogioco didattico italiano sulla Rivoluzione russa (progetto LAIKA). Non hai accesso al codice del progetto: tutto ciò che serve è in questo messaggio. Il kit sarà importato da un motore che ridisegna ogni pezzo e lo confronta al pixel con il tuo originale, quindi le regole tecniche qui sotto sono vincolanti, non consigli.

Stile. Forme piene e semplificate, contorno a inchiostro quasi nero, rosso usato con parsimonia (un solo accento per scena), azzurri e grigi freddi per costruzioni e mezzi, sabbia per legno e terra. Nessun 3D realistico, nessuna sfumatura. Tratto leggermente irregolare, come disegnato a mano, ma deterministico. Nessuna persona nel kit: le figure umane le aggiunge il motore sopra i tuoi disegni. Nessun testo leggibile, nessuna insegna, bandiera, stemma o scritta cirillica inventata.

Palette: usa ESATTAMENTE questa costante, con questi valori e questi nomi di chiave, e nei disegni scrivi i colori solo come `${C.nome}`:

const C = {
  bg: '#f6f1e3', p2: '#ece5d3', ink: '#161614', red: '#e02a1b', sand: '#decba8',
  cLight: '#c9d6df', cMid: '#8ea8b8', cDark: '#4f6b7c', sky: '#b8cbd8', tree: '#97b0c0'
};

Il pezzo con `GROUND_Y = 400` e centrato in x = 0 è la convenzione del kit; l'anteprima mostra ogni pezzo in `viewBox="-640 0 1280 420"`. Gli ambienti-sfondo riempiono quella larghezza (da -620 a +620) e tengono libera una fascia di terreno davanti (da y = 330 a 400) dove il motore posiziona fino a dieci figure alte circa 70 unità. Gli oggetti isolati sono più piccoli e ognuno dichiara la propria larghezza nel catalogo (`width`).

Consegna: un solo file HTML autonomo. In cima un commento con titolo, autore «modello», data e la dichiarazione «Rispetta CONTRATTO-KIT». Per ogni voce un commento con epoca, luogo e se è un archetipo generico. Prima di consegnare verifica da solo: nessun colore esadecimale dentro le funzioni di disegno; nessun elemento o attributo fuori dall'elenco; tutte le funzioni di disegno eseguibili con Node senza browser (puoi provarlo copiando lo script prima della riga `// AVVIO`); stessa chiamata, stesso markup; ogni parte animabile con id e `data-pivot`.

Il contratto tecnico completo segue.

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
COMPITO: kit «Villaggio e assemblea del mir» (nome del file: kit-villaggio-mir-2.html)

Epoca e luogo: villaggio contadino della Russia europea centrale, 1861–1904 (dopo l'emancipazione dei servi). Edifici di legno, tetti di paglia o di assicelle, nessuna elettricità, nessuna architettura posteriore al 1904. Il mir è l'assemblea del villaggio: i capifamiglia si riuniscono all'aperto davanti alla casa di chi presiede e decidono, per esempio, come dividere le strisce di terra. Serve uno sfondo dove otto o dieci figure possano stare in cerchio, e gli oggetti che raccontano le decisioni.

Costante GROUND_Y = 400. Voci del catalogo (id e larghezza):

1. `mir_strisce_prima` (520): campo visto obliquamente, diviso in sette strisce lunghe e strette di larghezze diverse, separate da paletti di legno e solchi; una striscia più larga e più curata (solchi dritti) e una molto stretta. Nessuna figura.
2. `mir_strisce_dopo` (520): lo stesso campo, con le strisce ridisegnate: i paletti spostati, le larghezze più simili. Stessa inquadratura di `mir_strisce_prima` perché il motore passa dall'una all'altra.
3. `mir_registro` (90): un tavolino con un grosso registro aperto, una cassetta di ferro con serratura e un pugno di monete; è l'oggetto che rappresenta i pagamenti dovuti dal villaggio. Nessuna scritta leggibile (righe stilizzate).
4. `mir_covone` (70): un covone legato, per le scene di raccolto.

Questo è il secondo di due kit dello stesso villaggio: consegna solo i pezzi elencati. Le strisce 4 e 5 devono avere la stessa inquadratura.
Attenzioni storiche: archetipo generico; niente icone o scritte inventate sulle isbe; un solo accento rosso per pezzo (per esempio le tende di una finestra).

~~~~

## Prompt 3 — Città 1: angolo di stanza, dormitorio

~~~~
Contesto. Stai disegnando un kit di illustrazioni vettoriali per un videogioco didattico italiano sulla Rivoluzione russa (progetto LAIKA). Non hai accesso al codice del progetto: tutto ciò che serve è in questo messaggio. Il kit sarà importato da un motore che ridisegna ogni pezzo e lo confronta al pixel con il tuo originale, quindi le regole tecniche qui sotto sono vincolanti, non consigli.

Stile. Forme piene e semplificate, contorno a inchiostro quasi nero, rosso usato con parsimonia (un solo accento per scena), azzurri e grigi freddi per costruzioni e mezzi, sabbia per legno e terra. Nessun 3D realistico, nessuna sfumatura. Tratto leggermente irregolare, come disegnato a mano, ma deterministico. Nessuna persona nel kit: le figure umane le aggiunge il motore sopra i tuoi disegni. Nessun testo leggibile, nessuna insegna, bandiera, stemma o scritta cirillica inventata.

Palette: usa ESATTAMENTE questa costante, con questi valori e questi nomi di chiave, e nei disegni scrivi i colori solo come `${C.nome}`:

const C = {
  bg: '#f6f1e3', p2: '#ece5d3', ink: '#161614', red: '#e02a1b', sand: '#decba8',
  cLight: '#c9d6df', cMid: '#8ea8b8', cDark: '#4f6b7c', sky: '#b8cbd8', tree: '#97b0c0'
};

Il pezzo con `GROUND_Y = 400` e centrato in x = 0 è la convenzione del kit; l'anteprima mostra ogni pezzo in `viewBox="-640 0 1280 420"`. Gli ambienti-sfondo riempiono quella larghezza (da -620 a +620) e tengono libera una fascia di terreno davanti (da y = 330 a 400) dove il motore posiziona fino a dieci figure alte circa 70 unità. Gli oggetti isolati sono più piccoli e ognuno dichiara la propria larghezza nel catalogo (`width`).

Consegna: un solo file HTML autonomo. In cima un commento con titolo, autore «modello», data e la dichiarazione «Rispetta CONTRATTO-KIT». Per ogni voce un commento con epoca, luogo e se è un archetipo generico. Prima di consegnare verifica da solo: nessun colore esadecimale dentro le funzioni di disegno; nessun elemento o attributo fuori dall'elenco; tutte le funzioni di disegno eseguibili con Node senza browser (puoi provarlo copiando lo script prima della riga `// AVVIO`); stessa chiamata, stesso markup; ogni parte animabile con id e `data-pivot`.

Il contratto tecnico completo segue.

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
COMPITO: kit «Interni di città e cella» (nome del file: kit-interni-citta-1.html)

Epoca e luogo: città industriale della Russia (Pietroburgo e dintorni), 1881–1904. Illuminazione a lampada a petrolio o a candela, stufe a legna o a carbone, nessuna elettricità in casa operaia, nessun oggetto posteriore al 1904. Gli interni si vedono in sezione frontale, come la scena di un teatro: parete di fondo, pavimento, un lato aperto verso chi guarda.

Costante GROUND_Y = 400. Voci del catalogo (id e larghezza; gli ambienti-sfondo 1240):

1. `citta_angolo_stanza` (1240): l'angolo di una stanza in affitto: una stanza ricavata in un appartamento grande, divisa con una tenda di tela; un letto di ferro, un baule, una finestra piccola con un tetto di ciminiere fuori, una lampada a petrolio su una mensola, una stufetta con il tubo. Il centro è libero per due figure. Parti animabili: `tenda` (pivot in alto), `fiamma` (la lampada), `fumo` (dal tubo della stufetta).
2. `citta_dormitorio` (1240): un dormitorio di fabbrica con cuccette a due piani in due file, una lampada appesa, una finestra sporca; molti letti, nessuna intimità. Parti animabili: `lampada` (pivot al gancio, oscilla), `fiamma`.

Questo è il primo di due kit di interni di città: consegna solo i pezzi elencati.
Attenzioni storiche: archetipi generici. Il foglio con il razzo non porta nomi né date. Niente simboli politici, ritratti o scritte sul muro della cella.

~~~~

## Prompt 4 — Città 2: cella, foglio, pane, carbone, lettera

~~~~
Contesto. Stai disegnando un kit di illustrazioni vettoriali per un videogioco didattico italiano sulla Rivoluzione russa (progetto LAIKA). Non hai accesso al codice del progetto: tutto ciò che serve è in questo messaggio. Il kit sarà importato da un motore che ridisegna ogni pezzo e lo confronta al pixel con il tuo originale, quindi le regole tecniche qui sotto sono vincolanti, non consigli.

Stile. Forme piene e semplificate, contorno a inchiostro quasi nero, rosso usato con parsimonia (un solo accento per scena), azzurri e grigi freddi per costruzioni e mezzi, sabbia per legno e terra. Nessun 3D realistico, nessuna sfumatura. Tratto leggermente irregolare, come disegnato a mano, ma deterministico. Nessuna persona nel kit: le figure umane le aggiunge il motore sopra i tuoi disegni. Nessun testo leggibile, nessuna insegna, bandiera, stemma o scritta cirillica inventata.

Palette: usa ESATTAMENTE questa costante, con questi valori e questi nomi di chiave, e nei disegni scrivi i colori solo come `${C.nome}`:

const C = {
  bg: '#f6f1e3', p2: '#ece5d3', ink: '#161614', red: '#e02a1b', sand: '#decba8',
  cLight: '#c9d6df', cMid: '#8ea8b8', cDark: '#4f6b7c', sky: '#b8cbd8', tree: '#97b0c0'
};

Il pezzo con `GROUND_Y = 400` e centrato in x = 0 è la convenzione del kit; l'anteprima mostra ogni pezzo in `viewBox="-640 0 1280 420"`. Gli ambienti-sfondo riempiono quella larghezza (da -620 a +620) e tengono libera una fascia di terreno davanti (da y = 330 a 400) dove il motore posiziona fino a dieci figure alte circa 70 unità. Gli oggetti isolati sono più piccoli e ognuno dichiara la propria larghezza nel catalogo (`width`).

Consegna: un solo file HTML autonomo. In cima un commento con titolo, autore «modello», data e la dichiarazione «Rispetta CONTRATTO-KIT». Per ogni voce un commento con epoca, luogo e se è un archetipo generico. Prima di consegnare verifica da solo: nessun colore esadecimale dentro le funzioni di disegno; nessun elemento o attributo fuori dall'elenco; tutte le funzioni di disegno eseguibili con Node senza browser (puoi provarlo copiando lo script prima della riga `// AVVIO`); stessa chiamata, stesso markup; ogni parte animabile con id e `data-pivot`.

Il contratto tecnico completo segue.

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
COMPITO: kit «Interni di città e cella» (nome del file: kit-interni-citta-2.html)

Epoca e luogo: città industriale della Russia (Pietroburgo e dintorni), 1881–1904. Illuminazione a lampada a petrolio o a candela, stufe a legna o a carbone, nessuna elettricità in casa operaia, nessun oggetto posteriore al 1904. Gli interni si vedono in sezione frontale, come la scena di un teatro: parete di fondo, pavimento, un lato aperto verso chi guarda.

Costante GROUND_Y = 400. Voci del catalogo (id e larghezza; gli ambienti-sfondo 1240):

1. `citta_cella` (1240): una cella di prigione: muri spessi, una branda, un tavolino, una finestrella molto in alto con le sbarre che lascia vedere un pezzo di cielo; una striscia di luce che arriva sul pavimento. Parte animabile `luce` (la striscia, pivot nell'angolo della finestra) e `cielo` (il riquadro dietro le sbarre).
2. `citta_foglio_razzo` (160): un foglio di carta con il disegno schematico di un razzo: un corpo cilindrico con ugello e alette, linee di quota e piccole frecce tratteggiate. È una ricostruzione di fantasia dello stile di un progetto ottocentesco, non una copia di un documento esistente: scrivilo nel commento. Nessuna scritta, solo segni. Parti animabili: `foglio` (pivot all'angolo, per farlo sollevare) e `razzo` (il disegno).
3. `citta_pane` (120): un tavolo con un pane nero tondo, una ciotola e un cucchiaio di legno.
4. `citta_carbone` (110): una stufetta bassa con accanto un secchio di carbone. Parte animabile `fumo`.
5. `citta_lettera` (90): una busta chiusa con una moneta posata sopra, per le monete mandate al villaggio.

Questo è il secondo di due kit di interni di città: consegna solo i pezzi elencati. La cella è un ambiente di 1240; gli altri sono oggetti piccoli.
Attenzioni storiche: archetipi generici. Il foglio con il razzo non porta nomi né date. Niente simboli politici, ritratti o scritte sul muro della cella.

~~~~

## Dopo la consegna (per chi integra)

1. Salvare ciascun HTML intatto in `prototypes/kit-villaggio-mir-1/`, `kit-villaggio-mir-2/`, `kit-interni-citta-1/` e `kit-interni-citta-2/`.
2. Aggiungere le quattro voci a `KIT` in `bottega/strumenti/importa-studi.js` (file, costante palette, token, definizioni, famiglie), poi `npm run bottega:importa`. Se un costrutto non è supportato si corregge il kit, non l'importatore.
3. Registrare i simboli in `bottega/catalogo.json` con stato ed epoca; aggiornare `da_fare`.
4. `npm test` e `npm run test:browser` (confronto al pixel automatico).
5. Scrivere le schede scena (assemblea, angolo di stanza) con `npm run scena` e guardarle in galleria.
6. Aggiornare: ASSET-MANIFEST, PIANO-ATTI §9 (già elencati qui), PIANO-LAIKA §4 e INCARICHI-LAIKA (P4).
