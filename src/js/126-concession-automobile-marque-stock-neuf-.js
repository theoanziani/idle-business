/* ============================================================
   CONCESSION AUTOMOBILE : marque, stock neuf, occasions dans la fiche (V1.2.7)
   ============================================================ */
MET.dealer.html=function(b){
  const m=b.m, B=dlBr(b), Q=m.q, open=ui.dlb===b.id, can=x=>mAvail(b)>=x;
  const Bt=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o&&o.dis?' disabled':'')+'>'+lab+'</button>';
  let h='<div class="pk-head"><b>Votre marque</b><span class="sub">'+esc(B.n)+' · objectif '+Q.sold+' / '+Q.obj+'</span></div>';
  h+='<div class="rs-d"><div><b>'+esc(B.n)+'</b><small>'+esc(B.d)+' · prix moyen '+eur(B.p,0)+' · marge '+Math.round(B.mg*100)+' %</small>'+
    bar(Math.min(1,Q.sold/Math.max(1,Q.obj)),Q.sold>=Q.obj?'g':'')+'<small>Objectif du trimestre : '+Q.sold+' / '+Q.obj+' voitures neuves ; prime de '+String(Math.round(B.pr*1000)/10).replace('.',NDEC)+' % du chiffre d’affaires du neuf si atteint. Confiance de la marque : '+Math.round(m.bt)+' / 100.</small>'+
    '<div class="fm-a"><button class="btn sm ghost" data-a="dlbr" data-i="'+b.id+'">'+(open?'Fermer':'Changer de marque')+'</button></div></div></div>';
  if(open) h+='<div class="pk-list">'+Object.entries(DL_BR).filter(([k])=>k!==m.br).map(([k,x])=>{ const lock=x.rk&&!mxHas(b,x.rk);
    return '<button class="pk-o" data-a="met" data-i="'+b.id+'" data-v="brand" data-j="'+k+'"'+(lock?' disabled':'')+'><span><b>'+esc(x.n)+'</b><small>'+esc(x.d)+' · '+eur(x.p,0)+' · marge '+Math.round(x.mg*100)+' %'+(lock?' · palier '+x.rk+' requis':'')+'</small></span></button>'; }).join('')+
    '<div class="sub">Nouveau contrat : '+eur(bizDef(b).cost*.3,0)+'. Le stock neuf de la marque actuelle est soldé à 92 % de son prix d’achat.</div></div>';
  const inc=m.ord.reduce((a,o)=>a+o.n,0), unit=B.p*(1-B.mg);
  h+='<div class="pk-head"><b>Stock neuf</b><span class="sub">'+dlNewN(m)+' en stock'+(inc?' · '+inc+' en livraison':'')+'</span></div>';
  h+='<div class="rs-d"><div><small>'+(m.nw.length? m.nw.map(l=>l.n+' reçue'+(l.n>1?'s':'')+' il y a '+(S.day-l.d)+' j').join(' · ') : 'Aucune voiture en stock.')+(inc? ' · livraison '+m.ord.map(o=>'dans '+Math.max(0,o.d-S.day)+' j').join(', ') : '')+'</small>'+
    '<small>Prix d’achat : '+eur(unit,0)+' par voiture. Un stock qui dort coûte des frais financiers chaque jour.</small>'+
    '<div class="fm-a">'+Bt('Commander 3','ord',3,{dis:!can(unit*3)})+Bt('Commander 10','ord',10,{dis:!can(unit*10)})+'</div></div></div>';
  const recs=m.oc.filter(x=>x.rec).length, old=m.oc.filter(x=>S.day-x.d>90).length;
  h+='<div class="pk-head"><b>Occasions</b><span class="sub">'+m.oc.length+' en stock · '+recs+' prêtes</span></div>';
  h+='<div class="rs-d"><div><small>'+(m.oc.length? recs+' remise'+(recs>1?'s':'')+' en état, '+(m.oc.length-recs)+' à l’atelier'+(old? ' · '+old+' depuis plus de 3 mois (elles perdent de la valeur)' : '') : 'Aucune occasion : elles viennent des reprises et des enchères.')+'</small>'+
    '<small>L’atelier remet en état environ '+(Math.round(dlRecCap(b)*10)/10).toString().replace('.',NDEC)+' voiture(s) par jour.</small>'+
    '<div class="fm-a">'+Bt('Acheter 3 aux enchères','auc',undefined,{dis:!can(40000)})+'</div></div></div>';
  if(m.fo){ const c=B.p*(1-B.mg)*m.fo.n; h+='<div class="pk-head"><b>Commande de flotte</b><span class="sub">'+m.fo.n+' voitures · '+fcCountdown(m.fo.until).toLowerCase()+'</span></div><div class="rs-d"><div><small>Vente à '+eur(B.p*.92*m.fo.n,0)+' (remise de 8 %), achat '+eur(c,0)+'. Compte pour l’objectif de la marque.</small><div class="fm-a">'+Bt('Accepter la commande','fleet',undefined,{c:'sm pri',dis:!can(c)})+'</div></div></div>'; }
  if(dlRepairLink()) h+='<div class="sub">Votre société de réparation fournit l’atelier : entretiens 15 % plus rentables.</div>';
  return h;
};
ACT.dlbr=el=>{ const id=+el.dataset.i; ui.dlb= ui.dlb===id? null : id; render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='brand'&&ui.dlb){ ui.dlb=null; render(); } }; }

