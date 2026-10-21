import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name('audit_questions.py')
spec = importlib.util.spec_from_file_location('audit_questions', SCRIPT)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


def q(i, pos=0, prompt=None, answers=None):
    options = [{'id': k, 'text': t} for k, t in zip('abc', answers or ['testo rosso', 'testo verde', 'testo blu'])]
    return {'id': f'q{i}', 'type': 'choice', 'prompt': prompt or f'Consegna indipendente numero {i}?',
            'options': options, 'answer': options[pos]['id']}


class AuditTests(unittest.TestCase):
    def test_healthy_bank(self):
        items = [q(i, i % 3) for i in range(1, 10)]
        report = module.audit(items)
        self.assertEqual(report['metrics']['errors'], 0)
        self.assertNotIn('position_bias', [f['code'] for f in report['findings']])

    def test_key_not_found(self):
        a = q(1)
        a['answer'] = 'not-an-option'
        codes = [f['code'] for f in module.audit([a])['findings']]
        self.assertIn('invalid_answer', codes)

    def test_duplicate_options_and_stems(self):
        a, b = q(1), q(2)
        a['options'][2]['text'] = a['options'][0]['text']
        b['prompt'] = a['prompt']
        codes = [f['code'] for f in module.audit([a, b])['findings']]
        self.assertIn('duplicate_option_texts', codes)
        self.assertIn('duplicate_stem', codes)

    def test_bias_and_longest(self):
        bank = [q(i, 1, answers=['breve', 'questa risposta risulta di gran lunga la più lunga', 'medio']) for i in range(10)]
        codes = [f['code'] for f in module.audit(bank)['findings']]
        self.assertIn('systematic_longest_answer', codes)
        self.assertIn('position_bias', codes)

    def test_repeated_correct_answer(self):
        bank = []
        for i in range(9):
            bank.append(q(i, 1, answers=[f'opzione {i} uno', 'risposta sempre identica', f'opzione {i} tre']))
        codes = [f['code'] for f in module.audit(bank)['findings']]
        self.assertIn('repeated_correct_text', codes)

    def test_previous_bank(self):
        a = q(1)
        b = q(2, prompt=a['prompt'])
        codes = [f['code'] for f in module.audit([b], [a])['findings']]
        self.assertIn('reused_stem', codes)

    def test_arabofoni_unit_adapter(self):
        with tempfile.TemporaryDirectory() as root:
            f = Path(root) / 'unit.json'
            f.write_text(json.dumps({'steps':[{'activities':[{
                'id':'a1', 'type':'choice', 'prompt':[{'text':'Dove vai?', 'lang':'it'}],
                'options':[{'id':'x','label':[{'text':'A casa', 'lang':'it'}]},
                           {'id':'y','label':[{'text':'A scuola', 'lang':'it'}]}],
                'answer':'y'}, {'id':'g1','type':'gap','accepted':['ho']}
            ]}]}), encoding='utf-8')
            items, meta = module.read_bank(str(f))
            self.assertEqual(meta['mode'], 'course-unit')
            self.assertEqual(len(items), 1)
            self.assertEqual(items[0]['options'][1]['text'], 'A scuola')
            self.assertEqual(module.audit(items)['metrics']['errors'], 0)

    def test_cli_strict(self):
        with tempfile.TemporaryDirectory() as root:
            f = Path(root) / 'bank.json'
            f.write_text(json.dumps({'questions':[q(i, 1, answers=['breve','risposta molto lunga','medio']) for i in range(9)]}),encoding='utf-8')
            process = subprocess.run([sys.executable,str(SCRIPT),str(f),'--strict','--format','json'],capture_output=True,text=True)
            self.assertEqual(process.returncode,2)
            self.assertEqual(json.loads(process.stdout)['metrics']['errors'],0)


if __name__ == '__main__':
    unittest.main()
