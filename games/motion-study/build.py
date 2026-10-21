"""Reproducible visual study. Figure assets are authored separately; architecture comes from the reviewed home SVG.
No final illustration is overwritten; generated assets stay inside this pack.
"""
import json,re,sys,pathlib,xml.etree.ElementTree as ET
HERE=pathlib.Path(__file__).resolve().parent;ROOT=HERE.parent.parent
sys.path.insert(0,str(ROOT/'scripts'));from importlib import import_module
convert=import_module('svg-to-symbol').convert
html=(ROOT/'prototypes/laika-home/index.html').read_text()
ink='#1c1c1b';red='#cc2a25';blue='#93abb7';paper='#f3ebdb'
symbols=[]
# Authored SVG figures are the source of truth; never overwrite them on rebuild.
for variant in 'abc':
    symbols.append(convert(HERE/'assets'/('human-'+variant+'.svg'),'human-'+variant))
# Preserve the existing 1917 architectural paths, at a different layout scale.
scene=re.search(r'<g class="era-layer active" data-scene="1917">(.*?)</g>',html,re.S)[1]
paths=re.findall(r'<path[^>]+/>',scene)[:5]
root=ET.Element('svg');g=ET.SubElement(root,'g',id='architecture',transform='translate(168 22) scale(1.3)')
for i,source in enumerate(paths):
    n=ET.fromstring(source);n.set('id','mass-'+str(i));n.set('fill',n.get('fill').replace('var(--blue)',blue).replace('var(--ink)',ink).replace('var(--paper)',paper));g.append(n)
p=HERE/'assets/city.svg';ET.ElementTree(root).write(p,encoding='unicode');symbols.append(convert(p,'city'))
# The same pole/cloth from the prototype. Add pivots, not a new flag drawing.
root=ET.Element('svg');g=ET.SubElement(root,'g',id='flag',transform='translate(-21 -303)')
ET.SubElement(g,'path',id='pole',d='M21 304V149',stroke=ink,**{'stroke-width':'4'})
ET.SubElement(g,'path',id='cloth',d='M24 150L103 171L24 204Z',fill=red,**{'data-pivot':'24 150'})
p=HERE/'assets/flag.svg';ET.ElementTree(root).write(p,encoding='unicode');symbols.append(convert(p,'flag'))
layers=[dict(id='paper',tag='rect',attrs=dict(width=960,height=540,fill=paper)),dict(id='world',tag='g'),dict(id='ground',tag='path',parent='world',attrs=dict(d='M0 418 L960 401 L960 540 L0 540 Z',fill=paper)),dict(id='horizon',tag='path',parent='world',attrs={'d':'M0 420 L960 403','fill':'none','stroke':ink,'stroke-width':2}),dict(id='reveal',tag='clipPath'),dict(id='reveal-window',tag='rect',parent='reveal',attrs=dict(x=0,y=0,width=960,height=540)),dict(id='city-wrap',tag='g',parent='world',clip='reveal')]
components=[dict(id='city',symbol='city',parent='city-wrap')]
groups={'early':[],'back':[],'middle':[],'front':[],'flags':[]}
# DOM order is deliberate: distant ranks, then foreground ranks.
for row,(name,count,y,start,step,scale) in enumerate([('back',14,407,190,42,.94),('middle',16,431,100,45,1.08),('front',18,459,45,49,1.22)]):
    for i in range(count):
        key=name+'-'+str(i);group='early' if row==2 and i<6 else name;groups[group].append(key)
        components.append(dict(id=key,symbol='human-'+'abc'[(i+row)%3],parent='world',pose=dict(translateX=start+i*step+(i%3-1)*3,translateY=y+(i%4-1)*3,scale=scale+(i%3-1)*.035)))
for i,(x,y,scale) in enumerate([(226,450,.85),(534,440,1.0),(812,443,.8)]):
    key='standard-'+str(i);groups['flags'].append(key);components.append(dict(id=key,symbol='flag',parent='world',pose=dict(translateX=x,translateY=y,scale=scale)))
def frames(values):return [dict(offset=o,values=v) for o,v in values]
clips=[]
for group,start,duration,stagger,dist in [('early',0,5800,100,-180),('back',1900,7500,80,-340),('middle',3100,7300,65,-360),('front',4500,6700,80,-380)]:
    clips.append(dict(group=group,at=start,duration=duration,stagger=stagger,relative=True,frames=frames([(0,{'translateX':dist,'translateY':12}),(.18,{'translateX':dist*.87,'translateY':9}),(.76,{'translateX':-35,'translateY':-2}),(1,{'translateX':0,'translateY':0})])))
    if group!='early':clips.append(dict(group=group,at=start,duration=600,stagger=stagger,frames=frames([(0,{'opacity':0}),(1,{'opacity':1})])))
    # A finite gait closes at rest. Stagger affects limbs and travel together.
    cycles=10 if group=='early' else 18
    for part,amount in [('leg-left',22),('leg-right',-22),('arm-left',-10),('arm-right',10)]:
        clips.append(dict(group=group,part=part,at=start,duration=duration/cycles,iterations=cycles,stagger=stagger,relative=True,frames=frames([(0,{'rotate':0}),(.25,{'rotate':amount}),(.75,{'rotate':-amount}),(1,{'rotate':0})])))
clips.extend([
 dict(group='flags',at=8400,duration=1800,stagger=550,relative=True,frames=frames([(0,{'translateY':100,'rotate':-18}),(1,{'translateY':0,'rotate':0})])),
 dict(group='flags',at=8400,duration=550,stagger=550,frames=frames([(0,{'opacity':0}),(1,{'opacity':1})])),
 dict(group='flags',part='cloth',at=9000,duration=900,iterations=6,stagger=350,relative=True,frames=frames([(0,{'skewY':0}),(.3,{'skewY':4}),(.7,{'skewY':-3}),(1,{'skewY':0})])),
 dict(targets=['reveal-window'],at=700,duration=2300,frames=frames([(0,{'width':0}),(1,{'width':960})]))])
sequence=dict(id='gather',caption='Da presenze isolate a una piazza occupata: gruppi, gesti e bandiere cambiano la composizione.',tracks=[],clips=clips,shots=[dict(layer='world',at=0,duration=16000,frames=[dict(offset=t,rect=r) for t,r in [(0,[0,0,960,540]),(.16,[0,0,960,540]),(.38,[0,180,660,371.25]),(.59,[250,150,660,371.25]),(.87,[0,0,960,540]),(1,[0,0,960,540])]])],beats=[dict(at=t,text=s) for t,s in [(0,'01 · Presenze isolate. La piazza è ancora uno spazio da attraversare.'),(3000,'02 · I flussi si incontrano. La marcia ha ritmi sfalsati, non un passo unico.'),(7000,'03 · La regia segue le persone. Le distanze tra i gruppi si riducono.'),(10500,'04 · Si alzano le bandiere. Lo spazio diventa una presenza collettiva.'),(14500,'05 · La piazza resta. Il movimento termina in una composizione leggibile.')]])
stage=dict(id='square',label='Studio di una piazza: architetture azzurre, sagome piene e tre bandiere rosse.',viewBox=[0,0,960,540],duration=700,layers=layers,components=components,groups=groups,sequences=[sequence],introSequence='gather')
pack=dict(schemaVersion=1,contentVersion='motion-study-1',id='motion-study',title='La piazza prende forma',exposureFlags=[],symbols=symbols,stages=[stage],acts=[dict(id='study',title='Studio visuale',actors=[dict(id='observer')],roles=[dict(id='reader',actorId='observer',label='Osservatore',mandate='Osservare una composizione animata, non una ricostruzione storica.')],metrics=[],resources=[],relations=[],flags=[],reconciliation='Studio espressivo: non è un episodio storico definitivo.',episodes=[dict(id='scene',type='narrative',title='La piazza prende forma',text='Studio di regia e movimento collettivo. Le forme provengono dal prototipo del progetto; la sequenza non rappresenta un evento storico convalidato.',roleId='reader',stageId='square',motionId='gather')])])
(HERE/'game.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2)+'\n')
