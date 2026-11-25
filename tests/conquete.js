/* Conquête mondiale : revenus à l'entrée de l'étape 5 puis en montant la part de marché */
const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(3200);
console.log(await p.evaluate(()=>{ S.cash=5e14; S.peakNW=5e14; if(S.tut) S.tut.off=true; const o=[], B=S.bank; const run=d=>{ for(let i=0;i<d;i++) nextDay(); };
  bankLicence(); B.pol.auto=true; B.pol.minG='C'; B.rl=8; bankInject(1e6); run(60);
  for(let k=2;k<=5;k++){ bankInject(Math.max(0,BSTG[k-1].eq*1.3-bankEquity())); bankUp(); if(k===3) ['croatie','espagne','usa','bresil','chine'].forEach(bankCtyOpen); run(k===5?150:120); }
  const tot=()=>(B.rvN||0); o.push('début mondiale : bénéfice net/j '+(tot()/1e6).toFixed(1)+' M€ · part mondiale '+wWorld().toFixed(2)+' % · palier '+wTier());
  const grow=target=>{ let n=0; while(wWorld()<target&&n<600){ const R=WREG.filter(wOpen).sort((a,b)=>(W().sh[a.k]||0)-(W().sh[b.k]||0)); let did=false; for(const r of R){ if(wInvest(r.k).ok){ did=true; break; } } if(!did) break; n++; } WBANKS.forEach(b=>wBuy(b[0])); };
  for(const tg of [5,10,20,30,40]){ grow(tg); if(wTier()>=4){ for(let i=0;i<5;i++) wCoin('emit'); } run(60); o.push('part '+wWorld().toFixed(1)+' % palier '+wTier()+' : bénéfice net/j '+(tot()/1e6).toFixed(0)+' M€ · mondial/j '+(['pay','aum','sta','coin'].reduce((a,k)=>a+(W().rv[k]||0),0)/1e6).toFixed(0)+' M€ · coût pt Europe '+(wPtCost(WREG[0])/1e9).toFixed(0)+' Md€'); }
  ui.tab='bank'; ui.bk='own'; ui.bkw='world'; render(); window.scrollTo(0,0); return o.join('\n'); }));
await p.waitForTimeout(2500); await p.screenshot({path:'/home/claude/work/w1.png'}); for(const [i,y] of [[2,700],[3,800],[4,800],[5,800]]){ await p.evaluate(y=>window.scrollBy(0,y),y); await p.waitForTimeout(300); await p.screenshot({path:'/home/claude/work/w'+i+'.png'}); }
console.log('ERR',errs.slice(0,5)); await br.close();})();
