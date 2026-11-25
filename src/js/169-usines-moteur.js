/* ============================================================
   V2.8.1 : USINES (2/3) · MOTEUR
   État : S.fab = {sites:[site], n, day}
   site = {id, t, city, dist, blds:[id], name, halls, lines:[ligne], parc:{culture:n}, st:{produit:unités}, qm:{produit:prime},
           mode:'sell'|'store', buy:1|0, d:{jour}}
   ligne = {id, p, g:[[machine,x,y,rot]], on, v}
   Production d'une ligne : la cadence de son étape la plus lente (machines raccordées au convoyeur principal, dans
   l'ordre des étapes) × longueur et virages du convoyeur × stocks tampons × pannes, en exemplaires par jour.
   Matières : d'abord vos stocks (vos autres usines, avec transport), sinon achetées au marché.
   Débouchés : vos sociétés (réserve gardée), puis le marché de gros (ou stockage).
   ============================================================ */
function fabInit(){ if(!S.fab) S.fab={sites:[], n:1}; if(typeof gpInit==='function'){ const G=gpInit(); Object.keys(D.GOODS).forEach(g=>{ if(!G[g]) G[g]={i:1,h:[1]}; }); } return S.fab; }
const fabSites = () => fabInit().sites;
const fabSite = id => fabSites().find(s=>s.id===+id);
const fabProdDef = p => D.PRODS[p]||FAB_RAW[p];
function fabPrice(p){ const P=fabProdDef(p); return P.v*(typeof gIdx==='function'&&S.gp&&S.gp[P.g]? gIdx(P.g) : 1); }
const FAB_NRJ={France:1, Espagne:1.05, Croatie:1.1, 'États-Unis':.8, 'Brésil':.9, Chine:.85};
const fabWage = cid => { const C=D.CITIES[cid]; return .4+.15*((C&&C.idx&&C.idx.wage)||3); };
const fabNrj = cid => FAB_NRJ[(D.CITIES[cid]||{}).country]||1;
const fabCityN = cid => (D.CITIES[cid]||{}).n||cid;
/* cadence médiane des machines d'un type (sert aux machines annexes) */
function fabMedC(t){ const L=[]; fabProdsOf(t).forEach(p=>D.PRODS[p].st.forEach(k=>L.push(FAB_M[k].c))); L.sort((a,b)=>a-b); return L.length? L[Math.floor(L.length/2)] : 1; }
const FAB_AUXF={cv:.006, in:.08, out:.08, buf:.12, qc:.3, mnt:.35};
function fabMCost(t,k){ const m=FAB_M[k], V=FAB_T[t].vRef; if(m.aux) return Math.round(10*fabMedC(t)*V*FAB_AUXF[k]); return Math.round(10*m.c*V); }
/* frais d'exploitation par jour d'une machine posée (ouvriers + énergie) */
function fabMOpex(t,k,cid){ const m=FAB_M[k], V=FAB_T[t].vRef, base= m.aux? fabMedC(t)*V*({cv:0,in:.02,out:.02,buf:.02,qc:.1,mnt:.15}[k]) : m.c*V;
  return {lab: base*.04*fabWage(cid), nrj: base*.02*fabNrj(cid)}; }
const fabWorkers = (t,k,cid) => Math.max(m0(k), Math.round(fabMOpex(t,k,cid).lab/(150*fabWage(cid))));
const m0 = k => FAB_M[k].aux? 0 : 1;
const fabSetupCost = t => 2*fabMCost(t,FAB_SETUP_K[t]);
const FAB_SETUP_K={farm:'mou', textile:'tis', agro:'cui', meuble:'cnc', electronics:'lith', acier:'hf', auto:'pre', naval:'cal', aero:'fin'};
const fabHallCost = s => Math.round(fabSetupCost(s.t)*1.5*Math.pow(1.3,s.halls||0));
function fabSlots(s){ let n=0; (s.blds||[]).forEach(id=>{ const bd=bldById(id); n+=Math.max(1,Math.floor(((bd&&bd.surf)||0)/FAB_T[s.t].area)); }); return Math.max(1,n)+2*(s.halls||0); }
const fabLineKinds = p => ['cv','in','out'].concat(D.PRODS[p].st.filter((k,i,a)=>a.indexOf(k)===i)).concat(['buf','qc','mnt']);
const fabDim = it => { const m=FAB_M[it[0]]; return it[3]? [m.h,m.w] : [m.w,m.h]; };

/* ---------- analyse d'une ligne (mise en cache par version) ---------- */
const FAB_CACHE=new Map();
function fabAnalyze(s,l){ const key=s.id+':'+l.id+':'+(l.v||0)+':'+l.p; const c=FAB_CACHE.get(key); if(c) return c;
  const W=FAB_W, H=FAB_H, P=D.PRODS[l.p], occ=new Array(W*H).fill(-1);
  l.g.forEach((it,i)=>{ const [w,h]=fabDim(it); for(let y=it[2];y<it[2]+h;y++) for(let x=it[1];x<it[1]+w;x++) if(x>=0&&y>=0&&x<W&&y<H) occ[y*W+x]=i; });
  const isCv = (x,y) => x>=0&&y>=0&&x<W&&y<H&&occ[y*W+x]>=0&&l.g[occ[y*W+x]][0]==='cv';
  const nb4 = (x,y) => [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
  const cellsOf = it => { const [w,h]=fabDim(it), r=[]; for(let y=it[2];y<it[2]+h;y++) for(let x=it[1];x<it[1]+w;x++) r.push([x,y]); return r; };
  const touch = (it,pred) => cellsOf(it).some(([x,y])=>nb4(x,y).some(([a,b])=>pred(a,b)));
  const docks=k=>l.g.filter(it=>it[0]===k);
  const ins=docks('in'), outs=docks('out');
  /* départs : convoyeurs touchant un quai d'arrivée ; arrivées : touchant un quai d'expédition */
  const startSet=[], goal=new Set();
  for(let y=0;y<H;y++) for(let x=0;x<W;x++){ if(!isCv(x,y)) continue;
    if(ins.some(it=>cellsOf(it).some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)===1))) startSet.push([x,y]);
    if(outs.some(it=>cellsOf(it).some(([a,b])=>Math.abs(a-x)+Math.abs(b-y)===1))) goal.add(y*W+x); }
  let path=null;
  if(startSet.length&&goal.size){ const prev=new Map(), q=[]; startSet.forEach(([x,y])=>{ prev.set(y*W+x,-1); q.push(y*W+x); });
    let end=-1; while(q.length){ const v=q.shift(); if(goal.has(v)){ end=v; break; } const x=v%W, y=Math.floor(v/W);
      nb4(x,y).forEach(([a,b])=>{ if(isCv(a,b)&&!prev.has(b*W+a)){ prev.set(b*W+a,v); q.push(b*W+a); } }); }
    if(end>=0){ path=[]; for(let v=end;v!==-1;v=prev.get(v)) path.unshift(v); } }
  const pos=new Map(); if(path) path.forEach((v,i)=>pos.set(v,i));
  const posOf = it => { let best=null; cellsOf(it).forEach(([x,y])=>nb4(x,y).forEach(([a,b])=>{ if(a<0||b<0||a>=W||b>=H) return; const p=pos.get(b*W+a); if(p!==undefined&&(best===null||p<best)) best=p; })); return best; };
  const A={ok:!!path, path:path||[], L:path?path.length:0, turns:0, stages:[], mach:[], buf:0, qc:false, mnt:false, occ, msg:''};
  if(path) for(let i=2;i<path.length;i++){ const a=path[i-2], b=path[i-1], c2=path[i]; if((b-a)!==(c2-b)) A.turns++; }
  l.g.forEach((it,i)=>{ A.mach[i]={pos: (it[0]==='cv'||it[0]==='in'||it[0]==='out')? null : (path? posOf(it) : null), st:'aux'}; });
  let start=0, missing=null;
  P.st.forEach((k,si)=>{ const idx=l.g.map((it,i)=>i).filter(i=>l.g[i][0]===k);
    const valid=idx.filter(i=>A.mach[i].pos!==null&&A.mach[i].pos>=start);
    idx.forEach(i=>{ A.mach[i].st= A.mach[i].pos===null? 'off' : valid.includes(i)? 'ok' : 'order'; });
    const cap=valid.length*FAB_M[k].c*P.k, mp= valid.length? Math.min(...valid.map(i=>A.mach[i].pos)) : start;
    A.stages.push({k, n:valid.length, tot:idx.length, cap}); if(!valid.length&&!missing) missing=k; start=mp; });
  l.g.forEach((it,i)=>{ const k=it[0], p=A.mach[i].pos;
    if(k==='buf'&&p!==null) A.buf++; if(k==='qc'&&p!==null&&p>=start) A.qc=true; if(k==='mnt'&&p!==null) A.mnt=true;
    if(['buf','qc','mnt'].includes(k)) A.mach[i].st= p===null? 'off' : (k==='qc'&&p<start)? 'order' : 'ok'; });
  A.buf=Math.min(2,A.buf);
  A.fBelt=clamp(1-.004*Math.max(0,A.L-10)-.008*Math.max(0,A.turns-4),.7,1); A.fStop=.88+.06*A.buf;
  const caps=A.stages.map(x=>x.cap); A.raw= (path&&!missing)? Math.min(...caps) : 0;
  A.bott= A.raw>0? caps.indexOf(A.raw) : (missing? P.st.indexOf(missing) : -1);
  A.rate=A.raw*A.fBelt*A.fStop;
  const rest=caps.filter((x,i)=>i!==A.bott); A.next= A.raw>0&&rest.length? Math.min(...rest)*A.fBelt*A.fStop : A.rate;
  A.max=Math.max(...caps,0)*A.fBelt*A.fStop;
  A.eff= A.max>0? A.rate/A.max : 0;
  A.msg= !ins.length? 'Placez un quai d’arrivée' : !outs.length? 'Placez un quai d’expédition' : !path? 'Le convoyeur ne relie pas les deux quais' : missing? 'Il manque : '+FAB_M[missing].n.toLowerCase() : '';
  if(FAB_CACHE.size>400) FAB_CACHE.clear(); FAB_CACHE.set(key,A); return A; }
/* coût d'exploitation d'une ligne par jour */
function fabLineOpex(s,l){ let lab=0, nrj=0, wk=0; l.g.forEach(it=>{ const o=fabMOpex(s.t,it[0],s.city); lab+=o.lab; nrj+=o.nrj; wk+=fabWorkers(s.t,it[0],s.city); }); return {lab,nrj,wk}; }
const fabLineValue = (s,l) => l.g.reduce((a,it)=>a+fabMCost(s.t,it[0]),0);
/* marge estimée d'une ligne (prix de gros du jour, matières au marché) */
function fabLineEco(s,l){ const A=fabAnalyze(s,l), P=D.PRODS[l.p], o=fabLineOpex(s,l), u=A.rate;
  const rev=u*fabPrice(l.p)*(A.qc?1.08:1), mat=Object.keys(P.in||{}).reduce((a,q)=>a+u*P.in[q]*fabPrice(q),0);
  return {u, rev, mat, opex:o.lab+o.nrj, net:rev-mat-o.lab-o.nrj, wk:o.wk}; }

/* ---------- stocks : prendre une matière dans vos usines ---------- */
function fabTake(q,want,to){ let got=0, tr=0; const L=fabSites().filter(x=>(x.st[q]||0)>1e-9).sort((a,b)=>(a===to?-1:b===to?1:0)||((typeof route==='function'? route(a.city,to.city).rate : 0)-(typeof route==='function'? route(b.city,to.city).rate : 0)));
  for(const x of L){ if(want-got<=1e-9) break; const u=Math.min(x.st[q],want-got); x.st[q]-=u; got+=u; if(x!==to&&typeof route==='function') tr+=u*fabPrice(q)*route(x.city,to.city).rate; }
  return {got, tr}; }
const fabStock = p => fabSites().reduce((a,x)=>a+(x.st[p]||0),0);

/* ---------- une journée de production ---------- */
function fabStep(){ const F=fabInit(); if(!F.sites.length){ F.day=null; return; }
  const day={rev:0, own:0, cost:0, mat:0, u:{}}, need={};
  F.sites.slice().sort((a,b)=>FAB_ORDER.indexOf(a.t)-FAB_ORDER.indexOf(b.t)).forEach(s=>{ s.st=s.st||{}; s.qm=s.qm||{}; const d=s.d={u:{}, cost:0, mat:0, sold:0, own:(s.d&&s.d.own)||0, br:0};
    /* ferme : parcelles */
    if(s.t==='farm') Object.keys(s.parc||{}).forEach(c=>{ const n=s.parc[c]||0, C=FAB_CROP[c]; if(!n||!C) return;
      const u=n*C.y*(.92+.16*rnd())*(typeof wmoFarmY==='function'? wmoFarmY() : 1); s.st[C.p]=(s.st[C.p]||0)+u; d.u[C.p]=(d.u[C.p]||0)+u; d.cost+=n*(FAB_PARCEL*.0025+100*fabWage(s.city)); });
    s.lines.forEach(l=>{ if(l.on===0) return; const A=fabAnalyze(s,l), P=D.PRODS[l.p], o=fabLineOpex(s,l); d.cost+=o.lab+o.nrj; l.br=0;
      let u=A.rate; if(u<=0) return;
      if(rnd()<(A.mnt?.006:.02)){ u*=.5; l.br=S.day; d.br++; }
      /* matières */
      /* matières : sans achats au marché (s.buy=0), la ligne ne produit que ce que vos stocks permettent */
      const IN=P.in||{}; let lim=1;
      if(s.buy===0) Object.keys(IN).forEach(q=>{ if(!FAB_RAW[q]) lim=Math.min(lim,fabStock(q)/Math.max(1e-9,u*IN[q])); });
      u*=lim; if(u<=0) return;
      Object.keys(IN).forEach(q=>{ const want=u*IN[q]; need[q]=(need[q]||0)+want;
        if(FAB_RAW[q]){ d.mat+=want*fabPrice(q)*1.06; return; }
        const r=fabTake(q,want,s); d.mat+=r.tr+(want-r.got)*fabPrice(q)*1.06; }); const qm=A.qc?1.08:1, old=s.st[l.p]||0; s.st[l.p]=old+u; s.qm[l.p]=(old*(s.qm[l.p]||1)+u*qm)/Math.max(1e-9,old+u); d.u[l.p]=(d.u[l.p]||0)+u; });
    day.cost+=d.cost; day.mat+=d.mat;
    Object.keys(d.u).forEach(p=>day.u[p]=(day.u[p]||0)+d.u[p]); });
  if(day.cost>0) pay('fab','Ouvriers et énergie de vos usines',-day.cost,'corp');
  if(day.mat>0) pay('fab','Matières premières et transport',-day.mat,'corp');
  /* réserve : besoins de vos lignes et de vos sociétés pour un jour et demi, le reste part au marché de gros */
  const own={}; if(typeof SUP_NEED!=='undefined') S.biz.forEach(b=>{ const N=SUP_NEED[b.def]; if(!N||b.status!=='active'||!b.last||supSrc(b)==='mkt') return; Object.keys(N).forEach(p=>{ own[p]=(own[p]||0)+Math.max(0,b.last.rev||0)*N[p]/Math.max(1e-9,fabPrice(p)); }); });
  const keep={}; Object.keys(D.PRODS).forEach(p=>keep[p]=((need[p]||0)+(own[p]||0))*1.5);
  F.sites.forEach(s=>{ if(s.mode==='store') return; Object.keys(s.st).forEach(p=>{ if(!D.PRODS[p]) return; const tot=fabStock(p), free=Math.max(0,tot-keep[p]); if(free<=1e-9) return;
      const share= tot>0? s.st[p]/tot : 0, u=Math.min(s.st[p],free*share); if(u<=0) return; const v=u*fabPrice(p)*(s.qm[p]||1); s.st[p]-=u; s.d.sold+=v; day.rev+=v; }); });
  if(day.rev>0) pay('fab','Ventes de vos usines au marché de gros',day.rev,'corp');
  F.day=Object.assign(day,{d:S.day, net:day.rev+(F.ownRev||0)-day.cost-day.mat}); F.ownRev=0;
}

/* ---------- approvisionnement de vos sociétés (remplace l'ancien) ---------- */
Object.assign(SUP_NEED,{
  resto:{cer:.03, leg:.08, lai:.05, oeu:.03, vin:.06, fro:.04, pla:.04}, hotel:{leg:.03, lai:.02, oeu:.02, vin:.02, meu:.03, pla:.02, bsn:.02},
  park:{cer:.02, leg:.02, lai:.01, oeu:.01, pla:.04, bsn:.05}, fastfood:{far:.06, pla:.05, bsn:.05}, super:{far:.04, lai:.03, pla:.06, bsn:.06},
  office:{mbu:.03}, dealer:{pau:.04, voi:.14, ber:.12, suv:.10, utl:.04}, airline:{a1:.03, a2:.04, a3:.03}, shipping:{fer:.03, pcn:.06},
  build:{tol:.05}, promo:{tol:.03}});
Object.assign(SUP_QB,{fastfood:.05, super:.04, office:.03, airline:.04, shipping:.04, build:.03, promo:.03});
supStep=function(){ const F=fabInit(); let ownRev=0;
  S.biz.forEach(b=>{ if(SUP_NEED[b.def]){ b.supSave=0; b.supIn=0; b.supQ=0; b.supMiss=0; b.supP={}; } });
  const tot={};
  Object.keys(D.PRODS).forEach(p=>{ const C=S.biz.filter(x=>SUP_NEED[x.def]&&SUP_NEED[x.def][p]&&x.status==='active'&&supSrc(x)!=='mkt'); if(!C.length) return;
    const need=C.map(c=>supNeedP(c,p)), totNeed=need.reduce((a,x)=>a+x,0); if(totNeed<=0) return;
    const pr=fabPrice(p), avail=fabStock(p)*pr, ratio=Math.min(1,avail/totNeed);
    C.forEach((c,i)=>{ let want=need[i]*ratio; const own=supSrc(c)==='own', disc=own? SUP_OWN : SUP_DISC; let got=0, qs=0;
      F.sites.filter(s=>(s.st[p]||0)>1e-9).sort((a,b)=>route(a.city,c.city).rate-route(b.city,c.city).rate).forEach(s=>{ if(want<=1e-6) return; const R=route(s.city,c.city), q=s.qm[p]||1;
        const u=Math.min(s.st[p],want/pr); if(u<=0) return; s.st[p]-=u; const v=u*pr; want-=v; got+=v; qs+=v*(q>1?2:0); ownRev+=v*q; s.d=s.d||{}; s.d.own=(s.d.own||0)+v*q; c.supSave+=v*Math.max(0,disc-R.rate); });
      c.supIn+=got; c.supP[p]=[need[i],got,got? qs/got : 0]; if(got>0) c.supDay=S.day;
      const T=tot[c.id]||(tot[c.id]={need:0,got:0,qs:0,c}); T.need+=need[i]; T.got+=got; T.qs+=qs; }); });
  Object.values(tot).forEach(T=>{ const c=T.c; c.supQ= T.need>0? T.qs/T.need : 0; c.supMiss= supSrc(c)==='own'&&T.need>0? Math.max(0,1-T.got/T.need) : 0; });
  if(ownRev>0){ pay('fab','Livraisons à vos sociétés',ownRev,'corp'); F.ownRev=(F.ownRev||0)+ownRev; }
};
/* le directeur des achats : vos usines d'abord dès qu'un site fabrique ce qu'une société achète */
achStep=function(){ if(!mgrOn('ach')) return; S.biz.forEach(b=>{ const N=SUP_NEED[b.def]; if(!N||b.srcMan) return; const has=Object.keys(N).some(p=>fabSites().some(s=>s.lines.some(l=>l.p===p)||(s.t==='farm'&&Object.keys(s.parc||{}).some(c=>FAB_CROP[c].p===p&&s.parc[c]>0))));
  b.src= has? 'mix' : 'mkt'; }); };
{ const _is=indStep; indStep=function(){ _is(); try{ fabStep(); }catch(e){ console.error(e); } }; }
{ const _sn=srcName; srcName=function(src){ return src==='fab'? 'Usines' : _sn(src); }; }
synBonus=function(d){ if(!d.syn) return 1; const w=d.syn.with, on=S.biz.some(x=>x.def===w&&x.status==='active')||fabSites().some(s=>s.t===w); return on? 1+d.syn.b : 1; };

/* ---------- valeur nette : machines (70 %), parcelles (80 %), stocks (90 %) ---------- */
function fabNW(){ let v=0; fabSites().forEach(s=>{ s.lines.forEach(l=>v+=fabLineValue(s,l)*.7); v+=Object.values(s.parc||{}).reduce((a,n)=>a+n,0)*FAB_PARCEL*.8;
  v+=(s.halls||0)*fabSetupCost(s.t)*1.2; Object.keys(s.st||{}).forEach(p=>v+=(s.st[p]||0)*fabPrice(p)*.9); }); return v; }
goodsNW=(function(_g){ return function(){ return _g()+fabNW(); }; })(goodsNW);

/* ---------- actions ---------- */
const FAB_PLOT_T=['land','depot'];
const fabPlotOk = bd => FAB_PLOT_T.includes(bd.t)&&!bldHeld(bd.id)&&!(typeof rivShopAt==='function'&&rivShopAt(bd.id));
function fabBuild(t,bid){ const T=FAB_T[t], bd=bldById(bid); if(!T||!bd) return err('Terrain inconnu.');
  if(!unlocked(T.tier)) return err('Palier '+D.TIERS[T.tier].n+' requis.');
  if(!fabPlotOk(bd)) return err('Ce terrain n’est pas libre pour une usine.');
  if(bd.surf<T.area*.6) return err('Terrain trop petit : '+fmtN(Math.ceil(T.area*.6))+' m² au moins.');
  const set=fabSetupCost(t), dep=cityOwned(bd.city)? 0 : bldRent(bd)*30; if(S.cash<set+dep) return err('Il faut '+eur(set+dep,0)+' (installation et dépôt de garantie).');
  payCap('fab','Installation : '+T.n,-set); if(dep) payCap('c:'+bd.city,'Dépôt de garantie : '+bd.addr,-dep); settleAccounts();
  if(!S.bld) S.bld={}; const F=fabInit(), id=F.n++;
  S.bld[bid]={st:'rent',dep,biz:null,fab:id,since:S.day};
  const s={id, t, city:bd.city, dist:bd.dist||(bid.split('.')[1]), blds:[bid], name:T.n+' · '+fabCityN(bd.city), halls:0, lines:[], parc:{}, st:{}, qm:{}, mode:'sell', buy:1, since:S.day};
  F.sites.push(s); log('good','Nouveau site : '+s.name+' ('+bd.addr+').'); return ok(s.id); }
function fabHall(sid){ const s=fabSite(sid); if(!s) return err('Site inconnu.'); const c=fabHallCost(s); if(S.cash<c) return err('Il faut '+eur(c,0)+'.');
  payCap('fab','Nouveau hall : '+s.name,-c); s.halls=(s.halls||0)+1; return ok(); }
function fabLineNew(sid,p){ const s=fabSite(sid), P=D.PRODS[p]; if(!s||!P||P.fac!==s.t||P.raw) return err('Produit impossible ici.');
  if(s.lines.length>=fabSlots(s)) return err('Plus de place : construisez un hall.');
  const lid=(s.lines.reduce((a,l)=>Math.max(a,l.id),0)||0)+1;
  s.lines.push({id:lid, p, g:[['in',0,0,0],['out',FAB_W-2,FAB_H-1,0]], on:1, v:1}); return ok(lid); }
function fabLineDel(sid,lid){ const s=fabSite(sid); if(!s) return err('Site inconnu.'); const l=s.lines.find(x=>x.id===+lid); if(!l) return err('Ligne inconnue.');
  const v=fabLineValue(s,l)*.6; payCap('fab','Démontage : ligne '+D.PRODS[l.p].n,v); s.lines=s.lines.filter(x=>x!==l); return ok(); }
function fabFits(l,k,x,y,rot,skip){ const m=FAB_M[k], w=rot?m.h:m.w, h=rot?m.w:m.h; if(x<0||y<0||x+w>FAB_W||y+h>FAB_H) return false;
  return !l.g.some((it,i)=>{ if(i===skip) return false; const [a,b]=fabDim(it); return x<it[1]+a&&it[1]<x+w&&y<it[2]+b&&it[2]<y+h; }); }
function fabPlace(sid,lid,k,x,y,rot){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l) return err('Ligne inconnue.');
  if(!fabLineKinds(l.p).includes(k)) return err('Cette machine ne sert pas à ce produit.');
  rot= rot&&FAB_M[k].w!==FAB_M[k].h? 1 : 0;
  if(!fabFits(l,k,x,y,rot)) return err('Pas assez de place à cet endroit.');
  const c=fabMCost(s.t,k); if(S.cash<c) return err('Il faut '+eur(c,0)+'.');
  payCap('fab',FAB_M[k].n+' : '+s.name,-c); l.g.push([k,x,y,rot]); l.v=(l.v||0)+1; return ok(); }
function fabAt(l,x,y){ return l.g.findIndex(it=>{ const [w,h]=fabDim(it); return x>=it[1]&&x<it[1]+w&&y>=it[2]&&y<it[2]+h; }); }
function fabRemove(sid,lid,x,y){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l) return err('Ligne inconnue.'); const i=fabAt(l,x,y); if(i<0) return err('Rien à retirer ici.');
  const k=l.g[i][0]; payCap('fab','Revente : '+FAB_M[k].n,fabMCost(s.t,k)*.6); l.g.splice(i,1); l.v=(l.v||0)+1; return ok(); }
function fabMove(sid,lid,i,x,y){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l||!l.g[i]) return err('Machine inconnue.'); const it=l.g[i];
  if(!fabFits(l,it[0],x,y,it[3],i)) return err('Pas assez de place à cet endroit.'); it[1]=x; it[2]=y; l.v=(l.v||0)+1; return ok(); }
function fabRotate(sid,lid,i){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l||!l.g[i]) return err('Machine inconnue.'); const it=l.g[i], m=FAB_M[it[0]];
  if(m.w===m.h) return err('Cette machine est carrée.'); if(!fabFits(l,it[0],it[1],it[2],it[3]?0:1,i)) return err('Pas assez de place pour la tourner.'); it[3]=it[3]?0:1; l.v=(l.v||0)+1; return ok(); }
function fabSetProd(sid,lid,p){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l||!D.PRODS[p]||D.PRODS[p].fac!==s.t||D.PRODS[p].raw) return err('Produit impossible.'); l.p=p; l.v=(l.v||0)+1; return ok(); }
/* disposition automatique : convoyeur vertical au centre, machines de part et d'autre, dans l'ordre des étapes */
function fabAutoPlan(t,p){ const P=D.PRODS[p], X=3, g=[['in',2,0,0],['out',3,FAB_H-1,0]]; for(let y=1;y<FAB_H-1;y++) g.push(['cv',X,y,0]);
  const caps=P.st.map(k=>FAB_M[k].c), top=Math.max(...caps); let yl=1, yr=1;
  const want=P.st.map((k,i)=>clamp(Math.round(top/caps[i]),1,3));
  P.st.forEach((k,i)=>{ const m=FAB_M[k]; for(let n=0;n<want[i];n++){
      /* à droite : largeur ≤ 4 ; à gauche : ≤ 3 */
      const fitR= m.w<=4&&yr+m.h<=FAB_H-1, fitL= m.w<=3&&yl+m.h<=FAB_H-1, rotL= m.h<=3&&yl+m.w<=FAB_H-1&&m.h!==m.w;
      if(fitL&&(yl<=yr||!fitR)){ g.push([k,X-m.w,yl,0]); yl+=m.h; }
      else if(fitR){ g.push([k,X+1,yr,0]); yr+=m.h; }
      else if(rotL){ g.push([k,X-m.h,yl,1]); yl+=m.w; }
      else if(n===0) return; } });
  return g; }
function fabAuto(sid,lid){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l) return err('Ligne inconnue.');
  if(l.g.some(it=>!['in','out','cv'].includes(it[0]))) return err('Retirez d’abord les machines : la disposition automatique part d’une ligne vide.');
  const g=fabAutoPlan(s.t,l.p), old=l.g.reduce((a,it)=>a+fabMCost(s.t,it[0]),0), c=g.reduce((a,it)=>a+fabMCost(s.t,it[0]),0)-old;
  if(S.cash<c) return err('Il faut '+eur(c,0)+'.'); payCap('fab','Équipement : ligne '+D.PRODS[l.p].n,-c); l.g=g; l.v=(l.v||0)+1; return ok(); }
const fabAutoCost = (s,l) => fabAutoPlan(s.t,l.p).reduce((a,it)=>a+fabMCost(s.t,it[0]),0)-l.g.reduce((a,it)=>a+fabMCost(s.t,it[0]),0);
function fabParcelBuy(sid,c,n){ const s=fabSite(sid); if(!s||s.t!=='farm'||!FAB_CROP[c]) return err('Culture inconnue.'); n=Math.max(1,n|0); const cost=n*FAB_PARCEL;
  if(S.cash<cost) return err('Il faut '+eur(cost,0)+'.'); payCap('fab','Parcelles : '+FAB_CROP[c].n,-cost); s.parc[c]=(s.parc[c]||0)+n; return ok(); }
function fabParcelSell(sid,c,n){ const s=fabSite(sid); if(!s||!s.parc||!(s.parc[c]>0)) return err('Aucune parcelle.'); n=Math.min(s.parc[c],Math.max(1,n|0));
  payCap('fab','Vente de parcelles : '+FAB_CROP[c].n,n*FAB_PARCEL*.7); s.parc[c]-=n; return ok(); }
function fabSellStock(sid){ const s=fabSite(sid); if(!s) return err('Site inconnu.'); let v=0; Object.keys(s.st).forEach(p=>{ if(!D.PRODS[p]) return; v+=s.st[p]*fabPrice(p)*(s.qm[p]||1); s.st[p]=0; });
  if(v<1) return err('Aucun stock à vendre.'); pay('fab','Vente du stock : '+s.name,v,'corp'); return ok('Stock vendu '+eur(v,0)+'.'); }
function fabSiteSell(sid){ const s=fabSite(sid); if(!s) return err('Site inconnu.'); fabSellStock(sid);
  let v=s.lines.reduce((a,l)=>a+fabLineValue(s,l)*.6,0)+Object.values(s.parc||{}).reduce((a,n)=>a+n*FAB_PARCEL*.7,0)+(s.halls||0)*fabSetupCost(s.t)*.8;
  payCap('fab','Cession : '+s.name,v); s.blds.forEach(id=>{ const h=S.bld[id]; if(!h) return; if(h.dep) payCap('c:'+id.split('.')[0],'Restitution du dépôt de garantie',h.dep); delete S.bld[id]; });
  S.fab.sites=S.fab.sites.filter(x=>x!==s); return ok('Site cédé '+eur(v,0)+'.'); }
{ const _lb=leaveBuilding; leaveBuilding=function(id){ const h=bldHeld(id); if(h&&h.fab) return err('Une usine occupe ce terrain : cédez le site depuis l’onglet Usines.'); return _lb(id); }; }

/* ---------- conversion des anciennes usines (sociétés) en sites, fusionnées par type et par ville ---------- */
function fabMigrate(s){ if(!s||!Array.isArray(s.biz)) return; const old=s.biz.filter(b=>FAB_OLD.includes(b.def)); if(!old.length) return;
  const S0=S; S=s; try{ fabInit(); const groups={};
    old.forEach(b=>{ const t= b.def==='phones'? 'electronics' : b.def, k=t+'|'+b.city; (groups[k]=groups[k]||{t, city:b.city, L:[]}).L.push(b); });
    Object.values(groups).forEach(G=>{ const F=S.fab, id=F.n++, t=G.t;
      let val=0, stock=0; G.L.forEach(b=>{ try{ val+=bizValue(b); }catch(e){} try{ if(b.st) Object.keys(b.st).forEach(p=>{ if(D.PRODS[p]) stock+=(b.st[p]||[]).reduce((a,x)=>a+x,0)*D.PRODS[p].v; }); }catch(e){} });
      const blds=G.L.map(b=>b.bld).filter(Boolean);
      const site={id, t, city:G.city, dist:(G.L[0].dist||''), blds, name:FAB_T[t].n+' · '+fabCityN(G.city), halls:0, lines:[], parc:{}, st:{}, qm:{}, mode:'sell', buy:1, since:s.day};
      blds.forEach(bid=>{ if(s.bld&&s.bld[bid]){ s.bld[bid].biz=null; s.bld[bid].fab=id; } });
      let left=val;
      if(t==='farm'){ let n=0; G.L.forEach(b=>{ if(b.m&&Array.isArray(b.m.p)) n+=b.m.p.filter(Boolean).length; }); n=Math.max(n,Math.floor(left*.6/FAB_PARCEL)); n=Math.min(n,Math.floor(left/FAB_PARCEL)); n=Math.max(1,n);
        site.parc={ble:Math.ceil(n*.4), leg:Math.ceil(n*.3), vaches:Math.max(1,Math.floor(n*.3))}; left-=n*FAB_PARCEL; }
      const prods=fabProdsOf(t); let i=0;
      while(left>0&&site.lines.length<Math.max(fabSlots(site),G.L.length)){ const p=prods[i%prods.length], g=fabAutoPlan(t,p), c=g.reduce((a,it)=>a+fabMCost(t,it[0]),0);
        if(c>left&&site.lines.length) break; site.lines.push({id:site.lines.length+1, p, g, on:1, v:1}); left-=c; i++; }
      if(site.lines.length>fabSlots(site)) site.halls=Math.ceil((site.lines.length-fabSlots(site))/2);
      if(left>0) s.cash+=left; if(stock>0) s.cash+=stock*.9;
      F.sites.push(site);
      (s.journal=s.journal||[]).push({d:s.day,s:'info',k:'own',m:'Vos usines deviennent des sites industriels : '+site.name+' regroupe '+G.L.length+' ancienne'+(G.L.length>1?'s':'')+' usine'+(G.L.length>1?'s':'')+', avec '+site.lines.length+' ligne'+(site.lines.length>1?'s':'')+(left>0?' (solde remboursé : '+eur(left,0)+')':'')+'.'}); });
    s.biz=s.biz.filter(b=>!FAB_OLD.includes(b.def));
    if(s.ind){ s.ind.offers=[]; s.ind.active=[]; }
  } finally { S=S0; } }
{ const _mig=migrateState; migrateState=function(st){ const r=_mig(st); try{ fabMigrate(r); }catch(e){ console.error(e); } return r; }; }
