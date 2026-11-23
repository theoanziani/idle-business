/* ============================================================
   FOOTBALL : remplacements en direct (V1.1.8)
   Pendant tout match de votre club (première diffusion, le jour même), jusqu'à 5 changements.
   Chaque changement rejoue la fin du match avec le nouvel onze (stats des joueurs),
   puis le score final remplace celui du classement. Aucun nouveau champ obligatoire :
   O.last.lock (le match ne peut plus être modifié) a une valeur par défaut « absente ».
   ============================================================ */
const FM_MAXSUB=5;
function fmTm(M,t){ if(t<M.ht){ const m=Math.floor(t/60)+1; return m>45? {m:45,x:m-45} : {m,x:0}; } const m=46+Math.floor((t-M.ht)/60); return m>90? {m:90,x:m-90} : {m,x:0}; }
/* le match peut-il encore changer ? première diffusion, le jour même (toutes compétitions) */
function fmOwnLive(h,a,day){ const O=fcOwn(); return !!(O&&O.last&&!O.last.lock&&O.last.h===h&&O.last.a===a&&O.last.day===day&&frCanReplay(h,a,day)); }
{ const _fs=fmStart; fmStart=function(h,a,gh,ga,day,pen,ko){
  const own=fmOwnLive(h,a,day), L=_fs(h,a,gh,ga,day,pen,ko), O=fcOwn();
  if(own){ L.own=true; L.ownS=O.id===h?0:1; L.subs=0; L.used=[]; L.ent=[new Array(11).fill(0),new Array(11).fill(0)];
    L.M.ev=L.M.ev.filter(e=>!(e.k==='sub'&&e.s===L.ownS)); }   /* vos changements, c'est vous */
  return L; }; }
/* rejoue la fin du match à partir de L.t */
function fmResim(L){
  const M=L.M, t0=L.t, s0=L.ownS, R=footSeedRng(L.day*7919+Math.floor(t0)*13+L.subs);
  const [lh,la]=fsRates(M.h,M.a,false,fmFatXI(L,0,t0),fmFatXI(L,1,t0)), f=Math.max(0,(M.end-t0)/M.end);
  M.poss=clamp(.5+(fsLines(M.xi[0]).mid-fsLines(M.xi[1]).mid)/60,.3,.7);
  const ev=M.ev.filter(e=>e.t<=t0||e.k==='ht'||e.k==='ft'||(e.k==='sub'&&e.s!==s0)||e.k==='yellow'||e.k==='red');
  const at=()=>{ const t=Math.floor(t0+1+R()*(M.end-t0-2)); return Object.assign({t},fmTm(M,t)); };
  [0,1].forEach(s=>{
    const xi=M.xi[s], sh=s?1-M.poss:M.poss, g=fpois((s?la:lh)*f);
    const wSc=p=>(FOOT_SCORE_W[p.slot]||.4)*fsVal(p,'tir')/70;
    for(let k=0;k<g;k++){ const T=at(), sc=footPickW(R,xi,wSc), as=R()<.72? footPickW(R,xi.filter(p=>p!==sc&&p.slot!=='G'),p=>fsVal(p,'pas')/60*(p.slot==='AIL'||p.slot==='MO'?3:p.slot==='MC'?2:1)) : null;
      ev.push(Object.assign(T,{k:'goal', s, p:sc.n, as:as&&as.n, kind:R()<.1?'pen':R()<.16?'head':'shot'})); }
    const extra=Math.max(0,Math.round((4+sh*14)*f+(R()-.5)*3-g));
    for(let k=0;k<extra;k++){ const T=at(), sc=footPickW(R,xi,p=>wSc(p)+.3); ev.push(Object.assign(T,{k:R()<.38?'save':'miss', s, p:sc.n, gk:M.xi[1-s][0].n})); }
    const nc=Math.max(0,Math.round((2+sh*7)*f)); for(let k=0;k<nc;k++) ev.push(Object.assign(at(),{k:'corner', s}));
  });
  ev.sort((x,y)=>x.t-y.t); let sc=[0,0]; ev.forEach(e=>{ if(e.k==='goal') sc[e.s]++; e.sc=sc.slice(); });
  M.ev=ev; M.gh=sc[0]; M.ga=sc[1]; L.i=ev.filter(e=>e.t<=t0).length;
}
/* le score définitif : on rejoue la journée avec ce score (toutes compétitions) */
function fmCommit(L){
  if(!L||!L.own||L.committed) return; L.committed=true;
  let O=fcOwn(); if(!O||!O.last) return; O.last.lock=1;
  const M=L.M, ng=M.gh, na=M.ga; if(ng===O.last.gh&&na===O.last.ga){ FOOT_SNAP=null; return; }
  if(!frReplay(ng,na)) return;
  O=fcOwn(); if(O.last){ O.last.seen=1; O.last.lock=1; } O.live=null;
  const me=L.ownS, nf=me?na:ng, nc=me?ng:na;
  fcNews('Après vos changements : '+footName(M.h)+' '+ng+'-'+na+' '+footName(M.a)+'.', nf>nc?'good':nf<nc?'bad':'');
  if(typeof FOOT_LIVE!=='undefined'&&FOOT_LIVE) FOOT_LIVE.replayed=true;
}
{ const _cm=ACT.closemodal; ACT.closemodal=function(el){ if(ui.modal&&ui.modal.type==='fmatch') fmCommit(FOOT_LIVE); return _cm(el); }; }
{ const _fe=ACT.fmend; ACT.fmend=function(el){ const r=_fe(el); fmCommit(FOOT_LIVE); return r; }; }
{ const _st=fmStep; fmStep=function(L,dt){ _st(L,dt); if(L.done&&L.own&&!L.committed) fmCommit(L); }; }

/* ---------- Interface ---------- */
function fmSubBench(L){ const O=fcOwn(), on=new Set(L.M.xi[L.ownS].map(p=>String(p.id))); return O.sq.filter(p=>fcAvail(p)&&!on.has(String(p.id))&&!L.used.includes(String(p.id))); }
ACT.fmsub=()=>{ const L=FOOT_LIVE; if(!L||!L.own||L.done||L.subs>=FM_MAXSUB) return; L.play=false; L.subUI={o:null}; L.tab='sub'; render(); };
ACT.fmsubx=()=>{ const L=FOOT_LIVE; if(!L) return; L.subUI=null; L.tab='feed'; if(!L.done) L.play=true; render(); };
ACT.fmsubo=el=>{ const L=FOOT_LIVE; if(!L||!L.subUI) return; L.subUI.o=+el.dataset.i; render(); };
/* un changement (vous ou l'entraîneur) : le remplaçant entre frais, la fin du match est rejouée */
function fmDoSub(L,idx,p){ const s=L.ownS, old=L.M.xi[s][idx]; if(!p||L.subs>=FM_MAXSUB) return false;
  const np=Object.assign({},p,{slot:old.slot}); L.M.xi[s][idx]=np; L.used.push(String(old.id)); L.subs++; if(L.ent) L.ent[s][idx]=L.t;
  const pl=L.pl.find(q=>q.s===s&&q.i===idx); if(pl) pl.n=np.n;
  const e=Object.assign({t:L.t,k:'sub',s,p:np.n,o:old.n,sc:fmScoreNow(L)},fmTm(L.M,L.t)); L.M.ev.push(e); fmEvent(L,e);
  fmResim(L); return true; }
ACT.fmsubi=el=>{ const L=FOOT_LIVE; if(!L||!L.subUI||L.subUI.o===null) return; const O=fcOwn(), p=O.sq.find(q=>String(q.id)===el.dataset.i);
  if(!fmDoSub(L,L.subUI.o,p)) return; L.subUI=null; L.tab='feed'; L.play=true; render(); };
{ const _th=fmTabHtml; fmTabHtml=function(L){
  if(L.tab!=='sub'||!L.subUI) return _th(L);
  const s=L.ownS, xi=L.M.xi[s], U=L.subUI;
  let h='<div class="row sp"><b>Remplacement '+(L.subs+1)+' sur '+FM_MAXSUB+'</b>'+btn('Annuler','fmsubx',{c:'sm ghost'})+'</div>';
  if(U.o===null) return h+'<div class="sub">Qui sort ?</div>'+xi.map((p,i)=>L.used.includes(String(p.id))? '' :
    '<button class="fc-pl" data-a="fmsubo" data-i="'+i+'"><span class="fpos">'+FOOT_POS_S[p.slot]+'</span><span class="nm"><b>'+esc(p.n)+'</b><small>'+fmLineStat(p)+'</small></span><b class="num fov">'+Math.round(p.o)+'</b></button>').join('');
  const out=xi[U.o], B=fmSubBench(L).sort((a,b)=>(FOOT_NEAR[out.slot].includes(b.p)-FOOT_NEAR[out.slot].includes(a.p))||(b.o-a.o));
  return h+'<div class="sub">Qui remplace '+esc(out.n)+' ('+FOOT_POS[out.slot].toLowerCase()+') ?</div>'+(B.length? B.map(p=>
    '<button class="fc-pl" data-a="fmsubi" data-i="'+esc(p.id)+'"><span class="fpos">'+FOOT_POS_S[p.p]+'</span><span class="nm"><b>'+esc(p.n)+'</b><small>'+(FOOT_NEAR[out.slot].includes(p.p)?'Bon poste':'Hors poste')+' · '+fmLineStat(p)+'</small></span><b class="num fov">'+Math.round(p.o)+'</b></button>').join('') : '<div class="sub">Aucun remplaçant disponible.</div>');
}; }
function fmLineStat(p){ const k=p.p==='G'? ['ref','plo'] : (p.slot||p.p)==='BU'||(p.slot||p.p)==='AIL'? ['tir','vit'] : ['DC','DL'].includes(p.slot||p.p)? ['def','phy'] : ['pas','dri'];
  const N={ref:'Réf.',plo:'Plon.',tir:'Tir',vit:'Vit.',def:'Déf.',phy:'Phy.',pas:'Pas.',dri:'Dri.'}; return k.map(x=>N[x]+' '+fsVal(p,x)).join(' · '); }
{ const _fb=fmBody; fmBody=function(L){ let h=_fb(L);
  if(L.own&&!L.done&&!L.subUI){ const b=btn('Remplacer ('+L.subs+'/'+FM_MAXSUB+')','fmsub',{c:'sm pri',dis:L.subs>=FM_MAXSUB,why:'Tous les remplacements ont été faits.'});
    h=h.replace('<div class="seg fm-tabs">',(L.subs===0&&!L.subUI? '<div class="sub fm-subtip">Vos changements influencent la fin du match.</div>' : '')+'<div class="row fm-subrow">'+b+'</div><div class="seg fm-tabs">'); }
  return h; }; }

