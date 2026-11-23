/* ============================================================
   CONSTRUCTION : appels d'offres et chantiers dans la fiche
   ============================================================ */
function bcSel(b){ return ui.bc&&ui.bc.b===b.id? ui.bc : null; }
MET.build.html=function(b){
  const m=b.m, sel=bcSel(b), cap=bcCapDay(b), u=bcUnit(b);
  const B=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o&&o.dis?' disabled':'')+'>'+lab+'</button>';
  const K=k=>BC_KIND.find(x=>x.k===k)||{};
  let h='<div class="pk-head"><b>Appels d’offres</b><span class="sub">'+m.off.length+' en cours</span></div>';
  h+= m.off.length? m.off.map(o=>{ const days=Math.ceil(o.W/Math.max(.1,cap));
    let x='<div class="rs-d bc-o"><div><b>'+esc(o.n)+(o.green?' · vert':'')+'</b><small>'+esc(o.cl)+' · estimation '+eur(o.ref,0)+' · délai souhaité '+o.dl+' jours · environ '+days+' jours de travail pour vous · '+o.comp+' concurrents'+(o.eng&&(m.eng||0)<o.eng?' · il faut des engins plus lourds':'')+'</small></div>';
    if(o.bid) return x+pill('Réponse dans '+Math.max(0,o.bid.d-S.day)+' j','info')+'</div>';
    x+='<button class="btn sm" data-a="bcsel" data-i="'+b.id+'" data-v="'+(sel&&sel.id===o.id?0:o.id)+'">'+(sel&&sel.id===o.id?'Fermer':'Répondre')+'</button></div>';
    if(sel&&sel.id===o.id){ const p=bcWin(b,o,sel.pr,sel.dl), price=o.ref*(1+sel.pr), mat=o.ref*BC_MAT*(o.k==='oa'?1.1:1)*m.mi;
      x+='<div class="pk-pan"><div class="tag">Prix proposé</div><div class="seg">'+BC_PR.map(([v,n])=>'<button class="'+(sel.pr===v?'on':'')+'" data-a="bcset" data-i="'+b.id+'" data-j="pr" data-v="'+v+'">'+n+'</button>').join('')+'</div>'+
        '<div class="tag">Délai proposé</div><div class="seg">'+BC_DL.map(([v,n])=>'<button class="'+(sel.dl===v?'on':'')+'" data-a="bcset" data-i="'+b.id+'" data-j="dl" data-v="'+v+'">'+n+' ('+Math.round(o.dl*v)+' j)</button>').join('')+'</div>'+
        '<label class="fc-tg"><span>Acheter les matériaux d’avance ('+eur(mat,0)+')</span><input type="checkbox" data-a="bcset" data-i="'+b.id+'" data-j="ma" '+(sel.ma?'checked':'')+'></label>'+
        '<div class="row sp"><div><b class="num">'+eur(price,0)+'</b><div class="sub">Chance de l’emporter : '+Math.round(p*100)+' %</div></div>'+B('Envoyer l’offre','bid',o.id+':'+sel.pr+':'+sel.dl+':'+(sel.ma?1:0),{c:'sm pri'})+'</div>'+
        '<div class="sub">Avec vos chantiers en cours, celui-ci serait fini dans environ '+Math.ceil((m.jobs.reduce((a,j)=>a+j.left,0)+o.W)/Math.max(.1,cap*.9))+' jours. Un délai court gagne plus souvent, mais chaque jour de retard coûte 1 % du prix. Votre capacité : '+cap.toFixed(1).replace('.',NDEC)+' journées d’équipe par jour ouvré.</div></div>'; }
    return x; }).join('') : '<div class="sub">Aucun appel d’offres pour le moment.</div>';
  h+='<div class="pk-head"><b>Chantiers</b><span class="sub">Les équipes vont d’abord sur le premier de la liste. La main-d’œuvre des chantiers en cours suit votre tarif actuel.</span></div>';
  const L=m.jobs.slice().sort((a,c)=>a.pr-c.pr);
  h+= L.length? L.map((j,i)=>{ const done=1-j.left/j.W, late=S.day>j.due, left=j.due-S.day;
    return '<div class="rs-d bc-j'+(late?' late':'')+'"><div><b>'+esc(j.n)+'</b><small>'+eur(bcRev(b,j),0)+(bcIdx(b,j)>1.005?' (révisé +'+Math.round((bcRev(b,j)/j.price-1)*100)+' %)':'')+' · '+(late? '<span class="neg">'+(-left)+' jours de retard</span>' : 'livraison dans '+left+' jours')+(j.stop>S.day?' · suspendu (fouilles)':'')+(j.sub?' · sous-traité en partie':'')+'</small>'+bar(done,late?'r':'g')+'</div><div class="bc-a">'+(i>0?B('Priorité','pr',j.id,{c:'sm ghost'}):'')+B(j.sub?'Sous-traitance : oui':'Sous-traiter','sub',j.id,{c:'sm ghost'})+'</div></div>'; }).join('') : '<div class="sub">Aucun chantier : répondez aux appels d’offres.</div>';
  return h;
};
ACT.bcsel=el=>{ const v=+el.dataset.v; ui.bc= v? {b:+el.dataset.i, id:v, pr:0, dl:1, ma:0} : null; render(); };
ACT.bcset=el=>{ const s=ui.bc; if(!s) return; const k=el.dataset.j; if(k==='ma') s.ma=el.checked?1:0; else s[k]=+el.dataset.v; render(); };
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if(v==='bid'&&ui.bc){ ui.bc=null; render(); } }; }

