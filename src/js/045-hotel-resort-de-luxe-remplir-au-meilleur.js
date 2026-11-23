/* ============================================================
   HÔTEL / RESORT DE LUXE : remplir au meilleur prix
   Quatre types de chambres, chacun avec son prix, qui suit (ou non) la demande du jour.
   On peut vendre plus de chambres qu'on n'en a (surréservation) : les clients qui ne viennent
   pas compensent, sinon il faut reloger les clients en trop dans un autre hôtel, à vos frais.
   Systèmes : plateformes de réservation (plus de clients, commission), avis des clients,
   mariages et séminaires, spa et restaurant.
   Paliers : 4 étoiles, mariages et séminaires, 5 étoiles, palace, resorts à l'étranger.
   État b.m (v:2) : st (étoiles), px {type: multiplicateur du prix}, dyn, ob (surréservation),
   pl (plateformes), av (note /5), spa, resto, salles, mar, sem, pal, pres, rs, ev, y (veille).
   Les montants affichés sont en euros du jeu : le nombre de chambres suit le chiffre
   d'affaires de base (k = R0 / chiffre d'affaires de référence).
   ============================================================ */
const HT_T = [
  {id:'std', n:'Standard', N:24, P:260, e:2.4},
  {id:'sup', n:'Supérieure', N:10, P:420, e:2.2},
  {id:'ste', n:'Suite', N:5, P:850, e:2.0},
  {id:'pre', n:'Présidentielle', N:1, P:3500, e:1.8}
];
const HT_OCC=.70, HT_DEM=.84, HT_NS=.07, HT_COM=.18;
const HT_REF1 = HT_T.reduce((a,t)=>a+(t.id==='pre'?0:t.N)*HT_OCC*t.P,0);
/* taille de l'hôtel : le nombre de chambres suit le chiffre d'affaires de base de l'emplacement */
const htSz = b => Math.max(1,Math.round(metR0(b)/(HT_REF1*(b.lvl||1))));
const htRef = b => HT_REF1*(b.lvl||1)*htSz(b);
function htInit(b){ return {v:2, st:3, px:{std:1,sup:1,ste:1,pre:1}, dyn:0, ob:0, pl:0, av:4, spa:0, resto:0, salles:0, mar:0, sem:0, pal:0, pres:0, rs:0, ev:null, y:null, log:[]}; }
function htFix(b){ const m=b.m; if(!m||m.v===2) return;
  const n=htInit(b); n.st=clamp(m.stars||4,3,5); n.spa=m.spa?1:0; n.salles=m.semi?1:0; n.sem=m.semi?1:0; n.dyn=m.yield?1:0; if(m.log) n.log=m.log;
  const p=clamp(b.price||1,.8,1.3); Object.keys(n.px).forEach(k=>n.px[k]=p); b.m=n; b.price=1; b.mkt=0; }
function htRooms(b,t){ return t.id==='pre'? (b.m.pres? b.lvl||1 : 0) : t.N*(b.lvl||1)*htSz(b); }
function htSeason(b){ const C=cityOf(b), tour=(C.idx&&C.idx.tour)||3; return metSeason(.12+.04*tour)*(festOf(b.city).names.length?1.15:1); }
function htStarP(m){ return (1+.18*(m.st-4))*(m.pal?1.15:1)*(m.spa?1.06:1); }
/* demande du jour pour un type, au prix de référence */
function htDemand(b,t,day){ const m=b.m, N=htRooms(b,t); if(!N) return 0;
  const we=isWE(day||S.day), ev=m.ev&&m.ev.until>=S.day? m.ev : null;
  let f=HT_DEM*htSeason(b)*(1-.04*(m.st-4))*(1+.25*(m.av-4))*(m.pl? 1.3 : 1);
  if(m.sem&&!we&&(t.id==='std'||t.id==='sup')) f*=1.08;
  if(ev&&ev.k==='salon') f*=1.5; if(ev&&ev.k==='star'&&(t.id==='ste'||t.id==='pre')) f*=1.4;
  return N*f;
}
/* résultat d'un type pour un multiplicateur de prix donné (sans hasard) */
function htSim(b,t,mult,ns){ const m=b.m, N=htRooms(b,t); if(!N) return {N:0,occ:0,rel:0,rev:0,price:0};
  const price=t.P*htStarP(m)*mult, dem=htDemand(b,t)*Math.pow(1/mult,t.e);
  const booked=Math.min(dem,N*(1+m.ob)), arr=booked*(1-(ns===undefined?HT_NS:ns)), occ=Math.min(arr,N), rel=Math.max(0,arr-N);
  const com=m.pl? HT_COM*.3/1.3 : 0;
  return {N, occ, rel, price, rev:occ*price*(1-com)};
}
/* coût d'une chambre occupée (ménage, linge, accueil) */
function htRoomCost(b,t){ return .45*t.P*(1+(b.m.st-4)*.08); }
function htBestMult(b,t){ let best=1, bv=-Infinity; for(let x=.6;x<=1.8001;x+=.05){ const r=htSim(b,t,x); const v=r.rev-r.rel*r.price*1.3-r.occ*htRoomCost(b,t); if(v>bv){ bv=v; best=Math.round(x*100)/100; } } return best; }
function htCalc(b){ const m=b.m; let rev=0, occ=0, N=0, rel=0, rows=[];
  HT_T.forEach(t=>{ const r=htSim(b,t,m.px[t.id]); rows.push(Object.assign({t},r)); rev+=r.rev; occ+=r.occ; N+=r.N; rel+=r.rel*r.price*1.3; });
  return {rev, occ, N, relCost:rel, rows, k:metR0(b)/Math.max(1,htRef(b))};
}
MET.hotel = {
  fam:'resto', core:true, init:htInit, fix:htFix,
  ranks:[
    {n:'Quatre étoiles', d:'Le classement 4 étoiles et la surréservation sont disponibles.'},
    {n:'Mariages et séminaires', d:'Des salles de réception pour les mariages du week-end et les séminaires en semaine.'},
    {n:'Cinq étoiles', d:'Le classement 5 étoiles et la suite présidentielle.'},
    {n:'Palace', d:'La distinction Palace, pour un hôtel 5 étoiles noté au moins 4,5 par ses clients.'},
    {n:'Resorts à l’étranger', d:'Ouvrez des resorts sous votre marque dans les grandes destinations.'}
  ],
  mods(b){ htFix(b); const m=b.m, c=htCalc(b), ref=htRef(b);
    const restoRev= m.resto? c.occ*38*c.k : 0;
        return { vol:1, price:c.rev/ref, cogs:Math.max(.05,c.rows.reduce((a,r)=>a+r.occ*htRoomCost(b,r.t),0)/(.45*ref))+(m.resto?.12:0),
      fixed: c.relCost*c.k + metR0(b)*((m.spa?.012:0)+(m.resto?.01:0)+(m.salles?.005:0)),
      rev: restoRev*.6 + (m.rs? metR0(b)*.3*m.rs*clamp(1+.25*(m.av-4),.5,1.4) : 0) + htEventRev(b) };
  },
  daily(b,ctx){ htFix(b); const m=b.m, c=htCalc(b);
    if(m.chase&&dlMode(b)!=='full') m.chase=0;
    if(m.dyn) HT_T.forEach(t=>{ m.px[t.id]=htBestMult(b,t); if(m.chase) m.px[t.id]=Math.min(m.px[t.id],1); });
    /* la veille : pour l'affichage */
    m.y={occ:c.N? c.occ/c.N : 0, rel:Math.round(c.rows.reduce((a,r)=>a+r.rel,0)), rows:c.rows.map(r=>({id:r.t.id, o:r.N? r.occ/r.N:0}))};
    /* avis */
    const value=c.rows.reduce((a,r)=>a+(r.N? r.occ*(m.px[r.t.id]-1) : 0),0)/Math.max(1,c.occ);
    const tgt=3.8+.2*(m.st-3)+(m.spa?.15:0)+(m.resto?.15:0)+(csOf(b)-60)/80-(m.y.rel/Math.max(1,c.N))*12-Math.max(0,value)*.8-(fatOf(b)>55?.3:0);
    m.av=clamp(m.av+(tgt-m.av)*.03+.02*norm(),1,5);
    /* événements */
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    if(ctx.open&&!m.ev){ const r=rnd();
      if(r<.008){ m.ev={k:'salon', until:S.day+4}; metLog(b,'un salon international remplit la ville : +50 % de demande pendant 4 jours. Les prix dynamiques en profitent.','good'); }
      else if(r<.012&&m.st>=4){ m.ev={k:'star', until:S.day+5}; m.av=clamp(m.av+.1,1,5); metLog(b,'une célébrité séjourne à l’hôtel : les suites s’arrachent pendant 5 jours.','good'); }
      else if(r<.016&&m.av<3.8){ m.av=clamp(m.av-.4,1,5); metLog(b,'un mauvais avis devient viral : la note des clients chute.','bad'); } }
    if(m.y.rel>0&&rnd()<.3) metLog(b,m.y.rel+' client'+(m.y.rel>1?'s':'')+' relogé'+(m.y.rel>1?'s':'')+' dans un autre hôtel, à vos frais : la surréservation était trop forte.','warn');
    if(m.pal&&(m.av<4.3||m.st<5)){ m.pal=0; metLog(b,'la distinction Palace vous est retirée : la note des clients est trop basse.','bad'); }
  },
  kpis(b){ htFix(b); const m=b.m, c=htCalc(b), rp=c.N? c.rev/c.N*c.k : 0;
    return [['Taux d’occupation', Math.round((c.N?c.occ/c.N:0)*100)+' %', c.N+' chambres · '+'★'.repeat(m.st)+(m.pal?' Palace':'')],
            ['Revenu par chambre', eur(rp,0), 'Par nuit, chambres vides comprises'],
            ['Note des clients', m.av.toFixed(1).replace('.',NDEC)+' / 5', m.av>=4.5?'Excellente':m.av>=4?'Très bonne':m.av>=3.5?'Correcte':'Décevante'],
            ['Saison', metSeasonName(), m.ev&&m.ev.until>=S.day? (m.ev.k==='salon'?'Salon international en ville':'Une célébrité séjourne ici') : festOf(b.city).names.length? 'Fête en ville : '+festOf(b.city).names[0] : 'Tourisme '+'★'.repeat((cityOf(b).idx&&cityOf(b).idx.tour)||3)]];
  },
  ctl(b){ htFix(b); const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    out.push({k:'tog', act:'dyn', label:'Prix dynamiques', val:m.dyn, sub:'Chaque jour, le prix de chaque type de chambre s’ajuste à la demande (saison, salons, avis).'});
    out.push({k:'tog', act:'pl', label:'Plateformes de réservation', val:m.pl, sub:'+30 % de demande, mais les plateformes prennent 18 % sur leurs réservations.'});
    if(mxHas(b,1)) out.push({k:'seg', act:'ob', label:'Surréservation', val:Math.round(m.ob*100), opts:[[0,'Aucune'],[5,'5 %'],[10,'10 %'],[15,'15 %']], sub:'Environ 7 % des clients ne viennent pas. Au-delà, il faut reloger les clients en trop dans un autre hôtel (130 % du prix de la nuit), et les avis baissent.'});
    if(mxHas(b,1)&&m.st<4) out.push({k:'btn', act:'star', label:'Passer à 4 étoiles', cost:d.cost*.35, sub:'La nuit se vend 18 % plus cher, pour une clientèle un peu plus réduite.'});
    if(mxHas(b,3)&&m.st===4) out.push({k:'btn', act:'star', label:'Passer à 5 étoiles', cost:d.cost*.5, sub:'La nuit se vend 18 % plus cher, pour une clientèle un peu plus réduite.'});
    out.push(m.spa? {k:'buy', act:'spa', label:'Spa et bien-être', owned:true, sub:'Les nuits se vendent 6 % plus cher et les avis montent.'} : {k:'buy', act:'spa', label:'Spa et bien-être', cost:d.cost*.3, sub:'Les nuits se vendent 6 % plus cher et les avis montent. Entretien quotidien.'});
    out.push(m.resto? {k:'buy', act:'resto', label:'Restaurant de l’hôtel', owned:true, sub:'Les clients dînent sur place.'} : {k:'buy', act:'resto', label:'Restaurant de l’hôtel', cost:d.cost*.15, sub:'Les clients dînent sur place : une recette par chambre occupée, et de meilleurs avis.'});
    if(mxHas(b,2)){ if(!m.salles) out.push({k:'buy', act:'salles', label:'Salles de réception', cost:d.cost*.2, sub:'Pour accueillir mariages et séminaires.'});
      else { out.push({k:'tog', act:'mar', label:'Mariages le samedi', val:m.mar, sub:'Environ '+eur(R0*.6,0)+' par mariage, une partie des chambres réservée aux invités.'});
             out.push({k:'tog', act:'sem', label:'Séminaires en semaine', val:m.sem, sub:'Environ '+eur(R0*.06,0)+' par jour de semaine et +8 % de demande pour les chambres standard et supérieures.'}); } }
    if(mxHas(b,3)) out.push(m.pres? {k:'buy', act:'pres', label:'Suite présidentielle', owned:true, sub:'Une suite par niveau de l’hôtel.'} : {k:'buy', act:'pres', label:'Suite présidentielle', cost:d.cost*.25, sub:'Une suite par niveau de l’hôtel, à 3 500 € la nuit au prix de base.'});
    if(mxHas(b,4)) out.push(m.pal? {k:'buy', act:'pal', label:'Distinction Palace', owned:true, sub:'Nuits 15 % plus chères. Retirée si la note passe sous 4,3.'} : {k:'btn', act:'pal', label:'Demander la distinction Palace', cost:d.cost*.4, dis:m.st<5||m.av<4.5, sub:'Il faut 5 étoiles et une note des clients d’au moins 4,5 (actuellement '+m.av.toFixed(1).replace('.',NDEC)+').'});
    if(mxHas(b,5)) out.push({k:'btn', act:'rs', label:'Ouvrir un resort à l’étranger ('+m.rs+' sur 3)', cost:d.cost*1.2*(1+Math.min(.5,m.rs*.25)), dis:m.rs>=3, sub:'Chaque resort rapporte environ '+eur(R0*.3,0)+' par jour, selon la note des clients de la marque.'});
    return out;
  },
  acts:{
    dyn:(b,v)=>{ b.m.dyn=+v?1:0; return ok(''); },
    pl:(b,v)=>{ b.m.pl=+v?1:0; return ok(''); },
    ob:(b,v)=>{ if(!mxHas(b,1)) return err('Palier 1 requis.'); b.m.ob=clamp(+v||0,0,15)/100; return ok('Surréservation : '+Math.round(b.m.ob*100)+' %.'); },
    px:(b,arg)=>{ const [id,dv]=String(arg).split(':'); if(!b.m.px[id]) return err('Type inconnu.'); b.m.px[id]=clamp(Math.round((b.m.px[id]+(+dv||0))*100)/100,.6,1.8); b.m.dyn=0; return ok(''); },
    star:(b)=>htStar(b,false),
    spa:(b)=>htBuy(b,'spa',.3,'Spa',0,false),
    resto:(b)=>htBuy(b,'resto',.15,'Restaurant de l’hôtel',0,false),
    salles:(b)=>htBuy(b,'salles',.2,'Salles de réception',2,false),
    pres:(b)=>htBuy(b,'pres',.25,'Suite présidentielle',3,false),
    mar:(b,v)=>{ if(!b.m.salles) return err('Construisez d’abord les salles.'); b.m.mar=+v?1:0; return ok(''); },
    sem:(b,v)=>{ if(!b.m.salles) return err('Construisez d’abord les salles.'); b.m.sem=+v?1:0; return ok(''); },
    pal:(b)=>{ const m=b.m; if(!mxHas(b,4)) return err('Palier 4 requis.'); if(m.pal) return err('Déjà Palace.'); if(m.st<5||m.av<4.5) return err('Il faut 5 étoiles et une note de 4,5.');
      const c=bizDef(b).cost*.4; if(!metBuy(b,c,'Distinction Palace')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.pal=1; metLog(b,'l’hôtel reçoit la distinction Palace.','good'); return ok('Distinction Palace obtenue.'); },
    rs:(b)=>htResort(b,false)
  },
  auto: htAuto
};
function htEventRev(b){ const m=b.m, R0=metR0(b), wd=wdOf(S.day); let r=0;
  if(m.salles&&m.mar&&wd===5) r+=R0*.6; if(m.salles&&m.sem&&wd<5) r+=R0*.06; return r; }
function htStar(b,auto){ const m=b.m; const ok4=m.st===3&&mxHas(b,1), ok5=m.st===4&&mxHas(b,3); if(!ok4&&!ok5) return err(m.st>=5?'Classement maximal.':'Palier de maîtrise insuffisant.');
  const c=bizDef(b).cost*(m.st===3?.35:.5); if(!(auto? dlSpend(b,c,'Montée en gamme') : metBuy(b,c,'Montée en gamme'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.st++; metLog(b,'l’hôtel obtient sa '+m.st+'e étoile.','good'); return ok('Classement : '+m.st+' étoiles.'); }
function htBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.');
  const c=bizDef(b).cost*f; if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m[k]=1; if(k==='salles'){ m.sem=1; } metLog(b,(auto?'le directeur ouvre : ':'nouveau : ')+label.toLowerCase()+'.','good'); return ok(label+' : c’est fait.'); }
function htResort(b,auto){ const m=b.m; if(!mxHas(b,5)) return err('Palier 5 requis.'); if(m.rs>=3) return err('Trois resorts au maximum.');
  const c=bizDef(b).cost*1.2*(1+Math.min(.5,m.rs*.25)); if(!(auto? dlSpend(b,c,'Resort à l’étranger') : metBuy(b,c,'Resort à l’étranger'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.rs++; metLog(b,'un resort ouvre sous votre marque ('+m.rs+' sur 3).','good'); return ok('Resort ouvert.'); }
/* le directeur de l'hôtel fixe les prix et la surréservation */
function htAuto(b,mode,q){
  htFix(b); const m=b.m;
  m.dyn=1; if(mxHas(b,1)) m.ob= q>.7? .07 : q>.45? .05 : 0;
  if(S.day%7===0){ const c=htCalc(b); m.pl= c.N&&c.occ/c.N<.78? 1 : 0; if(m.salles){ m.sem=1; m.mar=1; } }
  /* V1.8.5 : en délégation totale, le directeur vise la distinction Palace : pas de surréservation et pas de prix
     au-dessus du tarif normal tant que la note n'atteint pas 4,5 (puis 4,4 pour la garder) */
  m.chase= mode==='full'&&m.st===5&&mxHas(b,4)&&(m.pal? m.av<4.4 : m.av<4.55) ? 1 : 0;
  if(m.chase) m.ob=0;
  if(mode==='full'&&!m.pal&&m.st===5&&mxHas(b,4)&&m.av>=4.5){ const c=bizDef(b).cost*.4; if(dlCan(b,c,'Palace')) dlAct(b,c,()=>metAct(b,'pal')); }
  if(mode!=='full'||S.day%14!==0) return;
  if(m.st<5&&htStar(b,true).ok) return;
  for(const [k,f,l,rk] of [['spa',.3,'Spa',0],['resto',.15,'Restaurant de l’hôtel',0],['salles',.2,'Salles de réception',2],['pres',.25,'Suite présidentielle',3]]){ if(!m[k]&&mxHas(b,rk)){ if(htBuy(b,k,f,l,rk,true).ok) return; } }
  /* V1.8.7 : les resorts attendent que l'hôtel ait atteint le niveau 3 (l'agrandissement passe avant) */
  if(mxHas(b,5)&&b.lvl>=3) htResort(b,true);
}

