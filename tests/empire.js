const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/idle-business/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
await p.evaluate(()=>{ S.cash=1e12; S.peakNW=1e13; if(S.tut) S.tut.off=true;
  const open=(city)=>{ for(const d of D.CITIES[city].d){ for(const x of bldList(city,d.id)){ if(!rentBuilding(x.id).ok) continue; const r=launchBiz('repair',0,city,d.id,x.id,'T'); if(r.ok){ const b=S.biz[S.biz.length-1]; b.status='active'; entRoles(b).forEach(([r,sl])=>hireFill(b,r,sl)); return b; } } } };
  open('paris'); open('zagreb'); ['paris','marseille','toulouse'].forEach(buyCity); buyCountry('france'); for(let d=0;d<40;d++) nextDay(); ui.tab='plus'; render(); });
await p.screenshot({path:'/home/claude/work/s_plus.png'});
await p.evaluate(()=>{ ui.tab='empire'; render(); }); await p.waitForTimeout(200); await p.screenshot({path:'/home/claude/work/s_emp.png',fullPage:true});
console.log('ERR',errs); await br.close();})();
