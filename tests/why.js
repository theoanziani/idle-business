const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();
for(const def of process.argv.slice(2)){ const p=await br.newPage(); p.on('pageerror',e=>console.log(def,'ERR',e.message));
await p.goto('file:///home/claude/idle-business/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
const r=await p.evaluate(def=>{ S.cash=2e10; S.peakNW=5e11; if(S.tut) S.tut.off=true; let id;
 for(const c of Object.keys(D.CITIES)){ for(const d of D.CITIES[c].d){ for(const x of bldList(c,d.id)){ if(bldMaxLvl(x,def)<3) continue; if(!rentBuilding(x.id).ok) continue; const r=launchBiz(def,0,c,d.id,x.id,"T"); if(r.ok){ const b=S.biz[S.biz.length-1]; b.status='active'; entRoles(b).forEach(([r,sl])=>hireFill(b,r,sl)); id=b.id; break; } } if(id) break; } if(id) break; }
 if(!id) return def+' : pas de local';
 const b=S.biz.find(x=>x.id===id); metState(b); b.boss=genBoss(b); b.dl='full'; b.dlb=2; b.dlg=1;
 /* paliers de maîtrise au maximum pour tout débloquer */
 mxRank=()=>5;
 const W=[0,0,0,0,0]; let n=0; const lab={}; const _ms=metBuy; metBuy=function(bb,c,l){ const r=_ms.apply(this,arguments); if(r&&bb===b){ W[Math.min(4,Math.floor(S.day/240))]++; lab[l.replace(/[:(].*$/,'').trim()]=1; } return r; };
 for(let i=0;i<500;i++){ if(i%30===0){ b.dlp=Math.max(b.dlp||0,Math.min(5e9,bizDef(b).cost*200)); S.cash=Math.max(S.cash,2e10); } doNext(1); if(i%60===0) entRoles(b).forEach(([r,sl])=>hireFill(b,r,sl)); }
 const g=dlGoal(b); let left=[]; try{ left=metCtl(b).filter(c=>(c.k==='buy'||(c.k==='btn'&&c.once))&&!c.owned&&c.cost>0).map(c=>c.label+(c.dis?' [bloqué]':'')); }catch(e){}
 const bd=b.bld&&bldById(b.bld); let rel=null; try{ rel=dlRelocPick(b); rel=rel&&{mx:rel.mx}; rel={pick:rel, all:relocCands(b,1).map(x=>[x.mx,x.fit]), free:D.CITIES[cityOf(b).id||b.city]?1:0}; }catch(e){ rel='err' } const why={up:!!b.up,bmax:bd&&bldMaxLvl(bd,b.def),n30:Math.round(dlNetL(b)),upN:Math.round(b.dlUpN||0),upD:b.dlUpD,day:S.day,skipRel:dlSkipped(b,'rel'),skipUp:dlSkipped(b,'up'),rel};
 return JSON.stringify({why,def,par240:W,lvl:b.lvl,goal:g&&g.n,net:Math.round(dlNetL(b)),left:left.slice(0,6),achats:Object.keys(lab).slice(0,14)}); },def);
 console.log(r); await p.close(); }
await br.close();})();
