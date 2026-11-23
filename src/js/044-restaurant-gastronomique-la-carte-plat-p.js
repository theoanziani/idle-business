/* ============================================================
   RESTAURANT GASTRONOMIQUE : la carte plat par plat
   On compose entrées, plats et desserts. Chaque plat a un coût en matières, un temps de
   préparation, une popularité, une difficulté (que le chef maîtrise ou non) et parfois une saison.
   Systèmes : le chef (niveau et spécialité), les services et les réservations, la cave à vins.
   Paliers : les étoiles du guide (1 à 3), puis une chaîne de bistrots, puis la télévision.
   État b.m (v:2) : carte {e,p,d}, chef, pm (prix du menu), srv, resa, acc, cave, gc, bis, tv,
   crit, stars, best, guide, out (plats introuvables), cands.
   ============================================================ */
const RS_COURSE = {e:'Entrées', p:'Plats', d:'Desserts'};
const RS_MAX = {e:4, p:5, d:3};
const RS_SPEC = {terroir:'Terroir', mer:'Produits de la mer', patis:'Pâtisserie', monde:'Cuisine du monde'};
const RS_SEAS = {pri:'Printemps', ete:'Été', aut:'Automne', hiv:'Hiver'};
/* c : matières par couvert (€) ; t : préparation (min) ; p : popularité /10 ; d : difficulté 1-5 */
const RS_DISH = [
  {id:'veloute', k:'e', n:'Velouté du moment', g:'terroir', c:3, t:10, p:5, d:1},
  {id:'oeuf', k:'e', n:'Œuf parfait, crème de champignons', g:'terroir', c:4, t:15, p:6, d:2},
  {id:'tartare', k:'e', n:'Tartare de saumon', g:'mer', c:6, t:10, p:7, d:2},
  {id:'tomates', k:'e', n:'Tomates anciennes, burrata', g:'terroir', c:4, t:8, p:7, d:1, s:'ete'},
  {id:'asperges', k:'e', n:'Asperges vertes, sabayon', g:'terroir', c:7, t:15, p:8, d:2, s:'pri'},
  {id:'gyoza', k:'e', n:'Gyozas au canard', g:'monde', c:5, t:20, p:7, d:3},
  {id:'foiegras', k:'e', n:'Foie gras mi-cuit', g:'terroir', c:9, t:20, p:8, d:3},
  {id:'stjacques', k:'e', n:'Carpaccio de Saint-Jacques', g:'mer', c:10, t:15, p:8, d:3, s:'hiv'},
  {id:'ravioles', k:'e', n:'Ravioles de langoustine', g:'mer', c:11, t:30, p:9, d:5},
  {id:'curry', k:'p', n:'Curry de légumes', g:'monde', c:6, t:25, p:6, d:1},
  {id:'blanquette', k:'p', n:'Blanquette de veau', g:'terroir', c:8, t:40, p:6, d:2},
  {id:'poisson', k:'p', n:'Poisson du jour, beurre blanc', g:'mer', c:11, t:20, p:7, d:2},
  {id:'magret', k:'p', n:'Magret, jus aux cerises', g:'terroir', c:10, t:25, p:7, d:2},
  {id:'risotto', k:'p', n:'Risotto aux cèpes', g:'terroir', c:9, t:30, p:8, d:3, s:'aut'},
  {id:'pigeon', k:'p', n:'Pigeon rôti, petits pois', g:'terroir', c:15, t:35, p:8, d:4},
  {id:'wellington', k:'p', n:'Bœuf Wellington', g:'monde', c:17, t:60, p:9, d:4},
  {id:'homard', k:'p', n:'Homard bleu rôti', g:'mer', c:22, t:30, p:9, d:4, s:'ete'},
  {id:'lievre', k:'p', n:'Lièvre à la royale', g:'terroir', c:16, t:90, p:8, d:5, s:'hiv'},
  {id:'mousse', k:'d', n:'Mousse au chocolat', g:'patis', c:2, t:10, p:6, d:1},
  {id:'creme', k:'d', n:'Crème brûlée', g:'patis', c:2, t:15, p:7, d:1},
  {id:'mochi', k:'d', n:'Mochis glacés', g:'monde', c:3, t:15, p:7, d:2},
  {id:'fraises', k:'d', n:'Tarte aux fraises', g:'patis', c:4, t:20, p:8, d:2, s:'ete'},
  {id:'montblanc', k:'d', n:'Mont-Blanc aux marrons', g:'patis', c:4, t:30, p:8, d:3, s:'aut'},
  {id:'parisbrest', k:'d', n:'Paris-Brest', g:'patis', c:3, t:35, p:8, d:3},
  {id:'souffle', k:'d', n:'Soufflé au Grand Marnier', g:'patis', c:4, t:25, p:8, d:4}
];
const rsDish = id => RS_DISH.find(x=>x.id===id);
const RS_CHEF_N = ['Antoine','Hélène','Kenji','Sofia','Marc','Léa','Youssef','Camille','Pierre','Nadia','Bruno','Élise'];
const RS_CHEF_L = ['Roussel','Marchand','Tanaka','Ferreira','Delmas','Aubert','Haddad','Lefort','Gaillard','Benali','Chevalier','Morel'];
const RS_CHEF_FEE = [0,0,4,12,30,70];      /* frais de recrutement, en jours de chiffre d'affaires de base */
const RS_CHEF_SAL = [0,0,.02,.05,.09,.15]; /* salaire en plus, en part du chiffre d'affaires de base par jour */
const RS_STAR = [0,68,78,88];             /* note des critiques demandée pour 1, 2, 3 étoiles */
function rsSeason(){ const d=metDoy(); return d>=60&&d<150?'pri':d>=150&&d<240?'ete':d>=240&&d<330?'aut':'hiv'; }
function rsGenChef(lvl,seed){ const r=x=>Math.abs(Math.sin(seed*12.9898+x*78.233))%1;
  return {n:RS_CHEF_N[Math.floor(r(1)*RS_CHEF_N.length)]+' '+RS_CHEF_L[Math.floor(r(2)*RS_CHEF_L.length)], lvl, g:Object.keys(RS_SPEC)[Math.floor(r(3)*4)]}; }
function rsInit(b){
  return {v:2, carte:{e:['veloute','tartare'], p:['blanquette','poisson','magret'], d:['mousse','creme']},
    chef:{n:'Antoine Roussel', lvl:2, g:'terroir'}, pm:52, srv:1, resa:0, acc:0, cave:0, gc:[], bis:0, tv:0,
    crit:45, stars:0, best:0, guide:S.day+45, out:{}, cands:null, cd:-1, log:[]};
}
function rsFix(b){
  const m=b.m; if(!m||m.v===2) return;
  const n=rsInit(b); ['crit','stars','guide','log'].forEach(k=>{ if(m[k]!==undefined) n[k]=m[k]; });
  n.best=n.stars; n.pm=clamp(Math.round(52*(b.price||1)),RS_PMIN,RS_PMAX);
  if(m.carte===0) n.carte={e:['tartare'],p:['blanquette','poisson'],d:['creme']};
  else if(m.carte===2) n.carte={e:['veloute','oeuf','tartare'],p:['curry','blanquette','poisson','magret'],d:['mousse','creme','mochi']};
  if(m.prod) n.chef.lvl=3;
  b.m=n; b.price=1; b.mkt=0;
}
/* qualité d'exécution d'un plat par le chef */
function rsQ(b,x){ const ch=b.m.chef; let q=clamp(1-Math.max(0,x.d-ch.lvl)*.22,.3,1); if(ch.tr) q*=RS_TRAIN_Q; if(ch.g===x.g) q*=1.12; if(x.s&&x.s!==rsSeason()) q*=.82; return q; }
function rsCost(b,x){ return x.c*(x.s&&x.s!==rsSeason()?1.7:1); }
function rsCalc(b){
  const m=b.m, se=rsSeason(); let app=0, cost=0, n=0, dq=0, inS=0, tP=0, nP=0, miss=0;
  Object.keys(RS_COURSE).forEach(k=>{
    const L=m.carte[k].map(rsDish).filter(x=>x&&!(m.out[x.id]>S.day));
    if(!L.length){ miss++; return; }
    app+=L.reduce((a,x)=>a+x.p*rsQ(b,x),0)/L.length;
    cost+=L.reduce((a,x)=>a+rsCost(b,x),0)/L.length;
    L.forEach(x=>{ n++; dq+=x.d*rsQ(b,x); if(x.s===se) inS++; else if(x.s) inS-=.8; if(k==='p'){ tP+=x.t; nP++; } });
  });
  const courses=3-miss; app= courses? app/courses : 0;
  const all=m.carte.e.length+m.carte.p.length+m.carte.d.length;
  const variety=1+.03*(all-7);
  const capF=nP? clamp(Math.pow(30/(tP/nP),.35),.7,1.2) : .7;
  const V=52*Math.pow(Math.max(app,1)/6.66,.6)*(1+.1*m.stars)*(m.tv?1.06:1)*(m.deg?1.25:1);
  const waste=clamp(.025+.007*all-(m.resa?.02:0),.01,.2);
  const ws= m.acc&&m.cave>0? 12 : 0;
  return {app, cost, n, all, dqa:n?dq/n:0, inS:n?inS/n:0, capF, V, waste, ws, miss, variety, se};
}
const RS_EL=1.7;
const RS_PMIN=20, RS_PMAX=400;
/* prix d'un nouveau bistrot : +10 % par bistrot déjà ouvert, au plus +50 % du premier */
function rsBisCost(b){ return bizDef(b).cost*1.5*Math.min(1.5,Math.pow(1.1,b.m.bis)); }
/* la salle et la cuisine ont une limite : au-delà, la demande ne se transforme plus en couverts */
const rsSat = (d,cap) => { const c=1.8*cap; return d/Math.pow(1+Math.pow(d/c,3),1/3); };
MET.resto = {
  fam:'resto', core:true, init:rsInit, fix:rsFix,
  ranks:[
    {n:'Première étoile', d:'Le guide vous remarque. La cave à grands crus est disponible.'},
    {n:'Deuxième étoile', d:'Le menu dégustation et la table du chef sont disponibles.'},
    {n:'Troisième étoile', d:'La consécration : la clientèle vient de loin et accepte des prix bien plus élevés.'},
    {n:'Chaîne de bistrots', d:'Ouvrez des bistrots à votre nom, qui profitent de la réputation de la maison.'},
    {n:'Chef à la télévision', d:'Une émission et un livre de recettes : la marque devient célèbre.'}
  ],
  rankSub:b=>{ const m=b.m, r=mxRank(b); if(r<3) return 'Les paliers 1 à 3 sont les étoiles du guide : il faut une note des critiques de '+note5(RS_STAR[r+1])+' sur 5 (actuellement '+note5(m.crit)+') pour la '+(r?'prochaine':'première')+' étoile. Le guide passe tous les 45 jours'+(m.guide>S.day?', prochaine visite vers le '+dateL(m.guide):'')+'.';
    if(r<5) return 'Avec trois étoiles obtenues, la maîtrise ('+Math.round(b.mx||0)+' / '+MX_STEPS[r===3?4:5]+') ouvre le palier suivant.'; return ''; },
  /* V1.7.3 : progression vers le palier suivant (barre) */
  rankProg:b=>{ const m=b.m, r=mxRank(b), x=b.mx||0; if(r<3) return clamp(m.crit/RS_STAR[r+1],0,1); if(r<5) return clamp((x-MX_STEPS[r])/(MX_STEPS[r+1]-MX_STEPS[r]),0,1); return null; },
  rank(b){ const m=b.m, x=b.mx||0, s=m.best||0; if(s<3) return s; return x>=MX_STEPS[5]? 5 : x>=MX_STEPS[4]? 4 : 3; },
  mods(b){ rsFix(b); const m=b.m; m.pm=clamp(m.pm,RS_PMIN,RS_PMAX); const p=rsCalc(b);
    const dem=Math.pow(Math.max(p.app,.5)/6.66,.8)*p.variety*1.03*Math.pow(p.V/m.pm,RS_EL)*(1+.06*m.stars)*(.9+.2*m.crit/100)*(m.tv?1.12:1);
    const srv=[.62,1][m.srv], resa=m.resa?.96:1;
    const chefSal=metR0(b)*RS_CHEF_SAL[m.chef.lvl];
    const bisRev=m.bis? metR0(b)*.22*m.bis*clamp(m.crit/70,.4,1.3) : 0;
    return { vol:rsSat(dem*srv*resa*(p.miss?.75:1),p.capF*srv), price:(m.pm+p.ws)/52,
      cogs:(p.cost*(1+p.waste)*(m.deg?1.2:1)+(p.ws?5:0))/(.38*52), wage:[.8,1][m.srv],
      fixed:chefSal+(m.tv?metR0(b)*.05:0), rev:bisRev+(m.tv?metR0(b)*.08:0)+(m.tab?metR0(b)*.06:0) };
  },
  daily(b,ctx){ rsFix(b); const m=b.m, p=rsCalc(b);
    if(m.chef.tr&&S.day>=m.chef.tr){ delete m.chef.tr; m.chef.lvl=Math.min(5,m.chef.lvl+1); metLog(b,m.chef.n+' revient de formation : niveau '+m.chef.lvl+' sur 5.','good'); }
    Object.keys(m.out).forEach(k=>{ if(m.out[k]<=S.day) delete m.out[k]; });
    if(m.acc&&m.cave>0&&ctx.open) m.cave=Math.max(0,m.cave-1);
    const tgt=30+9*p.dqa+16*p.inS+(p.all<=8?8:p.all<=10?3:-4)+(m.resa?3:0)+(m.deg?2:0)+(csOf(b)-60)*.3-(fatOf(b)>50?8:0)-(p.miss?15:0);
    m.crit=clamp(m.crit+(tgt-m.crit)*.04+norm()*1.2,0,100);
    if(S.day>=m.guide){ m.guide=S.day+45;
      const need=RS_STAR[Math.min(3,m.stars+1)];
      if(m.stars<3&&m.crit>=need&&rnd()<.55){ m.stars++; m.best=Math.max(m.best,m.stars); S.rep=clamp(S.rep+1.5,0,100); metLog(b,'l’inspecteur du guide est passé incognito : '+(m.stars===1?'première':m.stars===2?'deuxième':'troisième')+' étoile !','good'); }
      else if(m.stars>0&&m.crit<RS_STAR[m.stars]-14){ m.stars--; metLog(b,'le guide retire une étoile : la cuisine a déçu.','bad'); }
      else metLog(b,'visite discrète du guide : '+(m.stars? 'étoiles maintenues.' : m.crit>=58? 'remarqué, pas encore d’étoile.' : 'aucune distinction.'),'');
    }
    /* produit de saison introuvable */
    if(ctx.open&&rnd()<.012){ const all=[].concat(m.carte.e,m.carte.p,m.carte.d).filter(id=>!(m.out[id]>S.day)); const id=all.length&&pick(all), x=id&&rsDish(id);
      if(x&&(x.s||x.c>=9)){ const n=rint(3,6); m.out[id]=S.day+n; metLog(b,'produit introuvable chez les fournisseurs : « '+x.n+' » retiré de la carte pendant '+n+' jours.','warn'); } }
    if(ctx.open&&m.crit>=75&&rnd()<.01){ b.mods.push({mult:1.2,until:S.day+5,label:'Critique élogieuse'}); metLog(b,'un critique gastronomique publie un article élogieux : +20 % de réservations pendant 5 jours.','good'); }
    if(ctx.open&&m.crit<40&&rnd()<.008){ b.mods.push({mult:.85,until:S.day+6,label:'Critique sévère'}); metLog(b,'une critique sévère circule : -15 % de clients pendant 6 jours.','bad'); }
    /* grands crus : la valeur évolue */
    m.gc.forEach(g=>{ g.v*=1+(.07/360)+.002*norm(); });
    /* bistrots fragiles si la maison déçoit */
    if(m.bis>0&&m.crit<45&&rnd()<.006){ m.bis--; metLog(b,'un bistrot ferme : la marque a perdu de son éclat.','bad'); }
  },
  kpis(b){ rsFix(b); const m=b.m, p=rsCalc(b), l=b.last, tk=m.pm+p.ws, cov=l&&l.open? Math.round((l.rev-(this.mods(b).rev||0))/tk) : 0;
    return [['Couverts / jour', cov>0? fmtN(cov) : '—', 'Menu '+eur(m.pm,0)+(p.ws?', vins '+eur(p.ws,0):'')],
            ['Note des critiques', note5(m.crit)+' / 5', m.stars<3? 'Étoile suivante : '+note5(RS_STAR[m.stars+1]) : 'Trois étoiles'],
            ['Étoiles', m.stars? '★'.repeat(m.stars) : 'Aucune', 'Passage du guide dans '+Math.max(0,m.guide-S.day)+' j'],
            ['Saison', RS_SEAS[p.se], Math.max(0,Math.round(p.inS*100))+' % de plats de saison']];
  },
  ctl(b){ rsFix(b); const m=b.m, d=bizDef(b), R0=metR0(b), out=[], p=rsCalc(b);
    out.push({k:'seg', act:'pm', label:'Prix du menu : '+eur(m.pm,0), val:'x', opts:[[-5,'−5 €'],[-1,'−1 €'],[1,'+1 €'],[5,'+5 €']], sub:'Valeur perçue de votre carte : environ '+eur(p.V,0)+'. Au-dessus, la salle se vide.'});
    out.push({k:'seg', act:'srv', label:'Services', val:m.srv, opts:[[0,'Le soir seulement'],[1,'Midi et soir']], sub:m.srv? 'Deux services : plus de couverts, toute l’équipe mobilisée.' : 'Un seul service : 38 % de couverts en moins, salaires réduits de 20 %.'});
    out.push({k:'tog', act:'resa', label:'Sur réservation uniquement', val:m.resa, sub:'Moins de pertes (−2 points) et les critiques apprécient, mais 4 % de clients en moins.'});
    out.push({k:'btn', act:'cave', label:'Cave : vins de la maison', cost:R0*.9, sub:(m.cave>0? 'Stock pour '+m.cave+' jours de service.' : 'Cave vide.')+' Les accords mets-vins rapportent 12 € de plus par couvert.'});
    out.push({k:'tog', act:'acc', label:'Accords mets-vins', val:m.acc, sub:m.cave>0? 'Proposés à chaque table tant que la cave est remplie.' : 'Remplissez d’abord la cave.'});
    if(mxHas(b,1)){ const v=m.gc.reduce((a,g)=>a+g.v,0), c=m.gc.reduce((a,g)=>a+g.c,0);
      out.push({k:'btn', act:'gc', label:'Acheter une caisse de grand cru', cost:d.cost*.25, sub:'Un grand cru prend environ 7 % de valeur par an. '+(m.gc.length? m.gc.length+' caisse'+(m.gc.length>1?'s':'')+' en cave, achetées '+eur(c,0)+'.' : 'Aucune caisse en cave.')});
      if(m.gc.length) out.push({k:'btn', act:'gcsell', label:'Vendre les grands crus aux collectionneurs', gain:v, sub:'Plus-value : '+eur(v-c,0)+'.'}); }
    if(mxHas(b,2)){ out.push({k:'tog', act:'deg', label:'Menu dégustation', val:m.deg||0, sub:'Valeur perçue +25 % et critiques en hausse, matières +20 %.'});
      out.push(m.tab? {k:'buy', act:'tab', label:'Table du chef', owned:true, sub:'Quelques couverts en cuisine, réservés des mois à l’avance.'} : {k:'buy', act:'tab', label:'Table du chef', cost:d.cost*.5, sub:'Quelques couverts en cuisine, très chers : environ '+eur(R0*.06,0)+' de plus par jour.'}); }
    if(mxHas(b,4)){ const c=rsBisCost(b);
      out.push({k:'btn', act:'bis', label:'Ouvrir un bistrot ('+m.bis+' ouvert'+(m.bis>1?'s':'')+')', cost:c, dis:m.bis>=30, sub:'Chaque bistrot coûte 10 % de plus que le précédent, au plus 50 % de plus que le premier. Il rapporte environ '+eur(R0*.22*clamp(m.crit/70,.4,1.3),0)+' par jour, selon la note des critiques de la maison mère.'}); }
    if(mxHas(b,5)) out.push(m.tv? {k:'buy', act:'tv', label:'Émission et livre de recettes', owned:true, sub:'+12 % de clients, recettes des droits.'} : {k:'buy', act:'tv', label:'Émission et livre de recettes', cost:d.cost*3, sub:'+12 % de clients, des droits d’auteur chaque jour, prix perçu en hausse.'});
    return out;
  },
  acts:{
    pm:(b,v)=>{ b.m.pm=clamp(b.m.pm+(+v||0),RS_PMIN,RS_PMAX); return ok('Menu à '+eur(b.m.pm,0)+'.'); },
    srv:(b,v)=>{ b.m.srv=+v?1:0; return ok(''); },
    resa:(b,v)=>{ b.m.resa=+v?1:0; return ok(''); },
    acc:(b,v)=>{ if(+v&&b.m.cave<=0) return err('La cave est vide.'); b.m.acc=+v?1:0; return ok(''); },
    cave:(b)=>{ const c=metR0(b)*.9; if(!metBuy(b,c,'Cave : vins de la maison')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.cave+=30; return ok('Cave remplie pour 30 jours de plus.'); },
    gc:(b)=>{ if(!mxHas(b,1)) return err('Il faut une étoile.'); const c=bizDef(b).cost*.25; if(!metBuy(b,c,'Grand cru')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.gc.push({c,v:c,d:S.day}); return ok('Caisse de grand cru en cave.'); },
    gcsell:(b)=>{ const m=b.m; if(!m.gc.length) return err('Aucun grand cru.'); const v=m.gc.reduce((a,g)=>a+g.v,0), c=m.gc.reduce((a,g)=>a+g.c,0); payCap('b:'+b.id,'Vente de grands crus : '+b.name,v); b.inv$=Math.max(0,(b.inv$||0)-c); m.gc=[]; metLog(b,'les grands crus sont vendus '+eur(v,0)+'.','good'); return ok('Grands crus vendus '+eur(v,0)+'.'); },
    bis:(b)=>rsBistro(b,false),
    tv:(b)=>{ if(!mxHas(b,5)) return err('Palier 5 requis.'); if(b.m.tv) return err('Déjà fait.'); const c=bizDef(b).cost*3; if(!metBuy(b,c,'Émission de télévision')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.tv=1; metLog(b,'votre chef a son émission de télévision.','good'); return ok('Émission lancée.'); },
    deg:(b,v)=>{ if(!mxHas(b,2)) return err('Il faut deux étoiles.'); b.m.deg=+v?1:0; return ok(''); },
    tab:(b)=>{ if(!mxHas(b,2)) return err('Il faut deux étoiles.'); if(b.m.tab) return err('Déjà installée.'); const c=bizDef(b).cost*.5; if(!metBuy(b,c,'Table du chef')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.tab=1; return ok('Table du chef installée.'); },
    add:(b,arg)=>rsAdd(b,arg),
    rm:(b,arg)=>rsRm(b,arg),
    chef:(b,i)=>rsHire(b,+i,false),
    train:(b)=>rsTrain(b)
  },
  auto: rsAuto
};
function rsBistro(b,auto){ const m=b.m; if(!mxHas(b,4)) return err('Palier 4 requis.'); if(m.bis>=30) return err('30 bistrots au maximum.');
  const c=rsBisCost(b); if(!(auto? dlSpend(b,c,'Nouveau bistrot') : metBuy(b,c,'Nouveau bistrot'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.bis++; metLog(b,(auto?'le directeur ouvre':'ouverture d’')+' un bistrot ('+m.bis+' au total).','good'); return ok('Bistrot ouvert.'); }
function rsAdd(b,arg){ const [k,id]=String(arg).split(':'), x=rsDish(id), m=b.m;
  if(!x||x.k!==k) return err('Plat inconnu.'); if(m.carte[k].includes(id)) return err('Déjà à la carte.'); if(m.carte[k].length>=RS_MAX[k]) return err(RS_MAX[k]+' '+RS_COURSE[k].toLowerCase()+' au maximum.');
  m.carte[k].push(id); return ok('« '+x.n+' » à la carte.'); }
function rsRm(b,arg){ const [k,id]=String(arg).split(':'), m=b.m; if(!m.carte[k]) return err(''); m.carte[k]=m.carte[k].filter(x=>x!==id); return ok('Plat retiré.'); }
function rsCands(b){ const m=b.m, w=Math.floor(S.day/7); if(!m.cands||m.cd!==w){ m.cd=w; const base=m.chef.lvl;
  m.cands=[Math.max(1,base-1),Math.min(5,base+1),Math.min(5,base+2)].map((l,i)=>rsGenChef(l,w*7+i+b.id*31+(m.hc||0)*101)); } return m.cands; }
function rsChefFee(b,c){ return metR0(b)*RS_CHEF_FEE[c.lvl]; }
/* V2.4.4 : formation du chef (niveau + 1 au bout de RS_TRAIN_D jours ; pendant la formation, la cuisine est un peu moins sûre). État : chef.tr = jour de fin (absent = aucune formation). */
const RS_TRAIN_D=40, RS_TRAIN_Q=.92, RS_TRAIN_F=.5;
function rsTrainCost(b){ const l=b.m.chef.lvl; return l>=5? 0 : metR0(b)*Math.max(2,RS_CHEF_FEE[l+1])*RS_TRAIN_F; }
function rsTrain(b){ const ch=b.m.chef; if(ch.lvl>=5) return err('Le chef est déjà au niveau maximum.'); if(ch.tr) return err('Une formation est déjà en cours.');
  const c=rsTrainCost(b); if(!metBuy(b,c,'Formation du chef')) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  ch.tr=S.day+RS_TRAIN_D; metLog(b,ch.n+' part en formation : niveau '+(ch.lvl+1)+' dans '+RS_TRAIN_D+' jours.',''); return ok('Formation lancée.'); }
function rsHire(b,i,auto){ const c=rsCands(b)[i]; if(!c) return err('Candidat introuvable.'); const fee=rsChefFee(b,c);
  if(fee>0&&!(auto? dlSpend(b,fee,'Recrutement du chef') : metBuy(b,fee,'Recrutement du chef'))) return err('Trésorerie insuffisante : '+eur(fee,0)+'.');
  b.m.chef=Object.assign({},c); b.m.cands=null; b.m.hc=(b.m.hc||0)+1; metLog(b,c.n+' prend la tête de la cuisine (niveau '+c.lvl+', '+RS_SPEC[c.g].toLowerCase()+').','good'); return ok(c.n+' est votre nouveau chef.'); }
/* meilleur prix de menu d'après la fréquentation actuelle */
function rsBestPm(b){ const m=b.m, p=rsCalc(b), cv=p.cost*(1+p.waste)+(p.ws?5:0); let best=m.pm, bv=-Infinity;
  const d0=Math.pow(Math.max(p.app,.5)/6.66,.8)*p.variety*1.03*(1+.06*m.stars)*(.9+.2*m.crit/100)*(m.tv?1.12:1), srv=[.62,1][m.srv];
  for(let t=RS_PMIN;t<=Math.min(RS_PMAX,Math.max(120,p.V*2));t+=1){ const v=rsSat(d0*Math.pow(p.V/t,RS_EL)*srv,p.capF*srv)*(t+p.ws-cv); if(v>bv){ bv=v; best=t; } } return best; }
/* le chef de cuisine adapte la carte aux saisons */
function rsAuto(b,mode,q){
  rsFix(b); const m=b.m, se=rsSeason();
  if(S.day%3===0){ const t=rsBestPm(b)+Math.round((1-q)*8*(rnd()-.5)); m.pm=clamp(m.pm+clamp(t-m.pm,-3,3),RS_PMIN,RS_PMAX); }
  if(S.day%7===0){
    m.resa=1; if(mxHas(b,2)) m.deg=1; if(m.cave<8&&metBuy(b,metR0(b)*.9,'Cave : vins de la maison')) m.cave+=30; m.acc=m.cave>0?1:0;
    const score=x=>x.p*rsQ(b,x)+(x.d*rsQ(b,x))*.4-(x.s&&x.s!==se?4:0)-(m.out[x.id]>S.day?9:0);
    const want={e:2,p:3,d:2};
    Object.keys(want).forEach(k=>{ const pool=RS_DISH.filter(x=>x.k===k).sort((a,c)=>score(c)-score(a));
      if(rnd()<(1-q)*.4) return; /* un directeur moyen oublie parfois */
      m.carte[k]=pool.slice(0,want[k]).map(x=>x.id); });
  }
  if(mode!=='full'||S.day%14!==0) return;
  const cs=rsCands(b), better=cs.map((c,i)=>[c,i]).filter(([c])=>c.lvl>m.chef.lvl).sort((a,c)=>a[0].lvl-c[0].lvl)[0];
  if(better&&rsChefFee(b,better[0])<=dlBudget(b)){ rsHire(b,better[1],true); return; }
  if(mxHas(b,4)) rsBistro(b,true);
  /* V1.5.8 : la table du chef puis l'émission, payées sur la réserve */
  const m2=b.m, dc=bizDef(b).cost; if(mxHas(b,2)&&!m2.tab&&dlAct(b,dc*.5,()=>MET.resto.acts.tab(b))) return; if(mxHas(b,5)&&!m2.tv) dlAct(b,dc*3,()=>MET.resto.acts.tv(b));
}

