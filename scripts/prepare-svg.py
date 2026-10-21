"""Prepare an SVG without redrawing it. Explicit recipe; no CSS/script evaluation.
python3 scripts/prepare-svg.py source.svg recipe.json output-prefix
Writes normalized SVG and symbol JSON. Originals remain untouched.
"""
import copy, importlib.util, json, re, sys, xml.etree.ElementTree as ET
from pathlib import Path
spec=importlib.util.spec_from_file_location('svg_import',Path(__file__).with_name('svg-to-symbol.py'))
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
NS='http://www.w3.org/2000/svg';ET.register_namespace('',NS)
def tag(n): return n.tag.split('}')[-1]
def prepare(source,recipe):
    root=ET.fromstring(source)
    if tag(root)!='svg': raise ValueError('Expected standalone SVG')
    omitted=set(recipe.get('omit',[]));found=set();warnings=[];textures={};ids=set();renames={};counter=0
    for parent in list(root.iter()):
        for child in list(parent):
            if child.get('id') in omitted:
                found.add(child.get('id'));parent.remove(child)
    if omitted!=found:raise ValueError('Unknown omitted IDs: '+str(omitted-found))
    # A single, bounded filter family; never pass arbitrary filter markup through.
    for defs in list(root):
        if tag(defs)!='defs':continue
        for f in defs:
            if tag(f)!='filter' or len(f)!=2:raise ValueError('Unsupported filter graph')
            a,b=list(f)
            if tag(a)!='feTurbulence' or tag(b)!='feDisplacementMap':raise ValueError('Unsupported filter graph')
            if set(f.attrib)-{'id','x','y','width','height','filterUnits','primitiveUnits'}:raise ValueError('Unsupported filter attribute')
            if set(a.attrib)-{'type','baseFrequency','numOctaves','seed','result'} or set(b.attrib)-{'in','in2','scale','xChannelSelector','yChannelSelector'}:raise ValueError('Unsupported primitive attribute')
            if a.get('type')!='fractalNoise' or b.get('in')!='SourceGraphic' or b.get('in2')!=a.get('result') or b.get('xChannelSelector')!='R' or b.get('yChannelSelector')!='G':raise ValueError('Unsupported filter parameters')
            if f.get('primitiveUnits','userSpaceOnUse')!='userSpaceOnUse':raise ValueError('Unsupported primitive units')
            bounds=recipe.get('filterBounds',{}).get(f.get('id'))
            if not bounds or len(bounds)!=4:raise ValueError('Supply explicit filterBounds in asset coordinates')
            textures[f.get('id')]={'type':'rough','scale':float(b.get('scale','0')),'frequency':float(a.get('baseFrequency','0')),'octaves':int(a.get('numOctaves','1')),'seed':int(a.get('seed','0')),'bounds':bounds}
        root.remove(defs)
    pivots=recipe.get('pivots',{});used=set();layer_textures={}
    for node in root.iter():
        if tag(node) not in module.TAGS|{'title','desc'}:raise ValueError('Unsupported element: '+tag(node))
        if node is root:
            node.attrib.pop('id',None);continue
        if tag(node) in {'title','desc'}:continue
        old=node.get('id');counter+=1
        name=re.sub(r'[^a-z0-9_-]','-',(old or 'shape-'+str(counter)).lower())
        if not name or not name[0].isalpha():name='part-'+name
        if name in ids or name in {'constructor','prototype','__proto__'}:raise ValueError('ID collision: '+name)
        ids.add(name);node.set('id',name)
        if old:renames[old]=name
        if 'class' in node.attrib:
            if not recipe.get('presentationAttributesOnly'):raise ValueError('Classes require explicit presentationAttributesOnly acknowledgement')
            warnings.append('Removed class on '+name+'; explicit presentation attributes retained')
            del node.attrib['class']
        node.attrib.pop('data-part',None)
        pivot=pivots.get(old)
        if pivot is not None:
            if len(pivot)!=2:raise ValueError('Pivot needs two coordinates')
            node.set('data-pivot',' '.join(map(str,pivot)));used.add(old)
        if 'filter' in node.attrib:
            match=re.fullmatch(r'url\(#([^()]+)\)',node.attrib.pop('filter'))
            if not match or match[1] not in textures:raise ValueError('Unknown/external filter')
            if tag(node)!='g':raise ValueError('Filter must wrap a group')
            layer_textures[name]=textures[match[1]]
    if used!=set(pivots):raise ValueError('Unknown pivot targets: '+str(set(pivots)-used))
    # Reuse the strict importer instead of inventing a second SVG renderer.
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        path=Path(tmp)/'normalized.svg';ET.ElementTree(root).write(path,encoding='unicode')
        symbol=module.convert(path,recipe['id'])
    for layer in symbol['layers']:
        if layer['id'] in layer_textures:layer['texture']=layer_textures[layer['id']]
    if 'rig' in recipe:symbol['rig']=recipe['rig']
    # Standalone static preview uses the same bounded texture parameters as runtime.
    defs=ET.Element('{'+NS+'}defs')
    for index,(name,t) in enumerate(layer_textures.items()):
        fid='prepared-texture-'+str(index);x,y,w,h=t['bounds']
        f=ET.SubElement(defs,'{'+NS+'}filter',{'id':fid,'filterUnits':'userSpaceOnUse','primitiveUnits':'userSpaceOnUse','x':str(x),'y':str(y),'width':str(w),'height':str(h)})
        ET.SubElement(f,'{'+NS+'}feTurbulence',{'type':'fractalNoise','baseFrequency':str(t['frequency']),'numOctaves':str(t['octaves']),'seed':str(t['seed']),'result':'noise'})
        ET.SubElement(f,'{'+NS+'}feDisplacementMap',{'in':'SourceGraphic','in2':'noise','scale':str(t['scale']),'xChannelSelector':'R','yChannelSelector':'G'})
        next(n for n in root.iter() if n.get('id')==name).set('filter','url(#'+fid+')')
    if len(defs):root.insert(0,defs)
    return symbol,ET.tostring(root,encoding='unicode'),{'renamed':renames,'omitted':sorted(found),'warnings':warnings}
if __name__=='__main__':
    try:
        source,recipe,out=sys.argv[1:];symbol,svg,report=prepare(Path(source).read_text(),json.loads(Path(recipe).read_text()))
        Path(out+'.json').write_text(json.dumps(symbol,ensure_ascii=False,indent=2)+'\n')
        Path(out+'.svg').write_text(svg+'\n')
        print(json.dumps(report,ensure_ascii=False,indent=2))
    except (ValueError,KeyError,ET.ParseError) as e:sys.exit(str(e))
