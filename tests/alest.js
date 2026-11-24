const {chromium}=require('playwright');(async()=>{const br=await chromium.launch();const p=await br.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file:///home/claude/idle-business/index.html'); await p.waitForSelector('[data-a="slotnew"]'); await p.click('[data-a="slotnew"]'); await p.click('[data-a="startnew"]'); await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{ S.cash=1e11; if(S.tut) S.tut.off=true; const o=[];
  S.peakNW=1e14; let a; for(const c of ['paris'].concat(Object.keys(D.CITIES))) for(const d of D.CITIES[c].d) for(const x of bldList(c,d.id)){ if(a||!rentBuilding(x.id).ok) continue; if(launchBiz('airline',0,c,d.id,x.id,'T').ok){ a=S.biz[S.biz.length-1]; a.status='active'; metState(a); entRoles(a).forEach(([r,sl])=>hireFill(a,r,sl)); } }
  const m=a.m; o.push('hubs '+m.hubs+' img '+Math.round(m.img)+' fp '+m.fp+' flotte '+m.fl.map(p=>p.t).join(','));
  const HS=Object.values(AL_AP).filter(x=>x.hub).map(x=>x.id); m.hubs=HS.slice(); m.ext={}; HS.forEach(h=>m.ext[h]=3); const H='CDG'; const rows=[];
  const pairs=[]; HS.forEach(h=>HS.forEach(x=>{ if(h<x) pairs.push([h,x]); }));
  pairs.forEach(([H,X])=>{ const x={id:X}; Object.keys(AL_TY).forEach(t=>{ const d=alDist(H,x.id); if(d<3500||!alReach(t,d)) return; const r=alEst(a,H,x.id,t); rows.push([H+'-'+x.id+(alStop(t,d)?'*':''),t,d,Math.round(r.net),Math.round(r.rev),Math.round(r.cost),Math.round(r.lf*100),r.legs,Math.round(r.want)]); }); });
  const pos=rows.filter(r=>r[3]>0).length; o.push('estimations '+rows.length+' positives '+pos);
  rows.sort((x,y)=>y[3]-x[3]); o.push('meilleures: '+rows.slice(0,6).map(r=>r.join(' ')).join(' | '));
  o.push('pires: '+rows.slice(-4).map(r=>r.join(' ')).join(' | '));
  const byT={}; rows.forEach(r=>{ (byT[r[1]]=byT[r[1]]||[]).push(r); }); Object.keys(byT).forEach(t=>o.push(t+' positives '+byT[t].filter(r=>r[3]>0).length+'/'+byT[t].length+' remplissage moyen '+Math.round(byT[t].reduce((s,r)=>s+r[6],0)/byT[t].length)));
  [['CDG','JFK'],['LHR','JFK'],['CDG','DXB'],['CDG','HND'],['NAN','NCE'],['CDG','GRU'],['JFK','LAX']].forEach(([x,y])=>{ if(!AL_AP[x]||!AL_AP[y]) return; o.push(x+'-'+y+' '+alDist(x,y)+'km sz '+AL_AP[x].sz+'/'+AL_AP[y].sz+' : '+Object.keys(AL_TY).filter(t=>alReach(t,alDist(x,y))).map(t=>{ const r=alEst(a,x,y,t); return t+' net '+Math.round(r.net)+' rev '+Math.round(r.rev)+' coût '+Math.round(r.cost)+' rempl '+Math.round(r.lf*100)+'% vols '+r.legs+' dem '+Math.round(r.want); }).join(' ; ')); });
  // détail d'un coût : CDG-NCE m180
  const T=AL_TY.m180, d=alDist(H,'NCE'); o.push('CDG-NCE m180 d '+d+' block '+alBlock('m180',d).toFixed(2)+' legs max '+alLegs('m180',d)+' carburant/vol '+Math.round(T.burn*d*alFuel(a))+' équipage/vol '+Math.round(alBlock('m180',d)*T.crew)+' location/j '+T.ls+' prix éco '+Math.round(alEco(d)));
  return o.join('\n'); }));
console.log('ERR',errs.slice(0,3)); await br.close();})();
