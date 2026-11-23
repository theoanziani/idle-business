/* ============================================================
   BOUTIQUE E-COMMERCE : le catalogue dans la fiche
   ============================================================ */
function ecTrLabel(m,id){ const t=m.tr[id], v=ecTr(m,id); return (t.vir>0?'Viral':v>=1.6?'Très demandé':v>=1.1?'Demandé':v>=.7?'Stable':'En baisse')+(t.d>.008?' et en hausse':t.d<-.008?' et en recul':''); }
MET.ecom.html=function(b){
  const m=b.m, open=ui.ec&&ui.ec===b.id, d=m.stats;
  const B=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o&&o.dis?' disabled':'')+(o&&o.l?' aria-label="'+esc(o.l)+'"':'')+'>'+lab+'</button>';
  let h='';
  if(d) h+='<div class="pk-head"><b>Entonnoir du jour</b></div><div class="ec-f">'+[['Visites',d.vis],['Paniers',d.carts],['Commandes',d.orders]].map(([n,v],i,a)=>'<div style="--w:'+Math.max(18,Math.round(100*Math.pow(v/Math.max(1,a[0][1]),.35)))+'%"><span>'+n+'</span><b class="num">'+fmtN(Math.round(v))+'</b></div>').join('')+'</div>';
  h+='<div class="pk-head"><b>Catalogue</b><span class="sub">'+m.cat.length+' / '+ecSlots(b)+' produits</span></div><div class="ht-t">';
  m.cat.forEach(it=>{ const p=ecP(it.id), v=ecTr(m,it.id), pend=m.ord.filter(o=>o.id===it.id).reduce((a,o)=>a+o.n,0);
    h+='<div class="rs-d ec-i"><div><b>'+esc(p.n)+'</b><small>'+ecTrLabel(m,it.id)+' · prix '+eur(ecPrice(b,it),0)+' (achat '+eur(p.c,0)+')</small>'+bar(v/3,v>=1.1?'g':v>=.7?'':'a')+
      '<small>'+(it.mode==='stock'? 'Stock propre : '+Math.round(it.st)+' unités'+(pend?' · '+pend+' en livraison':'') : 'Expédition directe par le fournisseur')+'</small>'+
      '<div class="fm-a">'+B('Prix −','mk',it.id+':-0.1',{c:'sm ghost',l:'Baisser le prix de '+p.n})+B('Prix +','mk',it.id+':0.1',{c:'sm ghost',l:'Monter le prix de '+p.n})+B(it.mode==='stock'?'Passer en direct':'Passer en stock','mode',it.id,{c:'sm ghost'})+(it.mode==='stock'?B('Commander 50','ord',it.id,{c:'sm ghost'}):'')+B('Retirer','rm',it.id,{c:'sm ghost'})+'</div></div></div>'; });
  h+='</div>';
  if(m.cat.length<ecSlots(b)) h+='<div><button class="btn sm" data-a="ecadd" data-i="'+b.id+'">'+(open?'Fermer':'Ajouter un produit')+'</button></div>';
  if(open) h+='<div class="pk-list">'+EC_PROD.filter(p=>!m.cat.some(x=>x.id===p.id)).sort((a,c)=>ecTr(m,c.id)-ecTr(m,a.id)).map(p=>'<button class="pk-o'+(ecTr(m,p.id)>=1.4?' match':'')+'" data-a="met" data-i="'+b.id+'" data-v="add" data-j="'+p.id+'"><span><b>'+esc(p.n)+'</b><small>'+ecTrLabel(m,p.id)+' · achat '+eur(p.c,0)+'</small></span></button>').join('')+'</div>';
  h+='<div class="sub">Le stock propre rapporte plus par vente mais peut rester sur les bras quand la tendance retombe. L’expédition directe n’a pas de risque, mais la marge est plus faible et les clients attendent plus longtemps.</div>';
  return h;
};
ACT.ecadd=el=>{ const id=+el.dataset.i; ui.ec= ui.ec===id? null : id; render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='add'&&ui.ec){ ui.ec=null; render(); } }; }

