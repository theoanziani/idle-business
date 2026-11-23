/* ============================================================
   REFONTE DES SOCIÉTÉS : interface
   - Fiche d'une activité « cœur » : prix et marketing génériques masqués.
   - Bloc « Délégation » et « Maîtrise » dans le pilotage du métier.
   - Parc d'attractions : plan interactif.
   ============================================================ */
{ const _mb=modalBiz; modalBiz=function(b){
  const r=_mb(b); if(!r||!r.body||!metCore(b)) return r;
  r.body=r.body.replace(/<div class="stack"><label for="sl-price">[\s\S]*?<\/div>/,'<div class="stack"><b>Prix et communication</b><div class="sub">Gérés dans le pilotage du métier, plus haut.</div></div>')
    .replace(/<div class="stack"><b>Marketing<\/b><div class="seg">[\s\S]*?<\/div><div class="sub">[\s\S]*?<\/div><\/div>/,'');
  return r;
}; }
/* blocs ajoutés au pilotage du métier */
function mxHtml(b){
  const m=metOf(b); if(!m||!m.ranks) return '';
  const r=mxRank(b), cs=m.rankSub, nx=cs? null : mxNext(b), lo=MX_STEPS[r], x=b.mx||0, rp=cs&&m.rankProg? m.rankProg(b) : null;
  return '<div class="met-c"><div class="row sp"><b>Maîtrise : palier '+r+' sur 5</b>'+(nx? '<span class="sub">'+Math.round((x-lo)/(nx-lo)*100)+' %</span>' : rp!==null&&r<5? '<span class="sub">'+Math.round(rp*100)+' %</span>' : r>=5? pill('Maximum','good') : '')+'</div>'+
    (nx? bar((x-lo)/(nx-lo),'g') : (rp!==null&&r<5? bar(rp,'g') : '')+(cs&&cs(b)? '<div class="sub">'+esc(cs(b))+'</div>' : ''))+
    '<div class="mx-l">'+m.ranks.map((k,i)=>'<div class="'+(i<r?'on':'')+'"><span>'+(i+1)+'</span><div><b>'+esc(k.n)+'</b><small>'+esc(k.d)+'</small></div></div>').join('')+'</div>'+
    (cs? '' : '<div class="sub">La maîtrise progresse chaque jour d’activité, plus vite quand la société est rentable.</div>')+'</div>';
}
function dlHtml(b){
  const m=metOf(b); if(!m||!m.auto) return '';
  const md=dlMode(b), x=b.boss;
  return '<div class="met-c"><b>Délégation au directeur du site</b>'+
    (x? '<div class="sub">'+esc(x.name)+' · compétence moyenne '+bossAvg(x).toFixed(1)+' / 10. Un meilleur directeur prend de meilleures décisions.</div>' : '<div class="sub">Aucun directeur : recrutez-en un dans la section « Directeur de site » de cette fiche.</div>')+
    '<div class="seg">'+Object.keys(DL_MODES).map(k=>'<button class="'+(md===k?'on':'')+'" data-a="dlset" data-i="'+b.id+'" data-v="'+k+'"'+(k!=='me'&&!x?' disabled':'')+'>'+DL_MODES[k].n+'</button>').join('')+'</div>'+
    '<div class="sub">'+DL_MODES[md].d+'</div>'+
    (md==='full'? '<div class="row"><span class="sub">Investissement</span><div class="seg">'+['10 %','25 %','50 %'].map((n,k)=>'<button class="'+((b.dlb||0)===k?'on':'')+'" data-a="dlbud" data-i="'+b.id+'" data-v="'+k+'">'+n+'</button>').join('')+'</div></div><div class="row sp"><label class="fc-tg"><span>Priorité du groupe</span><input type="checkbox" data-a="dlgrp" data-i="'+b.id+'"'+(b.dlg?' checked':'')+'></label>'+helpQ('Priorité du groupe','Quand la réserve atteint la moitié du prix de l’achat visé, le directeur complète avec la trésorerie générale, sans jamais la faire descendre sous un mois de dépenses du groupe.')+'</div><div class="sub">Part des bénéfices mise de côté chaque jour pour ses investissements. Réserve actuelle : '+eur(dlBudget(b),0)+'.'+(()=>{ const g=dlGoal(b); return g? ' Il vise : '+esc(g.n.charAt(0).toLowerCase()+g.n.slice(1))+', '+eur(g.c,0)+(dlBudget(b)>=g.c?' (prochain achat).':' ('+Math.min(99,Math.round(dlBudget(b)/g.c*100))+' %).') : ' Aucun achat en vue pour le moment : la réserve reste limitée à trois mois de mise de côté.'; })()+'</div>' : '')+
    '</div>';
}
ACT.dlset=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b) after(setDelegation(b,el.dataset.v)); };
ACT.dlbud=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(b) after(setDelegation(b,undefined,+el.dataset.v)); };
{ const _mc=metCard; metCard=function(b){
  let h=_mc(b); if(!h) return h; const m=metOf(b);
  const extra=(m.html? m.html(b) : ''), tail=dlHtml(b)+mxHtml(b);
  if(extra) h=h.replace('<div class="met-cs">','<div class="met-plan">'+extra+'</div><div class="met-cs">');
  if(tail) h=h.replace(/<div class="met-cs">([\s\S]*?)<\/div>(<div class="met-log">|<\/section>)/,(s0,a,c)=>'<div class="met-cs">'+a+tail+'</div>'+c);
  return h;
}; }

/* ---------- Plan du parc ---------- */
const PK_ICO = {
  carrousel:'<path d="M4 9 12 4l8 5z"/><path d="M6 9v9M12 9v9M18 9v9M4 19h16"/>',
  tasses:'<path d="M5 10h9v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M14 11h2a2 2 0 0 1 0 4h-2"/>',
  fantome:'<path d="M6 20V11a6 6 0 0 1 12 0v9l-2-2-2 2-2-2-2 2-2-2z"/><circle cx="10" cy="11" r=".8"/><circle cx="14" cy="11" r=".8"/>',
  riviere:'<path d="M3 9c3-2 6 2 9 0s6-2 9 0M3 14c3-2 6 2 9 0s6-2 9 0M3 19c3-2 6 2 9 0s6-2 9 0"/>',
  roue:'<circle cx="12" cy="10" r="7"/><path d="M12 3v14M5 10h14M7 5l10 10M17 5 7 15M8 21l4-4 4 4"/>',
  grand8:'<path d="M2 19c3 0 3-12 6-12s3 8 6 8 3-10 8-10"/><path d="M2 21h20"/>',
  chute:'<path d="M10 21V3h4v18M7 21h10"/><path d="M8 12h8"/>',
  spectacle:'<path d="M3 5h18v3c-2 0-3 2-3 4v8H6v-8c0-2-1-4-3-4z"/><path d="M9 20v-5h6v5"/>',
  looping:'<path d="M2 20c4 0 5-4 7-8a4 4 0 1 1 6 0c2 4 3 8 7 8"/>',
  buches:'<path d="M3 16c3-2 6 2 9 0s6-2 9 0M7 13l3-8 3 3 4-3"/><path d="M5 20h14"/>',
  simu:'<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M8 20h8M12 16v4"/><circle cx="12" cy="10.5" r="2.5"/>',
  mega:'<path d="M2 20c2-14 6-16 8-16s3 10 5 10 3-6 7-6"/><path d="M2 22h20M6 22V12M10 22V5M15 22v-8"/>',
  kiosque:'<path d="M5 9h14l-2-4H7zM6 9v11h12V9"/><path d="M10 20v-5h4v5"/>',
  resto:'<path d="M7 3v8a2 2 0 0 0 2 2v8M7 3v5M9 3v5M11 3v5M17 3c-2 2-2 6 0 8v10"/>',
  restoth:'<path d="M4 20h16M6 20v-9h12v9M4 11 12 5l8 6"/><path d="M10 20v-4h4v4"/>',
  souvenirs:'<path d="M6 8h12l-1 12H7z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  photo:'<rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 7l2-3h4l2 3"/>',
  bazar:'<path d="M3 10h18M4 10l2-5h12l2 5M5 10v10h14V10"/><path d="M9 20v-5h6v5"/>',
  jardin:'<path d="M12 21v-7"/><circle cx="12" cy="9" r="4"/><circle cx="6" cy="15" r="2.5"/><circle cx="18" cy="15" r="2.5"/>',
  fontaine:'<path d="M5 17h14l-2 4H7zM12 17V8M12 8c-3 0-5 2-5 5M12 8c3 0 5 2 5 5M12 4v4"/>',
  decor:'<path d="M5 21V9l4-5 4 5v12M13 21v-8l3-3 3 3v8M3 21h18"/>'
};
function pkIco(id,sz){ return '<svg viewBox="0 0 24 24" width="'+(sz||24)+'" height="'+(sz||24)+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(PK_ICO[id]||'')+'</svg>'; }
function pkSel(b){ return ui.pk&&ui.pk.b===b.id? ui.pk.c : -1; }
MET.park.html=function(b){
  const m=b.m, sel=pkSel(b), d=bizDef(b);
  let h='<div class="pk-head"><b>Plan du parc</b><span class="sub">Touchez une case pour construire</span></div><div class="pk-grid">';
  m.cells.forEach((c,i)=>{ const z=m.zones[pkZone(i)], th=z.th&&PK_TH[z.th], it=c&&pkIt(c.t);
    const cls='pk-c'+(z.own?'':' lock')+(it?' k-'+it.k:'')+(c&&c.d?' down':'')+(i===sel?' sel':'');
    const lab= it? it.n : z.own? 'Case libre' : 'Zone '+(pkZone(i)+1)+' à acheter';
    h+='<button class="'+cls+'" data-a="pksel" data-i="'+b.id+'" data-v="'+i+'" aria-label="'+esc(lab)+'"'+(th?' style="--zc:'+th.c+'"':'')+'>'+(it? pkIco(it.id,22) : z.own? '<span class="pk-plus">+</span>' : '')+'</button>'; });
  h+='</div><div class="pk-zones">'+m.zones.map((z,k)=>'<span'+(z.th?' style="--zc:'+PK_TH[z.th].c+'"':'')+'><i></i>Zone '+(k+1)+' : '+(z.own? (z.th? esc(PK_TH[z.th].n) : 'sans thème') : 'à acheter')+'</span>').join('')+'</div>';
  if(sel>=0) h+=pkPanel(b,sel);
  return h;
};
function pkPanel(b,i){
  const m=b.m, zk=pkZone(i), z=m.zones[zk], c=m.cells[i], it=c&&pkIt(c.t), can=x=>availFor(cityOf(b).ccy)>=x;
  const B=(lab,act,arg,o)=>'<button class="btn '+((o&&o.c)||'sm')+'" data-a="met" data-i="'+b.id+'" data-v="'+act+'" data-j="'+esc(arg)+'"'+(o&&o.dis?' disabled':'')+'>'+lab+'</button>';
  let h='<div class="pk-pan"><div class="row sp"><b>Zone '+(zk+1)+(z.th?' · '+esc(PK_TH[z.th].n):'')+'</b><button class="btn sm ghost" data-a="pksel" data-i="'+b.id+'" data-v="-1">Fermer</button></div>';
  if(!z.own){
    const cost=bizDef(b).cost*PK_ZCOST[zk], rk=PK_ZRANK[zk];
    h+='<div class="sub">Agrandissez le parc : six cases de plus pour de nouvelles attractions.'+(mxHas(b,rk)?'':' Palier de maîtrise '+rk+' requis.')+'</div><div>'+B('Acheter le terrain : '+eur(cost,0),'zone',zk,{c:'sm pri',dis:!mxHas(b,rk)||!can(cost)})+'</div></div>';
    return h;
  }
  h+='<div class="pk-th"><span class="sub">Thème</span><div class="seg">'+Object.keys(PK_TH).map(t=>'<button class="'+(z.th===t?'on':'')+'" data-a="met" data-i="'+b.id+'" data-v="theme" data-j="'+zk+':'+t+'">'+esc(PK_TH[t].n)+'</button>').join('')+'</div>'+
    '<div class="sub">Les attractions '+(z.th? PK_TAG[PK_TH[z.th].tag].toLowerCase()+'s' : 'du thème')+' de la zone attirent 25 % de visiteurs en plus.'+(z.th?' Changer de thème coûte '+eur(bizDef(b).cost*.05,0)+'.':' Le premier choix est gratuit.')+'</div></div>';
  if(it){
    const R=it.k==='ride';
    h+='<div class="pk-it">'+pkIco(it.id,30)+'<div><b>'+esc(it.n)+'</b><div class="sub">'+(R? PK_TAG[it.tg]+' · attractivité +'+Math.round(it.ap*100)+' % · capacité '+fmtN(Math.round(pkCapDay(b,it.cap)))+' visiteurs / jour' : it.sp? 'Dépense moyenne +'+eur(it.sp,1)+' par visiteur' : 'Embellit les attractions voisines')+(c.d?' · <b class="neg">en panne</b>':'')+'</div></div></div>'+
      '<div>'+B('Démonter (récupère '+eur(pkItemCost(b,it)*.25,0)+')','rm',i,{c:'sm ghost'})+'</div></div>';
    return h;
  }
  const near=pkAdj(i).map(j=>m.cells[j]&&pkIt(m.cells[j].t)).filter(Boolean);
  h+='<div class="sub">'+(near.some(x=>x.k==='ride')? 'Case voisine d’une attraction : idéale pour un restaurant ou une boutique (+25 %).' : 'Les restaurants et boutiques vendent plus à côté d’une attraction. Jardins et fontaines embellissent les attractions voisines.')+'</div>';
  Object.keys(PK_K).forEach(k=>{
    const L=PK_IT.filter(x=>x.k===k); if(!L.length) return;
    h+='<div class="tag">'+PK_K[k]+'</div><div class="pk-list">'+L.map(x=>{ const cost=pkItemCost(b,x), lock=!mxHas(b,x.rk), match=x.k==='ride'&&z.th&&PK_TH[z.th].tag===x.tg;
      const info= x.k==='ride'? PK_TAG[x.tg]+(match?' (thème)':'')+' · +'+Math.round(x.ap*100)+' % · '+fmtN(Math.round(pkCapDay(b,x.cap)))+' places / jour' : x.sp? '+'+eur(x.sp,1)+' / visiteur' : x.id==='decor'? 'Toute la zone +12 %' : 'Voisins +'+(x.id==='jardin'?6:10)+' %';
      return '<button class="pk-o'+(match?' match':'')+'" data-a="met" data-i="'+b.id+'" data-v="place" data-j="'+i+':'+x.id+'"'+(lock||!can(cost)?' disabled':'')+'>'+pkIco(x.id,22)+'<span><b>'+esc(x.n)+'</b><small>'+(lock? 'Palier '+x.rk+' requis' : esc(info))+'</small></span><em class="num">'+eur(cost,0)+'</em></button>'; }).join('')+'</div>';
  });
  return h+'</div>';
}
ACT.pksel=el=>{ const v=+el.dataset.v; ui.pk= v<0? null : {b:+el.dataset.i, c:v}; render(); };
/* une construction réussie referme le panneau */
{ const _met=ACT.met; ACT.met=el=>{ const v=el.dataset.v; _met(el); if((v==='place'||v==='rm'||v==='zone')&&ui.pk){ const b=S.biz.find(x=>x.id===ui.pk.b); if(b&&b.m&&(v!=='place'||b.m.cells[ui.pk.c])&&(v!=='zone'||b.m.zones[pkZone(ui.pk.c)].own)) { if(v!=='zone') ui.pk=null; render(); } } }; }

ACT.dlgrp=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b) return; b.dlg=b.dlg?0:1; toast(b.dlg?'Priorité du groupe activée pour « '+b.name+' ».':'Priorité du groupe désactivée.','good'); render(); };

