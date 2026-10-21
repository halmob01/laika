# Formato di scambio e istruzioni dell'auditor

## Esecuzione

```
python3 scripts/audit_questions.py assets/esempio-banca.json
python3 scripts/audit_questions.py assets/esempio-banca.json --format json
python3 scripts/audit_questions.py quesiti.json --previous verifica_precedente.json --strict
python3 scripts/audit_questions.py percorso/alla/unita-del-corso.json
```

Requisito: Python 3.9+ standard library. Non importa né esegue codice preso dal file controllato.

- Exit 0: nessun errore strutturale bloccante (possono essere presenti avvisi).
- Exit 1: errori strutturali bloccanti.
- Exit 2: solo con `--strict`, esistono avvisi senza errori bloccanti.
- `--format json`: restituisce metriche, avvisi e errori per CI o agenti.

## Schema minimale raccomandato

```
{
  "title": "Verifica di esempio",
  "questions": [
    {
      "id": "q01",
      "type": "choice",
      "prompt": "Quale affermazione è corretta?",
      "objective": "Distinguere due concetti",
      "source": "Appunti §2",
      "options": [
        {"id":"a", "text":"Prima risposta"},
        {"id":"b", "text":"Seconda risposta"},
        {"id":"c", "text":"Terza risposta"}
      ],
      "answer": "b",
      "rationale": "Spiega il motivo, non solo la lettera."
    }
  ]
}
```

Per `type=choice`, `answer` è l'ID dell'opzione. Lo schema di audit è deliberatamente diverso dagli schemi applicativi: non pubblicarlo al posto del contenuto di produzione.

## Adattatore built-in del corso arabofoni
Lo script legge anche un file **unità** come `site/content/units/a2-m01-u01.json`: attraversa `steps[].activities[]`, estrae le attività `type=choice`, usa `prompt[].text` e `options[].label[].text`, e la chiave `answer`. I tipi `gap` e `order` non sono analizzati per qualità delle scelte: restano oggetto del controllo semantico e dei test del motore.

Nel corso reale, ogni attività può avere metadata multilingue, `purpose`, `feedback`, `weight`; lo script non li modifica e non li valuta.

## Altri formati
- Laboratorio elettrico: `lesson.pages` è codice JS incorporato nei livelli, non JSON direttamente importabile dallo script. Esporta soltanto un rapporto JSON **normalizzato** oppure riusa i test JS esistenti. Non fare parsing con regex del sorgente JS.
- Verifica cartacea: l'agente produce prima la bozza, quindi una copia JSON normalizzata per l'audit; dopo le correzioni produce impaginato e chiave.

## Significato delle metriche
- `position_counts`: posizione **nel JSON in input**, non posizione che l'utente vedrà a video.
- `correct_longest_rate`: percentuale di domande in cui la corretta è **unica più lunga**. L'auditor segnala il problema se il pattern è sistematico.
- `length_ratio`: lunghezza della corretta divisa per quella della errata più lunga; scostamento da 0,85–1,15 = **avviso euristico** mutuato dal laboratorio elettrico.
- `near_duplicates`: rilevazione testuale con SequenceMatcher; non dimostra duplicazione semantica.

## Cosa NON fa lo script
Non controlla verità disciplinare, livello QCER, qualità degli errori plausibili, sicurezza tecnica, accordo morfologico con l'enunciato, equivalenza delle traduzioni, correttezza delle rubriche, rendering e mescolamento nel browser. Tutto questo va nella review ragionata e nei test applicativi.
