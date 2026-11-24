/* Audit : toutes les lignes aériennes entre plateformes et toutes les lignes maritimes entre terminaux */
const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/idle-business/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ S.cash=1e13; S.peakNW=1e14; if(S.tut) S.tut.off=true; const o=[];
  const mk=def=>{ for(const c of Object.keys(D.CITIES)) for(const d of D.CITIES[c].d) for(const x of bldList(c,d.id)){ if(bldMaxLvl(x,def)<3||!rentBuilding(x.id).ok) continue; if(launchBiz(def,0,c,d.id,x.id,'T').ok){ const b=S.biz[S.biz.length-1]; b.status='active'; metState(b); return b; } } };
  /* aérien */
  const a=mk('airline'), m=a.m, H=Object.values(AL_AP).filter(x=>x.hub).map(x=>x.id); m.hubs=H.slice(); m.ext={}; H.forEach(h=>m.ext[h]=3);
  const bad=[], far=[], neg=[]; let n=0;
  H.forEach(h=>alDests(a,h).forEach(x=>{ if(x.id<h&&H.includes(x.id)) return; n++; const d=alDist(h,x.id), ty=Object.keys(AL_TY).filter(t=>alReach(t,d));
    if(!ty.length){ far.push(h+'-'+x.id+' '+d); return; }
    const t=ty[ty.length-1]; m.fl.push({id:99999,t,own:1,ln:-7}); const l={id:-7,a:h,b:x.id,p:1,cab:1}; m.ln.push(l); const r=alLineDay(a,l); m.ln.pop(); m.fl.pop();
    if(![r.rev,r.cost,r.net,r.pax].every(Number.isFinite)) bad.push(h+'-'+x.id); }));
  o.push('AÉRIEN '+n+' lignes testées ; hors de portée même avec escale : '+far.length+' '+far.slice(0,8).join(', ')+' ; calculs invalides : '+bad.length+' '+bad.slice(0,5).join(','));
  o.push('NAN-NCE '+alDist('NAN','NCE')+' km, avions possibles : '+Object.keys(AL_TY).filter(t=>alReach(t,alDist('NAN','NCE'))).join(','));
  /* maritime */
  const s=mk('shipping'), q=s.m, T=Object.values(SH_PT).filter(x=>x.tm).map(x=>x.id); q.tm=T.slice(); q.ext={}; T.forEach(h=>q.ext[h]=3);
  const ship=Object.keys(SH_TY).filter(k=>SH_TY[k].k==='box').pop(); const sb=[], sp=[]; let k=0;
  T.forEach(h=>shDests(s,h).forEach(x=>{ if(x.id<h&&T.includes(x.id)) return; k++; let P; try{ P=shPath(h,x.id,q,false); }catch(e){ sb.push(h+'-'+x.id+' '+e.message); return; }
    if(!P||!Number.isFinite(P.d)||P.d<=0){ sp.push(h+'-'+x.id+' d='+(P&&P.d)); return; }
    q.fl.push({id:99999,t:ship,own:1,ln:-7}); const l={id:-7,a:h,b:x.id,p:1}; q.ln.push(l); let r; try{ r=shLineDay(s,l); }catch(e){ sb.push(h+'-'+x.id+' '+e.message); } q.ln.pop(); q.fl.pop();
    if(r&&!Object.values(r).filter(v=>typeof v==='number').every(Number.isFinite)) sb.push(h+'-'+x.id+' NaN'); }));
  o.push('MARITIME '+k+' lignes testées ; route invalide : '+sp.length+' '+sp.slice(0,8).join(', ')+' ; erreurs : '+sb.length+' '+sb.slice(0,5).join(' | '));
  return o.join('\n'); }));
console.log('ERR',errs.slice(0,5)); await br.close();})();
