const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ S.cash=1e9; S.peakNW=1e10; if(S.tut) S.tut.off=true; S.tipsOff=1; ui.theme='dark'; document.documentElement.setAttribute('data-theme','dark');
  ['hotel','resto','airline','park'].forEach(d=>launchBiz(d,1,'paris')); for(let d=0;d<40;d++) nextDay(); S.wmoN=S.day+1; S.wmoLast={k:'x'}; return 'ok'; }));
// forcer le krach du tourisme
await p.evaluate(()=>{ const _p=pick; window.__pk=_p; });
await p.evaluate(()=>{ S.wmoN=S.day; }); 
await p.evaluate(()=>{ const orig=Object.keys; }); 
await p.click('[data-a="next"]'); await p.waitForTimeout(800);
console.log(await p.evaluate(()=>JSON.stringify({wev:S.wmo, modal:ui.modal&&ui.modal.type, q:(ui.mq||[]).map(m=>m.type)})));
for(let i=0;i<3&&await p.evaluate(()=>ui.modal&&ui.modal.type!=='wmo');i++){ await p.click('[data-a="closemodal"]'); await p.waitForTimeout(300); }
await p.waitForTimeout(600); await p.screenshot({path:'/home/claude/work/w1.png'});
await p.evaluate(()=>document.querySelector('.ov').scrollTop=600); await p.waitForTimeout(300); await p.screenshot({path:'/home/claude/work/w2.png'});
await p.click('[data-a="wmogo"]'); await p.waitForTimeout(300);
await p.evaluate(()=>{ for(let d=0;d<8;d++) nextDay(); ui.modal=null; ui.mq=[]; ui.tab='home'; render(); window.scrollTo(0,0); }); await p.waitForTimeout(500); await p.screenshot({path:'/home/claude/work/w3.png'});
console.log(await p.evaluate(()=>JSON.stringify(S.wmo)));
console.log('ERR',errs); await br.close();})();
