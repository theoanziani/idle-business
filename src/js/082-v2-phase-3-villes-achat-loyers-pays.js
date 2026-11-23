/* ============================================================
   V2 phase 3 : villes (achat, loyers, pays)
   ============================================================ */
function cityCard(id){
  const C=D.CITIES[id], open=cityUnlocked(id), own=cityOwned(id), mine=S.biz.filter(b=>b.city===id).length, fs=festNext(id).slice(0,3);
  const ix=[['Loyers',C.idx.rent],['Salaires',C.idx.wage],['Impôts',C.idx.tax],['Criminalité',C.idx.crime],['Tourisme',C.idx.tour]];
  let lockTxt='';
  if(!open) lockTxt= C.parent? '<div class="sub">Achetez <b>'+esc(D.CITIES[C.parent].n)+'</b> pour débloquer cette ville.</div>'
    : '<div><div class="row sp"><span class="sub">Valeur nette requise : <b>'+eur(C.unlock,0)+'</b></span><span class="num">'+Math.round(clamp(S.peakNW/C.unlock,0,1)*100)+' %</span></div>'+bar(S.peakNW/C.unlock)+'</div>';
  let prop='';
  if(own){
    const o=S.cities[id], inc=cityIncome(id), up=cityUpkeep(id), tn=cityTenants(id), tw=tn.reduce((a,x)=>a+x.w,0)||1;
    prop='<div class="stack" style="gap:8px;border-top:1px solid var(--line);padding-top:10px"><div class="row sp"><b>Votre ville</b>'+pill('Propriétaire','good')+'</div>'+
      '<div class="mini"><div><span>Valeur</span><b class="num">'+eur(cityValue(id),0)+'</b></div><div><span>Loyers nets / j</span><b class="num pos">'+eur(inc-up,0)+'</b></div><div><span>Occupation</span><b class="num">'+Math.round(cityOcc(id)*100)+' %</b></div></div>'+
      '<div class="stack" style="gap:6px"><b>Loyers demandés</b><div class="seg">'+CPOL.map((x,k)=>'<button class="'+((o.pol===undefined?1:o.pol)===k?'on':'')+'" data-a="citypol" data-i="'+id+'" data-v="'+k+'">'+x[0]+'</button>').join('')+'</div><div class="sub">Plus chers : plus de revenus mais moins de locataires.</div></div>'+
      '<div class="sub">Locataires : '+(tn.length? tn.slice(0,4).map(x=>esc(x.r.n)+' '+Math.round(x.w/tw*100)+' %').join(' · ') : 'commerces indépendants')+'. Vos activités ici ne paient plus de loyer.</div>'+
      '<div>'+btn('Céder la ville : '+eur(cityValue(id)*.92,0),'citysell',{c:'sm ghost dng',i:id})+'</div></div>';
  } else if(open){
    const p=cityPriceEur(id), can=availFor(D.CITIES[id].ccy)>=p;
    prop='<div class="row sp" style="border-top:1px solid var(--line);padding-top:10px"><div><b>Acheter toute la ville</b><div class="sub">Tous les bâtiments des '+C.d.length+' quartiers, loués à des concurrents.</div></div>'+btn(eur(p,0),'citybuy',{c:'sm pri',i:id,dis:!can})+'</div>';
  }
  return '<section class="card bc '+(open?'':'lock')+'">'+cityBanner(id,'top')+'<div class="hd"><div><b>'+esc(C.n)+'</b><div class="sub">'+(C.parent?'Ville secondaire · ':'')+esc(C.country)+'</div></div>'+(own? pill('Propriétaire','good') : open? (mine? pill(mine+' activité(s)','info') : pill('Disponible','good')) : pill('Verrouillée','warn'))+'</div>'+
    lockTxt+'<div class="sub">'+esc(C.txt)+'</div>'+
    '<div class="ixs">'+ix.map(x=>'<div><span>'+x[0]+'</span>'+dots(x[1])+'</div>').join('')+'</div>'+
    (fs.length?'<div class="stack" style="gap:6px"><div class="tag">Fêtes et événements</div>'+fs.map(x=>'<div class="row sp"><span>'+esc(x.f.n)+'</span>'+(x.on? pill('En cours','good') : '<span class="sub num">dans '+x.in+' j</span>')+'</div>').join('')+'</div>':'')+
    '<details class="acc"><summary>Quartiers ('+C.d.length+')</summary><div class="tw"><table class="tbl"><thead><tr><th>Quartier</th><th class="r">Prix / m²</th><th class="r">Risque</th></tr></thead><tbody>'+
    C.d.map(x=>'<tr><td><b>'+esc(x.n)+'</b><div class="sub">'+x.fav.slice(0,3).map(secName).join(', ')+'</div></td><td class="r num">'+eur(x.p*fxOf(C.ccy),0)+'</td><td class="r">'+dots(x.crime)+'</td></tr>').join('')+'</tbody></table></div></details>'+
    (open? '<div class="row">'+btn('Lancer une activité ici','citygo',{c:'sm',i:id})+'</div>' : '')+prop+'</section>';
}
function vCities(){
  let h=head('Villes');
  const owned=Object.keys(S.cities||{}).filter(cityOwned);
  if(owned.length){ let inc=0,val=0; owned.forEach(id=>{ inc+=cityIncome(id)-cityUpkeep(id); val+=cityValue(id); });
    h+=card('Votre empire','<div class="mini"><div><span>Villes possédées</span><b>'+owned.length+'</b></div><div><span>Valeur</span><b class="num">'+eur(val,0)+'</b></div><div><span>Loyers nets / j</span><b class="num pos">'+eur(inc,0)+'</b></div></div>'); }
  D.COUNTRIES.forEach(c=>{
    const n=c.cities.filter(cityOwned).length, gov=S.country&&S.country.id===c.id;
    h+='<div class="cat-h">'+esc(c.n)+' · '+n+' / 3 villes</div><div class="sub" style="margin:-4px 0 10px">'+(gov? 'Vous gouvernez ce pays.' : n===3? 'Vous pouvez acheter le pays dans Luxe ('+eur(c.price,0)+', palier Souverain).' : (cityOwned(c.main)? 'Possédez les trois villes pour acheter le pays ('+eur(c.price,0)+').' : 'Achetez '+esc(D.CITIES[c.main].n)+' pour découvrir les autres villes du pays.'))+'</div>';
    h+='<div class="grid">'+c.cities.filter(cityVisible).map(cityCard).join('')+'</div>';
  });
  return h;
}
Object.assign(ACT,{
  citybuy:el=>{ const id=el.dataset.i, C=D.CITIES[id], kids=D.CITY_ORDER.filter(k=>D.CITIES[k].parent===id);
    ask('Acheter '+C.n,'Vous achetez tous les bâtiments de '+C.n+' pour <b>'+eur(cityPriceEur(id),0)+'</b>. Vos activités n’y paient plus de loyer et les concurrents vous versent les leurs.'+(kids.length?' Débloque '+kids.map(k=>D.CITIES[k].n).join(' et ')+'.':''),'Acheter',()=>after(buyCity(id),'Ville achetée.')); },
  citysell:el=>{ const id=el.dataset.i; ask('Céder '+D.CITIES[id].n,'Vous encaissez <b>'+eur(cityValue(id)*.92,0)+'</b>.','Céder',()=>after(sellCity(id))); },
  citypol:el=>after(setCityPol(el.dataset.i,+el.dataset.v))
});

