/* ============================================================
   LIENS : carte « Vos sociétés et le club » dans les finances du club
   ============================================================ */
{ const _tf=fcTabFin; fcTabFin=function(O){ const h=_tf(O), agro=lkAgro(), rn=lkHas('renew'), hc=lkHas('couture'), e=lkPhone();
  const row=(on,t,d)=>'<div class="rs-d"><div><b>'+t+'</b><small>'+d+'</small></div>'+pill(on?'Actif':'Inactif',on?'good':'info')+'</div>';
  let c='<div class="ht-t">'+row(agro,'Buvettes du stade',agro?'Vos produits de l’usine agroalimentaire : recette des buvettes ×1,5.':'Avec une usine agroalimentaire, les buvettes vendent vos produits (recette ×1,5).')+
    row(!!rn,'Énergie du stade',rn?'Vos centrales alimentent le stade : énergie 40 % moins chère.':'Avec des énergies renouvelables, l’énergie du stade coûte 40 % de moins.')+
    row(!!hc,'Tenues officielles',hc?'Votre maison de couture habille le club : sponsors +10 %, prestige de la maison en hausse.':'Avec une maison de haute couture, sponsors +10 % et prestige pour la maison.')+'</div>';
  return h+card('Vos sociétés et le club',c); }; }
ACT.lkphsp=el=>after(lkSetPhSp(+el.dataset.v));

/* V1.3.6 : sponsors venant de vos sociétés */
function spSel(slot,cur,excl){ const L=spCandidates().filter(b=>!(excl||[]).includes(b.id));
  return '<select class="btn sm sp-sel" data-ch="spset" data-i="'+slot+'" aria-label="'+esc(SP_SLOT[slot==='addp'?'part':slot].n)+'">'+
    (slot==='addp'? '<option value="">Ajouter une société…</option>' : '<option value="">Sponsor habituel</option>')+
    L.map(b=>'<option value="'+b.id+'"'+(cur===b.id?' selected':'')+'>'+esc(b.name)+' · '+esc(bizDef(b).n)+'</option>').join('')+'</select>'; }
{ const _tf2=fcTabFin; fcTabFin=function(O){ const h=_tf2(O), P=spOf(O), f=spFame(O), pc=x=>Math.round(x*f*1000)/10;
  const row=(slot,label,d)=>'<div class="met-c"><b>'+label+'</b>'+spSel(slot,P[slot])+'<div class="sub">'+d+'</div></div>';
  let c='<div class="sub">Mettez vos propres sociétés en avant : elles vendent plus grâce à la visibilité du club (plus le club est connu, plus l’effet est fort), mais le club perd une partie de ses sponsors.</div>'+
    row('kit','Sponsor du maillot','+'+pc(SP_SLOT.kit.boost).toString().replace('.',NDEC)+' % de ventes pour la société ; le club perd 25 % de ses sponsors.')+
    row('std','Nom du stade','+'+pc(SP_SLOT.std.boost).toString().replace('.',NDEC)+' % de ventes ; le club perd 10 % de ses sponsors.')+
    '<div class="met-c"><b>Partenaires officiels ('+P.part.length+' / 3)</b>'+P.part.map(id=>{ const b=spBiz(id); return b? '<div class="row sp sp-p"><span>'+esc(b.name)+'<small class="sub"> · '+esc(bizDef(b).n)+'</small></span><button class="btn sm ghost" data-a="sprm" data-i="'+id+'">Retirer</button></div>' : ''; }).join('')+
      (P.part.length<3? spSel('addp',null,P.part) : '')+'<div class="sub">+'+pc(SP_SLOT.part.boost).toString().replace('.',NDEC)+' % de ventes chacun ; le club perd 4 % de ses sponsors par partenaire.</div></div>';
  return h+card('Vos sociétés sponsors du club',c); }; }
CH.spset=el=>after(spSet(el.dataset.i,el.value));
ACT.sprm=el=>after(spSet('rmp',el.dataset.i));

