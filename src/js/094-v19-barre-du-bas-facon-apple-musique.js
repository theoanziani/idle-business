/* ============================================================
   V19 : barre du bas façon Apple Musique
   - verre dépoli, pastille de sélection qui glisse d'un onglet à l'autre
   - glisser le doigt le long de la barre pour changer d'onglet
   - en défilant vers le bas, la barre devient plus fine (libellés masqués) sans bouger les boutons
   ============================================================ */
const NAVG = { last:null, mini:false, drag:null, lastY:0 };
function navItems(){ return [...document.querySelectorAll('#nav .nv')]; }
function navActive(){ return document.querySelector('#nav .nv.act'); }
function placeInd(el,instant){
  const nav=$('#nav'); if(!nav||!el) return;
  let ind=nav.querySelector('.nv-ind'); if(!ind){ ind=document.createElement('span'); ind.className='nv-ind'; ind.setAttribute('aria-hidden','true'); nav.prepend(ind); }
  const nr=nav.getBoundingClientRect(), r=el.getBoundingClientRect();
  const box={x:r.left-nr.left, y:r.top-nr.top, w:r.width, h:r.height};
  if(instant) ind.style.transition='none';
  ind.style.transform='translate('+box.x+'px,'+box.y+'px)'; ind.style.width=box.w+'px'; ind.style.height=box.h+'px';
  if(instant){ void ind.offsetWidth; ind.style.transition=''; }
  return box;
}
function navAfterRender(){
  const nav=$('#nav'); if(!nav||!S) return;
  nav.classList.add('glass'); nav.classList.toggle('mini',NAVG.mini);
  const act=navActive(); if(!act) return;
  // repartir de l'ancienne position, puis glisser vers la nouvelle
  if(NAVG.last){ const ind=document.createElement('span'); ind.className='nv-ind'; ind.setAttribute('aria-hidden','true'); nav.prepend(ind);
    ind.style.transition='none'; ind.style.transform='translate('+NAVG.last.x+'px,'+NAVG.last.y+'px)'; ind.style.width=NAVG.last.w+'px'; ind.style.height=NAVG.last.h+'px'; void ind.offsetWidth; ind.style.transition=''; }
  requestAnimationFrame(()=>{ NAVG.last=placeInd(act, !NAVG.last || RM()); });
}
{ const _r4=render; render=function(){ _r4(); try{ navAfterRender(); }catch(e){ console.error(e); } }; }

/* Glisser le doigt sur la barre */
function navAt(x){ let best=null, bd=1e9; navItems().forEach(el=>{ const r=el.getBoundingClientRect(), c=(r.left+r.right)/2, d=Math.abs(x-c); if(d<bd){ bd=d; best=el; } }); return best; }
document.addEventListener('pointerdown',e=>{
  const nav=e.target.closest&&e.target.closest('#nav'); if(!nav||!S) return;
  NAVG.drag={x0:e.clientX, start:navAt(e.clientX), cur:null, moved:false, id:e.pointerId};
},true);
document.addEventListener('pointermove',e=>{
  const g=NAVG.drag; if(!g||e.pointerId!==g.id) return;
  if(!g.moved&&Math.abs(e.clientX-g.x0)<8) return;
  g.moved=true; const nav=$('#nav'); nav.classList.add('dragging');
  const el=navAt(e.clientX);
  if(el&&el!==g.cur){ g.cur=el; navItems().forEach(n=>n.classList.toggle('hov',n===el)); placeInd(el); try{ if(typeof haptic==='function') haptic('sel'); else if(navigator.vibrate) navigator.vibrate(4); }catch(_){} }
},true);
['pointerup','pointercancel'].forEach(k=>document.addEventListener(k,e=>{
  const g=NAVG.drag; if(!g||e.pointerId!==g.id) return; NAVG.drag=null;
  const nav=$('#nav'); if(nav){ nav.classList.remove('dragging'); navItems().forEach(n=>n.classList.remove('hov')); }
  if(!g.moved) return;
  const el=g.cur;
  if(k==='pointerup'&&el){ NAVG.suppress=true; setTimeout(()=>{ NAVG.suppress=false; },350); if(!el.classList.contains('act')){ NAVG.last=placeInd(el); ACT.tab(el); } else { const a=navActive(); if(a) placeInd(a); } }
  else { const a=navActive(); if(a) placeInd(a); }
},true));
document.addEventListener('click',e=>{ if(NAVG.suppress&&e.target.closest&&e.target.closest('#nav')){ e.stopPropagation(); e.preventDefault(); } },true);

/* Réduction au défilement */
window.addEventListener('scroll',()=>{
  const y=window.scrollY, dy=y-NAVG.lastY; NAVG.lastY=y;
  const nav=$('#nav'); if(!nav||!S) return;
  let m=NAVG.mini;
  if(y<60) m=false; else if(dy>6) m=true; else if(dy<-6) m=false;
  if(m!==NAVG.mini){ NAVG.mini=m; nav.classList.toggle('mini',m); navFollow(); }
},{passive:true});
/* la pastille suit la barre pendant qu'elle change de hauteur */
function navFollow(){ const t0=performance.now(); const step=()=>{ const a=navActive(); if(a) NAVG.last=placeInd(a,true); if(performance.now()-t0<380) requestAnimationFrame(step); }; requestAnimationFrame(step); }
window.addEventListener('resize',()=>{ const a=navActive(); if(a) NAVG.last=placeInd(a,true); });

/* ---------- Écran d'accueil « Ville vivante » (après le chargement) ---------- */
const TSI={
  set:'<path d="M4 7h9M19 7h1M4 17h3M13 17h7"/><circle cx="16" cy="7" r="2.6"/><circle cx="10" cy="17" r="2.6"/>',
  save:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 4v5h8V4M8 20v-6h8v6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  imp:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  shop:'<path d="M4 9h16l-1 11H5zM8 9V7a4 4 0 0 1 8 0v2"/>',
  chart:'<path d="M4 19h16M6 15l4-4 3 3 5-6"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
const tsIco=(k,cls)=>'<svg class="'+(cls||'')+'" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+TSI[k]+'</svg>';
function tsFree(){ for(let i=1;i<=SV.N;i++) if(!SV.meta[i-1]) return i; return 0; }
function tsSky(cid){
  let a=(typeof CITY_ART!=='undefined')&&(CITY_ART[cid]||CITY_ART.paris); if(!a) return '';
  /* l'illustration garde ses proportions, posée en bas ; le ciel continue au-dessus avec sa couleur du haut */
  const top=(a.match(/id="[a-z]*sky"[^>]*><stop offset="0" stop-color="([^"]+)"/)||[])[1]||'#0B1020';
  a=a.replace('<svg ','<svg preserveAspectRatio="xMidYMax meet" ').replace(/(<clipPath[^>]*><rect[^>]*?) rx="22"/,'$1');
  return '<div class="cban ts-sky" aria-hidden="true" style="background:'+top+'">'+a+'</div>';
}
function tsTier(m){
  const t=Math.max(0,Math.min(D.TIERS.length-1,m.tier||0)), nx=D.TIERS[t+1];
  if(!nx) return {name:D.TIERS[t].n, next:null, pct:100};
  const a=D.TIERS[t].nw, p=Math.round(Math.max(0,Math.min(1,((m.nw||0)-a)/(nx.nw-a)))*100);
  return {name:D.TIERS[t].n, next:nx.n, pct:p};
}
vTitle=function(){
  const rdy=SV.ready, n=svCount(), last=svLast(), m=last? SV.meta[last-1] : null;
  const head='<div class="ts-top"><div class="ts-logo"><span class="ts-coin" aria-hidden="true">€</span><b>Idle Business</b></div>'+
    '<button class="ts-ib" data-a="tset" aria-label="Réglages">'+tsIco('set')+'</button></div>';
  let body;
  if(!rdy){
    body='<b class="ts-h">Idle Business</b><button class="btn pri stamp ts-go" disabled>Chargement…</button>';
  } else if(m){
    const t=tsTier(m);
    body='<div class="ts-row"><div><span class="ts-k">Reprendre</span><b class="ts-name">'+esc(m.name)+'</b></div><span class="pill">'+esc(t.name)+'</span></div>'+
      '<div class="ts-stats"><div><span>Jour</span><b>'+m.day+'</b></div><div><span>Patrimoine</span><b class="pos">'+eur(m.nw,0)+'</b></div><div><span>Sociétés</span><b>'+(m.biz===undefined?'–':m.biz)+'</b></div></div>'+
      (t.next? '<div class="ts-prog"><div><span>Vers '+esc(t.next)+'</span><span>'+t.pct+' %</span></div><i><b style="width:'+t.pct+'%"></b></i></div>' : '<div class="ts-prog"><div><span>Palier maximum atteint</span><span></span></div></div>')+
      '<button class="btn pri stamp ts-go" data-a="continue"><span>Continuer</span><small>Emplacement '+last+' · '+esc(svAgo(m.updated))+'</small></button>'+
      '<div class="ts-2">'+'<button class="btn" data-a="browse">'+tsIco('save')+'Sauvegardes '+n+'/'+SV.N+'</button>'+
      '<button class="btn" data-a="tsnew">'+tsIco('plus')+'Nouvelle partie</button></div>';
  } else {
    body='<b class="ts-h">Bâtissez votre empire,<br>un jour à la fois.</b>'+
      '<ul class="ts-feat">'+[['shop','Ouvrez des boutiques, des usines, des hôtels'],['chart','Investissez en bourse et dans l’immobilier'],['globe','Conquérez 18 villes, de Paris à Pékin']].map(x=>'<li><span>'+tsIco(x[0])+'</span>'+x[1]+'</li>').join('')+'</ul>'+
      '<button class="btn pri stamp ts-go" data-a="slotnew" data-i="1"><span>Nouvelle partie</span></button>'+
      '<div class="ts-2"><button class="btn" data-a="timpopen">'+tsIco('imp')+'Importer un code de sauvegarde</button></div>';
  }
  const city=(m&&m.city)||'paris';
  return '<div class="ts">'+tsSky(city)+'<div class="ts-fade" aria-hidden="true"></div>'+head+'<section class="ts-sheet">'+body+'</section></div>';
};
ACT.tsnew=()=>{ const f=tsFree(); if(f){ ui.modal={type:'newgame',slot:f}; } else { ui.modal={type:'saves'}; toast('Les 5 emplacements sont pris : supprimez une sauvegarde pour en créer une nouvelle.'); } render(); };
ACT.tset=()=>{ ui.modal={type:'tset'}; render(); };
ACT.timpopen=()=>{ ui.modal={type:'timport'}; render(); };
ACT.timport=async()=>{
  const ta=$('#ta-timp'); const t=ta? ta.value : ''; const f=tsFree();
  if(!f){ toast('Les 5 emplacements sont pris : supprimez une sauvegarde d’abord.','bad'); return; }
  if(await importCode(t)){ SV.slot=f; ui.modal=null; ui.tab='home'; computeNW(); toast('Partie importée dans l’emplacement '+f+'.','good'); mount(); render(); SV.dirty=true; svFlush(); }
  else toast('Code invalide.','bad');
};
{ const _mc=modalContent; modalContent=function(){
  const m=ui.modal;
  if(m&&m.type==='tset') return {title:'Réglages',sm:true,body:'<div class="stack"><div class="row sp"><b>Thème</b><div class="seg">'+[['auto','Système'],['light','Clair'],['dark','Sombre']].map(x=>'<button class="'+((ui.theme||'auto')===x[0]?'on':'')+'" data-a="theme" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div>'+
    '<div class="row sp"><b>Ciel des villes</b><div class="seg">'+[['cycle','Jour et nuit'],['real','Heure réelle']].map(x=>'<button class="'+(cityTimeMode()===x[0]?'on':'')+'" data-a="citytime" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</div></div></div>'};
  if(m&&m.type==='timport') return {title:'Importer une partie',sm:true,body:'<div class="stack"><label for="ta-timp" class="sub">Collez le code de sauvegarde (il commence par IB2:)</label><textarea id="ta-timp" class="inp" style="width:100%;height:110px;font-size:16px" placeholder="IB2:…"></textarea><div class="row sp">'+btn('Annuler','closemodal',{c:'ghost'})+btn('Importer','timport',{c:'pri'})+'</div></div>'};
  return _mc();
}; }

