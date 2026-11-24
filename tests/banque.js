/* Progression d'une banque à travers les cinq étapes, avec politique d'accord automatique */
const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/idle-business/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(3200);
console.log(await p.evaluate(()=>{ S.cash=5e12; S.peakNW=5e13; if(S.tut) S.tut.off=true; const o=[], B=S.bank;
  const run=(d)=>{ for(let i=0;i<d;i++) nextDay(); };
  const rep=t=>{ const rv=B.rv||{}; o.push(t+' étape '+bStg()+' dép '+(B.dep/1e6).toFixed(0)+'M prêts '+(bankLoans()/1e6).toFixed(0)+'M fp '+(bankEquity()/1e6).toFixed(0)+'M solv '+(bSolv()*100).toFixed(1)+'% revenus/j '+Object.keys(rv).map(k=>k+':'+(rv[k]/1e3).toFixed(0)+'k').join(' ')+' res '+(B.res/1e6).toFixed(0)+'M'); };
  bankLicence(); B.pol.auto=true; B.pol.minG='C'; B.rl=7; run(60); rep('J60');
  for(let k=2;k<=5;k++){ const T=BSTG[k-1]; const need=Math.max(0,T.eq*1.3-bankEquity()); bankInject(need); const r=bankUp(); o.push('passage '+k+' '+r.ok+' '+(r.msg||''));
    if(k===3) ['croatie','espagne','usa','bresil','chine'].forEach(c=>bankCtyOpen(c)); run(240); rep('après 240 j'); }
  borrow(1e9); o.push('dette propre '+(ownDebt()/1e6).toFixed(0)+'M');
  run(30); rep('J+30');
  ui.tab='bank'; ui.bk='own'; render(); window.scrollTo(0,0); return o.join('\n'); }));
await p.waitForTimeout(300); await p.screenshot({path:'/home/claude/work/b1.png'}); await p.evaluate(()=>window.scrollBy(0,760)); await p.waitForTimeout(200); await p.screenshot({path:'/home/claude/work/b2.png'});
console.log('ERR',errs.slice(0,5)); await br.close();})();
