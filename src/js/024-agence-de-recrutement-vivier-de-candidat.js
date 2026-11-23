/* ============================================================
   AGENCE DE RECRUTEMENT : vivier de candidats commun à toutes vos entités
   ============================================================ */
const AG = {
  names:['Agence d’intérim','Cabinet de recrutement','Chasseur de têtes','Cabinet d’élite'],
  desc:['Profils variés et disponibles vite. Frais d’agence faibles, qualité moyenne.',
        'Vivier plus large, profils plus fiables. Recherche ciblée par poste.',
        'Profils expérimentés, réseau étendu, quelques talents rares.',
        'Les meilleurs profils du marché, souvent des talents exceptionnels.'],
  cost:[0,6000,45000,350000], tier:[0,1,2,3], pool:[6,9,12,16], bonus:[-0.04,0.02,0.09,0.17],
  feeDays:[3,5,7,9], refresh:[80,250,900,4000]
};
function agencyInit(){ if(!S.agency) S.agency={lvl:0,pool:[],day:0,hired:0}; return S.agency; }
function entKey(e){ return e.kind==='bank'?'bank':'b'+e.id; }
function entByKey(key){ return key==='bank'? S.bank.ent : S.biz.find(b=>'b'+b.id===key); }
function entLabel(e){ return e.kind==='bank'? 'Votre banque' : e.name; }
function agencyEnts(){ const L=S.biz.slice(); if(S.bank.lic) L.push(S.bank.ent); return L; }
function agencyVacancies(){
  const out=[];
  agencyEnts().forEach(e=>entRoles(e).forEach(([r,slots])=>{
    const n=(e.staff[r]&&e.staff[r].n)||0; if(n<slots) out.push({key:entKey(e),e,role:r,free:slots-n,slots});
  }));
  return out;
}
function agencyCand(role,bonus){
  const rb=(S.rep-50)/400, A=agencyInit();
  let prod=1+0.22*norm()+rb+bonus+0.015*staffingLevel(); if(A.lvl>=3 && rnd()<0.15) prod+=0.2;
  prod=clamp(prod,0.6,1.7);
  return {id:S.nid++, role, name:pick(D.FN)+' '+pick(D.LN), prod:Math.round(prod*100)/100,
    rel:Math.round(clamp(0.82+0.12*norm()+bonus*0.5,0.5,1)*100)/100, loy:Math.round(clamp(62+12*norm(),35,88)), day:S.day};
}
function agencyGen(){
  const A=agencyInit(), n=AG.pool[A.lvl]+staffingLevel(), vac=agencyVacancies(), ents=agencyEnts();
  const want=[]; vac.forEach(v=>{ for(let i=0;i<Math.min(v.free,3);i++) want.push(v.role); });
  const all=[]; ents.forEach(e=>entRoles(e).forEach(r=>all.push(r[0])));
  A.pool=[]; A.day=S.day;
  if(!all.length) return;
  for(let i=0;i<n;i++) A.pool.push(agencyCand((want.length&&rnd()<0.75)? pick(want) : pick(all), AG.bonus[A.lvl]));
}
function agencyStep(){
  const A=agencyInit();
  /* V1.4.8 : nouveau vivier chaque jour */
  if(S.day>A.day || (!A.pool.length && agencyEnts().length && S.day>A.day)) agencyGen();
}
function agencyWage(e,role,c){ return wageOf(e,role,{prod:c.prod}); }
function agencyFee(e,role,c){ return Math.max(15,AG.feeDays[agencyInit().lvl]*agencyWage(e,role,c)*(1-0.08*staffingLevel())); }
function agencyHire(candId,key){
  const A=agencyInit(), c=A.pool.find(x=>x.id===candId); if(!c) return err('Ce candidat n’est plus disponible.');
  const e=entByKey(key); if(!e) return err('Société introuvable.');
  const slot=entRoles(e).find(x=>x[0]===c.role); if(!slot) return err('Cette entité n’a pas ce poste.');
  const coh=e.staff[c.role]||(e.staff[c.role]={n:0,prod:1,rel:.85,loy:60});
  if(coh.n>=slot[1]) return err('Tous les postes de ce type sont pourvus.');
  const fee=agencyFee(e,c.role,c); if((e.kind==='bank'? S.cash : availFor(cityOf(e).ccy))<fee) return err('Trésorerie insuffisante : frais d’agence de '+eur(fee,0)+'.');
  pay(e.kind==='bank'?'bank':'b:'+e.id,'Agence de recrutement : '+D.ROLES[c.role].s,-fee);
  const n=coh.n;
  coh.prod=(coh.prod*n+c.prod)/(n+1); coh.rel=(coh.rel*n+c.rel)/(n+1); coh.loy=(coh.loy*n+c.loy)/(n+1); coh.n=n+1;
  A.pool=A.pool.filter(x=>x!==c); A.hired++; S.stats.hires++; S.rep=clamp(S.rep+0.05,0,100);
  return ok(c.name+' rejoint '+entLabel(e)+' (frais d’agence '+eur(fee,0)+').');
}
function agencyUpgrade(){
  const A=agencyInit(), nx=A.lvl+1; if(nx>=AG.names.length) return err('Niveau maximal atteint.');
  if(!unlocked(AG.tier[nx])) return err('Palier de richesse insuffisant ('+D.TIERS[AG.tier[nx]].n+').');
  if(S.cash<AG.cost[nx]) return err('Trésorerie insuffisante : '+eur(AG.cost[nx],0)+' requis.');
  payCap('gen','Agence de recrutement : '+AG.names[nx],-AG.cost[nx]); A.lvl=nx; agencyGen();
  log('good','Votre agence passe au niveau « '+AG.names[nx]+' ».');
  return ok();
}
function agencyRefresh(){
  const A=agencyInit(), c=AG.refresh[A.lvl]; if(!agencyEnts().length) return err('Lancez d’abord une société.');
  if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('gen','Agence de recrutement : nouveau vivier',-c); agencyGen(); return ok();
}
function agencySearchCost(role){
  const v=agencyEnts().find(e=>entRoles(e).some(r=>r[0]===role)); if(!v) return 0;
  return Math.max(60,10*wageOf(v,role,{prod:1}));
}
function agencySearch(role){
  const A=agencyInit(); if(A.lvl<1) return err('Recherche ciblée à partir du cabinet de recrutement.');
  const c=agencySearchCost(role); if(!c) return err('Poste inconnu.');
  if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('gen','Agence de recrutement : recherche ciblée',-c);
  for(let i=0;i<4;i++) A.pool.unshift(agencyCand(role,AG.bonus[A.lvl]+0.08));
  return ok('4 nouveaux profils « '+D.ROLES[role].s+' ».');
}

