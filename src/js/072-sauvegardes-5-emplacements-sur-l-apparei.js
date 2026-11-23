/* ============================================================
   SAUVEGARDES : 5 emplacements sur l'appareil.
   IndexedDB (partie compressée en gzip, métadonnées à part pour lister vite),
   repli sur localStorage si IndexedDB est indisponible.
   ============================================================ */
const SV={N:5, db:null, mode:'idb', meta:[null,null,null,null,null], slot:0, ready:false, dirty:false, t:null, busy:null, err:false};
const SV_LEGACY='grandlivre.v1';

const svReq=r=>new Promise((res,rej)=>{ r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); });
const svDone=tx=>new Promise((res,rej)=>{ tx.oncomplete=()=>res(true); tx.onerror=()=>rej(tx.error); tx.onabort=()=>rej(tx.error||new Error('abort')); });
const svGz=()=>typeof CompressionStream==='function'&&typeof DecompressionStream==='function'&&typeof Response==='function'&&typeof Blob==='function';

function svOpen(){
  return new Promise(res=>{
    try{
      if(typeof indexedDB==='undefined'||!indexedDB) return res(null);
      const q=indexedDB.open('idle-business',1);
      q.onupgradeneeded=()=>{ const d=q.result; d.createObjectStore('meta',{keyPath:'slot'}); d.createObjectStore('data',{keyPath:'slot'}); };
      q.onsuccess=()=>res(q.result); q.onerror=()=>res(null); q.onblocked=()=>res(null);
    }catch(e){ res(null); }
  });
}
/* Arrondit les nombres à 6 chiffres significatifs : sauvegardes bien plus légères */
const svRound=(k,v)=>(typeof v==='number'&&!Number.isInteger(v)&&isFinite(v))? +v.toPrecision(6) : v;
async function svEncode(obj,plain){
  const json=JSON.stringify(obj,svRound);
  if(!plain&&svGz()){
    try{ const buf=await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer(); return {fmt:'gz',buf}; }catch(e){}
  }
  return {fmt:'json',json};
}
async function svDecode(rec){
  if(rec.fmt==='gz') return JSON.parse(await new Response(new Blob([rec.buf]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  return JSON.parse(rec.json);
}
const svValid=s=>!!(s&&s.v===1&&s.mk&&s.biz);
function svMainCity(st){ const c={}; (st.biz||[]).forEach(b=>{ if(b.city) c[b.city]=(c[b.city]||0)+1; }); let best=null; for(const k in c) if(!best||c[k]>c[best]) best=k; return best||'paris'; }
function svMetaOf(st,slot,bytes){
  return {slot, name:st.name||'Partie', day:st.day, nw:Math.round(st.nw||0), cash:Math.round(st.cash||0), tier:tierOf(st.peakNW||0), updated:Date.now(), bytes:bytes||0, biz:(st.biz||[]).length, city:svMainCity(st)};
}

/* ---------- Écriture / lecture / suppression ---------- */
async function svPut(slot,st,upd){
  const meta=svMetaOf(st,slot); if(upd) meta.updated=upd;
  const enc=await svEncode(st,SV.mode==='ls');
  meta.bytes=enc.buf? enc.buf.byteLength : enc.json.length;
  if(SV.mode==='idb'){
    try{
      const tx=SV.db.transaction(['meta','data'],'readwrite');
      tx.objectStore('meta').put(meta); tx.objectStore('data').put(Object.assign({slot},enc));
      await svDone(tx); SV.meta[slot-1]=meta; return true;
    }catch(e){ SV.mode='ls'; return svPut(slot,st,upd); }
  }
  try{
    const e2=enc.fmt==='json'? enc : await svEncode(st,true);
    localStorage.setItem('ib.d.'+slot,e2.json); localStorage.setItem('ib.m.'+slot,JSON.stringify(meta));
    SV.meta[slot-1]=meta; return true;
  }catch(e){ return false; }
}
async function svRead(slot){
  try{
    if(SV.mode==='idb'){ const rec=await svReq(SV.db.transaction('data').objectStore('data').get(slot)); if(!rec) return null; const s=await svDecode(rec); return svValid(s)? s : null; }
    const t=localStorage.getItem('ib.d.'+slot); if(!t) return null; const s=JSON.parse(t); return svValid(s)? s : null;
  }catch(e){ return null; }
}
async function svDelete(slot){
  try{
    if(SV.mode==='idb'){ const tx=SV.db.transaction(['meta','data'],'readwrite'); tx.objectStore('meta').delete(slot); tx.objectStore('data').delete(slot); await svDone(tx); }
    else { localStorage.removeItem('ib.d.'+slot); localStorage.removeItem('ib.m.'+slot); }
  }catch(e){}
  SV.meta[slot-1]=null; if(SV.slot===slot) SV.slot=0;
}
async function svLoadMeta(){
  const out=[null,null,null,null,null];
  try{
    if(SV.mode==='idb'){ const all=await svReq(SV.db.transaction('meta').objectStore('meta').getAll()); all.forEach(m=>{ if(m&&m.slot>=1&&m.slot<=SV.N) out[m.slot-1]=m; }); }
    else for(let i=1;i<=SV.N;i++){ const t=localStorage.getItem('ib.m.'+i); if(t){ try{ out[i-1]=JSON.parse(t); }catch(e){} } }
  }catch(e){}
  SV.meta=out;
}

/* ---------- Démarrage : ouverture, migration de l'ancienne sauvegarde ---------- */
async function svInit(){
  SV.db=await svOpen(); SV.mode=SV.db? 'idb' : 'ls';
  await svLoadMeta();
  try{
    const old=localStorage.getItem(SV_LEGACY);
    if(old){
      const free=SV.meta.findIndex(m=>!m);
      if(free>=0){ const s=JSON.parse(old); if(svValid(s)){ if(!s.name) s.name='Partie'; if(await svPut(free+1,s)) localStorage.removeItem(SV_LEGACY); } }
      else localStorage.removeItem(SV_LEGACY);
    }
  }catch(e){}
  try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist(); }catch(e){}
  SV.ready=true;
}
function svLast(){ let b=0; SV.meta.forEach((m,i)=>{ if(m&&(!b||m.updated>SV.meta[b-1].updated)) b=i+1; }); return b; }
function svCount(){ return SV.meta.filter(Boolean).length; }
function svFree(){ return SV.meta.findIndex(m=>!m)+1; }

/* ---------- API utilisée par le jeu ---------- */
function saveGame(){
  if(!S||!SV.slot||S.over) return false;
  SV.dirty=true; if(!SV.t) SV.t=setTimeout(svFlush,1500); return true;
}
async function svFlush(){
  clearTimeout(SV.t); SV.t=null;
  if(SV.busy) await SV.busy;
  if(!SV.dirty||!S||!SV.slot||S.over) return !SV.err;
  SV.dirty=false; S.seen=Date.now();
  SV.busy=svPut(SV.slot,S).then(ok=>{ SV.err=!ok; return ok; }).finally(()=>{ SV.busy=null; });
  return SV.busy;
}
async function svLoadGame(slot){
  const s=await svRead(slot); if(!s) return false;
  S=migrateState(s); SV.slot=slot; SV.dirty=false; return true;
}
async function svNewGame(slot,name,cap,diff,mode){
  startGame(name,cap,undefined,diff); if(mode==='d100') d100Init(S); SV.slot=slot; SV.dirty=true; return svFlush();
}
function svAgo(ts){
  const m=Math.max(0,Math.round((Date.now()-ts)/60000));
  if(m<1) return 'à l’instant'; if(m<60) return 'il y a '+m+' min';
  const h=Math.round(m/60); if(h<24) return 'il y a '+h+' h';
  return 'il y a '+Math.round(h/24)+' j';
}

/* Code de sauvegarde compressé (gzip + base64), avec lecture des anciens codes */
async function exportCode(){
  const json=JSON.stringify(S,svRound);
  if(svGz()){ try{ const buf=new Uint8Array(await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()); let bin=''; for(let i=0;i<buf.length;i+=8192) bin+=String.fromCharCode.apply(null,buf.subarray(i,i+8192)); return 'IB2:'+btoa(bin); }catch(e){} }
  return btoa(unescape(encodeURIComponent(json)));
}
async function importCode(txt){
  txt=(txt||'').trim();
  if(txt.indexOf('IB2:')===0){ try{ const bin=atob(txt.slice(4)), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    const s=JSON.parse(await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text()); if(!s||s.v!==1||!s.mk) return false; S=migrateState(s); return true; }catch(e){ return false; } }
  return importSave(txt);
}

