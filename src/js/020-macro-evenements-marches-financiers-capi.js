/* ============================================================
   MACRO, ÉVÉNEMENTS, MARCHÉS FINANCIERS, CAPITAL-RISQUE, CRÉDIT
   ============================================================ */

/* ---------- Macro ---------- */
function macroStep(){
  const M=S.macro; M.econPrev=M.econ;
  M.shock*=0.975; M.radd*=0.985;
  const cyc=0.07*Math.sin(2*Math.PI*(S.day+M.phase)/720)+0.03*Math.sin(2*Math.PI*(S.day+M.phase*2)/173);
  const tgt=1+cyc+M.shock;
  M.econ=clamp(M.econ+(tgt-M.econ)*0.15+0.003*norm(),0.65,1.35);
  const rt=3+6*(M.econ-1)+M.radd;
  M.rate=clamp(M.rate+(rt-M.rate)*0.03,0.5,9.5);
  M.house=clamp(M.house*Math.exp(0.0002-0.00012*(M.rate-4)+0.0018*norm()+0.01*(M.econ-1)*0.2),0.5,4);
}
function eventsStep(){
  D.EVENTS.forEach(e=>{
    if((!e.cond||e.cond()) && rnd()<e.p){ e.fx(); log(e.sev,e.t,'news'); S.news=e.t; }
  });
  S.sched=S.sched.filter(x=>{
    if(x.day>S.day) return true;
    if(x.ev==='techcrash'){
      if(rnd()<.6){ sentImp('tech',-.24); log('bad','Éclatement de la bulle technologique : les valeurs tech s’effondrent.','news'); }
      else { sentImp('tech',-.06); log('warn','La fièvre technologique retombe doucement.','news'); }
    }
    return false;
  });
}
function bankRumor(){
  if(S.bank.lic){ S.bank.run={d:rint(3,6), f:0.03+0.05*rnd()}; log('crit','Rumeur de panique : des clients retirent leurs dépôts de votre banque.'); }
}

/* ---------- Initialisation des marchés ---------- */
function genHist(p,vol,n){
  const a=new Array(n); a[n-1]=p;
  for(let i=n-2;i>=0;i--) a[i]=a[i+1]*Math.exp(-vol*norm());
  return a.map(x=>Math.round(x*10000)/10000);
}
function bondYield(sp){ return clamp(S.macro.rate+sp,0.2,30); }
function issueBond(def,age){
  const issue=S.day-(age||0), sp=def.spread;
  S.mk.bonds.push({uid:S.nid++, key:def.key, issue, mat:issue+def.term, cpn:Math.round(bondYield(sp)*100)/100, sp, dflt:false, price:100, hist:[]});
}
function bondDef(b){ return D.bonds.find(x=>x.key===b.key); }
function bondPrice(b){
  if(b.dflt) return 35;
  const yl=Math.max(0,(b.mat-S.day)/360), y=bondYield(b.sp);
  return clamp(100+(b.cpn-y)*yl*0.9,20,130);
}
function initMarkets(){
  D.stocks=D.stocks.filter(x=>!x.ipo);
  const mk={stocks:[],bonds:[],crypto:[],sent:{mkt:0,crypto:0},pend:{mkt:0,n:0},news:null};
  Object.keys(D.SECTORS).forEach(k=>{ mk.sent[k]=0; mk.pend[k]=0; });
  S.mk=mk;
  D.stocks.forEach((d,i)=>{ const p=d.p*(0.93+0.14*rnd()); mk.stocks.push({id:d.id, price:p, lnF:Math.log(p), hist:genHist(p,d.vol,60), divOff:(i*5)%30, divDue:false}); });
  D.bonds.forEach(def=>{ issueBond(def, rint(0,Math.floor(def.term*0.6))); });
  mk.bonds.forEach(b=>{ b.price=bondPrice(b); b.hist=genHist(b.price,0.002,60); b.hist[59]=b.price; });
  D.crypto.forEach(d=>{ const p=d.p*(0.85+0.3*rnd()); mk.crypto.push({id:d.id, price:p, lnF:Math.log(d.p), hist:genHist(p,d.vol,60)}); });
}

/* ---------- Pas quotidien des marchés ---------- */
function marketsStep(){
  const m=S.mk, M=S.macro, wd=wdOf(S.day);
  const dEcon=M.econ-M.econPrev;
  Object.keys(m.sent).forEach(k=>{ m.sent[k]*=0.9; });
  const mktRet=0.004*norm()+0.6*dEcon+0.08*m.sent.mkt;
  m.pend.mkt+=mktRet; m.pend.n++;
  Object.keys(D.SECTORS).forEach(k=>{ m.pend[k]+=0.08*m.sent[k]+0.003*norm(); });
  /* Actions et obligations : séance du lundi au vendredi, les mouvements du week-end s’accumulent */
  if(wd<5){
    const n=m.pend.n;
    m.stocks.forEach((st,i)=>{
      const d=D.stocks[i];
      const r=0.00025*n+d.beta*m.pend.mkt+m.pend[d.sec]+d.vol*Math.sqrt(n)*norm()-0.03*(Math.log(st.price)-st.lnF);
      st.price=Math.max(0.5,st.price*Math.exp(clamp(r,-.4,.4)));
      st.lnF+=0.0002*n+0.4*dEcon;
      if(S.day%30===st.divOff) st.divDue=true;
      if(st.divDue){
        const per=st.price*d.y/1200;
        let q=(S.pf.player.stock[d.id]||{q:0}).q;
        if(q>0) pay('mk','Dividendes '+d.id,q*per,'cap');
        const qb=(S.pf.bank.stock[d.id]||{q:0}).q;
        if(qb>0 && S.bank.lic) pay('bank','Dividendes '+d.id+' (portefeuille bancaire)',qb*per,'corp');
        if(q>0||qb>0) st.price-=per;
        st.divDue=false;
      }
      st.hist.push(Math.round(st.price*100)/100); if(st.hist.length>360) st.hist.shift();
    });
    m.pend.mkt=0; m.pend.n=0; Object.keys(D.SECTORS).forEach(k=>{ m.pend[k]=0; });
  }
  /* Obligations : prix recalculés chaque jour de séance ; coupons courus quotidiens */
  m.bonds.forEach(b=>{
    const def=bondDef(b);
    b.sp+=0.02*(def.spread-b.sp)+0.025*norm()+(def.haz>0? 0.05*Math.max(0,.97-M.econ)*10:0)*0.1;
    b.sp=clamp(b.sp,def.spread-1.5,def.spread+8);
    if(!b.dflt && def.haz>0 && rnd()<def.haz*4/360*(2.2-M.econ)){
      b.dflt=true; log('bad','Défaut de paiement sur une obligation « '+def.n+' » : le cours s’effondre.','news');
    }
    if(wd<5){ b.price=bondPrice(b); b.hist.push(Math.round(b.price*100)/100); if(b.hist.length>120) b.hist.shift(); }
    /* coupons */
    if(!b.dflt){
      const cp=100*b.cpn/100/360;
      const q=(S.pf.player.bond[b.uid]||{q:0}).q; if(q>0) pay('mk','Coupons '+def.n,q*cp,'cap');
      const qb=(S.pf.bank.bond[b.uid]||{q:0}).q; if(qb>0&&S.bank.lic) pay('bank','Coupons (portefeuille bancaire)',qb*cp,'corp');
    }
  });
  /* échéances */
  m.bonds.filter(b=>S.day>=b.mat).forEach(b=>{
    const face=b.dflt?35:100, def=bondDef(b);
    const qp=(S.pf.player.bond[b.uid]||{q:0}).q, qb=(S.pf.bank.bond[b.uid]||{q:0}).q;
    if(qp>0){ const amt=qp*face; const cost=S.pf.player.bond[b.uid].cost; payCap('mk','Remboursement « '+def.n+' »',amt); S.tb.cap+=amt-cost; delete S.pf.player.bond[b.uid]; }
    if(qb>0){ const amt=qb*face; S.bank.res+=amt; S.tb.corp+=amt-S.pf.bank.bond[b.uid].cost; delete S.pf.bank.bond[b.uid]; }
    m.bonds=m.bonds.filter(x=>x!==b);
    issueBond(def,0); const nb=m.bonds[m.bonds.length-1]; nb.price=bondPrice(nb); nb.hist=genHist(nb.price,0.002,60); nb.hist[59]=nb.price;
  });
  /* Cryptomonnaies : 24 h/24 */
  const cv=S.laws.cryptoReg?0.75:1;
  m.crypto.forEach((c,i)=>{
    const d=D.crypto[i];
    const r=d.drift+d.vol*cv*norm()+0.10*m.sent.crypto+0.3*mktRet-0.004*(Math.log(c.price)-c.lnF);
    c.price=Math.max(d.p*0.002,c.price*Math.exp(clamp(r,-.5,.5)));
    c.lnF+=0.0002;
    c.hist.push(Math.round(c.price*10000)/10000); if(c.hist.length>360) c.hist.shift();
  });
  /* Livret */
  if(S.livret.bal>0){ const i=S.livret.bal*livretRate()*(1+cardLiv())/100/360; pay('livret','Intérêts du livret',i,'cap'); }
}
const livretRate = () => Math.max(0.5,S.macro.rate-1.5);

/* ---------- Ordres ---------- */
const FEES={stock:.002,bond:.001,crypto:.005};
function feeRate(cls){ return FEES[cls]*(cls==='crypto'&&S.laws.cryptoReg?0.6:1)+S.laws.tobin; }
function assetInfo(cls,id){
  if(cls==='stock'){ const i=S.mk.stocks.findIndex(x=>x.id===id); if(i<0) return null; return {p:S.mk.stocks[i].price, tier:D.stocks[i].tier, name:D.stocks[i].n, open:marketsOpen()}; }
  if(cls==='bond'){ const b=S.mk.bonds.find(x=>x.uid===+id); if(!b) return null; const d=bondDef(b); return {p:b.price, tier:d.tier, name:d.n, open:marketsOpen()}; }
  if(cls==='crypto'){ const i=S.mk.crypto.findIndex(x=>x.id===id); if(i<0) return null; return {p:S.mk.crypto[i].price, tier:D.crypto[i].tier, name:D.crypto[i].n, open:true}; }
  return null;
}
function holdKey(cls,id){ return cls==='bond'? +id : id; }
function buyAsset(owner,cls,id,amount){
  const a=assetInfo(cls,id); if(!a) return err('Actif inconnu.');
  if(!unlocked(a.tier)) return err('Palier de richesse insuffisant.');
  if(!a.open) return err('Marché fermé le week-end.');
  if(owner==='bank' && !S.bank.lic) return err('Licence bancaire requise.');
  if(!(amount>0)) return err('Montant invalide.');
  const fee=feeRate(cls); let q=amount/(a.p*(1+fee)); if(cls!=='crypto') q=Math.floor(q); else q=Math.floor(q*1e6)/1e6;
  if(q<=0) return err('Montant trop faible pour acheter une unité.');
  const cost=q*a.p*(1+fee);
  const funds=owner==='bank'? S.bank.res-S.laws.reserve*S.bank.dep : S.cash;
  if(funds<cost-0.001) return err(owner==='bank'? 'Réserve de la banque insuffisante (réserves obligatoires comprises).' : 'Trésorerie insuffisante.');
  const h=S.pf[owner][cls], k=holdKey(cls,id), cur=h[k]||(h[k]={q:0,cost:0});
  cur.q+=q; cur.cost+=cost;
  if(owner==='bank') S.bank.res-=cost; else payCap('mk','Achat '+a.name+' ×'+fmtN(q,cls==='crypto'?4:0),-cost);
  return ok(fmtN(q,cls==='crypto'?4:0)+' × '+a.name+' pour '+eur(cost)+'.');
}
function sellAsset(owner,cls,id,frac){
  const a=assetInfo(cls,id); if(!a) return err('Actif inconnu.');
  if(!a.open) return err('Marché fermé le week-end.');
  const h=S.pf[owner][cls], k=holdKey(cls,id), cur=h[k]; if(!cur||cur.q<=0) return err('Aucune position.');
  const fee=feeRate(cls); let q=frac>=0.999? cur.q : cur.q*frac; if(cls!=='crypto' && frac<0.999) q=Math.max(1,Math.floor(q));
  q=Math.min(q,cur.q);
  const proceeds=q*a.p*(1-fee), basis=cur.cost*(q/cur.q), gain=proceeds-basis;
  cur.q-=q; cur.cost-=basis; if(cur.q<=1e-9) delete h[k];
  if(owner==='bank'){ S.bank.res+=proceeds; S.tb.corp+=gain; }
  else { payCap('mk','Vente '+a.name+' ×'+fmtN(q,cls==='crypto'?4:0),proceeds); S.tb.cap+=gain; }
  return ok('Vente de '+fmtN(q,cls==='crypto'?4:0)+' × '+a.name+' : '+eur(proceeds)+(gain>=0?' (plus-value ':' (moins-value ')+eur(Math.abs(gain))+').');
}
function holdingsValue(owner){
  let v=0; const h=S.pf[owner];
  for(const id in h.stock){ const s=S.mk.stocks.find(x=>x.id===id); if(s) v+=h.stock[id].q*s.price; }
  for(const id in h.bond){ const b=S.mk.bonds.find(x=>x.uid===+id); if(b) v+=h.bond[id].q*b.price; else v+=h.bond[id].cost; }
  for(const id in h.crypto){ const c=S.mk.crypto.find(x=>x.id===id); if(c) v+=h.crypto[id].q*c.price; }
  return v;
}
function livretMove(amount){ // >0 dépose, <0 retire
  if(!isFinite(amount)||amount===0) return err('Saisissez un montant.');
  if(amount>0){ if(S.cash<amount) return err('Trésorerie insuffisante.'); S.livret.bal+=amount; payCap('livret','Dépôt sur le livret',-amount); }
  else { const w=Math.min(-amount,S.livret.bal); if(w<=0) return err('Livret vide.'); S.livret.bal-=w; payCap('livret','Retrait du livret',w); }
  return ok();
}

/* ---------- Capital-risque ---------- */
const VC_STAGES=['Amorçage','Série A','Série B','Sortie'];
function vcNewOffer(){
  const q=rnd(), val=Math.round((150000+rnd()*1500000)*(1+0.4*tierNow())/1000)*1000;
  const sig=q+0.18*norm();
  S.vc.offers.push({id:S.nid++, name:pick(D.VC_NAMES)+(rnd()<.3?' '+rint(2,9):''), sec:pick(D.VC_SECT), val, q, sig:sig>.62?'Forte':sig>.38?'Solide':'Incertaine', exp:S.day+30});
}
function vcInvest(offerId,amount){
  const o=S.vc.offers.find(x=>x.id===offerId); if(!o) return err('Offre expirée.');
  if(!unlocked(2)) return err('Palier Investisseur requis.');
  const min=2000, max=o.val*0.2;
  if(!(amount>=min)) return err('Ticket minimum : '+eur(min)+'.');
  if(amount>max) return err('Ticket maximum : '+eur(max)+' (20 % du capital).');
  if(S.cash<amount) return err('Trésorerie insuffisante.');
  payCap('vc','Investissement dans '+o.name,-amount);
  S.vc.offers=S.vc.offers.filter(x=>x!==o);
  S.vc.mine.push({id:o.id, name:o.name, sec:o.sec, stake:amount/o.val, inv:amount, val:o.val, stage:0, next:S.day+rint(25,40), q:o.q, st:'active', hist:[o.val]});
  return ok('Participation de '+fmtN(amount/o.val*100,2)+' % dans '+o.name+'.');
}
function vcValue(v){ return v.st==='active'? v.stake*v.val*0.7 : 0; }
function vcSell(id){
  const v=S.vc.mine.find(x=>x.id===id&&x.st==='active'); if(!v) return err('Participation introuvable.');
  const p=v.stake*v.val*(v.stage>=1?0.6:0.5);
  payCap('vc','Cession secondaire de '+v.name,p); S.tb.cap+=p-v.inv; v.st='sold'; v.out=p;
  return ok('Participation cédée pour '+eur(p)+'.');
}
function vcStep(){
  if(!unlocked(2)) return;
  S.vc.offers=S.vc.offers.filter(o=>o.exp>=S.day);
  if(S.vc.offers.length<6 && S.day%6===0) vcNewOffer();
  while(S.vc.offers.length<3) vcNewOffer();
  S.vc.mine.forEach(v=>{
    if(v.st!=='active' || S.day<v.next) return;
    const q=v.q, econ=S.macro.econ;
    if(v.stage===3){
      if(q>.55&&rnd()<.65){ doIpo(v); return; }
      const payout=v.stake*v.val*(q>.5? 1+0.8*rnd() : 0.7+0.5*rnd());
      payCap('vc','Sortie de '+v.name+' (introduction ou rachat)',payout); S.tb.cap+=payout-v.inv; v.st='exit'; v.out=payout;
      log(payout>v.inv?'good':'warn','Sortie de « '+v.name+' » : vous encaissez '+eur(payout)+' (mise '+eur(v.inv)+').');
      return;
    }
    const pUp=clamp(0.20+0.55*q,0.1,0.8)*(0.8+0.2*econ), pBust=clamp(0.38-0.30*q,0.04,0.4), r=rnd();
    if(r<pBust){ v.st='bust'; v.val=0; v.out=0; log('bad','Faillite de la start-up « '+v.name+' » : votre mise de '+eur(v.inv)+' est perdue.'); }
    else if(r<pBust+pUp){ v.val*=1.8+1.8*rnd(); v.stake*=0.85; v.stage++; v.next=S.day+rint(25,40); v.hist.push(v.val); log('good','« '+v.name+' » lève des fonds ('+VC_STAGES[v.stage]+') : valorisation '+eur(v.val)+'.'); }
    else { v.val*=0.9+0.3*rnd(); v.stake*=0.92; v.stage++; v.next=S.day+rint(25,40); v.hist.push(v.val); }
  });
  S.vc.mine=S.vc.mine.filter(v=>v.st==='active' || S.day-(v.next||0)<60);
}

/* ---------- Crédit externe ---------- */
function debtTotal(){ return S.debts.reduce((a,d)=>a+d.p,0); }
function debtLimit(){ const gross=S.nw+debtTotal(); return Math.max(0,0.6*gross-debtTotal()); }
function debtRate(){ return S.macro.rate+3.5; }
function borrow(amount){
  if(!(amount>0)) return err('Montant invalide.');
  if(amount>debtLimit()+0.01) return err('Capacité d’emprunt dépassée : '+eur(debtLimit())+' disponibles.');
  S.debts.push({id:S.nid++, p:amount, r:Math.round(debtRate()*100)/100, d:S.day});
  payCap('debt','Emprunt contracté',amount);
  return ok('Emprunt de '+eur(amount)+' à '+fmtN(debtRate(),2)+' % par an.');
}
function repay(id,amount){
  const d=S.debts.find(x=>x.id===id); if(!d) return err('Emprunt introuvable.');
  if(!(amount>0)) return err('Montant invalide.');
  const a=Math.min(amount,d.p); if(S.cash<a) return err('Trésorerie insuffisante.');
  payCap('debt','Remboursement d’emprunt',-a); d.p-=a; if(d.p<0.01) S.debts=S.debts.filter(x=>x!==d);
  return ok();
}
function debtStep(){
  let i=0; S.debts.forEach(d=>{ i+=d.p*d.r/100/360; }); i*=1-cardLoan();
  if(i>0) pay('debt','Intérêts d’emprunt',-i,'corp');
  if(S.cash<0){ const od=-S.cash*0.0012; pay('debt','Intérêts de découvert',-od); }
}

