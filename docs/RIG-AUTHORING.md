# Rig SVG leggero: preparazione, pose e texture opzionale

Incremento del 20 ottobre 2026, base `eb6ab83`. Il motore è modificabile: questa evoluzione riduce il lavoro ripetitivo senza sostituire il renderer o introdurre GSAP. Il cane fornito dall'utente è il caso di produzione e il suo disegno va conservato.

## Cosa cambia concretamente

- `scripts/prepare-svg.py` prepara un SVG con una ricetta esplicita: assegna ID deterministici alle forme, conserva i gruppi, aggiunge pivot, rimuove solo gli elementi indicati e conserva tutti i path. Produce SVG statico normalizzato e simbolo JSON.
- `symbol.rig` dichiara intervalli di rotazione, pose complete e movimenti nominati. `sequence.rigs` li istanzia; il compilatore produce le stesse clip/tracce già supportate. Nessun clock aggiuntivo, stato nascosto o codice del cane nel motore.
- Gli angoli dei fotogrammi sono verificati contro i limiti del rig. Anche tracce/clip esplicite sulle articolazioni dell'istanza vengono controllate. Gli intervalli sono scelti e revisionati dall'autore: non sono una prova geometrica di assenza di fessure.
- Texture `rough` opzionale, limitata a turbulence + displacement, con regione esplicita e ID isolati per montaggio. Nessun markup filtro arbitrario, URL esterno o CSS eseguibile. Definizioni uguali sono condivise dentro lo stage; questo risparmia DOM, **non** rende gratuita la rasterizzazione di ogni istanza.
- `setTexturesEnabled(false)` rimuove i filtri senza cambiare la posa o il tempo. Nessuna texture viene aggiunta ai vecchi giochi. Il progetto può scegliere di disattivarla nei campi lunghi o sui dispositivi per cui le misure la sconsigliano.
- Supporto a `ellipse` per non costringere gli asset a ridisegnare forme SVG elementari.

## Procedura per una nuova illustrazione

1. Conservare l'SVG originale. Gli elementi che devono seguire una parte vanno nel suo gruppo; usare forme sovrapposte e raccordi nascosti. Non disegnare articolazioni visibili se lo stile non le richiede.
2. Preparare una ricetta JSON, come `prototypes/rig-study/assets/dog-recipe.json`. I pivot sono coordinate locali, non percentuali del bounding box. Non si stimano automaticamente da un disegno arbitrario: serve una decisione iniziale, poi viene riutilizzata.
3. Elencare esplicitamente elementi da omettere (sfondi o overlay di debug), perni e regione dei filtri. `presentationAttributesOnly: true` autorizza a ignorare le classi e usare gli attributi SVG espliciti; non usarlo su un disegno il cui aspetto dipende da CSS esterno. Il comando segnala le classi rimosse e rifiuta CSS inline, script, URL e markup non supportato.
4. Eseguire:

```sh
python3 scripts/prepare-svg.py \
  prototypes/rig-study/assets/dog-source.svg \
  prototypes/rig-study/assets/dog-recipe.json \
  prototypes/rig-study/assets/dog
```

5. Validare il simbolo mediante `composePack` e `validateStage` (oppure il normale `validatePack` di un gioco). La preparazione è un passaggio di authoring, **non** sostituisce la validazione del runtime.
6. Riutilizzare il simbolo con `components`; aggiungere azioni `rigs` nelle sequenze. Non duplicare la geometria per cambiare il movimento. Correggere sorgente/ricetta e rigenerare gli output, mai ritoccare soltanto il JSON generato.
7. Controllare pose iniziale/finale, estremi e almeno cinque istanti intermedi a dimensione di gioco. Rivedere anche il passaggio fra due gesti. Una silhouette connessa può essere brutta: la review visiva rimane necessaria.

L'SVG normalizzato è una preview statica e può includere il filtro. Il comando rigoroso `svg-to-symbol.py` rimane disponibile per il sottoinsieme senza filtri; per rigenerare gli asset preparati usare la ricetta originale, non tentare un round-trip indiscriminato del file di preview.

## Contratto minimo

```json
{
  "id": "lever",
  "layers": [{"id":"arm","tag":"g","origin":[0,0]}],
  "rig": {
    "joints": {"arm":[0,90]},
    "poses": {"rest":{"arm":0},"up":{"arm":70}},
    "motions": {
      "lift": {"duration":1200,"frames":[
        {"offset":0,"pose":"rest"},
        {"offset":0.5,"pose":"up"},
        {"offset":1,"pose":"rest"}
      ]}
    }
  }
}
```

Una sequenza usa `rigs: [{"target":"lever-a","motion":"lift","at":300}]`, dove `lever-a` è una componente di quello stage. Durata e numero di cicli possono essere sovrascritti dall'azione. Le pose contengono tutte le giunture; i valori sono angoli assoluti nel sistema locale dell'articolazione. Le ricette di spostamento del personaggio e della camera restano clip normali: non fanno parte dell'anatomia.

Si mantengono i vincoli precedenti: nessuna sovrapposizione di canali, niente scritture sui binding, cicli chiusi e finale uguale alla posa statica dello stage. Le pose nominate sono dati di authoring, non una macchina a stati persistente. Per restare in una nuova posa usare una composizione finale dichiarata; non salvare il frame corrente come stato didattico.

L'interruzione mantiene il comportamento precedente: conclude la sequenza in corso, poi avvia la nuova. Non è blending continuo. Se una scena richiede un raccordo senza scatto, disegnarlo nella sequenza oppure proporre una patch con quel caso reale; non introdurre ora IK o interpolazione universale.

## Texture

Sul gruppo da filtrare:

```json
{"texture":{"type":"rough","scale":2.4,"frequency":0.16,"octaves":3,"seed":11,"bounds":[-25,-27,300,319]}}
```

Limiti: scala 0–4, frequenza 0.001–0.5, 1–3 ottave, seed intero 0–65535. La regione è nelle coordinate del gruppo filtrato. Allargarla solo quanto basta per tutte le pose: il clipping del viewport rimane separato. La texture agisce su bordi e dettagli già presenti; non genera il pelo o una grana interna dal nulla. Sul cane i segni chiari sono path originali.

Non animare seed/frequenza; non applicare filtri indipendenti a ogni arto. Non usare il filtro per nascondere fessure. La prova resta significativa anche senza texture. Nessuna promessa di accelerazione GPU, 60 fps o costo trascurabile su Safari. Reduced motion ferma il movimento; il filtro statico è una scelta separata.

## Banco di prova

```sh
npm run serve
# /prototypes/rig-study/
python3 scripts/build-motion-preview.py --rig
# dist/rig-study.html: autonomo, stessi moduli del runtime, nessuna CDN
```

Passo e attenzione sono sequenze finite; pausa, seek, replay, skip, posa manuale ed export del fotogramma usano il renderer reale. Nessuna seconda animazione CSS nell'export. L'export è statico intenzionalmente; per condividere il movimento usare l'HTML autonomo.

Il debug usa le matrici SVG correnti: perni e ingombri seguono i parent, invece di restare fermi nella posa originale. È uno strumento opzionale di sviluppo e non aggiunge un loop autonomo continuo. Le scene da 1/12/24 cani restano sotto il budget esistente: 48 copie integrali di questo asset lo supererebbero, quindi non si aumenta il limite per far passare la demo.

La camminata è un gesto illustrato derivato dalle ampiezze del prototipo, con ingresso/uscita al riposo: non è una simulazione biomeccanica, non include vincoli del piede al suolo o una locomozione universale. L'utente ha approvato il disegno, non ogni futura animazione.

## Provenienza e verifiche

`dog-source.svg` è estratto dall'HTML «Ricostruzione_Vettoriale_Cane_SVG___PNG.html» fornito dall'utente. Conserva il contenuto SVG originale, inclusi overlay, sfondo e ombra. La ricetta omette questi tre elementi dall'asset compositivo; la pagina di review fornisce lo sfondo. Tracciati, colori e dettagli del cane non vengono ridisegnati. I parametri della texture riprendono il prototipo; la regione è resa esplicita. Gli intervalli articolari sono candidati da revisionare, non anatomia certificata.

Verifica locale: 55 test Node passanti, inclusi conservazione dei path, rig meccanico neutro, namespace, texture toggle, input rifiutati e conflitti con binding/timeline. Generati entrambi gli HTML autonomi. Controllate rese statiche di pose campione con Inkscape. Questo non sostituisce il collaudo in movimento.

Test browser aggiunti alla CI Chromium/WebKit: pausa, stato finale, reload, reduced motion, filtro toggle, debug, 24 istanze, layout mobile, screenshot/video e intervalli dei frame. Browser locale non scaricabile in questa sessione (archivio restituito non valido): consultare l'esito della CI, non dichiararlo anticipatamente riuscito. Safari/iPhone reale resta non verificato.

## Integrazione nel piano LAIKA

Questa PR non modifica home, atti, salvataggi o fonti. Affianca P2 e la roadmap della PR #8; non duplica l'inventario della PR #7. Il prossimo agente prepara un archetipo umano con un accessorio usando questa procedura, controlla presa e raccordi, poi riusa la ricetta per una seconda scena. Non crea un altro renderer o un nuovo rig universale. La qualità si approva sulla preview a dimensione reale prima di moltiplicare la famiglia.
