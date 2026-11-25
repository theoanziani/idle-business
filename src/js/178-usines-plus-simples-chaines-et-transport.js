/* ============================================================
   V2.8.5 : USINES PLUS SIMPLES · CHAÎNES DE PRODUCTION · TRANSPORT
   - Assistant en 4 étapes sur chaque ligne (relier les quais, poser les machines dans l'ordre, équilibrer,
     options), avec « Tracer le convoyeur pour moi ».
   - Convoyeur tracé au doigt, flèches de sens, numéros d'étape sur les machines, cases conseillées
     (vert : la machine travaillera ; rouge : hors ordre), palette rangée en onglets.
   - « Prochaine amélioration » en un bouton : machine manquante ou du goulot, gain et coût affichés.
   - Nouveau produit : un menu déroulant montre toute la chaîne, des matières premières au produit,
     avec les lignes à créer (des lignes peuvent en alimenter d'autres).
   - Livraison des produits finis à vos sociétés : par votre compagnie maritime, ou par un service de
     transport acheté par l'usine. Sans transport, tout part au marché de gros.
   ============================================================ */
try{ if(typeof TIP1!=='undefined'&&TIP1.logi) TIP1.logi='Usines : vos sites, leurs lignes de production et leurs livraisons à vos sociétés.'; }catch(e){}
try{ MDESC.logi='Sites, lignes de production, livraisons'; }catch(e){}

/* ---------- transport vers vos sociétés ---------- */
const fabShipOwnOk = () => S.biz.some(b=>b.def==='shipping'&&b.status==='active');
const fabSvcFee = s => Math.round(800+.012*((s.d&&s.d.own)||0));
const fabShipMode = s => s.ship==='own'&&fabShipOwnOk()? 'own' : s.ship==='svc'? 'svc' : null;
{ const _fi=fabInit; fabInit=function(){ const F=_fi(); F.sites.forEach(s=>{ if(s.ship===undefined) s.ship= fabShipOwnOk()? 'own' : 'svc'; }); return F; }; }
{ const _fb=fabBuild; fabBuild=function(t,bid){ const r=_fb(t,bid); if(r&&r.ok){ const s=fabSite(+r.msg); if(s) s.ship=null; } return r; }; }
{ const _fs=fabStep; fabStep=function(){ _fs(); let fee=0; fabSites().forEach(s=>{ if(fabShipMode(s)==='svc') fee+=fabSvcFee(s); }); if(fee>0) pay('fab','Services de transport de vos usines',-fee,'corp'); }; }
supStep=function(){ const F=fabInit(); let ownRev=0; F.sites.forEach(s=>{ if(s.d) s.d.own=0; });
  S.biz.forEach(b=>{ if(SUP_NEED[b.def]){ b.supSave=0; b.supIn=0; b.supQ=0; b.supMiss=0; b.supP={}; } });
  const tot={}, SR=F.sites.filter(s=>fabShipMode(s));
  Object.keys(D.PRODS).forEach(p=>{ const C=S.biz.filter(x=>SUP_NEED[x.def]&&SUP_NEED[x.def][p]&&x.status==='active'&&supSrc(x)!=='mkt'); if(!C.length) return;
    const need=C.map(c=>supNeedP(c,p)), totNeed=need.reduce((a,x)=>a+x,0); if(totNeed<=0) return;
    const pr=fabPrice(p), avail=SR.reduce((a,s)=>a+(s.st[p]||0),0)*pr, ratio=Math.min(1,avail/totNeed);
    C.forEach((c,i)=>{ let want=need[i]*ratio; const own=supSrc(c)==='own', disc=own? SUP_OWN : SUP_DISC; let got=0, qs=0;
      SR.filter(s=>(s.st[p]||0)>1e-9).sort((a,b)=>route(a.city,c.city).rate-route(b.city,c.city).rate).forEach(s=>{ if(want<=1e-6) return; const R=route(s.city,c.city), q=s.qm[p]||1, rate=R.rate*(fabShipMode(s)==='own'? .4 : 1);
        const u=Math.min(s.st[p],want/pr); if(u<=0) return; s.st[p]-=u; const v=u*pr; want-=v; got+=v; qs+=v*(q>1?2:0); ownRev+=v*q; s.d=s.d||{}; s.d.own=(s.d.own||0)+v*q; c.supSave+=v*Math.max(0,disc-rate); });
      c.supIn+=got; c.supP[p]=[need[i],got,got? qs/got : 0]; if(got>0) c.supDay=S.day;
      const T=tot[c.id]||(tot[c.id]={need:0,got:0,qs:0,c}); T.need+=need[i]; T.got+=got; T.qs+=qs; }); });
  Object.values(tot).forEach(T=>{ const c=T.c; c.supQ= T.need>0? T.qs/T.need : 0; c.supMiss= supSrc(c)==='own'&&T.need>0? Math.max(0,1-T.got/T.need) : 0; });
  if(ownRev>0){ pay('fab','Livraisons à vos sociétés',ownRev,'corp'); F.ownRev=(F.ownRev||0)+ownRev; } };
/* la réserve pour vos sociétés n'est gardée que si le site peut les livrer */

/* ---------- aides de placement ---------- */
function fabSimAdd(s,l,k,x,y,rot){ const sim={id:'sim'+l.id, p:l.p, g:l.g.concat([[k,x,y,rot?1:0]]), v:'s'+x+'_'+y+'_'+k+'_'+rot+'_'+l.v}; return fabAnalyze(s,sim); }
function fabCands(s,l,k,rot){ const m=FAB_M[k], out=[]; if(!m||k==='cv'||k==='in'||k==='out') return out; const r= rot&&m.w!==m.h? 1 : 0, A=fabAnalyze(s,l); if(!A.ok) return out;
  for(let y=0;y<FAB_H;y++) for(let x=0;x<FAB_W;x++){ if(!fabFits(l,k,x,y,r)) continue; const A2=fabSimAdd(s,l,k,x,y,r), st=A2.mach[l.g.length].st; if(st==='off') continue; out.push({x,y,r,st,gain:A2.rate-A.rate,A2}); }
  return out; }
/* le convoyeur le plus court entre les quais, par les cases libres */
function fabRoutePlan(l){ const W=FAB_W, H=FAB_H, occ=new Array(W*H).fill(-1); l.g.forEach((it,i)=>{ const [w,h]=fabDim(it); for(let y=it[2];y<it[2]+h;y++) for(let x=it[1];x<it[1]+w;x++) occ[y*W+x]=i; });
  const cellsOf=it=>{ const [w,h]=fabDim(it), r=[]; for(let y=it[2];y<it[2]+h;y++) for(let x=it[1];x<it[1]+w;x++) r.push([x,y]); return r; };
  const nb=(x,y)=>[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>a>=0&&b>=0&&a<W&&b<H);
  const free=(x,y)=>occ[y*W+x]<0||l.g[occ[y*W+x]][0]==='cv';
  const ins=l.g.filter(it=>it[0]==='in'), outs=l.g.filter(it=>it[0]==='out'); if(!ins.length||!outs.length) return null;
  const goal=new Set(); outs.forEach(it=>cellsOf(it).forEach(([x,y])=>nb(x,y).forEach(([a,b])=>{ if(free(a,b)) goal.add(b*W+a); })));
  const prev=new Map(), q=[]; ins.forEach(it=>cellsOf(it).forEach(([x,y])=>nb(x,y).forEach(([a,b])=>{ if(free(a,b)&&!prev.has(b*W+a)){ prev.set(b*W+a,-1); q.push(b*W+a); } })));
  while(q.length){ const v=q.shift(); if(goal.has(v)){ const p=[]; for(let u=v;u!==-1;u=prev.get(u)) p.unshift(u); return p.filter(u=>occ[u]<0).map(u=>[u%W,Math.floor(u/W)]); }
    nb(v%W,Math.floor(v/W)).forEach(([a,b])=>{ const u=b*W+a; if(free(a,b)&&!prev.has(u)){ prev.set(u,v); q.push(u); } }); }
  return null; }
function fabRoute(sid,lid){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l) return err('Ligne inconnue.'); const P=fabRoutePlan(l); if(!P) return err('Aucun passage libre entre les quais : retirez une machine.');
  const c=P.length*fabMCost(s.t,'cv'); if(S.cash<c) return err('Il faut '+eur(c,0)+'.'); P.forEach(([x,y])=>l.g.push(['cv',x,y,0])); l.v=(l.v||0)+1; payCap('fab','Convoyeur : '+s.name,-c); return ok(); }
/* prochaine amélioration conseillée */
function fabNext(s,l){ const A=fabAnalyze(s,l), P=D.PRODS[l.p];
  if(!A.ok){ const R=fabRoutePlan(l); return {step:1, txt:'Reliez le quai d’arrivée au quai d’expédition par un convoyeur.', act:R? 'fabroute' : null, cost:R? R.length*fabMCost(s.t,'cv') : 0, btn:'Tracer le convoyeur pour moi'}; }
  const miss=A.stages.findIndex(x=>!x.n), si= miss>=0? miss : A.bott, k=P.st[si];
  if(miss>=0||A.eff<.85){ const C=fabCands(s,l,k,0).concat(FAB_M[k].w!==FAB_M[k].h? fabCands(s,l,k,1) : []).filter(c=>c.st==='ok').sort((a,b)=>b.gain-a.gain||((a.A2.L)-(b.A2.L)));
    const best=C[0]; return {step: miss>=0? 2 : 3, k, best, txt: miss>=0? 'Il manque l’étape '+(si+1)+' : '+FAB_M[k].n.toLowerCase()+'.' : 'Goulot : '+FAB_M[k].n.toLowerCase()+' ('+fabU(A.stages[si].cap)+' '+P.u+' / jour).',
      gain: best? best.gain : 0, cost:fabMCost(s.t,k), act: best? 'fabnext' : null, btn: best? 'Ajouter · '+eur(fabMCost(s.t,k),0) : 'Plus de place sur la grille'}; }
  for(const k2 of ['buf','qc','mnt']){ if((k2==='buf'&&A.buf<1)||(k2==='qc'&&!A.qc)||(k2==='mnt'&&!A.mnt)){ const C=fabCands(s,l,k2,0).concat(fabCands(s,l,k2,1)).filter(c=>c.st==='ok').sort((a,b)=>b.gain-a.gain); const best=C[0];
      return {step:4, k:k2, best, txt: k2==='buf'? 'Ajoutez un stock tampon : +6 % de cadence.' : k2==='qc'? 'Ajoutez un contrôle qualité en fin de ligne : prix +8 %.' : 'Ajoutez un atelier de maintenance : pannes divisées par trois.', gain:best?best.gain:0, cost:fabMCost(s.t,k2), act:best?'fabnext':null, btn: best? 'Ajouter · '+eur(fabMCost(s.t,k2),0) : 'Plus de place sur la grille'}; } }
  return {step:5, txt:'Ligne complète. Pour produire plus, ajoutez une machine au goulot ou une nouvelle ligne.'}; }
function fabDoNext(sid,lid){ const s=fabSite(sid), l=s&&s.lines.find(z=>z.id===+lid); if(!l) return err('Ligne inconnue.'); const n=fabNext(s,l); if(!n.best) return err('Plus de place sur la grille.');
  return fabPlace(s.id,l.id,n.k,n.best.x,n.best.y,n.best.r); }

/* ---------- chaîne de production d'un produit ---------- */
const fabMakers = p => { const L=[]; fabSites().forEach(s=>{ s.lines.forEach(l=>{ if(l.p===p&&l.on!==0) L.push([s,l]); }); }); return L; };
function fabFarmOf(p){ let n=0; fabSites().forEach(s=>{ if(s.t==='farm') Object.keys(s.parc||{}).forEach(c=>{ if(FAB_CROP[c].p===p) n+=s.parc[c]; }); }); return n; }
function fabChainNode(p,q,depth,seen){ const raw=FAB_RAW[p], P=fabProdDef(p), id='ch'+p;
  const ic=fabProdSvg(p,30), qty= q? '<small class="fab-chq">'+fabU(q)+' '+esc(P.u)+'</small>' : '';
  if(raw) return '<div class="fab-chn leaf">'+ic+'<span><b>'+esc(P.n)+'</b>'+qty+'<small>Matière achetée au marché · '+eur(fabPrice(p),2)+' / '+esc(P.u.replace(/s$/,''))+'</small></span></div>';
  if(P.raw){ const n=fabFarmOf(p); return '<div class="fab-chn leaf">'+ic+'<span><b>'+esc(P.n)+'</b>'+qty+'<small>'+(n? '<span class="fab-ok">Vos fermes · '+plu(n,'parcelle')+'</span>' : 'Récolte d’une ferme, sinon achetée au marché')+'</small></span>'+(n? '' : fabChainBtn('farm',null))+'</div>'; }
  const M=fabMakers(p), u=M.reduce((a,[s,l])=>a+fabAnalyze(s,l).rate,0), T=FAB_T[P.fac];
  const st= M.length? '<span class="fab-ok">'+plu(M.length,'ligne')+' · '+fabU(u)+' '+esc(P.u)+' / jour</span>' : 'Aucune ligne : acheté au marché';
  const kids=Object.keys(P.in||{}).filter(x=>!seen.has(x));
  const head='<span class="fab-chh">'+ic+'<span><b>'+esc(P.n)+'</b>'+qty+'<small>'+esc(T.n)+' · '+st+'</small></span></span>'+fabChainBtn(P.fac,p);
  if(!kids.length) return '<div class="fab-chn">'+head+'</div>';
  const S2=new Set(seen); S2.add(p);
  return '<details class="fab-chd"'+(depth<1?' open':'')+'><summary>'+head+'</summary><div class="fab-chk">'+kids.map(x=>fabChainNode(x,P.in[x],depth+1,S2)).join('')+'</div></details>'; }
function fabChainBtn(t,p){ const S0=fabSites().filter(s=>s.t===t), ok=unlocked(FAB_T[t].tier); if(!ok) return '<span class="fab-chb lock">Palier '+esc(D.TIERS[FAB_T[t].tier].n)+'</span>';
  if(!p) return S0.length? '' : '<button class="fab-chb" data-a="fabchbuild" data-i="'+t+'">Construire</button>';
  const free=S0.find(s=>s.lines.length<fabSlots(s)); if(free) return '<button class="fab-chb" data-a="fabchl" data-i="'+free.id+'" data-v="'+p+'">Créer la ligne</button>';
  if(S0.length) return '<button class="fab-chb" data-a="fabgo" data-i="'+S0[0].id+'">Agrandir le site</button>';
  return '<button class="fab-chb" data-a="fabchbuild" data-i="'+t+'">Construire</button>'; }
const fabChain = p => '<div class="fab-ch">'+fabChainNode(p,0,0,new Set())+'</div>';

/* ---------- styles ---------- */
NF_CSS.push(`
.fab-ast{background:#1A2540;border:1px solid #2B4A80;border-radius:16px;padding:10px 12px;margin:0 0 10px;color:#DCE8FF;font:600 13px var(--f-body)}
.fab-ast .hd{display:flex;justify-content:space-between;align-items:center}.fab-ast b{font:900 13px var(--f-body)}
.fab-ast .pg{display:flex;gap:4px;margin:8px 0}.fab-ast .pg i{flex:1;height:5px;border-radius:3px;background:#2A3550}.fab-ast .pg i.d{background:#5BE39A}.fab-ast .pg i.c{background:#7FD3FF}
.fab-ast .btn{margin-top:8px;background:#7FD3FF;color:#0B1A33;border:0;min-height:40px}.fab-ast .x{background:none;border:0;color:#9FB3D6;font:800 11.5px var(--f-body);min-height:32px}
.fab-nx{display:flex;gap:8px;align-items:center;background:#2A1C10;border:1px solid #5A3A14;border-radius:16px;padding:10px 12px;margin:10px 0;color:#FFD9A8;font:600 13px var(--f-body)}
.fab-nx b{font:900 13px var(--f-body);color:#FFB089}.fab-nx .btn{white-space:nowrap}
.fab-ptabs{display:flex;gap:6px;margin-top:10px}.fab-ptabs button{flex:1;min-height:38px;border-radius:12px;border:1.5px solid var(--line);background:transparent;color:var(--ink-3);font:800 12.5px var(--f-body)}
.fab-ptabs button.on{border-color:#E8B84A;color:#E8B84A}
.fab-pal button{position:relative}.fab-pal .stg{position:absolute;top:3px;left:4px;font:900 9.5px var(--f-body);border-radius:99px;padding:1px 6px;background:#E8B84A;color:#2A1C00}.fab-pal .stg.ok{background:#5BE39A}
.fab-help{background:#13261A;border-radius:12px;padding:8px 10px;margin:6px 0;color:#BFF5D5;font:600 12.5px var(--f-body)}
.fab-tip{margin:-4px 0 10px 56px;font:700 12.5px var(--f-body)}
.fab-ch{margin:6px 0}.fab-chd>summary{list-style:none;cursor:pointer}.fab-chd>summary::-webkit-details-marker{display:none}
.fab-chd>summary,.fab-chn{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--line);min-height:44px}
.fab-chh{display:flex;align-items:center;gap:8px;min-width:0}.fab-chh b,.fab-chn b{font:800 13px var(--f-body)}.fab-chh small,.fab-chn small{display:block;font:600 11.5px var(--f-body);color:var(--ink-3)}
.fab-chn{padding-left:0}.fab-chn>span{flex:1;min-width:0}.fab-chq{display:inline!important;margin-left:6px;color:#E8B84A!important;font-weight:800!important}
.fab-chk{padding-left:16px;border-left:2px solid rgba(232,184,74,.35);margin-left:14px}
.fab-chd>summary .fab-chh::before{content:'▸';color:#E8B84A;font-weight:900;margin-right:2px}.fab-chd[open]>summary .fab-chh::before{content:'▾'}
.fab-chb{flex:0 0 auto;min-height:36px;border-radius:10px;border:1.5px solid #E8B84A;background:transparent;color:#E8B84A;font:800 12px var(--f-body);padding:0 10px}.fab-chb.lock{border-color:var(--line);color:var(--ink-3);display:inline-flex;align-items:center}
.fab-ship{display:block;width:100%;text-align:left;border:1.5px solid var(--line);background:transparent;color:var(--ink);border-radius:14px;padding:10px 12px;margin-bottom:6px;min-height:48px}
.fab-ship.on{border-color:#E8B84A;background:rgba(232,184,74,.08)}.fab-ship b{font:800 13.5px var(--f-body)}.fab-ship small{display:block;font:600 12px var(--f-body);color:var(--ink-3)}
.fab-howto{display:block;width:100%;height:auto;margin:6px 0 10px}
`);
try{ const e=document.getElementById('nf-css'); if(e) e.textContent+='\n'+NF_CSS[NF_CSS.length-1]; else nfCssOnce(); }catch(e){}

/* ---------- grille : flèches, numéros d'étape, cases conseillées ---------- */
{ const _g=fabGridSvg; fabGridSvg=function(s,l,A,U){ let h=_g(s,l,A,U); const C=40, P=D.PRODS[l.p]; let o='';
    /* sens du convoyeur */
    A.path.forEach((v,i)=>{ if(i%2) return; const nx=A.path[i+1]; if(nx===undefined) return; const x=(v%FAB_W)*C+20, y=Math.floor(v/FAB_W)*C+20, dx=(nx%FAB_W)-(v%FAB_W), dy=Math.floor(nx/FAB_W)-Math.floor(v/FAB_W), a=Math.atan2(dy,dx)*180/Math.PI;
      o+='<path d="M-4 -6 L4 0 L-4 6" transform="translate('+x+' '+y+') rotate('+a+')" stroke="#F5C451" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; });
    /* numéros d'étape */
    l.g.forEach((it,i)=>{ const si=P.st.indexOf(it[0]); if(si<0) return; const M=A.mach[i]||{}, col= M.st==='ok'? '#E8B84A' : '#FF7B72';
      o+='<g><circle cx="'+(it[1]*C+12)+'" cy="'+(it[2]*C+12)+'" r="9" fill="'+col+'" stroke="#1A1A1A" stroke-width="1.5"/><text x="'+(it[1]*C+12)+'" y="'+(it[2]*C+15.5)+'" text-anchor="middle" font-size="11" font-weight="900" fill="#1A1100" font-family="system-ui">'+(si+1)+'</text></g>'; });
    /* cases conseillées pour la machine choisie */
    if(U.tool&&!['cv','in','out','del'].includes(U.tool)){ const m=FAB_M[U.tool], r=U.rot&&m.w!==m.h?1:0, w=r?m.h:m.w, hh=r?m.w:m.h;
      fabCands(s,l,U.tool,r).forEach(c=>{ o+='<rect x="'+(c.x*C+3)+'" y="'+(c.y*C+3)+'" width="'+(w*C-6)+'" height="'+(hh*C-6)+'" rx="6" fill="'+(c.st==='ok'?'#5BE39A':'#FF7B72')+'" fill-opacity="'+(c.st==='ok'?.16:.1)+'" stroke="'+(c.st==='ok'?'#5BE39A':'#FF7B72')+'" stroke-opacity=".7" stroke-dasharray="4 3"/>'; }); }
    /* tracé conseillé du convoyeur */
    if(!A.ok){ const R=fabRoutePlan(l); if(R&&R.length) o+='<path d="M'+R.map(([x,y])=>(x*C+20)+' '+(y*C+20)).join(' L')+'" stroke="#7FD3FF" stroke-width="9" stroke-dasharray="2 10" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".75"/>'; }
    const k=h.indexOf('<rect class="fab-cell"'); return k>0? h.slice(0,k)+o+h.slice(k) : h; }; }

/* ---------- l'écran d'une ligne ---------- */
const FAB_AST=['Reliez les quais','Posez les machines','Équilibrez','Options'];
vFabLine=function(){ const U=fabUI(), s=fabSite(U.s), l=s.lines.find(x=>x.id===U.l), P=D.PRODS[l.p], A=fabAnalyze(s,l), E=fabLineEco(s,l), N=fabNext(s,l); let h='';
  h+='<button class="back" data-a="fabback" data-v="l">‹ '+esc(s.name)+'</button><div class="fab-hero">'+fabProdSvg(l.p,56)+'<div><h2 class="fab-h">Ligne '+l.id+' · '+P.n+'</h2><small>'+(l.on===0?'En pause · ':'')+eur(fabPrice(l.p),fabPrice(l.p)<100?2:0)+' l’unité · '+plu(E.wk,'ouvrier')+'</small></div></div>';
  h+='<div class="fab-stats"><div><small>Production</small><b>'+fabU(A.rate)+'</b><small>'+P.u+' / jour</small></div><div><small>Sans le goulot</small><b class="fab-ok">'+fabU(A.next)+'</b><small>'+P.u+' / jour</small></div><div><small>Rendement</small><b style="color:'+fabEffCol(A.eff)+'">'+Math.round(A.eff*100)+' %</b><small>'+(E.net>=0?'+':'')+eur(E.net,0)+' / j</small></div></div>';
  /* assistant */
  if(!(S.fabAstOff&&N.step<5)&&N.step<5){ h+='<div class="fab-ast"><div class="hd"><b>Assistant · étape '+N.step+' sur 4 : '+FAB_AST[N.step-1]+'</b><button class="x" data-a="fabastx">Masquer</button></div><div class="pg">'+[1,2,3,4].map(i=>'<i class="'+(i<N.step?'d':i===N.step?'c':'')+'"></i>').join('')+'</div>'+N.txt+
      (N.step===1? ' Choisissez l’onglet Convoyeur, puis glissez le doigt sur la grille.' : N.step===2? ' Choisissez la machine dans l’onglet Machines : les cases vertes sont les bonnes.' : '')+
      (N.act? '<br><button class="btn" data-a="'+N.act+'">'+N.btn+(N.step===1? ' · '+eur(N.cost,0) : '')+(N.gain>0? ' · +'+fabU(N.gain)+' / j' : '')+'</button>' : '')+'</div>'; }
  else if(S.fabAstOff&&N.step<5) h+='<button class="btn sm" style="margin-bottom:8px" data-a="fabastx">Afficher l’assistant</button>';
  h+='<div class="fab-gridw">'+fabGridSvg(s,l,A,U)+'</div>';
  /* palette en onglets */
  const pt=U.ptab||(A.ok?'mach':'cv'); if(pt==='cv'&&!U.tool) U.tool='cv'; const tool=U.tool||null;
  h+='<div class="fab-ptabs">'+[['mach','Machines'],['cv','Convoyeur'],['opt','Options'],['del','Gomme']].map(([k,n])=>'<button class="'+(pt===k?'on':'')+'" data-a="fabptab" data-i="'+k+'">'+n+'</button>').join('')+'</div>';
  const kinds= pt==='mach'? P.st.filter((k,i,a)=>a.indexOf(k)===i) : pt==='cv'? ['cv','in','out'] : pt==='opt'? ['buf','qc','mnt'] : [];
  const pbtn=k=>{ const m=FAB_M[k], w=Math.min(m.w,3), hh=Math.min(m.h,2), si=P.st.indexOf(k), done= si>=0&&A.stages[si].n>0;
    return '<button class="'+(tool===k?'on':'')+'" data-a="fabtool" data-i="'+k+'">'+(si>=0? '<span class="stg'+(done?' ok':'')+'">'+(done?'✓ ':'')+'Étape '+(si+1)+'</span>' : '')+'<svg viewBox="0 0 '+(w*40)+' '+(hh*40)+'" preserveAspectRatio="xMidYMid meet">'+(k==='cv'? '<rect x="3" y="3" width="34" height="34" rx="5" fill="#2B2E35"/><rect x="7" y="7" width="26" height="26" rx="3" fill="#4A4E57"/><path d="M10 20 H30 M24 14 L30 20 L24 26" stroke="#E8B84A" stroke-width="3" fill="none"/>' : fabDefs('pl'+k)+fabMachineSvg(k,w*40,hh*40,'pl'+k))+'</svg>'+esc(m.n.length>18? m.n.slice(0,17)+'…' : m.n)+'<small>'+eur(fabMCost(s.t,k),0)+'</small></button>'; };
  if(pt==='del') h+='<div class="fab-help" style="background:#3A1D12;color:#FFD0B8">Gomme active : touchez une machine ou un convoyeur pour le retirer (racheté 60 %).</div>';
  else h+='<div class="fab-pal">'+kinds.map(pbtn).join('')+'</div>';
  if(tool&&tool!=='del'){ const m=FAB_M[tool], si=P.st.indexOf(tool);
    h+='<div class="fab-help"><b>'+esc(m.n)+'</b>'+(si>=0? ' (étape '+(si+1)+')' : '')+' · '+(tool==='cv'? 'glissez le doigt sur la grille pour tracer ; touchez un convoyeur posé pour le retirer.' : m.aux&&m.d? m.d : 'touchez une case verte : la machine longera le convoyeur, après l’étape précédente.')+
      (m.c? ' · '+fabU(m.c*P.k)+' '+P.u+' / jour' : '')+(m.w!==m.h? ' <button class="btn sm" data-a="fabrot">Pivoter ('+(U.rot?'vertical':'horizontal')+')</button>' : '')+'</div>'; }
  /* machine sélectionnée */
  if(U.sel!=null&&l.g[U.sel]){ const it=l.g[U.sel], m=FAB_M[it[0]], M=A.mach[U.sel]||{}, o=fabMOpex(s.t,it[0],s.city);
    const st= M.st==='off'? '<span class="fab-amb">Non raccordée au convoyeur principal</span>' : M.st==='order'? '<span class="fab-amb">Placée avant l’étape précédente : elle ne travaille pas</span>' : M.st==='ok'? '<span class="fab-ok">En service</span>' : '';
    h+='<div class="fab-sel"><b>'+esc(m.n)+'</b><div class="sub">'+(m.c? fabU(m.c*P.k)+' '+P.u+' / jour · ' : '')+eur(o.lab+o.nrj,0)+' / jour'+(st?' · '+st:'')+'</div><div class="fab-acts">'+
      (m.w!==m.h? '<button class="btn" data-a="fabrotm">Tourner</button>' : '')+'<button class="btn'+(U.mv?' primary':'')+'" data-a="fabmv">'+(U.mv?'Touchez la nouvelle place':'Déplacer')+'</button><button class="btn" data-a="fabrm">Retirer</button><button class="btn" data-a="fabunsel">Fermer</button></div></div>'; }
  /* prochaine amélioration */
  if(N.step>=2&&N.step<5&&S.fabAstOff) h+='<div class="fab-nx"><span style="flex:1"><b>Prochaine amélioration</b><br>'+N.txt+(N.gain>0?' · +'+fabU(N.gain)+' '+P.u+' / jour':'')+'</span>'+(N.act? '<button class="btn sm primary" data-a="'+N.act+'">'+N.btn+'</button>' : '')+'</div>';
  if(N.step===5) h+='<div class="fab-nx" style="background:#0F2418;border-color:#1F5A33;color:#BFF5D5"><span style="flex:1"><b style="color:#6EE7A0">Ligne complète</b><br>'+N.txt+'</span></div>';
  /* étapes */
  const mx=Math.max(...A.stages.map(x=>x.cap),1);
  h+='<section class="card" style="margin-top:10px"><h2><span>Étapes de fabrication</span><span class="sub">convoyeur : '+A.L+' cases, '+plu(A.turns,'virage')+'</span></h2>'+A.stages.map((x,i)=>{ const b=i===A.bott;
    return '<div class="fab-stage"><svg viewBox="0 0 80 40">'+fabDefs('st'+x.k)+fabMachineSvg(x.k,80,40,'st'+x.k)+'</svg><div><b>'+(i+1)+'. '+esc(FAB_M[x.k].n)+'</b><small>'+(x.n? plu(x.n,'machine')+' en service' : '<span class="fab-warn">aucune machine en service</span>')+(x.tot>x.n? ' · <span class="fab-amb">'+(x.tot-x.n)+' mal placée'+(x.tot-x.n>1?'s':'')+'</span>' : '')+'</small><span class="fab-bar"><i style="width:'+Math.round(x.cap/mx*100)+'%;background:'+(b?'#E4572E':'#2FB36D')+'"></i></span></div><span class="c'+(b?' fab-warn':'')+'">'+fabU(x.cap)+'<small style="display:block;font-weight:700;color:var(--ink-3)">/ jour</small></span></div>'; }).join('')+
    '<div class="fab-row"><span>Convoyeur</span><b>× '+fmtN(A.fBelt,2)+'</b></div><div class="fab-row"><span>Stocks tampons ('+A.buf+' / 2)</span><b>× '+fmtN(A.fStop,2)+'</b></div><div class="fab-row"><span>Contrôle qualité</span><b class="'+(A.qc?'fab-ok':'')+'">'+(A.qc?'prix +8 %':'aucun')+'</b></div><div class="fab-row"><span>Maintenance</span><b class="'+(A.mnt?'fab-ok':'')+'">'+(A.mnt?'pannes ÷ 3':'pannes 2 % par jour')+'</b></div></section>';
  /* chaîne d'approvisionnement */
  if(Object.keys(P.in||{}).length) h+='<section class="card"><h2><span>D’où viennent les matières</span></h2><div class="sub">Quantités par '+esc(P.u.replace(/s$/,''))+'. Touchez une ligne pour déplier.</div>'+fabChain(l.p)+'</section>';
  /* économie */
  h+='<section class="card"><h2><span>Économie de la ligne par jour</span></h2><div class="fab-row"><span>Ventes au prix de gros</span><b>'+eur(E.rev,0)+'</b></div><div class="fab-row"><span>Matières</span><b class="fab-warn">−'+eur(E.mat,0)+'</b></div><div class="fab-row"><span>Ouvriers et énergie ('+esc(fabCityN(s.city))+')</span><b class="fab-warn">−'+eur(E.opex,0)+'</b></div><div class="fab-row"><span>Résultat</span><b class="'+(E.net>=0?'fab-ok':'fab-warn')+'">'+(E.net>=0?'+':'')+eur(E.net,0)+'</b></div></section>';
  const onlyBase=!l.g.some(it=>!['in','out','cv'].includes(it[0]));
  h+='<div class="fab-acts">'+(onlyBase? '<button class="btn primary" data-a="fabauto">Tout installer automatiquement · '+eur(fabAutoCost(s,l),0)+'</button>' : '')+'<button class="btn" data-a="fabpause">'+(l.on===0?'Relancer la ligne':'Mettre en pause')+'</button>'+
    (fabProdsOf(s.t).length>1? '<button class="btn" data-a="fabchg">Changer de produit</button>' : '')+'<button class="btn" data-a="fablnd">Démonter la ligne</button></div>';
  if(U.chg) h+='<div class="fab-pick" style="margin-top:8px">'+fabProdsOf(s.t).filter(p=>p!==l.p).map(p=>'<button class="fab-pc" data-a="fabsetp" data-i="'+p+'">'+fabProdSvg(p,44)+'<b>'+D.PRODS[p].n+'</b><small>mêmes étapes : '+(D.PRODS[p].st.join()===P.st.join()?'oui':'non')+'</small></button>').join('')+'</div>';
  return h; };

/* ---------- l'écran d'un site : conseils, transport, nouveau produit en chaîne ---------- */
function fabShipCard(s){ const m=fabShipMode(s), own=fabShipOwnOk();
  return '<section class="card"><h2><span>Livraison à vos sociétés</span></h2><div class="sub" style="margin-bottom:8px">Vos produits finis partent vers vos sociétés clientes ; le reste va au marché de gros.</div>'+
    '<button class="fab-ship'+(m==='own'?' on':'')+'" data-a="fabship" data-i="own"'+(own?'':' data-dis="1" data-why="Il vous faut une compagnie de transport maritime."')+' style="'+(own?'':'opacity:.55')+'"><b>Votre compagnie maritime</b><small>'+(own? 'Transport à 40 % du coût habituel, sans frais fixes.' : 'Achetez une compagnie de transport maritime pour livrer vous-même.')+'</small></button>'+
    '<button class="fab-ship'+(m==='svc'?' on':'')+'" data-a="fabship" data-i="svc"><b>Service de transport</b><small>Un transporteur livre pour vous : '+eur(fabSvcFee(s),0)+' par jour, transport au coût habituel.</small></button>'+
    '<button class="fab-ship'+(!m?' on':'')+'" data-a="fabship" data-i="none"><b>Aucun transport</b><small>Rien n’est livré à vos sociétés : tout est vendu au marché de gros.</small></button></section>'; }
{ const _vs=vFabSite; vFabSite=function(){ const U=fabUI(), s=fabSite(U.s), np=U.np, tab=U.tab||'lines'; U.np=0; let h=_vs(); U.np=np;
    /* conseil sous chaque ligne */
    s.lines.forEach(l=>{ const N=fabNext(s,l), key='data-a="fabln" data-i="'+l.id+'"', k=h.indexOf(key); if(k<0) return; const e=h.indexOf('</button>',k)+9;
      const t= N.step===1? '→ Ligne inachevée : reliez les quais (étape 1 sur 4)' : N.step===2? '→ '+N.txt : N.step===3? '→ '+N.txt+(N.gain>0?' Ajouter une machine : +'+fabU(N.gain)+' / jour':'') : N.step===4? '→ '+N.txt : '';
      if(t) h=h.slice(0,e)+'<div class="fab-tip" style="color:'+(N.step===1?'#7FD3FF':'#FFB089')+'">'+t+'</div>'+h.slice(e); });
    /* comment ça marche */
    const hk=h.indexOf('<div class="fab-tabs">'); if(hk>0) h=h.slice(0,hk)+'<button class="btn sm" style="width:100%;margin-bottom:10px" data-a="fabhow">Comment ça marche ?</button>'+(fabShipMode(s)? '' : '<div class="notice warn" style="margin-bottom:10px">Choisissez comment livrer vos sociétés (onglet Stock et débouchés) : pour l’instant, tout part au marché de gros.</div>')+h.slice(hk);
    if(tab==='stock'){ const k=h.indexOf('<section class="card"><h2><span>Stock du site'); const c=fabShipCard(s); h= k>0? h.slice(0,k)+c+h.slice(k) : h+c; }
    if(tab==='lines'&&np){ const k=h.indexOf('</div>',h.indexOf('class="fab-tabs"'))+6; h=h.slice(0,k)+fabNewPick(s)+h.slice(k); }
    return h; }; }
function fabNewPick(s){ const U=fabUI(), sel=U.npSel;
  return '<section class="card"><h2><span>Nouvelle ligne : quel produit ?</span></h2><div class="sub" style="margin-bottom:8px">Touchez un produit pour voir toute sa chaîne, des matières premières au produit fini.</div>'+
    fabProdsOf(s.t).map(p=>{ const P=D.PRODS[p], on=sel===p; return '<details class="fab-chd"'+(on?' open':'')+'><summary data-a="fabnps" data-i="'+p+'"><span class="fab-chh">'+fabProdSvg(p,40)+'<span><b>'+esc(P.n)+'</b><small>'+eur(fabPrice(p),fabPrice(p)<100?2:0)+' l’unité · '+P.st.length+' étapes</small></span></span></summary>'+
      (on? '<div style="padding:6px 0 8px">'+fabChain(p)+'<button class="btn primary" style="width:100%;margin-top:8px" data-a="fabnl" data-i="'+p+'">Créer la ligne de '+esc(P.n.toLowerCase())+' ici</button></div>' : '')+'</details>'; }).join('')+
    '<button class="btn" style="margin-top:8px" data-a="fabnp">Annuler</button></section>'; }
/* onglet principal : « Nouveau produit » */
{ const _vf=vFab; vFab=function(){ const U=fabUI(); let h=_vf(); if(U.pk||U.s) return h;
    return h.replace('<button class="btn primary" style="width:100%;min-height:48px;margin-top:6px" data-a="fabpk">Construire un site</button>',
      '<div class="fab-acts"><button class="btn primary" style="flex:1;min-height:48px" data-a="fabnprod">Nouveau produit</button><button class="btn" style="flex:1;min-height:48px" data-a="fabpk">Construire un site</button></div>'); }; }
function fabHowSvg(){ const box=(x,n,c,t)=>'<g transform="translate('+x+' 40)"><rect width="56" height="40" rx="8" fill="'+c+'"/><circle cx="10" cy="10" r="8" fill="#E8B84A"/><text x="10" y="13.5" text-anchor="middle" font-size="10" font-weight="900" fill="#1A1100">'+n+'</text><text x="28" y="30" text-anchor="middle" font-size="8" font-weight="800" fill="#F2F3F7">'+t+'</text></g>';
  return '<svg class="fab-howto" viewBox="0 0 360 120"><rect width="360" height="120" rx="14" fill="#0E1013"/><rect x="8" y="88" width="344" height="14" rx="7" fill="#4A4E57"/>'+[...Array(14)].map((_,i)=>'<path d="M'+(20+i*24)+' 90 l6 5 l-6 5" stroke="#F5C451" stroke-width="2" fill="none"/>').join('')+
    '<rect x="6" y="40" width="40" height="40" rx="8" fill="#3C4452"/><text x="26" y="64" text-anchor="middle" font-size="8" font-weight="900" fill="#E8EDF4">ENTRÉE</text>'+box(56,1,'#5B6472','Presse')+box(120,2,'#8A5A12','Soudure')+box(184,3,'#1F4D63','Peinture')+box(248,4,'#3D4A5C','Montage')+
    '<rect x="314" y="40" width="40" height="40" rx="8" fill="#2F3A33"/><text x="334" y="64" text-anchor="middle" font-size="8" font-weight="900" fill="#E8B84A">SORTIE</text><text x="180" y="24" text-anchor="middle" font-size="11" font-weight="800" fill="#C9CBD6">Les machines longent le convoyeur, dans l’ordre</text></svg>'; }
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(!m||!/^fab/.test(m.type||'')) return _mc();
  if(m.type==='fabhow') return {title:'Comment marche une usine', body:fabHowSvg()+'<ul class="sub" style="padding-left:18px;margin:0;line-height:1.6"><li>Un site a des <b>lignes</b> ; chaque ligne fabrique un produit sur une grille.</li><li>Un <b>convoyeur</b> relie le quai d’arrivée au quai d’expédition.</li><li>Les machines qui le <b>longent</b> travaillent, dans l’ordre des étapes (1, 2, 3…).</li><li>La ligne va au rythme de son étape la plus lente : le <b>goulot</b>, entouré en rouge.</li><li>Les matières viennent de vos autres usines ou du marché ; les produits finis vont à vos sociétés par transport, le reste au marché de gros.</li></ul><button class="btn primary" style="width:100%;margin-top:12px" data-a="closemodal">Compris</button>'};
  if(m.type==='fabprod'){ const sel=m.p, L=FAB_ORDER.filter(t=>unlocked(FAB_T[t].tier));
    return {title:'Nouveau produit', body:'<div class="sub" style="margin-bottom:8px">Choisissez le produit fini : la chaîne montre chaque ligne à créer, des matières premières jusqu’à lui.</div>'+
      L.map(t=>'<div class="auc-h" style="margin:10px 0 2px">'+esc(FAB_T[t].n)+'</div>'+fabProdsOf(t).map(p=>{ const P=D.PRODS[p], on=sel===p; return '<details class="fab-chd"'+(on?' open':'')+'><summary data-a="fabnprodp" data-i="'+p+'"><span class="fab-chh">'+fabProdSvg(p,36)+'<span><b>'+esc(P.n)+'</b><small>'+eur(fabPrice(p),fabPrice(p)<100?2:0)+' l’unité'+(fabMakers(p).length?' · <span class="fab-ok">déjà produit</span>':'')+'</small></span></span></summary>'+(on? '<div style="padding:4px 0 8px">'+fabChain(p)+'</div>' : '')+'</details>'; }).join('')).join('')}; }
  return _mc(); }; }

/* ---------- convoyeur au doigt ---------- */
let FAB_DRAG=null;
function fabCellAt(svg,e){ const pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const q=pt.matrixTransform(svg.getScreenCTM().inverse()); const x=Math.floor(q.x/40), y=Math.floor(q.y/40); return (x>=0&&y>=0&&x<FAB_W&&y<FAB_H)? [x,y] : null; }
document.addEventListener('pointerdown',e=>{ const svg=e.target.closest&&e.target.closest('.fab-grid'); if(!svg) return; const U=fabUI(); if(U.tool!=='cv') return;
  const c=fabCellAt(svg,e); if(!c) return; e.preventDefault(); FAB_DRAG={svg, cells:[c], seen:new Set([c.join()])}; try{ svg.setPointerCapture(e.pointerId); }catch(_){}
  fabDragMark(svg,c); },{passive:false});
document.addEventListener('pointermove',e=>{ if(!FAB_DRAG) return; const c=fabCellAt(FAB_DRAG.svg,e); if(!c||FAB_DRAG.seen.has(c.join())) return;
  /* on complète les cases sautées (glissé rapide) */
  const last=FAB_DRAG.cells[FAB_DRAG.cells.length-1]; let [x,y]=last; while(x!==c[0]||y!==c[1]){ if(x!==c[0]) x+=Math.sign(c[0]-x); else y+=Math.sign(c[1]-y); const k=x+','+y; if(!FAB_DRAG.seen.has(k)){ FAB_DRAG.seen.add(k); FAB_DRAG.cells.push([x,y]); fabDragMark(FAB_DRAG.svg,[x,y]); } } });
document.addEventListener('pointerup',()=>{ if(!FAB_DRAG) return; const D0=FAB_DRAG; FAB_DRAG=null; const [s,l]=fabLn(); if(!l) return;
  if(D0.cells.length===1){ const [x,y]=D0.cells[0], i=fabAt(l,x,y); if(i>=0&&l.g[i][0]==='cv'){ fabAfter(fabRemove(s.id,l.id,x,y)); return; } }
  let r=ok(); for(const [x,y] of D0.cells){ if(fabAt(l,x,y)>=0) continue; const q=fabPlace(s.id,l.id,'cv',x,y,0); if(!q.ok){ r=q; break; } }
  fabAfter(r); });
function fabDragMark(svg,[x,y]){ svg.insertAdjacentHTML('beforeend','<rect x="'+(x*40+5)+'" y="'+(y*40+5)+'" width="30" height="30" rx="5" fill="#7FD3FF" fill-opacity=".35" stroke="#7FD3FF"/>'); }

/* ---------- actions ---------- */
{ const _fc=ACT.fabcell; ACT.fabcell=el=>{ if(fabUI().tool==='cv') return; _fc(el); }; }
Object.assign(ACT,{
  fabastx:()=>{ S.fabAstOff=!S.fabAstOff; render(); },
  fabptab:el=>{ const U=fabUI(); U.ptab=el.dataset.i; U.tool= el.dataset.i==='del'? 'del' : el.dataset.i==='cv'? 'cv' : null; U.sel=null; render(); },
  fabroute:()=>{ const [s,l]=fabLn(); fabAfter(fabRoute(s.id,l.id)); },
  fabnext:()=>{ const [s,l]=fabLn(); fabAfter(fabDoNext(s.id,l.id)); },
  fabship:el=>{ const s=fabSite(fabUI().s), v=el.dataset.i; if(v==='own'&&!fabShipOwnOk()) return res(err('Il vous faut une compagnie de transport maritime.')); s.ship= v==='none'? null : v; fabAfter(); },
  fabhow:()=>{ ui.modal={type:'fabhow'}; render(); },
  fabnps:el=>{ const U=fabUI(); U.npSel= U.npSel===el.dataset.i? null : el.dataset.i; render(); },
  fabnprod:()=>{ ui.modal={type:'fabprod'}; render(); },
  fabnprodp:el=>{ ui.modal.p= ui.modal.p===el.dataset.i? null : el.dataset.i; render(); },
  fabchl:el=>{ const U=fabUI(), r=fabLineNew(+el.dataset.i,el.dataset.v); if(r.ok){ ui.modal=null; U.pk=null; U.s=+el.dataset.i; U.l=+r.msg; U.tool=null; U.sel=null; U.np=0; U.ptab='cv'; window.scrollTo(0,0); } fabAfter(r); },
  fabchbuild:el=>{ const U=fabUI(); ui.modal=null; U.s=null; U.l=null; U.pk={t:el.dataset.i}; window.scrollTo(0,0); render(); }
});
/* une nouvelle ligne s'ouvre sur l'onglet Convoyeur */
{ const _nl=ACT.fabnl; ACT.fabnl=el=>{ fabUI().ptab='cv'; fabUI().npSel=null; _nl(el); }; }
