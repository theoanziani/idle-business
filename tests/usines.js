const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:400,height:860},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
await p.goto('http://localhost:8765/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ S.cash=5e10; S.peakNW=1e12; ui.theme='dark'; document.documentElement.setAttribute('data-theme','dark'); if(S.tut) S.tut.off=true; const o=[];
  o.push('phones ? '+!!D.biz.phones+' ; bizOrder farm ? '+D.bizOrder.includes('farm'));
  const res={};
  FAB_ORDER.forEach(t=>{ const city=['paris','lyon','marseille','toulouse','barcelone','zagreb','miami','rio','pekin'].find(c=>D.CITIES[c]&&cityUnlocked(c)&&fabPlots(c,t).length)||D.CITY_ORDER.find(c=>cityUnlocked(c)&&fabPlots(c,t).length);
    if(!city){ o.push(t+' : aucun terrain'); return; } const bd=fabPlots(city,t)[0]; const r=fabBuild(t,bd.id); if(!r.ok){ o.push(t+' build '+r.msg); return; }
    const s=fabSite(+r.msg); if(t==='farm'){ fabParcelBuy(s.id,'ble',10); fabParcelBuy(s.id,'vaches',6); fabParcelBuy(s.id,'vigne',6); }
    fabProdsOf(t).forEach((pp,i)=>{ if(s.lines.length>=fabSlots(s)) fabHall(s.id); const rl=fabLineNew(s.id,pp); if(!rl.ok){ o.push(t+' line '+rl.msg); return; } const ra=fabAuto(s.id,+rl.msg); if(!ra.ok) o.push(t+' auto '+ra.msg); });
    res[t]=s.id; });
  const c0=S.cash;
  for(let d=0;d<30;d++) nextDay();
  fabSites().forEach(s=>{ const L=s.lines.map(l=>{ const A=fabAnalyze(s,l), E=fabLineEco(s,l), cost=fabLineValue(s,l); return l.p+' '+fabU(A.rate)+'/j eff '+Math.round(A.eff*100)+'% net '+Math.round(E.net)+' pb '+(E.net>0?Math.round(cost/E.net):'∞')+'j'+(A.msg?' ['+A.msg+']':''); }); o.push(s.t+' @'+s.city+' : '+L.join(' | ')); });
  o.push('jour fab : '+JSON.stringify({rev:Math.round(S.fab.day.rev),cost:Math.round(S.fab.day.cost),mat:Math.round(S.fab.day.mat),net:Math.round(S.fab.day.net)}));
  ui.tab='logi'; render(); return o.join('\n'); }));
await p.waitForTimeout(600); await p.screenshot({path:'/home/claude/work/u1.png'});
await p.evaluate(()=>{ const s=fabSites().find(x=>x.t==='auto'); ui.fab={s:s.id}; render(); }); await p.waitForTimeout(400); await p.screenshot({path:'/home/claude/work/u2.png'});
await p.evaluate(()=>{ const s=fabSites().find(x=>x.t==='auto'); ui.fab={s:s.id,l:s.lines[1].id}; render(); window.scrollTo(0,0); }); await p.waitForTimeout(800); await p.screenshot({path:'/home/claude/work/u3.png'});
await p.evaluate(()=>window.scrollTo(0,900)); await p.waitForTimeout(300); await p.screenshot({path:'/home/claude/work/u4.png'});
console.log('ERR',errs.slice(0,8)); await br.close();})();
