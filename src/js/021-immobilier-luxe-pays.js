/* ============================================================
   IMMOBILIER, LUXE, PAYS
   ============================================================ */

/* ---------- Immobilier ---------- */
function propValue(p){ return p.base*S.macro.house*p.cond; }
function genListings(){
  const L=[];
  const types=Object.keys(D.PROP).filter(k=>D.PROP[k].tier<=tierNow());
  for(let i=0;i<6;i++){
    const t=i<2? types.filter(k=>D.PROP[k].tier<=Math.min(1,tierNow()))[rint(0,Math.max(0,types.filter(k=>D.PROP[k].tier<=Math.min(1,tierNow())).length-1))] : pick(types);
    L.push({id:S.nid++, t, price:Math.round(D.PROP[t].price*(0.82+0.36*rnd())*S.macro.house/10)*10, exp:S.day+14});
  }
  S.listings=L;
}
function buyCost(price,t){ return price*(1+0.07+(D.PROP[t].pr? S.laws.luxTax:0)); }
function buyProp(lid){
  const l=S.listings.find(x=>x.id===lid); if(!l) return err('Annonce expirée.');
  const T=D.PROP[l.t]; if(!unlocked(T.tier)) return err('Palier de richesse insuffisant.');
  const c=buyCost(l.price,l.t); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c)+' (frais de notaire et droits de mutation inclus).');
  payCap('immo','Achat : '+T.n,-c);
  S.prop.push({id:S.nid++, t:l.t, name:T.n, base:l.price/S.macro.house, cond:1, paid:c, bought:S.day, reno:null, rentIn:0});
  S.listings=S.listings.filter(x=>x!==l);
  if(T.pr) S.prestige+=T.pr;
  log('info','Achat immobilier : '+T.n+' pour '+eur(c)+'.');
  return ok();
}
function sellProp(pid){
  const p=S.prop.find(x=>x.id===pid); if(!p) return err('Bien introuvable.');
  const v=propValue(p), net=v*(1-0.04);
  payCap('immo','Vente : '+p.name,net); S.tb.cap+=net-p.paid;
  S.prop=S.prop.filter(x=>x!==p); if(D.PROP[p.t].pr) S.prestige-=D.PROP[p.t].pr;
  if(S.day-p.bought<60) S.stats.flips++;
  return ok('Vendu '+eur(net)+(net>=p.paid?' (plus-value ':' (moins-value ')+eur(Math.abs(net-p.paid))+').');
}
function renovCost(p){ return propValue(p)*0.12; }
function renovate(pid){
  const p=S.prop.find(x=>x.id===pid); if(!p) return err('Bien introuvable.');
  if(p.reno) return err('Travaux déjà en cours.'); if(p.cond>=1.2) return err('Bien déjà entièrement rénové.');
  const c=renovCost(p); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c)+' requis.');
  payCap('immo','Rénovation : '+p.name,-c); p.reno={t:6,cost:c}; p.paid+=c;
  return ok();
}
function projectLimit(){ return 1+buildCoLevel(); }
function buildDiscount(){ return buildCoLevel()>0? 0.88:1; }
function startBuild(key){
  const T=D.BUILD[key]; if(!T) return err('Chantier inconnu.');
  if(!unlocked(T.tier)) return err('Palier de richesse insuffisant.');
  if(S.projects.length>=projectLimit()) return err('Capacité de chantier atteinte ('+projectLimit()+'). Une société de construction augmente la capacité.');
  const c=T.cost*buildDiscount(); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c)+' requis.');
  const days=Math.ceil(rint(T.d[0],T.d[1])*(buildCoLevel()>0?0.75:1));
  payCap('immo','Chantier : '+T.n,-c);
  S.projects.push({id:S.nid++, key, name:T.n, cost:c, t:days, total:days, value:T.cost*T.up});
  log('info','Chantier lancé : '+T.n+' ('+days+' jours).');
  return ok();
}
function rentEst(p){
  const T=D.PROP[p.t], vac=Math.max(0.02,0.08-0.01*agencyBonus()), boost=1+0.025*agencyBonus();
  return p.reno?0: propValue(p)*T.y*(1-vac)*(S.laws.rentCap?0.88:1)*boost*(0.9+0.1*S.macro.econ);
}
function upkeepEst(p){ return propValue(p)*D.PROP[p.t].u*(1+0.03*tierNow()); }
function propStep(){
  const M=S.macro;
  /* livraisons de chantiers */
  S.projects.forEach(pr=>{ pr.t--; });
  S.projects.filter(pr=>pr.t<=0).forEach(pr=>{
    const T=D.BUILD[pr.key], P=D.PROP[T.out];
    S.prop.push({id:S.nid++, t:T.out, name:pr.name+' (neuf)', base:pr.value/M.house, cond:1, paid:pr.cost, bought:S.day, reno:null, rentIn:0});
    log('good','Chantier livré : '+pr.name+' d’une valeur de '+eur(pr.value*M.house)+'.');
  });
  S.projects=S.projects.filter(pr=>pr.t>0);
  /* loyers, entretien */
  let rent=0, up=0;
  S.prop.forEach(p=>{
    if(p.reno){ p.reno.t--; if(p.reno.t<=0){ p.cond=Math.min(1.21,p.cond*1.10); p.reno=null; } }
    const r=rentEst(p);
    rent+=r; up+=upkeepEst(p); p.rentIn=(p.rentIn||0)+r;
  });
  if(rent>0) pay('immo','Loyers perçus',rent,'cap');
  if(up>0) pay('immo','Entretien, taxe foncière et assurances',-up);
  /* annonces */
  if(S.day%7===1 || !S.listings.length) genListings();
  S.listings=S.listings.filter(l=>l.exp>=S.day);
}

/* ---------- Luxe ---------- */
function initLux(){ D.LUX.forEach(l=>{ S.luxVal[l.id]=l.price*(0.95+0.1*rnd()); }); }
function luxStep(){
  D.LUX.forEach(l=>{
    let r=l.dr+l.vol*norm();
    if(l.hs) r+=0.3*(S.macro.house-1)*0.002;
    if(l.kind!=='monument') r+=0.04*(S.macro.econ-1)*0.01;
    S.luxVal[l.id]=Math.max(l.price*0.2,S.luxVal[l.id]*Math.exp(r));
  });
  let up=0; S.lux.forEach(o=>{ const l=D.LUX.find(x=>x.id===o.id); up+=S.luxVal[o.id]*l.up*(1+0.03*tierNow()); });
  if(up>0) pay('lux','Entretien, assurances et personnel du luxe',-up);
  S.prestige=S.lux.reduce((a,o)=>a+D.LUX.find(x=>x.id===o.id).pr,0)+S.prop.reduce((a,p)=>a+(D.PROP[p.t].pr||0),0);
}
function luxBuyPrice(l){ return S.luxVal[l.id]*(1.03+S.laws.luxTax); }
function luxSellPrice(l){
  let sp=l.spread; if(l.kind==='art'&&S.biz.some(b=>b.def==='gallery'&&b.status==='active')) sp*=0.5;
  return S.luxVal[l.id]*(1-sp);
}
function buyLux(id){
  const l=D.LUX.find(x=>x.id===id); if(!l) return err('Article inconnu.');
  if(!unlocked(l.tier)) return err('Palier de richesse insuffisant.');
  if(S.lux.some(o=>o.id===id)) return err('Vous possédez déjà cet article.');
  const c=luxBuyPrice(l); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c)+' requis.');
  payCap('lux','Achat : '+l.n,-c); S.lux.push({id, paid:c, day:S.day});
  S.rep=clamp(S.rep+(l.kind==='monument'?2:0.3),0,100); S.infl+=l.pr*0.05;
  log('info','Acquisition : '+l.n+' pour '+eur(c)+'. Prestige +'+l.pr+'.');
  return ok();
}
function sellLux(id){
  const o=S.lux.find(x=>x.id===id), l=D.LUX.find(x=>x.id===id); if(!o) return err('Article non possédé.');
  const p=luxSellPrice(l); payCap('lux','Vente : '+l.n,p); S.tb.cap+=p-o.paid; S.lux=S.lux.filter(x=>x!==o);
  return ok('Vendu '+eur(p)+'.');
}

/* ---------- Pays ---------- */
function buyCountry(id){
  const c=D.COUNTRIES.find(x=>x.id===id); if(!c) return err('Pays inconnu.');
  if(S.country) return err('Vous gouvernez déjà un pays.');
  if(!unlocked(c.tier)) return err('Palier Souverain requis.');
  const miss=(c.cities||[]).filter(x=>!cityOwned(x)); if(miss.length) return err('Possédez d’abord les trois villes du pays : il manque '+miss.map(x=>D.CITIES[x].n).join(', ')+'.');
  if(S.cash<c.price) return err('Trésorerie insuffisante : '+eur(c.price)+' requis.');
  payCap('country','Achat de '+c.n,-c.price);
  S.country={id, cities:(c.cities||[]).slice(), name:c.n, gdp:c.gdp, price:c.price, rate:.25, spend:.22, sat:60, since:S.day, low:0, revenue:0};
  S.rep=clamp(S.rep+10,0,100); S.infl+=300;
  if(!S.won){ S.won=true; S.flashWin=true; }
  log('good','Vous êtes désormais souverain de '+c.n+'.');
  return ok();
}
function countryStep(){
  const c=S.country; if(!c) return;
  const e=S.macro.econ;
  const rev=c.gdp/360*c.rate*e, cost=c.gdp/360*c.spend;
  pay('country','Recettes fiscales de '+c.name,rev); pay('country','Dépenses publiques de '+c.name,-cost);
  c.revenue=rev-cost;
  ctyProj(c);
  /* V1.6.6 : croissance du PIB (base 1,5 % par an, plus les dépenses publiques et les projets) ; la valeur du pays suit */
  const g=(0.015+0.05*(c.spend-0.22)-0.03*Math.max(0,c.rate-0.35)+(c.bg||0))/360; c.gdp*=1+g; c.price*=1+g;
  const tgt=55+180*(c.spend-0.22)-160*(c.rate-0.25)+30*(e-1)+(c.bs||0);
  c.sat=clamp(c.sat+(tgt-c.sat)*0.05,0,100);
  c.low = c.sat<20? c.low+1:0;
  if(c.low>=15){ const back=c.price*0.3; payCap('country','Indemnité après le coup d’État',back); log('crit','Coup d’État à '+c.name+' : vous perdez le pays (indemnité '+eur(back)+').'); S.country=null; S.won=false; }
}
/* V1.6.6 : grands projets nationaux, un à la fois, financés par votre trésorerie */
const CTY_PJ={
  inf:{n:'Grands travaux d’infrastructure',c:.03,d:240,t:'PIB +6 % et croissance +0,3 point par an.'},
  edu:{n:'Plan éducation',c:.02,d:300,t:'Croissance +0,5 point par an et satisfaction +3.'},
  hea:{n:'Hôpitaux publics',c:.02,d:180,t:'Satisfaction +6.'},
  tou:{n:'Promotion touristique',c:.01,d:120,t:'Vos sociétés dans le pays : ventes +4 %.'},
  zf:{n:'Zone franche',c:.01,d:90,t:'Vos sociétés dans le pays : coûts −5 %. Satisfaction −2.'}
};
function ctyProj(c){ c.done=c.done||[]; const p=c.pj; if(!p||S.day<p.until) return; c.pj=null; c.done.push(p.k);
  if(p.k==='inf'){ c.gdp*=1.06; c.price*=1.06; c.bg=(c.bg||0)+.003; } else if(p.k==='edu'){ c.bg=(c.bg||0)+.005; c.bs=(c.bs||0)+3; }
  else if(p.k==='hea') c.bs=(c.bs||0)+6; else if(p.k==='zf') c.bs=(c.bs||0)-2;
  log('good','Projet national terminé à '+c.name+' : '+CTY_PJ[p.k].n.toLowerCase()+'.'); }
const ctyHas = k => !!(S.country&&(S.country.done||[]).includes(k));
const ctyIn = b => !!(S.country&&S.country.cities&&S.country.cities.includes(b.city));
function ctyStart(k){ const c=S.country, P=CTY_PJ[k]; if(!c) return err('Aucun pays.'); if(!P) return err('Projet inconnu.'); if(c.pj) return err('Un projet est déjà en cours.');
  if((c.done||[]).includes(k)) return err('Projet déjà réalisé.'); const cost=c.gdp*P.c; if(S.cash<cost) return err('Trésorerie insuffisante : '+eur(cost,0)+'.');
  payCap('country','Projet national : '+P.n,-cost); c.pj={k,since:S.day,until:S.day+P.d}; return ok(P.n+' lancé, fin le '+dateL(S.day+P.d)+'.'); }
function setCountry(k,v){ if(!S.country) return err('Aucun pays.'); S.country[k]=clamp(v,k==='rate'?0.05:0,k==='rate'?0.6:0.6); return ok(); }
function sellCountry(){ if(!S.country) return err('Aucun pays.'); const p=S.country.price*0.7; payCap('country','Cession de '+S.country.name,p); S.country=null; return ok('Pays cédé pour '+eur(p)+'.'); }

