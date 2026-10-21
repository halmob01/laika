"""Export the runtime schema to verifiche-didattiche's audit interchange format."""
import json
import sys
from pathlib import Path
pack = json.loads(Path(sys.argv[1]).read_text())
questions = []
for act in pack['acts']:
    for episode in act['episodes']:
        if episode['type'] != 'assessment':
            continue
        q = episode['question']
        questions.append({'id': act['id'] + '-' + q['id'], 'type': 'choice',
                          'prompt': q['prompt'], 'objective': '; '.join(q['objectives']),
                          'source': q['source'], 'rationale': q['rationale'],
                          'answer': q['correctId'],
                          'options': [{'id': o['id'], 'text': o['label']} for o in q['options']]})
print(json.dumps({'title': pack['title'], 'questions': questions}, ensure_ascii=False, indent=2))
