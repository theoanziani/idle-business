/* ============================================================
   PROMOTION IMMOBILIÈRE : opérations (étapes), terrains, marché
   ============================================================ */
function prBtn(b,v,j,lab,c,dis){ return '<button class="btn sm'+(c?' '+c:'')+'" data-a="met" data-i="'+b.id+'" data-v="'+v+'" data-j="'+j+'"'+(dis?' disabled':'')+'>'+lab+'</button>'; }
function prSeg(b,v,o,L,val){ return '<div class="seg">'+L.map(([k,n,dis])=>'<button class="'+(String(val)===String(k)?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="'+v+'" data-j="'+o.id+':'+k+'"'+(dis?' disabled':'')+'>'+n+'</button>').join('')+'</div>'; }
function prRate(){ return (S.macro.rate+2).toFixed(1).replace('.',NDEC)+' %'; }
function prSize(x){ return x>=3.5?'très grande opération':x>=1.3?'grande opération':x>=.8?'opération moyenne':'petite opération'; }
function prSteps(o){ const k=prStage(o); return '<div class="pr-steps">'+PR_ST.map((n,i)=>'<span class="'+(i<k?'done':i===k?'on':'')+'">'+n+'</span>').join('')+'</div>'; }
MET.promo.html=function(b){
  const m=b.m, R0=metR0(b), cash=availFor(cityOf(b).ccy);
  let h='<div class="pk-head"><b>Opérations</b><span class="sub">'+m.ops.length+' / '+prMax(b)+' en même temps</span></div>';
  if(!m.ops.length) h+='<div class="sub">Aucune opération. Achetez un terrain ci-dessous pour en lancer une.</div>';
  m.ops.forEach(o=>{ const V=prVal(b,o), C=prCost(b,o);
    h+='<div class="pk-pan pr-op"><div class="row sp"><div><b>'+esc(o.n)+'</b><div class="sub">'+esc(o.cn)+' · '+prSize(o.s*PR_DENS[o.dens].f)+' · '+PR_PROG[o.prog].n.toLowerCase()+(o.eco?' · écoquartier':'')+'</div></div></div>'+prSteps(o);
    if(o.stage==='etude'){
      h+='<div class="met-c"><b>Programme</b>'+prSeg(b,'prog',o,Object.keys(PR_PROG).map(k=>[k,PR_PROG[k].n,PR_PROG[k].rk&&!mxHas(b,PR_PROG[k].rk)]),o.prog)+'</div>';
      h+='<div class="met-c"><b>Densité</b>'+prSeg(b,'dens',o,PR_DENS.map((x,i)=>[i,x.n,x.rk&&!mxHas(b,x.rk)]),o.dens)+'<div class="sub">Plus dense : plus de surface à vendre, mais un permis plus long et plus de risque de recours.</div></div>';
      if(mxHas(b,2)) h+='<div class="row sp"><div><b>Label écoquartier</b><div class="sub">Prix +15 %, coût +8 %, deux fois moins de recours.</div></div>'+prBtn(b,'eco',o.id,o.eco?'Retirer':'Ajouter')+'</div>';
      const rk=o.r*PR_DENS[o.dens].r*(o.eco?.5:1);
      h+='<div class="ht-t"><div class="rs-d"><div><b>Prix de vente estimé</b><small>Au prix du marché aujourd’hui</small></div><small class="num">'+eur(V,0)+'</small></div><div class="rs-d"><div><b>Coût du chantier</b><small>'+prDur(o)+' jours'+(buildCoLevel()>0?' · avec votre société de construction':'')+'</small></div><small class="num">'+eur(C,0)+'</small></div><div class="rs-d"><div><b>Risque de recours</b><small>Riverains et associations</small></div><small class="num">'+Math.round(rk*100)+' %</small></div></div>';
      h+='<div class="row sp"><div class="sub">Dépôt du permis : '+eur(R0*2,0)+'. Réponse en 40 à 60 jours'+(PR_DENS[o.dens].pd?' (+'+PR_DENS[o.dens].pd+' j)':'')+'.</div>'+prBtn(b,'file',o.id,'Déposer le permis','pri',cash<R0*2)+'</div>';
    } else if(o.stage==='permis'){
      h+='<div class="sub">Instruction du permis : réponse dans '+Math.max(0,o.pe-S.day)+' jours'+(o.rc===2?' (recours en cours)':'')+'.</div>';
    } else {
      const pace=prPace(b,o);
      h+='<div class="ht-t"><div class="rs-d"><div><b>Vendu sur plan</b><small>'+Math.round(o.sold*100)+' % de la surface · environ '+(o.sold<1?String(Math.round(pace*30000)/10).replace('.',NDEC)+' % par mois':'tout est vendu')+'</small>'+bar(o.sold,'g')+'</div><small class="num">'+eur(o.sv,0)+'</small></div>'+
        (o.stage==='chantier'?'<div class="rs-d"><div><b>Chantier</b><small>Livraison dans '+Math.max(0,Math.round((1-o.cp)*o.cd))+' jours'+(o.loan?' · crédit de '+eur(o.loan,0)+' à '+prRate():'')+(o.late?' · en retard':'')+'</small>'+bar(o.cp,'')+'</div><small class="num">'+eur(o.cc,0)+'</small></div>':'')+
        '<div class="rs-d"><div><b>Encaissé</b><small>20 % à la signature, 70 % au fil du chantier, 10 % à la livraison</small></div><small class="num">'+eur(o.rec,0)+'</small></div></div>';
      if(o.sold<1) h+='<div class="met-c"><b>Prix : '+(o.pr>=1?'+':'')+Math.round((o.pr-1)*100)+' % par rapport au marché</b><div class="seg">'+[[-.05,'−5 %'],[-.02,'−2 %'],[.02,'+2 %'],[.05,'+5 %']].map(([v,n])=>'<button data-a="met" data-i="'+b.id+'" data-v="pr" data-j="'+o.id+':'+v+'">'+n+'</button>').join('')+'</div><div class="sub">Plus cher, chaque lot rapporte plus mais se vend moins vite.</div></div>';
      if(o.stage==='vente'){ const C2=prCost(b,o), ok3=o.sold>=.3;
        h+='<div class="row sp"><div class="sub">'+(ok3?'Assez de ventes signées : la banque suit.':'Il faut 30 % de surface vendue pour lancer le chantier, ou un crédit promoteur (70 % du coût, intérêts '+prRate()+').')+' Coût : '+eur(C2,0)+'.</div>'+(ok3?prBtn(b,'start',o.id+':0','Lancer le chantier','pri'):prBtn(b,'start',o.id+':1','Lancer avec un crédit'))+'</div>'; }
      if(o.stage==='livre'&&o.sold<1) h+='<div class="row sp"><div class="sub">Opération livrée. Vous pouvez céder les derniers lots en bloc à un investisseur (décote de 20 %).</div>'+prBtn(b,'sellrest',o.id,'Céder le reste')+'</div>';
    }
    h+='</div>'; });
  /* terrains */
  const full=m.ops.length>=prMax(b);
  h+='<div class="pk-head"><b>Terrains à vendre</b><span class="sub">Nouveaux terrains dans '+Math.max(0,m.landNext-S.day)+' j</span></div><div class="ht-t">'+m.land.map(L=>'<div class="ga-lot"><div class="row sp"><div><b>'+esc(L.n)+'</b><small>'+esc(L.cn)+' · '+prSize(L.s)+' · quartier '+(L.q>=1.2?'très recherché':L.q>=1?'recherché':L.q>=.85?'ordinaire':'populaire')+' · riverains '+(L.r>.2?'très vigilants':L.r>.12?'vigilants':'calmes')+'</small></div><b class="num">'+eur(L.price,0)+'</b></div><div class="row">'+prBtn(b,'land',L.id,'Acheter','',full||cash<L.price)+'</div></div>').join('')+'</div>';
  return h;
};

