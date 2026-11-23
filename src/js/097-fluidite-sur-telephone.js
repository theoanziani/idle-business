/* ============================================================
   FLUIDITÉ SUR TÉLÉPHONE
   1. Les illustrations animées (villes, activités) ne sont plus réanalysées à chaque
      rafraîchissement de l'écran : chaque image est préparée une seule fois puis
      réutilisée (déplacée ou copiée), ce qui supprime les à-coups pendant « Jour suivant ».
   2. Une illustration hors de l'écran est mise en pause, et reprend quand elle réapparaît.
   3. Mode « léger » sur écran tactile : pas de flou lumineux dans les illustrations,
      vignettes figées (seules les grandes images visibles restent animées), verre dépoli remplacé par un fond presque opaque.
   ============================================================ */
const PERF={lite:false, tpl:{}, io:null};
try{ PERF.lite=window.matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency||8)<=4; }catch(e){}
if(PERF.lite) document.documentElement.classList.add('perf-lite');

/* ---------- Illustrations préparées une fois ---------- */
function artSvg(key){
  const [kind,id,mode]=key.split('|');
  let a=kind==='a'? ((typeof ACT_ART!=='undefined')&&ACT_ART[id]) : CITY_ART[id];
  if(!a) return '';
  if(mode==='s'||mode==='t') a=a.replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ');
  if(mode==='t') a=a.replace(/(<clipPath[^>]*><rect[^>]*?) rx="22"/,'$1');
  return a;
}
function artNode(key){
  let t=PERF.tpl[key];
  if(!t){ const h=artSvg(key); if(!h) return null; t=document.createElement('template'); t.innerHTML=h; PERF.tpl[key]=t; }
  return t.content.firstElementChild.cloneNode(true);
}
cityBanner=function(cid,cls){
  if(!CITY_ART[cid]) return '';
  return '<div class="cban '+(cls||'')+'" aria-hidden="true" data-art="c|'+cid+'|'+(/fm|thumb/.test(cls||'')?'s':'n')+'"></div>';
};
actBanner=function(def,cls){
  if(!((typeof ACT_ART!=='undefined')&&ACT_ART[def])) return '';
  return '<div class="cban '+(cls||'')+'" aria-hidden="true" data-art="a|'+def+'|'+(/opt/.test(cls||'')?'s':'n')+'"></div>';
};
tsSky=function(cid){
  const id=CITY_ART[cid]? cid : 'paris'; if(!CITY_ART[id]) return '';
  return '<div class="cban ts-sky" aria-hidden="true" data-art="c|'+id+'|t"></div>';
};
function artCollect(){
  const pool={};
  document.querySelectorAll('.cban[data-art]').forEach(d=>{ const s=d.firstElementChild; if(s){ (pool[d.dataset.art]=pool[d.dataset.art]||[]).push(s); } });
  return pool;
}
function artHydrate(pool){
  const vh=(window.innerHeight||800)+600;   /* V2.1.3 : illustrations loin de l'écran posées plus tard (voir artLazy) */
  document.querySelectorAll('.cban[data-art]').forEach(d=>{
    if(d.firstElementChild) return;
    const list=pool[d.dataset.art];
    if(!(list&&list.length)){ const r=d.getBoundingClientRect(); if(r.top>vh||r.bottom<-600){ d.__lazy=1; return; } }
    const s=(list&&list.length)? list.shift() : artNode(d.dataset.art);
    if(s){ d.appendChild(s); d.setAttribute('data-sky','1'); }
  });
  // les nouvelles copies passent par le réglage du ciel (heure réelle, pauses)
  document.querySelectorAll('.cban[data-art]').forEach(d=>{ const s=d.firstElementChild; if(s&&!s.__sky){ s.__sky=1; d.removeAttribute('data-sky'); } });
  try{ applyCitySky(); }catch(e){}
}

/* ---------- Pause hors écran et vignettes figées ---------- */
const PERF_STILL=/(^|\s)(still|thumb|opt|fm)(\s|$)/;
function artShouldRun(d){ if(RM()) return false; if(d.classList.contains('still')) return false; if(PERF.lite&&PERF_STILL.test(d.className)) return false; return !d.__off; }
function artApply(d){ const s=d.firstElementChild; if(!s||typeof s.pauseAnimations!=='function') return; try{ artShouldRun(d)? s.unpauseAnimations() : s.pauseAnimations(); }catch(e){} }
if('IntersectionObserver' in window){
  PERF.io=new IntersectionObserver(es=>es.forEach(e=>{ e.target.__off=!e.isIntersecting; if(e.isIntersecting) artLazy(e.target); artApply(e.target); }),{rootMargin:'400px'});
}
function artLazy(d){ if(!d.__lazy||d.firstElementChild) return; d.__lazy=0; const s=artNode(d.dataset.art); if(s){ d.appendChild(s); s.__sky=1; try{ applyCitySky(); }catch(e){} } }
function artWatch(){
  document.querySelectorAll('.cban[data-art]').forEach(d=>{ if(!d.__watched){ d.__watched=1; if(PERF.io) PERF.io.observe(d); } artApply(d); });
}

{ const _r5=render; render=function(){ const pool=artCollect(); _r5(); try{ artHydrate(pool); artWatch(); }catch(e){ console.error(e); } }; }
document.addEventListener('visibilitychange',()=>{ document.querySelectorAll('.cban[data-art]').forEach(d=>{ const s=d.firstElementChild; if(!s||!s.pauseAnimations) return; try{ document.hidden? s.pauseAnimations() : artApply(d); }catch(e){} }); });

/* ---------- Un clic ne déplace pas la page ----------
   Les animations d'entrée (cartes qui montent de 14 px) ne se rejouent que lors d'un
   vrai changement d'onglet, plus à chaque rafraîchissement. Les positions de défilement
   (page, écran titre, fenêtre ouverte) sont remises exactement après tous les traitements. */
{ const _r6=render; render=function(){
  const v=document.getElementById('view'); if(v) v.classList.remove('enter');
  const nav=document.getElementById('nav'); if(nav) nav.classList.remove('navchg');
  const y=window.scrollY;
  const ts=document.querySelector('.ts'), tsy=ts? ts.scrollTop : 0;
  const mk=ui.modal? ui.modal.type+':'+(ui.modal.id===undefined?'':ui.modal.id)+':'+(ui.modal.slot||'') : null;
  const ov=document.querySelector('#modal-root .ov'), ovy=ov? ov.scrollTop : 0;
  _r6();
  if(window.scrollY!==y) window.scrollTo(0,y);
  const ts2=document.querySelector('.ts'); if(ts&&ts2) ts2.scrollTop=tsy;
  const mk2=ui.modal? ui.modal.type+':'+(ui.modal.id===undefined?'':ui.modal.id)+':'+(ui.modal.slot||'') : null;
  const ov2=document.querySelector('#modal-root .ov'); if(ov&&ov2&&mk===mk2) ov2.scrollTop=ovy;
}; }

/* ---------- Réglages > Barre du bas : l'éditeur s'ouvre dans une fenêtre ---------- */
ACT.baredit=()=>{ ui.modal={type:'baredit'}; render(); };
{ const _mc2=modalContent; modalContent=function(){ const m=ui.modal; if(m&&m.type==='baredit') return {title:'Barre du bas',sm:true,body:barEditor()+'<div style="margin-top:12px">'+btn('Terminé','closemodal',{c:'pri'})+'</div>'}; return _mc2(); }; }
/* Menu Plus : écrans récents en tête, raccourci vers la barre du bas. */
{ const _t=ACT.tab; ACT.tab=el=>{ const k=el.dataset.i; try{ if(k&&!['home','biz','plus'].includes(k)&&MENU.some(x=>x[0]===k)){ ui.recent=[k].concat((ui.recent||[]).filter(x=>x!==k)).slice(0,3); } }catch(e){} _t(el); try{ saveUI(); }catch(e){} }; }
{ const _vp=vPlus; vPlus=function(){ let h=_vp(); try{
    const R=(ui.recent||[]).map(k=>MENU.find(x=>x[0]===k)).filter(Boolean);
    const rec=R.length? '<div class="cat-h">Récemment ouverts</div><div class="row" style="flex-wrap:wrap;gap:8px;margin-bottom:6px">'+R.map(x=>'<button class="btn sm" data-a="tab" data-i="'+x[0]+'">'+esc(x[1])+'</button>').join('')+'</div>' : '';
    const i=h.indexOf('<div class="cat-h">'); if(i>=0) h=h.slice(0,i)+rec+h.slice(i);
    h+='<div class="row" style="margin-top:14px">'+btn('Personnaliser la barre du bas','baredit',{c:'sm ghost'})+'</div>';
  }catch(e){ console.error(e); } return h; }; VIEWS.plus=vPlus; }

