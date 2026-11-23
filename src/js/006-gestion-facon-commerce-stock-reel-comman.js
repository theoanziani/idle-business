/* ============================================================
   GESTION FAÇON COMMERCE : stock réel, commandes, équipement, horaires, formation, mutuelle
   ============================================================ */
const STOCK_SEC=['restauration','commerce','luxe','online','industrie','agri'];
const isStock = b => STOCK_SEC.includes(bizSec(b.def)) && !(typeof metCore==='function'&&metCore(b));
const REV_BOOST = 1.1;
/* qualité du produit (activités de vente sans moteur métier) : 0 standard, 1 supérieure, 2 premium */
const PQN=['Standard','Supérieure','Premium'], PQC=[1,1.12,1.3];
const pqOn = b => isStock(b) && ['commerce','luxe','restauration'].includes(bizSec(b.def));
const pqOf = b => pqOn(b)? (b.pq||0) : 0;
const pqCost = b => PQC[pqOf(b)];
const cogsRef = b => bizBase(b).R0*bizDef(b).c;
const EQN=['Basique','Standard','Professionnel','Haut de gamme'], EQC=[1,1.5,2.2,3], EQP=[1,1.03,1.06,1.1], EQK=[0,.12,.3,.6];
const eqOf = b => b.eq||0;
const capDays = b => 10*EQC[eqOf(b)];
const HRSN=['Réduits','Normaux','Étendus'], HRS_S=[.82,1,1.15], HRS_W=[.8,1,1.28], HRS_F=[-.15,0,.45];
const hrsOf = b => b.hrs===undefined? 1 : b.hrs;
/* Planning horaire : 3 créneaux (matin 7-12 h, après-midi 12-18 h, soir 18-23 h) et 1 ou 2 équipes */
const SLOTN=['Matin','Après-midi','Soir'], SLOTH=[5,6,5], SLOTT=['7 h – 12 h','12 h – 18 h','18 h – 23 h'];
const SLOTW={restauration:[.2,.4,.4],commerce:[.3,.5,.2],loisirs:[.1,.35,.55],luxe:[.3,.55,.15],media:[.45,.45,.1],tech:[.45,.45,.1],bureaux:[.45,.45,.1],immo:[.45,.45,.1],industrie:[.38,.42,.2],agri:[.5,.45,.05]};
const SLOTD={restauration:[0,1,1],loisirs:[0,1,1]};
const planOn = b => !!SLOTW[bizSec(b.def)];
const slotW = b => SLOTW[bizSec(b.def)]||[.34,.33,.33];
const slotDef = b => SLOTD[bizSec(b.def)]||[1,1,0];
function planOf(b){
  if(b.pl) return b.pl;
  const d=slotDef(b), w=slotW(b), h=hrsOf(b);
  if(h===2) return {s:[1,1,1],t:1};
  if(h===0){ let k=-1; d.forEach((x,i)=>{ if(x&&(k<0||w[i]>w[k])) k=i; }); return {s:[0,1,2].map(i=>i===k?1:0),t:1}; }
  return {s:d.slice(),t:1};
}
const planH = (b,pl) => (pl||planOf(b)).s.reduce((a,x,i)=>a+(x?SLOTH[i]:0),0);
function planEff(b,pl){
  if(!planOn(b)) return {S:1,W:1,F:0,H:24};
  pl=pl||planOf(b);
  const w=slotW(b), d=slotDef(b), H=planH(b,pl), H0=d.reduce((a,x,i)=>a+(x?SLOTH[i]:0),0);
  const ws=pl.s.reduce((a,x,i)=>a+(x?w[i]:0),0), w0=d.reduce((a,x,i)=>a+(x?w[i]:0),0);
  let Sm=Math.pow(ws/w0,.85);
  let Wm, Fm;
  if(pl.t===2){ Wm=H/H0*1.3; Fm=-0.3; Sm*=1.06; }  /* deux équipes : service plus rapide (+6 % de ventes), aucune fatigue, salaires +30 % */
  else { Wm=(Math.min(H,H0)+Math.max(0,H-H0)*1.1)/H0; Fm= H>H0? (H-H0)*0.16 : -(H0-H)*0.03; }
  return {S:Sm,W:Wm,F:Fm,H};
}
function setPlan(b,slot,v){
  const pl=Object.assign({},planOf(b)); pl.s=pl.s.slice();
  if(slot==='t') pl.t=v===2?2:1;
  else { const i=slot|0; if(i<0||i>2) return; pl.s[i]=v?1:0; if(!pl.s.some(x=>x)) return err('Gardez au moins un créneau ouvert.'); }
  b.pl=pl; return ok();
}
const buyF = () => S.proc? .97 : 1;
const pendingOf = b => (b.ord||[]).reduce((a,o)=>a+o.a,0);
function stockTarget(b){ return cogsRef(b)*Math.min(STKD[stkOf(b)],capDays(b)); }
function stockCap(b){ return cogsRef(b)*capDays(b); }
/* Ventes limitées par le stock ; réception et passage des commandes. Renvoie le coût des achats du jour (trésorerie). */
function stockDay(b,need,open){
  if(b.stock===undefined) b.stock=cogsRef(b)*5;
  const day=S.day; let bought=0;
  const pen=b.penUntil&&day<b.penUntil;   /* pénurie : plus aucune livraison, le stock de secours permet de continuer */
  b.ord=(b.ord||[]).filter(o=>{ if(o.d<=day&&!pen){ b.stock+=o.a; return false; } return true; });
  if(open&&!pen&&rnd()<.003){ b.penUntil=day+rint(6,12); log('warn','Pénurie chez les fournisseurs de « '+b.name+' » : aucune livraison pendant '+(b.penUntil-day)+' jours. Votre stock de secours prend le relais.'); }
  let frac=1;
  if(open&&need>0){
    if(b.stock>=need) b.stock-=need;
    else { frac=b.stock/need; b.stock=0; }
    if(frac<.98){ b.rvx=clamp((b.rvx||0)+0.5*(1-frac),-1,1.6); b.rvOut=S.day; b.soDays=(b.soDays||0)+1; if(b.soDays===1) log('warn','Rupture de stock chez « '+b.name+' » : '+Math.round((1-frac)*100)+' % des ventes perdues. Commandez ou augmentez le stock visé.'); }
    else b.soDays=0;
  }
  if(b.auto!==false){
    const want=stockTarget(b)-b.stock-pendingOf(b);
    if(want>cogsRef(b)*.25){
      if(S.cash<0){ if(!b.supWarn){ b.supWarn=1; log('bad','Fournisseurs de « '+b.name+' » : commandes suspendues tant que votre compte est à découvert.'); } }
      else { b.supWarn=0; bought=want*buyF(); if(S.mgr&&S.mgr.del&&!(b.lateUntil>=day)) b.stock+=want; else b.ord.push({a:want,d:day+(b.lateUntil>=day?4:1)}); }
    }
  }
  return {frac,bought};
}
function orderStock(b){
  if(!isStock(b)||b.status!=='active') return err('Cette activité ne gère pas de stock.');
  const amt=stockCap(b)-(b.stock||0)-pendingOf(b); if(amt<cogsRef(b)*.25) return err('Entrepôts pleins.');
  const c=amt*buyF(); if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('b:'+b.id,'Commande de marchandises',-c); settleAccounts(); (b.ord=b.ord||[]).push({a:amt,d:S.day+1});
  return ok('Commande passée : '+eur(c,0)+', livrée demain.');
}
function setAuto(b,v){ b.auto=!!v; }
function setHrs(b,v){ b.hrs=clamp(v|0,0,2); delete b.pl; }
function eqCost(b){ const n=eqOf(b)+1; return n>3? 0 : bizDef(b).cost*Math.pow(1.6,b.lvl-1)*EQK[n]*(b.cf||1); }
function upgradeEq(b){
  if(eqOf(b)>=3) return err('Équipement au maximum.'); if(b.status!=='active') return err('Disponible une fois la société ouverte.');
  const c=eqCost(b); if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  payCap('b:'+b.id,'Équipement : '+b.name,-c); settleAccounts(); b.eq=eqOf(b)+1;
  return ok('Équipement « '+EQN[b.eq]+' » installé.');
}
const trainCost = b => 4*wageBill(b,false);
const trainReady = b => S.day-(b.tr===undefined?-99:b.tr)>=20;
function trainTeam(b){
  if(b.status!=='active'||!headcount(b)) return err('Aucune équipe à former.');
  if(!trainReady(b)) return err('Prochaine formation dans '+(20-(S.day-b.tr))+' jours.');
  const c=trainCost(b); if(!bizCanPay(b,c)) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('b:'+b.id,'Formation du personnel',-c); b.tr=S.day;
  Object.values(b.staff).forEach(k=>{ k.prod=Math.round(Math.min(1.6,k.prod+0.06*clamp((1.6-k.prod)/0.6,0,1))*100)/100; k.loy=clamp(k.loy+3,0,100); });
  return ok('Équipe formée : productivité et fidélité en hausse.');
}
function trainAll(){ let n=0,t=0; S.biz.forEach(b=>{ if(b.status==='active'&&headcount(b)&&trainReady(b)&&S.cash>=trainCost(b)){ t+=trainCost(b); trainTeam(b); n++; } }); return n? ok(n+' équipe(s) formée(s) pour '+eur(t,0)+'.') : err('Aucune équipe à former pour l’instant.'); }
function setHc(b,v){ b.hc=!!v; }
const hcLoy = b => b.hc? 5 : (S.diff==='hard'? -5 : 0);
function setProc(v){
  if(v&&!S.proc){ if(S.cash<3000) return err('Trésorerie insuffisante : 3 000 € requis.'); payCap('gen','Recrutement de l’acheteur des boutiques',-3000); S.proc=true; log('good','Acheteur des boutiques recruté : marchandises 3 % moins chères.'); }
  else if(!v) S.proc=false; return ok();
}
function procStep(){ if(S.proc&&S.biz.some(isStock)) pay('gen','Acheteur des boutiques',-45*progMult()); }
D.BASKET={repair:60,ecom:45,agency:3000,staffing:900,resto:85,farm:400,cyber:2500,build:25000,fastfood:12,textile:800,saas:30,electronics:2000,super:55,studio:150,ai:500,promo:250000,gallery:15000,phones:600,couture:2500,renew:5000,dc:1500,park:60,hotel:450,warehouse:900,dealer:28000,office:4000,shipping:60000};
const clientsOf = b => b.last&&b.last.rev? b.last.rev/(D.BASKET[b.def]||100) : 0;

