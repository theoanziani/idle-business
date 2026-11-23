/* ============================================================
   MENU PLUS ET AGENCE DE RECRUTEMENT
   ============================================================ */
function barRow(k,s,i,n){
  const mv=(d,sym,lab,dis)=>'<button class="ib" data-a="barmove" data-i="'+k+'" data-v="'+d+'" aria-label="'+lab+' '+esc(NAVLBL(k))+'"'+(dis?' disabled':'')+'>'+sym+'</button>';
  return '<div class="barit"><b>'+esc(NAVLBL(k))+'</b><span class="ibs">'+mv(-1,'↑','Monter',i===0)+mv(1,'↓','Descendre',i===n-1)+
    '<button class="ib" data-a="barside" data-i="'+k+'" aria-label="Passer '+esc(NAVLBL(k))+' de l’autre côté">⇄</button>'+
    '<button class="ib dng" data-a="barrm" data-i="'+k+'" aria-label="Retirer '+esc(NAVLBL(k))+' de la barre">×</button></span></div>';
}
const MGROUPS=[['Sociétés',['agency','logi','rivals','cities']],['Finance',['markets','bank','books']],['Immobilier et luxe',['immo','luxe','auction']],['Pouvoir',['pol']],['Aide',['guide','set']]];
const MDESC={agency:'Recrutement, RH, directeurs',logi:'Production, contrats, transport',rivals:'Concurrents, rachats, classement',cities:'Achat de villes et de pays',markets:'Bourse, crypto, start-ups',bank:'Votre banque',fx:'Comptes et conversions',books:'Grand livre, impôts, emprunts',immo:'Biens locatifs',luxe:'Voitures, yachts, art, pays',auction:'Enchères et collection',pol:'Lois, élections, offshore',guide:'Toutes les règles',set:'Sauvegardes, affichage'};
function vPlus(){
  const B=navBar(), used=B.l.concat(B.r), full=used.length>=PINMAX;
  const badge={bank:S.bank.lic&&S.bank.apps.length&&bankOpen()?S.bank.apps.length:0, pol:S.bills.length&&!S.country?S.bills.length:0, rivals:rivBadge()};
  let h=head('Plus')+wealthCard();
  const tile=([k,t,d])=>'<div class="tile"><button class="go" data-a="tab" data-i="'+k+'"><span class="ic">'+icon(k)+'</span><span style="min-width:0"><b>'+t+(badge[k]?' '+pill(badge[k],'bad'):'')+'</b>'+(MDESC[k]?'<small>'+MDESC[k]+'</small>':'')+'</span></button></div>';
  const seen=new Set();
  MGROUPS.forEach(([g,ks])=>{ const items=ks.map(k=>MENU.find(x=>x[0]===k)).filter(Boolean); items.forEach(x=>seen.add(x[0])); if(items.length) h+='<div class="cat-h">'+g+'</div><div class="tiles">'+items.map(tile).join('')+'</div>'; });
  const rest=MENU.filter(x=>!seen.has(x[0])); if(rest.length) h+='<div class="tiles">'+rest.map(tile).join('')+'</div>';
  return h;
}

/* Éditeur de la barre du bas : ouvert depuis Réglages > Barre du bas (fenêtre « baredit ») */
function barEditor(){
  const B=navBar(), used=B.l.concat(B.r), full=used.length>=PINMAX;
  const side=(a,lab)=>'<div class="bars"><div class="tag">'+lab+'</div>'+(a.length? a.map((k,i)=>barRow(k,lab,i,a.length)).join('') : '<div class="sub">Aucun raccourci.</div>')+'</div>';
  const free=MENU.filter(x=>!used.includes(x[0]));
  return '<div class="stack"><div class="row bar-prev">'+B.l.map(k=>pill(NAVLBL(k))).join('')+pill('Sociétés')+pill('Accueil','info')+B.r.map(k=>pill(NAVLBL(k))).join('')+pill('Plus')+'</div>'+
    side(B.l,'À gauche d’Accueil')+side(B.r,'À droite d’Accueil')+
    '<div class="tag">Ajouter ('+used.length+'/'+PINMAX+')</div>'+
    (full? '<div class="sub">Barre pleine.</div>' : '<div class="row">'+free.map(x=>'<button class="btn sm" data-a="baradd" data-i="'+x[0]+'">+ '+esc(x[1])+'</button>').join('')+'</div>')+
    '<div>'+btn('Rétablir par défaut','barreset',{c:'sm ghost'})+'</div></div>';
}

function vAgency(){
  const A=agencyInit(), lvl=A.lvl, nx=lvl+1, maxed=nx>=AG.names.length;
  const ents=agencyEnts(), vac=agencyVacancies();
  let h=head('Agence de recrutement','Un vivier de candidats pour toutes vos sociétés, renouvelé chaque jour. Vous payez des frais d’agence à chaque embauche.');
  /* Agence */
  let up='';
  if(!maxed){
    const locked=!unlocked(AG.tier[nx]);
    up='<div class="notice info"><b>Prochain niveau : '+AG.names[nx]+'.</b> '+AG.desc[nx]+' Vivier de '+AG.pool[nx]+' profils, frais de '+AG.feeDays[nx]+' jours de salaire.</div><div class="row">'+
      btn('Améliorer ('+eur(AG.cost[nx],0)+')','agupgrade',{c:'pri',dis:locked||S.cash<AG.cost[nx],why:locked?'Palier « '+D.TIERS[AG.tier[nx]].n+' » requis.':undefined})+(locked?'<span class="sub">Palier « '+D.TIERS[AG.tier[nx]].n+' » requis.</span>':'')+'</div>';
  } else up='<div class="notice good">Niveau maximal atteint.</div>';
  h+='<div class="grid g2">'+card(AG.names[lvl],'<div class="stack"><div class="lvl" aria-label="Niveau '+(lvl+1)+' sur '+AG.names.length+'">'+AG.names.map((n,i)=>'<i class="'+(i<=lvl?'on':'')+'"></i>').join('')+'</div>'+
      '<div class="sub">'+AG.desc[lvl]+'</div>'+
      '<div class="mini"><div><span>Vivier</span><b>'+AG.pool[lvl]+' profils</b></div><div><span>Frais d’agence</span><b>'+AG.feeDays[lvl]+' j de salaire</b></div><div><span>Embauches</span><b>'+A.hired+'</b></div></div>'+
      '</div>')+
    card('Postes à pourvoir',
      !ents.length? '<div class="sub">Aucune société.</div>' :
      !vac.length? '<div class="notice good">Tous vos postes sont pourvus.</div>' :
      '<div class="stack">'+ents.map(e=>{ const vs=vac.filter(v=>v.e===e); if(!vs.length) return ''; return '<div><b>'+esc(entLabel(e))+'</b><div class="row" style="margin-top:4px">'+vs.map(v=>pill(v.free+' × '+D.ROLES[v.role].s,'warn')).join('')+'</div></div>'; }).join('')+'</div>')+'</div>';
  h+=up?card('Évolution',up):'';
  h+=hrCard();
  h+=planCard();
  h+=offmCard();
  h+=mgrCard()+bossesCard();
  h+=card('Acheteur des boutiques','<div class="stack"><div class="sub">Gère les commandes de marchandises de toutes vos boutiques et négocie 3 % de remise. Salaire : '+eur(45*progMult(),0)+' par jour.</div>'+hireRow(!!S.proc,'setproc',{hire:3000})+'</div>')+card('Formation','<div class="stack"><div class="sub">Forme toutes les équipes disponibles (4 jours de salaire chacune, une fois tous les 20 jours).</div><div>'+btn('Former toutes les équipes','trainall',{c:'sm pri'})+'</div></div>');
  /* Candidats */
  const roles=[...new Set(A.pool.map(c=>c.role))];
  const allRoles=[...new Set(ents.flatMap(e=>entRoles(e).map(r=>r[0])))];
  if(ui.agRole && ui.agRole!=='all' && !allRoles.includes(ui.agRole)) ui.agRole='all';
  const cur=ui.agRole||'all';
  const list=A.pool.filter(c=>cur==='all'||c.role===cur);
  let body='<div class="stack"><div class="row">'+btn('Nouveau vivier ('+eur(AG.refresh[lvl],0)+')','agrefresh',{c:'sm',dis:!ents.length||S.cash<AG.refresh[lvl]})+'<span class="sub">Nouveau vivier gratuit chaque jour ; ce bouton en tire un autre aussitôt.</span></div><div class="row sp"><div class="seg" role="group" aria-label="Filtrer par poste">'+
    [['all','Tous']].concat(allRoles.map(r=>[r,D.ROLES[r].s])).map(([k,t])=>'<button class="'+(cur===k?'on':'')+'" data-a="agrole" data-v="'+k+'">'+t+'</button>').join('')+'</div>'+
    (lvl>=1&&cur!=='all'? btn('Recherche ciblée : '+D.ROLES[cur].s+' ('+eur(agencySearchCost(cur),0)+')','agsearch',{c:'sm',j:cur,dis:S.cash<agencySearchCost(cur)}) : '')+'</div>';
  if(lvl>=1&&cur==='all') body+='<div class="sub"></div>';
  if(!ents.length) body+='<div class="notice info">Lancez d’abord une société.</div>';
  else if(!list.length) body+='<div class="sub">Aucun candidat.</div>';
  list.forEach(c=>{
    const targets=vac.filter(v=>v.role===c.role).slice(0,4);
    body+='<div class="agc"><div class="who"><b>'+esc(c.name)+'</b>'+pill(D.ROLES[c.role].s)+(c.prod>=1.35?' '+pill('Talent rare','good'):'')+'</div>'+
      (c.sk&&vac.some(v=>v.role===c.role&&v.e.def==='repair')?'<div class="sub" style="grid-column:1/-1">En réparation : '+rpSkTxt(c.sk)+'</div>':'')+'<div class="st"><span>Product.</span><b class="'+noteCls(prodNote(c.prod))+'">'+prodNote(c.prod)+'</b></div><div class="st"><span>Fiabilité</span><b>'+Math.round(c.rel*100)+' %</b></div><div class="st"><span>Fidélité</span><b>'+Math.round(c.loy)+'</b></div>'+
      '<div class="hr">'+(targets.length? targets.map(v=>{ const w=agencyWage(v.e,c.role,c), f=agencyFee(v.e,c.role,c); return btn('Recruter chez '+esc(entLabel(v.e))+' · '+eur(w,0)+'/j · frais '+eur(f,0),'aghire',{c:'sm pri',i:c.id,j:v.key,dis:S.cash<f}); }).join('') : '<span class="sub">Aucun poste de ce type à pourvoir.</span>')+'</div></div>';
  });
  body+='</div>';
  h+=card('Candidats ('+list.length+')',body);
  return h;
}

/* Service RH automatisé */
function hrCard(){
  const L=hrLvl(), nx=L+1, maxed=nx>=HR.names.length;
  let body='<div class="stack"><div class="lvl" aria-label="Niveau '+(L+1)+' sur '+HR.names.length+'">'+HR.names.map((n,i)=>'<i class="'+(i<=L?'on':'')+'"></i>').join('')+'</div>'+
    '<div class="sub">'+(L? HR.desc[L] : 'Sans service RH, vous recrutez à la main. Un service RH pourvoit chaque jour les postes vacants avec les candidats de l’agence qui respectent vos critères, et limite la fatigue.')+'</div>';
  if(L) body+='<div class="mini"><div><span>Postes pourvus</span><b>Chaque jour, selon vos critères</b></div><div><span>Coût</span><b class="num">'+eur(HR.day[L]*progMult(),0)+' / j</b></div><div><span>Fidélité</span><b>+'+HR.loy[L]+'</b></div></div>';
  if(!maxed){ const lock=!unlocked(HR.tier[nx]);
    body+='<div class="notice info"><b>Prochain niveau : '+HR.names[nx]+'.</b> '+HR.desc[nx]+' '+eur(HR.day[nx],0)+' par jour.</div><div class="row">'+btn((L?'Améliorer':'Créer')+' ('+eur(HR.cost[nx],0)+')','hrup',{c:'pri',dis:lock||S.cash<HR.cost[nx],why:lock?'Palier « '+D.TIERS[HR.tier[nx]].n+' » requis.':undefined})+(lock?'<span class="sub">Palier « '+D.TIERS[HR.tier[nx]].n+' » requis.</span>':'')+'</div>';
  } else body+='<div class="notice good">Niveau maximal atteint.</div>';
  if(L){ const H=hrSet(), seg=(k,Lst,f)=>'<div class="seg">'+Lst.map((v,i)=>'<button class="'+(H[k]===i?'on':'')+'" data-a="hrset" data-j="'+k+'" data-v="'+i+'">'+(i?f(v):'Peu importe')+'</button>').join('')+'</div>';
    body+='<div class="stack"><b>Profils visés</b><div class="sub">Chaque jour, le service RH embauche dans le vivier tous les candidats au-dessus de vos minimums, jusqu’à pourvoir tous les postes. Le lundi, s’il reste des postes vides, il complète avec des profils moyens, seulement s’ils respectent aussi vos minimums.</div>'+
      '<span class="sub">Productivité minimale (sur 100)</span>'+seg('prod',HR_PROD,v=>String(v))+'<span class="sub">Fiabilité minimale</span>'+seg('rel',HR_REL,v=>v+' %')+'<span class="sub">Fidélité minimale (sur 100)</span>'+seg('loy',HR_LOY,v=>String(v))+
      '<b>Moral des directeurs</b><div class="sub">Dès que le moral d’un directeur passe sous ce seuil, le service RH l’augmente de 10 % (contrôle chaque jour).</div>'+seg('boss',HR_BOSS,v=>'Moral < '+v)+'</div>'; }
  return card(L? 'Service RH : '+HR.names[L] : 'Service RH', body+'</div>');
}

