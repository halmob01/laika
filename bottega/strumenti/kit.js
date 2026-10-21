// Esegue in un contenitore isolato (node:vm) le funzioni di disegno di un kit HTML originale.
// Nessun DOM, nessuna rete: solo Math. L'interfaccia del kit non viene avviata.
// Con token: la costante palette viene sostituita da nomi di token (per l'importazione);
// senza token: palette originale (per i confronti al pixel).
import fs from 'node:fs';
import vm from 'node:vm';

const ROOT = new URL('../../', import.meta.url);
export function caricaKit(kit, { token = true } = {}) {
  const html = fs.readFileSync(new URL(encodeURI(kit.file), ROOT), 'utf8');
  let code = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
  if (token) code = code.replace(new RegExp('const ' + kit.palette + ' = \\{[\\s\\S]*?\\};'), blocco => blocco.replace(/(\w+):\s*'#[0-9A-Fa-f]{6}'/g, (all, chiave) => {
    if (!kit.token[chiave]) throw new Error(kit.file + ': chiave di palette senza token: ' + chiave);
    return chiave + ": '" + kit.token[chiave] + "'";
  }));
  // Si ferma prima dell'avvio dell'interfaccia: riga "// AVVIO" (kit nuovi) o initUI() (studi originali).
  const avvio = code.search(/\n\s*\/\/ ?AVVIO\b|\ninitUI\(\);/);
  if (avvio < 0) throw new Error(kit.file + ': manca la riga "// AVVIO" prima dell\'avvio dell\'anteprima');
  code = code.slice(0, avvio) + '\n';
  code += '\nglobalThis.__kit = { chiama: (nome, argomenti) => eval(nome)(...argomenti), valuta: espressione => eval(espressione), stato: typeof state !== "undefined" ? state : null };';
  const context = vm.createContext({ Math });
  vm.runInContext(code, context, { filename: kit.file });
  const api = context.__kit;
  if (api.stato) api.stato.anim = false;
  return { chiama: (nome, argomenti) => String(api.chiama(nome, argomenti)), valuta: e => JSON.parse(JSON.stringify(api.valuta(e))) };
}
