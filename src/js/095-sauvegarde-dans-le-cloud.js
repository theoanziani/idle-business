/* ============================================================
   SAUVEGARDE DANS LE CLOUD
   Le jeu reconnaît l'appareil : Google Play Jeux sur Android (pont IBNative.cloud),
   iCloud sur iPhone (pont webkit.messageHandlers.ibcloud). Dans un navigateur : rien.
   Protocole commun : le jeu envoie {id, op, ...} en JSON, l'appli répond en appelant
   window.ibCloudCb({id, ok, data | error}).
   Opérations : status, signin, list, get, put, del.
   ============================================================ */
const CL={plat:null, st:null, busy:false, cb:{}, seq:0, push:{}, conf:[], err:'', pulling:false, lastTry:0};
function clPlat(){
  if(window.IBNative&&typeof window.IBNative.cloud==='function') return 'android';
  if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.ibcloud) return 'ios';
  return null;
}
CL.plat=clPlat();
const clName=()=>CL.plat==='android'? 'Google Play Jeux' : 'iCloud';
window.ibCloudCb=function(r){
  try{ if(typeof r==='string') r=JSON.parse(r); const f=r&&CL.cb[r.id]; if(f){ delete CL.cb[r.id]; f(r); } }catch(e){ console.error(e); }
};
function clCall(op,args){
  return new Promise((res,rej)=>{
    if(!CL.plat) return rej(new Error('Cloud indisponible ici.'));
    const id=++CL.seq, req=Object.assign({id,op},args||{});
    const to=setTimeout(()=>{ if(CL.cb[id]){ delete CL.cb[id]; rej(new Error('Le cloud ne répond pas.')); } }, op==='signin'? 120000 : 45000);
    CL.cb[id]=r=>{ clearTimeout(to); r.ok? res(r.data) : rej(new Error(r.error||'Erreur du cloud.')); };
    try{
      const s=JSON.stringify(req);
      if(CL.plat==='android') window.IBNative.cloud(s); else window.webkit.messageHandlers.ibcloud.postMessage(s);
    }catch(e){ clearTimeout(to); delete CL.cb[id]; rej(e); }
  });
}

/* ---------- Préférences (sur l'appareil) ---------- */
function clPrefs(){ try{ const p=JSON.parse(localStorage.getItem('ib.cloud')||'{}'); return {on:p.on!==false, sync:p.sync||{}, at:p.at||0}; }catch(e){ return {on:true,sync:{},at:0}; } }
function clSet(fn){ const p=clPrefs(); fn(p); try{ localStorage.setItem('ib.cloud',JSON.stringify(p)); }catch(e){} return p; }
function clMark(slot,upd){ clSet(p=>{ if(upd) p.sync[slot]=upd; else delete p.sync[slot]; }); }
const clReady=()=>!!(CL.plat&&CL.st&&CL.st.signedIn&&clPrefs().on);

/* ---------- Emballage d'une partie ---------- */
async function clPack(st){
  const json=JSON.stringify(st,svRound);
  if(svGz()){
    try{ const buf=new Uint8Array(await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
      let bin=''; for(let i=0;i<buf.length;i+=8192) bin+=String.fromCharCode.apply(null,buf.subarray(i,i+8192)); return 'IB2:'+btoa(bin); }catch(e){}
  }
  return 'IBJ:'+btoa(unescape(encodeURIComponent(json)));
}
async function clUnpack(t){
  t=String(t||'');
  if(t.indexOf('IB2:')===0){ const bin=atob(t.slice(4)), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    return JSON.parse(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text()); }
  if(t.indexOf('IBJ:')===0) return JSON.parse(decodeURIComponent(escape(atob(t.slice(4)))));
  return null;
}
function clRemote(x){
  let m=null; try{ m=typeof x.meta==='string'? JSON.parse(x.meta) : x.meta; }catch(e){}
  return {slot:+x.slot, meta:m||{}, updated:+(x.updated||(m&&m.updated)||0)};
}

/* ---------- Envoi, récupération ---------- */
async function clPush(i){
  const L=SV.meta[i-1]; if(!L) return;
  const st=(S&&SV.slot===i)? S : await svRead(i); if(!st) return;
  const meta=Object.assign({},L), code=await clPack(st);
  await clCall('put',{slot:i, updated:L.updated, meta:JSON.stringify(meta), payload:JSON.stringify({v:1,meta,code})});
  clMark(i,L.updated);
}
async function clPull(i,r){
  const raw=await clCall('get',{slot:i}); const obj=typeof raw==='string'? JSON.parse(raw) : raw;
  const s=await clUnpack(obj&&obj.code); if(!svValid(s)) throw new Error('Partie du cloud illisible.');
  CL.pulling=true; let ok=false;
  try{ ok=await svPut(i,s,r.updated); }finally{ CL.pulling=false; }
  if(!ok) throw new Error('Impossible d’enregistrer la partie sur l’appareil.');
  clMark(i,r.updated);
}
function clSchedule(i){
  if(!clReady()) return;
  clearTimeout(CL.push[i]); CL.push[i]=setTimeout(()=>{ delete CL.push[i]; clPush(i).catch(e=>{ CL.err=e.message; }); },20000);
}
async function clFlush(){
  const ks=Object.keys(CL.push); if(!ks.length||!clReady()) return;
  for(const k of ks){ clearTimeout(CL.push[k]); delete CL.push[k]; try{ await clPush(+k); }catch(e){ CL.err=e.message; } }
}

/* ---------- Synchronisation complète ---------- */
async function clStatus(){
  try{ CL.st=await clCall('status'); }catch(e){ CL.st={available:false, error:e.message}; }
  return CL.st;
}
async function clSync(){
  if(!CL.plat||CL.busy||!SV.ready) return;
  CL.busy=true; CL.err=''; CL.lastTry=Date.now(); clRefresh();
  let pulled=false;
  try{
    if(!CL.st||!CL.st.signedIn) await clStatus();
    if(!clReady()) return;
    const R={}; ((await clCall('list'))||[]).map(clRemote).forEach(r=>{ if(r.slot>=1&&r.slot<=SV.N) R[r.slot]=r; });
    for(let i=1;i<=SV.N;i++){
      const L=SV.meta[i-1], r=R[i], last=clPrefs().sync[i]||0, active=!!(S&&SV.slot===i);
      if(!L&&!r){ clMark(i,null); continue; }
      if(r&&!L){ if(!active){ await clPull(i,r); pulled=true; } continue; }
      if(L&&!r){ await clPush(i); continue; }
      if(r.updated===L.updated){ clMark(i,L.updated); continue; }
      const lc=L.updated>last, rc=r.updated>last;
      if(lc&&!rc) await clPush(i);
      else if(rc&&!lc&&!active){ await clPull(i,r); pulled=true; }
      else if(!CL.conf.some(c=>c.slot===i)) CL.conf.push({slot:i, L:Object.assign({},L), r});
    }
    clSet(p=>{ p.at=Date.now(); });
  }catch(e){ CL.err=e.message||'Erreur du cloud.'; }
  finally{
    CL.busy=false;
    if(CL.conf.length&&!ui.modal) ui.modal={type:'clconf'};
    if(pulled||CL.conf.length||!S) render(); else clRefresh();
  }
}
function clRefresh(){ if(!S || (ui.tab==='set'&&!ui.modal) || (ui.modal&&ui.modal.type==='tset')) try{ render(); }catch(e){} }

/* ---------- Branchements sur les sauvegardes ---------- */
{ const _put=svPut; svPut=async function(slot,st,upd){ const ok=await _put(slot,st,upd); if(ok&&!CL.pulling) clSchedule(slot); return ok; }; }
{ const _del=svDelete; svDelete=async function(slot){ await _del(slot); clearTimeout(CL.push[slot]); delete CL.push[slot]; clMark(slot,null); if(clReady()) clCall('del',{slot}).catch(e=>{ CL.err=e.message; }); }; }
document.addEventListener('visibilitychange',()=>{
  if(!CL.plat) return;
  if(document.hidden){ Promise.resolve(window.svFlush&&svFlush()).then(clFlush).catch(()=>{}); }
  else if(Date.now()-CL.lastTry>60000) clSync();
});
window.ibCloudFlush=()=>Promise.resolve(svFlush()).then(clFlush);
(function clBoot(){ if(!CL.plat) return; if(!SV.ready) return setTimeout(clBoot,300); clSync(); })();

/* ---------- Interface ---------- */
function clLine(){
  if(!CL.plat||(CL.st&&CL.st.configured===false)) return '';
  let t;
  if(CL.busy) t='Synchronisation avec '+clName()+'…';
  else if(!CL.st) t='Connexion à '+clName()+'…';
  else if(CL.st.signedIn&&!clPrefs().on) t='Sauvegarde dans le cloud désactivée';
  else if(CL.st.signedIn) t=CL.err? 'Cloud : '+CL.err : (clPrefs().at? 'Synchronisé avec '+clName()+' '+svAgo(clPrefs().at) : 'Connecté à '+clName());
  else t='Cloud non connecté : touchez Réglages';
  return '<p class="cl-line" role="status">'+esc(t)+'</p>';
}
function clBody(){
  if(!CL.plat) return '<p class="sub" style="margin:0">La sauvegarde dans le cloud fonctionne dans l’appli : Google Play Jeux sur Android, iCloud sur iPhone et iPad. Ici, copiez de temps en temps votre code de sauvegarde.</p>';
  const st=CL.st, p=clPrefs(); let h='<div class="stack"><div class="row sp"><b>'+clName()+'</b>';
  if(!st) return h+'<span class="sub">Vérification…</span></div></div>';
  if(st.configured===false) return h+'</div><p class="sub" style="margin:0">Pas encore activé dans cette version de l’appli.</p></div>';
  if(!st.signedIn){
    h+='<span class="pill">Non connecté</span></div>';
    h+= CL.plat==='android'
      ? '<p class="sub" style="margin:0">Connectez votre compte Google pour retrouver vos parties sur tous vos appareils Android.</p><div>'+btn('Se connecter avec Google','clsignin',{c:'pri'})+'</div>'
      : '<p class="sub" style="margin:0">Connectez-vous à iCloud dans les Réglages de l’iPhone (iCloud Drive activé), puis réessayez.</p><div>'+btn('Réessayer','clsignin',{c:'pri'})+'</div>';
    return h+(CL.err? '<p class="sub" style="margin:0;color:var(--red)">'+esc(CL.err)+'</p>' : '')+'</div>';
  }
  h+='<span class="pill" style="background:var(--green-soft);color:var(--green)">Connecté</span></div>';
  if(st.account) h+='<p class="sub" style="margin:0">Compte : '+esc(st.account)+'</p>';
  h+='<div class="row sp"><span>Sauvegarde automatique</span><div class="seg">'+[['1','Activée'],['0','Désactivée']].map(x=>'<button class="'+((p.on?'1':'0')===x[0]?'on':'')+'" data-a="clon" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>';
  h+='<p class="sub" style="margin:0">'+(CL.busy? 'Synchronisation en cours…' : p.at? 'Dernière synchronisation '+svAgo(p.at)+'.' : 'Pas encore synchronisé.')+' Vos 5 emplacements sont envoyés dans le cloud et récupérés sur vos autres appareils.</p>';
  if(CL.err) h+='<p class="sub" style="margin:0;color:var(--red)">'+esc(CL.err)+'</p>';
  return h+'<div>'+btn('Synchroniser maintenant','clsync',{c:'sm',dis:CL.busy||!p.on})+'</div></div>';
}
ACT.clsignin=async()=>{ try{ CL.st=await clCall('signin'); CL.err=''; }catch(e){ CL.err=e.message; } render(); clSync(); };
ACT.clsync=()=>{ clSync(); render(); };
ACT.clon=el=>{ const on=el.dataset.v==='1'; clSet(p=>{ p.on=on; }); render(); if(on) clSync(); };
function clCmp(t,m){
  return '<div class="cl-v"><b>'+esc(t)+'</b><span>'+dateL(m.day||1)+' · '+eur(m.nw||0,0)+'</span><small>'+(m.updated? 'Enregistrée '+svAgo(m.updated) : '')+'</small></div>';
}
ACT.clkeep=async()=>{ const c=CL.conf.shift(); ui.modal=CL.conf.length? {type:'clconf'} : null; render(); if(c){ try{ await clPush(c.slot); }catch(e){ CL.err=e.message; } } clRefresh(); };
ACT.cltake=async()=>{
  const c=CL.conf.shift(); ui.modal=CL.conf.length? {type:'clconf'} : null;
  if(c){
    try{
      const active=S&&SV.slot===c.slot;
      if(active){ SV.dirty=false; clearTimeout(SV.t); SV.t=null; }
      await clPull(c.slot,c.r);
      if(active&&await svLoadGame(c.slot)){ computeNW(); ui.delta=null; toast('Partie du cloud chargée.','good'); }
    }catch(e){ CL.err=e.message; toast(e.message,'bad'); }
  }
  render();
};
{ const _mc=modalContent; modalContent=function(){
  const m=ui.modal;
  if(m&&m.type==='clconf'){
    const c=CL.conf[0]; if(!c){ ui.modal=null; return _mc(); }
    return {title:'Deux versions de « '+esc(c.L.name||c.r.meta.name||'Partie')+' »',sm:true,body:'<p style="margin:0">Cette partie (emplacement '+c.slot+') a avancé ici et sur un autre appareil. Laquelle garder ?</p>'+
      '<div class="cl-cmp">'+clCmp('Sur cet appareil',c.L)+clCmp('Dans '+clName(),Object.assign({},c.r.meta,{updated:c.r.updated}))+'</div>'+
      '<div class="row sp">'+btn('Garder celle-ci','clkeep',{c:''})+btn('Prendre celle du cloud','cltake',{c:'pri'})+'</div><p class="sub" style="margin:0">L’autre version sera remplacée.</p>'};
  }
  if(m&&m.type==='tset'){ const r=_mc(); if(r) r.body=r.body.replace(/<\/div>$/,'')+'<div class="sep"></div><b>Sauvegarde dans le cloud</b>'+clBody()+'</div>'; return r; }
  return _mc();
}; }
{ const _vs=vSet; vSet=function(){ return _vs().replace('<div class="sub" style="text-align:center">Idle Business', card('Sauvegarde dans le cloud',clBody())+'$&'); }; VIEWS.set=vSet; }
{ const _vt=vTitle; vTitle=function(){ return _vt().replace(/<\/section><\/div>$/, clLine()+'</section></div>'); }; }

