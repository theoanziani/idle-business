const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/idle-business/index.html'); await p.evaluate(()=>{ localStorage.setItem('ib.m.1',JSON.stringify({slot:1,name:'T',day:412,nw:12482310,biz:8,updated:Date.now()})); document.documentElement.setAttribute('data-theme','dark'); });
await p.reload(); await p.waitForTimeout(1100); await p.screenshot({path:'/home/claude/work/sp1.png'}); await p.waitForTimeout(1400); await p.screenshot({path:'/home/claude/work/sp2.png'});
await p.evaluate(()=>localStorage.setItem('grandlivre.ui',JSON.stringify(Object.assign(JSON.parse(localStorage.getItem('grandlivre.ui')||'{}'),{theme:'light'}))));
await p.reload(); await p.waitForTimeout(2500); await p.screenshot({path:'/home/claude/work/sp3.png'});
await p.waitForTimeout(1200); console.log('splash restant', await p.$('#splash')!==null, 'ERR',errs); await br.close();})();
