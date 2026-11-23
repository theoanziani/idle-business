/* ============================================================
   USINES ET LOGISTIQUE : production en unités, marché de gros, stocks d'usine,
   contrats de livraison, transport entre villes, intégration verticale
   ============================================================ */
D.GOODS = {
  vet:{n:'Vêtements', u:'pièces', v:25, vol:.012},
  comp:{n:'Composants électroniques', u:'lots', v:40, vol:.016},
  tel:{n:'Smartphones', u:'appareils', v:300, vol:.014},
  alim:{n:'Produits alimentaires', u:'caisses', v:12, vol:.01}
};
/* Usine -> produit fabriqué ; matière première fournie par une autre de vos usines */
D.FACT = {textile:'vet', electronics:'comp', phones:'tel', farm:'alim'};
D.FACTIN = {phones:'comp'};
const isFact = b => !!D.FACT[b.def];
const goodOf = b => D.FACT[b.def];
const CONT = {'France':'eu','Croatie':'eu','Espagne':'eu','États-Unis':'am','Brésil':'am','Chine':'as'};
function gpInit(){ if(!S.gp){ S.gp={}; Object.keys(D.GOODS).forEach(g=>{ S.gp[g]={i:1,h:[1]}; }); } return S.gp; }
const gIdx = g => gpInit()[g].i;
const gPrice = g => D.GOODS[g].v*gIdx(g);
function gpStep(){
  const P=gpInit(), e=S.macro.econ;
  Object.keys(D.GOODS).forEach(g=>{ const x=P[g]; x.i=clamp(x.i*Math.exp(D.GOODS[g].vol*norm()+0.03*Math.log(1/x.i)+0.002*(e-1)),.55,1.8); x.h.push(Math.round(x.i*1000)/1000); if(x.h.length>120) x.h.shift(); });
}
/* Capacité de stockage d'une usine en jours de production : 10 jours × équipement, +15 jours par entrepôt actif dans la même ville */
function factCapDays(b){ let d=10*EQC[eqOf(b)]; S.biz.forEach(x=>{ if(x.def==='warehouse'&&x.status==='active'&&x.city===b.city) d+=15*x.lvl; }); return d; }
const factRate = b => (b.prodAvg||0);
function factCap(b){ return Math.max(1,factRate(b))*factCapDays(b); }
/* Production du jour : renvoie les ventes encaissées (vente au grossiste) */
function factoryDay(b,revEq){
  const g=goodOf(b), G=D.GOODS[g], u=revEq/G.v;
  b.prodAvg=(b.prodAvg||u)*.9+u*.1; b.prodDay=u;
  b.goods=(b.goods||0)+u;
  if(b.fmode!=='store'){ const keep=Math.min(b.goods,reserveFor(g,b)); const r=(b.goods-keep)*gPrice(g); b.goods=keep; return r; }
  const cap=factCap(b); let r=0;
  if(b.goods>cap){ const ex=b.goods-cap; r=ex*gPrice(g)*.85; b.goods=cap; if(!b.capWarn){ b.capWarn=1; log('warn','Stock plein chez « '+b.name+' » : l’excédent part au grossiste avec 15 % de décote. Un entrepôt dans la ville agrandit le stock.'); } }
  else b.capWarn=0;
  return r;
}
/* Production réservée aux contrats ouverts : en mode vente, l'usine garde de quoi les honorer */
function reserveFor(g,b){ const I=S.ind; if(!I) return 0; let need=0; I.active.forEach(c=>{ if(c.st==='open'&&c.g===g) need+=c.qty; }); let held=0; S.biz.forEach(x=>{ if(x!==b&&goodOf(x)===g) held+=x.goods||0; }); return Math.max(0,Math.min(need-held,factCap(b))); }
function setFmode(b,m){ b.fmode=m==='store'?'store':'sell'; return ok(); }
function sellGoods(b){ if(!b.goods||b.goods<1) return err('Aucun stock à vendre.'); const g=goodOf(b), r=b.goods*gPrice(g); pay('b:'+b.id,'Vente au grossiste : '+D.GOODS[g].n,r); b.goods=0; return ok('Stock vendu '+eur(r,0)+'.'); }
/* Intégration verticale : une usine de smartphones utilise d'abord vos composants en stock (8 % moins cher que le fournisseur) */
function factSupply(b,bought){
  const g=D.FACTIN[b.def]; if(!g||bought<=0) return bought;
  let need=bought; const src=S.biz.filter(x=>goodOf(x)===g&&x.goods>0);
  for(const x of src){ if(need<=0) break; const val=x.goods*gPrice(g), take=Math.min(val,need); x.goods-=take/gPrice(g); need-=take; b.inSup=(b.inSup||0)+take; }
  return need+(bought-need)*.92;
}

/* ---------- Transport entre villes ---------- */
function route(fromC,toC){
  const A=D.CITIES[fromC], B=D.CITIES[toC]; let days, rate;
  if(fromC===toC){ days=1; rate=.01; } else if(A.country===B.country){ days=2; rate=.02; } else if(CONT[A.country]===CONT[B.country]){ days=4; rate=.04; } else { days=9; rate=.07; }
  const ship=false;   /* V1.4.9 : le gain passe par la compagnie maritime (metier_shipping.js) */
  if(S.mgr&&S.mgr.del&&A.country===B.country){ days=Math.max(1,days-1); rate*=.7; }
  return {days,rate,ship};
}

/* ---------- Contrats de livraison ---------- */
const CLIENTS=['Centrale d’achat Europa','Chaîne de magasins Horizon','Distributeur Pacifico','Grossiste Atlante','Réseau de franchises Alba','Plateforme en ligne Vela'];
function indInit(){ if(!S.ind) S.ind={offers:[],active:[],ship:[],next:S.day}; return S.ind; }
function newContract(){
  const I=indInit(), mine=[...new Set(S.biz.filter(isFact).map(goodOf))]; if(!mine.length) return;
  const g=pick(mine), G=D.GOODS[g], ref=S.biz.filter(x=>goodOf(x)===g).reduce((a,x)=>a+Math.max(1,factRate(x)),0);
  const qty=Math.max(10,Math.round(ref*rint(4,9)/10)*10), cities=D.CITY_ORDER.filter(cityUnlocked), city=pick(cities);
  I.offers.push({id:S.nid++, g, qty, city, px:Math.round(G.v*(1.15+0.3*rnd())*100)/100, due:S.day+rint(20,45), client:rnd()<.3? pick(rivAlive()).n : pick(CLIENTS), exp:S.day+8});
}
function acceptContract(id){ const I=indInit(), o=I.offers.find(x=>x.id===id); if(!o) return err('Offre expirée.'); if(I.active.length>=5) return err('Cinq contrats en cours au maximum.'); I.offers=I.offers.filter(x=>x!==o); o.st='open'; I.active.push(o); return ok('Contrat signé : livrer avant le '+dateL(o.due)+'.'); }
function deliverFrom(cid,bid){
  const I=indInit(), c=I.active.find(x=>x.id===cid), b=S.biz.find(x=>x.id===bid); if(!c||c.st!=='open') return err('Contrat introuvable.');
  if(!b||goodOf(b)!==c.g) return err('Cette usine ne fabrique pas ce produit.');
  if((b.goods||0)<c.qty) return err('Stock insuffisant : '+fmtN(b.goods||0)+' / '+fmtN(c.qty)+' '+D.GOODS[c.g].u+'.');
  const R=route(b.city,c.city), cost=c.qty*D.GOODS[c.g].v*R.rate;
  pay('b:'+b.id,'Transport vers '+D.CITIES[c.city].n,-cost);
  b.goods-=c.qty; c.st='ship'; I.ship.push({cid:c.id, from:b.city, to:c.city, arr:S.day+R.days, g:c.g, qty:c.qty, bid:b.id});
  return ok('Expédition partie de '+D.CITIES[b.city].n+' : arrivée dans '+plu(R.days,'jour')+'.');
}
function indStep(){
  const I=indInit(); gpStep();
  if(S.day>=I.next){ if(S.biz.some(x=>isFact(x)&&x.status==='active')){ const n=rint(1,3); for(let i=0;i<n&&I.offers.length<4;i++) newContract(); } I.next=S.day+rint(7,12); }
  I.offers=I.offers.filter(o=>o.exp>=S.day);
  I.ship=I.ship.filter(s=>{
    if(S.day<s.arr) return true;
    const c=I.active.find(x=>x.id===s.cid); if(!c) return false;
    const late=S.day>c.due, val=c.qty*c.px*(late?.7:1), b=S.biz.find(x=>x.id===s.bid);
    pay(b?'b:'+b.id:'gen','Contrat '+c.client+' : '+D.GOODS[c.g].n,val);
    if(b&&b.hist.length) b.hist[b.hist.length-1]+=val;
    if(late) S.rep=clamp(S.rep-2,0,100); else S.rep=clamp(S.rep+.5,0,100);
    log(late?'warn':'good','Livraison à '+c.client+' ('+D.CITIES[c.city].n+') : '+eur(val,0)+(late?' (retard : 30 % retenus).':'.'));
    I.active=I.active.filter(x=>x!==c); return false;
  });
  I.active.forEach(c=>{ if(c.st!=='open') return; const src=S.biz.filter(x=>goodOf(x)===c.g&&(x.goods||0)>=c.qty).sort((a,b)=>route(a.city,c.city).days-route(b.city,c.city).days)[0]; if(src){ const r=deliverFrom(c.id,src.id); if(r.ok) log('info','Livraison automatique pour '+c.client+' : '+r.msg); } });
  I.active=I.active.filter(c=>{
    if(c.st==='open'&&S.day>c.due+5){ const pen=c.qty*c.px*.15; pay('gen','Pénalité de contrat non livré : '+c.client,-pen); S.rep=clamp(S.rep-3,0,100); log('bad','Contrat non livré pour '+c.client+' : pénalité de '+eur(pen,0)+'.'); return false; }
    return true;
  });
}
function goodsNW(){ let v=0; S.biz.forEach(b=>{ if(b.goods) v+=b.goods*gPrice(goodOf(b))*.9; }); if(S.ind) S.ind.ship.forEach(s=>{ v+=s.qty*D.GOODS[s.g].v*.9; }); return v; }

