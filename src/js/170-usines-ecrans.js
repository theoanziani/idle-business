/* ============================================================
   V2.8.1 : USINES (3/3) · ÉCRANS
   Onglet Usines (Plus > Usines) : vos sites, la construction d'un site (type, ville, terrain), un site (lignes,
   stock, parcelles, site), et le plan d'une ligne : grille de 8 × 10 cases où l'on pose machines et convoyeurs.
   État d'écran : ui.fab = {s: site, l: ligne, tab, tool, rot, sel, mv, pk:{t,c}, np}
   ============================================================ */
NF_CSS.push(`
.fab-top{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.fab-kpi{background:var(--card);border-radius:18px;padding:12px 14px;box-shadow:var(--shadow)}
.fab-kpi small{display:block;font:700 12px var(--f-body);color:var(--ink-3)}.fab-kpi b{font:900 20px var(--f-body)}
.fab-site{display:flex;gap:12px;align-items:center;width:100%;text-align:left;background:var(--card);border:0;border-radius:20px;padding:12px;margin-bottom:10px;box-shadow:var(--shadow);color:var(--ink);min-height:44px}
.fab-site .fab-ico{flex:0 0 auto;border-radius:12px}
.fab-site .m{flex:1;min-width:0}.fab-site b{font:800 15px var(--f-body);display:block}.fab-site small{font:600 12px var(--f-body);color:var(--ink-3)}
.fab-site .r{text-align:right;font:900 14px var(--f-body)}
.fab-bar{height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin-top:6px}.fab-bar i{display:block;height:100%;border-radius:3px}
.fab-hero{display:flex;gap:12px;align-items:center;margin:4px 0 12px}.fab-hero .fab-ico{border-radius:14px}
.fab-hero .fab-h{margin:0;font:800 21px var(--f-display,var(--f-body));line-height:1.15}.fab-hero small{color:var(--ink-3);font:600 12.5px var(--f-body)}
.fab-tabs{display:flex;gap:6px;margin:0 0 12px;overflow-x:auto;scrollbar-width:none}.fab-tabs::-webkit-scrollbar{display:none}
.fab-tabs button{flex:1 0 auto;min-height:40px;border:0;border-radius:12px;background:var(--card);color:var(--ink-3);font:800 13px var(--f-body);padding:0 12px;box-shadow:var(--shadow)}
.fab-tabs button.on{background:#E8B84A;color:#2A1C00}
.fab-line{display:flex;gap:10px;align-items:center;width:100%;text-align:left;background:var(--card);border:0;border-radius:18px;padding:10px 12px;margin-bottom:8px;box-shadow:var(--shadow);color:var(--ink);min-height:44px}
.fab-line .m{flex:1;min-width:0}.fab-line b{font:800 14px var(--f-body)}.fab-line small{display:block;font:600 12px var(--f-body);color:var(--ink-3)}
.fab-line .u{text-align:right;font:900 14px var(--f-body)}.fab-line .u small{font-weight:700}
.fab-warn{color:#E4572E}.fab-ok{color:#2FB36D}.fab-amb{color:#D99A1E}
.fab-pick{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fab-pc{background:var(--card);border:0;border-radius:18px;padding:12px 10px;text-align:center;box-shadow:var(--shadow);color:var(--ink);min-height:44px}
.fab-pc b{display:block;font:800 13.5px var(--f-body);margin-top:4px}.fab-pc small{display:block;font:600 11.5px var(--f-body);color:var(--ink-3);margin-top:2px}
.fab-pc.lock{opacity:.5}
.fab-ins{display:flex;gap:2px;justify-content:center;margin-top:4px}.fab-ins .fab-pic{width:22px;height:22px}
.fab-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:6px 0 10px}
.fab-stats div{background:var(--card);border-radius:14px;padding:8px 10px;box-shadow:var(--shadow)}.fab-stats small{display:block;font:700 11px var(--f-body);color:var(--ink-3)}.fab-stats b{font:900 17px var(--f-body)}
.fab-gridw{background:#0E1013;border-radius:18px;padding:6px;box-shadow:var(--shadow)}
.fab-grid{display:block;width:100%;height:auto;touch-action:manipulation}
.fab-msg{border-radius:12px;padding:8px 12px;margin:0 0 8px;font:800 13px var(--f-body);background:#3A1D12;color:#FFB089}
.fab-pal{display:flex;gap:6px;overflow-x:auto;padding:8px 2px 4px;scrollbar-width:none}.fab-pal::-webkit-scrollbar{display:none}
.fab-pal button{flex:0 0 74px;min-height:76px;border-radius:14px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:800 10.5px var(--f-body);padding:4px 2px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:2px}
.fab-pal button.on{border-color:#E8B84A;background:#2A2210;color:#F5D58A}
.fab-pal button svg{width:58px;height:40px}.fab-pal button small{font:700 9.5px var(--f-body);color:var(--ink-3)}
.fab-stage{display:grid;grid-template-columns:34px 1fr auto;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line)}
.fab-stage:last-child{border-bottom:0}.fab-stage svg{width:34px;height:26px}.fab-stage b{font:800 13px var(--f-body)}.fab-stage small{display:block;font:600 11.5px var(--f-body);color:var(--ink-3)}
.fab-stage .c{font:900 13px var(--f-body);text-align:right}
.fab-sel{background:var(--card);border-radius:16px;padding:10px 12px;margin-top:8px;box-shadow:var(--shadow)}
.fab-acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.fab-acts .btn{min-height:40px}
.fab-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line);font:600 13px var(--f-body)}
.fab-row:last-child{border-bottom:0}.fab-row .l{display:flex;align-items:center;gap:8px;min-width:0}.fab-row .fab-pic{flex:0 0 auto}
.fab-plot{display:flex;justify-content:space-between;align-items:center;gap:8px;background:var(--card);border-radius:16px;padding:10px 12px;margin-bottom:8px;box-shadow:var(--shadow)}
.fab-plot b{font:800 13.5px var(--f-body)}.fab-plot small{display:block;font:600 11.5px var(--f-body);color:var(--ink-3)}
.fab-cell{fill:transparent;cursor:pointer}.fab-cell:hover{fill:rgba(232,184,74,.12)}
@keyframes fabBelt{to{stroke-dashoffset:-8}}@keyframes fabSpin{to{transform:rotate(360deg)}}@keyframes fabArm{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(24deg)}}
@keyframes fabBlink{50%{opacity:.15}}@keyframes fabScan{0%,100%{transform:translateY(0)}50%{transform:translateY(14px)}}@keyframes fabPst{0%,100%{transform:scale(1)}40%{transform:scale(.72)}}
@keyframes fabShut{0%,100%{transform:translateX(0)}50%{transform:translateX(22px)}}@keyframes fabGlow{50%{opacity:.6}}@keyframes fabMist{50%{opacity:.18}}
@keyframes fabSteam{0%{transform:translateY(0);opacity:.7}100%{transform:translateY(-6px);opacity:0}}@keyframes fabBob{50%{transform:translateY(-2px)}}
@keyframes fabDrive{0%{transform:translateX(-14px);opacity:0}20%{opacity:1}80%{opacity:1}100%{transform:translateX(10px);opacity:0}}@keyframes fabFly{0%{transform:translate(-10px,6px)}100%{transform:translate(10px,-6px)}}@keyframes fabSway{0%,100%{transform:skewX(-6deg)}50%{transform:skewX(6deg)}}@keyframes fabWave{to{transform:translateX(16px)}}@keyframes fabSwing{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}@keyframes fabShake{50%{transform:translateX(1.5px)}}@keyframes fabHot{50%{stroke-opacity:.25}}
.fab-belt{animation:fabBelt .6s linear infinite}.fab-spin{transform-box:fill-box;transform-origin:center;animation:fabSpin 2.4s linear infinite}
.fab-arm{animation:fabArm 1.8s ease-in-out infinite}.fab-spark,.fab-led{animation:fabBlink .7s steps(2) infinite}
.fab-scan{animation:fabScan 1.6s ease-in-out infinite}.fab-pst{transform-box:fill-box;transform-origin:center;animation:fabPst 1.1s ease-in infinite}
.fab-shuttle{animation:fabShut 1.4s ease-in-out infinite}.fab-glow{animation:fabGlow 1.6s ease-in-out infinite}.fab-mist{animation:fabMist 1.6s ease-in-out infinite}
.fab-steam{animation:fabSteam 2s ease-out infinite}.fab-bob{animation:fabBob 1s ease-in-out infinite}.fab-swing{transform-box:view-box;animation:fabSwing 3s ease-in-out infinite}
.fab-shake{animation:fabShake .25s linear infinite}.fab-drive{animation:fabDrive 3.2s ease-in-out infinite}.fab-fly{animation:fabFly 3s ease-in-out infinite alternate}.fab-sway{transform-box:fill-box;transform-origin:bottom;animation:fabSway 2.4s ease-in-out infinite}.fab-wave{animation:fabWave 2s linear infinite}.fab-hot{animation:fabHot 1.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.fab-grid *,.fab-ico *,.fab-pic *{animation:none!important}}
`);
try{ const e=document.getElementById('nf-css'); if(e) e.textContent+='\n'+NF_CSS[NF_CSS.length-1]; else nfCssOnce(); }catch(e){}
const fabUI = () => (ui.fab=ui.fab||{});
const fabU = (n,d) => n>=100? fmtN(Math.round(n)) : n>=10? fmtN(n,1) : n>=1? fmtN(n,2) : fmtN(n,3);
const fabPerDay = (p,u) => fabU(u)+' '+(D.PRODS[p].u)+' / jour';
const fabEffCol = e => e>=.85? '#2FB36D' : e>=.65? '#E8B84A' : '#E4572E';
function fabSiteEco(s){ let u=0, rev=0, eff=0, n=0; s.lines.forEach(l=>{ const E=fabLineEco(s,l), A=fabAnalyze(s,l); rev+=E.rev; if(l.on!==0){ eff+=A.eff; n++; } });
  if(s.t==='farm') Object.keys(s.parc||{}).forEach(c=>{ const C=FAB_CROP[c]; if(C) rev+=(s.parc[c]||0)*C.y*fabPrice(C.p); });
  return {rev, eff: n? eff/n : 0}; }

/* ---------- écran principal ---------- */
function vFab(){ fabInit(); const U=fabUI();
  if(U.pk) return vFabBuild();
  if(U.s&&fabSite(U.s)) return U.l&&fabSite(U.s).lines.some(l=>l.id===U.l)? vFabLine() : vFabSite();
  U.s=null; U.l=null;
  const L=fabSites(), F=S.fab; let tot=0, eff=0, n=0, lines=0; L.forEach(s=>{ const e=fabSiteEco(s); tot+=e.rev; if(s.lines.length){ eff+=e.eff; n++; } lines+=s.lines.length; });
  let h=head('Usines','Vos sites industriels : chaque ligne est une grille où vous disposez machines et convoyeurs.');
  h+='<div class="fab-top"><div class="fab-kpi"><small>Production par jour</small><b>'+eur(tot,0)+'</b></div><div class="fab-kpi"><small>Rendement moyen</small><b style="color:'+fabEffCol(n?eff/n:0)+'">'+(n? Math.round(eff/n*100)+' %' : '—')+'</b></div>'+
     '<div class="fab-kpi"><small>Sites · lignes</small><b>'+L.length+' · '+lines+'</b></div><div class="fab-kpi"><small>Résultat d’hier</small><b class="'+((F.day&&F.day.net>=0)?'fab-ok':'fab-warn')+'">'+(F.day? (F.day.net>=0?'+':'')+eur(F.day.net,0) : '—')+'</b></div></div>';
  h+=L.map(s=>{ const e=fabSiteEco(s); return '<button class="fab-site" data-a="fabgo" data-i="'+s.id+'">'+fabTypeSvg(s.t,64)+'<span class="m"><b>'+esc(s.name)+'</b><small>'+
      (s.t==='farm'? plu(Object.values(s.parc||{}).reduce((a,x)=>a+x,0),'parcelle')+' · ' : '')+plu(s.lines.length,'ligne')+' sur '+fabSlots(s)+'</small><span class="fab-bar"><i style="width:'+Math.round(e.eff*100)+'%;background:'+fabEffCol(e.eff)+'"></i></span></span><span class="r">'+eur(e.rev,0)+'<small style="display:block;color:var(--ink-3);font-weight:700">par jour</small></span></button>'; }).join('');
  if(!L.length) h+='<div class="notice info">Aucun site pour l’instant. Construisez votre première usine : elle fournira vos sociétés et vendra le reste au marché de gros.</div>';
  h+='<button class="btn primary" style="width:100%;min-height:48px;margin-top:6px" data-a="fabpk">Construire un site</button>';
  return h; }

/* ---------- construction : type, ville, terrain ---------- */
function vFabBuild(){ const U=fabUI(), K=U.pk; let h='';
  if(!K.t){ h+='<button class="back" data-a="fabback" data-v="pk">‹ Usines</button>'+head('Construire un site','Choisissez le type d’usine.');
    h+='<div class="fab-pick">'+FAB_ORDER.map(t=>{ const T=FAB_T[t], ok=unlocked(T.tier); return '<button class="fab-pc'+(ok?'':' lock')+'" data-a="fabpkt" data-i="'+t+'"'+(ok?'':' data-dis="1" data-why="Palier '+D.TIERS[T.tier].n+' requis."')+'>'+fabTypeSvg(t,72)+'<b>'+T.n+'</b><small>'+T.d+'</small><small><b style="display:inline;font-size:12px">'+eur(fabSetupCost(t),0)+'</b> d’installation</small></button>'; }).join('')+'</div>';
    return h; }
  const T=FAB_T[K.t];
  if(!K.c){ h+='<button class="back" data-a="fabback" data-v="pkt">‹ Types d’usine</button><div class="fab-hero">'+fabTypeSvg(K.t,64)+'<div><h2 class="fab-h">'+T.n+'</h2><small>Choisissez une ville : terrains et entrepôts d’au moins '+fmtN(Math.ceil(T.area*.6))+' m².</small></div></div>';
    h+=D.CITY_ORDER.filter(cityUnlocked).map(cid=>{ const n=fabPlots(cid,K.t).length, C=D.CITIES[cid];
      return '<button class="fab-site" data-a="fabpkc" data-i="'+cid+'"'+(n?'':' data-dis="1" data-why="Aucun terrain assez grand dans cette ville."')+' style="'+(n?'':'opacity:.5')+'"><span class="m"><b>'+esc(C.n)+'</b><small>'+esc(C.country)+' · salaires '+Math.round(fabWage(cid)*100)+' · énergie '+Math.round(fabNrj(cid)*100)+'</small></span><span class="r">'+plu(n,'terrain')+'</span></button>'; }).join('');
    return h; }
  h+='<button class="back" data-a="fabback" data-v="pkc">‹ Villes</button>'+head(esc(D.CITIES[K.c].n),'Terrains libres pour une '+T.n.toLowerCase()+'. La surface fixe le nombre de lignes.');
  const P=fabPlots(K.c,K.t);
  h+=P.map(bd=>{ const sl=Math.max(1,Math.floor(bd.surf/T.area)), dep=cityOwned(bd.city)? 0 : bldRent(bd)*30, dd=(D.CITIES[K.c].d.find(x=>bd.id.split('.')[1]===x.id)||{}).n||'';
    return '<div class="fab-plot"><div><b>'+esc(bd.addr)+'</b><small>'+esc(dd)+' · '+fmtN(bd.surf)+' m² · '+plu(sl,'ligne')+' · loyer '+eur(cityOwned(bd.city)?0:bldRent(bd),0)+' / j</small><small>Total : '+eur(fabSetupCost(K.t)+dep,0)+'</small></div><button class="btn primary" data-a="fabmk" data-i="'+bd.id+'">Construire</button></div>'; }).join('')||'<div class="notice info">Plus de terrain libre assez grand dans cette ville.</div>';
  return h; }
function fabPlots(cid,t){ const C=D.CITIES[cid], T=FAB_T[t], r=[]; C.d.forEach(dd=>bldList(cid,dd.id).forEach(bd=>{ if(fabPlotOk(bd)&&bd.surf>=T.area*.6) r.push(bd); })); return r.sort((a,b)=>b.surf-a.surf).slice(0,24); }

/* ---------- un site ---------- */
function vFabSite(){ const U=fabUI(), s=fabSite(U.s), T=FAB_T[s.t], tab=U.tab||'lines'; let h='';
  h+='<button class="back" data-a="fabback" data-v="s">‹ Usines</button><div class="fab-hero">'+fabTypeSvg(s.t,72)+'<div><h2 class="fab-h">'+esc(s.name)+'</h2><small>'+esc(fabCityN(s.city))+' · '+plu(s.lines.length,'ligne')+' sur '+fabSlots(s)+(s.halls? ' · '+plu(s.halls,'hall')+' ajouté'+(s.halls>1?'s':'') : '')+'</small></div></div>';
  const tabs=(s.t==='farm'?[['parc','Parcelles']]:[]).concat([['lines','Lignes'],['stock','Stock et débouchés'],['site','Site']]);
  h+='<div class="fab-tabs">'+tabs.map(([k,n])=>'<button class="'+(tab===k?'on':'')+'" data-a="fabtab" data-i="'+k+'">'+n+'</button>').join('')+'</div>';
  if(tab==='lines'){
    if(U.np){ h+='<section class="card"><h2><span>Nouvelle ligne : choisissez le produit</span></h2><div class="fab-pick">'+fabProdsOf(s.t).map(p=>{ const P=D.PRODS[p];
        return '<button class="fab-pc" data-a="fabnl" data-i="'+p+'">'+fabProdSvg(p,52)+'<b>'+P.n+'</b><small>'+eur(fabPrice(p),fabPrice(p)<100?2:0)+' l’unité</small><span class="fab-ins">'+Object.keys(P.in||{}).map(q=>fabProdSvg(q,22)).join('')+'</span></button>'; }).join('')+'</div><button class="btn" style="margin-top:8px" data-a="fabnp">Annuler</button></section>'; }
    h+=s.lines.map(l=>{ const A=fabAnalyze(s,l), P=D.PRODS[l.p], E=fabLineEco(s,l);
      const st= l.on===0? '<span class="fab-amb">En pause</span>' : A.msg? '<span class="fab-warn">'+A.msg+'</span>' : 'Goulot : '+FAB_M[P.st[A.bott]].n.toLowerCase()+' · rendement '+Math.round(A.eff*100)+' %';
      return '<button class="fab-line" data-a="fabln" data-i="'+l.id+'">'+fabProdSvg(l.p,44)+'<span class="m"><b>Ligne '+l.id+' · '+P.n+'</b><small>'+st+'</small><span class="fab-bar"><i style="width:'+Math.round(A.eff*100)+'%;background:'+fabEffCol(A.eff)+'"></i></span></span><span class="u">'+fabU(A.rate)+'<small>'+P.u+' / j</small><small class="'+(E.net>=0?'fab-ok':'fab-warn')+'">'+(E.net>=0?'+':'')+eur(E.net,0)+'</small></span></button>'; }).join('');
    if(!s.lines.length&&!U.np) h+='<div class="notice info">Aucune ligne. Ajoutez-en une puis disposez ses machines.</div>';
    const free=fabSlots(s)-s.lines.length;
    h+='<div class="fab-acts">'+(free>0&&!U.np? '<button class="btn primary" data-a="fabnp">Nouvelle ligne ('+plu(free,'place')+')</button>' : '')+'<button class="btn" data-a="fabhall">Construire un hall (+2 lignes) · '+eur(fabHallCost(s),0)+'</button></div>'; }
  if(tab==='parc'){ const tot=Object.values(s.parc||{}).reduce((a,x)=>a+x,0);
    h+='<section class="card"><h2><span>Parcelles</span><span class="sub">'+plu(tot,'parcelle')+' · '+eur(FAB_PARCEL,0)+' l’une</span></h2>'+Object.keys(FAB_CROP).map(c=>{ const C=FAB_CROP[c], n=(s.parc||{})[c]||0, v=C.y*fabPrice(C.p);
      return '<div class="fab-row"><span class="l">'+fabProdSvg(C.p,34)+'<span><b>'+C.n+'</b><small style="display:block;color:var(--ink-3)">'+fmtN(C.y)+' '+D.PRODS[C.p].u+' par parcelle et par jour · '+eur(v,0)+'</small></span></span><span style="display:flex;gap:4px;align-items:center"><b style="min-width:26px;text-align:right">'+n+'</b>'+
        (n?'<button class="btn sm" data-a="fabps" data-i="'+c+'">−1</button>':'')+'<button class="btn sm" data-a="fabpb" data-i="'+c+'" data-v="1">+1</button><button class="btn sm" data-a="fabpb" data-i="'+c+'" data-v="10">+10</button></span></div>'; }).join('')+
      '<div class="sub" style="margin-top:8px">Les récoltes vont au stock du site : vos lignes de transformation (farine, fromages, vin) et vos sociétés se servent d’abord, le reste est vendu au marché de gros.</div></section>'; }
  if(tab==='stock'){ const d=s.d||{};
    h+='<section class="card"><h2><span>Hier</span></h2><div class="fab-row"><span>Vendu au marché de gros</span><b>'+eur(d.sold||0,0)+'</b></div><div class="fab-row"><span>Livré à vos sociétés</span><b>'+eur(d.own||0,0)+'</b></div><div class="fab-row"><span>Ouvriers et énergie</span><b class="fab-warn">−'+eur(d.cost||0,0)+'</b></div><div class="fab-row"><span>Matières et transport</span><b class="fab-warn">−'+eur(d.mat||0,0)+'</b></div>'+(d.br? '<div class="fab-row"><span>Pannes</span><b class="fab-amb">'+plu(d.br,'ligne')+' à mi-régime</b></div>' : '')+'</section>';
    const ps=Object.keys(s.st||{}).filter(p=>D.PRODS[p]&&(s.st[p]>.01||(d.u||{})[p]));
    h+='<section class="card"><h2><span>Stock du site</span></h2>'+(ps.map(p=>'<div class="fab-row"><span class="l">'+fabProdSvg(p,34)+'<span><b>'+D.PRODS[p].n+'</b><small style="display:block;color:var(--ink-3)">produit hier : '+fabU((d.u||{})[p]||0)+' '+D.PRODS[p].u+'</small></span></span><span style="text-align:right"><b>'+fabU(s.st[p]||0)+'</b><small style="display:block;color:var(--ink-3)">'+eur((s.st[p]||0)*fabPrice(p)*(s.qm[p]||1),0)+'</small></span></div>').join('')||'<div class="sub">Rien en stock.</div>')+
      '<div class="fab-tabs" style="margin-top:10px"><button class="'+(s.mode!=='store'?'on':'')+'" data-a="fabmode" data-i="sell">Vendre le surplus</button><button class="'+(s.mode==='store'?'on':'')+'" data-a="fabmode" data-i="store">Stocker</button></div>'+
      '<div class="fab-tabs"><button class="'+(s.buy!==0?'on':'')+'" data-a="fabbuy" data-i="1">Acheter les matières manquantes</button><button class="'+(s.buy===0?'on':'')+'" data-a="fabbuy" data-i="0">Vos usines seulement</button></div>'+
      '<div class="sub">Une réserve d’un jour et demi est toujours gardée pour vos lignes et vos sociétés clientes.</div><button class="btn" style="margin-top:8px" data-a="fabsell">Vendre tout le stock</button></section>'; }
  if(tab==='site'){ const v=s.lines.reduce((a,l)=>a+fabLineValue(s,l),0);
    h+='<section class="card"><h2><span>Le site</span></h2>'+s.blds.map(id=>{ const bd=bldById(id); return '<div class="fab-row"><span>'+esc(bd?bd.addr:id)+'</span><b>'+(bd?fmtN(bd.surf)+' m²':'')+'</b></div>'; }).join('')+
      '<div class="fab-row"><span>Places de ligne</span><b>'+fabSlots(s)+'</b></div><div class="fab-row"><span>Halls ajoutés</span><b>'+(s.halls||0)+'</b></div><div class="fab-row"><span>Valeur des machines</span><b>'+eur(v,0)+'</b></div>'+
      '<div class="fab-row"><span>Ouvriers</span><b>'+fmtN(s.lines.reduce((a,l)=>a+fabLineOpex(s,l).wk,0)+Object.values(s.parc||{}).reduce((a,n)=>a+n,0))+'</b></div>'+
      '<button class="btn" style="margin-top:10px" data-a="fabdel">Céder le site</button><div class="sub" style="margin-top:4px">Machines rachetées 60 %, parcelles 70 %, stock vendu au prix de gros.</div></section>'; }
  return h; }

/* ---------- plan d'une ligne ---------- */
function fabGridSvg(s,l,A,U){ const C=40, W=FAB_W*C, H=FAB_H*C, u='fg'+s.id+'_'+l.id, P=D.PRODS[l.p];
  let h='<svg class="fab-grid" viewBox="-2 -2 '+(W+4)+' '+(H+4)+'" role="img" aria-label="Plan de la ligne">'+fabDefs(u)+'<rect width="'+W+'" height="'+H+'" fill="url(#'+u+'fl)" rx="6"/>';
  /* marquages au sol */
  h+='<rect x="2" y="2" width="'+(W-4)+'" height="'+(H-4)+'" rx="5" fill="none" stroke="#F2C230" stroke-opacity=".25" stroke-dasharray="8 6"/>';
  /* convoyeurs */
  const onPath=new Set(A.path); const cvs=l.g.map((it,i)=>[it,i]).filter(([it])=>it[0]==='cv');
  cvs.forEach(([it,i])=>{ const x=it[1]*C, y=it[2]*C, on=onPath.has(it[2]*FAB_W+it[1]);
    h+='<rect x="'+(x+3)+'" y="'+(y+3)+'" width="'+(C-6)+'" height="'+(C-6)+'" rx="5" fill="'+(on?'#2B2E35':'#24262B')+'" stroke="#16181C" stroke-width="2"/>'+
       '<rect x="'+(x+7)+'" y="'+(y+7)+'" width="'+(C-14)+'" height="'+(C-14)+'" rx="3" fill="'+(on?'#4A4E57':'#33363C')+'"/>'; });
  /* bande du convoyeur principal, animée, avec les rouleaux */
  if(A.path.length){ const pts=A.path.map(v=>[(v%FAB_W)*C+C/2, Math.floor(v/FAB_W)*C+C/2]), d='M'+pts.map(p=>p.join(' ')).join(' L');
    h+='<path d="'+d+'" fill="none" stroke="#5E636D" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/><path class="fab-belt" d="'+d+'" fill="none" stroke="#7A808B" stroke-width="12" stroke-dasharray="3 5" stroke-linejoin="round"/>'+
       '<path d="'+d+'" fill="none" stroke="#E8B84A" stroke-width="1.2" stroke-dasharray="2 14" opacity=".8"/>';
    for(let i=0;i<5;i++) h+='<g><rect x="-6" y="-5" width="12" height="10" rx="2" fill="#C9CED6" stroke="#4C5461"/><rect x="-4" y="-3" width="8" height="2" fill="'+FAB_T[s.t].col+'"/><animateMotion dur="'+Math.max(4,A.path.length*.7)+'s" repeatCount="indefinite" begin="-'+(i*A.path.length*.14).toFixed(1)+'s" rotate="auto" path="'+d+'"/></g>'; }
  /* machines */
  l.g.forEach((it,i)=>{ if(it[0]==='cv') return; const [w,hh]=fabDim(it), x=it[1]*C, y=it[2]*C, M=A.mach[i]||{};
    const lab=FAB_M[it[0]].n.split(' ')[0].toUpperCase().slice(0,12);
    const inner= it[3]? '<g transform="translate('+(w*C)+' 0) rotate(90)">'+fabMachineSvg(it[0],hh*C,w*C,u,lab)+'</g>' : fabMachineSvg(it[0],w*C,hh*C,u,lab);
    h+='<g transform="translate('+x+' '+y+')">'+inner;
    const bott= A.raw>0&&it[0]===P.st[A.bott]&&M.st==='ok';
    if(M.st==='off'&&!['in','out'].includes(it[0])) h+='<rect x="2" y="2" width="'+(w*C-4)+'" height="'+(hh*C-4)+'" rx="7" fill="none" stroke="#E8B84A" stroke-width="2.5" stroke-dasharray="6 4"/>';
    else if(M.st==='order') h+='<rect x="2" y="2" width="'+(w*C-4)+'" height="'+(hh*C-4)+'" rx="7" fill="none" stroke="#E8B84A" stroke-width="2.5"/><circle cx="'+(w*C-10)+'" cy="10" r="7" fill="#E8B84A"/><text x="'+(w*C-10)+'" y="13.5" text-anchor="middle" font-size="10" font-weight="900" fill="#2A1C00">!</text>';
    else if(bott) h+='<rect class="fab-hot" x="1.5" y="1.5" width="'+(w*C-3)+'" height="'+(hh*C-3)+'" rx="7" fill="none" stroke="#FF5A4F" stroke-width="3"/>';
    if(U.sel===i) h+='<rect x="0" y="0" width="'+(w*C)+'" height="'+(hh*C)+'" rx="8" fill="none" stroke="#7FD3FF" stroke-width="3"/>';
    h+='</g>'; });
  /* cases cliquables */
  for(let y=0;y<FAB_H;y++) for(let x=0;x<FAB_W;x++) h+='<rect class="fab-cell" fill="transparent" x="'+(x*C)+'" y="'+(y*C)+'" width="'+C+'" height="'+C+'" data-a="fabcell" data-i="'+x+'" data-j="'+y+'"/>';
  return h+'</svg>'; }
function vFabLine(){ const U=fabUI(), s=fabSite(U.s), l=s.lines.find(x=>x.id===U.l), P=D.PRODS[l.p], A=fabAnalyze(s,l), E=fabLineEco(s,l); let h='';
  h+='<button class="back" data-a="fabback" data-v="l">‹ '+esc(s.name)+'</button><div class="fab-hero">'+fabProdSvg(l.p,56)+'<div><h2 class="fab-h">Ligne '+l.id+' · '+P.n+'</h2><small>'+(l.on===0?'En pause · ':'')+eur(fabPrice(l.p),fabPrice(l.p)<100?2:0)+' l’unité · '+plu(E.wk,'ouvrier')+'</small></div></div>';
  h+='<div class="fab-stats"><div><small>Production</small><b>'+fabU(A.rate)+'</b><small>'+P.u+' / jour</small></div><div><small>Sans le goulot</small><b class="fab-ok">'+fabU(A.next)+'</b><small>'+P.u+' / jour</small></div><div><small>Rendement</small><b style="color:'+fabEffCol(A.eff)+'">'+Math.round(A.eff*100)+' %</b><small>'+(E.net>=0?'+':'')+eur(E.net,0)+' / j</small></div></div>';
  if(A.msg) h+='<div class="fab-msg">'+A.msg+'</div>';
  h+='<div class="fab-gridw">'+fabGridSvg(s,l,A,U)+'</div>';
  /* palette */
  const tool=U.tool||null;
  h+='<div class="fab-pal">'+fabLineKinds(l.p).map(k=>{ const m=FAB_M[k], w=Math.min(m.w,3), hh=Math.min(m.h,2), on=tool===k;
    return '<button class="'+(on?'on':'')+'" data-a="fabtool" data-i="'+k+'"><svg viewBox="0 0 '+(w*40)+' '+(hh*40)+'" preserveAspectRatio="xMidYMid meet">'+(k==='cv'? '<rect x="3" y="3" width="34" height="34" rx="5" fill="#2B2E35"/><rect x="7" y="7" width="26" height="26" rx="3" fill="#4A4E57"/><path d="M10 20 H30 M24 14 L30 20 L24 26" stroke="#E8B84A" stroke-width="3" fill="none"/>' : fabDefs('pl'+k)+fabMachineSvg(k,w*40,hh*40,'pl'+k))+'</svg>'+esc(m.n.length>18? m.n.slice(0,17)+'…' : m.n)+'<small>'+eur(fabMCost(s.t,k),0)+'</small></button>'; }).join('')+
    '<button class="'+(tool==='del'?'on':'')+'" data-a="fabtool" data-i="del"><svg viewBox="0 0 40 40"><path d="M10 12 H30 L28 34 H12Z" fill="#5A6472"/><path d="M8 12 H32 M16 8 H24" stroke="#C9CED6" stroke-width="3"/><path d="M16 17 V30 M20 17 V30 M24 17 V30" stroke="#2B313B" stroke-width="2"/></svg>Retirer<small>rachat 60 %</small></button></div>';
  if(tool&&tool!=='del'){ const m=FAB_M[tool]; h+='<div class="sub" style="margin:2px 0 6px">'+esc(m.n)+(m.c? ' · '+fabU(m.c*P.k)+' '+P.u+' / jour' : '')+' · '+(m.d||'Touchez une case libre pour la poser.')+(m.w!==m.h? ' <button class="btn sm" data-a="fabrot">Pivoter ('+(U.rot?'vertical':'horizontal')+')</button>' : '')+'</div>'; }
  else if(tool==='del') h+='<div class="sub" style="margin:2px 0 6px">Touchez une machine ou un convoyeur pour le retirer.</div>';
  else h+='<div class="sub" style="margin:2px 0 6px">Choisissez une machine puis touchez une case. Touchez une machine posée pour la déplacer ou la tourner.</div>';
  /* machine sélectionnée */
  if(U.sel!=null&&l.g[U.sel]){ const it=l.g[U.sel], m=FAB_M[it[0]], M=A.mach[U.sel]||{}, o=fabMOpex(s.t,it[0],s.city);
    const st= M.st==='off'? '<span class="fab-amb">Non raccordée au convoyeur principal</span>' : M.st==='order'? '<span class="fab-amb">Placée avant l’étape précédente : elle ne travaille pas</span>' : M.st==='ok'? '<span class="fab-ok">En service</span>' : '';
    h+='<div class="fab-sel"><b>'+esc(m.n)+'</b><div class="sub">'+(m.c? fabU(m.c*P.k)+' '+P.u+' / jour · ' : '')+eur(o.lab+o.nrj,0)+' / jour (ouvriers et énergie)'+(st?' · '+st:'')+'</div><div class="fab-acts">'+
      (m.w!==m.h? '<button class="btn" data-a="fabrotm">Tourner</button>' : '')+'<button class="btn'+(U.mv?' primary':'')+'" data-a="fabmv">'+(U.mv?'Touchez la nouvelle place':'Déplacer')+'</button><button class="btn" data-a="fabrm">Retirer</button><button class="btn" data-a="fabunsel">Fermer</button></div></div>'; }
  /* étapes */
  const mx=Math.max(...A.stages.map(x=>x.cap),1);
  h+='<section class="card" style="margin-top:10px"><h2><span>Étapes de fabrication</span><span class="sub">convoyeur : '+A.L+' cases, '+plu(A.turns,'virage')+'</span></h2>'+A.stages.map((x,i)=>{ const b=i===A.bott;
    return '<div class="fab-stage"><svg viewBox="0 0 80 40">'+fabDefs('st'+x.k)+fabMachineSvg(x.k,80,40,'st'+x.k)+'</svg><div><b>'+(i+1)+'. '+esc(FAB_M[x.k].n)+'</b><small>'+(x.n? plu(x.n,'machine')+' en service' : '<span class="fab-warn">aucune machine en service</span>')+(x.tot>x.n? ' · <span class="fab-amb">'+(x.tot-x.n)+' mal placée'+(x.tot-x.n>1?'s':'')+'</span>' : '')+'</small><span class="fab-bar"><i style="width:'+Math.round(x.cap/mx*100)+'%;background:'+(b?'#E4572E':'#2FB36D')+'"></i></span></div><span class="c'+(b?' fab-warn':'')+'">'+fabU(x.cap)+'<small style="display:block;font-weight:700;color:var(--ink-3)">/ jour</small></span></div>'; }).join('')+
    '<div class="fab-row"><span>Convoyeur</span><b>× '+fmtN(A.fBelt,2)+'</b></div><div class="fab-row"><span>Stocks tampons ('+A.buf+' / 2)</span><b>× '+fmtN(A.fStop,2)+'</b></div><div class="fab-row"><span>Contrôle qualité</span><b class="'+(A.qc?'fab-ok':'')+'">'+(A.qc?'prix +8 %':'aucun')+'</b></div><div class="fab-row"><span>Maintenance</span><b class="'+(A.mnt?'fab-ok':'')+'">'+(A.mnt?'pannes ÷ 3':'pannes 2 % par jour')+'</b></div></section>';
  /* économie */
  h+='<section class="card"><h2><span>Économie de la ligne par jour</span></h2><div class="fab-row"><span>Ventes au prix de gros</span><b>'+eur(E.rev,0)+'</b></div><div class="fab-row"><span>Matières</span><b class="fab-warn">−'+eur(E.mat,0)+'</b></div><div class="fab-row"><span>Ouvriers et énergie ('+esc(fabCityN(s.city))+')</span><b class="fab-warn">−'+eur(E.opex,0)+'</b></div><div class="fab-row"><span>Résultat</span><b class="'+(E.net>=0?'fab-ok':'fab-warn')+'">'+(E.net>=0?'+':'')+eur(E.net,0)+'</b></div>'+
    '<div class="fab-row"><span>Matières par '+esc(P.u.replace(/s$/,''))+'</span><span class="fab-ins">'+Object.keys(P.in||{}).map(q=>'<span title="'+esc(fabProdDef(q).n)+'" style="display:inline-flex;align-items:center;gap:2px;font:700 11px var(--f-body)">'+fabProdSvg(q,22)+fabU(P.in[q])+'</span>').join(' ')+'</span></div></section>';
  const onlyBase=!l.g.some(it=>!['in','out','cv'].includes(it[0]));
  h+='<div class="fab-acts">'+(onlyBase? '<button class="btn primary" data-a="fabauto">Disposition automatique · '+eur(fabAutoCost(s,l),0)+'</button>' : '')+'<button class="btn" data-a="fabpause">'+(l.on===0?'Relancer la ligne':'Mettre en pause')+'</button>'+
    (fabProdsOf(s.t).length>1? '<button class="btn" data-a="fabchg">Changer de produit</button>' : '')+'<button class="btn" data-a="fablnd">Démonter la ligne</button></div>';
  if(U.chg) h+='<div class="fab-pick" style="margin-top:8px">'+fabProdsOf(s.t).filter(p=>p!==l.p).map(p=>'<button class="fab-pc" data-a="fabsetp" data-i="'+p+'">'+fabProdSvg(p,44)+'<b>'+D.PRODS[p].n+'</b><small>mêmes étapes : '+(D.PRODS[p].st.join()===P.st.join()?'oui':'non')+'</small></button>').join('')+'</div>';
  return h; }

/* ---------- actions ---------- */
function fabAfter(r){ if(r&&!r.ok) res(r); if(S) computeNW(); render(); scheduleSave(); return r; }
const fabLn = () => { const U=fabUI(), s=fabSite(U.s); return [s, s&&s.lines.find(x=>x.id===U.l)]; };
Object.assign(ACT,{
  fabgo:el=>{ const U=fabUI(); U.s=+el.dataset.i; U.l=null; U.tab=null; U.np=0; U.pk=null; window.scrollTo(0,0); render(); },
  fabpk:()=>{ const U=fabUI(); U.pk={}; window.scrollTo(0,0); render(); },
  fabpkt:el=>{ fabUI().pk={t:el.dataset.i}; window.scrollTo(0,0); render(); },
  fabpkc:el=>{ const K=fabUI().pk; K.c=el.dataset.i; window.scrollTo(0,0); render(); },
  fabmk:el=>{ const U=fabUI(), r=fabBuild(U.pk.t,el.dataset.i); if(r.ok){ U.pk=null; U.s=+r.msg; U.tab=null; U.np=1; window.scrollTo(0,0); } fabAfter(r); },
  fabback:el=>{ const U=fabUI(), v=el.dataset.v;
    if(v==='pk') U.pk=null; else if(v==='pkt') U.pk={}; else if(v==='pkc') U.pk={t:U.pk.t};
    else if(v==='s'){ U.s=null; U.l=null; } else if(v==='l'){ U.l=null; U.tool=null; U.sel=null; U.mv=0; U.chg=0; }
    window.scrollTo(0,0); render(); },
  fabtab:el=>{ const U=fabUI(); U.tab=el.dataset.i; U.np=0; render(); },
  fabnp:()=>{ const U=fabUI(); U.np=U.np?0:1; render(); },
  fabnl:el=>{ const U=fabUI(), r=fabLineNew(U.s,el.dataset.i); if(r.ok){ U.np=0; U.l=+r.msg; U.tool=null; U.sel=null; window.scrollTo(0,0); } fabAfter(r); },
  fabln:el=>{ const U=fabUI(); U.l=+el.dataset.i; U.tool=null; U.sel=null; U.mv=0; U.chg=0; window.scrollTo(0,0); render(); },
  fabhall:()=>fabAfter(fabHall(fabUI().s)),
  fabpb:el=>fabAfter(fabParcelBuy(fabUI().s,el.dataset.i,+el.dataset.v)),
  fabps:el=>fabAfter(fabParcelSell(fabUI().s,el.dataset.i,1)),
  fabmode:el=>{ const s=fabSite(fabUI().s); s.mode=el.dataset.i==='store'?'store':'sell'; fabAfter(); },
  fabbuy:el=>{ const s=fabSite(fabUI().s); s.buy=+el.dataset.i; fabAfter(); },
  fabsell:()=>fabAfter(fabSellStock(fabUI().s)),
  fabdel:()=>{ const U=fabUI(), r=fabSiteSell(U.s); if(r.ok){ U.s=null; U.l=null; toast(r.msg,'good'); } fabAfter(r); },
  fabtool:el=>{ const U=fabUI(), k=el.dataset.i; U.tool= U.tool===k? null : k; U.sel=null; U.mv=0; render(); },
  fabrot:()=>{ const U=fabUI(); U.rot=U.rot?0:1; render(); },
  fabcell:el=>{ const U=fabUI(), [s,l]=fabLn(), x=+el.dataset.i, y=+el.dataset.j; if(!l) return;
    if(U.mv&&U.sel!=null){ const r=fabMove(s.id,l.id,U.sel,x,y); if(r.ok){ U.mv=0; } return fabAfter(r); }
    if(U.tool==='del') return fabAfter(fabRemove(s.id,l.id,x,y));
    const i=fabAt(l,x,y);
    if(U.tool&&i<0) return fabAfter(fabPlace(s.id,l.id,U.tool,x,y,U.rot));
    if(i>=0&&l.g[i][0]==='cv'&&U.tool==='cv') return fabAfter(fabRemove(s.id,l.id,x,y));
    U.sel= i>=0&&U.sel!==i? i : null; U.mv=0; render(); },
  fabunsel:()=>{ const U=fabUI(); U.sel=null; U.mv=0; render(); },
  fabmv:()=>{ const U=fabUI(); U.mv=U.mv?0:1; render(); },
  fabrotm:()=>{ const U=fabUI(), [s,l]=fabLn(); fabAfter(fabRotate(s.id,l.id,U.sel)); },
  fabrm:()=>{ const U=fabUI(), [s,l]=fabLn(), it=l.g[U.sel]; if(!it) return; const r=fabRemove(s.id,l.id,it[1],it[2]); if(r.ok) U.sel=null; fabAfter(r); },
  fabauto:()=>{ const [s,l]=fabLn(); fabAfter(fabAuto(s.id,l.id)); },
  fabpause:()=>{ const [s,l]=fabLn(); l.on= l.on===0? 1 : 0; fabAfter(); },
  fabchg:()=>{ const U=fabUI(); U.chg=U.chg?0:1; render(); },
  fabsetp:el=>{ const U=fabUI(), [s,l]=fabLn(), r=fabSetProd(s.id,l.id,el.dataset.i); if(r.ok) U.chg=0; fabAfter(r); },
  fablnd:()=>{ const U=fabUI(), [s,l]=fabLn(), r=fabLineDel(s.id,l.id); if(r.ok){ U.l=null; U.sel=null; U.tool=null; } fabAfter(r); }
});
VIEWS.logi=vFab;
{ const _tab=ACT.tab; ACT.tab=el=>{ if(el.dataset.i==='logi'){ const U=fabUI(); U.pk=null; } _tab(el); }; }
/* nom du menu */
try{ const g=MGROUPS.find(x=>x[1].includes('logi')); if(typeof MENU!=='undefined'){ const m=MENU.find(x=>x[0]==='logi'); if(m) m[1]='Usines'; } }catch(e){}
