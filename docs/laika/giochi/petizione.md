# Gioco di II.1 — La petizione (`petizione`)

Scheda di gioco dell'unità `petizione` (canone: II.1). Versione 1 (costruita) · 5 novembre 2026 · gioco scelto dall'agente fra quelli del repertorio (D-038, D-039) in sostituzione del modulo con cinque righe: lo stato nel canone è «da confermare» finché il docente non lo prova (C-II). Applica [GIOCHI](../GIOCHI.md) §2 e §3.2 (decisioni sui gruppi) con le pedine come ore. I contenuti degli episodi sono in [atto-2](../atti/atto-2.md). I numeri sono indici della simulazione; le persone sono inventate.

## Il gioco

**Forma:** gestione di tre sere, come il salario di I.3, ma con gruppi che si contendono il tempo. **Durata:** circa otto minuti. **Chi è il giocatore:** il figlio della famiglia, operaio alle officine Putilov, che fa parte del comitato dei promotori.

**Le ore.** Ogni sera sei ore, da dare toccando un'ora e poi il posto: **Firme alle officine** (consenso degli operai, un po' di attenzione della polizia), **Righe sul salario e sull'orario**, **Righe sulla libertà e sull'assemblea eletta** (costano attenzione della polizia), **Righe sulla fine della guerra**, **Parlare con padre Gapon** (la fiducia nello zar sale, la polizia tollera) e **Tenere d'occhio la polizia** (l'attenzione scende, gli operai si sentono trascurati). Almeno un'ora alle firme ogni sera, altrimenti il comitato si disperde (7 volte su 10 se ne accorgono).

**Ogni sera, comunque.** Il consenso cala di 5, la polizia sale di 5 e la fiducia nello zar scende di 3.

**Chi bussa.** Padre Gapon (portare le icone e il ritratto in testa al corteo, oppure leggere le richieste ad alta voce); uno studente con l'assemblea eletta da tutti (metterla fra le richieste oppure lasciarla fuori); un impiegato che dice che le autorità non vogliono il corteo (mandare una delegazione a chiedere garanzie, probabilità scritta prima, oppure andare avanti).

**Imprevisti** (scritti prima): perquisizione alle officine (2 su 9), tormenta di neve (2 su 9). **Crisi** (una volta ciascuna): la polizia a 85 o più (arrestano due promotori), il consenso a 25 o meno (lo sciopero si sgonfia).

**Indicatori visibili (tre):** Operai con te, Fiducia nello zar, Attenzione della polizia. Le tre righe della petizione (economiche, politiche, di pace) compaiono nelle variazioni e dicono, a fine sera, che petizione è venuta fuori: «Chiede tutto», «Politica», «Salari» o «Poco e vago».

**Che cosa deve capire lo studente.** Una petizione che chiede tutto insieme è più difficile da accogliere; ogni riga politica costa attenzione della polizia; chi si fida dello zar come padre porta il corteo con le icone in piazza. Poi la domenica non si gioca: si legge (II.1-e2) e la fiducia nello zar si spezza.

**Regola di bilanciamento (G3 di METODO §7), controllata da `tests/laika-petizione.test.js` sul motore vero (sei piani di sera, tre sere, due modi di rispondere a chi bussa, tre semi).** Nessuna strategia è la migliore su tutti gli indicatori insieme (consenso, polizia, righe economiche, politiche e di pace); strategie diverse portano a petizioni diverse (almeno dieci profili e tre giudizi); chi punta tutto sulla politica attira la polizia e chi punta sul salario no; ogni crisi si può provocare; si arriva a domenica anche senza crisi; ogni posto serve; le etichette sulla scena non si sovrappongono.

**Esito.** Nessuna vittoria o sconfitta: il giudizio della petizione, gli indicatori e il testo finale («più si chiede, meno è facile rispondere con un sì o con un no»).

## Il resto dell'unità

- **La domenica di sangue** (`a2-petizione-domenica`, II.1-e2): tre fatti con fonte registrata: il 6 gennaio (19 gennaio nel calendario occidentale) la salva dalla fortezza di Pietro e Paolo con proiettili veri rompe le finestre del Palazzo d'Inverno (Montefiore); le parole di Victor Serge sugli operai in supplica e i soldati (atlante, R01); il diario di Nicola, «A terrible day!» e il pranzo con tutti (Montefiore). Montefiore e Serge non sono in archivio: il testo li attribuisce.
- **Cosa ti devi ricordare** (`a2-petizione-ricorda`) e **Verifica V8** (`a2-petizione-v8`).
- **Scene:** `petizione-putilov` (le officine e il comitato; il gioco), `petizione-domenica` (il Palazzo d'Inverno, il corteo, l'icona e il ritratto dello zar). Disegni nuovi: nessuno.

## Dati da riscontrare

La data esatta del 6 gennaio nel calendario occidentale (19 gennaio) è un calcolo, non una fonte; il testo della petizione di Gapon non è usato; le cifre delle vittime non compaiono.
