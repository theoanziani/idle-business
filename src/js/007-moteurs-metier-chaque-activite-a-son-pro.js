/* ============================================================
   MOTEURS MÉTIER : chaque activité a son propre fonctionnement.
   Le socle commun (bâtiment, équipe, salaires, satisfaction) reste dans biz.js / ops.js.
   Un moteur métier (MET[def]) définit :
     init(b)        état propre au métier, rangé dans b.m (créé au premier besoin : anciennes parties OK)
     mods(b)        effets sur la journée : vol (volume), price, cogs, wage, fixed (coût fixe/j), rev (recette en plus/j)
     daily(b,ctx)   évolution de l'état, événements du métier
     kpis(b)        chiffres clés affichés dans la fiche : [libellé, valeur, précision]
     ctl(b)         décisions et achats affichés dans la fiche (voir metCtl)
     acts           actions déclenchées par ces décisions : acts.x(b,arg) -> ok()/err()
   Familles : resto (restauration et loisirs). Les autres familles arrivent à l'étape 2.
   ============================================================ */
/* V1.6.7 : les notes des critiques (0 à 100 en interne) s’affichent sur 5, comme les avis clients */
function note5(v){ return (Math.round(v/2)/10).toFixed(1).replace('.',NDEC); }
const MET = {};
const MET_FAM = { resto:'Restauration et loisirs' };
function metOf(b){ return (b&&MET[b.def])||null; }
function metState(b){ const m=metOf(b); if(!m) return null; if(!b.m) b.m=m.init(b); if(!b.m.log) b.m.log=[]; return b.m; }
function metMods(b){
  const z={vol:1,price:1,cogs:1,wage:1,fixed:0,rev:0}, m=metOf(b);
  if(!m||b.status!=='active') return z;
  metState(b); return Object.assign(z,m.mods(b));
}
function metDaily(b,ctx){ const m=metOf(b); if(!m||b.status!=='active') return; metState(b); if(m.daily) m.daily(b,ctx); }
function metKpis(b){ const m=metOf(b); if(!m||b.status!=='active') return []; metState(b); return m.kpis(b); }
function metCtl(b){ const m=metOf(b); if(!m||b.status!=='active') return []; metState(b); return m.ctl(b); }
function metAct(b,act,arg){
  const m=metOf(b); if(!m) return err('Cette activité n’a pas encore de pilotage métier.');
  if(b.status!=='active') return err('Disponible une fois la société ouverte.');
  metState(b); const f=m.acts&&m.acts[act]; if(!f) return err('Action inconnue.');
  return f(b,arg);
}
function metLog(b,txt,cls){
  const st=metState(b); st.log.unshift({d:S.day,t:txt,c:cls||''}); if(st.log.length>6) st.log.length=6;
  log(cls==='bad'?'bad':cls==='good'?'good':cls==='warn'?'warn':'info','« '+b.name+' » : '+txt);
}
/* Achat d'équipement métier : payé sur la trésorerie, compté comme investissement */
function metBuy(b,cost,label){
  if(availFor(cityOf(b).ccy)<cost) return false;
  payCap('b:'+b.id,label+' : '+b.name,-cost); settleAccounts();
  b.inv$=(b.inv$||0)+cost; return true;
}
const metR0 = b => bizBase(b).R0;
/* Saisons : année de 360 jours, pic d'été vers le jour 200 */
const metDoy = () => (S.day-1)%360;
function metSeason(amp){ return 1+(amp||.25)*Math.cos(2*Math.PI*(metDoy()-200)/360); }
function metSeasonName(){ const s=metSeason(1); return s>1.45?'Haute saison':s<.55?'Basse saison':'Saison moyenne'; }
/* Météo du jour par ville (même tirage pour toute la journée) */
function metWeather(cityId){
  if(!S.wx||S.wx.d!==S.day) S.wx={d:S.day,c:{}};
  if(!S.wx.c[cityId]){ const r=rnd(), s=metSeason(.3); const pRain=clamp(.22-.12*(s-1)/.3,.08,.34);
    S.wx.c[cityId]= r<pRain? 'pluie' : r<pRain+.3? 'nuages' : 'soleil'; }
  return S.wx.c[cityId];
}
const MET_WXN = {soleil:'Soleil', nuages:'Nuageux', pluie:'Pluie'};

/* ---------------- RESTAURANT GASTRONOMIQUE ---------------- */
const RESTO_CARTE = [['Courte','4 plats, maîtrisés'],['Équilibrée','Une dizaine de plats'],['Large','Beaucoup de choix, plus de pertes']];
MET.resto = {
  fam:'resto',
  init: b => ({carte:1, prod:0, crit:45, stars:0, guide:S.day+45, waste:.06}),
  mods(b){ const m=b.m;
    const crit=0.9+0.2*m.crit/100;                       // 1,00 à 50/100
    return { vol:[.93,1,1.07][m.carte]*(1+.06*m.stars)*crit,
             price:1+.05*m.stars,
             cogs:[.93,1,1.08][m.carte]*(m.prod?1.12:1)*(1+m.waste-.06) };
  },
  daily(b,ctx){ const m=b.m;
    const tgt=40+m.prod*24+[10,0,-8][m.carte]+(csOf(b)-60)*.35-(fatOf(b)>50?8:0);
    m.crit=clamp(m.crit+(tgt-m.crit)*.04+norm()*1.2,0,100);
    m.waste=clamp([.03,.06,.11][m.carte]+(m.prod?.02:0)+(ctx.open?0:.02),0,.3);
    if(S.day>=m.guide){
      m.guide=S.day+45;
      if(m.crit>=72&&m.stars<3&&rnd()<.5){ m.stars++; S.rep=clamp(S.rep+1.5,0,100); metLog(b,'le guide gastronomique décerne une '+(m.stars===1?'première':'nouvelle')+' étoile ('+m.stars+' au total).','good'); }
      else if(m.crit<48&&m.stars>0){ m.stars--; metLog(b,'le guide retire une étoile : la cuisine a déçu les inspecteurs.','bad'); }
      else metLog(b,'visite discrète du guide : '+(m.stars? 'étoiles maintenues.' : m.crit>=60? 'remarqué, mais pas encore d’étoile.' : 'aucune distinction cette fois.'),'');
    }
    if(ctx.open&&!m.prod&&fatOf(b)>45&&rnd()<.004){ b.closedUntil=S.day+2; m.crit=clamp(m.crit-12,0,100); S.rep=clamp(S.rep-1,0,100); metLog(b,'intoxication alimentaire signalée : fermeture sanitaire 2 jours.','bad'); }
    if(ctx.open&&m.crit>=75&&rnd()<.01){ b.mods.push({mult:1.2,until:S.day+5,label:'Article élogieux'}); metLog(b,'un critique en vue publie un article élogieux : +20 % de réservations pendant 5 jours.','good'); }
  },
  kpis(b){ const m=b.m, l=b.last, ticket=52*b.price*(1+.05*m.stars);
    return [['Couverts / jour', l&&l.open? fmtN(Math.round(l.rev/ticket)) : '—', 'Ticket moyen '+eur(ticket,0)],
            ['Note des critiques', note5(m.crit)+' / 5', m.crit>=72?'Digne d’une étoile':m.crit>=55?'Bonne réputation':'À améliorer'],
            ['Étoiles', m.stars? '★'.repeat(m.stars) : 'Aucune', 'Prochain passage du guide : '+Math.max(0,m.guide-S.day)+' j'],
            ['Pertes', Math.round(m.waste*100)+' %', 'Produits jetés']];
  },
  ctl(b){ const m=b.m;
    return [{k:'seg', act:'carte', label:'La carte', val:m.carte, opts:RESTO_CARTE.map((x,i)=>[i,x[0]]), sub:RESTO_CARTE[m.carte][1]+'. Une carte courte plaît aux critiques et réduit les pertes ; une carte large attire plus de monde.'},
            {k:'seg', act:'prod', label:'Les produits', val:m.prod, opts:[[0,'Grossiste'],[1,'Frais et locaux']], sub: m.prod? 'Plus chers (+12 % sur les matières), mais la note des critiques monte vite et aucun risque sanitaire.' : 'Moins chers. Avec une équipe fatiguée, un risque d’intoxication existe.'}];
  },
  acts:{ carte:(b,v)=>{ b.m.carte=clamp(v|0,0,2); return ok('Nouvelle carte : '+RESTO_CARTE[b.m.carte][0].toLowerCase()+'.'); },
         prod:(b,v)=>{ b.m.prod=v?1:0; return ok(v?'Vous passez aux produits frais et locaux.':'Retour au grossiste.'); } }
};

/* ---------------- CHAÎNE DE FAST-FOOD ---------------- */
MET.fastfood = {
  fam:'resto',
  init: b => ({bornes:false, drive:false, nov:.4, fr:0, menus:0}),
  mods(b){ const m=b.m, cs=csOf(b);
    return { vol:(m.bornes?1.04:1)*(m.drive?1.1:1)*(1+.08*m.nov),
             cogs:1+.03*m.nov,
             wage:m.bornes?.95:1,
             rev:metR0(b)*.02*m.fr*clamp(cs/60,.4,1.3) };
  },
  daily(b,ctx){ const m=b.m;
    m.nov=Math.max(0,m.nov*.94);
    if(m.fr>0&&csOf(b)<45&&rnd()<.008*m.fr){ m.fr--; S.rep=clamp(S.rep-1.5,0,100); metLog(b,'un franchisé rompt son contrat : la qualité de la marque a baissé.','bad'); }
    if(ctx.open&&m.nov>.75&&rnd()<.015){ b.mods.push({mult:1.15,until:S.day+4,label:'Menu tendance'}); metLog(b,'le nouveau menu fait le buzz sur les réseaux : +15 % de clients pendant 4 jours.','good'); }
  },
  kpis(b){ const m=b.m, l=b.last, sf=staffFactor(b);
    const wait=clamp((m.bornes?3:5)+(1-Math.min(1,sf))*12-(m.drive?.5:0),2,25);
    return [['Clients / jour', l&&l.open? fmtN(Math.round(l.rev/(11*b.price))) : '—', 'Panier moyen '+eur(11*b.price,1)],
            ['Attente', Math.round(wait)+' min', wait>9?'Trop longue : recrutez':'Correcte'],
            ['Nouveauté du menu', Math.round(m.nov*100)+' %', m.menus? m.menus+' menu(s) lancé(s)' : 'Aucun menu spécial'],
            ['Franchisés', String(m.fr), m.fr? '+'+eur(metR0(b)*.02*m.fr*clamp(csOf(b)/60,.4,1.3),0)+' / j de redevances' : 'Aucun']];
  },
  ctl(b){ const m=b.m, C=b.m, R0=metR0(b), d=bizDef(b), frMax=2*b.lvl;
    return [{k:'buy', act:'bornes', label:'Bornes de commande', owned:m.bornes, cost:d.cost*.18, sub:'Moins d’attente, +4 % de clients et 5 % de salaires en moins.'},
            {k:'buy', act:'drive', label:'Drive', owned:m.drive, cost:d.cost*.35, dis:b.lvl<2&&!m.drive, sub: b.lvl<2? 'Disponible à partir du niveau 2.' : '+10 % de clients, servis depuis leur voiture.'},
            {k:'btn', act:'menu', label:'Lancer un menu du moment', cost:R0*3, sub:'Relance l’intérêt des clients (jusqu’à +8 %). L’effet s’use en deux semaines environ.'},
            {k:'btn', act:'franchise', label:'Vendre une franchise', gain:d.cost*.4*(1+.1*C.fr), dis:m.fr>=frMax||csOf(b)<55, sub: m.fr>=frMax? 'Maximum atteint pour ce niveau ('+frMax+').' : csOf(b)<55? 'La note doit atteindre 3,2 étoiles pour attirer des franchisés.' : 'Un entrepreneur ouvre un restaurant sous votre marque : il paie un droit d’entrée puis une redevance chaque jour. Si la qualité baisse, il peut partir.'}];
  },
  acts:{
    bornes:b=>{ if(b.m.bornes) return err('Déjà installées.'); const c=bizDef(b).cost*.18; if(!metBuy(b,c,'Bornes de commande')) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.'); b.m.bornes=true; return ok('Bornes installées.'); },
    drive:b=>{ if(b.m.drive) return err('Déjà construit.'); if(b.lvl<2) return err('Niveau 2 requis.'); const c=bizDef(b).cost*.35; if(!metBuy(b,c,'Drive')) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.'); b.m.drive=true; return ok('Drive ouvert.'); },
    menu:b=>{ const c=metR0(b)*3; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante.'); pay('b:'+b.id,'Menu du moment',-c); b.m.nov=1; b.m.menus++; return ok('Nouveau menu lancé.'); },
    franchise:b=>{ const m=b.m; if(m.fr>=2*b.lvl) return err('Maximum atteint pour ce niveau.'); if(csOf(b)<55) return err('Note insuffisante : 3,2 étoiles requises.'); const g=bizDef(b).cost*.4*(1+.1*m.fr); payCap('b:'+b.id,'Droit d’entrée franchise : '+b.name,g); m.fr++; metLog(b,'nouveau franchisé ('+m.fr+') : '+eur(g,0)+' encaissés.','good'); return ok('Franchise vendue.'); }
  }
};

/* ---------------- HÔTEL / RESORT DE LUXE ---------------- */
MET.hotel = {
  fam:'resto',
  init: b => ({stars:4, spa:false, semi:false, yield:false, conf:0}),
  season(b){ const C=cityOf(b), tour=(C.idx&&C.idx.tour)||3; const fe=festOf(b.city).names.length? 1.15 : 1;
    return metSeason(.12+.04*tour)*fe; },
  mods(b){ const m=b.m, s=this.season(b), wd=!isWE(S.day);
    return { vol:s*(1-.03*(m.stars-4))*(m.semi&&wd?1.08:1)*(m.conf>S.day?1.2:1),
             price:(1+.11*(m.stars-4))*(m.spa?1.08:1)*(m.yield? 1+.55*(s-1) : 1),
             fixed:m.spa? metR0(b)*.012 : 0 };
  },
  daily(b,ctx){ const m=b.m;
    if(m.semi&&ctx.open&&m.conf<=S.day&&rnd()<.025){ m.conf=S.day+3; metLog(b,'un congrès réserve vos salles de séminaire : +20 % de chambres pendant 3 jours.','good'); }
    if(ctx.open&&fatOf(b)>55&&rnd()<.012){ b.mods.push({mult:.9,until:S.day+6,label:'Avis négatifs'}); metLog(b,'des avis en ligne se plaignent de la propreté : -10 % de réservations pendant 6 jours.','bad'); }
  },
  occ(b){ const pr=bizProjection(b); return clamp(.64*pr.volF/pr.R0*(b.last&&!b.last.open?0:1),.12,.98); },
  kpis(b){ const m=b.m, rooms=40*b.lvl, mm=metMods(b), night=170*b.price*mm.price, occ=this.occ(b);
    return [['Taux d’occupation', Math.round(occ*100)+' %', rooms+' chambres'],
            ['Prix moyen de la nuit', eur(night,0), m.yield?'Prix dynamiques activés':'Prix fixes'],
            ['Revenu par chambre', eur(occ*night,0), 'Par nuit, chambres vides comprises'],
            ['Saison', metSeasonName(), festOf(b.city).names.length? 'Fête en ville : '+festOf(b.city).names[0] : 'Tourisme '+'★'.repeat((cityOf(b).idx&&cityOf(b).idx.tour)||3)]];
  },
  ctl(b){ const m=b.m, d=bizDef(b);
    return [{k:'stars', act:'stars', label:'Classement : '+'★'.repeat(m.stars), val:m.stars, cost:d.cost*.35, dis:m.stars>=5, sub: m.stars>=5? 'Palace : le plus haut classement.' : 'Passer à '+(m.stars+1)+' étoiles : la nuit se vend 11 % plus cher, pour une clientèle un peu plus réduite.'},
            {k:'tog', act:'yield', label:'Prix dynamiques', val:m.yield, sub:'Le prix suit la saison : plus cher en été et pendant les fêtes, moins cher en hiver.'},
            {k:'buy', act:'spa', label:'Spa et bien-être', owned:m.spa, cost:d.cost*.3, sub:'La nuit se vend 8 % plus cher. Entretien quotidien.'},
            {k:'buy', act:'semi', label:'Salles de séminaire', owned:m.semi, cost:d.cost*.2, sub:'+8 % de chambres en semaine et des congrès de temps en temps.'}];
  },
  acts:{
    stars:b=>{ const m=b.m; if(m.stars>=5) return err('Classement maximal.'); const c=bizDef(b).cost*.35; if(!metBuy(b,c,'Montée en gamme')) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.'); m.stars++; metLog(b,'l’hôtel obtient sa '+m.stars+'e étoile.','good'); return ok('Classement : '+m.stars+' étoiles.'); },
    yield:(b,v)=>{ b.m.yield=!!+v; return ok(b.m.yield?'Prix dynamiques activés.':'Prix fixes.'); },
    spa:b=>{ if(b.m.spa) return err('Déjà construit.'); const c=bizDef(b).cost*.3; if(!metBuy(b,c,'Spa')) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.'); b.m.spa=true; return ok('Spa ouvert.'); },
    semi:b=>{ if(b.m.semi) return err('Déjà construites.'); const c=bizDef(b).cost*.2; if(!metBuy(b,c,'Salles de séminaire')) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.'); b.m.semi=true; return ok('Salles de séminaire ouvertes.'); }
  }
};

/* ---------------- PARC D'ATTRACTIONS ---------------- */
const PARK_RIDES = [
  {id:'carrousel', n:'Carrousel', c:0,   ap:.05, cap:400},
  {id:'grand8',    n:'Grand huit', c:0,  ap:.10, cap:900},
  {id:'riviere',   n:'Rivière sauvage', c:.11, ap:.09, cap:700},
  {id:'roue',      n:'Grande roue', c:.08, ap:.06, cap:600},
  {id:'fantome',   n:'Train fantôme', c:.06, ap:.05, cap:500},
  {id:'chute',     n:'Tour de chute libre', c:.15, ap:.11, cap:650},
  {id:'looping',   n:'Montagnes russes à looping', c:.22, ap:.14, cap:1000}
];
const PARK_MAINT = [['Économe','Peu cher, mais pannes fréquentes et risque d’accident'],['Normal','Équilibré'],['Renforcé','Cher, presque aucune panne']];
MET.park = {
  fam:'resto',
  init: b => ({rides:['carrousel','grand8'], down:{}, maint:1, wait:20}),
  up(b){ return b.m.rides.filter(id=>!(b.m.down[id]>S.day)); },
  mods(b){ const m=b.m, up=this.up(b), wx=metWeather(b.city);
    const ap=up.reduce((a,id)=>a+PARK_RIDES.find(r=>r.id===id).ap,0);
    const w={soleil:1.1,nuages:1,pluie:.55}[wx];
    return { vol:(.92+ap)*Math.pow(metSeason(.3),1.2)*w*(m.wait>50?.92:1),
             fixed:metR0(b)*[.004,.009,.018][m.maint]*m.rides.length };
  },
  daily(b,ctx){ const m=b.m;
    Object.keys(m.down).forEach(id=>{ if(m.down[id]<=S.day) delete m.down[id]; });
    const pB=[.014,.006,.0015][m.maint];
    m.rides.forEach(id=>{ if(!m.down[id]&&rnd()<pB){ const n=rint(2,5); m.down[id]=S.day+n; metLog(b,'panne sur « '+PARK_RIDES.find(r=>r.id===id).n+' » : fermée '+n+' jours.','warn'); } });
    if(ctx.open&&m.maint===0&&rnd()<.0012){ b.closedUntil=S.day+4; S.rep=clamp(S.rep-3,0,100); metLog(b,'accident sur une attraction mal entretenue : parc fermé 4 jours, enquête en cours.','bad'); }
    const up=this.up(b), cap=up.reduce((a,id)=>a+PARK_RIDES.find(r=>r.id===id).cap,0)*Math.sqrt(b.lvl);
    const vis=b.last&&b.last.open? b.last.rev/(38*b.price) : 0;
    m.wait=cap? clamp(vis/cap*28,3,120) : 0;
  },
  kpis(b){ const m=b.m, l=b.last, wx=metWeather(b.city), up=this.up(b);
    return [['Visiteurs / jour', l&&l.open? fmtN(Math.round(l.rev/(38*b.price))) : '—', 'Billet '+eur(38*b.price,0)],
            ['Attente moyenne', Math.round(m.wait)+' min', m.wait>50?'Les visiteurs repartent : ajoutez des attractions':'Supportable'],
            ['Météo du jour', MET_WXN[wx], wx==='pluie'?'Fréquentation en baisse':metSeasonName()],
            ['Attractions en service', up.length+' / '+m.rides.length, Object.keys(m.down).length? 'Réparations en cours' : 'Toutes ouvertes']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    out.push({k:'seg', act:'maint', label:'Entretien des attractions', val:m.maint, opts:PARK_MAINT.map((x,i)=>[i,x[0]]), sub:PARK_MAINT[m.maint][1]+'. Coût : '+eur(metR0(b)*[.004,.009,.018][m.maint]*m.rides.length,0)+' / jour.'});
    PARK_RIDES.filter(r=>r.c>0).forEach(r=>out.push({k:'buy', act:'ride', arg:r.id, label:r.n, owned:m.rides.includes(r.id), cost:d.cost*r.c, sub:'Attractivité +'+Math.round(r.ap*100)+' %, '+fmtN(r.cap)+' visiteurs / heure.'}));
    return out;
  },
  acts:{
    maint:(b,v)=>{ b.m.maint=clamp(v|0,0,2); return ok('Entretien : '+PARK_MAINT[b.m.maint][0].toLowerCase()+'.'); },
    ride:(b,id)=>{ const r=PARK_RIDES.find(x=>x.id===id); if(!r) return err('Attraction inconnue.'); if(b.m.rides.includes(id)) return err('Déjà construite.');
      const c=bizDef(b).cost*r.c; if(!metBuy(b,c,'Attraction « '+r.n+' »')) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
      b.m.rides.push(id); metLog(b,'nouvelle attraction : « '+r.n+' ».','good'); return ok('« '+r.n+' » construite.'); }
  }
};

/* ---------------- NOMS D'ENTREPRISE ---------------- */
const BIZ_NAMES = {
  resto:['La Table {dq}','Maison {h}','Le Comptoir de {v}','Chez {p}'],
  fastfood:['{h} Burger','Speedy {v}','Le Grill {dq}','Croc’ {h}'],
  hotel:['Grand Hôtel {h}','Le Palace de {v}','Hôtel {dq}','Résidence {h}'],
  park:['{h} Land','Les Jardins de {v}','Parc {h}','Fantasia {v}'],
  repair:['Atelier {h}','Répar’ {q}','Clinique du Mobile {v}'],
  ecom:['{h} Shop','Boutique {q}','Le Panier de {v}'],
  agency:['{h} Immobilier','Agence {dq}','Clés de {v}'],
  staffing:['{h} Talents','Recrutement {v}','{h} RH'],
  farm:['Ferme {h}','Les Champs de {v}','Domaine {h}'],
  cyber:['{h} Sécurité','Bastion {v}','Rempart IT'],
  build:['{h} Construction','Bâtir {v}','Les Bâtisseurs {dq}'],
  textile:['Filature {h}','Textiles de {v}','Atelier {h}'],
  saas:['{h} Cloud','Nuage de {v}','{h} Logiciel'],
  electronics:['{h} Composants','Microtech {v}','{h} Électronique'],
  super:['Marché {h}','Hyper {v}','Les Halles {dq}'],
  studio:['Studio {h}','{v} Productions','Films {h}'],
  ai:['{h} IA','Neurone {v}','{h} Labs'],
  promo:['{h} Promotion','Résidences de {v}','Bâtiments {h}'],
  gallery:['Galerie {h}','Maison de ventes de {v}','Galerie {dq}'],
  phones:['{h} Mobile','Phonetech {v}','{h} Devices'],
  couture:['Maison {h}','{h} Paris','Atelier {h} Couture'],
  renew:['{h} Énergie','Soleil de {v}','Vents {dq}'],
  dc:['{h} Data','Centre de données {v}','{h} Hébergement'],
  dealer:['{h} Automobiles','Garage {dq}','{v} Auto'],
  office:['Tour {h}','Bureaux {dq}','{v} Business Center'],
  shipping:['{h} Maritime','Compagnie de {v}','{h} Shipping'],
  warehouse:['{h} Logistique','Entrepôts de {v}','Plateforme {h}']
};
const BIZ_FIRST = ['Léon','Margot','Hugo','Inès','Jules','Clara','Paul','Lina','Sacha','Rose'];
function bizNameSuggest(def,cityId,distId,k){
  const L=BIZ_NAMES[def]||['{h} '+((D.biz[def]||{}).n||'Société')];
  const C=D.CITIES[cityId]||D.CITIES.paris, dd=(C.d||[]).find(x=>x.id===distId)||{n:C.n};
  const h=String((S&&S.name)||'Lambert').trim().split(/\s+/).pop();
  const q=String(dd.n).replace(/^(Le |La |Les |L’|L')/,'');
  const dq=deQ(String(dd.n));
  const i=((k|0)%L.length+L.length)%L.length;
  let s=L[i].replace('{h}',h).replace('{v}',C.n).replace('{dq}',dq).replace('{q}',q).replace('{p}',BIZ_FIRST[(S.day+(k|0))%BIZ_FIRST.length]);
  if(S.biz&&S.biz.some(b=>b.name===s)) s+=' '+(S.biz.filter(b=>b.name.indexOf(s)===0).length+1);
  return s;
}
/* « de » + nom de quartier, avec la bonne contraction */
function deQ(n){
  if(/^Le /.test(n)) return 'du '+n.slice(3);
  if(/^La /.test(n)) return 'de la '+n.slice(3);
  if(/^Les /.test(n)) return 'des '+n.slice(4);
  if(/^L[’']/.test(n)) return 'de l’'+n.slice(2);
  if(/^Champs|s-[A-ZÉ].*s$/.test(n)) return 'des '+n;
  if(/^[AEIOUYÉÈÊÂÎaeiouyéèêâîH]/.test(n)) return 'd’'+n;
  return 'de '+n;
}
function cleanBizName(s){ return String(s||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,40); }
function renameBiz(b,name){
  const n=cleanBizName(name); if(n.length<2) return err('Le nom doit faire au moins 2 caractères.');
  const old=b.name; b.name=n; log('info','« '+old+' » s’appelle désormais « '+n+' ».'); return ok('Société renommée.');
}
/* V2.4.9 : cible de l'image de marque (compagnies aérienne et maritime) : 30 + facteurs, plafonnée à 95 */
const imgTarget = P => Math.min(95, 30+P.reduce((a,x)=>a+x[1],0));

