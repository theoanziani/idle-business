/* ============================================================
   CONCURRENCE AVANCÉE : enseignes rivales, offres, groupes, classement
   ============================================================ */
function rivBldCard(bd,sh){
  const r=rivDef(sh.rid), d=D.biz[sh.def];
  return '<section class="card bc riv-occ"><div class="hd"><div><b>'+esc(bd.addr)+'</b><div class="sub">'+D.BT[bd.t].n+' · '+fmtN(bd.surf)+' m²</div></div>'+pill(esc(r.n),'warn')+'</div>'+
    '<div class="sub">Occupé : '+esc(d.n)+' niveau '+sh.lvl+(sh.counter?' · contre-offre en cours : <b>'+eur(sh.counter.px,0)+'</b>':'')+'.</div>'+
    '<div class="row">'+btn('Faire une offre de rachat','shopopen',{c:'sm',i:sh.id})+'</div></section>';
}
function modalShop(id){
  const sh=S.riv.shops.find(x=>x.id===id); if(!sh){ ui.modal=null; return null; }
  const r=rivDef(sh.rid), d=D.biz[sh.def], bd=bldById(sh.bld), v=shopVal(sh), lock=!unlocked(d.tier);
  let body='<div class="sub">'+esc(bd.addr)+', '+esc(distOfB(bd).n)+', '+esc(cityName(sh.city))+'</div>'+
    '<div class="mini"><div><span>Activité</span><b style="font-size:16px">'+esc(d.n)+'</b></div><div><span>Niveau</span><b>'+sh.lvl+'</b></div><div><span>Valeur estimée</span><b class="num">'+eur(v,0)+'</b></div><div><span>Bénéfice / j</span><b class="num">'+eur(shopProfit(sh),0)+'</b></div></div>';
  if(lock) body+='<div class="notice">Activité accessible au palier '+D.TIERS[d.tier].n+'.</div>';
  else if(sh.counter) body+='<div class="notice info">'+esc(r.n)+' propose <b>'+eur(sh.counter.px,0)+'</b> jusqu’au '+dateL(sh.counter.exp)+'.</div><div class="row sp">'+btn('Refuser','shopno',{c:'ghost',i:sh.id})+btn('Accepter '+eur(sh.counter.px,0),'shopyes',{c:'pri',i:sh.id})+'</div>';
  else if(sh.cool&&S.day<sh.cool) body+='<div class="notice">'+esc(r.n)+' refuse de négocier avant le '+dateL(sh.cool)+'.</div>';
  else body+='<div class="tag">Votre offre</div><div class="row">'+[.8,.9,1,1.1,1.25].map(k=>btn(Math.round(k*100)+' % · '+eur(Math.round(v*k/100)*100,0),'shopbid',{c:'sm'+(k===1?' pri':''),i:sh.id,v:Math.round(v*k/100)*100})).join('')+'</div><div class="sub">Une offre trop basse vexe le vendeur (10 jours sans négociation) ; une offre proche de son prix entraîne une contre-offre. L’enseigne rachetée ouvre aussitôt avec son équipe.</div>';
  return {title:'Racheter : '+esc(r.n),body,sm:true};
}
function magnatesCard(){
  const L=magnates();
  return card('Classement des magnats','<div class="stack">'+L.map((x,i)=>'<div class="row sp" style="'+(x.me?'font-weight:700':'')+'"><span>'+(i+1)+'. '+esc(x.n)+'</span><span class="row" style="gap:8px">'+spark(x.ph,60,22)+'<span class="num">'+eur(x.v,0)+'</span></span></div>').join('')+'<div class="sub">Valeur nette estimée. Touchez un groupe ci-dessous pour voir ses enseignes.</div></div>');
}
function modalRival(rid){
  const r=rivDef(rid), v=S.riv.rv[rid]; if(!v||v.gone){ ui.modal=null; return null; }
  const sh=shopsOf(rid).filter(x=>cityVisible(x.city)).sort((a,b)=>shopVal(b)-shopVal(a));
  let body='<div class="mini"><div><span>Valeur estimée</span><b class="num">'+eur(rivNW(rid),0)+'</b></div><div><span>Enseignes</span><b>'+shopsOf(rid).length+'</b></div><div><span>Puissance</span><b class="num">'+fmtN(v.pow,2)+'</b></div></div>'+
    '<div><div class="tag">Bénéfice quotidien (60 jours)</div>'+lineChart(v.ph||[],{label:'Bénéfice de '+r.n,h:110})+'</div>';
  body+='<div class="stack">'+sh.slice(0,25).map(x=>'<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:6px"><div style="flex:1;min-width:160px"><b>'+esc(D.biz[x.def].n)+'</b> · niv. '+x.lvl+'<div class="sub">'+esc(bldById(x.bld).addr)+', '+esc(cityName(x.city))+' · '+eur(shopVal(x),0)+'</div></div>'+btn('Offre','shopopen',{c:'sm',i:x.id})+'</div>').join('')+(sh.length>25?'<div class="sub">+ '+(sh.length-25)+' autres enseignes.</div>':'')+'</div>';
  body+=groupBuyable(rid)? '<div class="notice warn"><b>Groupe affaibli.</b> OPA possible pour '+eur(groupPrice(rid),0)+' : vous récupérez ses enseignes dans vos villes et il disparaît.</div><div>'+btn('Lancer l’OPA','opa',{c:'pri',i:rid,dis:!unlocked(4),why:'Palier « '+D.TIERS[4].n+' » requis.'})+(unlocked(4)?'':' <span class="sub">Palier Tycoon.</span>')+'</div>'
    : '<div class="sub">OPA possible quand sa puissance passe sous 0,80 : guerres des prix gagnées, enseignes rachetées, talents débauchés l’affaiblissent.</div>';
  return {title:esc(r.n),body,sm:true};
}
Object.assign(ACT,{
  shopopen:el=>{ ui.prev=null; ui.modal={type:'shop',id:+el.dataset.i}; render(); },
  shopbid:el=>{ const r=shopOffer(+el.dataset.i,+el.dataset.v); if(r.ok&&r.msg==='Enseigne rachetée.') ui.modal=null; after(r); },
  shopyes:el=>{ const r=acceptCounter(+el.dataset.i); if(r.ok) ui.modal=null; after(r); },
  shopno:el=>{ const sh=S.riv.shops.find(x=>x.id===+el.dataset.i); if(sh) sh.counter=null; after(); },
  rivopen:el=>{ ui.modal={type:'rival',id:el.dataset.i}; render(); },
  opa:el=>{ const rid=el.dataset.i; ask('OPA sur '+rivDef(rid).n,'Prix : <b>'+eur(groupPrice(rid),0)+'</b>. Ses enseignes dans vos villes deviennent les vôtres, le groupe disparaît.','Lancer',()=>{ ui.modal=null; after(buyGroup(rid),'OPA réussie.'); }); }
});

