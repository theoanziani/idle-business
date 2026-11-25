/* ============================================================
   V2.8.2 : RIVAUX · CROISSANCE, ACQUISITIONS ANNONCÉES, USINES
   - Leur fortune grandit avec la vôtre, mais moins vite : chaque jour, chaque rival gagne 70 à 85 % de votre
     gain moyen de valeur nette (jamais de vos pertes).
   - Ils achètent des villes, des clubs, des banques étrangères : l'achat est annoncé 8 à 14 jours avant.
     Achetez avant eux au prix normal ; après, vous pouvez toujours leur racheter, avec 25 % de prime.
   - Ils bâtissent aussi des usines : chaque usine rivale d'une famille baisse de 1,5 % le prix de gros de vos
     produits de cette famille (10 % au plus).
   État : S.riv.hold = {city:{id:[rid,prix]}, club:{...}, bank:{...}}, S.riv.plans=[{rid,k,id,due,p}], S.riv.fab=[{rid,t,city}]
   ============================================================ */
const RIV_RATE = rid => .70+.15*((D.RIVALS.findIndex(r=>r.id===rid)*37)%7)/6;
function rivHold(){ const R=rivInit(); if(!R.hold) R.hold={city:{},club:{},bank:{}}; if(!R.plans) R.plans=[]; if(!R.fab) R.fab=[]; return R; }
const rivHoldVal = rid => { const R=rivHold(); let v=0; ['city','club','bank'].forEach(k=>Object.values(R.hold[k]).forEach(x=>{ if(x[0]===rid) v+=x[1]; })); return v+R.fab.filter(f=>f.rid===rid).reduce((a,f)=>a+f.v,0); };
{ const _nw=rivNW; rivNW=function(rid){ const v=S.riv.rv[rid]; if(!v||v.gone) return 0; return _nw(rid)+(v.xw||0)+rivHoldVal(rid); }; }
const RIV_K={city:'ville', club:'club', bank:'banque'};
const rivId = (k,id) => k==='club'&&id!==''&&!isNaN(+id)? +id : id;
function rivAssetName(k,id){ id=rivId(k,id); if(k==='city') return (D.CITIES[id]||{}).n||id; if(k==='club'){ const c=footClub(id); return c?c.n:id; } if(k==='bank'){ const b=WBANKS.find(x=>x[0]===id); return b?b[1]:id; } return id; }
function rivAssetPrice(k,id){ id=rivId(k,id); try{ if(k==='city') return cityPriceEur(id); if(k==='club') return fcBuyPrice(id); if(k==='bank'){ const b=WBANKS.find(x=>x[0]===id); return b? wBankPrice(b)*(b[5]==='reg'?1.05:1) : 0; } }catch(e){} return 0; }
function rivMine(k,id){ id=rivId(k,id); if(k==='city') return cityOwned(id); if(k==='club') return fcIsOwn(id); if(k==='bank') return !!(S.bank&&S.bank.w&&S.bank.w.acq.includes(id)); return false; }
const rivHolder = (k,id) => { const R=rivHold(), h=R.hold[k][id]; return h&&!(S.riv.rv[h[0]]||{}).gone? h : null; };
function rivTargets(k){ const R=rivHold(), planned=new Set(R.plans.filter(p=>p.k===k).map(p=>p.id)); let L=[];
  if(k==='city') L=D.CITY_ORDER.filter(id=>cityUnlocked(id)&&!D.CITIES[id].home);
  if(k==='club'){ try{ footInit(); L=FOOT.clubs.filter(c=>!c.foreign).map(c=>c.id); }catch(e){ L=[]; } }
  if(k==='bank'&&S.bank&&S.bank.w&&typeof WBANKS!=='undefined') L=WBANKS.map(b=>b[0]);
  return L.filter(id=>!rivMine(k,id)&&!rivHolder(k,id)&&!planned.has(id)); }
function rivAcqStep(){ const R=rivHold();
  /* croissance */
  const d=S.nw-(R.lastNW===undefined? S.nw : R.lastNW); R.lastNW=S.nw; R.gain=(R.gain||0)*.85+Math.max(0,d)*.15;
  rivAlive().forEach(r=>{ const v=R.rv[r.id]; if(!v||v.gone) return; v.xw=(v.xw||0)+R.gain*RIV_RATE(r.id); });
  /* achats annoncés arrivés à échéance */
  R.plans.slice().forEach(p=>{ if(S.day<p.due) return; R.plans=R.plans.filter(x=>x!==p); const v=R.rv[p.rid]; if(!v||v.gone) return;
    if(rivMine(p.k,p.id)||rivHolder(p.k,p.id)) return; const price=rivAssetPrice(p.k,p.id)||p.p;
    R.hold[p.k][p.id]=[p.rid,price]; v.xw=(v.xw||0)-price;
    log('bad',rivDef(p.rid).n+' achète '+(p.k==='city'?'la ville de ':p.k==='club'?'le club ':'la banque ')+rivAssetName(p.k,p.id)+' ('+eur(price,0)+'). Vous pouvez la lui racheter avec 25 % de prime.'); });
  /* nouvelles annonces */
  if(R.plans.length<2&&rnd()<1/22){ const ks=['city','club'].concat(S.bank&&S.bank.w? ['bank'] : []), k=pick(ks), T=rivTargets(k); if(T.length){ const id=pick(T), p=rivAssetPrice(k,id);
      const C=rivAlive().filter(r=>!R.rv[r.id].gone&&rivNW(r.id)>=4*p); if(p>0&&C.length){ const r=pick(C), due=S.day+8+Math.floor(rnd()*7);
        R.plans.push({rid:r.id,k,id,due,p}); log('warn',r.n+' prépare le rachat '+(k==='city'?'de la ville de ':k==='club'?'du club ':'de la banque ')+rivAssetName(k,id)+' : achat prévu dans '+(due-S.day)+' jours. Achetez avant eux au prix normal.'); } } }
  /* usines rivales */
  if(rnd()<1/40){ const r=pick(rivAlive().filter(x=>!R.rv[x.id].gone)); if(r){ const t=pick(FAB_ORDER.filter(t=>t!=='farm')), city=pick(D.CITY_ORDER.filter(c=>cityUnlocked(c)));
      const v=fabSetupCost(t)*6; if(rivNW(r.id)>=5*v){ R.fab.push({rid:r.id,t,city,v}); R.rv[r.id].xw=(R.rv[r.id].xw||0)-v;
        if(fabSites().some(s=>s.t===t)) log('warn',r.n+' ouvre une '+FAB_T[t].n.toLowerCase()+' à '+fabCityN(city)+' : vos prix de gros '+D.GOODS[D.PRODS[fabProdsOf(t)[0]].g].n.toLowerCase()+' baissent un peu.'); } } }
}
{ const _r2=riv2Step; riv2Step=function(){ _r2(); try{ rivAcqStep(); }catch(e){ console.error(e); } }; }
/* concurrence des usines rivales sur les prix de gros */
const rivFabPress = g => Math.min(.1,.015*rivHold().fab.filter(f=>!(S.riv.rv[f.rid]||{}).gone&&fabProdsOf(f.t).some(p=>D.PRODS[p].g===g)).length);
{ const _fp=fabPrice; fabPrice=function(p){ const P=fabProdDef(p); return _fp(p)*(D.PRODS[p]? 1-rivFabPress(P.g) : 1); }; }

/* ---------- vos achats : avant eux (annonce annulée) ou rachat avec 25 % de prime ---------- */
function rivWrapBuy(k,orig){ return function(id){ const R=rivHold(), h=rivHolder(k,id), p=rivAssetPrice(k,id);
    if(h){ const prem=p*.25; if(S.cash<p+prem) return err('Il faut '+eur(p+prem,0)+' : prix et prime de 25 % à '+rivDef(h[0]).n+'.'); }
    const r=orig.apply(this,arguments); if(!(r&&r.ok)) return r;
    if(h){ const prem=p*.25; payCap('gen','Prime de rachat à '+rivDef(h[0]).n,-prem); const v=R.rv[h[0]]; if(v) v.xw=(v.xw||0)+p+prem; delete R.hold[k][id]; }
    const pl=R.plans.find(x=>x.k===k&&x.id===id); if(pl){ R.plans=R.plans.filter(x=>x!==pl); log('good','Vous doublez '+rivDef(pl.rid).n+' : '+rivAssetName(k,id)+' est à vous.'); }
    return r; }; }
buyCity=rivWrapBuy('city',buyCity); fcBuy=rivWrapBuy('club',fcBuy); if(typeof wBuy==='function') wBuy=rivWrapBuy('bank',wBuy);
/* une ville tenue par un rival se revend avec la même prime de rachat */


/* ---------- écrans ---------- */
NF_CSS.push(`.riv-plan{background:#120D18;border:1px solid #3B2A4F;border-radius:18px;padding:12px 14px;margin-bottom:10px}
.riv-plan .t{display:flex;gap:12px;align-items:center}.riv-av{width:40px;height:40px;border-radius:12px;background:#2B1E33;color:#D8A8FF;font:900 14px var(--f-body);display:flex;align-items:center;justify-content:center;flex:0 0 40px}
.riv-plan b{font:800 14.5px var(--f-body)}.riv-plan small{display:block;font:600 12px var(--f-body);color:var(--ink-3)}
.riv-plan .r{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:10px}.riv-plan .p{font:900 17px var(--f-body)}
.riv-pill{font:800 11px var(--f-body);padding:4px 9px;border-radius:99px;background:#2B1E33;color:#D8A8FF;white-space:nowrap}`);
try{ const e=document.getElementById('nf-css'); if(e) e.textContent+='\n'+NF_CSS[NF_CSS.length-1]; else nfCssOnce(); }catch(e){}
const rivIni = r => r.n.split(/\s+/).filter(w=>w.length>2).slice(0,2).map(w=>w[0].toUpperCase()).join('')||r.n.slice(0,2).toUpperCase();
function rivPlanCard(p){ const r=rivDef(p.rid), price=rivAssetPrice(p.k,p.id)||p.p, j=Math.max(0,p.due-S.day);
  return '<div class="riv-plan"><div class="t"><span class="riv-av">'+esc(rivIni(r))+'</span><span><b>'+esc(r.n)+' vise '+esc(rivAssetName(p.k,p.id))+'</b><small>'+RIV_K[p.k][0].toUpperCase()+RIV_K[p.k].slice(1)+' · achat prévu dans '+plu(j,'jour')+'</small></span></div>'+
    '<div class="r"><span><small>Prix actuel</small><span class="p">'+eur(price,0)+'</span></span><button class="btn primary" data-a="rivbuy" data-i="'+p.k+'" data-v="'+esc(p.id)+'">Acheter avant eux</button></div>'+
    '<small style="margin-top:6px">Après leur achat : rachat possible à '+eur(price*1.25,0)+' (+25 %).</small></div>'; }
function rivHoldRows(){ const R=rivHold(), L=[]; ['city','club','bank'].forEach(k=>Object.keys(R.hold[k]).forEach(id=>{ const h=rivHolder(k,id); if(h) L.push([k,id,h]); }));
  return L.map(([k,id,h])=>{ const p=rivAssetPrice(k,id); return '<div class="fab-row"><span><b>'+esc(rivAssetName(k,id))+'</b><small style="display:block;color:var(--ink-3)">'+RIV_K[k]+' · <span class="riv-pill">'+esc(rivDef(h[0]).n)+'</span></small></span><button class="btn sm" data-a="rivbuy" data-i="'+k+'" data-v="'+esc(id)+'">Racheter · '+eur(p*1.25,0)+'</button></div>'; }).join(''); }
function rivAcqCard(){ const R=rivHold(), P=R.plans.filter(p=>!(R.rv[p.rid]||{}).gone), H=rivHoldRows(), F=R.fab.filter(f=>!(R.rv[f.rid]||{}).gone);
  if(!P.length&&!H&&!F.length) return '';
  return '<section class="card"><h2><span>Acquisitions des rivaux</span></h2>'+P.map(rivPlanCard).join('')+(H? '<div class="sub" style="margin:6px 0 2px">Déjà à eux</div>'+H : '')+
    (F.length? '<div class="sub" style="margin:8px 0 2px">Leurs usines : '+F.length+' (prix de gros un peu plus bas sur leurs familles de produits)</div>' : '')+'</section>'; }
{ const _vr=VIEWS.rivals; VIEWS.rivals=function(){ const h=_vr.apply(this,arguments), c=rivAcqCard(); if(!c) return h; const k=h.indexOf('<section'); return k>0? h.slice(0,k)+c+h.slice(k) : h+c; }; }
{ const _vc=VIEWS.cities; VIEWS.cities=function(){ const h=_vc.apply(this,arguments), R=rivHold(), P=R.plans.filter(p=>p.k==='city'&&!(R.rv[p.rid]||{}).gone); const H=Object.keys(R.hold.city).some(id=>rivHolder('city',id));
    if(!P.length&&!H) return h; const c=P.map(rivPlanCard).join('')+(H? '<section class="card"><h2><span>Villes tenues par des rivaux</span></h2>'+rivHoldRows().split('</div><div class="fab-row">').filter(x=>/ville/.test(x)).join('</div><div class="fab-row">')+'</section>' : '');
    const k=h.indexOf('<section'); return k>0? h.slice(0,k)+c+h.slice(k) : h+c; }; }
{ const _vh=VIEWS.home; VIEWS.home=function(){ const h=_vh.apply(this,arguments), R=rivHold(), p=R.plans.filter(x=>!(R.rv[x.rid]||{}).gone&&x.due-S.day<=5).sort((a,b)=>a.due-b.due)[0]; if(!p) return h;
    const c=rivPlanCard(p), k=h.indexOf('<section'); return k>0? h.slice(0,k)+c+h.slice(k) : h+c; }; }
ACT.rivbuy=el=>{ const k=el.dataset.i, id=el.dataset.v; const r= k==='city'? buyCity(id) : k==='club'? fcBuy(rivId('club',id)) : wBuy(id); after(r&&r.ok? null : r); };
