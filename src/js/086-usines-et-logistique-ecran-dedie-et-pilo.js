/* ============================================================
   USINES ET LOGISTIQUE : écran dédié et pilotage d'une usine
   ============================================================ */
function factPilot(b){
  const g=goodOf(b), G=D.GOODS[g], st=b.goods||0, cap=factCap(b);
  return '<div class="stack"><b>Production : '+G.n+'</b><div class="sub">'+fmtN(b.prodDay||0)+' '+G.u+' par jour, '+eur(gPrice(g),2)+' l’unité au prix de gros.</div>'+
    '<div class="seg"><button class="'+(b.fmode!=='store'?'on':'')+'" data-a="fmode" data-i="'+b.id+'" data-v="sell">Vendre au grossiste</button><button class="'+(b.fmode==='store'?'on':'')+'" data-a="fmode" data-i="'+b.id+'" data-v="store">Stocker</button></div>'+
    '<div class="sub">Stock : '+fmtN(st)+' / '+fmtN(cap)+' '+G.u+' ('+factCapDays(b)+' jours). Gérez contrats et livraisons dans Usines.</div></div>';
}
function vLogi(){
  const I=indInit(), facts=S.biz.filter(isFact);
  let h=head('Usines et logistique');
  h+=card('Marché de gros','<div class="stack">'+Object.keys(D.GOODS).filter(g=>g!=='tel').map(g=>{ const G=D.GOODS[g], hst=gpInit()[g].h, ch=hst.length>1? hst[hst.length-1]/hst[0]-1:0;
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:6px"><div><b>'+G.n+'</b><div class="sub">Prix de référence '+eur(G.v,2)+'</div></div><div class="fxs">'+spark(hst,70,26)+'<small class="'+cls(ch)+'">'+(ch>=0?'+':'')+fmtN(ch*100,1)+' %</small></div><b class="num">'+eur(gPrice(g),2)+'</b></div>'; }).join('')+
    '</div><div class="sub">Vendez au grossiste quand les prix sont hauts, stockez quand ils sont bas.</div>');
  h+=card('Mes usines', facts.length? '<div class="stack">'+facts.map(b=>{ const g=goodOf(b), G=D.GOODS[g], cap=factCap(b), st=b.goods||0;
    return '<div class="stack" style="gap:6px;border-bottom:1px solid var(--line);padding-bottom:10px"><div class="row sp"><div><b>'+esc(b.name)+'</b><div class="sub">'+esc(bizAddr(b))+' · '+G.n+'</div></div>'+(b.status!=='active'?pill('Mise en route','info'):pill(fmtN(b.prodDay||0)+' / j',''))+'</div>'+
      bar(st/cap,st/cap>.9?'r':'g')+'<div class="row sp"><span class="sub">'+fmtN(st)+' / '+fmtN(cap)+' '+G.u+' · '+eur(st*gPrice(g),0)+'</span>'+(D.FACTIN[b.def]?'<span class="sub">Utilise vos '+D.GOODS[D.FACTIN[b.def]].n.toLowerCase()+' (−8 %)</span>':'')+'</div>'+
      '<div class="row"><div class="seg"><button class="'+(b.fmode!=='store'?'on':'')+'" data-a="fmode" data-i="'+b.id+'" data-v="sell">Vendre</button><button class="'+(b.fmode==='store'?'on':'')+'" data-a="fmode" data-i="'+b.id+'" data-v="store">Stocker</button></div>'+btn('Vendre le stock','gsell',{c:'sm',i:b.id,dis:st<1,why:'Le stock est vide.'})+'</div></div>'; }).join('')+'</div><div class="sub">Une usine en mode vente garde quand même la production nécessaire à vos contrats. Chaque entrepôt de la même ville ajoute 15 jours de stockage par niveau.</div>'
    : '<div class="notice info">Établissez une usine (textile ou électronique) ou une ferme dans un entrepôt ou sur un terrain, depuis Sociétés.</div>');
  if(I.offers.length) h+=card('Contrats proposés','<div class="stack">'+I.offers.map(o=>{ const G=D.GOODS[o.g];
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:8px"><div style="flex:1;min-width:180px"><b>'+esc(o.client)+'</b><div class="sub">'+fmtN(o.qty)+' '+G.u+' de '+G.n.toLowerCase()+' à livrer à '+esc(cityName(o.city))+' avant le '+dateL(o.due)+' · '+eur(o.px,2)+' l’unité ('+Math.round((o.px/gPrice(o.g)-1)*100)+' % au-dessus du gros) · total '+eur(o.qty*o.px,0)+'</div></div>'+btn('Accepter','ctacc',{c:'sm pri',i:o.id})+'</div>'; }).join('')+'</div><div class="sub">Pénalité de 15 % et réputation en baisse si le contrat n’est pas livré à temps.</div>');
  const act=I.active;
  h+=card('Contrats en cours', act.length? '<div class="stack">'+act.map(c=>{ const G=D.GOODS[c.g], sh=I.ship.find(s=>s.cid===c.id);
    const src=S.biz.filter(x=>goodOf(x)===c.g);
    return '<div class="stack" style="gap:6px;border-bottom:1px solid var(--line);padding-bottom:10px"><div class="row sp"><div><b>'+esc(c.client)+'</b><div class="sub">'+fmtN(c.qty)+' '+G.u+' → '+esc(cityName(c.city))+' · avant le '+dateL(c.due)+' · '+eur(c.qty*c.px,0)+'</div></div>'+(sh?pill('En route, arrivée le '+dateS(sh.arr),'info'):pill(c.due-S.day<0?'En retard':'Dans '+(c.due-S.day)+' j',c.due-S.day<5?'warn':''))+'</div>'+
      (sh? '' : '<div class="stack" style="gap:4px">'+src.map(b=>{ const R=route(b.city,c.city);
        return '<div class="row sp"><span class="sub">Depuis '+esc(cityName(b.city))+' : '+R.days+' j, transport '+eur(c.qty*G.v*R.rate,0)+' · stock '+fmtN(b.goods||0)+'</span>'+btn('Expédier','ctship',{c:'sm',i:c.id,j:b.id,dis:(b.goods||0)<c.qty,why:'Stock insuffisant pour ce contrat.'})+'</div>'; }).join('')+'<div class="sub">Expédition automatique dès que le stock suffit, depuis l’usine la plus proche.</div></div>')+'</div>'; }).join('')+'</div>' : '<div class="sub">Aucun contrat.</div>');
  h+=card('Transport','<div class="tw"><table class="tbl"><thead><tr><th>Trajet</th><th class="r">Durée</th><th class="r">Coût</th></tr></thead><tbody>'+
    [['Même ville','paris','paris'],['Même pays','paris','toulouse'],['Même continent','paris','barcelone'],['Autre continent','paris','miami']].map(x=>{ const R=route(x[1],x[2]); return '<tr><td>'+x[0]+'</td><td class="r">'+R.days+' j</td><td class="r">'+fmtN(R.rate*100,1)+' % de la valeur</td></tr>'; }).join('')+
    '</tbody></table></div><div class="sub">'+(route('paris','miami').ship?'Vos navires transportent vos marchandises vers les autres pays : délais −40 %, coût −50 %.':'Une compagnie maritime avec au moins une ligne transporte vos marchandises vers les autres pays : délais −40 %, coût −50 %.')+'</div>');
  return h;
}
Object.assign(ACT,{
  fmode:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(setFmode(b,el.dataset.v)); },
  gsell:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(sellGoods(b)); },
  ctacc:el=>after(acceptContract(+el.dataset.i)),
  ctship:el=>after(deliverFrom(+el.dataset.i,+el.dataset.j))
});

