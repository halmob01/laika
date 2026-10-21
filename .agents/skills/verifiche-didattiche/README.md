# Verifiche didattiche — Agent Skill

Skill portabile per creare e revisionare quiz, compiti in classe, esercizi ed elementi di valutazione di corsi digitali.

## Contenuto
- `SKILL.md`: istruzioni per l'agente.
- `references/`: checklist e profili per verifica da appunti, italiano L2, simulazione tecnica.
- `scripts/audit_questions.py`: controlli oggettivi, nessuna dipendenza Python esterna.
- `assets/esempio-banca.json`: esempio da verificare.

## Installazione come cartella (agenti compatibili)
Copia **l'intera cartella** `verifiche-didattiche` dentro `.claude/skills/` per Claude Code oppure `.agents/skills/` in ambienti che supportano il caricamento da quella posizione; le convenzioni variano tra prodotti, controlla la loro documentazione. Puoi tenerne una copia centrale e distribuirla su più repository.

## Utilizzo senza installazione
Allega `SKILL.md` e, per gli audit approfonditi, gli altri file della cartella alla conversazione. La presenza del pacchetto nella chat **non implica** installazione automatica o disponibilità nelle altre chat.

## Script

```
python3 verifiche-didattiche/scripts/audit_questions.py verifiche-didattiche/assets/esempio-banca.json
```

Puoi anche passare una singola unità JSON della repo `corso-arabofoni`. Il report è un pre-controllo; l'agente deve comunque verificare contenuto disciplinare, plausibilità e difficoltà.

## Origine delle regole
La skill deriva dalle regole pedagogiche e dai test presenti il 18 ottobre 2026 nelle repository `halmob01/laboratorio-ele` e `halmob01/corso-arabofoni`, ma non importa moduli di queste repository e non altera i loro sistemi di valutazione.
