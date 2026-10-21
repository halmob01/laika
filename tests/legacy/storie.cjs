/* Contenuti, non regole: episodi di Omero distinti dai bivi ipotetici.
   Le variazioni numeriche sono meccaniche didattiche, NON dati storici. */
(function (root) {
  'use strict';
  const TROY = {
    id: 'ettore', title: 'ETTORE', subtitle: 'Una città sulle spalle',
    source: 'Iliade, libro VI: il congedo da Andromaca (rielaborazione didattica)',
    insight: 'Ettore è padre, marito e difensore di Troia. Nell’epica la sua scelta personale coinvolge la famiglia e la comunità, perché questi ruoli sono legati.',
    stats: [
      { id: 'difesa', label: 'Difesa', start: 65 },
      { id: 'provviste', label: 'Provviste', start: 60 },
      { id: 'fiducia', label: 'Fiducia', start: 60 }
    ],
    scenes: [
      { id: 'troia', type: 'narrative', title: 'La città assediata',
        text: 'Da molti anni i Greci combattono contro Troia. Dietro le mura ci sono case, soldati, famiglie e bambini.',
        art: 'troia', historical: true },
      { id: 'eroe', type: 'narrative', title: 'Il difensore',
        text: 'Ettore è un guerriero troiano. Gli abitanti contano su di lui: quando esce a combattere, prova a difendere tutta la città.',
        art: 'mura', historical: true },
      { id: 'famiglia', type: 'narrative', title: 'Un padre, un marito',
        text: 'Ettore ha una moglie, Andromaca, e un figlio piccolo, Astianatte. Se Troia cade, anche loro saranno in pericolo.',
        art: 'famiglia', historical: true },
      { id: 'assedio', type: 'narrative', title: 'Il peso dell’assedio',
        text: 'In una città assediata servono cibo, protezione e fiducia. Le risorse non sono infinite: ogni decisione può aiutare qualcuno e danneggiare qualcun altro.',
        art: 'magazzino', historical: false },
      { id: 'regole', type: 'narrative', title: 'Ora decidi tu',
        text: 'Per tre turni immaginerai di essere Ettore. Le tue scelte sono inventate per il gioco: non sono episodi raccontati da Omero. Guarda come cambia Troia.',
        art: 'scelta', historical: false },
      { id: 'pane', type: 'decision', title: 'Le famiglie chiedono pane',
        text: 'I magazzini hanno poche scorte. Anche i soldati hanno fame. Come distribuisci il cibo?',
        art: 'magazzino', afterEffects: { difesa: -3, provviste: -4 },
        afterText: 'Intanto l’assedio continua: ogni giorno consuma viveri e indebolisce le difese.',
        choices: [
          { id: 'famiglie', label: 'Apri il magazzino alle famiglie', effects: { provviste: -15, fiducia: 12 },
            feedback: 'Le famiglie ricevono il pane; si fidano di più di te. Ma le scorte per i prossimi giorni sono minori.',
            why: 'Un gesto di Ettore cambia la vita dei cittadini, non soltanto la sua.' },
          { id: 'soldati', label: 'Riservi più cibo ai soldati', effects: { difesa: 8, provviste: -8, fiducia: -10 },
            feedback: 'Le guardie hanno la forza di difendere il portone. Alcune famiglie, invece, si sentono dimenticate.',
            why: 'Difendere le mura e proteggere gli abitanti non sempre richiedono la stessa decisione.' },
          { id: 'razioni', label: 'Riduci le razioni di tutti', effects: { difesa: -5, provviste: 8, fiducia: -6 },
            feedback: 'Risparmi del cibo, ma la fame rende le persone più stanche e preoccupate.',
            why: 'La scorta che salvi oggi può avere un costo per tutta Troia.' }
        ] },
      { id: 'mura', type: 'decision', title: 'Il pericolo alle mura',
        text: 'Le sentinelle vedono muoversi i Greci. Le guardie sono poche e bisogna scegliere dove mandarle.',
        art: 'mura', afterEffects: { difesa: -3, provviste: -4 },
        afterText: 'La città resta sotto pressione: il tempo ha un costo anche quando scegli con attenzione.',
        choices: [
          { id: 'portone', label: 'Rinforzi il portone della città', effects: { difesa: 13, provviste: -8 },
            feedback: 'Il portone resiste meglio. Hai però consumato materiali e risorse preziose.',
            why: 'La difesa militare della città richiede sacrifici a tutti.' },
          { id: 'riparo', label: 'Metti al sicuro le famiglie vicine alle mura', effects: { difesa: -7, fiducia: 13, provviste: -5 },
            feedback: 'Le famiglie sono più protette. Meno persone, però, possono sorvegliare le mura.',
            why: 'Aiutare gli abitanti può ridurre nell’immediato la forza delle difese.' },
          { id: 'cittadini', label: 'Chiedi ai cittadini di aiutare le guardie', effects: { difesa: 7, fiducia: -8 },
            feedback: 'Le mura hanno nuovi difensori. Alcuni cittadini, spaventati, non volevano combattere.',
            why: 'La guerra entra nella vita di chiunque abiti Troia.' }
        ] },
      { id: 'notte', type: 'decision', title: 'La notte di Troia',
        text: 'Un messaggero annuncia un pericolo vicino alle case. Se mandi tutti i rinforzi da una parte, l’altra resta esposta.',
        art: 'notte', afterEffects: { difesa: -3, provviste: -4 },
        afterText: 'La città sopravvive a un’altra notte. Ma il pericolo non è scomparso.',
        choices: [
          { id: 'case', label: 'Proteggi le case più esposte', effects: { difesa: -6, fiducia: 10, provviste: -5 },
            feedback: 'Molte famiglie trovano riparo; un tratto di mura, però, resta meno difeso.',
            why: 'Ettore prova a proteggere le famiglie di Troia, non una soltanto.' },
          { id: 'cancello', label: 'Concentri le guardie al cancello', effects: { difesa: 10, fiducia: -8 },
            feedback: 'Il cancello è protetto, ma alcuni quartieri temono di essere stati abbandonati.',
            why: 'La sicurezza di un luogo non coincide sempre con quella di ogni suo abitante.' },
          { id: 'dividere', label: 'Dividi le guardie fra mura e case', effects: { difesa: 3, fiducia: 3, provviste: -9 },
            feedback: 'La protezione è più distribuita. Tenere tutti mobilitati, però, costa risorse.',
            why: 'Una decisione apparentemente equilibrata non elimina i sacrifici.' }
        ] },
      { id: 'andromaca', type: 'narrative', title: 'Andromaca lo ferma',
        text: 'Ora torniamo all’Iliade. Andromaca supplica Ettore di non tornare in battaglia. Ha già perso i propri cari in guerra; Ettore è il marito che ama e il padre del piccolo Astianatte.',
        art: 'famiglia', historical: true },
      { id: 'elmo', type: 'narrative', title: 'Il bambino e l’elmo',
        text: 'Astianatte si spaventa per l’elmo con il pennacchio. Ettore lo toglie, sorride e prende il figlio in braccio. Poi prega che un giorno diventi più forte di lui.',
        art: 'elmo', historical: true },
      { id: 'dovere', type: 'narrative', title: 'Ettore torna a combattere',
        text: 'Ettore sa che Troia potrebbe cadere. Ama Andromaca e Astianatte, eppure sente di dover difendere la città. Torna alla battaglia: non perché non abbia paura, ma perché il destino della famiglia e quello di Troia sono legati.',
        art: 'scelta', historical: true },
      { id: 'ruoli', type: 'narrative', title: 'Una persona, tre legami',
        text: 'Ettore è marito, padre e difensore. Esplora tutti e tre i legami. Poi osserva perché una sua decisione può riguardare un’intera comunità.',
        art: 'ruoli', interactive: 'roles', historical: false,
        panels:[
          {id:'marito',label:'MARITO',name:'Andromaca',text:'Andromaca teme di perdere Ettore. Il pericolo per Troia è anche un pericolo per la loro vita insieme.'},
          {id:'padre',label:'PADRE',name:'Astianatte',text:'Astianatte potrebbe crescere senza padre. Difendere la città significa anche tentare di proteggere il futuro del figlio.'},
          {id:'difensore',label:'DIFENSORE',name:'Troia',text:'Ettore difende anche le famiglie degli altri abitanti. Una sua decisione riguarda tutta la comunità.'}
        ] },
      { id: 'interpretazione', type: 'reflection', title: 'Una vita, un destino comune',
        text: 'Quale frase spiega meglio perché la vicenda di Ettore è un esempio di epica?',
        art: 'troia', choices: [
          { id: 'coraggio', label: 'Ettore è coraggioso perché non prova paura.', feedback: 'Ettore sa che potrebbe morire. Il suo valore non dipende dall’assenza di paura.', why: 'Guarda come il racconto lega l’amore per la famiglia alla responsabilità verso Troia.', correct: false },
          { id: 'ruoli', label: 'Il suo dovere di padre e quello verso Troia sono legati.', feedback: 'Esatto: il destino della sua famiglia e quello della città sono intrecciati.', why: 'Nell’epica, attraverso la vicenda personale di Ettore vediamo il mondo a cui appartiene.', correct: true },
          { id: 'individuale', label: 'Ettore combatte per seguire un progetto soltanto personale.', feedback: 'Non è soltanto una decisione per sé: sono coinvolti famiglia, cittadini e valori comuni.', why: 'Per Ettore il ruolo pubblico non resta fuori dalla vita familiare.', correct: false }
        ] },
      { id: 'finale', type: 'narrative', title: 'La storia di una città',
        text: 'Le tue scelte nel gioco hanno cambiato le misure di Troia. Nell’Iliade, la vicenda di Ettore mette in scena qualcosa di più grande di un solo uomo: anche il destino di una comunità.',
        art: 'troia', historical: false }
    ]
  };

  const ACHILLE = {
    id: 'achille', title: 'ACHILLE', subtitle: 'L’offesa diventa guerra',
    source: 'Iliade, libri I e XVI–XVIII (rielaborazione didattica)',
    insight: 'L’onore ferito di Achille e la morte di Patroclo non restano fatti privati: coinvolgono l’intero esercito.',
    stats: [
      { id: 'esercito', label: 'Forza dei Greci', start: 60 },
      { id: 'onore', label: 'Onore riconosciuto', start: 40 },
      { id: 'rischio', label: 'Sicurezza dei compagni', start: 65 }
    ],
    scenes: [
      { id: 'contesto', type: 'narrative', title: 'Achille e il suo onore', text: 'Achille è un grande guerriero greco. Agamennone gli sottrae Briseide. È un’offesa pubblica al suo valore, non soltanto un litigio privato.', art: 'scelta', historical: true },
      { id: 'ritiro', type: 'narrative', title: 'Un esercito senza Achille', text: 'Achille smette di combattere. I Greci cominciano a perdere. L’offesa fatta a un uomo cambia il destino di molti.', art: 'mura', historical: true },
      { id: 'bivio', type: 'decision', title: 'E se tu fossi Achille?', text: 'Queste alternative sono inventate per esplorare le conseguenze. Che cosa scegli?', art: 'scelta',
        choices: [
          { id: 'torna', label: 'Torni subito ad aiutare i Greci', effects: { esercito: 14, onore: -8, rischio: 10 }, feedback: 'L’esercito ritrova il suo guerriero più forte. Ma l’offesa di Agamennone non è stata risolta.', why: 'L’onore personale entra in tensione con il bisogno dell’esercito.' },
          { id: 'resta', label: 'Rimani lontano dalla battaglia', effects: { esercito: -16, onore: 5, rischio: -14 }, feedback: 'Non accetti l’umiliazione. Senza di te, però, i compagni combattono in maggiore difficoltà.', why: 'Una decisione personale cambia la situazione collettiva.' },
          { id: 'armatura', label: 'Presti la tua armatura a Patroclo', effects: { esercito: 7, rischio: -12 }, feedback: 'I Greci si sentono incoraggiati. Patroclo, però, corre un grande rischio.', why: 'Anche un gesto di amicizia pesa sul destino della guerra.' }
        ] },
      { id: 'omerica', type: 'narrative', title: 'Che cosa accade nell’Iliade?', text: 'Nella storia di Omero, Patroclo indossa l’armatura di Achille e viene ucciso da Ettore. Il dolore spinge Achille a tornare a combattere.', art: 'notte', historical: true },
      { id: 'sintesi', type: 'reflection', title: 'La domanda importante', text: 'Perché il litigio fra Achille e Agamennone è più di una questione privata?', art: 'mura', choices: [
        { id: 'privato', label: 'Perché i due guerrieri non si sopportano.', feedback: 'Il conflitto è più grande di una semplice antipatia.', why: 'Conta il riconoscimento pubblico del valore del guerriero.', correct: false },
        { id: 'briseide', label: 'Perché Achille vuole vendicarsi di Briseide.', feedback: 'Il punto centrale non è la vendetta contro Briseide.', why: 'Agamennone ferisce il prestigio pubblico di Achille.', correct: false },
        { id: 'onore', label: 'Perché l’onore di Achille è un valore condiviso dai Greci.', feedback: 'Esatto. L’offesa mette in crisi i rapporti di forza e di riconoscimento dell’esercito.', why: 'Il personale diventa collettivo.', correct: true }
      ] },
      { id: 'fine', type: 'narrative', title: 'Un esercito, molte vite', text: 'La rabbia di Achille, l’affetto per Patroclo e la guerra non sono storie separate: la vita di uno coinvolge il destino di molti.', art: 'troia', historical: false }
    ]
  };


  /* Odissea: gli episodi indicati come storici derivano dal racconto omerico
   * semplificato; le scelte di gestione domestica sono esperimenti didattici. */
  const PENELOPE = {
    id:'penelope', title:'PENELOPE E ULISSE', subtitle:'Difendere il posto di Itaca', coverArt:'itaca',
    question:'In che senso Penelope, Telemaco e Ulisse difendono un ordine che riguarda tutta Itaca?',
    source:'Odissea, vicenda di Penelope, Telemaco e ritorno di Ulisse (rielaborazione didattica)',
    insight:'Penelope difende la casa e il trono; Ulisse torna al suo posto di re, marito e padre. Anche le vicende domestiche fanno parte dell’ordine di Itaca.',
    stats:[
      {id:'tempo',label:'Tempo guadagnato',start:35},
      {id:'sostegno',label:'Sostegno dei fedeli',start:48},
      {id:'casa',label:'Sicurezza della casa',start:58}
    ],
    scenes:[
      {id:'lontano',type:'narrative',title:'Itaca senza il suo re',
        text:'Ulisse è partito per la guerra di Troia. La guerra è finita, ma lui non è ancora tornato. A Itaca lo aspettano la moglie Penelope e il figlio Telemaco.',
        art:'itaca',historical:true},
      {id:'proci',type:'narrative',title:'Gli ospiti che non se ne vanno',
        text:'Molti uomini, chiamati Proci, occupano la casa di Ulisse. Vogliono sposare Penelope e prendono ciò che trovano. La casa e il regno sono in pericolo.',
        art:'proci',historical:true},
      {id:'attesa',type:'narrative',title:'Penelope non resta ferma',
        text:'Penelope promette che prenderà una decisione quando avrà finito una grande tela. Di giorno la tesse; di notte, di nascosto, disfa il lavoro. Così guadagna tempo.',
        art:'tela',historical:true},
      {id:'regole-itaca',type:'narrative',title:'Un gioco di attesa',
        text:'Ora immaginiamo due giornate difficili a Itaca. Le decisioni che prenderai sono inventate per il gioco: nell’Odissea la vicenda segue il racconto di Omero.',
        art:'itaca',historical:false},
      {id:'messaggio',type:'decision',title:'Le famiglie chiedono aiuto',
        text:'I Proci consumano le provviste del palazzo. Alcuni servitori temono di perdere il lavoro. Come reagisci?',
        art:'proci',afterEffects:{casa:-5,tempo:-3},
        afterText:'I giorni passano e la presenza dei Proci continua a pesare sulla casa.',
        choices:[
          {id:'fedeli',label:'Chiedi ai servitori fedeli di organizzarsi',effects:{sostegno:12,casa:7,tempo:-4},
            feedback:'I servitori si aiutano e tengono d’occhio i magazzini. Riunirli, però, richiede tempo.',
            why:'Non è soltanto Penelope a difendere la casa: la resistenza coinvolge altre persone.'},
          {id:'attendere',label:'Prendi tempo con un’altra promessa',effects:{tempo:13,sostegno:-7,casa:-6},
            feedback:'Ottieni qualche giorno, ma chi ti sostiene comincia a dubitare che la situazione cambi.',
            why:'Guadagnare tempo può proteggere la casa oggi, ma non risolve da solo il problema.'},
          {id:'proteggere',label:'Chiudi parte dei magazzini per proteggerli',effects:{casa:11,tempo:-6,sostegno:-5},
            feedback:'Salvi alcune provviste; altre persone, però, non possono più entrarvi.',
            why:'La casa è anche un luogo di lavoro e di relazioni: ogni decisione tocca molti.'}
        ]},
      {id:'telemaco',type:'decision',title:'Telemaco vuole notizie',
        text:'Telemaco, ormai cresciuto, vuole sapere che cosa sia accaduto al padre. La casa ha bisogno di lui, ma forse deve partire.',
        art:'itaca',afterEffects:{casa:-5,tempo:-3},
        afterText:'Intanto i Proci rimangono: non basta una decisione a rimettere ordine.',
        choices:[
          {id:'partire',label:'Lo incoraggi a cercare notizie',effects:{sostegno:9,casa:-10,tempo:5},
            feedback:'Telemaco prova ad agire come erede di Ulisse. La sua assenza lascia però la casa più esposta.',
            why:'La crescita di Telemaco riguarda il ruolo che occupa nella famiglia e nel regno.'},
          {id:'restare',label:'Gli chiedi di restare a proteggere la casa',effects:{casa:8,sostegno:-6,tempo:-4},
            feedback:'C’è una presenza in più a difendere il palazzo. Ma Telemaco rinuncia, per il momento, a cercare notizie.',
            why:'Il destino di un figlio, in questa storia, coinvolge anche quello della casa.'},
          {id:'alleati',label:'Cerchi aiuto mentre lui prepara il viaggio',effects:{sostegno:10,casa:2,tempo:-8},
            feedback:'Trovi persone su cui contare, ma preparare tutto in sicurezza rallenta le decisioni.',
            why:'Una soluzione comune richiede l’impegno di più persone e non elimina l’incertezza.'}
        ]},
      {id:'ritorno',type:'narrative',title:'Il ritorno di Ulisse',
        text:'Nell’Odissea, Ulisse riesce infine a tornare a Itaca. Il suo viaggio non è soprattutto la ricerca di un mestiere o di una vita nuova: vuole recuperare il posto di re, marito e padre.',
        art:'nave',historical:true},
      {id:'ruoli-itaca',type:'narrative',title:'Tre persone, una casa',
        text:'Esplora come Penelope, Telemaco e Ulisse siano legati a Itaca. Ognuno agisce in modo diverso per difendere o ritrovare un posto nel proprio mondo.',
        art:'legami-itaca',historical:false,interactive:'views',
        panels:[
          {id:'penelope',label:'PENELOPE',name:'Proteggere',text:'Con l’astuzia e la pazienza mantiene aperta la possibilità del ritorno di Ulisse. La sua fedeltà ha anche un significato pubblico.'},
          {id:'telemaco',label:'TELEMACO',name:'Diventare erede',text:'Cerca notizie del padre e impara ad assumere la responsabilità della casa e del regno.'},
          {id:'ulisse',label:'ULISSE',name:'Ritrovare',text:'Il suo viaggio tende verso Itaca: desidera tornare al ruolo di marito, padre e re che già gli apparteneva.'}
        ]},
      {id:'domanda-itaca',type:'reflection',title:'La casa è soltanto privata?',
        text:'Quale risposta spiega meglio perché Penelope, Telemaco e Ulisse appartengono al mondo dell’epica?',
        art:'itaca',choices:[
          {id:'nostalgia',label:'Perché tutti sentono nostalgia e paura.',feedback:'La nostalgia conta, ma non basta a spiegare il rapporto tra loro e Itaca.',why:'Chiediti quale posto proteggono o cercano di recuperare.',correct:false},
          {id:'ordine',label:'Perché le loro vicende difendono l’ordine della casa e del regno.',feedback:'Esatto: la casa non è un luogo soltanto privato. È anche il centro di un ordine familiare e politico.',why:'In questi personaggi, il destino personale rappresenta anche un mondo collettivo.',correct:true},
          {id:'viaggio',label:'Perché tutti devono viaggiare per diventare persone nuove.',feedback:'Penelope rimane a Itaca, mentre Ulisse vuole tornare al proprio posto.',why:'Le strade dei tre personaggi sono diverse ma collegate allo stesso ordine.',correct:false}
        ]},
      {id:'fine-itaca',type:'narrative',title:'La casa e il mondo',
        text:'Nell’epica anche la storia di chi aspetta, governa la casa o cerca il padre è una storia pubblica: riguarda il posto delle persone nella comunità.',
        art:'itaca',historical:false}
    ]
  };

  /* Scenario del presente: narrativa originale per il confronto fra destini collettivi e personali.
   * Mostra sia il carattere sociale degli eventi sia la possibile centralità
   * del futuro, dell’incertezza e dello sguardo individuale. */
  const OGGI = {
    id:'oggi', title:'UNA VITA OGGI', subtitle:'Quando un paese cambia', coverArt:'fabbrica',
    question:'Perché la storia del tirocinio di Nadia parla anche della chiusura della fabbrica e del futuro del quartiere?',
    source:'Racconto contemporaneo originale per la lezione, non tratto da un romanzo esistente',
    insight:'La crisi coinvolge tutto il quartiere, ma Nadia può vivere il fatto collettivo come una questione di scelte personali, legami e futuro. La narrazione può passare dallo sguardo sulla città a quello di una persona comune.',
    stats:[
      {id:'futuro',label:'Possibilità personali',start:45},
      {id:'legami',label:'Legami vicini',start:60},
      {id:'insieme',label:'Azione comune',start:38}
    ],
    scenes:[
      {id:'la-notizia',type:'narrative',title:'Il giorno dell’annuncio',
        text:'Nadia ha diciassette anni e fa tirocinio in un’officina. Una mattina scopre che la grande fabbrica della zona chiuderà. Qui lavorano anche molte persone che conosce.',
        art:'fabbrica',historical:false},
      {id:'via-lavoro',type:'narrative',title:'Non perde il lavoro una persona sola',
        text:'La chiusura cambia la vita dei lavoratori, dei negozi e delle famiglie. Anche chi frequenta la scuola si domanda se troverà un impiego vicino a casa.',
        art:'quartiere',historical:false},
      {id:'nella-testa',type:'narrative',title:'Ma Nadia pensa anche a sé',
        text:'Nadia pensa ai soldi per prendere l’autobus, al tirocinio che potrebbe interrompersi, agli amici e alla possibilità di trasferirsi. Non sa ancora quale vita costruirà.',
        art:'ragazza',historical:false},
      {id:'scelte-oggi',type:'narrative',title:'Una scelta non basta a risolvere tutto',
        text:'Ora seguirai Nadia per tre momenti. Le conseguenze sono immaginate: non c’è una risposta moralmente superiore, e la chiusura della fabbrica non si può cancellare con una scelta.',
        art:'fabbrica',historical:false},
      {id:'colleghi',type:'decision',title:'La notizia arriva a scuola',
        text:'La tutor dice che il tirocinio potrebbe cambiare. Nadia ha poche ore per decidere a chi chiedere aiuto.',
        art:'ragazza',choices:[
          {id:'scuola',label:'Chiede subito informazioni alla scuola',effects:{futuro:13,legami:-4,insieme:-4},
            feedback:'La scuola indica altri tirocini possibili. Nadia si sente meno bloccata, ma non ha parlato con gli altri apprendisti.',
            why:'La crisi generale entra nella sua vita come un problema concreto di percorso e di futuro.'},
          {id:'collettivo',label:'Parla con gli altri apprendisti',effects:{insieme:13,legami:6,futuro:-7},
            feedback:'Scoprono che molti hanno lo stesso problema. Non hanno ancora una soluzione per il tirocinio di Nadia.',
            why:'Un timore individuale può diventare un problema affrontato insieme.'},
          {id:'famiglia',label:'Torna a casa per discuterne con la famiglia',effects:{legami:12,futuro:-5,insieme:-5},
            feedback:'A casa può spiegare le proprie paure. Il sostegno aiuta, anche se il problema del lavoro resta aperto.',
            why:'Nella vita particolare entrano le trasformazioni dell’economia e della società.'}
        ]},
      {id:'assemblea',type:'decision',title:'Un incontro in quartiere',
        text:'Lavoratori, famiglie e studenti organizzano un incontro sulla chiusura. Nadia può decidere come usare il suo pomeriggio.',
        art:'quartiere',choices:[
          {id:'partecipare',label:'Partecipa all’incontro',effects:{insieme:15,legami:5,futuro:-6},
            feedback:'Sente idee e preoccupazioni di altri abitanti. Torna a casa tardi e ha rimandato la ricerca di un tirocinio.',
            why:'La storia generale può diventare esperienza diretta quando le persone decidono di agire insieme.'},
          {id:'colloquio',label:'Va a un colloquio per un altro tirocinio',effects:{futuro:15,insieme:-7,legami:-4},
            feedback:'Trova una possibilità concreta. La riunione continua senza di lei e il problema della zona rimane.',
            why:'Prendersi cura del proprio futuro non significa che la crisi collettiva non esista.'},
          {id:'ponte',label:'Chiede alla scuola di ascoltare i lavoratori',effects:{futuro:7,insieme:8,legami:-8},
            feedback:'La scuola organizza un contatto con alcune famiglie. Nadia deve dedicare tempo alla mediazione.',
            why:'Fra futuro personale e iniziativa collettiva esistono anche soluzioni miste, ma comportano costi.'}
        ]},
      {id:'offerta',type:'decision',title:'Un’offerta lontano da casa',
        text:'Una nuova officina offre a Nadia un tirocinio fuori città. Anche qui può rimanere a cercare, ma non sa per quanto tempo.',
        art:'autobus',choices:[
          {id:'partire',label:'Accetta il tirocinio lontano',effects:{futuro:15,legami:-13,insieme:-5},
            feedback:'Nadia intravede un lavoro. Il viaggio la allontana però da amici e persone con cui aveva affrontato la crisi.',
            why:'In una narrazione moderna una vicenda collettiva può diventare anche la storia incerta di un percorso personale.'},
          {id:'restare',label:'Resta e continua a cercare nella zona',effects:{legami:11,insieme:6,futuro:-12},
            feedback:'Rimane vicina alle persone che conosce, ma non ha una prospettiva lavorativa immediata.',
            why:'Restare non è automaticamente una scelta migliore: è una possibilità con vantaggi e rischi.'},
          {id:'provare',label:'Prova fuori città senza interrompere i contatti',effects:{futuro:9,legami:-6,insieme:4},
            feedback:'Conserva qualche legame e prova il nuovo tirocinio. Deve organizzare tempo e spostamenti.',
            why:'Nadia non trova un destino già scritto: prova a comporre una vita tra vincoli sociali e progetti personali.'}
        ]},
      {id:'stesso-evento',type:'narrative',title:'Una notizia, tre vite',
        text:'La stessa chiusura viene vissuta in modi differenti. Ascolta tre punti di vista, poi confronta ciò che hanno in comune.',
        art:'quartiere',historical:false,interactive:'views',
        panels:[
          {id:'nadia',label:'NADIA',name:'Il suo futuro',text:'Nadia si domanda dove lavorerà e con chi passerà le giornate. La crisi è enorme, ma lei la sente dentro le piccole decisioni di domani.'},
          {id:'madre',label:'LA FAMIGLIA',name:'La vita in casa',text:'A casa si parla di spese, orari, trasporti e persone da aiutare. Una decisione economica entra nei gesti quotidiani.'},
          {id:'quartiere',label:'IL QUARTIERE',name:'Un destino comune',text:'Molte famiglie hanno lo stesso problema. Alcuni protestano, altri cercano nuove opportunità, altri osservano senza sapere che fare.'}
        ]},
      {id:'due-sguardi',type:'narrative',title:'Lo stesso evento. Due racconti.',
        text:'Leggi due modi diversi di raccontare la chiusura. Nessuno dei due è una citazione: sono esempi originali scritti per la lezione.',
        art:'due-sguardi',historical:false,interactive:'views',
        panels:[
          {id:'insieme',label:'DALL’ALTO',name:'Il destino di molti',text:'La fabbrica chiuse. Il quartiere perse un luogo di lavoro, e per molte famiglie cominciò un periodo di incertezza. Il futuro della zona cambiò.'},
          {id:'vicino',label:'DA VICINO',name:'La vita particolare',text:'Nadia guardò l’orario dell’autobus. Pensò al primo giorno nell’altra officina, a sua madre rimasta a casa e alla paura di non piacere a nessuno.'}
        ]},
      {id:'confronto',type:'reflection',title:'Che cosa cambia nel racconto?',
        text:'Quando passiamo dal primo racconto al secondo, che cosa cambia soprattutto?',
        art:'due-sguardi',choices:[
          {id:'spariscono',label:'Nel secondo la chiusura della fabbrica non conta più.',feedback:'La chiusura c’è ancora: è ciò che ha messo Nadia in questa situazione.',why:'La vicenda collettiva continua a condizionare la singola vita.',correct:false},
          {id:'protagonista',label:'Il secondo segue pensieri e possibilità di una persona comune.',feedback:'Esatto. La crisi è collettiva, ma la raccontiamo attraverso i pensieri e il futuro incerto di Nadia.',why:'Il romanzo moderno può dare valore narrativo alla vita particolare senza cancellare il mondo sociale.',correct:true},
          {id:'eroe',label:'Nel secondo Nadia diventa un’eroina che rappresenta tutta la città.',feedback:'Nadia non incarna da sola un valore comune come Ettore: affronta un problema sociale attraverso una storia singolare.',why:'La differenza riguarda lo sguardo narrativo, non l’esistenza o meno di un destino comune.',correct:false}
        ]},
      {id:'due-vite',type:'narrative',title:'Due vite, due modi di raccontare',
        text:'Tocca le tre domande. Non stiamo confrontando una persona senza sentimenti e una con sentimenti: osserviamo quale aspetto della vita diventa il centro del racconto.',
        art:'due-sguardi',historical:false,interactive:'views',
        panels:[
          {id:'ruolo',label:'CHI SEI?',name:'Il ruolo e la persona',text:'Ettore è figlio, marito e padre, ma la sua storia è legata soprattutto alla difesa di Troia. Nadia è una tirocinante: la sua storia non deve rappresentare l’intero quartiere per meritare di essere narrata.'},
          {id:'dovere',label:'CHE COSA DEVI FARE?',name:'Le attese degli altri',text:'Da Ettore ci si aspetta che combatta per la città. Nadia deve cercare un nuovo tirocinio, ma nessuno può stabilire in anticipo quale futuro debba scegliere.'},
          {id:'desiderio',label:'CHE COSA DESIDERI?',name:'Gli affetti e i desideri',text:'Ettore ama la famiglia e teme di perderla: l’epica non cancella la sua interiorità. Nadia teme il futuro, desidera amicizie e lavoro: il racconto segue anche queste possibilità particolari.'}
        ]},
      {id:'vita-qualunque',type:'narrative',title:'Una giornata che merita una storia',
        text:'Nadia ha trovato un tirocinio lontano. Domani deve prendere un autobus alle sei e mezza. Nessuna città dipende dalla sua puntualità. Eppure, per lei, questa mattina può cambiare tutto.',
        art:'autobus',historical:false},
      {id:'vita-qualunque-scelta',type:'reflection',title:'Perché raccontare Nadia?',
        text:'Nadia non sta salvando una città. Perché la sua giornata può comunque essere al centro di una storia?',
        art:'ragazza',choices:[
          {id:'eroina',label:'Perché ogni persona comune è un eroe che salva la propria città.',feedback:'Nadia non deve diventare un’eroina per essere protagonista.',why:'Il valore narrativo di una vita non dipende dal rappresentare tutti.',correct:false},
          {id:'singolare',label:'Perché anche paure, desideri e scelte di una persona qualunque possono essere raccontati.',feedback:'Esatto. Il suo futuro incerto merita attenzione anche senza un’impresa eroica.',why:'La narrazione può concentrarsi sulla singolarità di una vita.',correct:true},
          {id:'scomparsa',label:'Perché il mondo esterno non influenza più le decisioni personali.',feedback:'La chiusura della fabbrica continua a condizionare le possibilità di Nadia.',why:'Il racconto personale non elimina i problemi comuni.',correct:false}
        ]},
      {id:'inquadratura',type:'narrative',title:'Cambia l’inquadratura',
        text:'È sempre la stessa chiusura della fabbrica. Tocca entrambe le inquadrature e nota che cosa ciascuna mostra e che cosa lascia sullo sfondo.',
        art:'due-sguardi',historical:false,interactive:'views',
        panels:[
          {id:'panorama',label:'IL QUARTIERE',name:'Vista d’insieme',text:'Centinaia di lavoratori perdono il posto. Negozi e famiglie devono adattarsi. Questo sguardo rende visibile un problema comune, ma non ci dice che cosa prova Nadia.'},
          {id:'persona',label:'NADIA',name:'Primo piano',text:'Alle sei e venti Nadia aspetta l’autobus. Ha paura di non essere all’altezza del nuovo tirocinio. Questo sguardo mostra la sua esperienza, ma non racconta da solo tutto il quartiere.'}
        ]},
      {id:'distinzioni',type:'narrative',title:'Quattro distinzioni fondamentali',
        text:'Apri tutte e quattro le coppie. Sono differenze di attenzione narrativa, non regole assolute: Ettore prova emozioni e Nadia resta parte della società.',
        art:'due-sguardi',historical:false,interactive:'views',
        panels:[
          {id:'ruoli',label:'1 · PROTAGONISTA',name:'Chi viene raccontato?',text:'EPICA: il protagonista occupa un ruolo riconosciuto dalla comunità. VITE PARTICOLARI: anche una persona qualunque può diventare protagonista.'},
          {id:'azioni',label:'2 · AZIONI',name:'Che cosa merita una storia?',text:'EPICA: le azioni coinvolgono direttamente il destino del gruppo. VITE PARTICOLARI: anche fatti quotidiani e privati possono essere materia narrativa.'},
          {id:'valori',label:'3 · SIGNIFICATO',name:'Che cosa rende visibile il racconto?',text:'EPICA: la vicenda esprime valori e conflitti comuni. VITE PARTICOLARI: il racconto segue desideri, dubbi e possibilità di una vita singolare.'},
          {id:'legami',label:'4 · LEGAMI',name:'L’individuo è solo?',text:'EPICA: gli affetti personali possono entrare in conflitto con il ruolo pubblico. VITE PARTICOLARI: la società continua a influenzare le scelte, anche quando non è al centro della narrazione.'}
        ]},
      {id:'confronto-finale',type:'narrative',title:'Dall’epica al romanzo',
        text:'Ettore vive la difesa di Troia come parte del proprio ruolo. Nadia, invece, cerca una strada personale dentro un cambiamento che riguarda tutti. Il romanzo moderno può fare di questa vita comune e incerta il centro della storia.',
        art:'due-sguardi',historical:false},
      {id:'finale-oggi',type:'narrative',title:'I destini non sono scomparsi',
        text:'Anche oggi un evento collettivo cambia moltissime vite. Può però essere vissuto e raccontato attraverso il futuro, gli affetti, i desideri e le scelte di una singola persona. Questo permette di confrontare modi diversi di raccontare una vita.',
        art:'quartiere',historical:false}
    ]
  };

  const STORIES = Object.freeze({ ettore: TROY, achille: ACHILLE, penelope: PENELOPE, oggi: OGGI });
  if (typeof module === 'object' && module.exports) module.exports = STORIES;
  else root.EpicaStories = STORIES;
})(typeof globalThis === 'object' ? globalThis : this);
