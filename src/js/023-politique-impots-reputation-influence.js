/* ============================================================
   POLITIQUE, IMPÔTS, RÉPUTATION, INFLUENCE
   ============================================================ */
const billDef = k => D.BILLS.find(x=>x.k===k);
const lobbyScale = () => Math.max(1000,0.0025*Math.max(S.nw,0));
const lobbyPush = spend => 0.45*(1-Math.exp(-spend/lobbyScale()))*(1+2*S.infl/(S.infl+250));

function billProb(bl){
  const d=billDef(bl.k), tilt=(S.gov.ten-40)/40;
  let p=0.5-0.25*tilt*d.lean+1.2*(S.macro.econ-1)*d.lean;
  p+=lobbyPush(bl.pro||0)-lobbyPush(bl.con||0);
  return clamp(p,0.04,0.96);
}
function tableBills(){
  const el=D.BILLS.filter(b=>b.cond(S.laws));
  const chosen=[]; const pool=el.slice();
  while(chosen.length<3 && pool.length){ const i=Math.floor(rnd()*pool.length); chosen.push(pool.splice(i,1)[0]); }
  S.bills=chosen.map(c=>({id:S.nid++, k:c.k, pro:0, con:0, vote:S.day+15}));
  if(S.bills.length) log('info','Le Parlement examine '+S.bills.length+' projets de loi. Vote dans 15 jours.','news');
}
function applyLaw(d,mult){
  Object.assign(S.laws,d.set);
  S.gov.pop=clamp(S.gov.pop+d.pop*(mult||1),0,100); S.gov.ten=clamp(S.gov.ten+d.ten*(mult||1),0,100);
}
function voteBills(){
  S.bills.forEach(bl=>{
    const d=billDef(bl.k), p=billProb(bl), pass=rnd()<p;
    if(pass){ applyLaw(d); S.lawLog.unshift({d:S.day,t:d.t,pass:true}); log('warn','Loi adoptée : '+d.t+'.','news'); }
    else { S.lawLog.unshift({d:S.day,t:d.t,pass:false}); log('info','Loi rejetée : '+d.t+'.','news'); }
  });
  if(S.lawLog.length>30) S.lawLog.length=30;
  S.bills=[];
}
function lobby(billId,side,amount){
  if(!unlocked(1)) return err('Palier Entrepreneur requis.');
  const bl=S.bills.find(x=>x.id===billId); if(!bl) return err('Projet de loi introuvable.');
  if(!(amount>0)) return err('Montant invalide.'); if(S.cash<amount) return err('Trésorerie insuffisante.');
  pay('pol','Lobbying : '+billDef(bl.k).t,-amount);
  if(side==='pro') bl.pro+=amount; else bl.con+=amount;
  S.infl+=2*amount/lobbyScale(); S.susp=clamp(S.susp+100*amount/(lobbyScale()*10),0,100);
  S.lobbyRecent=(S.lobbyRecent||0)+amount; S.stats.lobby++;
  return ok('Budget de lobbying engagé : '+eur(amount)+'.');
}
function donate(amount){
  if(!unlocked(1)) return err('Palier Entrepreneur requis.');
  if(!(amount>0)) return err('Montant invalide.'); if(S.cash<amount) return err('Trésorerie insuffisante.');
  pay('pol','Dons aux partis politiques',-amount);
  S.infl+=3*amount/lobbyScale(); S.susp=clamp(S.susp+100*amount/(lobbyScale()*14),0,100);
  S.lobbyRecent=(S.lobbyRecent||0)+amount; S.stats.lobby++;
  return ok('Don de '+eur(amount)+' : influence +'+fmtN(3*amount/lobbyScale(),1)+'.');
}
function decree(k){
  if(!S.country) return err('Réservé aux souverains.');
  if(S.day-S.decreeDay<10) return err('Un décret tous les 10 jours.');
  const d=ctyBillDef(k), CL=ctyLaws(); if(!d||!ctyBill(d)) return err('Décret impossible.');
  Object.assign(CL,d.set); S.country.sat=clamp(S.country.sat+1.5*(d.pop||0)-.5*(d.ten||0),0,100); S.decreeDay=S.day; S.lawLog.unshift({d:S.day,t:d.t,pass:true,decree:true});
  log('warn','Décret promulgué à '+S.country.name+' : '+d.t+'.');
  return ok();
}

/* ---------- Impôts ---------- */
function taxEstimate(){
  const corp=Math.max(0,S.tb.corp)*S.laws.corpTax, cap=Math.max(0,S.tb.cap)*S.laws.capTax;
  const w=S.laws.wealthTax>0? Math.max(0,S.nw-1.5e6)*S.laws.wealthTax/12 : 0;
  return {corp,cap,wealth:w,total:corp+cap+w};
}
function taxStep(){
  if(S.day%30!==0) return;
  const e=taxEstimate(); let paid=0; const parts=[];
  const av=offTax(e.corp); if(av>0){ e.corp-=av; parts.push(['Évité (offshore)',-av]); }
  if(e.corp>1){ pay('tax','Impôt sur les sociétés ('+pct(corpRateEff(),1)+' en moyenne)',-e.corp); paid+=e.corp; parts.push(['Sociétés',e.corp]); }
  if(e.cap>1){ pay('tax','Impôt sur les revenus du capital ('+pct(S.laws.capTax,0)+')',-e.cap); paid+=e.cap; parts.push(['Capital',e.cap]); }
  if(e.wealth>1){ pay('tax','Impôt sur la fortune',-e.wealth); paid+=e.wealth; parts.push(['Fortune',e.wealth]); }
  S.tb.corp=Math.min(0,S.tb.corp); S.tb.cap=Math.min(0,S.tb.cap);
  S.taxPaid30=paid; S.taxLast=parts; S.nextTax=S.day+30;
  log('info','Échéance fiscale du '+dateL(S.day)+' : '+eur(paid)+' prélevés.');
}

/* ---------- Social, réputation, influence ---------- */
function totalEmployees(){ let n=0; S.biz.forEach(b=>n+=headcount(b)); if(S.bank.lic) n+=headcount(S.bank.ent); return n; }
function avgPolicy(){
  let n=0,t=0; S.biz.forEach(b=>{ const h=headcount(b); n+=h; t+=h*b.pol; });
  if(S.bank.lic){ const h=headcount(S.bank.ent); n+=h; t+=h*S.bank.ent.pol; }
  return n? t/n : 1;
}
function socialStep(){
  const emp=totalEmployees(), ap=avgPolicy(), M=S.macro, G=S.gov;
  let t=50+Math.min(12,emp/25)+25*(ap-1)+0.3*Math.sqrt(Math.max(0,S.prestige))-0.2*S.susp;
  if(S.bank.lic) t+=(S.bank.rep-50)*0.12;
  if(S.cash<0) t-=10;
  const rc=repClients(); if(rc!==null) t+=(rc-65)*0.45;   /* avis des clients : la note moyenne des sociétés pèse sur la réputation générale */
  S.rep=clamp(S.rep+(clamp(t,5,95)-S.rep)*0.02,0,100);
  const media=S.biz.filter(b=>b.status==='active');
  let inf=0; media.forEach(b=>{ if(b.def==='studio') inf+=0.02*b.lvl; if(b.def==='gallery') inf+=0.01*b.lvl; });
  S.infl=S.infl*0.998+inf+0.003*Math.sqrt(Math.max(0,S.prestige));
  S.susp*=0.99; S.lobbyRecent=(S.lobbyRecent||0)*0.98;
  S.stats.layoffs30*=0.96;
  const popT=50+60*(M.econ-1)-0.25*(G.ten-40), tenT=35+5*Math.log10(Math.max(1,S.nw/1e4))+25*(1-ap)-5*S.laws.labor-8*S.laws.rentCap+0.15*S.stats.layoffs30;
  G.pop=clamp(G.pop+(popT-G.pop)*0.03,0,100);
  G.ten=clamp(G.ten+(clamp(tenT,5,90)-G.ten)*0.04,0,100);
  G.stab=clamp(100-0.7*G.ten+0.2*G.pop-10,0,100);
  if(G.ten>70 && rnd()<(G.ten-70)/30*0.03){
    const act=S.biz.filter(b=>b.status==='active'&&b.closedUntil<S.day);
    if(act.length){ const b=pick(act); b.closedUntil=S.day+rint(3,5); log('bad','Troubles sociaux : « '+b.name+' » ferme quelques jours.'); }
  }
  if(S.susp>30 && rnd()<((S.susp-30)/70)*0.06){
    const fine=Math.max(500,1.2*(S.lobbyRecent||0));
    pay('pol','Amende : scandale de corruption',-fine);
    S.rep=clamp(S.rep-12,0,100); S.infl*=0.6; G.pop=clamp(G.pop-4,0,100); S.susp=10;
    log('crit','Scandale : la presse révèle vos financements politiques. Amende de '+eur(fine)+', forte baisse de réputation, influence réduite.');
  }
}
function politicsStep(){
  if(S.country) return;
  if(S.day%30===1) tableBills();
  if(S.bills.length && S.day>=S.bills[0].vote) voteBills();
}

