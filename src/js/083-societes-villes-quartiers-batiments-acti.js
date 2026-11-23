/* ============================================================
   SOCIÉTÉS : villes > quartiers > bâtiments > activité
   ============================================================ */
const lvlPill = n => pill('€'.repeat(n)+'<span style="opacity:.3">'+'€'.repeat(4-n)+'</span>', n>=4?'bad':n>=3?'warn':'');
const pEur = (cid,dd) => dd.p*D.CCY[D.CITIES[cid].ccy].eur;
const standing = q => q>=1.12? 'Haut standing' : q<=.9? 'Standing modeste' : 'Bon standing';
function bizAddr(b){ if(b.bld){ const bd=bldById(b.bld); if(bd) return bd.addr+', '+cityOf(b).n; } return distOf(b).n+', '+cityOf(b).n; }
function bldLocHtml(b){
  const bd=bldById(b.bld), h=bldHeld(b.bld)||{}, own=h.st==='own', co=cityOwned(b.city), mx=bldMaxLvl(bd,b.def);
  return '<div class="stack"><div class="row sp"><b>Bâtiment</b>'+(co? pill('Ville à vous','good') : own? pill('Propriétaire','good') : pill('Locataire',''))+'</div>'+
    '<div class="sub">'+esc(bd.addr)+' · '+D.BT[bd.t].n+' de '+fmtN(bd.surf)+' m², '+standing(bd.q).toLowerCase()+'. Niveau '+mx+' au maximum ici.</div>'+
    '<div class="sub">Loyer : '+eur(bldRent(bd)*(1-0.7*ownShare(b)),0)+' / jour'+(own?' (charges et taxes)':'')+'.'+(own?' Valeur : '+eur(bldValue(b.bld),0)+'.':'')+'</div>'+
    (!own&&!co? '<div>'+btn('Acheter le bâtiment : '+eur(bldPrice(bd),0),'bldbuy',{c:'sm pri',i:b.bld})+'</div><div class="sub">Propriétaire, vous ne payez plus que 30 % du loyer (charges et taxes).</div>' : '')+'</div>';
}
function vBiz(){
  const z=ui.bz||(ui.bz={c:null,d:null});
  if(z.c&&(!D.CITIES[z.c]||!cityUnlocked(z.c))){ z.c=null; z.d=null; }
  if(z.c&&z.d&&D.CITIES[z.c].d.some(x=>x.id===z.d)) return vBizDist(z.c,z.d);
  if(z.c) return vBizCity(z.c);
  return vBizHome();
}
function vBizHome(){
  let tot=0,emp=0; S.biz.forEach(b=>{ emp+=headcount(b); if(b.last) tot+=b.last.net; });
  let h=head('Sociétés','',S.biz.length?'<span class="pill info">'+plu(S.biz.length,'société')+'</span><span class="pill">'+plu(emp,'employé')+'</span><span class="pill '+(tot>=0?'good':'bad')+'">'+signed(tot,0)+' / j</span>':'');
  h+='<div class="cat-h">Villes</div><div class="tiles">'+D.CITY_ORDER.filter(cityUnlocked).map(cid=>{ const C=D.CITIES[cid], n=S.biz.filter(b=>b.city===cid).length, lv=Math.round(C.d.reduce((a,x)=>a+rentLevel(pEur(cid,x)),0)/C.d.length);
    return '<div class="tile"><button class="go" data-a="bzcity" data-i="'+cid+'">'+(CITY_ART[cid]? cityBanner(cid,'thumb still') : '<span class="ic">'+icon('cities')+'</span>')+'<span style="min-width:0;flex:1"><b>'+esc(C.n)+'</b><small>'+esc(C.country)+' · '+C.d.length+' quartiers'+(n?' · '+plu(n,'société')+'':'')+'</small></span>'+lvlPill(lv)+'</button></div>'; }).join('')+'</div>';
  const free=Object.keys(S.bld||{}).filter(id=>{ const x=S.bld[id]; return !(x.biz&&S.biz.some(b=>b.id===x.biz)); });
  if(free.length) h+='<div class="cat-h">Bâtiments sans activité</div><div class="grid">'+free.map(id=>{ const bd=bldById(id), x=S.bld[id];
    return '<section class="card bc"><div class="hd"><div><b>'+esc(bd.addr)+'</b><div class="sub">'+esc(distOfB(bd).n)+', '+esc(D.CITIES[bd.city].n)+' · '+D.BT[bd.t].n+' · '+fmtN(bd.surf)+' m²</div></div>'+pill(x.st==='own'?'À vous':'Loué',x.st==='own'?'good':'info')+'</div>'+
      '<div class="row">'+btn('Établir une société','estab',{c:'sm pri',i:id})+btn('Voir le quartier','bzdist',{c:'sm ghost',i:bd.city,j:bd.dist})+'</div></section>'; }).join('')+'</div>';
  h+='<div class="cat-h">Vos sociétés</div>'+(S.biz.length? '<div class="grid">'+S.biz.map(bizCard).join('')+'</div>' : '<div class="notice info">Choisissez une ville, puis un quartier et un bâtiment à louer ou acheter. Vous y établirez ensuite une activité adaptée au lieu.</div>');
  return h;
}
function vBizCity(cid){
  const C=D.CITIES[cid];
  let h='<button class="back" data-a="bzback" data-v="0">‹ Villes</button>'+cityBanner(cid,'hero')+head(esc(C.n));
  h+='<div class="sub" style="margin:-6px 0 12px">'+esc(C.txt)+'</div>'+tip('city')+'<div class="grid">'+C.d.map(dd=>{
    const L=bldList(cid,dd.id), rs=L.map(bldRent), lo=Math.min(...rs), hi=Math.max(...rs), mine=S.biz.filter(b=>b.city===cid&&b.dist===dd.id).length, held=L.filter(x=>bldHeld(x.id)).length;
    return '<button class="card bc dist" data-a="bzdist" data-i="'+cid+'" data-j="'+dd.id+'"><div class="hd"><div><b>'+esc(dd.n)+'</b><div class="sub">'+esc(dd.cl)+'</div></div>'+lvlPill(rentLevel(pEur(cid,dd)))+'</div>'+
      '<div class="row sp"><span class="sub">Loyers de '+eur(lo,0)+' à '+eur(hi,0)+' / j</span><span class="sub">'+eur(dd.p*fxOf(C.ccy),0)+' / m²</span></div>'+
      '<div class="row">'+dots(dd.crime)+'<span class="sub">Idéal : '+dd.fav.slice(0,3).map(secName).join(', ')+'</span></div>'+
      '<div class="sub">'+L.length+' bâtiments'+(held?' · '+held+' à vous':'')+(mine?' · '+plu(mine,'société')+'':'')+'</div></button>'; }).join('')+'</div>';
  return h;
}
function bldCard(bd){
  { const o=rivShopAt(bd.id); if(o) return rivBldCard(bd,o); }
  const C=D.CITIES[bd.city], h=bldHeld(bd.id), b=h&&h.biz&&S.biz.find(x=>x.id===h.biz), defs=bldDefs(bd), ok=defs.filter(d=>unlocked(D.biz[d].tier)), co=cityOwned(bd.city);
  let act;
  if(b) act='<div class="row sp">'+pill(esc(b.name),'info')+btn('Gérer','bizopen',{c:'sm pri',i:b.id})+'</div>';
  else if(h) act='<div class="row">'+(bd.t==='home'||consOf(bd.id)?'':btn('Établir une société','estab',{c:'sm pri',i:bd.id}))+(h.st==='rent'&&!co?btn('Acheter '+eur(bldPrice(bd),0),'bldbuy',{c:'sm',i:bd.id}):'')+btn(h.st==='own'?'Vendre':co?'Libérer':'Résilier le bail','bldleave',{c:'sm ghost dng',i:bd.id})+'</div>';
  else { const dep=co?0:bldRent(bd)*30, can=availFor(C.ccy)>=dep;
    act='<div class="row">'+btn(co?'Occuper (ville à vous)':'Louer · dépôt '+eur(dep,0),'bldrent',{c:'sm pri',i:bd.id,dis:!can})+(co?'':btn('Acheter '+eur(bldPrice(bd),0),'bldbuy',{c:'sm',i:bd.id}))+'</div>'; }
  return '<section class="card bc'+(h?' held':'')+'"><div class="hd"><div><b>'+esc(bd.addr)+'</b><div class="sub">'+D.BT[bd.t].n+' · '+fmtN(bd.surf)+' m² · '+standing(bd.q)+'</div></div>'+(h? pill(h.st==='own'||co?'À vous':'Loué','good') : '')+'</div>'+
    '<div class="row sp"><div><div class="tag">Loyer</div><b class="num">'+(co?'—':eur(bldRent(bd),0)+' / j')+'</b></div><div style="text-align:right"><div class="tag">Prix</div><b class="num">'+eur(bldPrice(bd),0)+'</b></div></div>'+
    (bd.t==='home'?'':'<div class="sub">'+(ok.length? 'Pour : '+ok.slice(0,4).map(d=>esc(D.biz[d].n)).join(', ')+(ok.length>4?' (+'+(ok.length-4)+')':'') : 'Aucune activité disponible à votre palier')+(defs.length>ok.length?' · '+(defs.length-ok.length)+' à débloquer':'')+'.</div>')+act+bldExtra(bd)+'</section>';
}
function vBizDist(cid,did){
  const C=D.CITIES[cid], dd=C.d.find(x=>x.id===did), L=bldList(cid,did);
  let h='<button class="back" data-a="bzback" data-v="1">‹ '+esc(C.n)+'</button>'+head(esc(dd.n),'',lvlPill(rentLevel(pEur(cid,dd))));
  h+='<div class="row" style="margin:-6px 0 12px">'+dots(dd.crime)+'<span class="sub">'+esc(dd.cl)+' · idéal : '+dd.fav.slice(0,3).map(secName).join(', ')+'</span></div>';
  h+=tip('dist');
  if(cityOwned(cid)) h+='<div class="notice good">Vous possédez cette ville : tous ses bâtiments sont à votre disposition, sans loyer.</div>';
  h+='<div class="grid">'+L.map(bldCard).join('')+'</div>';
  return h;
}
function modalEstab(id){
  const bd=bldById(id); if(!bd){ ui.modal=null; return null; }
  const dd=distOfB(bd), inv=ui.tmp.inv||0, defs=bldDefs(bd).filter(d=>!(ui.fm&&ui.fm.d)||D.FACT[d]);
  let body='<div class="sub">'+esc(bd.addr)+' · '+D.BT[bd.t].n+' de '+fmtN(bd.surf)+' m² · '+esc(dd.n)+', '+esc(D.CITIES[bd.city].n)+'</div>';
  if(defs.some(d=>D.biz[d].startup)) body+='<div class="row"><span class="sub">Financement des start-ups</span><div class="seg">'+['Standard','Ambitieux','Croissance'].map((n,i)=>'<button class="'+(inv===i?'on':'')+'" data-a="launchlv" data-v="'+i+'">'+n+'</button>').join('')+'</div></div>';
  const est={}; defs.forEach(def=>{ est[def]=unlocked(D.biz[def].tier)? estNet(def,bd) : null; });
  defs.sort((x,y)=>(unlocked(D.biz[y].tier)-unlocked(D.biz[x].tier))||((est[y]===null?-1e12:est[y])-(est[x]===null?-1e12:est[x])));
  body+='<div class="sub">Bénéfice estimé avec une équipe complète et des réglages standards, loyer de ce bâtiment compris.</div>';
  body+='<div class="stack">'+defs.map(def=>{ const d=D.biz[def], lock=!unlocked(d.tier), iv=d.startup?inv:0, c=launchCost(def,iv,bd.city,bd.dist), f=fitLabel(bizSec(def),dd), can=availFor(D.CITIES[bd.city].ccy)>=c;
    return '<div class="opt'+(lock?' lock':'')+'">'+actBanner(def,'opt still')+'<div class="row sp"><b>'+esc(d.n)+'</b><span class="num"><b>'+eur(c,0)+'</b></span></div><div class="sub">'+esc(d.sub)+' · ouverture en '+(d.startup? d.startup.ph.reduce((a,p)=>a+p[1],0):d.launch)+' j · amortie en ~'+d.payback+' j · niveau '+bldMaxLvl(bd,def)+' max ici</div>'+
      '<div class="row sp"><span class="row">'+pill(f[0],f[1])+(d.startup?pill('Start-up','warn'):'')+(est[def]!==null&&est[def]!==undefined?pill('≈ '+signed(est[def],0)+' / j',est[def]>0?'good':'bad'):'')+'</span>'+(lock? '<span class="sub">Palier '+D.TIERS[d.tier].n+'</span>' : btn('Lancer','estgo',{c:'sm pri',i:id,j:def,v:iv,dis:!can}))+'</div></div>'; }).join('')+'</div>';
  return {title:'Établir une société',body,sm:true};
}
Object.assign(ACT,{
  bzcity:el=>{ if(S.tut) S.tut.city=1; ui.bz={c:el.dataset.i,d:null}; window.scrollTo(0,0); render(); },
  bzdist:el=>{ ui.bz={c:el.dataset.i,d:el.dataset.j}; ui.tab='biz'; window.scrollTo(0,0); render(); },
  bzback:el=>{ if(el.dataset.v==='1') ui.bz.d=null; else ui.bz={c:null,d:null}; window.scrollTo(0,0); render(); },
  bldrent:el=>{ const r=rentBuilding(el.dataset.i); if(r.ok){ ui.tmp.inv=0; ui.modal={type:'estab',id:el.dataset.i}; } after(r); },
  bldbuy:el=>{ const bd=bldById(el.dataset.i); ask('Acheter le bâtiment',esc(bd.addr)+' : <b>'+eur(bldPrice(bd),0)+'</b>. Vous ne payez plus que 30 % du loyer (charges et taxes) et le bien suit le marché immobilier.','Acheter',()=>after(buyBuilding(bd.id),'Bâtiment acheté.')); },
  bldleave:el=>{ const h=bldHeld(el.dataset.i), bd=bldById(el.dataset.i); const co=cityOwned(bd.city); ask(h.st==='own'?'Vendre le bâtiment':co?'Libérer le bâtiment':'Résilier le bail',h.st==='own'? 'Vous encaissez <b>'+eur(bldValue(bd.id)*.95,0)+'</b>.' : co? 'Le bâtiment redevient libre.' : 'Le dépôt de garantie vous est rendu.',h.st==='own'?'Vendre':co?'Libérer':'Résilier',()=>after(leaveBuilding(bd.id))); },
  estab:el=>{ ui.tmp.inv=0; ui.modal={type:'estab',id:el.dataset.i}; render(); },
  estgo:el=>{ const r=launchBiz(el.dataset.j,+el.dataset.v,null,null,el.dataset.i); if(r.ok) ui.modal=null; after(r,'Société lancée.'); }
});

