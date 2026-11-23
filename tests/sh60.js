const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage();
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+process.argv[2]); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(600);
console.log(await p.evaluate(()=>{ S.cash=5e11; S.peakNW=5e12; if(S.tut) S.tut.off=true; let id;
 for(const c of Object.keys(D.CITIES)){ for(const d of D.CITIES[c].d){ for(const x of bldList(c,d.id)){ if(bldMaxLvl(x,'shipping')<3) continue; if(!rentBuilding(x.id).ok) continue; const r=launchBiz('shipping',0,c,d.id,x.id,"T"); if(r.ok){ const b=S.biz[S.biz.length-1]; b.status='active'; id=b.id; break; } } if(id) break; } if(id) break; }
 const b=S.biz.find(x=>x.id===id); metState(b); b.boss=genBoss(b); b.dl='full'; b.dlb=2; b.dlg=1; b.m.img=95;
 const out=[]; for(let i=0;i<900;i++){ if(i%30===0) b.dlp=Math.max(b.dlp||0,5e9); doNext(1); if(i%90===89){ const m=b.m; out.push({d:S.day,ln:m.ln.length,tm:m.tm.length,full:m.tm.filter(t=>shTmUsed(b,t)>=shTmCap(b,t)).length,maxq:m.tm.filter(t=>(m.ext||{})[t]>=3).length,lvl:b.lvl,goal:(dlGoal(b)||{}).n}); } }
 return JSON.stringify(out); }));
await br.close();})();
