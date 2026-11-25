const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ S.cash=1e12; S.peakNW=1e13; if(S.tut) S.tut.off=true; const r=launchBiz('dealer',0,'paris'); for(let d=0;d<40;d++) nextDay(); const b=S.biz.find(x=>x.def==='dealer'); ui.modal={type:'biz',id:b.id}; render(); return JSON.stringify(r); }));
await p.waitForTimeout(1500); await p.screenshot({path:'/home/claude/work/dealer.png'});
console.log('ERR',errs); await br.close();})();
