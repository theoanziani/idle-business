/* ============================================================
   ENTREPÔT LOGISTIQUE : emplacements, clients, offres (V1.6.2)
   ============================================================ */
function whBt(b,lab,act,arg,o){ return '<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'"'+(arg!==undefined?' data-j="'+esc(String(arg))+'"':'')+(o&&o.dis?' disabled':'')+'>'+lab+'</button>'; }
MET.warehouse.html=function(b){ const m=b.m, d=m.st||whDay(b), cap=whCap(b), used=whUsed(b);
  let h='<div class="pk-head"><b>Emplacements</b><span class="sub">'+fmtN(used,0)+' / '+fmtN(cap,0)+' palettes'+(m.fr?' · froid '+fmtN(whFrUsed(b),0)+' / '+fmtN(whFrCap(b),0):'')+'</span></div>'+bar(used/Math.max(1,cap),used/cap>.95?'a':'g');
  h+='<div class="sub">'+WH_EQ[m.eq].n+' · '+fmtN(Math.round(d.mv))+' mouvements par jour'+(d.late>1?' · <span class="neg">'+fmtN(Math.round(d.late))+' en retard</span>':'')+helpQ('Fonctionnement de l’entrepôt','Chaque client paie ses palettes chaque jour, week-end compris, et chaque entrée ou sortie. Trop de mouvements pour l’équipement : des retards, plus chers et mal vus. Vos usines de la même ville gardent leur stock plus longtemps.')+'</div>';
  /* offres */
  h+='<div class="pk-head"><b>Clients intéressés</b><span class="sub">'+m.off.length+' offre'+(m.off.length>1?'s':'')+'</span></div><div class="ht-t">';
  h+=m.off.length? m.off.slice().sort((x,y)=>(y.big-x.big)||(y.p*y.pal-x.p*x.pal)).map(o=>{ const fit=whUsed(b)+o.pal<=cap&&(!o.fr||(m.fr&&whFrUsed(b)+o.pal<=whFrCap(b)));
    return '<div class="rs-d"><div><b>'+esc(o.n)+(o.big?' · grand compte':'')+'</b><small>'+esc(o.sec)+(o.fr?' · sous température':'')+' · '+fmtN(o.pal,0)+' palettes · '+fmtN(o.p,2)+' € par palette et par jour · '+o.mo+' mois · jusqu’au '+dateS(o.exp)+'</small>'+
      (fit? '<div class="fm-a">'+whBt(b,'Signer','sign',o.id+':0',{c:'sm pri'})+whBt(b,'Négocier +8 %','sign',o.id+':1',{c:'sm ghost'})+'</div>' : '<small>'+(o.fr&&!m.fr? 'Il faut une zone frigorifique.' : 'Pas assez de place.')+'</small>')+'</div></div>'; }).join('') : '<div class="sub">Aucune offre pour le moment.</div>';
  h+='</div>';
  /* clients */
  h+='<div class="pk-head"><b>Clients</b><span class="sub">'+m.ct.length+' contrat'+(m.ct.length>1?'s':'')+'</span></div><div class="ht-t">';
  m.ct.slice().sort((x,y)=>x.until-y.until).forEach(c=>{
    h+='<div class="rs-d"><div><b>'+esc(c.n)+'</b><small>'+fmtN(c.pal,0)+' palettes'+(c.fr?' sous température':'')+' · '+fmtN(c.p,2)+' € par palette et par jour · fin le '+dateL(c.until)+'</small><div class="row sp"><span>'+pill('Satisfaction '+Math.round(c.sat),c.sat<40?'bad':c.sat<60?'warn':'good')+'</span>'+whBt(b,'Rompre','end',c.id,{c:'sm ghost'})+'</div></div></div>'; });
  return h+'</div>';
};
/* petit bouton « ? » qui affiche une explication (même style que le glossaire) */
function helpQ(k,t){ GLOSS[k]=t; return '<button class="qm" type="button" data-a="gloss" data-v="'+esc(k)+'" aria-label="Explication : '+esc(k)+'">?</button>'; }

ACT.lng=el=>{ const id=+el.dataset.i; ui.lnG= id&&ui.lnG!==id? id : null; render(); };

