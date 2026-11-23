/* ============================================================
   MAISON DE HAUTE COUTURE : le prestige contre le volume
   Trois collections par an. On choisit le style, l'ampleur (nombre de silhouettes) et les tissus,
   le directeur artistique (talent, style de prédilection, caprices) la crée en 50 jours, puis on la
   présente lors d'un défilé dans une ville du jeu. La critique donne une note : elle fait monter
   ou baisser le prestige et porte les ventes de la saison.
   Recettes : prêt-à-porter (selon prestige et note), commandes sur mesure de clientes de prestige
   (réalisées par les artisans de l'atelier), licences (accessoires, parfum) qui rapportent beaucoup
   mais usent le prestige. Une égérie fait monter le prestige et les ventes.
   Événements : défilé triomphal, directeur artistique qui claque la porte, contrefaçon.
   Paliers : semaine de la mode, parfum, boutiques dans les capitales, ateliers d'art, maison mythique.
   Lien : avec une société textile active, les tissus coûtent 20 % de moins et gagnent en qualité.
   État b.m (v:1) : pres (prestige 0-100), da (directeur artistique), cand[] (candidats), col (collection
   en création), cur (collection en vente), sty{} (tendances), art (artisans), ord[] (commandes),
   lic{acc,par}, eg (égérie jusqu'au jour), fw, bq, ada, myth, cf (contrefaçon jusqu'au jour), last,
   idle, nid, acc, accC, pend, pendC, log.
   ============================================================ */
const HC_STY = {cla:'Classique', avg:'Avant-garde', min:'Minimaliste', rom:'Romantique', str:'Streetwear de luxe', bar:'Baroque'};
const HC_LOOK = [{n:'Capsule (20 silhouettes)', f:.7, sc:0},{n:'Collection (35 silhouettes)', f:1, sc:5},{n:'Grand défilé (50 silhouettes)', f:1.5, sc:9}];
const HC_MAT = {std:{n:'Tissus classiques', f:1, sc:0}, ita:{n:'Soieries italiennes', f:1.3, sc:5}, own:{n:'Vos filatures', f:.8, sc:3}};
const HC_CITY = {paris:10, newyork:8, losangeles:6, shanghai:6, miami:5, madrid:5, barcelone:5, rio:4, pekin:4, saopaulo:3, marseille:3, toulouse:2, zagreb:2, seville:2, split:2, dubrovnik:2, shenzhen:3, salvador:2};
const HC_FN=['Lucien','Aurore','Matteo','Inès','Raphaël','Sienna','Oscar','Margaux','Kenzo','Adèle','Jules','Esther'], HC_LN=['Delorme','Marchetti','Vidal','Okada','Laurent','Kaplan','Rossi','Bertin','Ferrand','Lévêque'];
const HC_SEAS = ['Printemps-été','Automne-hiver','Croisière'];
function hcDA(i){ const t=1+Math.floor(rnd()*5); return {id:i, n:pick(HC_FN)+' '+pick(HC_LN), tal:t, aff:pick(Object.keys(HC_STY)), cap:clamp(.15+.12*t*rnd()+.2*rnd(),0,1), mood:70}; }
function hcInit(b){ const old=b.hist&&b.hist.length>5;
  const m={v:1, pres:old?50:35, da:null, cand:[], col:null, cur:null, sty:{}, art:3, ord:[], lic:{acc:0,par:0}, eg:0, fw:0, bq:0, ada:0, myth:0, cf:0, last:null, idle:0, seas:0, candNext:0, nid:1, acc:0, accC:0, pend:0, pendC:0, log:[]}; b.m=m;
  Object.keys(HC_STY).forEach(k=>{ m.sty[k]={v:clamp(Math.exp(.3*norm()),.6,1.6), d:0}; });
  m.da=hcDA(0); m.da.tal=3; m.da.cap=clamp(m.da.cap,.1,.4);
  hcCand(b);
  m.cur={n:HC_SEAS[0], sty:m.da.aff, sc:old?62:55, d:S.day, city:'paris'};
  return m; }
function hcCand(b){ const m=b.m; m.cand=[0,1,2].map(i=>hcDA(m.nid++)); m.candNext=S.day+60; }
/* V2.3.6 : « Vos filatures » demande des tissus réellement livrés par vos usines dans les 30 derniers jours */
const hcTex = () => S.biz.some(x=>x.def==='couture'&&x.status==='active'&&x.supDay>=S.day-30);
function hcColCost(b,C){ return metR0(b)*28*HC_LOOK[C.look].f*HC_MAT[C.mat].f; }
function hcSeasonF(m){ const t=m.cur? S.day-m.cur.d : 999; return t<120? 1.25-.5*t/120 : .6; }
function hcPf(m){ return Math.pow(Math.max(5,m.pres)/50,1.2); }
/* note attendue (sans le hasard) */
function hcExp(b,C,city){ const m=b.m, d=m.da, tr=m.sty[C.sty].v;
  return clamp(28+(d?d.tal*7:5)+(d&&d.aff===C.sty?8:0)+(tr-1)*25+HC_LOOK[C.look].sc+HC_MAT[C.mat].sc+((HC_CITY[city]||2)-5)*1.5+(m.fw&&city===b.city?8:0)+(m.eg>S.day?5:0)+(m.ada?3:0),5,95); }
function hcCreate(b,C){ const m=b.m; if(m.col) return err('Une collection est déjà en création.'); if(!HC_STY[C.sty]) return err('Style inconnu.'); if(!HC_LOOK[C.look]) return err('Ampleur inconnue.'); if(!HC_MAT[C.mat]) return err('Tissus inconnus.');
  if(C.mat==='own'&&!hcTex()) return err('Il faut que vos usines textiles aient livré des tissus ces 30 derniers jours.'); if(!m.da) return err('Recrutez d’abord un directeur artistique.');
  const c=hcColCost(b,C); if(availFor(cityOf(b).ccy)<c*.3) return err('Trésorerie insuffisante.');
  m.col={sty:C.sty, look:C.look, mat:C.mat, cost:c, left:50, dur:50, n:HC_SEAS[(m.seas+1)%3]};
  if(m.da.aff!==C.sty){ m.da.mood=clamp(m.da.mood-15,0,100); metLog(b,m.da.n+' aurait préféré une collection '+HC_STY[m.da.aff].toLowerCase()+'.','warn'); } else m.da.mood=clamp(m.da.mood+5,0,100);
  return ok('Collection « '+m.col.n+' » en création : prête dans 50 jours.'); }
function hcShow(b,city,auto){ const m=b.m, C=m.col; if(!C||C.left>0) return err('La collection n’est pas prête.'); if(!HC_CITY[city]) return err('Ville inconnue.');
  if(city!==b.city&&!cityUnlocked(city)) return err('Ville non ouverte.');
  const R0=metR0(b), trav= city===b.city? 0 : R0*5; m.accC+=trav+R0*4;
  const e=hcExp(b,C,city), sc=Math.round(clamp(e+8*norm(),5,99)), trium=sc>=88;
  m.pres=clamp(m.pres+(sc-55)/5+(trium?5:0),0,100); m.seas=(m.seas+1)%3;
  m.cur={n:C.n, sty:C.sty, sc, d:S.day, city}; m.last={sc, city, n:C.n, sty:C.sty, d:S.day}; m.col=null; m.idle=0;
  if(m.fw&&city===b.city) m.acc+=R0*8*(.5+m.pres/100);
  if(m.da){ m.da.mood=clamp(m.da.mood+(sc-60)/2,0,100); }
  if(trium){ for(let i=0;i<3;i++) hcOrder(b); metLog(b,'défilé triomphal à '+D.CITIES[city].n+' : la critique donne '+note5(sc)+' / 5, les commandes affluent.','good'); }
  else metLog(b,'défilé « '+C.n+' » à '+D.CITIES[city].n+(auto?' (organisé par l’équipe)':'')+' : la critique donne '+note5(sc)+' / 5.',sc>=70?'good':sc<45?'bad':'');
  return ok(''); }
function hcOrder(b){ const m=b.m, R0=metR0(b); m.ord.push({id:m.nid++, n:pick(['Une princesse','Une actrice','Une héritière','Une chanteuse','Une collectionneuse','Une cheffe d’entreprise']), v:R0*(3+5*rnd())*(.6+m.pres/100), w:30, done:0}); }
function hcBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
const hcArtCap = m => m.art*(m.ada?1.5:1);
MET.couture = {
  fam:'lux', core:true, init:hcInit,
  ranks:[
    {n:'Semaine de la mode', d:'Votre propre semaine de la mode dans votre ville : défilés mieux notés, invitations vendues.'},
    {n:'Parfum', d:'Une licence de parfum : très rentable, mais elle use le prestige.'},
    {n:'Boutiques dans les capitales', d:'Des boutiques à New York, Shanghai et Dubaï : prêt-à-porter +40 %.'},
    {n:'Ateliers d’art', d:'Brodeurs, plumassiers, bottiers : les artisans travaillent 50 % plus vite et les défilés gagnent en éclat.'},
    {n:'Maison mythique', d:'Votre nom traverse le temps : le prestige résiste mieux aux licences et ne descend plus sous 40.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b), pf=hcPf(m), sc=m.cur? Math.max(.6,m.cur.sc/60) : .7;   /* V1.5.7 : une collection ratée ne fait plus tomber les ventes trop bas */
    const pap=R0*1.08*pf*sc*hcSeasonF(m)*(m.bq?1.4:1)*(m.cf>S.day?.8:1)*(m.eg>S.day?1.15:1)*clamp(S.macro.econ,.7,1.3)*weFactor(b);
    const lic=(m.lic.acc?R0*.22:0)*pf+(m.lic.par?R0*.4:0)*pf;
    return {vol:0, cogs:0, rev:m.pend+pap+lic, fixed:m.pendC+m.art*R0*.03+(m.bq?R0*.12:0)};
  },
  daily(b,ctx){ const m=b.m, R0=metR0(b);
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    Object.keys(m.sty).forEach(k=>{ const t=m.sty[k]; t.d=clamp(t.d*.98+.004*norm(),-.015,.015); t.v=clamp(t.v*Math.exp(t.d),.5,1.8); });
    /* prestige : revient doucement vers 40, usé par les licences, porté par l'égérie */
    const wear=(m.lic.acc?.025:0)+(m.lic.par?.035:0);
    m.pres=clamp(m.pres-(m.pres-40)*.005-wear*(m.myth?.5:1)+(m.eg>S.day?.05:0),m.myth?40:0,100);
    /* collection en création */
    if(m.col&&m.col.left>0){ m.accC+=m.col.cost/m.col.dur; m.col.left--; if(m.col.left===0){ m.col.ready=S.day; metLog(b,'la collection « '+m.col.n+' » est prête : choisissez la ville du défilé.','good'); } }
    if(m.col&&m.col.left===0&&S.day-m.col.ready>=(dlMode(b)==='me'?10:0)&&dlMode(b)==='me') hcShow(b,b.city,true);
    /* sans nouvelle collection, l'équipe en lance une simple */
    if(!m.col&&m.cur&&S.day-m.cur.d>=70){ m.idle++; if(dlMode(b)==='me'&&m.idle>=15&&m.da){ if(hcCreate(b,{sty:m.da.aff, look:0, mat:'std'}).ok) metLog(b,'faute de consigne, l’équipe lance une petite collection.',''); } }
    /* commandes sur mesure */
    if(rnd()<.035*Math.pow(Math.max(5,m.pres)/50,2)) hcOrder(b);
    let cap=hcArtCap(m); m.ord.forEach(o=>{ if(cap<=0) return; const w=Math.min(cap,o.w-o.done); o.done+=w; cap-=w; if(o.done>=o.w-1e-9){ m.acc+=o.v; o.fin=1; } });
    const fin=m.ord.filter(o=>o.fin); if(fin.length) metLog(b,'commande sur mesure livrée : '+fin.map(o=>o.n.toLowerCase()).join(', ')+' ('+eur(fin.reduce((a,o)=>a+o.v,0),0)+').','good');
    m.ord=m.ord.filter(o=>!o.fin); if(m.ord.length>12){ m.ord.shift(); m.pres=clamp(m.pres-1,0,100); }
    /* directeur artistique : il peut claquer la porte */
    const d=m.da; if(d){ d.mood=clamp(d.mood+(70-d.mood)*.005,0,100); if(d.mood<30&&rnd()<d.cap*.03){ metLog(b,d.n+' claque la porte de la maison.','bad'); m.da=null; m.pres=clamp(m.pres-4,0,100); } }
    if(S.day>=m.candNext) hcCand(b);
    /* contrefaçon */
    if(m.cf<=S.day&&rnd()<.002*(m.pres/50)){ m.cf=S.day+45; m.pres=clamp(m.pres-3,0,100); metLog(b,'des contrefaçons de vos modèles inondent le marché : ventes −20 % pendant 45 jours.','warn'); }
  },
  kpis(b){ const m=b.m, R0=metR0(b), C=m.col;
    return [['Prestige', Math.round(m.pres)+' / 100', (m.lic.acc||m.lic.par)? 'Les licences l’usent chaque jour' : m.eg>S.day? 'Votre égérie le fait monter' : 'Il revient doucement vers 40'],
            ['Collection en vente', m.cur? m.cur.n : '—', m.cur? 'Note '+note5(m.cur.sc)+' / 5 · '+HC_STY[m.cur.sty] : ''],
            ['Prochaine collection', C? (C.left>0? 'Prête dans '+C.left+' j' : 'Prête pour le défilé') : 'À lancer', C? HC_STY[C.sty]+' · '+HC_LOOK[C.look].n.toLowerCase() : 'Choisissez le style'],
            ['Sur mesure', m.ord.length+' commande'+(m.ord.length>1?'s':''), m.art+' artisans à l’atelier']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    out.push({k:'seg', act:'art', label:'Artisans de l’atelier : '+m.art, val:'x', opts:[[-1,'−1'],[1,'+1'],[3,'+3']], sub:'Chacun réalise une commande sur mesure en 30 jours'+(m.ada?' (20 avec les ateliers d’art)':'')+'. Salaire : '+eur(R0*.03,0)+' par jour.'});
    out.push(m.eg>S.day? {k:'buy', act:'eg', label:'Égérie sous contrat', owned:true, sub:'Encore '+(m.eg-S.day)+' jours : prestige et ventes en hausse.'} : {k:'buy', act:'eg', label:'Engager une égérie (90 jours)', cost:R0*14, sub:'Prestige qui monte chaque jour, ventes +15 %, défilés +5.'});
    out.push({k:'btn', act:'lacc', label:'Licence d’accessoires'+(m.lic.acc?' (signée)':''), bl:m.lic.acc?'Arrêter':'Signer', sub:m.lic.acc?'Elle rapporte '+eur(R0*.22*hcPf(m),0)+' par jour et use le prestige.':'Sacs, foulards, lunettes : beaucoup de revenus, mais le prestige s’use chaque jour.'});
    if(mxHas(b,2)) out.push({k:'btn', act:'lpar', label:'Licence de parfum'+(m.lic.par?' (signée)':''), bl:m.lic.par?'Arrêter':'Signer', sub:m.lic.par?'Elle rapporte '+eur(R0*.4*hcPf(m),0)+' par jour et use le prestige.':'La plus rentable des licences, mais aussi celle qui use le plus le prestige.'});
    if(mxHas(b,1)) out.push(m.fw? {k:'buy', act:'fw', label:'Semaine de la mode', owned:true, sub:'Défilés dans votre ville : +8 points et invitations vendues.'} : {k:'buy', act:'fw', label:'Créer votre semaine de la mode', cost:d.cost*2, sub:'Défilés dans votre ville mieux notés (+8), invitations vendues.'});
    if(mxHas(b,3)) out.push(m.bq? {k:'buy', act:'bq', label:'Boutiques dans les capitales', owned:true, sub:'Prêt-à-porter +40 %.'} : {k:'buy', act:'bq', label:'Ouvrir des boutiques dans les capitales', cost:d.cost*3, sub:'Prêt-à-porter +40 %, loyers en plus.'});
    if(mxHas(b,4)) out.push(m.ada? {k:'buy', act:'ada', label:'Ateliers d’art', owned:true, sub:'Artisans 50 % plus rapides, défilés +3.'} : {k:'buy', act:'ada', label:'Racheter des ateliers d’art', cost:d.cost*2, sub:'Artisans 50 % plus rapides, défilés +3.'});
    if(mxHas(b,5)) out.push(m.myth? {k:'buy', act:'myth', label:'Maison mythique', owned:true, sub:'Prestige plancher de 40, licences deux fois moins usantes.'} : {k:'buy', act:'myth', label:'Faire de la maison un mythe', cost:d.cost*5, sub:'Prestige plancher de 40, licences deux fois moins usantes.'});
    return out;
  },
  acts:{
    create:(b,arg)=>{ const [sty,look,mat]=String(arg).split(':'); return hcCreate(b,{sty, look:+look, mat}); },
    show:(b,city)=>hcShow(b,String(city),false),
    art:(b,v)=>{ const m=b.m, n=clamp(m.art+(+v||0),0,30); if(n===m.art) return err('Effectif inchangé.'); m.art=n; return ok('Atelier : '+n+' artisans.'); },
    eg:(b)=>{ const m=b.m; if(m.eg>S.day) return err('Déjà sous contrat.'); const c=metR0(b)*14; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.accC+=c; m.eg=S.day+90; metLog(b,'une égérie prête son visage à la maison pour 90 jours.','good'); return ok('Égérie engagée.'); },
    lacc:(b)=>{ const m=b.m; m.lic.acc=m.lic.acc?0:1; return ok(m.lic.acc?'Licence d’accessoires signée.':'Licence d’accessoires arrêtée.'); },
    lpar:(b)=>{ const m=b.m; if(!mxHas(b,2)) return err('Palier 2 requis.'); m.lic.par=m.lic.par?0:1; return ok(m.lic.par?'Licence de parfum signée.':'Licence de parfum arrêtée.'); },
    hire:(b,id)=>{ const m=b.m, c=m.cand.find(x=>x.id===+id); if(!c) return err('Candidat indisponible.'); const cost=metR0(b)*8*c.tal; if(availFor(cityOf(b).ccy)<cost) return err('Trésorerie insuffisante : '+eur(cost,0)+'.');
      m.accC+=cost; if(m.da) metLog(b,m.da.n+' quitte la maison.',''); m.da=Object.assign({},c,{mood:70}); m.cand=m.cand.filter(x=>x!==c); metLog(b,c.n+' devient directeur artistique.','good'); return ok(c.n+' rejoint la maison.'); },
    fw:(b)=>hcBuy(b,'fw',2,'Semaine de la mode',1),
    bq:(b)=>hcBuy(b,'bq',3,'Boutiques dans les capitales',3),
    ada:(b)=>hcBuy(b,'ada',2,'Ateliers d’art',4),
    myth:(b)=>hcBuy(b,'myth',5,'Maison mythique',5)
  },
  auto: hcAuto
};
/* le directeur général protège le prestige ou vise les licences selon son style */
function hcAuto(b,mode,q){ const m=b.m, R0=metR0(b), lic=b.boss&&b.boss.id%2===1;
  if(!m.da){ const c=m.cand.slice().sort((x,y)=>(y.tal-y.cap*2)-(x.tal-x.cap*2))[0]; if(c) MET.couture.acts.hire(b,c.id); }
  if(!m.col&&m.da&&m.cur&&S.day-m.cur.d>=65){ const sty= rnd()<q? Object.keys(HC_STY).sort((x,y)=>(m.sty[y].v+(y===m.da.aff?.32:0))-(m.sty[x].v+(x===m.da.aff?.32:0)))[0] : m.da.aff;
    hcCreate(b,{sty, look: mode==='full'?2:1, mat: hcTex()? 'own' : mode==='full'? 'ita' : 'std'}); }
  if(m.col&&m.col.left===0){ const cs=Object.keys(HC_CITY).filter(c=>c===b.city||cityUnlocked(c)); const best=cs.sort((x,y)=>hcExp(b,m.col,y)-hcExp(b,m.col,x))[0]; hcShow(b,rnd()<q?best:b.city,false); }
  /* artisans : selon les commandes en attente */
  const need=m.ord.reduce((a,o)=>a+o.w-o.done,0)/30/(m.ada?1.5:1); const tgt=clamp(Math.ceil(need)+1,2,20); if(S.day%10===0&&tgt!==m.art) m.art=tgt;
  /* licences : selon le style du directeur */
  const lim= lic? 45 : 55; if(m.pres>lim+5&&!m.lic.acc) m.lic.acc=1; if(m.pres<lim-5&&m.lic.acc) m.lic.acc=0;
  if(mxHas(b,2)){ if(m.pres>lim+15&&!m.lic.par) m.lic.par=1; if(m.pres<lim&&m.lic.par) m.lic.par=0; }
  if(mode==='full'){ if(m.eg<=S.day&&m.pres<70&&dlCan(b,R0*14,'Défilé')){ b.dlp-=R0*14; MET.couture.acts.eg(b); }
    if(S.day%30===0) for(const [k,f,l,rk] of [['fw',2,'Semaine de la mode',1],['bq',3,'Boutiques dans les capitales',3],['ada',2,'Ateliers d’art',4],['myth',5,'Maison mythique',5]]) if(!m[k]&&mxHas(b,rk)&&hcBuy(b,k,f,l,rk,true).ok) break; }
}

