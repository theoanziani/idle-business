const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage();
await p.goto('file:///home/claude/idle-business/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ const out=[]; D.CITY_ORDER.forEach(id=>{ const C=D.CITIES[id]; let rentAll=0,n=0; C.d.forEach(d=>bldList(id,d.id).forEach(bd=>{ if(bd.t==='home') return; rentAll+=bldRent(bd); n++; })); out.push([id, Math.round(cityPriceEur(id)/1e6)+'M', n+' bât', Math.round(rentAll)+' €/j loyers', Math.round(cityPriceEur(id)/Math.max(1,rentAll))+' j']); });
 const fi=(function(){ const s=String(cityIncome||''); return s.slice(0,600); })(); return JSON.stringify(out)+'\n'+fi; }));
await br.close();})();
