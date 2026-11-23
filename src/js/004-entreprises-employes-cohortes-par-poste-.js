/* ============================================================
   ENTREPRISES, EMPLOYÉS (cohortes par poste), CALCULS D'EXPLOITATION
   ============================================================ */
const MAXLVL = 8, SAT = 0.93;
const baseCache = {};

function bizDef(b){ return D.biz[b.def]; }
function bizInvested(b){ return bizDef(b).cost*(Math.pow(2.5,b.lvl)-1)/1.5; }
function bizBase(b){
  const k=b.def+':'+b.lvl; if(baseCache[k]) return baseCache[k];
  const d=bizDef(b), L=b.lvl, inv=bizInvested(b)*(d.cost0? d.cost0/d.cost : 1), pb=d.payback*Math.pow(1.12,L-1), net=inv/pb;   /* recettes calculées sur le prix de référence */
  const sm=Math.pow(1.5,L-1), wm=Math.pow(1.1,L-1);
  let W=0; d.roles.forEach(([r,n,w])=>{ W+=Math.max(1,Math.round(n*sm))*w*wm; });
  const up=inv*0.0004, al=d.open==='always', sh=D.SECT[bizSec(b.def)].rs;
  const R0=(net*7+up*7+W*(al?5+2*1.5:5))/((al?5+2*d.wkf:5)*(1-d.c)-7*sh);
  return baseCache[k]={inv,net,W,up,R0,pb,rent0:sh*R0};
}
/* Postes d'une entité (société ou banque) : [rôle, places, salaire de base] */
function entRoles(e){
  if(e.kind==='bank') return bankRoles();
  const d=bizDef(e), sm=Math.pow(1.5,e.lvl-1), wm=Math.pow(1.1,e.lvl-1);
  return d.roles.map(([r,n,w])=>[r,Math.max(1,Math.round(n*sm)),w*wm]);
}
const progMult = () => 1+0.03*tierNow();
function wageOf(e,role,coh){
  const r=entRoles(e).find(x=>x[0]===role); if(!r) return 0;
  return r[2]*(0.5+0.5*coh.prod)*e.pol*lawsAt(e.city).minWage*(1+0.06*lawsAt(e.city).labor)*progMult()*(e.city&&D.CITIES[e.city]? Math.pow(D.CITIES[e.city].wageM,.6) : 1);
}
function cohEff(coh){ return coh.prod*(0.8+0.2*coh.rel)*clamp(coh.loy/60,0.5,1.3); }
function headcount(e){ let n=0; Object.values(e.staff).forEach(c=>n+=c.n); return n; }
function staffFactor(e){
  const roles=entRoles(e); let num=0, den=0, mg=1;
  roles.forEach(([r,slots,w])=>{
    const c=e.staff[r];
    if(r==='manager'){ const f=c? Math.min(1,c.n/slots):0; mg=0.90+0.10*f*(c?c.prod:0); }
    else { den+=slots*w; if(c) num+=Math.min(c.n,slots)*w*cohEff(c); }
  });
  if(den===0) return mg;
  return (num/den)*mg;
}
function staffFill(e){ let n=0,d=0; entRoles(e).forEach(([r,slots])=>{ d+=slots; const c=e.staff[r]; if(c) n+=Math.min(c.n,slots); }); return d? n/d : 1; }
function wageBill(e,weekend){
  let t=0; entRoles(e).forEach(([r])=>{ const c=e.staff[r]; if(c&&c.n>0) t+=c.n*wageOf(e,r,c); });
  return t*(weekend?1.5:1);
}
function avgLoy(e){ let n=0,t=0; Object.values(e.staff).forEach(c=>{n+=c.n;t+=c.n*c.loy;}); return n? t/n : 60; }

/* Candidats */
function genCands(e,role){
  const out=[]; const bonus=(S.rep-50)/400;
  for(let i=0;i<3;i++){
    const prod=clamp(1+0.22*norm()+bonus,0.6,1.5);
    out.push({id:S.nid++, name:pick(D.FN)+' '+pick(D.LN), prod:Math.round(prod*100)/100, rel:Math.round(clamp(0.82+0.12*norm(),0.5,1)*100)/100, loy:Math.round(clamp(62+12*norm(),35,85))});
  }
  e.cands[role]=out; e.candDay=S.day; return out;
}
function hire(e,role,candId){
  const slot=entRoles(e).find(x=>x[0]===role); if(!slot) return err('Poste inconnu.');
  const coh=e.staff[role]||(e.staff[role]={n:0,prod:1,rel:.85,loy:60});
  if(coh.n>=slot[1]) return err('Tous les postes de ce type sont pourvus.');
  const c=candId? (e.cands[role]||[]).find(x=>x.id===candId) : {prod:1,rel:.85,loy:62};
  if(!c) return err('Candidat introuvable.');
  const n=coh.n;
  coh.prod=(coh.prod*n+c.prod)/(n+1); coh.rel=(coh.rel*n+c.rel)/(n+1); coh.loy=(coh.loy*n+c.loy)/(n+1); coh.n=n+1;
  if(candId) e.cands[role]=e.cands[role].filter(x=>x.id!==candId);
  S.stats.hires++; S.rep=clamp(S.rep+0.05,0,100);
  return ok();
}
function hireFill(e,role,count){
  const slot=entRoles(e).find(x=>x[0]===role); const coh=e.staff[role]||(e.staff[role]={n:0,prod:1,rel:.85,loy:60});
  const k=Math.min(count, slot[1]-coh.n); if(k<=0) return err('Rien à pourvoir.');
  const c={prod:1,rel:.85,loy:62}; const n=coh.n;
  coh.prod=(coh.prod*n+c.prod*k)/(n+k); coh.rel=(coh.rel*n+c.rel*k)/(n+k); coh.loy=(coh.loy*n+c.loy*k)/(n+k); coh.n=n+k;
  S.stats.hires+=k; S.rep=clamp(S.rep+0.02*k,0,100);
  return ok(k+' recrues (profil moyen).');
}
function fire(e,role,k){
  const coh=e.staff[role]; if(!coh||coh.n<=0) return err('Aucun employé à licencier.');
  k=Math.min(k,coh.n);
  const sev=k*wageOf(e,role,coh)*(lawsAt(e.city).labor?10:5);
  coh.n-=k; if(coh.n===0) delete e.staff[role];
  const src=e.kind==='bank'?'bank':'b:'+e.id;
  pay(src,'Indemnités de licenciement',-sev,'corp');
  S.rep=clamp(S.rep-0.4*k,0,100); S.stats.layoffs30+=k; S.gov.ten=clamp(S.gov.ten+0.4*k,0,100);
  return ok(k+' licenciement(s), indemnités '+eur(sev)+'.');
}
const ok = m => ({ok:true,msg:m||''});
const err = m => ({ok:false,msg:m});

/* Équipe de départ à la mise en service */
function startCrew(e,frac){
  entRoles(e).forEach(([r,slots])=>{ const k=Math.max(1,Math.ceil(slots*frac)); e.staff[r]={n:k,prod:clamp(1+0.05*norm(),.9,1.1),rel:.85,loy:65}; });
}

/* ---------- Création, amélioration, cession ---------- */
function launchCost(defId,inv,cityId,distId){ const d=D.biz[defId]; return d.cost*(d.startup? [1,1.6,3][inv||0] : 1)*locCostF(defId,cityId||'paris',distId); }
/* trésorerie propre à chaque devise : on paie dans la monnaie du pays (montant exprimé en euros) */
const availFor = cc => S.cash;
const bizCanPay = (b,amt) => availFor(cityOf(b).ccy)>=amt;
function startupOdds(defId,inv){
  const su=D.biz[defId].startup, add=[0,.07,.14][inv||0];
  /* V1.8.7 : risque d'échec réduit de 40 % (start-up : 28 % → 17 % ; deep-tech : 38 % → 23 %, sans option) */
  let pS=(su.pS+add)*(0.85+0.15*S.macro.econ), pF=Math.max(.04,su.pF*.6-add);
  pS=clamp(pS,.05,.8); return {pS, pF, pM:Math.max(0,1-pS-pF)};
}
function bizCount(defId){ return S.biz.filter(b=>b.def===defId).length; }
function launchBiz(defId,inv,cityId,distId,bldId,nameIn){
  const d=D.biz[defId]; if(!d) return err('Activité inconnue.');
  if(!unlocked(d.tier)) return err('Palier de richesse insuffisant.');
  let bd=null; if(bldId){ bd=bldById(bldId); const h=bd&&bldHeld(bldId); if(!h) return err('Louez ou achetez d’abord ce bâtiment.'); if(h.biz&&S.biz.some(x=>x.id===h.biz)) return err('Ce bâtiment est déjà occupé par une de vos sociétés.'); if(!bldMaxLvl(bd,defId)) return err('Ce bâtiment ne convient pas à cette activité.'); cityId=bd.city; distId=bd.dist; }
  cityId=cityId||'paris'; const C=D.CITIES[cityId]; if(!C) return err('Ville inconnue.');
  if(!cityUnlocked(cityId)) return err(C.parent? 'Ville verrouillée : achetez d’abord '+D.CITIES[C.parent].n+'.' : 'Ville verrouillée : valeur nette de '+eur(C.unlock,0)+' requise.');
  const dd=C.d.find(x=>x.id===distId)||C.d[C.d.length-1];
  const cost=launchCost(defId,inv,cityId,dd.id);
  if(availFor(C.ccy)<cost) return err('Trésorerie insuffisante : '+eur(cost)+' requis.');
  const n=bizCount(defId);
  const nm=nameIn? cleanBizName(nameIn) : '';
  const b={id:S.nid++, def:defId, name:(nm.length>=2? nm : d.n+(n? ' n°'+(n+1):'')), lvl:1, status:'build', t:d.launch, ph:0, phT:0, since:S.day, staff:{}, pol:1, price:1, mkt:0, wk:false,
    mods:[], hist:[], last:null, cands:{}, inv:inv||0, up:null, closedUntil:0, inv$:cost, cs:65, fat:0, stk:1, city:cityId, dist:dd.id, sec:0, ins:false, cf:locCostF(defId,cityId,dd.id)};
  if(bd){ b.bld=bldId; S.bld[bldId].biz=b.id; }
  if(d.startup){
    const o=startupOdds(defId,inv), r=rnd();
    b.out = r<o.pS?'S' : r<o.pS+o.pM?'M':'F';
    b.phT=d.startup.ph[0][1]; b.t=d.startup.ph.reduce((a,p)=>a+p[1],0);
  }
  S.biz.push(b);
  payCap('b:'+b.id,'Lancement : '+b.name,-cost); settleAccounts();
  S.rep=clamp(S.rep+0.5,0,100);
  log('info','Lancement de « '+b.name+' » à '+C.n+' ('+dd.n+') : mise en route en '+b.t+' jours.');
  return ok();
}
function bizPhase(b){ // phase de start-up en cours
  const su=bizDef(b).startup; if(!su) return null;
  const elapsed=(S.day-b.since); let acc=0;
  for(let i=0;i<su.ph.length;i++){ acc+=su.ph[i][1]; if(elapsed<acc) return {i,name:su.ph[i][0],left:acc-elapsed, total:su.ph[i][1]}; }
  return {i:su.ph.length-1,name:su.ph[su.ph.length-1][0],left:0,total:su.ph[su.ph.length-1][1]};
}
function upgradeCost(b){ return bizDef(b).cost*Math.pow(2.5,b.lvl)*(b.cf||1); }
function upgradeBiz(b){
  if(b.status!=='active') return err('Disponible une fois la société en service.');
  if(b.up) return err('Un agrandissement est déjà en cours.');
  if(b.lvl>=MAXLVL) return err('Niveau maximal atteint.');
  if(b.bld){ const bd=bldById(b.bld); if(bd&&b.lvl+1>bldMaxLvl(bd,b.def)) return err('Bâtiment trop petit : niveau '+bldMaxLvl(bd,b.def)+' au maximum à cette adresse.'); }
  if(bizDef(b).startup && b.out==='F') return err('Start-up en échec.');
  const c=upgradeCost(b); if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c)+' requis.');
  payCap('b:'+b.id,'Agrandissement : '+b.name,-c); settleAccounts();
  b.up={t:Math.ceil(bizDef(b).launch*0.6)+4*b.lvl, to:b.lvl+1, paid:c};
  log('info','Agrandissement de « '+b.name+' » vers le niveau '+(b.lvl+1)+' : '+b.up.t+' jours.');
  return ok();
}
function bizValue(b){
  const inv=bizInvested(b)*(b.cf||1);
  if(b.status==='build') return b.inv$*0.8;
  const d=bizDef(b);
  const total = b.up? inv+b.up.paid*0.8 : inv;
  if(b.hist.length<10) return 0.7*inv + (b.up? b.up.paid*0.8:0);
  const avg=b.hist.slice(-30).reduce((a,x)=>a+x,0)/Math.min(30,b.hist.length);
  return clamp(avg*bizBase(b).pb*1.25, 0.45*inv, (d.startup?40:2.5)*inv) + (b.up? b.up.paid*0.8:0);
}
function sellPrice(b){ return bizValue(b)*0.88; }
function closeBiz(b,price,buyer){
  if((b.dfr||0)>0){ pay('b:'+b.id,'Frais reportés réglés',-b.dfr); b.dfr=0; b.dfr0=0; }
  const p=price===undefined? sellPrice(b) : price;
  payCap('b:'+b.id,(buyer?'Rachat par '+buyer+' : ':'Cession : ')+b.name,p);
  if(b.prem){ const pv=premValue(b)*0.96; payCap('b:'+b.id,'Vente des locaux : '+b.name,pv); }
  const n=headcount(b); if(n){ S.rep=clamp(S.rep-Math.min(6,n*0.1),0,100); S.stats.layoffs30+=n; S.gov.ten=clamp(S.gov.ten+Math.min(8,n*0.1),0,100); }
  bldRelease(b,false); S.biz=S.biz.filter(x=>x!==b);
  log('info','« '+b.name+' » cédée'+(buyer?' à '+buyer:'')+' pour '+eur(p)+'.');
  return ok();
}

/* ---------- Paramètres de gestion ---------- */
function setPol(e,v){ e.pol=clamp(v,0.8,1.4); }
function setPrice(b,v){ b.price=clamp(v,0.8,1.3); }
function setMkt(b,v){ b.mkt=clamp(v|0,0,3); }
function setSec(b,v){ b.sec=clamp(v|0,0,3); }
function setIns(b,v){ b.ins=!!v; }
function setWeekend(b,v){ b.wk=!!v; }
const MKT_PCT=[0,.015,.035,.06], MKT_BOOST=[1,1.05,1.085,1.105];

function agencyBonus(){ let l=0; S.biz.forEach(b=>{ if(b.def==='agency'&&b.status==='active') l+=b.lvl; }); return Math.min(l,6); }
function staffingLevel(){ let l=0; S.biz.forEach(b=>{ if(b.def==='staffing'&&b.status==='active') l+=b.lvl; }); return Math.min(l,6); }
function buildCoLevel(){ let l=0; S.biz.forEach(b=>{ if(b.def==='build'&&b.status==='active') l+=b.lvl; }); return l; }
function lawMult(d,b){
  const L=b? lawsAt(b.city) : S.laws; let m=1;
  if(d.tags.includes('renew')&&L.subRenew) m*=1.25;
  if(d.tags.includes('tech')&&L.subTech) m*=1.10;
  if(d.tags.includes('retail')&&L.consLaw) m*=.97;
  if(d.tags.includes('realestate')&&L.rentCap) m*=.95;
  if(d.tags.includes('luxury')&&L.luxTax) m*=.97;
  return m;
}
function satIndex(b){ let i=0; for(const x of S.biz){ if(x===b) break; if(x.def===b.def && x.city===b.city && x.status!=='build') i++; } return i; }
function synBonus(d){ if(!d.syn) return 1; return S.biz.some(x=>x.def===d.syn.with&&x.status==='active')? 1+d.syn.b : 1; }
function startupMult(b){
  const su=bizDef(b).startup; if(!su) return 1;
  if(b.out==='F') return 0;
  if(b.out==='M') return 0.8;
  const t=Math.max(0,S.day-(b.liveDay||S.day));
  return 1+(su.M-1)*(1-Math.exp(-t/60));
}

/* Prévision des chiffres d'une journée moyenne (pour l'interface) */
function bizProjection(b){
  const d=bizDef(b), base=bizBase(b);
  const sf=staffFactor(b)*fatF(b)*EQP[eqOf(b)], csm=csMult(b), comp=compM(b);
  const demand=1+d.econ*(S.macro.econ-1)-d.rate*(S.macro.rate-4)*0.02;
  const rep=1+d.rep*(S.rep-50)/200;
  const sat=Math.pow(cityOf(b).satR||SAT,satIndex(b));
  const vol=clamp(1-d.el*(b.price-1),0.2,1.8);
  const loc=locMult(b,true);
  const mm=metMods(b);
  const volF=mm.vol*base.R0*sf*demand*MKT_BOOST[b.mkt]*lawMult(d,b)*sat*synBonus(d)*rep*startupMult(b)*vol*tagMult(d.tags)*loc.total*csm*comp*(D.CAL[b.def]||1)*planEff(b).S*bldSales(b)*bossSales(b);
  return {sf, csm, comp, demand, rep, sat, vol, loc, volF, mm, rev:volF*b.price*mm.price+mm.rev, cogs:volF*d.c*mm.cogs, R0:base.R0};
}

/* ---------- Traitement quotidien d'une société ---------- */
const DFR_DEFS=['gallery','staffing','farm','textile','studio','couture','promo','build'], DFR_MAX=60;
function processBiz(b){
  const d=bizDef(b), day=S.day, we=isWE(day);
  if(isFact(b)) b.price=1;
  b.mods=b.mods.filter(m=>m.until>=day);
  /* construction / phases */
  if(b.status==='build'){
    const left=b.since+b.t-day-1;
    if(d.startup){
      const ph=bizPhase(b);
      if(ph && ph.i===2 && ph.left===1 && b.out==='F'){ // fin du développement : verdict négatif
        const resid=b.inv$*0.05; payCap('b:'+b.id,'Liquidation de la start-up : '+b.name,resid);
        log('bad','Échec : « '+b.name+' » n’a pas trouvé son marché. Il reste '+eur(resid)+' après liquidation.');
        S.biz=S.biz.filter(x=>x!==b); return;
      }
    }
    if(left<=0){
      b.status='active'; b.liveDay=day+1; startCrew(b,0.75); if(isStock(b)) b.stock=cogsRef(b)*5;
      if(d.startup){
        if(b.out==='S'){ log('good','Succès : « '+b.name+' » décolle ! Sa croissance sera rapide.'); S.stats.startupWin++; }
        else log('warn','« '+b.name+' » est lancée, mais la traction reste modeste.');
      } else log('good','« '+b.name+' » ouvre ses portes. Une équipe de départ a été recrutée.');
    }
    return;
  }
  /* agrandissement */
  if(b.up){ b.up.t--; if(b.up.t<=0){ b.lvl=b.up.to; b.up=null; log('good','« '+b.name+' » passe au niveau '+b.lvl+'. Recrutez pour combler les nouveaux postes.'); } }
  const base=bizBase(b), src='b:'+b.id;
  const closedByEvent = b.closedUntil>=day;
  const open = !closedByEvent && (!we || d.open==='always' || b.wk);
  let rev=0,cogs=0,wages=0,mkt=0,extra=0;
  const C=cityOf(b), dd=distOf(b), sec=bizSec(b.def), dm=S.dm||1;
  let upkeep=base.up*progMult();
  const bdg=b.bld&&bldById(b.bld);
  const rent=(bdg? bldRent(bdg) : base.rent0*rentFactor(b)*progMult()*(lawsAt(b.city).rentCap?.88:1))*(1-0.7*ownShare(b))*lkRentF(b);
  const secc=base.R0*SECC[b.sec||0], insc=b.ins? base.R0*0.006*insRisk(C) : 0;
  if(open){
    const pr=bizProjection(b);
    let mult=1; b.mods.forEach(m=>{ mult*=m.mult; });
    const noise=clamp(1+(0.025+d.risk*0.45)*norm(),0.5,1.6);
    const wf=we? d.wkf:1;
    const vf=pr.volF*mult*noise*wf;
    const mm=pr.mm; rev=vf*b.price*mm.price*warRev(b)+mm.rev; cogs=vf*d.c*mm.cogs*pqCost(b); extra+=mm.fixed;
    if(isStock(b)){ const st=stockDay(b,cogs,true); rev*=st.frac; cogs=factSupply(b,st.bought); }
    if(isFact(b)) rev=factoryDay(b,rev);
    rev*=REV_BOOST;
    wages=(wageBill(b,we)*planEff(b).W*(b.hc?1.05:1)+bossExtra(b))*mm.wage;
    mkt=base.R0*(MKT_PCT[b.mkt]+warCost(b));
  } else if(isStock(b)) cogs=stockDay(b,0,false).bought;
  if(isStock(b)) upkeep+=(b.stock||0)*0.0005;
  /* incidents */
  if(!closedByEvent && open && rnd()<d.risk*0.045*bossRisk(b)){
    const kinds=[['fire',1],['strike',avgLoy(b)<50?3:.8],['cyber',d.tags.includes('tech')?2*(C.techRisk||1):.6],['audit',(C.risk&&C.risk.audit)||1],['viral',1.2],['supply',1]];
    const k=wpick(kinds,x=>x[1])[0], R0=base.R0;
    if(k==='fire'){ b.closedUntil=day+rint(3,6); extra+=R0*2; log('bad','Incendie chez « '+b.name+' » : fermeture '+(b.closedUntil-day)+' jours, réparations '+eur(R0*2)+'.'); }
    else if(k==='strike'){ b.closedUntil=day+rint(3,5); S.rep=clamp(S.rep-1,0,100); S.gov.ten=clamp(S.gov.ten+1.5,0,100); log('bad','Grève chez « '+b.name+' » : activité arrêtée '+(b.closedUntil-day)+' jours.'); }
    else if(k==='cyber'){ extra+=R0*4; log('bad','Cyberattaque contre « '+b.name+' » : '+eur(R0*4)+' de pertes.'); }
    else if(k==='audit'){ extra+=R0*2; log('warn','Contrôle administratif chez « '+b.name+' » : amende de '+eur(R0*2)+'.'); }
    else if(k==='viral'){ b.mods.push({mult:1.25,until:day+7,label:'Succès viral'}); log('good','Succès viral pour « '+b.name+' » : +25 % de ventes pendant 7 jours.'); }
    else if(isStock(b)){ b.lateUntil=day+6; log('warn','Retards chez un fournisseur de « '+b.name+' » : livraisons en 4 jours pendant une semaine. Un stock plus large protège.'); }
    else { b.mods.push({mult:.7,until:day+5,label:'Rupture fournisseur'}); log('warn','Rupture chez un fournisseur de « '+b.name+' » : ventes -30 % pendant 5 jours.'); }
  }
  /* vols : selon le quartier, le secteur, la fête en cours et le niveau de sécurité */
  if(open && !closedByEvent){
    const p=0.004*Math.pow(dd.crime/3,1.6)*D.SECT[sec].th*SECM[b.sec||0]*festOf(b.city).crime*dm;
    if(rnd()<p){
      const loss=base.R0*(1+2*rnd())*(sec==='luxe'?1.8:1)*(b.ins?.5:1); extra+=loss; S.stats.thefts=(S.stats.thefts||0)+1;
      log('warn','Vol chez « '+b.name+' » ('+dd.n+') : '+eur(loss,0)+' de pertes.'+(b.sec? '' : ' Une présence de sécurité réduirait ce risque.'));
    }
  }
  if(closedByEvent){ rev=0; if(!isStock(b)) cogs=0; wages=0; mkt=0; }
  let net=rev-cogs-wages-upkeep-rent-secc-insc-mkt-extra;
  /* V1.5.7 : un jour sans vente (activité qui vend par périodes, ou fermeture du week-end), les frais sont mis
     de côté et déduits des ventes suivantes : résultat du jour à 0, même bénéfice sur la durée. Réglés au plus tard après 60 jours. */
  let dfrA=0;
  if(b.status==='active'){ let D0=b.dfr||0; const per=DFR_DEFS.includes(b.def), weOff=we&&!open&&!closedByEvent;
    if(net<0&&(per||weOff)){ dfrA=-net; D0+=-net; if(!b.dfr0) b.dfr0=day; }
    else if(net>0&&D0>0){ const s=Math.min(D0,net); dfrA=-s; D0-=s; }
    if(D0>0&&b.dfr0&&day-b.dfr0>=DFR_MAX){ dfrA-=D0; D0=0; }
    if(D0<=.5){ D0=0; b.dfr0=0; } b.dfr=D0; net+=dfrA; }
  b.last={day,rev,cogs,wages,upkeep,rent,sec:secc,ins:insc,mkt,extra,dfr:dfrA,net,net0:net-dfrA,open,closed:closedByEvent};
  b.hist.push(Math.round(net)); if(b.hist.length>60) b.hist.shift();
  opsDaily(b,open&&!closedByEvent,we);
  metDaily(b,{open:open&&!closedByEvent,rev});
  if(rev>0) pay(src,'Ventes',rev);
  const costs=cogs+wages+upkeep+rent+secc+insc+mkt+extra;
  if(costs>0) pay(src,'Charges d’exploitation',-costs);
  if(dfrA) pay(src,dfrA>0?'Frais reportés à la prochaine vente':'Frais reportés réglés',dfrA);
  S.tb.corp+=net*C.taxM;
  rptBiz(b);
  if(rev>0 && S.bank.lic && d.cat==='com' && S.bank.dep>0){ const f=rev*0.004*(S.bank.fees===0?.5:S.bank.fees===2?1.4:1); S.bank.payFees=(S.bank.payFees||0)+f; }
  /* moral et départs */
  const ent=b; Object.keys(b.staff).forEach(r=>{
    const c=b.staff[r];
    const tgt=60+90*(b.pol-1)+5*lawsAt(b.city).labor+(S.rep-50)*0.15-(b.wk&&d.open!=='always'?5:0)-(b.fat||0)*0.08+HR.loy[hrLvl()]+hcLoy(b);
    c.loy=clamp(c.loy+(tgt-c.loy)*0.05,0,100);
    if(c.loy<28 && rnd()<0.04*c.n*dm && c.n>0){ c.n--; if(c.n===0) delete b.staff[r]; log('warn','Un employé démissionne de « '+b.name+' » (fidélité basse).'); }
  });
}

