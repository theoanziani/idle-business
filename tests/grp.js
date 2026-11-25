const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ S.cash=5e10; S.peakNW=1e12; if(S.tut) S.tut.off=true; for(let d=0;d<60;d++) nextDay(); const R=rivInit(); const rid=Object.keys(R.rv).find(k=>shopsOf(k).length); R.rv[rid].pow=.5; const n0=S.biz.length; const r=buyGroup(rid); render(); return JSON.stringify(r)+' +'+(S.biz.length-n0)+' modal '+(ui.modal&&ui.modal.type); }));
await p.waitForTimeout(500); await p.screenshot({path:'/home/claude/work/grp.png'});
await p.click('[data-a="grpall"][data-v="full"]'); await p.waitForTimeout(300);
console.log(await p.evaluate(()=>S.biz.slice(-5).map(b=>b.name+':'+b.dl+':'+!!b.boss).join(' | ')));
console.log('ERR',errs); await br.close();})();
