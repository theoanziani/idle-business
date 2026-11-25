const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2,hasTouch:true});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ S.cash=5e10; S.peakNW=1e12; if(S.tut) S.tut.off=true; S.tipsOff=1; ui.theme='dark'; document.documentElement.setAttribute('data-theme','dark');
  const bd=fabPlots('paris','auto')[0]; const r=fabBuild('auto',bd.id); const s=fabSite(+r.msg); ui.tab='logi'; ui.fab={s:s.id,np:1,npSel:'ber'}; render(); return 'ship '+s.ship; }));
await p.waitForTimeout(400); await p.screenshot({path:'/home/claude/work/b1.png'});
await p.click('[data-a="fabnl"][data-i="ber"]'); await p.waitForTimeout(400); await p.screenshot({path:'/home/claude/work/b2.png'});
// tracer au doigt : drag sur la grille
await p.evaluate(()=>document.querySelector('.fab-grid').scrollIntoView({block:'center'})); await p.waitForTimeout(200); const box=await p.locator('.fab-grid').boundingBox(); const cw=box.width/(8*40+4)*40, ox=box.x+2*box.width/(8*40+4), oy=box.y+2*box.width/(8*40+4);
await p.mouse.move(ox+cw*0.5, oy+cw*1.5); await p.mouse.down(); for(let y=1;y<=8;y++){ await p.mouse.move(ox+cw*0.5+cw*0, oy+cw*(y+.5)); } for(let x=1;x<=6;x++) await p.mouse.move(ox+cw*(x+.5), oy+cw*8.5); await p.mouse.up(); await p.waitForTimeout(400);
console.log(await p.evaluate(()=>{ const [s,l]=fabLn(); const A=fabAnalyze(s,l); return 'path ok '+A.ok+' L '+A.L+' cv '+l.g.filter(x=>x[0]==='cv').length; }));
await p.evaluate(()=>{ const U=fabUI(); U.ptab='mach'; U.tool='sou'; render(); }); await p.waitForTimeout(400); await p.screenshot({path:'/home/claude/work/b3.png'});
console.log(await p.evaluate(()=>{ const [s,l]=fabLn(); let n=0; if(!fabAnalyze(s,l).ok) fabRoute(s.id,l.id); for(let i=0;i<8;i++){ const r=fabDoNext(s.id,l.id); if(!r.ok) break; n++; } const A=fabAnalyze(s,l); const N=fabNext(s,l); render(); return 'ajouts '+n+' rate '+fabU(A.rate)+' eff '+Math.round(A.eff*100)+' étape '+N.step+' '+N.txt; }));
await p.waitForTimeout(300); await p.screenshot({path:'/home/claude/work/b4.png'});
await p.evaluate(()=>{ ui.modal={type:'fabprod',p:'a2'}; S.peakNW=1e13; render(); }); await p.waitForTimeout(300); await p.screenshot({path:'/home/claude/work/b5.png'});
await p.evaluate(()=>{ ui.modal=null; const s=fabSites()[0]; ui.fab={s:s.id,tab:'stock'}; render(); }); await p.waitForTimeout(300); await p.screenshot({path:'/home/claude/work/b6.png'});
console.log(await p.evaluate(()=>{ const s=fabSites()[0]; s.ship='svc'; launchBiz('dealer',1,'paris'); for(let d=0;d<10;d++) nextDay(); const b=S.biz.find(x=>x.def==='dealer'); b.src='mix'; for(let d=0;d<5;d++) nextDay(); return 'livré '+Math.round(s.d.own||0)+' dealer supIn '+Math.round(b.supIn||0); }));
console.log('ERR',errs); await br.close();})();
