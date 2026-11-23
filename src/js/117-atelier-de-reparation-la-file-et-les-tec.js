/* ============================================================
   ATELIER DE RÉPARATION : la file et les techniciens dans la fiche
   ============================================================ */
function rpSel(b){ return ui.rp2&&ui.rp2.b===b.id? ui.rp2.j : 0; }
MET.repair.html=function(b){
  const m=b.m, sel=rpSel(b);
  const B=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o&&o.dis?' disabled':'')+'>'+lab+'</button>';
  const sk=n=>'★'.repeat(n);
  let h='<div class="pk-head"><b>Techniciens</b><span class="sub">Talent par appareil</span></div><div class="ht-t">'+m.tech.map(t=>{ const j=m.q.find(x=>x.tk===t.n);
    return '<div class="rs-d"><div><b>'+esc(t.n)+'</b><small>Téléphone '+sk(t.sk.tel)+' · tablette '+sk(t.sk.tab)+' · ordinateur '+sk(t.sk.pc)+'</small></div><small>'+(j? esc(RP_DEV[j.dev].n)+' · '+Math.round(j.done/j.h*100)+' %' : 'Libre')+'</small></div>'; }).join('')+'</div>';
  const L=m.q.slice().sort((a,c)=>(a.recon-c.recon)||(a.due-c.due)).slice(0,12);
  h+='<div class="pk-head"><b>File des réparations</b><span class="sub">'+m.q.length+' appareil'+(m.q.length>1?'s':'')+'</span></div>';
  h+= L.length? L.map(j=>{ const pb=rpPb(j.pb), late=!j.recon&&S.day>j.due;
    let x='<div class="rs-d'+(late?' bc-j late':'')+'"><div><b>'+esc(RP_DEV[j.dev].n)+' · '+esc(pb.n)+'</b><small>'+(j.recon?'Reconditionnement':j.ret?'Retour sous garantie':eur(j.price,0)+(j.ins?' · assurance':''))+' · '+(j.recon?'sans délai':late?'<span class="neg">en retard</span>':'à rendre dans '+(j.due-S.day)+' j')+(j.part?'':' · <span class="neg">pièce manquante</span>')+(j.tk?' · '+esc(j.tk):'')+'</small></div>'+
      (j.part? '<button class="btn sm ghost" data-a="rpsel" data-i="'+b.id+'" data-v="'+(sel===j.id?0:j.id)+'">'+(sel===j.id?'Fermer':'Attribuer')+'</button>' : '')+'</div>';
    if(sel===j.id) x+='<div class="pk-list">'+m.tech.map(t=>'<button class="pk-o'+(t.sk[j.dev]>=4?' match':'')+'" data-a="met" data-i="'+b.id+'" data-v="as" data-j="'+j.id+':'+esc(t.n)+'"><span><b>'+esc(t.n)+'</b><small>'+esc(RP_DEV[j.dev].n)+' '+sk(t.sk[j.dev])+' · environ '+(j.h/rpSpeed(t,j.dev)).toFixed(1).replace('.',NDEC)+' h</small></span></button>').join('')+'</div>';
    return x; }).join('') : '<div class="sub">Aucun appareil en attente.</div>';
  h+='<div class="pk-head"><b>Pièces</b><span class="sub">Livraison en 2 jours</span></div><div class="ht-t">'+Object.keys(RP_PART).filter(k=>k!=='car'||mxHas(b,1)).map(k=>{ const pend=m.ord.filter(o=>o.k===k).reduce((a,o)=>a+o.n,0);
    return '<div class="rs-d"><div><b>'+RP_PART[k].n+' : '+(m.st[k]||0)+'</b><small>'+eur(rpPartCost(b,k),0)+' pièce'+(pend?' · '+pend+' en livraison':'')+'</small></div>'+B('Commander 5','ord',k,{c:'sm'})+'</div>'; }).join('')+'</div>';
  return h;
};
ACT.rpsel=el=>{ const v=+el.dataset.v; ui.rp2= v? {b:+el.dataset.i, j:v} : null; render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='as'&&ui.rp2){ ui.rp2=null; render(); } }; }

