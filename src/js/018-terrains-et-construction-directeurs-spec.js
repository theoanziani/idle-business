/* ============================================================
   TERRAINS ET CONSTRUCTION, DIRECTEURS SPÉCIALISÉS, DIRECTEURS DE SITE NOMMÉS
   ============================================================ */

/* ---------- Construction sur un terrain possédé ---------- */
D.BT.home={n:'Résidence de prestige', s:[500,8000], rk:1.1};
D.PLANS={
  depot:{n:'Entrepôt et usine', t:'depot', m2:900, days:50, surf:l=>Math.min(12000,Math.round(l*.6/10)*10), txt:'Accueille usines, entrepôts, data centers.'},
  tower:{n:'Immeuble de bureaux', t:'tower', m2:2800, days:150, surf:l=>Math.min(20000,Math.round(l*1.2/10)*10), txt:'Accueille bureaux, sièges, start-ups.'},
  villa:{n:'Villa de prestige', t:'home', m2:4500, days:90, surf:()=>600, pr:6, txt:'Se loue à des particuliers fortunés ou se garde pour le prestige.'},
  manoir:{n:'Manoir', t:'home', m2:5000, days:140, surf:()=>1500, pr:12, txt:'Grand domaine, loyers élevés, prestige important.'},
  residence:{n:'Résidence de luxe (appartements)', t:'home', m2:4000, days:160, surf:l=>Math.min(9000,Math.round(l*.5/10)*10), pr:18, txt:'Immeuble d’appartements haut de gamme loués à l’année.'}
};
const buildF = cid => { const C=D.CITIES[cid]; return (0.45+0.55*C.wageM)*(1-0.04*Math.min(5,buildCoLevel())); };
function planCost(bd,k){ const P=D.PLANS[k]; return Math.round(P.surf(bd.surf)*P.m2*buildF(bd.city)/1000)*1000; }
const planDays = k => Math.ceil(D.PLANS[k].days*(buildCoLevel()?0.75:1));
const consOf = id => (S.cons||[]).find(c=>c.id===id);
function startBuild2(id,k){
  const bd=bldById(id), h=bldHeld(id), P=D.PLANS[k]; if(!bd||!P) return err('Plan inconnu.');
  if(bd.t!=='land') return err('Il faut un terrain constructible.');
  if(!h||h.st!=='own') return err('Achetez d’abord le terrain.');
  if(consOf(id)) return err('Un chantier est déjà en cours.');
  if(h.biz&&S.biz.some(b=>b.id===h.biz)) return err('Une société occupe ce terrain.');
  const c=planCost(bd,k); if(availFor(D.CITIES[bd.city].ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  payCap('c:'+bd.city,'Chantier : '+P.n+', '+bd.addr,-c); settleAccounts();
  (S.cons=S.cons||[]).push({id,k,cost:c,end:S.day+planDays(k),start:S.day});
  log('info','Chantier lancé : '+P.n+' au '+bd.addr+' ('+D.CITIES[bd.city].n+'), livraison dans '+planDays(k)+' jours.');
  return ok();
}
function consStep(){
  if(S.cons&&S.cons.length) S.cons=S.cons.filter(c=>{ if(S.day<c.end) return true;
    const P=D.PLANS[c.k], bd=bldById(c.id), h=S.bld[c.id]; if(!bd||!h) return false;
    (S.bldMod=S.bldMod||{})[c.id]={t:P.t, surf:P.surf(bd.surf), q:1.15, plan:c.k};
    h.cost+=c.cost*1.15*h.h0/S.macro.house;
    log('good','Chantier terminé : '+P.n+' au '+bd.addr+'.'+(P.t==='home'?' Mettez-le en location ou gardez-le pour le prestige.':' Vous pouvez y établir une société.'));
    return false; });
  /* Résidences : loyers ou prestige */
  if(S.bldMod) Object.keys(S.bldMod).forEach(id=>{ const m=S.bldMod[id], h=S.bld&&S.bld[id]; if(!h||m.t!=='home') return; const P=D.PLANS[m.plan];
    if(h.lease) pay('c:'+((bldById(id)||{}).city||'paris'),'Loyers : '+P.n,bldValue(id)*0.045/360,'cap'); S.prestige=(S.prestige||0)+(h.lease?P.pr/2:P.pr); });
}
function setLease(id,v){ const h=bldHeld(id), m=S.bldMod&&S.bldMod[id]; if(!h||!m||m.t!=='home') return err('Ce bien ne se loue pas.'); h.lease=!!v; return ok(v?'Résidence mise en location.':'Location arrêtée.'); }

/* ---------- Directeurs spécialisés ---------- */
D.MGR={
  ceo:{n:'Directeur général', hire:50000, day:600, txt:'Réduit de 4 % les salaires et les frais fixes de toutes vos sociétés, et ajuste chaque semaine les prix et le marketing des commerces classiques.'},
  prop:{n:'Gestionnaire immobilier', hire:20000, day:250, txt:'Négocie vos loyers (−5 %) et résilie les baux des locaux vides depuis 10 jours.'},
  cont:{n:'Responsable des contrats', hire:15000, day:200, txt:'Accepte seul les contrats que vos usines peuvent livrer à temps, une fois servies vos propres sociétés et les contrats déjà signés.'},
  fin:{n:'Directeur financier', hire:30000, day:350, txt:'Chaque lundi, rembourse vos emprunts les plus chers puis place sur le livret la trésorerie qui dépasse un mois de dépenses (réglable dans Épargne automatique) ; reprend sur le livret si la trésorerie baisse trop.'},
  del:{n:'Service de livraison', hire:8000, day:120, txt:'Marchandises livrées le jour même dans vos boutiques, expéditions nationales plus rapides et 30 % moins chères.'}
};
const mgrOn = k => !!(S.mgr&&S.mgr[k]);
function setMgr(k,v){ const M=D.MGR[k]; if(!M) return err('Poste inconnu.'); S.mgr=S.mgr||{};
  if(v&&!S.mgr[k]){ if(S.cash<M.hire) return err('Trésorerie insuffisante : '+eur(M.hire,0)+'.'); payCap('gen','Recrutement : '+M.n,-M.hire); S.mgr[k]=true; log('good',M.n+' recruté.'); }
  else if(!v) S.mgr[k]=false; return ok(); }
function mgrStep(){
  if(!S.mgr) return;
  Object.keys(D.MGR).forEach(k=>{ if(S.mgr[k]&&S.biz.length) pay('gen',D.MGR[k].n,-D.MGR[k].day*progMult()); });
  /* Directeur général : petite optimisation hebdomadaire du prix */
  if(S.mgr.ceo&&wdOf(S.day)===0) S.biz.forEach(b=>{ if(b.status!=='active'||isFact(b)||b.hist.length<14) return;
    const w1=b.hist.slice(-7).reduce((a,x)=>a+x,0), w0=b.hist.slice(-14,-7).reduce((a,x)=>a+x,0);
    if(b.ceoDir===undefined) b.ceoDir=1; if(w1<w0) b.ceoDir=-b.ceoDir;
    setPrice(b,Math.round((b.price+0.05*b.ceoDir)*100)/100); if(w1>0&&b.mkt===0) setMkt(b,1); });
  /* Gestionnaire immobilier : résiliation des baux vides */
  if(S.mgr.prop&&S.bld) Object.keys(S.bld).forEach(id=>{ const h=S.bld[id]; if(h.st!=='rent') return; const used=h.biz&&S.biz.some(b=>b.id===h.biz);
    h.vac=used?0:(h.vac||0)+1; if(h.vac>=10){ const bd=bldById(id); leaveBuilding(id); log('info','Gestionnaire immobilier : bail résilié pour le local vide du '+(bd?bd.addr:'')+'.'); } });
  /* Directeur financier (V1.6.5) */
  if(S.mgr.fin&&wdOf(S.day)===0) finStep();
  /* Responsable des contrats */
  /* V2.4.8 : il ne compte que la production restante : stock à la bonne qualité + production à venir, moins
     ce que vos usines livrent à vos sociétés et moins les contrats déjà signés sur ce produit */
  if(S.mgr.cont&&S.ind) S.ind.offers.slice().sort((a,b)=>b.px/(D.PRODS[b.p]||{v:1}).v-a.px/(D.PRODS[a.p]||{v:1}).v).forEach(o=>{ if(S.ind.active.length>=5||!o.p) return;
    const F=contFree(o.p,o.qm||0,o.due-S.day-9);
    if(F.free>=o.qty*1.1){ const r=acceptContract(o.id); if(r.ok) log('info','Responsable des contrats : contrat accepté avec '+o.client+' (après vos sociétés, il reste '+fmtN(Math.round(F.free))+' '+D.PRODS[o.p].u+' disponibles d’ici l’échéance).'); } });
}

function finBuf(){ let e=0; S.biz.forEach(b=>{ if(b.status==='active'&&b.last) e+=Math.max(0,b.last.rev-b.last.net); }); return Math.max(20000*progMult(),e*30); }
function finStep(){ const buf=finBuf(); let ex=S.cash-buf, rp=0, dp=0;
  S.debts.slice().sort((a,b)=>b.r-a.r).forEach(d=>{ if(ex<=1) return; const a=Math.min(ex,d.p); if(repay(d.id,a).ok){ ex-=a; rp+=a; } });
  /* V2.3.4 : le placement de l'excédent sur le livret se coupe (S.finLiv=0) ; remboursements et reprises continuent */
  if(ex>1&&!S.debts.length&&S.finLiv!==0&&livretMove(Math.floor(ex)).ok) dp=Math.floor(ex);
  if(S.cash<buf*.5&&S.livret.bal>0){ const w=Math.min(S.livret.bal,buf-S.cash); livretMove(-w); log('info','Directeur financier : '+eur(w,0)+' repris sur le livret.'); }
  if(rp>0) log('info','Directeur financier : '+eur(rp,0)+' d’emprunts remboursés.'); if(dp>=1000*progMult()) log('info','Directeur financier : '+eur(dp,0)+' placés sur le livret.'); }

/* ---------- Directeurs de site nommés ---------- */
const BTT={pru:{n:'Prudent',d:'incidents −15 %'},com:{n:'Commercial',d:'ventes +2 %'},ges:{n:'Gestionnaire',d:'fatigue −10 %'}};
const bossTT = x => BTT[x.tt]? BTT[x.tt].n+' ('+BTT[x.tt].d+')' : '';
const BOSSF=['Camille','Julien','Sarah','Mehdi','Laura','Thomas','Amina','Nicolas','Chloé','Yanis','Emma','Lucas','Jade','Rayan','Manon','Hugo'];
const BOSSL=['Bernard','Petit','Robert','Richard','Durand','Leroy','Moreau','Simon','Laurent','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier'];
const SKN={ges:'Gestion',ven:'Vente',rig:'Rigueur'};
function bossBase(b){ return bizBase(b).R0*0.05*progMult(); }
function genBoss(b,bonus){ const sk={}; Object.keys(SKN).forEach(k=>{ sk[k]=clamp(Math.round(5+1.6*norm()+(bonus||0)),1,10); });
  const avg=(sk.ges+sk.ven+sk.rig)/3; return {name:pick(BOSSF)+' '+pick(BOSSL), sk, tt:pick(Object.keys(BTT)), xd:S.day, mood:65, sal:bossBase(b)*(0.6+0.08*avg), since:S.day, tr:-99}; }
const bossAvg = x => (x.sk.ges+x.sk.ven+x.sk.rig)/3;
const bossSales = b => b.boss===undefined? 1 : b.boss? 1+0.015*(b.boss.sk.ven-5)+(b.boss.tt==='com'?.02:0) : 0.96;
const bossRisk = b => b.boss? clamp(1-0.06*(b.boss.sk.rig-5),.6,1.4)*(b.boss.tt==='pru'?.85:1) : 1.1;
const bossFat = b => b.boss? clamp(1-0.04*(b.boss.sk.ges-5),.7,1.3)*(b.boss.tt==='ges'?.9:1) : 1.1;
const bossExtra = b => b.boss? Math.max(0,b.boss.sal-bossBase(b)*(0.6+0.08*5)) : 0;
function bossStep(){
  S.biz.forEach(b=>{ if(b.status!=='active') return;
    if(b.boss===undefined){ b.boss=genBoss(b); return; }
    const x=b.boss; if(!x) return;
    if(!x.tt) x.tt=Object.keys(BTT)[(x.name.length+b.id)%3]; if(x.xd===undefined) x.xd=Math.max(x.since,S.day-60);
    /* expérience : tous les 120 jours en poste, sa compétence la plus faible progresse d’un point */
    if(S.day-x.xd>=120){ x.xd=S.day; const k=Object.keys(SKN).sort((p,q)=>x.sk[p]-x.sk[q])[0]; if(x.sk[k]<10){ x.sk[k]++; x.sal*=1.04; log('good',x.name+' gagne en expérience à la tête de « '+b.name+' » : '+SKN[k].toLowerCase()+' '+x.sk[k]+'/10.'); } }
    const tgt=55+20*(x.sal/(bossBase(b)*(0.6+0.08*bossAvg(x)))-1)*3-(b.fat||0)*.3+(hrLvl()*3)+(b.hc?5:0);
    x.mood=clamp(x.mood+(tgt-x.mood)*0.03,0,100);
    /* V1.8.8 : alerte avant le départ */
    if(x.mood<35&&!x.mw){ x.mw=1; log('warn',x.name+', directeur de « '+b.name+' », a le moral en berne ('+Math.round(x.mood)+') et pourrait partir : augmentez-le ou activez les augmentations du service RH.'); } else if(x.mood>45) x.mw=0;
    if(x.mood<45&&intensity(rivKey(b))>0&&rnd()<0.003*(S.dm||1)){ const r=pick(rivAlive()); b.boss=null; log('bad',r.n+' débauche '+x.name+', directeur de « '+b.name+' ». Recrutez un remplaçant dans la fiche de la société.'); }
    else if(x.mood<20&&rnd()<0.01){ b.boss=null; log('warn',x.name+' démissionne de la direction de « '+b.name+' » (moral au plus bas).'); }
    /* V1.8.6 : société déléguée sans directeur : le meilleur candidat abordable est recruté aussitôt, la délégation continue */
    if(!b.boss&&b.dl&&b.dl!=='me'){ const C=bossCands(b).map((c,i)=>({c,i})).filter(o=>bizCanPay(b,o.c.sal*10)).sort((p,q)=>bossAvg(q.c)-bossAvg(p.c))[0];
      if(C&&hireBoss(b,C.i).ok) log('info','« '+b.name+' » : '+b.boss.name+' reprend la direction, la délégation continue.'); }
  });
}
function bossCands(b){ if(!b.bc||b.bcDay!==S.day){ b.bc=[genBoss(b,-.5),genBoss(b,.6),genBoss(b,1.6)]; b.bcDay=S.day; } return b.bc; }
function hireBoss(b,i){ const c=bossCands(b)[i]; if(!c) return err('Candidat introuvable.'); const fee=c.sal*10; if(!bizCanPay(b,fee)) return err('Trésorerie insuffisante : '+eur(fee,0)+' de frais de recrutement.');
  if(b.boss){ pay('b:'+b.id,'Indemnités : '+b.boss.name,-b.boss.sal*20); }
  pay('b:'+b.id,'Recrutement du directeur de site',-fee); b.boss=Object.assign({},c,{since:S.day}); b.bc=null; return ok(c.name+' prend la direction de « '+b.name+' ».'); }
function trainBoss(b,k){ const x=b.boss; if(!x) return err('Aucun directeur.'); if(S.day-x.tr<30) return err('Prochaine formation dans '+(30-(S.day-x.tr))+' jours.'); if(x.sk[k]>=10) return err('Compétence au maximum.');
  const c=x.sal*12*x.sk[k]/5; if(!bizCanPay(b,c)) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); pay('b:'+b.id,'Formation : '+x.name,-c); x.sk[k]++; x.tr=S.day; x.mood=clamp(x.mood+5,0,100); return ok(x.name+' progresse en '+SKN[k].toLowerCase()+' ('+x.sk[k]+'/10).'); }
function raiseBoss(b){ const x=b.boss; if(!x) return err('Aucun directeur.'); x.sal*=1.15; x.mood=clamp(x.mood+20,0,100); return ok('Salaire de '+x.name+' augmenté de 15 %.'); }

