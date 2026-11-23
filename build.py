"""Construit le site : python3 build.py [dossier_site]. Concatène src/css et src/js (ordre des numéros) dans src/index.html."""
import glob,sys,os
out=sys.argv[1] if len(sys.argv)>1 else '../idle-business'
R=lambda p: open(p,encoding='utf-8').read()
h=R('src/index.html')
css=''.join(R(p) for p in sorted(glob.glob('src/css/*.css')))
js=''.join(R(p) for p in sorted(glob.glob('src/js/*.js')))
assert h.count('/*@CSS*/')==1 and h.count('/*@JS*/')==1
open(os.path.join(out,'index.html'),'w',encoding='utf-8').write(h.replace('/*@CSS*/',css,1).replace('/*@JS*/',js,1))
print('index.html', len(css)+len(js))
