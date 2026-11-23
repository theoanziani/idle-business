/* ============================================================
   VERSION WEB (site) : installation sur l'écran d'accueil et fichier de sauvegarde.
   - Sur le site, le navigateur peut effacer les données d'une page peu utilisée
     (Safari : 7 jours) ; une fois le jeu installé sur l'écran d'accueil, elles sont gardées.
   - « Copie de sauvegarde » : télécharger un fichier .ibsave et le rouvrir plus tard,
     sur n'importe quel appareil (web, Android, iPhone).
   ============================================================ */
const WEB={prompt:null};
const webNative=()=>!!(window.IBNative&&typeof window.IBNative.cloud==='function')||!!(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.ibcloud);
const webSite=()=>/^https?:$/.test(location.protocol)&&!webNative()&&window.top===window;
const webInstalled=()=>{ try{ return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true; }catch(e){ return false; } };
const webIOS=()=>/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); WEB.prompt=e; if(!S) try{ render(); }catch(x){} });
window.addEventListener('appinstalled',()=>{ WEB.prompt=null; ui.modal=null; toast('Idle Business est installé sur votre écran d’accueil.','good'); render(); });

/* ---------- Fichier de sauvegarde ---------- */
function webLastBackup(){ try{ return +localStorage.getItem('ib.backup')||0; }catch(e){ return 0; } }
function webFileName(m){ const n=String((m&&m.name)||'Partie').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'')||'Partie'; return 'IdleBusiness-'+n+'-jour'+((m&&m.day)||0)+'.ibsave'; }
async function webSaveFile(slot){
  let st, m;
  if(S&&(!slot||slot===SV.slot)){ await svFlush(); st=S; m=SV.meta[SV.slot-1]||{name:S.name,day:S.day}; }
  else { st=await svRead(slot); m=SV.meta[slot-1]; }
  if(!st){ toast('Aucune partie à enregistrer.','bad'); return; }
  const code=await clPack(st), name=webFileName(m);
  // Page Claude : seul le service de téléchargement de Claude peut remettre un fichier (en .txt).
  if(window.claude&&typeof window.claude.use==='function'){
    const dl=await window.claude.use('downloads').catch(()=>null);
    if(dl){ try{ await dl.save({filename:name.replace(/\.ibsave$/,'.txt'), data:code}); try{ localStorage.setItem('ib.backup',String(Date.now())); }catch(e){} toast('Copie de sauvegarde créée.','good'); render(); }
      catch(e){ if(!e||e.code!=='declined') toast('Impossible de créer le fichier ici.','bad'); } return; }
  }
  const blob=new Blob([code],{type:'application/octet-stream'});
  try{
    const f=typeof File==='function'? new File([blob],name,{type:'application/octet-stream'}) : null;
    if(f&&webIOS()&&navigator.canShare&&navigator.canShare({files:[f]})){ await navigator.share({files:[f],title:'Sauvegarde Idle Business'}); }
    else { const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },1500); }
    try{ localStorage.setItem('ib.backup',String(Date.now())); }catch(e){}
    toast('Copie de sauvegarde créée : '+name,'good'); render();
  }catch(e){ if(!(e&&e.name==='AbortError')) toast('Impossible de créer le fichier.','bad'); }
}
function webOpenFile(){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='.ibsave,.txt,text/plain,application/octet-stream';
  inp.onchange=async()=>{
    const f=inp.files&&inp.files[0]; if(!f) return;
    let t=''; try{ t=(await f.text()).trim(); }catch(e){}
    let st=null; try{ st=await clUnpack(t); }catch(e){}
    if(!svValid(st)){ const keep=S; try{ if(await importCode(t)) st=S; }catch(e){} S=keep; }
    if(!svValid(st)){ toast('Ce fichier n’est pas une sauvegarde Idle Business.','bad'); return; }
    const free=tsFree();
    if(S){ ask('Ouvrir cette sauvegarde ?','La partie en cours est enregistrée, puis « '+esc(st.name||'Partie')+' » ('+dateL(st.day||1)+') s’ouvre dans '+(free? 'l’emplacement '+free : 'cet emplacement, à la place de la partie en cours')+'.','Ouvrir',async()=>{ await svFlush(); await webPlace(st,free||SV.slot); }); return; }
    if(!free){ ui.modal={type:'saves'}; render(); toast('Les 5 emplacements sont pris : supprimez une sauvegarde puis rouvrez le fichier.','bad'); return; }
    await webPlace(st,free);
  };
  inp.click();
}
async function webPlace(st,slot){
  if(!(await svPut(slot,st))){ toast('Impossible d’enregistrer la partie sur cet appareil.','bad'); return; }
  if(await svLoadGame(slot)){ computeNW(); ui.modal=null; ui.tab='home'; ui.delta=null; toast('Partie ouverte dans l’emplacement '+slot+'.','good'); if(!$('#top')) mount(); render(); }
}
ACT.wsave=el=>webSaveFile(+el.dataset.i||0);
ACT.wopen=()=>webOpenFile();
ACT.winst=async()=>{
  if(WEB.prompt){ const p=WEB.prompt; WEB.prompt=null; try{ await p.prompt(); await p.userChoice; }catch(e){} render(); return; }
  ui.modal={type:'winst'}; render();
};
function webBackupBody(){
  const last=webLastBackup(), n=svCount();
  return '<div class="stack"><p class="sub" style="margin:0">Un fichier qui contient votre partie : gardez-le (Fichiers, iCloud Drive, Google Drive…) et rouvrez-le sur n’importe quel appareil.'+(last? ' Dernière copie '+svAgo(last)+'.' : '')+'</p>'+
    '<div class="row">'+(S||n? btn('Télécharger la sauvegarde','wsave',{c:'pri',i:S? SV.slot : svLast()}) : '')+btn('Ouvrir un fichier','wopen',{c:''})+'</div></div>';
}
function webInstallLine(){
  if(!webSite()||webInstalled()) return '';
  if(!WEB.prompt&&!webIOS()) return '';
  return '<button class="ts-inst" data-a="winst"><b>Installer le jeu</b><span>Sur l’écran d’accueil, vos parties sont gardées en sécurité.</span></button>';
}
{ const _mc=modalContent; modalContent=function(){
  const m=ui.modal;
  if(m&&m.type==='winst') return {title:'Installer Idle Business',sm:true,body:'<div class="stack">'+
    (webIOS()
      ? '<ol class="w-steps"><li>Touchez le bouton <b>Partager</b> <span class="w-share" aria-hidden="true"></span> en bas de Safari (ou en haut sur iPad).</li><li>Choisissez <b>Sur l’écran d’accueil</b> (faites défiler si besoin).</li><li>Touchez <b>Ajouter</b>, puis ouvrez le jeu depuis sa nouvelle icône.</li></ol><p class="sub" style="margin:0">Sur iPhone, l’installation se fait depuis Safari. Les parties commencées ici ne passent pas automatiquement dans l’appli installée : téléchargez d’abord une copie de sauvegarde, puis ouvrez-la dans le jeu installé.</p>'
      : '<p style="margin:0">Ouvrez le menu du navigateur (⋮) puis <b>Installer l’application</b> ou <b>Ajouter à l’écran d’accueil</b>.</p>')+
    '<div>'+btn('J’ai compris','closemodal',{c:'pri'})+'</div></div>'};
  if(m&&m.type==='timport'){ const r=_mc(); if(r&&!webNative()) r.body='<div class="stack"><p class="sub" style="margin:0">Vous avez un fichier de sauvegarde (.ibsave) ?</p><div>'+btn('Ouvrir un fichier','wopen',{c:'pri'})+'</div><div class="sep"></div></div>'+r.body; return r; }
  if(m&&m.type==='tset'){ const r=_mc(); if(r&&!webNative()) r.body=r.body.replace(/<\/div>$/,'')+'<div class="sep"></div><b>Copie de sauvegarde</b>'+webBackupBody()+'</div>'; return r; }
  return _mc();
}; }
{ const _vs=vSet; vSet=function(){ let h=_vs(); if(!webNative()) h=h.replace('<div class="sub" style="text-align:center">Idle Business', card('Copie de sauvegarde',webBackupBody())+'$&'); return h; }; VIEWS.set=vSet; }
{ const _vt=vTitle; vTitle=function(){ return _vt().replace(/<\/section><\/div>$/, webInstallLine()+'</section></div>'); }; }

/* ---------- Nouvelle version du site disponible ---------- */
window.ibOnUpdate=function(){
  if(!S){ location.reload(); return; }
  if(document.getElementById('ib-upd')) return;
  const d=document.createElement('div'); d.id='ib-upd'; d.className='ib-upd'; d.setAttribute('role','status');
  d.innerHTML='<span>Nouvelle version du jeu prête.</span><button class="btn pri sm" type="button">Mettre à jour</button>';
  d.querySelector('button').onclick=async()=>{ try{ await svFlush(); }catch(e){} location.reload(); };
  document.body.appendChild(d);
};
if(window.ibUpdateReady) window.ibOnUpdate();

/* Logo du jeu (image), utilisé par l'écran de chargement et la pastille de l'accueil */
const LOGO_URI='data:image/webp;base64,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';
try{ document.documentElement.style.setProperty('--logo','url("'+LOGO_URI+'")'); }catch(e){}

