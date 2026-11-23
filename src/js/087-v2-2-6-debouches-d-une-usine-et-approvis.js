/* ============================================================
   V2.2.6 : DÉBOUCHÉS D'UNE USINE ET APPROVISIONNEMENT DES CLIENTS, DANS LA FICHE
   La fiche d'une usine montre la chaîne : production → stock → débouchés, dans l'ordre où la
   production part (contrats, vos sociétés, grossiste ou stock). Une société cliente voit ce que
   vos usines lui fournissent.
   ============================================================ */
function gIdxTxt(g){ const i=gIdx(g), p=Math.round((i-1)*100); return p===0? '=' : (p>0?'+':'−')+Math.abs(p)+' %'; }
const gLiv = g => g==='comp'? 'livrés' : 'livrées';
function factOutHtml(b){
  /* V2.3.5 : plusieurs produits par usine, chacun avec sa part de la capacité et sa qualité */
  fpInit(b); const g=goodOf(b), I=indInit(), cap=factCap(b), sv=fpRefValue(b), P=prodsOf(b);
  const cl=supClients(g), act=I.active.filter(c=>P.includes(c.p)), off=I.offers.filter(o=>P.includes(o.p));
  let h='<div class="met-out" data-t="Débouchés" data-s="'+esc(eur(b.prodDayV||0,0)+' produits par jour · '+(b.fmode==='store'?'stockage':'vente au grossiste'))+'">';
  h+='<div class="fo-flow"><div><span>Production</span><b class="num">'+eur(b.prodDayV||0,0)+'</b><small>par jour</small></div><i aria-hidden="true">›</i>'+
     '<div><span>Stock</span><b class="num">'+eur(fpValue(b),0)+'</b><small>'+Math.round(sv/cap*100)+' % de la capacité</small></div><i aria-hidden="true">›</i>'+
     '<div><span>Prix de gros</span><b class="num">'+gIdxTxt(g)+'</b><small>vs référence</small></div></div>'+bar(sv/cap,sv/cap>.9?'r':'g');
  /* 0. lignes de production */
  if(mgrOn('ach')) h+='<div class="notice info">'+(b.fpMan? 'Vous réglez vous-même cette usine.' : 'Répartition et qualité réglées chaque lundi par votre directeur des achats, selon les besoins de vos sociétés. Toucher un réglage vous rend la main.')+'</div>'+(b.fpMan? '<div class="row">'+btn('Confier au directeur des achats','fpauto',{c:'sm ghost',i:b.id})+'</div>' : '');
  h+='<div class="fo-s"><div class="fo-h"><b>Lignes de production</b><small>'+(b.def==='farm'? 'Selon vos parcelles ; qualité au choix' : 'Part de la capacité et qualité')+'</small></div>';
  P.forEach(p=>{ const D0=D.PRODS[p], q=b.pq[p]||0, sh=fpShare(b,p), u=(b.pday&&b.pday[p])||0, st=b.st[p]; if(b.def==='farm'&&!(b.mix[p]>0)&&st.every(x=>x<1)) return;
    h+='<div class="fo-l"><div class="fo-r"><div><b>'+esc(D0.n)+'</b><small>'+Math.round(sh*100)+' % · '+fmtN(u)+' '+esc(D0.u)+' par jour · '+eur(pPrice(p,q),2)+' l’unité</small></div>'+
      (b.def==='farm'? '' : '<div class="seg fo-pm"><button data-a="fmix" data-i="'+b.id+'" data-p="'+p+'" data-v="-1" aria-label="Moins de '+esc(D0.n)+'">−</button><button data-a="fmix" data-i="'+b.id+'" data-p="'+p+'" data-v="1" aria-label="Plus de '+esc(D0.n)+'">+</button></div>')+'</div>'+
      '<div class="seg fo-q">'+QN.map((n,k)=>'<button class="'+(q===k?'on':'')+'" data-a="fpq" data-i="'+b.id+'" data-p="'+p+'" data-v="'+k+'">'+n+'</button>').join('')+'</div>'+
      '<small class="sub num">Stock : '+(st.every(x=>x<1)? 'vide' : [0,1,2].filter(k=>st[k]>=1).map(k=>fmtN(st[k])+' '+QN[k].toLowerCase()).join(' · '))+'</small></div>'; });
  if(b.def==='farm'){ const off=P.filter(p=>!(b.mix[p]>0)); if(off.length) h+='<div class="sub">Pas encore produit : '+off.map(p=>esc(D.PRODS[p].n.toLowerCase())).join(', ')+'. Plantez les cultures correspondantes (vigne pour le vin, vaches pour les produits laitiers, poules pour les œufs).</div>'; }
  h+='<div class="sub">Une qualité plus haute coûte plus cher à produire ('+QN.map((n,k)=>n.toLowerCase()+' ×'+String(QC[k]).replace('.',NDEC)).join(', ')+') mais se vend plus cher (×'+String(QV[1]).replace('.',NDEC)+', ×'+String(QV[2]).replace('.',NDEC)+'). Au grossiste, le standard rapporte le plus ; la qualité paie avec les contrats exigeants et auprès de vos sociétés, dont elle augmente les ventes.</div></div>';
  /* 1. contrats */
  h+='<div class="fo-s"><div class="fo-h"><b>1. Contrats</b><small>'+(act.length? act.length+' en cours' : 'Aucun en cours')+'</small></div>';
  act.forEach(c=>{ const sh=I.ship.find(s=>s.cid===c.id), R=route(b.city,c.city), Pp=D.PRODS[c.p], have=fpUnits(b,c.p,c.qm);
    h+='<div class="fo-r"><div><b>'+esc(c.client)+'</b><small>'+fmtN(c.qty)+' '+esc(Pp.u)+' de '+esc(Pp.n.toLowerCase())+(c.qm?' '+QN[c.qm].toLowerCase()+' ou mieux':'')+' à livrer à '+esc(cityName(c.city))+' avant le '+dateL(c.due)+' · '+eur(c.qty*c.px,0)+'</small></div>'+
      (sh? pill('En route','info') : btn('Expédier','ctship',{c:'sm',i:c.id,j:b.id,dis:have<c.qty,why:'Stock insuffisant pour ce contrat.'}))+'</div>'+(!sh&&have<c.qty? '<div class="sub">Stock insuffisant ici : '+fmtN(have)+' / '+fmtN(c.qty)+'. L’expédition part seule dès qu’une de vos usines a le stock.</div>' : !sh? '<div class="sub">Transport '+R.days+' j, '+eur(c.qty*Pp.v*R.rate,0)+'.</div>' : ''); });
  off.slice(0,4).forEach(o=>{ const Pp=D.PRODS[o.p], ref=pPrice(o.p,o.qm); h+='<div class="fo-r"><div><b>'+esc(o.client)+'</b><small>'+fmtN(o.qty)+' '+esc(Pp.u)+' de '+esc(Pp.n.toLowerCase())+(o.qm?' '+QN[o.qm].toLowerCase()+' ou mieux':'')+' à '+eur(o.px,2)+' ('+(o.px>=ref?'+':'−')+Math.abs(Math.round((o.px/ref-1)*100))+' % vs gros) · '+esc(cityName(o.city))+' · avant le '+dateL(o.due)+'</small></div>'+btn('Signer','ctacc',{c:'sm pri',i:o.id,dis:I.active.length>=5,why:'Cinq contrats en cours au maximum.'})+'</div>'; });
  if(!act.length&&!off.length) h+='<div class="sub">Des clients proposent régulièrement des commandes, 15 à 45 % au-dessus du prix de gros. Certains exigent une qualité supérieure ou premium.</div>';
  h+='</div>';
  /* 2. vos sociétés */
  h+='<div class="fo-s"><div class="fo-h"><b>2. Vos sociétés</b><div class="seg"><button class="'+(supOn(b)?'on':'')+'" data-a="fsup" data-i="'+b.id+'" data-v="1">Fournir</button><button class="'+(!supOn(b)?'on':'')+'" data-a="fsup" data-i="'+b.id+'" data-v="0">Ne pas fournir</button></div></div>';
  const cl2=cl.filter(c=>Object.keys(SUP_NEED[c.def]).some(p=>P.includes(p)));
  if(cl2.length){ h+=cl2.map(c=>{ const ps=Object.keys(SUP_NEED[c.def]).filter(p=>P.includes(p)), nd=ps.reduce((a,p)=>a+supNeedP(c,p),0), got=ps.reduce((a,p)=>a+((c.supP&&c.supP[p])?c.supP[p][1]:0),0);
      return '<div class="fo-r"><div><b>'+esc(c.name)+'</b><small>'+esc(bizDef(c).n)+' · '+esc(cityName(c.city))+' · '+ps.map(p=>esc(D.PRODS[p].n.toLowerCase())).join(', ')+' · besoin '+eur(nd,0)+' par jour'+(supSrc(c)==='mkt'?' · achète au marché':'')+'</small></div><span class="num sub">'+(got? eur(got,0)+' livrés' : '—')+'</span></div>'; }).join('');
    h+='<div class="sub">Vos sociétés paient le prix de gros et économisent '+Math.round(SUP_DISC*100)+' % de ces achats, moins le transport.</div>'; }
  else h+='<div class="sub">'+esc(SUP_HINT[g])+'</div>';
  h+='</div>';
  /* 3. le reste */
  h+='<div class="fo-s"><div class="fo-h"><b>3. Le reste</b><div class="seg"><button class="'+(b.fmode!=='store'?'on':'')+'" data-a="fmode" data-i="'+b.id+'" data-v="sell">Vendre au gros</button><button class="'+(b.fmode==='store'?'on':'')+'" data-a="fmode" data-i="'+b.id+'" data-v="store">Stocker</button></div></div>'+
     '<div class="sub">'+(b.fmode==='store'? 'La production s’accumule. Vendez quand le prix de gros est haut ; au-delà de la capacité, l’excédent part avec 15 % de décote.' : 'Chaque jour, ce qui n’est pas réservé part au grossiste au prix du jour.')+'</div>'+
     (fpValue(b)>=1? '<div class="row">'+btn('Vendre tout le stock : '+eur(fpValue(b),0),'gsell',{c:'sm',i:b.id})+'</div>' : '')+'</div>';
  return h+'</div>';
}
const SUP_HINT={alim:'Un restaurant, un hôtel ou un parc d’attractions à vous achèterait vos produits.', vet:'Une maison de couture ou une boutique en ligne à vous achèterait vos vêtements.', comp:'Un atelier de réparation, un data center ou une concession à vous achèterait vos composants.'};
function supInHtml(b){ const N=SUP_NEED[b.def]; if(!N) return '';
  /* V2.3.6 : besoins par produit, source au choix, qualité reçue */
  const src=supSrc(b), P=Object.keys(N), hasF=p=>S.biz.some(x=>isFact(x)&&x.status==='active'&&x.mix&&x.mix[p]>0);
  const qb=(SUP_QB[b.def]||0)*clamp(b.supQ||0,0,2)/2, miss=b.supMiss||0;
  let h='<div class="met-out" data-t="Approvisionnement" data-s="'+esc({mkt:'Marché',mix:'Vos usines puis le marché',own:'Vos usines seulement'}[src]+(b.supIn? ' · '+eur(b.supIn,0)+' livrés hier' : ''))+'">';
  h+='<div class="fo-h"><b>Fournisseur</b><div class="seg">'+[['mkt','Marché'],['mix','Mixte'],['own','Vos usines']].map(([k,n])=>'<button class="'+(src===k?'on':'')+'" data-a="fsrc" data-i="'+b.id+'" data-v="'+k+'">'+n+'</button>').join('')+'</div></div>';
  if(mgrOn('ach')) h+='<div class="sub">'+(b.srcMan? 'Vous gérez ce fournisseur vous-même.' : 'Choisi chaque lundi par votre directeur des achats. Toucher un bouton vous rend la main.')+'</div>'+(b.srcMan? '<div class="row">'+btn('Confier au directeur des achats','fsrcauto',{c:'sm ghost',i:b.id})+'</div>' : '');
  h+='<div class="sub">'+{mkt:'Tout est acheté au prix du marché, en qualité standard.', mix:'Vos usines livrent d’abord (prix de gros, '+Math.round(SUP_DISC*100)+' % d’économie moins le transport, leur meilleure qualité) ; le marché complète.', own:'Seulement vos usines : '+Math.round(SUP_OWN*100)+' % d’économie moins le transport, mais ce qu’elles ne livrent pas fait perdre des ventes.'}[src]+'</div>';
  P.forEach(p=>{ const Pp=D.PRODS[p], x=(b.supP&&b.supP[p])||[supNeedP(b,p),0,0], cov=x[0]>0? x[1]/x[0] : 0;
    h+='<div class="fo-r"><div><b>'+esc(Pp.n)+'</b><small>besoin '+eur(x[0],0)+' par jour'+(src==='mkt'? '' : x[1]>0? ' · vos usines : '+Math.round(cov*100)+' %, qualité '+QN[Math.round(x[2])].toLowerCase() : hasF(p)? ' · rien de livré hier' : ' · aucune de vos usines n’en produit')+'</small></div></div>'; });
  if(src!=='mkt') h+='<div class="sub">'+(b.supIn? 'Hier : '+eur(b.supIn,0)+' livrés, '+eur(b.supSave||0,0)+' économisés' : 'Hier : rien de livré')+(qb>.001? ' · qualité reçue : ventes +'+(qb*100).toFixed(1).replace('.',NDEC)+' %' : '')+(miss>.01? ' · rupture : '+Math.round(miss*100)+' % du besoin manquant, ventes −'+Math.round(miss*80)+' %' : '')+'.</div>';
  return h+'</div>'; }
{ const _mc=metCard; metCard=function(b){ const h=_mc(b); if(!h) return h; let x=''; try{ x= isFact(b)? factOutHtml(b) : supInHtml(b); }catch(e){ console.error(e); } if(!x) return h; let k=h.indexOf('<div class="met-cs">'); if(k<0) k=h.lastIndexOf('</section>'); return h.slice(0,k)+x+h.slice(k); }; }
factPilot=function(b){ return '<div class="stack"><b>Production et ventes</b><div class="sub">Contrats, approvisionnement de vos sociétés et vente au grossiste : onglet Production.</div></div>'; };
ACT.fsup=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); after(setFsup(b,el.dataset.v==='1')); };
/* V2.2.6 : l'écran Usines devient une vue d'ensemble ; les actions se font dans la fiche de chaque usine */
vLogi=function(){
  const I=indInit(), facts=S.biz.filter(isFact);
  let h=head('Usines et logistique','Vue d’ensemble. Contrats, approvisionnement et ventes se règlent dans l’onglet Production de chaque usine.');
  h+=card('Prix de gros','<div class="stack">'+Object.keys(D.GOODS).filter(g=>g!=='tel').map(g=>{ const G=D.GOODS[g], hst=gpInit()[g].h, ch=hst.length>1? hst[hst.length-1]/hst[0]-1:0;
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:6px"><div><b>'+G.n+'</b><div class="sub">'+eur(gPrice(g),2)+' ('+gIdxTxt(g)+' vs référence '+eur(G.v,2)+')</div></div><div class="fxs">'+spark(hst,70,26)+'<small class="'+cls(ch)+'">'+(ch>=0?'+':'')+(ch*100).toFixed(1)+' %</small></div></div>'; }).join('')+'</div>');
  h+=card('Vos usines', facts.length? '<div class="stack">'+facts.map(b=>{ fpInit(b); const cap=factCap(b), sv=fpRefValue(b);
    return '<div class="stack" style="gap:6px;border-bottom:1px solid var(--line);padding-bottom:10px"><div class="row sp"><div style="min-width:0"><b>'+esc(b.name)+'</b><div class="sub">'+esc(cityName(b.city))+' · '+eur(b.prodDayV||0,0)+' produits par jour · '+(b.fmode==='store'?'stockage':'vente au gros')+'</div><div class="sub">'+prodsOf(b).filter(p=>b.mix[p]>0).map(p=>esc(D.PRODS[p].n)+' '+Math.round(fpShare(b,p)*100)+' %'+((b.pq[p]||0)?' ('+QN[b.pq[p]].toLowerCase()+')':'')).join(' · ')+'</div></div>'+btn('Ouvrir','bizopen',{c:'sm ghost',i:b.id})+'</div>'+
      bar(sv/cap,sv/cap>.9?'r':'g')+'<div class="sub">Stock '+eur(fpValue(b),0)+' · '+Math.round(sv/cap*100)+' % de la capacité</div></div>'; }).join('')+'</div>'
    : '<div class="notice info">Construisez une usine textile, une usine de composants ou une ferme sur un terrain ou dans un entrepôt.</div>');
  const flows=Object.keys(SUP_USE).map(g=>{ const C=supClients(g); if(!C.length) return ''; const F=S.biz.filter(x=>isFact(x)&&goodOf(x)===g&&x.status==='active'), v=C.reduce((a,c)=>a+(c.supIn||0),0), sv=C.reduce((a,c)=>a+(c.supSave||0),0), need=C.reduce((a,c)=>a+supNeedV(c),0);
    return '<div class="row sp" style="border-bottom:1px solid var(--line);padding-bottom:6px"><div style="min-width:0"><b>'+D.GOODS[g].n+'</b><div class="sub">'+C.length+' société'+(C.length>1?'s':'')+' cliente'+(C.length>1?'s':'')+' · besoin '+eur(need,0)+' par jour'+(F.length? '' : ' · aucune usine pour les fournir')+'</div>'+(F.length&&need>0&&v<need*.6? '<div class="sub"><b class="neg">Couvert à '+Math.round(v/need*100)+' %</b> : agrandissez vos usines ou construisez-en une autre.</div>' : '')+'</div><div class="sub r">'+(v? eur(v,0)+' livrés<br>'+eur(sv,0)+' économisés' : '—')+'</div></div>'; }).join('');
  if(flows) h+=card('Approvisionnement de vos sociétés (hier)','<div class="stack">'+flows+'</div>');
  const act=I.active, off=I.offers;
  h+=card('Contrats', (act.length||off.length? '<div class="stack">'+act.map(c=>{ const G=D.GOODS[c.g], sh=I.ship.find(s=>s.cid===c.id);
      const Pp=D.PRODS[c.p]||{n:G.n,u:G.u}; return '<div class="row sp"><div style="min-width:0"><b>'+esc(c.client)+'</b><div class="sub">'+fmtN(c.qty)+' '+esc(Pp.u)+' de '+esc(Pp.n.toLowerCase())+(c.qm?' '+QN[c.qm].toLowerCase():'')+' → '+esc(cityName(c.city))+' · avant le '+dateL(c.due)+'</div></div>'+pill(sh?'En route':'À livrer',sh?'info':'warn')+'</div>'; }).join('')+
      off.map(o=>{ const Pp=D.PRODS[o.p]; return '<div class="row sp"><div style="min-width:0"><b>'+esc(o.client)+'</b><div class="sub">Propose '+fmtN(o.qty)+' '+esc(Pp.u)+' de '+esc(Pp.n.toLowerCase())+(o.qm?' '+QN[o.qm].toLowerCase():'')+' · expire le '+dateL(o.exp)+'</div></div>'+pill('À signer','good')+'</div>'; }).join('')+'</div>' : '<div class="sub">Aucun contrat pour le moment.</div>')+
    '<div class="sub">Signez et expédiez depuis l’onglet Production de l’usine concernée. Les livraisons partent seules dès qu’une usine a le stock.</div>');
  h+=card('Transport','<div class="tw"><table class="tbl"><thead><tr><th>Trajet</th><th class="r">Durée</th><th class="r">Coût</th></tr></thead><tbody>'+
    [['Même ville','paris','paris'],['Même pays','paris','toulouse'],['Même continent','paris','barcelone'],['Autre continent','paris','miami']].map(x=>{ const R=route(x[1],x[2]); return '<tr><td>'+x[0]+'</td><td class="r">'+R.days+' j</td><td class="r">'+Math.round(R.rate*100)+' %</td></tr>'; }).join('')+
    '</tbody></table></div><div class="sub">Coût en part de la valeur transportée. Il s’applique aussi à l’approvisionnement de vos sociétés : une usine dans la même ville que ses clients leur fait économiser le plus.</div>');
  return h;
};

ACT.fsrc=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b&&mgrOn('ach')) b.srcMan=1; after(setSrc(b,el.dataset.v)); };
ACT.fsrcauto=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b){ b.srcMan=0; try{ achStep(); }catch(e){} } after(ok('Le directeur des achats choisit le fournisseur.')); };
ACT.fpauto=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b){ b.fpMan=0; try{ achStep(); }catch(e){} } after(ok('Le directeur des achats règle cette usine.')); };
ACT.fmix=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b&&mgrOn('ach')) b.fpMan=1; after(setMix(b,el.dataset.p,+el.dataset.v)); };
ACT.fpq=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b&&mgrOn('ach')) b.fpMan=1; after(setPq(b,el.dataset.p,+el.dataset.v)); };

