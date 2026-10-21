"""Import a deliberately small, safe SVG subset. Fails rather than silently flattening artwork.
Usage: python3 scripts/svg-to-symbol.py drawing.svg symbol-id > symbol.json
SVG: semantic IDs, nested groups, solid paths/shapes, explicit attrs, simple transforms.
"""
import json, re, sys, xml.etree.ElementTree as ET
TAGS={'svg','g','rect','circle','ellipse','line','path','text'}
NUM={'x','y','width','height','cx','cy','r','ry','x1','x2','y1','y2','opacity','stroke-width','rx','font-size'}
ATTR=NUM|{'fill','stroke','d','text-anchor','stroke-linecap','stroke-linejoin'}
ID=re.compile(r'^[a-z][a-z0-9_-]*$')
def convert(filename,name):
    if not ID.fullmatch(name): raise ValueError('Invalid symbol ID')
    root=ET.parse(filename).getroot();layers=[];seen=set()
    def walk(node,parent=None):
        tag=node.tag.split('}')[-1]
        if tag in {'title','desc'}:return
        if tag not in TAGS: raise ValueError('Unsupported SVG element: '+tag)
        if tag=='svg':
            if node is not root:raise ValueError('Nested SVG viewport: use explicit groups')
            for key in node.attrib:
                if key not in {'viewBox','width','height','version','id'}:raise ValueError('Move root styling/transforms into an explicit group: '+key)
            for child in node:walk(child,parent)
            return
        if tag!='g' and len(node):raise ValueError('Unsupported children inside '+tag)
        key=node.get('id')
        if not key or not ID.fullmatch(key) or key in seen:raise ValueError('Every drawable/group needs a unique semantic id: '+str(key))
        seen.add(key);layer={'id':key,'tag':tag,'attrs':{}}
        if parent:layer['parent']=parent
        for k,v in node.attrib.items():
            if k=='id':continue
            if k=='data-pivot':
                origin=[float(x) for x in re.split(r'[ ,]+',v.strip())]
                if len(origin)!=2:raise ValueError('Pivot requires x y')
                layer['origin']=origin;continue
            if k=='transform':
                pose={};tail=v;order=[]
                for m in re.finditer(r'(translate|rotate|scale|skewX|skewY)\(([^)]+)\)',v):
                    tail=tail.replace(m.group(0),'',1);op=m[1];args=[float(x) for x in re.split(r'[ ,]+',m[2].strip())]
                    if op in order:raise ValueError('Repeated transforms: simplify in the SVG editor')
                    order.append(op)
                    if op=='translate' and len(args) in (1,2):pose.update(translateX=args[0],translateY=args[1] if len(args)==2 else 0)
                    elif op=='scale' and len(args) in (1,2) and (len(args)==1 or args[0]==args[1]):pose['scale']=args[0]
                    elif op=='rotate' and len(args)==1:pose['rotate']=args[0]
                    elif op in ('skewX','skewY') and len(args)==1:pose[op]=args[0]
                    else:raise ValueError('Unsupported transform; use nested groups and data-pivot')
                expected=['translate','rotate','skewX','skewY','scale']
                if tail.strip() or order!=sorted(order,key=expected.index):raise ValueError('Unsupported transform order: use nested groups')
                layer['pose']=pose;continue
            if k not in ATTR:raise ValueError('Unsupported SVG attribute: '+k+' (flatten CSS/use/patterns explicitly)')
            layer['attrs'][k]=float(v) if k in NUM else v
        if tag=='text':layer['text']=''.join(node.itertext())
        layers.append(layer)
        if tag=='g':
            for child in node:walk(child,key)
    walk(root)
    return {'id':name,'layers':layers}
if __name__=='__main__':
    try: print(json.dumps(convert(sys.argv[1],sys.argv[2]),ensure_ascii=False,indent=2))
    except (ValueError,IndexError,ET.ParseError) as error: sys.exit(str(error))
