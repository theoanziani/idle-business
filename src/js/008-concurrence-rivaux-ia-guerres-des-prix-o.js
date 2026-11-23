/* ============================================================
   CONCURRENCE : rivaux IA, guerres des prix, offres de rachat, débauchage
   ============================================================ */
D.RIVALS=[
  {id:'delmas',  n:'Groupe Delmas',   st:'Généraliste du commerce',  ag:2, sec:['commerce','restauration','bureaux'], city:['paris','barcelone','miami']},
  {id:'valcourt',n:'Maison Valcourt', st:'Luxe et hôtellerie',       ag:1, sec:['luxe','hotel'],                      city:['paris','miami','rio']},
  {id:'nova',    n:'Nova Digital',    st:'Technologies et médias',   ag:3, sec:['tech','online','media'],             city:['paris','pekin','miami']},
  {id:'atlas',   n:'Orion Industries',st:'Industrie et agroalimentaire',ag:2,sec:['industrie','agri'],                 city:['zagreb','pekin','rio']},
  {id:'costa',   n:'Costa Loisirs',   st:'Loisirs et restauration',  ag:2, sec:['loisirs','hotel','restauration'],    city:['barcelone','rio','miami']},
  {id:'meridian',n:'Meridian Immobilier',st:'Immobilier et bureaux', ag:1, sec:['immo','bureaux'],                    city:['paris','zagreb','pekin']}
];
const rivAlive = () => { const R=S&&S.riv; const a=D.RIVALS.filter(r=>!(R&&R.rv[r.id]&&R.rv[r.id].gone)); return a.length? a : D.RIVALS; };
const rivDef = id => D.RIVALS.find(r=>r.id===id);
const rivKey = b => b.city+'|'+bizSec(b.def);
const keyLabel = k => { const [c,s]=k.split('|'); return (D.CITIES[c]||{n:c}).n+' · '+(D.SECT[s]||{n:s}).n; };
function rivInit(){
  if(S.riv) return S.riv;
  const R={rv:{},wars:[],offers:[],deals:[],talents:[],nid:1,tday:0};
  D.RIVALS.forEach(r=>{ const pres={}; r.sec.forEach(sc=>r.city.forEach(c=>{ if(rnd()<.8) pres[c+'|'+sc]=Math.round((.4+.6*rnd())*100)/100; }));
    R.rv[r.id]={pow:Math.round((.8+.6*rnd())*100)/100,pres,wars:0,poached:0,bought:0,lost:0}; });
  S.riv=R; return R;
}
function intensity(key){ const R=rivInit(); if(ncOn(key)) return 0; let t=0; D.RIVALS.forEach(r=>{ const v=R.rv[r.id]; t+=v.pow*(v.pres[key]||0); }); return clamp(t/2.5,0,1); }
const intLabel = i => i<.2?'Faible':i<.45?'Modérée':i<.7?'Forte':'Très forte';
function warsFor(b){ return rivInit().wars.filter(w=>w.key===rivKey(b)); }
function warM(b){ let m=1; warsFor(b).forEach(w=>{ m*= w.resp==='match'? 1-0.05*w.sev : w.resp==='camp'? 1-0.07*w.sev : 1-0.16*w.sev; }); return m; }
const warRev = b => (warsFor(b).some(w=>w.resp==='match')? 0.9 : 1)*attRev(b);   /* V2.0.7 : vos propres guerres des prix */
const warCost = b => warsFor(b).some(w=>w.resp==='camp')? 0.02 : 0;
function compM(b){ return clamp(1-0.3*(intensity(rivKey(b))-0.3),.85,1.1)*warM(b)*attVol(b); }

function rivStep(){
  const R=rivInit(), dm=S.dm||1, day=S.day;
  /* fin des guerres, expiration des offres */
  R.wars=R.wars.filter(w=>{ w.left--; if(w.left>0) return true; log('info','La guerre des prix prend fin : '+keyLabel(w.key)+'.'); return false; });
  R.offers=R.offers.filter(o=>o.exp>=day&&S.biz.some(b=>b.id===o.b));
  R.deals=R.deals.filter(x=>x.exp>=day);
  const act=S.biz.filter(b=>b.status==='active');
  /* nouvelles guerres des prix */
  new Set(act.map(rivKey)).forEach(key=>{
    const I=intensity(key); if(I<.15||R.wars.some(w=>w.key===key)) return;
    const cand=D.RIVALS.filter(r=>(R.rv[r.id].pres[key]||0)>0); if(!cand.length) return;
    const r=wpick(cand,x=>x.ag*R.rv[x.id].pres[key]);
    if(rnd()<0.005*r.ag*I*dm){
      const w={id:R.nid++,key,rival:r.id,left:rint(10,24),sev:Math.round((.6+.8*rnd())*10)/10,resp:'hold'};
      R.wars.push(w); R.rv[r.id].wars++; R.rv[r.id].pow=Math.max(.4,R.rv[r.id].pow*.985);
      log('warn',r.n+' casse les prix : '+keyLabel(key)+', pendant '+w.left+' jours. Vos ventes baissent. Choisissez une riposte dans Rivaux.');
    }
  });
  /* débauchage des employés par les rivaux */
  act.forEach(b=>{
    if(!headcount(b)||ncOn(rivKey(b))) return; const key=rivKey(b), cand=D.RIVALS.filter(r=>R.rv[r.id].pres[key]); if(!cand.length) return;
    const ag=cand.reduce((a,r)=>a+r.ag,0)/cand.length;
    const p=0.004*ag*(1-clamp(avgLoy(b),0,100)/100)*Math.pow(clamp(2-b.pol,.6,1.2),2)*dm*Math.pow(.8,hrLvl());
    if(rnd()<p){
      const roles=Object.keys(b.staff).filter(r=>b.staff[r].n>0); if(!roles.length) return;
      const r=pick(roles), k=Math.min(b.staff[r].n,rint(1,2)), riv=wpick(cand,x=>x.ag);
      b.staff[r].n-=k; if(b.staff[r].n<=0) delete b.staff[r]; R.rv[riv.id].poached+=k;
      log('warn',riv.n+' débauche '+plu(k,'employé')+' de « '+b.name+' » ('+D.ROLES[r].s+'). Un meilleur salaire et un service RH limitent ces départs.');
    }
  });
  /* tous les 30 jours : évolution des rivaux et offres */
  if(day-R.tday>=30){
    R.tday=day; if(typeof shopsSync==='function') shopsSync();
    D.RIVALS.forEach(r=>{ const v=R.rv[r.id]; if(v.gone) return; v.pow=clamp(v.pow*(1+.012+.03*norm()+.02*(S.macro.econ-1)),.5,2.6);
      const keys=Object.keys(v.pres);
      if(v.pow<.7&&keys.length>2&&rnd()<.3){ const k=keys.sort((a,b)=>v.pres[a]-v.pres[b])[0]; delete v.pres[k]; }
      const mine=[...new Set(act.map(rivKey))].filter(k=>!ncOn(k)&&!v.pres[k]&&r.sec.includes(k.split('|')[1]));
      if(mine.length&&rnd()<.25*dm){ const k=pick(mine); v.pres[k]=.4; log('info',r.n+' s’implante : '+keyLabel(k)+'. La concurrence augmente.'); }
    });
    if(R.offers.length<2) act.filter(b=>S.day-(b.liveDay||0)>60&&bizValue(b)>0).forEach(b=>{
      if(R.offers.length>=2||R.offers.some(o=>o.b===b.id)||rnd()>.06) return;
      const r=pick(rivAlive()), price=Math.round(sellPrice(b)*(1.1+.4*rnd()));
      R.offers.push({id:R.nid++,b:b.id,rival:r.id,price,exp:day+10});
      log('info',r.n+' propose de racheter « '+b.name+' » pour '+eur(price,0)+' (offre valable 10 jours).');
    });
  }
  /* commerces à racheter chez les concurrents */
  if(day%20===0&&R.deals.length<3){
    const cities=D.CITY_ORDER.filter(cityUnlocked), defs=D.bizOrder.filter(i=>!D.biz[i].startup&&unlocked(D.biz[i].tier));
    if(cities.length&&defs.length){
      const c=pick(cities), C=D.CITIES[c], def=pick(defs), dd=pick(C.d), lvl=rint(1,Math.min(4,1+tierNow())), rv=pick(rivAlive());
      const price=Math.round(bizInvested({def,lvl})*locCostF(def,c,dd.id)*(1.1+.2*rnd()));
      R.deals.push({id:R.nid++,def,city:c,dist:dd.id,lvl,price,rival:rv.id,exp:day+25});
      log('info',rv.n+' cède un commerce : '+D.biz[def].n+' (niveau '+lvl+') à '+C.n+', '+dd.n+'. Voir Rivaux.');
    }
  }
  /* talents à débaucher */
  if(wdOf(day)===0){
    R.talents=[]; const roles=[...new Set(act.flatMap(b=>entRoles(b).map(r=>r[0])))];
    if(roles.length) for(let i=0;i<4;i++){ const role=pick(roles), rv=pick(rivAlive());
      R.talents.push({id:R.nid++,role,rival:rv.id,name:pick(D.FN)+' '+pick(D.LN),prod:Math.round((1.25+.3*rnd())*100)/100,rel:.92,loy:58}); }
  }
}
/* Actions */
function respondWar(id,resp){ const w=rivInit().wars.find(x=>x.id===id); if(!w) return err('Cette guerre des prix est terminée.'); if(!['hold','match','camp'].includes(resp)) return err('Riposte inconnue.'); w.resp=resp; return ok(); }
function acceptOffer(id){
  const R=rivInit(), o=R.offers.find(x=>x.id===id); if(!o) return err('Offre expirée.');
  const b=S.biz.find(x=>x.id===o.b); if(!b) return err('Société introuvable.');
  const rv=R.rv[o.rival]; R.offers=R.offers.filter(x=>x!==o); rv.bought++; rv.pow+=.06; rv.pres[rivKey(b)]=Math.max(rv.pres[rivKey(b)]||0,.6);
  closeBiz(b,o.price,rivDef(o.rival).n); return ok();
}
function refuseOffer(id){ const R=rivInit(); R.offers=R.offers.filter(x=>x.id!==id); return ok(); }
function buyDeal(id){
  const R=rivInit(), x=R.deals.find(d=>d.id===id); if(!x) return err('Offre expirée.');
  const C=D.CITIES[x.city]; if(availFor(C.ccy)<x.price) return err('Trésorerie insuffisante : '+eur(x.price,0)+' requis.');
  const base=D.biz[x.def].cost*locCostF(x.def,x.city,x.dist);
  const r=launchBiz(x.def,0,x.city,x.dist); if(!r.ok) return r;
  const b=S.biz[S.biz.length-1];
  payCap('b:'+b.id,'Rachat à '+rivDef(x.rival).n+' (solde)',base-x.price); settleAccounts();
  b.lvl=x.lvl; b.status='active'; b.liveDay=S.day+1; b.inv$=x.price; startCrew(b,.75); b.name=D.biz[x.def].n+(bizCount(x.def)>1?' n°'+bizCount(x.def):'');
  const rv=R.rv[x.rival], k=x.city+'|'+bizSec(x.def); if(rv.pres[k]) rv.pres[k]*=.8; rv.pow=Math.max(.4,rv.pow-.04); rv.lost++;
  R.deals=R.deals.filter(d=>d!==x); log('good','Vous rachetez « '+b.name+' » à '+rivDef(x.rival).n+' : '+C.n+', '+distOf(b).n+'.'); return ok();
}
function talentCost(e,t){ return 14*wageOf(e,t.role,{prod:t.prod}); }
function hireTalent(id,key){
  const R=rivInit(), t=R.talents.find(x=>x.id===id); if(!t) return err('Ce talent n’est plus disponible.');
  const e=entByKey(key); if(!e) return err('Société introuvable.');
  const slot=entRoles(e).find(x=>x[0]===t.role); if(!slot) return err('Ce poste n’existe pas ici.');
  const coh=e.staff[t.role]||(e.staff[t.role]={n:0,prod:1,rel:.85,loy:60});
  if(coh.n>=slot[1]) return err('Tous les postes de ce type sont pourvus.');
  const c=talentCost(e,t); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay(e.kind==='bank'?'bank':'b:'+e.id,'Débauchage chez '+rivDef(t.rival).n,-c);
  const n=coh.n; coh.prod=(coh.prod*n+t.prod)/(n+1); coh.rel=(coh.rel*n+t.rel)/(n+1); coh.loy=(coh.loy*n+t.loy)/(n+1); coh.n=n+1;
  R.talents=R.talents.filter(x=>x!==t); const rv=R.rv[t.rival]; rv.pow=Math.max(.4,rv.pow-.02); rv.lost++; S.stats.hires++;
  return ok(t.name+' quitte '+rivDef(t.rival).n+' pour '+entLabel(e)+' (prime '+eur(c,0)+').');
}

/* Contrats de non-concurrence : les rivaux ne peuvent plus vous concurrencer sur ce marché pendant 90 jours */
const ncOn = key => { const R=S.riv; return !!(R&&R.nc&&R.nc[key]>=S.day); };
function ncPrice(key){ let r=0; S.biz.forEach(b=>{ if(b.status==='active'&&rivKey(b)===key) r+=bizBase(b).R0; }); const R=rivInit(); let I=0; D.RIVALS.forEach(x=>{ const v=R.rv[x.id]; I+=v.pow*(v.pres[key]||0); }); return Math.max(5000,Math.round(r*25*clamp(I,.3,3)/100)*100); }
function buyNC(key){
  const R=rivInit(); if(ncOn(key)) return err('Un contrat est déjà en cours sur ce marché.');
  if(!S.biz.some(b=>b.status==='active'&&rivKey(b)===key)) return err('Vous n’avez pas d’activité sur ce marché.');
  const c=ncPrice(key); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('gen','Contrat de non-concurrence : '+keyLabel(key),-c); R.nc=R.nc||{}; R.nc[key]=S.day+90; R.wars=R.wars.filter(w=>w.key!==key);
  log('good','Contrat de non-concurrence signé : '+keyLabel(key)+' pendant 90 jours.'); return ok();
}
const cityVisible = id => !D.CITIES[id].parent || cityUnlocked(id);

