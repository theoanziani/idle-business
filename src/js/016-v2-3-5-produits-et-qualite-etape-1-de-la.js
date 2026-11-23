/* ============================================================
   V2.3.5 : PRODUITS ET QUALITÉ (étape 1 de la refonte de l'approvisionnement)
   Chaque usine fabrique plusieurs produits ; le joueur répartit sa capacité (b.mix, poids 0 à 10 par produit) et
   choisit la qualité de chaque ligne (b.pq : 0 standard, 1 supérieure, 2 premium). Une qualité plus haute coûte
   plus cher à produire (moins d'unités, QC) mais se vend plus cher (QV) ; les contrats peuvent exiger une qualité.
   Le stock garde la qualité fabriquée : b.st[produit] = [standard, supérieure, premium] en unités.
   Les prix de gros suivent l'indice de la famille (alimentaire, vêtements, composants).
   Anciennes sauvegardes : le stock (b.goods) est converti en produits à valeur égale, les contrats en cours
   portent sur le produit principal, les offres en attente sont renouvelées.
   ============================================================ */
D.PRODS = {
  cer:{fac:'farm', g:'alim', n:'Céréales', u:'quintaux', v:20},
  leg:{fac:'farm', g:'alim', n:'Légumes et fruits', u:'caisses', v:10},
  lai:{fac:'farm', g:'alim', n:'Produits laitiers', u:'caisses', v:14},
  oeu:{fac:'farm', g:'alim', n:'Œufs et volaille', u:'caisses', v:16},
  vin:{fac:'farm', g:'alim', n:'Vin', u:'caisses', v:36},
  cot:{fac:'textile', g:'vet', n:'Tissu de coton', u:'rouleaux', v:30},
  lan:{fac:'textile', g:'vet', n:'Tissu de laine', u:'rouleaux', v:55},
  soi:{fac:'textile', g:'vet', n:'Soie', u:'rouleaux', v:110},
  pap:{fac:'textile', g:'vet', n:'Vêtements', u:'pièces', v:25},
  ecr:{fac:'electronics', g:'comp', n:'Écrans', u:'lots', v:45},
  bat:{fac:'electronics', g:'comp', n:'Batteries', u:'lots', v:30},
  puc:{fac:'electronics', g:'comp', n:'Puces', u:'lots', v:60},
  pau:{fac:'electronics', g:'comp', n:'Pièces automobiles', u:'lots', v:35}
};
const FACT_P = {farm:['cer','leg','lai','oeu','vin'], textile:['cot','lan','soi','pap'], electronics:['ecr','bat','puc','pau']};
const MIX0 = {farm:{cer:3,leg:3,lai:2,oeu:1,vin:1}, textile:{cot:3,lan:1,soi:1,pap:5}, electronics:{ecr:3,bat:3,puc:3,pau:1}};
const QN = ['Standard','Supérieure','Premium'], QC = [1,1.35,1.8], QV = [1,1.25,1.6];
const pPrice = (p,q) => D.PRODS[p].v*gIdx(D.PRODS[p].g)*QV[q||0];
const prodsOf = b => FACT_P[b.def]||[];
/* état d'une usine, créé ou converti au besoin */
function fpInit(b){ if(!isFact(b)||!FACT_P[b.def]) return null;
  if(!b.mix){ b.mix=Object.assign({},MIX0[b.def]); }
  if(!b.pq) b.pq={};
  if(!b.st){ b.st={}; prodsOf(b).forEach(p=>b.st[p]=[0,0,0]);
    if(b.goods>0){ const V=b.goods*D.GOODS[goodOf(b)].v, W=fpW(b); prodsOf(b).forEach(p=>{ b.st[p][0]=V*(b.mix[p]||0)/W/D.PRODS[p].v; }); } b.goods=0; }
  return b; }
const fpW = b => Math.max(1e-9, prodsOf(b).reduce((a,p)=>a+(b.mix[p]||0),0));
const fpShare = (b,p) => (b.mix[p]||0)/fpW(b);
const fpUnits = (b,p,qmin) => { const s=b.st&&b.st[p]; if(!s) return 0; let u=0; for(let q=qmin||0;q<3;q++) u+=s[q]; return u; };
function fpValue(b){ if(!b.st) return 0; let v=0; prodsOf(b).forEach(p=>{ for(let q=0;q<3;q++) v+=(b.st[p][q]||0)*pPrice(p,q); }); return v; }
/* capacité de stockage en valeur (prix de référence) : jours de production × production moyenne */
factCap=function(b){ return Math.max(1,b.prodAvgV||0)*factCapDays(b); };
function fpRefValue(b){ if(!b.st) return 0; let v=0; prodsOf(b).forEach(p=>{ for(let q=0;q<3;q++) v+=(b.st[p][q]||0)*D.PRODS[p].v*QV[q]; }); return v; }
/* retire u unités du produit p de qualité ≥ qmin, en commençant par la qualité la plus basse acceptée */
function fpTake(b,p,u,qmin){ const s=b.st[p]; let left=u, val=0; for(let q=qmin||0;q<3&&left>1e-9;q++){ const t=Math.min(left,s[q]); s[q]-=t; left-=t; val+=t*pPrice(p,q); } return {u:u-left, val}; }
/* stock à garder en vente au gros : contrats ouverts puis besoins de vos sociétés */
function fpKeep(b){ const K={}; prodsOf(b).forEach(p=>K[p]=[0,0,0]); const I=S.ind;
  if(I) I.active.forEach(c=>{ if(c.st!=='open'||!K[c.p]) return; let need=c.qty; for(let q=c.qm||0;q<3&&need>0;q++){ const t=Math.min(need,b.st[c.p][q]-K[c.p][q]); K[c.p][q]+=t; need-=t; } });
  let needV=supReserveV(goodOf(b),b);
  if(needV>0) prodsOf(b).forEach(p=>{ for(let q=0;q<3&&needV>0;q++){ const free=b.st[p][q]-K[p][q], pr=pPrice(p,q); const t=Math.min(free,needV*fpShare(b,p)/pr); if(t>0){ K[p][q]+=t; } } });
  return K; }
/* la ferme produit ce qu'elle cultive : la répartition suit ses parcelles (valeur moyenne par jour de chaque culture) */
const FM_PROD = {ble:'cer', mais:'cer', tourn:'cer', leg:'leg', verger:'leg', vigne:'vin', vaches:'lai', poules:'oeu'};
function fpFarmMix(b){ const m=b.m; if(!m||!m.p||typeof fmCrop!=='function') return; const W={}; FACT_P.farm.forEach(p=>W[p]=0);
  m.p.forEach(x=>{ if(!x) return; const c=fmCrop(x.c), p=FM_PROD[x.c]; if(!c||!p) return; const v= c.k==='elev'? c.d : c.k==='per'? c.y/360 : c.y/(c.id==='leg'?120:360); W[p]+=v; });
  const t=Object.values(W).reduce((a,x)=>a+x,0); if(t>0) FACT_P.farm.forEach(p=>b.mix[p]=W[p]/t*10); }
factoryDay=function(b,revEq){ fpMigInd(); fpInit(b); if(b.def==='farm') fpFarmMix(b);
  b.pday={}; prodsOf(b).forEach(p=>{ const q=b.pq[p]||0, u=revEq*fpShare(b,p)/(D.PRODS[p].v*QC[q]); b.st[p][q]+=u; b.pday[p]=u; });
  b.prodDayV=revEq; b.prodAvgV=(b.prodAvgV||revEq)*.9+revEq*.1; b.prodAvg=b.prodAvgV/D.GOODS[goodOf(b)].v; b.prodDay=revEq/D.GOODS[goodOf(b)].v;
  let r=b.supRev||0; b.supRev=0;
  if(b.fmode!=='store'){ const K=fpKeep(b); prodsOf(b).forEach(p=>{ for(let q=0;q<3;q++){ const x=b.st[p][q]-K[p][q]; if(x>0){ r+=x*pPrice(p,q); b.st[p][q]-=x; } } }); return r; }
  const cap=factCap(b), v=fpRefValue(b);
  if(v>cap){ const f=(v-cap)/v; prodsOf(b).forEach(p=>{ for(let q=0;q<3;q++){ const x=b.st[p][q]*f; r+=x*pPrice(p,q)*.85; b.st[p][q]-=x; } });
    if(!b.capWarn){ b.capWarn=1; log('warn','Stock plein chez « '+b.name+' » : l’excédent part au grossiste avec 15 % de décote. Un entrepôt dans la ville agrandit le stock.'); } }
  else b.capWarn=0;
  return r; };
sellGoods=function(b){ fpInit(b); const v=fpValue(b); if(v<1) return err('Aucun stock à vendre.'); prodsOf(b).forEach(p=>{ b.st[p]=[0,0,0]; }); pay('b:'+b.id,'Vente au grossiste : stock de '+b.name,v); return ok('Stock vendu '+eur(v,0)+'.'); };
function sellProd(b,p){ fpInit(b); if(!b.st[p]) return err('Produit inconnu.'); let v=0; for(let q=0;q<3;q++) v+=b.st[p][q]*pPrice(p,q); if(v<1) return err('Aucun stock de ce produit.'); b.st[p]=[0,0,0]; pay('b:'+b.id,'Vente au grossiste : '+D.PRODS[p].n,v); return ok(D.PRODS[p].n+' vendus '+eur(v,0)+'.'); }
function setMix(b,p,d){ fpInit(b); if(b.def==='farm') return err('La ferme produit ce que ses parcelles cultivent.'); if(!b.mix||b.mix[p]===undefined) return err('Produit inconnu.'); const n=clamp((b.mix[p]||0)+d,0,10); if(n===0&&prodsOf(b).every(x=>x===p||!b.mix[x])) return err('Il faut au moins un produit.'); b.mix[p]=n; return ok(); }
function setPq(b,p,q){ fpInit(b); if(!b.st[p]) return err('Produit inconnu.'); b.pq[p]=clamp(q|0,0,2); return ok(); }
/* production de ce produit par jour, toutes usines (unités) */
function pRate(p){ let r=0; S.biz.forEach(b=>{ if(isFact(b)&&b.status==='active'&&b.mix&&b.mix[p]){ const q=(b.pq&&b.pq[p])||0; r+=(b.prodAvgV||0)*fpShare(b,p)/(D.PRODS[p].v*QC[q]); } }); return r; }
/* contrats par produit, parfois avec une qualité minimale */
newContract=function(){ const I=indInit(), F=S.biz.filter(x=>isFact(x)&&x.status==='active'&&fpInit(x)); if(!F.length) return;
  const f=pick(F), L=prodsOf(f).filter(p=>f.mix[p]>0); if(!L.length) return; const p=pick(L), P=D.PRODS[p], ref=Math.max(1,pRate(p));
  const r=rnd(), qm= r<.15? 2 : r<.45? 1 : 0;
  const qty=Math.max(10,Math.round(ref*rint(4,9)/10)*10), cities=D.CITY_ORDER.filter(cityUnlocked), city=pick(cities);
  I.offers.push({id:S.nid++, p, g:P.g, qm, qty, city, px:Math.round(P.v*QV[qm]*(1.15+0.3*rnd())*100)/100, due:S.day+rint(20,45), client:rnd()<.3? pick(rivAlive()).n : pick(CLIENTS), exp:S.day+8}); };
deliverFrom=function(cid,bid){ const I=indInit(), c=I.active.find(x=>x.id===cid), b=S.biz.find(x=>x.id===bid); if(!c||c.st!=='open') return err('Contrat introuvable.');
  if(!b||!fpInit(b)||!b.st[c.p]) return err('Cette usine ne fabrique pas ce produit.');
  const have=fpUnits(b,c.p,c.qm); if(have<c.qty) return err('Stock insuffisant'+(c.qm?' en qualité '+QN[c.qm].toLowerCase()+' ou mieux':'')+' : '+fmtN(have)+' / '+fmtN(c.qty)+' '+D.PRODS[c.p].u+'.');
  const R=route(b.city,c.city), cost=c.qty*D.PRODS[c.p].v*R.rate; pay('b:'+b.id,'Transport vers '+D.CITIES[c.city].n,-cost);
  fpTake(b,c.p,c.qty,c.qm); c.st='ship'; I.ship.push({cid:c.id, from:b.city, to:c.city, arr:S.day+R.days, p:c.p, g:c.g, qty:c.qty, bid:b.id});
  return ok('Expédition partie de '+D.CITIES[b.city].n+' : arrivée dans '+plu(R.days,'jour')+'.'); };
function fpMigInd(){ const I=S.ind; if(!I||I.v235) return; I.v235=1;
  I.offers=I.offers.filter(o=>o.p);
  I.active.forEach(c=>{ if(c.p) return; const fac=Object.keys(D.FACT).find(k=>D.FACT[k]===c.g), p=(FACT_P[fac]||[])[0]; if(!p) return; const k=D.GOODS[c.g].v/D.PRODS[p].v; c.p=p; c.qm=0; c.qty=Math.max(1,Math.round(c.qty*k)); c.px=c.px/k; });
  I.ship.forEach(s=>{ if(!s.p){ const c=I.active.find(x=>x.id===s.cid); s.p=c&&c.p; s.qty=c?c.qty:s.qty; } }); }
{ const _is=indStep; indStep=function(){ indInit(); fpMigInd(); S.biz.forEach(b=>{ if(isFact(b)) fpInit(b); });
  const I=S.ind;
  /* livraisons automatiques et paiements : versions par produit */
  I.active.forEach(c=>{ if(c.st!=='open'||!c.p) return; const src=S.biz.filter(x=>isFact(x)&&x.st&&x.st[c.p]&&fpUnits(x,c.p,c.qm)>=c.qty).sort((a,b)=>route(a.city,c.city).days-route(b.city,c.city).days)[0];
    if(src){ const r=deliverFrom(c.id,src.id); if(r.ok) log('info','Livraison automatique pour '+c.client+' : '+r.msg); } });
  _is(); }; }
goodsNW=function(){ let v=0; S.biz.forEach(b=>{ if(isFact(b)&&b.st) v+=fpValue(b)*.9; }); if(S.ind) S.ind.ship.forEach(s=>{ const c=S.ind.active.find(x=>x.id===s.cid); v+=(s.qty||0)*(s.p? D.PRODS[s.p].v : D.GOODS[s.g].v)*.9; }); return v; };
/* approvisionnement de vos sociétés (V2.2.6) : en valeur, pris dans tous les produits de la famille, qualité standard d'abord */
function supReserveV(g,b){ if(!supOn(b)) return 0; const F=supFacts(g); if(!F.length) return 0; return supClients(g).reduce((a,x)=>a+supNeedV(x),0)*1.5/F.length; }
supStep=function(){
  S.biz.forEach(b=>{ if(isFact(b)) b.supOut=0; if(supGood(b)){ b.supSave=0; b.supIn=0; } });
  Object.keys(SUP_USE).forEach(g=>{ const F=supFacts(g).filter(fpInit); if(!F.length) return;
    supClients(g).forEach(c=>{ let needV=supNeedV(c); if(needV<=0) return;
      F.slice().sort((a,b)=>route(a.city,c.city).rate-route(b.city,c.city).rate).forEach(f=>{ if(needV<=0) return; const R=route(f.city,c.city);
        prodsOf(f).forEach(p=>{ if(needV<=0) return; for(let q=0;q<3&&needV>0;q++){ const pr=pPrice(p,q), u=Math.min(f.st[p][q], needV*fpShare(f,p)/pr+1e-9, needV/pr); if(u<=0) continue;
          f.st[p][q]-=u; const v=u*pr; needV-=v; f.supRev=(f.supRev||0)+v; f.supOut=(f.supOut||0)+v/D.GOODS[g].v; c.supIn=(c.supIn||0)+v; c.supSave=(c.supSave||0)+v*Math.max(0,SUP_DISC-R.rate); } }); }); }); });
};

