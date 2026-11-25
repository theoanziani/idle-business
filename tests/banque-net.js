/* Bénéfice net quotidien de la banque à chaque étape (moyenne sur 60 jours) */
const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/idle-business/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(3200);
console.log(await p.evaluate(()=>{ S.cash=5e12; S.peakNW=1e9; if(S.tut) S.tut.off=true; const o=[], B=S.bank;
  const run=d=>{ for(let i=0;i<d;i++) nextDay(); };
  const tot=()=>B.st.intIn-B.st.intOut+B.st.fees-B.st.wage-B.st.loss+RVK.reduce((a,k)=>a,0);
  const extra=()=>S.ledger? 0:0;
  const meas=(t,d)=>{ let c0=0; const L0=JSON.parse(JSON.stringify(S.ledger||{})); const n0=tot(); let e=0; const _p=pay; pay=function(cat,l,a,tx){ if(cat==='bank'&&/Cartes|Gestion|Salle|Commission|Réseau|Intérêts des prêts à vos/.test(l)) e+=a; return _p.apply(this,arguments); }; run(d); pay=_p; o.push(t+' étape '+bStg()+' : net/j '+Math.round((tot()-n0+e)/d).toLocaleString('fr')+' € · fonds propres '+Math.round(bankEquity()/1e6)+' M€ · dépôts '+Math.round(B.dep/1e6)+' M€'); };
  bankLicence(); B.pol.auto=true; B.pol.minG='C'; B.rl=8; for(let i=0;i<5;i++){ buyBranch(); } bankInject(1e6); run(120); meas('locale',60);
  for(let k=2;k<=5;k++){ bankInject(Math.max(0,BSTG[k-1].eq*1.3-bankEquity())); bankUp(); if(k===3) ['croatie','espagne','usa','bresil','chine'].forEach(bankCtyOpen); run(200); meas('',60); }
  return o.join('\n'); }));
console.log('ERR',errs.slice(0,3)); await br.close();})();
