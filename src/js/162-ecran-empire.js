
/* ============================================================
   V2.6.7 : ÉCRAN EMPIRE
   Une vue par pays : vos sociétés, leur bénéfice sur 30 jours, l'impôt sur les sociétés estimé,
   les lois clés et le climat politique. Accès depuis Plus > Pouvoir.
   ============================================================ */
const bizProfit30 = b => (b.hist||[]).slice(-30).reduce((x,y)=>x+y,0);
function empRow(c){ const id=c.id, home=id===polHome(), gov=!!(S.country&&S.country.id===id), L=pLaw(id);
  const B=S.biz.filter(b=>b.status==='active'&&c.cities.includes(b.city)), prof=B.reduce((a,b)=>a+bizProfit30(b),0);
  const rate= gov? (S.country.ex===false? L.corpTax : 0) : L.corpTax, tax=B.reduce((a,b)=>a+Math.max(0,bizProfit30(b)),0)*rate;
  const P=home? {gov:S.gov} : polOf(id)||{gov:S.gov}, cities=c.cities.filter(cityOwned).length;
  return {c,id,home,gov,L,n:B.length,prof,rate,tax,cities,pres:home||gov||B.length>0||cities>0,clim: gov? ['Satisfaction',S.country.sat] : ['Popularité',P.gov.pop], ten: gov? null : P.gov.ten}; }
function empCard(r){ const L=r.L, st= r.gov? pill('Vous gouvernez','good') : r.home? pill('Résidence','info') : '';
  const laws=[['Impôt sociétés',pct(L.corpTax,0)],['Salaire min.','× '+fmtN(L.minWage,2)],['Travail',L.labor?'Protégé':'Souple'],['Loyers',L.rentCap?'Encadrés':'Libres'],['Douane',L.tariff?pct(L.tariff,0):'aucune'],['Subventions',[L.subRenew&&'renouvelables',L.subTech&&'recherche'].filter(Boolean).join(', ')||'aucune']];
  return '<section class="card emp"><div class="px-ch">'+ctyFlag(r.id)+'<div style="flex:1"><b>'+esc(r.c.n)+'</b><small>'+plu(r.n,'société')+' · '+plu(r.cities,'ville')+' possédée'+(r.cities>1?'s':'')+'</small></div>'+st+'</div>'+
    '<div class="emp-k"><div><div class="tag">Bénéfice 30 j</div><b class="num '+(r.prof<0?'neg':'')+'">'+signed(r.prof,0)+'</b></div><div><div class="tag">Impôt estimé / mois</div><b class="num">'+(r.gov&&r.rate===0? 'exonéré' : eur(r.tax,0))+'</b></div><div><div class="tag">'+r.clim[0]+'</div><b class="num">'+Math.round(r.clim[1])+'</b>'+(r.ten!==null?'<small class="sub" style="display:block">tension '+Math.round(r.ten)+'</small>':'')+'</div></div>'+
    '<div class="emp-l">'+laws.map(([k,v])=>'<span><i>'+k+'</i> '+v+'</span>').join('')+'</div>'+
    '<div class="row">'+btn('Politique','emppol',{c:'sm',v:r.id})+btn('Villes','tab',{c:'sm ghost',i:'cities'})+'</div></section>'; }
function vEmpire(){ const R=D.COUNTRIES.map(empRow), P=R.filter(r=>r.pres), O=R.filter(r=>!r.pres);
  const tp=P.reduce((a,r)=>a+r.prof,0), tt=P.reduce((a,r)=>a+r.tax,0);
  let h=head('Empire')+'<section class="card"><div class="emp-k"><div><div class="tag">Pays</div><b class="num big">'+P.length+' / '+R.length+'</b></div><div><div class="tag">Bénéfice 30 j</div><b class="num big '+(tp<0?'neg':'')+'">'+signed(tp,0)+'</b></div><div><div class="tag">Impôt / mois</div><b class="num big">'+eur(tt,0)+'</b><small class="sub" style="display:block">taux moyen '+pct(corpRateEff(),1)+'</small></div></div></section>';
  h+='<div class="px-list">'+P.map(empCard).join('')+'</div>';
  if(O.length) h+='<div class="cat-h">Autres pays</div><div class="px-list">'+O.map(r=>'<section class="card emp emp-o"><div class="px-ch">'+ctyFlag(r.id)+'<div style="flex:1"><b>'+esc(r.c.n)+'</b><small>Impôt sur les sociétés '+pct(r.L.corpTax,0)+' · salaire min. × '+fmtN(r.L.minWage,2)+(r.L.labor?' · travail protégé':'')+'</small></div>'+btn('Politique','emppol',{c:'sm ghost',v:r.id})+'</div></section>').join('')+'</div>';
  return h; }
VIEWS.empire=vEmpire;
ACT.emppol=el=>{ ui.polC=el.dataset.v; ui.tab='pol'; window.scrollTo(0,0); render(); };
MENU.splice(MENU.findIndex(x=>x[0]==='pol')+1,0,['empire','Empire','']);
MGROUPS.find(g=>g[0]==='Pouvoir')[1].unshift('empire');
MDESC.empire='Vos sociétés, impôts et lois, pays par pays'; NAVSHORT.empire='Empire';
ICON.empire='<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/>';
(function(){ const st=document.createElement('style'); st.textContent=`.emp{padding:14px}.emp .px-ch{margin-bottom:10px}.emp-k{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}.emp-k .tag{font-size:11px}.emp-k b{font-size:15px}
.emp-l{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.emp-l span{font:700 12px var(--f-body);padding:4px 9px;border-radius:999px;background:var(--paper-2)}.emp-l i{font-style:normal;color:var(--ink-3);font-weight:600}
.emp-o .px-ch{margin:0}.num.big{font-size:17px}.num.neg{color:var(--red)}`; document.head.appendChild(st); })();
