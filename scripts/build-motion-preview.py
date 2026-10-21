"""Self-contained review artifact. Embeds the SAME modules through an import map.
No bundler, remote dependency, runtime fetch or special preview renderer.
"""
import base64,json,pathlib,re,sys
root=pathlib.Path(__file__).resolve().parent.parent
rig='--rig' in sys.argv
folder='prototypes/rig-study' if rig else 'prototypes/motion-lab'
entry=folder+'/app.js';modules={}
def collect(name):
    if name in modules:return
    modules[name]=''
    code=(root/name).read_text()
    def replace(m):
        relative=m.group(2)
        if not relative.startswith('.'):raise ValueError('External module: '+relative)
        resolved=(root/name).parent.joinpath(relative).resolve().relative_to(root).as_posix()
        collect(resolved);return m.group(1)+'"kit/'+resolved+'"'
    code=re.sub(r'(from\s+)[\'\"]([^\'\"]+)[\'\"]',replace,code)
    modules[name]='data:text/javascript;base64,'+base64.b64encode(code.encode()).decode()
collect(entry)
html=(root/(folder+'/index.html')).read_text()
css=(root/(folder+'/style.css')).read_text()
html=html.replace('<link rel="stylesheet" href="./style.css">','<style>'+css+'</style>')
pack=(root/('prototypes/rig-study/assets/dog.json' if rig else 'games/motion-study/game.json')).read_text().replace('</','<\\/')
scripts='<script type="application/json" id="'+('rig-asset' if rig else 'motion-pack')+'">'+pack+'</script><script type="importmap">'+json.dumps({'imports':{'kit/'+k:v for k,v in modules.items()}})+'</script><script type="module">import "kit/'+entry+'";</script>'
html=html.replace('<script type="module" src="./app.js"></script>',scripts).replace('href="../../index.html"','href="#"')
out=root/('dist/rig-study.html' if rig else 'dist/motion-study.html');out.parent.mkdir(exist_ok=True);out.write_text(html);print(out)
