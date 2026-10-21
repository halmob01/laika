#!/usr/bin/env python3
"""Auditor didattico *strutturale*, senza rete e senza dipendenze esterne.

Uso:
  python3 audit_questions.py questions.json [--previous previous.json]
  python3 audit_questions.py unit.json --format json --strict

Non convalida la verita' delle risposte o il livello pedagogico.
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path


def normalized(value: str) -> str:
    value = unicodedata.normalize('NFKC', value).casefold()
    value = re.sub(r'[^\w\s]', ' ', value, flags=re.UNICODE)
    return ' '.join(value.split())


def labels_to_text(value, language='it') -> str:
    """Text or course multilingual rich-text; avoid pretending to validate Arabic."""
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        if language in value:
            return labels_to_text(value[language], language)
        return ''
    if isinstance(value, list):
        return ''.join(v if isinstance(v, str) else v.get('text', '')
                       for v in value if isinstance(v, (dict, str)))
    return ''


def read_bank(filename: str) -> tuple[list[dict], dict]:
    with open(filename, encoding='utf-8') as stream:
        raw = json.load(stream)
    if isinstance(raw, list):
        items, mode = raw, 'flat'
    elif isinstance(raw, dict) and isinstance(raw.get('questions'), list):
        items, mode = raw['questions'], 'flat'
    elif isinstance(raw, dict) and isinstance(raw.get('steps'), list):
        items, mode = [], 'course-unit'
        for step in raw['steps']:
            if not isinstance(step, dict):
                continue
            for activity in step.get('activities', []):
                if not isinstance(activity, dict) or activity.get('type') != 'choice':
                    continue
                items.append({
                    'id': activity.get('id'),
                    'type': 'choice',
                    'prompt': labels_to_text(activity.get('prompt')),
                    'options': [
                        {'id': option.get('id'), 'text': labels_to_text(option.get('label'))}
                        for option in activity.get('options', []) if isinstance(option, dict)
                    ],
                    'answer': activity.get('answer'),
                })
    else:
        raise ValueError('Atteso array di domande, {questions: [...]}, o unità con steps[].activities[]')
    return items, {'mode': mode, 'items': len(items)}


def issue(severity: str, code: str, ids: list[str], message: str) -> dict:
    return {'severity': severity, 'code': code, 'ids': ids, 'message': message}


def audit(items: list[dict], previous: list[dict] | None = None) -> dict:
    findings: list[dict] = []
    valid: list[dict] = []
    all_ids: set[str] = set()
    prompts: list[tuple[str, str]] = []
    previous_prompts: list[tuple[str, str]] = []
    position_groups: dict[int, list[int]] = defaultdict(list)
    longest_count = 0
    length_ratios: list[dict] = []
    correct_texts: list[str] = []
    option_sets: dict[tuple[str, ...], str] = {}

    if previous:
        for candidate in previous:
            if isinstance(candidate, dict):
                p = normalized(candidate.get('prompt', '')) if isinstance(candidate.get('prompt'), str) else ''
                if p:
                    previous_prompts.append((str(candidate.get('id', '?')), p))

    for n, q in enumerate(items, 1):
        if not isinstance(q, dict):
            findings.append(issue('error', 'malformed_item', [f'#{n}'], 'La domanda deve essere un oggetto JSON.'))
            continue
        qid = q.get('id')
        qid = qid.strip() if isinstance(qid, str) else ''
        if not qid:
            findings.append(issue('error', 'missing_id', [f'#{n}'], 'ID della domanda mancante.'))
            qid = f'#{n}'
        elif qid in all_ids:
            findings.append(issue('error', 'duplicate_id', [qid], 'ID della domanda ripetuto.'))
        all_ids.add(qid)

        if q.get('type', 'choice') != 'choice':
            continue  # The script audits multiple-choice item structure only.
        stem = q.get('prompt', q.get('stem'))
        if not isinstance(stem, str) or not stem.strip():
            findings.append(issue('error', 'missing_prompt', [qid], 'Consegna della domanda assente o vuota.'))
            continue
        stem_norm = normalized(stem)
        options = q.get('options')
        if not isinstance(options, list) or len(options) < 2:
            findings.append(issue('error', 'invalid_options', [qid], 'Occorrono almeno due opzioni.'))
            continue
        if any(not isinstance(o, dict) for o in options):
            findings.append(issue('error', 'invalid_options', [qid], 'Ogni opzione deve avere id e text.'))
            continue

        optids = [o.get('id') for o in options]
        texts = [o.get('text', '') for o in options]
        if any(not isinstance(a, str) or not a.strip() for a in optids + texts):
            findings.append(issue('error', 'incomplete_option', [qid], 'ID o testo di un’opzione mancante.'))
            continue
        if len(set(optids)) != len(optids):
            findings.append(issue('error', 'duplicate_option_ids', [qid], 'Gli ID delle opzioni non sono univoci.'))
            continue
        norm_texts = [normalized(t) for t in texts]
        if len(set(norm_texts)) != len(norm_texts):
            findings.append(issue('error', 'duplicate_option_texts', [qid], 'Almeno due opzioni hanno lo stesso testo dopo normalizzazione.'))
        answer = q.get('answer', q.get('correct'))
        if not isinstance(answer, str) or answer not in optids:
            findings.append(issue('error', 'invalid_answer', [qid], 'Chiave corretta assente o non presente negli ID delle opzioni.'))
            continue
        valid.append(q)
        prompts.append((qid, stem_norm))
        i = optids.index(answer)
        correct_texts.append(norm_texts[i])
        option_set = tuple(sorted(norm_texts))
        if option_set in option_sets:
            findings.append(issue('warning', 'reused_option_set', [option_sets[option_set], qid],
                                  'Stesso insieme di opzioni in domande diverse: controllare se si misurano competenze differenti.'))
        else:
            option_sets[option_set] = qid
        position_groups[len(options)].append(i)
        length = len(texts[i].strip())
        distractor_lengths = [len(t.strip()) for j, t in enumerate(texts) if j != i]
        other_max = max(distractor_lengths)
        ratio = round(length / other_max, 3) if other_max else None
        length_ratios.append({'id': qid, 'ratio': ratio, 'correct_length': length, 'longest_distractor_length': other_max})
        if length > other_max:
            longest_count += 1
        if ratio is not None and (ratio < 0.85 or ratio > 1.15):
            findings.append(issue('warning', 'length_heuristic', [qid],
                                  f'Corretta/errata più lunga = {ratio:.2f}; rivedere l’indizio, senza forzare la semantica.'))

    # Near-duplicates are intentionally heuristic: no hidden semantic classification.
    for i, (qid, prompt) in enumerate(prompts):
        for other_id, other_prompt in prompts[:i]:
            if prompt == other_prompt:
                findings.append(issue('error', 'duplicate_stem', [other_id, qid], 'Consegna identica in due domande.'))
            elif len(prompt) > 35 and len(other_prompt) > 35 and difflib.SequenceMatcher(None, prompt, other_prompt).ratio() >= 0.9:
                findings.append(issue('warning', 'near_duplicate_stem', [other_id, qid], 'Consegne molto simili: controllare la competenza e il livello di trasferimento.'))
        for older_id, old_prompt in previous_prompts:
            if prompt == old_prompt:
                findings.append(issue('warning', 'reused_stem', [older_id, qid], 'Consegna identica alla banca precedente.'))
            elif len(prompt) > 35 and len(old_prompt) > 35 and difflib.SequenceMatcher(None, prompt, old_prompt).ratio() >= 0.92:
                findings.append(issue('warning', 'reused_similar_stem', [older_id, qid], 'Consegna simile alla banca precedente.'))

    position_stats = {}
    for size, positions in sorted(position_groups.items()):
        counts = Counter(positions)
        position_stats[str(size)] = {str(i + 1): counts[i] for i in range(size)}
        if len(positions) >= 8:
            max_pos, max_count = max(counts.items(), key=lambda p: p[1])
            if max_count / len(positions) > 0.5:
                findings.append(issue('warning', 'position_bias', [],
                                      f'{max_count}/{len(positions)} corrette nella posizione {max_pos+1} su domande con {size} opzioni (posizione sorgente, non UI).'))

    if len(correct_texts) >= 8:
        most_common_answer, frequency = Counter(correct_texts).most_common(1)[0]
        if frequency / len(correct_texts) > 0.5:
            findings.append(issue('warning', 'repeated_correct_text', [],
                                  f'La stessa risposta corretta «{most_common_answer[:50]}» ricorre in {frequency}/{len(correct_texts)} domande.'))

    if len(valid) >= 8 and longest_count / len(valid) > 0.5:
        findings.append(issue('warning', 'systematic_longest_answer', [],
                              f'Corretta unica più lunga in {longest_count}/{len(valid)} domande.'))

    errors = sum(f['severity'] == 'error' for f in findings)
    warnings = sum(f['severity'] == 'warning' for f in findings)
    return {
        'metrics': {
            'total_items': len(items),
            'valid_choice_items': len(valid),
            'errors': errors,
            'warnings': warnings,
            'source_position_counts_by_option_count': position_stats,
            'correct_unique_longest_count': longest_count,
            'correct_unique_longest_rate': round(longest_count / len(valid), 3) if valid else None,
            'length_ratios': length_ratios,
            'most_common_correct_text_count': Counter(correct_texts).most_common(1)[0][1] if correct_texts else 0,
        },
        'findings': findings,
        'limitations': [
            'Le posizioni sono quelle del JSON sorgente, non della UI renderizzata.',
            'Gli avvisi di lunghezza e somiglianza sono euristiche; non verificano plausibilità o correttezza.',
            'I tipi diversi da choice non sono valutati dall’auditor delle opzioni.',
            'Non sono verificate equivalenza di traduzioni e contenuto disciplinare.',
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', help='JSON di domande o singola unità corso-arabofoni')
    parser.add_argument('--previous', help='JSON di una banca precedente per rilevare riuso testuale')
    parser.add_argument('--format', choices=('text', 'json'), default='text')
    parser.add_argument('--strict', action='store_true', help='Tratta gli avvisi come gate non superato')
    args = parser.parse_args()
    try:
        items, metadata = read_bank(args.input)
        previous, _ = read_bank(args.previous) if args.previous else (None, None)
        result = audit(items, previous)
        result['input'] = {'path': args.input, **metadata}
    except (OSError, UnicodeError, ValueError, json.JSONDecodeError) as exc:
        print(f'ERRORE di lettura: {exc}', file=sys.stderr)
        return 1

    if args.format == 'json':
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        m = result['metrics']
        print(f"Analisi: {args.input} | {m['valid_choice_items']}/{m['total_items']} scelte valide")
        print(f"Errori: {m['errors']} | Avvisi: {m['warnings']} | Corrette uniche più lunghe: {m['correct_unique_longest_count']}")
        print(f"Posizioni nel sorgente per numero opzioni: {m['source_position_counts_by_option_count']}")
        for found in result['findings']:
            print(f"{found['severity'].upper()} [{found['code']}] {','.join(found['ids'])}: {found['message']}")
        print('NOTA: controllare separatamente la qualità didattica e l’ordine effettivo della UI.')
    if result['metrics']['errors']:
        return 1
    if args.strict and result['metrics']['warnings']:
        return 2
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
