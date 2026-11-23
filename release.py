"""Publie une version : python3 release.py V2.6.7 "Titre" "Texte de l'actualité"
Met à jour IB_VER et les actualités dans src/js, la version du cache dans sw.js, puis reconstruit index.html."""
import glob,re,sys,time
ver,title,text=sys.argv[1:4]; SITE='../idle-business'
for p in glob.glob('src/js/*.js'):
  s=open(p,encoding='utf-8').read()
  if "IB_VER='" not in s: continue
  s=re.sub(r"IB_VER='V[\d.]+'","IB_VER='"+ver+"'",s,1)
  m=re.search(r"\['[^'\n]*','[^'\n]*','V\d+\.\d+\.\d+'\],",s); assert m,'liste des actualités introuvable'
  q=lambda t:t.replace("\\","\\\\").replace("'","’")
  s=s[:m.start()]+"['"+q(title)+"','"+q(text)+"','"+ver+"'],"+s[m.start():]
  open(p,'w',encoding='utf-8').write(s); break
else: sys.exit('IB_VER introuvable')
stamp=time.strftime('%Y%m%d-%H%M%S'); w=open(SITE+'/sw.js').read()
w=re.sub(r'\d{8}-\d{6}',stamp,w); open(SITE+'/sw.js','w').write(w)
import subprocess; subprocess.run(['python3','build.py',SITE],check=True); print(ver,stamp)
