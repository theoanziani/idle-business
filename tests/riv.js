const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ if(S.tut) S.tut.off=true; const o=[]; rivInit(); const snap=d=>{ const M=magnates(); o.push('j'+d+' moi '+Math.round(S.nw/1e6)+'M | '+M.filter(x=>!x.me).map(x=>x.n.split(' ')[0]+' '+Math.round(x.v/1e6)).join(' ')); };
  snap(0); S.cash+=2e6;
  for(let d=1;d<=360;d++){ if(d===120) S.cash+=5e8; if(d===240) S.cash+=2e10; nextDay(); if(d%60===0) snap(d); }
  const R=rivHold(); o.push('plans '+R.plans.length+' holds city '+Object.keys(R.hold.city).length+' club '+Object.keys(R.hold.club).length+' bank '+Object.keys(R.hold.bank).length+' fab '+R.fab.length);
  const k=Object.keys(R.hold.city)[0]; if(k){ const c0=S.cash, r=buyCity(k); o.push('rachat ville '+k+' '+JSON.stringify(r)+' coût '+Math.round((c0-S.cash)/1e6)+'M prix '+Math.round(cityPriceEur(k)/1e6)); }
  ui.tab='rivals'; render(); return o.join('\n'); }));
await p.waitForTimeout(500); await p.screenshot({path:'/home/claude/work/riv.png'});
console.log('ERR',errs); await br.close();})();
