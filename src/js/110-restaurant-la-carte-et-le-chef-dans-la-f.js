/* ============================================================
   RESTAURANT : la carte et le chef dans la fiche
   ============================================================ */
function rsSel(b){ return ui.rs&&ui.rs.b===b.id? ui.rs.k : null; }
MET.resto.html=function(b){
  rsFix(b); const m=b.m, p=rsCalc(b), sel=rsSel(b), se=rsSeason(), can=x=>availFor(cityOf(b).ccy)>=x;
  const B=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o&&o.dis?' disabled':'')+(o&&o.l?' aria-label="'+esc(o.l)+'"':'')+'>'+lab+'</button>';
  const info=x=>{ const q=rsQ(b,x), off=x.s&&x.s!==se;
    return 'Popularité '+x.p+' · difficulté '+x.d+' · '+eur(rsCost(b,x),0)+' · '+x.t+' min'+(x.s?' · '+RS_SEAS[x.s].toLowerCase()+(off?' (hors saison)':''):'')+(q<.9?' · le chef peine':m.chef.g===x.g?' · spécialité du chef':''); };
  let h='<div class="pk-head"><b>La carte</b><span class="sub">'+p.all+' plats · matières '+eur(p.cost,0)+' par couvert</span></div>';
  Object.keys(RS_COURSE).forEach(k=>{
    h+='<div class="rs-co"><div class="row sp"><span class="tag">'+RS_COURSE[k]+' ('+m.carte[k].length+' / '+RS_MAX[k]+')</span>'+(m.carte[k].length<RS_MAX[k]? '<button class="btn sm ghost" data-a="rssel" data-i="'+b.id+'" data-v="'+(sel===k?'':k)+'">'+(sel===k?'Fermer':'Ajouter')+'</button>' : '')+'</div>';
    h+= m.carte[k].length? m.carte[k].map(id=>{ const x=rsDish(id), out=m.out[id]>S.day, off=x.s&&x.s!==se;
      return '<div class="rs-d'+(out?' out':'')+'"><div><b>'+esc(x.n)+'</b><small>'+(out?'Produit introuvable pour le moment · ':'')+esc(info(x))+'</small></div>'+B('Retirer','rm',k+':'+id,{c:'sm ghost',l:'Retirer '+x.n})+'</div>'; }).join('') : '<div class="sub neg">Aucun plat : les clients sont déçus (−25 %).</div>';
    if(sel===k) h+='<div class="pk-list">'+RS_DISH.filter(x=>x.k===k&&!m.carte[k].includes(x.id)).map(x=>
      '<button class="pk-o'+(m.chef.g===x.g?' match':'')+'" data-a="met" data-i="'+b.id+'" data-v="add" data-j="'+k+':'+x.id+'"><span><b>'+esc(x.n)+'</b><small>'+esc(info(x))+'</small></span></button>').join('')+'</div>';
    h+='</div>';
  });
  h+='<div class="sub">Une carte courte et de saison plaît aux critiques. Des plats ambitieux bien exécutés font monter la note ; trop difficiles pour le chef, ils la font baisser.</div>';
  /* le chef */
  const c=m.chef, cs=rsCands(b);
  h+='<div class="rs-co"><div class="tag">Le chef</div><div class="rs-d"><div><b>'+esc(c.n)+'</b><small>Niveau '+c.lvl+' sur 5 · spécialité : '+RS_SPEC[c.g].toLowerCase()+' · salaire en plus : '+eur(metR0(b)*RS_CHEF_SAL[c.lvl],0)+' / jour</small></div></div>';
  h+='<div class="sub">Candidats de la semaine :</div>'+cs.map((x,i)=>{ const fee=rsChefFee(b,x); return '<div class="rs-d"><div><b>'+esc(x.n)+'</b><small>Niveau '+x.lvl+' · '+RS_SPEC[x.g].toLowerCase()+' · '+eur(metR0(b)*RS_CHEF_SAL[x.lvl],0)+' / jour</small></div>'+B(fee? 'Recruter : '+eur(fee,0) : 'Recruter','chef',i,{c:'sm',dis:!can(fee)})+'</div>'; }).join('')+'</div>';
  return h;
};
ACT.rssel=el=>{ const v=el.dataset.v; ui.rs= v? {b:+el.dataset.i,k:v} : null; render(); };

