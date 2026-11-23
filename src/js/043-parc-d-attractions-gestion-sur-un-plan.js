/* ============================================================
   PARC D'ATTRACTIONS : gestion sur un plan
   Plan de 6 x 4 cases en 4 zones de 3 x 2. Chaque zone a un thème.
   On y place des attractions, des restaurants, des boutiques et des décors.
   - Attractivité : somme des attractions, bonus de thème et de décor voisin.
   - Capacité : débit des attractions ouvertes, heures d'ouverture (nocturnes).
     Trop de visiteurs pour la capacité : l'attente monte et les visiteurs repartent.
   - Dépense par visiteur : billet + restaurants et boutiques (mieux placés près des manèges).
   - Météo : la pluie vide le parc, sauf les attractions couvertes ; le soleil remplit les attractions aquatiques.
   État b.m (v:2) : cells[24], zones[4] {own, th}, tk (billet), fp, noc, ev, maint, wait, vis, spend.
   ============================================================ */
const PK_W=6, PK_H=4;
const PK_TH = {
  contes:{n:'Royaume des contes', tag:'fam', c:'#f0a6c8'},
  aventure:{n:'Terre d’aventure', tag:'eau', c:'#7cc6c0'},
  frisson:{n:'Frontière du frisson', tag:'fri', c:'#f2a65a'},
  espace:{n:'Base spatiale', tag:'cou', c:'#9aa8e8'}
};
const PK_TAG = {fam:'Familiale', eau:'Aquatique', fri:'Sensations', cou:'Couverte'};
/* c : coût en part du prix du parc ; ap : attractivité ; cap : visiteurs / heure ; sp : dépense par visiteur ; rk : palier de maîtrise requis */
const PK_IT = [
  {id:'carrousel', n:'Carrousel', k:'ride', tg:'fam', c:.05, ap:.06, cap:500, rk:0},
  {id:'tasses', n:'Tasses tournantes', k:'ride', tg:'fam', c:.07, ap:.07, cap:450, rk:0},
  {id:'fantome', n:'Train fantôme', k:'ride', tg:'cou', c:.12, ap:.10, cap:650, rk:0},
  {id:'riviere', n:'Rivière sauvage', k:'ride', tg:'eau', c:.20, ap:.14, cap:900, rk:0},
  {id:'roue', n:'Grande roue', k:'ride', tg:'fam', c:.22, ap:.12, cap:800, rk:0},
  {id:'grand8', n:'Grand huit', k:'ride', tg:'fri', c:.30, ap:.20, cap:1000, rk:0},
  {id:'chute', n:'Tour de chute libre', k:'ride', tg:'fri', c:.30, ap:.18, cap:700, rk:1},
  {id:'spectacle', n:'Théâtre des spectacles', k:'ride', tg:'cou', c:.25, ap:.17, cap:1500, rk:2},
  {id:'looping', n:'Montagnes russes à looping', k:'ride', tg:'fri', c:.55, ap:.36, cap:1200, rk:3},
  {id:'buches', n:'Bûches du grand plongeon', k:'ride', tg:'eau', c:.45, ap:.29, cap:1100, rk:3},
  {id:'simu', n:'Simulateur 4D', k:'ride', tg:'cou', c:.50, ap:.31, cap:900, rk:4},
  {id:'mega', n:'Méga coaster', k:'ride', tg:'fri', c:1.4, ap:.80, cap:1600, rk:5},
  {id:'kiosque', n:'Kiosque à gourmandises', k:'food', c:.03, sp:1.5, rk:0},
  {id:'resto', n:'Restaurant', k:'food', c:.08, sp:3.5, rk:0},
  {id:'restoth', n:'Restaurant à thème', k:'food', c:.18, sp:6, rk:3},
  {id:'souvenirs', n:'Boutique de souvenirs', k:'shop', c:.04, sp:2, rk:0},
  {id:'photo', n:'Stand photo', k:'shop', c:.03, sp:1.2, rk:0},
  {id:'bazar', n:'Grande boutique', k:'shop', c:.15, sp:4, rk:4},
  {id:'jardin', n:'Jardin fleuri', k:'deco', c:.015, rk:0},
  {id:'fontaine', n:'Fontaine', k:'deco', c:.03, rk:0},
  {id:'decor', n:'Décor de la zone', k:'deco', c:.05, rk:2}
];
const PK_EL=1.6;
const PK_GC=new Map();
const PK_K = {ride:'Attractions', food:'Restauration', shop:'Boutiques', deco:'Décors'};
const PK_ZCOST=[0,.35,.7,1.2], PK_ZRANK=[0,0,2,4];
/* V2.1.8 : recherches mises en cache (mêmes résultats, calcul du parc plus rapide) */
let PK_IM=null; const pkIt = id => { if(!PK_IM||PK_IM.n!==PK_IT.length){ PK_IM=new Map(PK_IT.map(x=>[x.id,x])); PK_IM.n=PK_IT.length; } return PK_IM.get(id); };
const pkZone = i => ((i/PK_W|0)>=2?2:0)+((i%PK_W)>=3?1:0);
function pkAdj0(i){ const x=i%PK_W, y=i/PK_W|0, o=[]; if(x>0) o.push(i-1); if(x<PK_W-1) o.push(i+1); if(y>0) o.push(i-PK_W); if(y<PK_H-1) o.push(i+PK_W); return o; }
const PK_ADJ=[]; function pkAdj(i){ return PK_ADJ[i]||(PK_ADJ[i]=pkAdj0(i)); }
const PK_MAINT=[['Économe','Peu cher, mais pannes fréquentes et risque d’accident',.004,.014],['Normal','Équilibré',.009,.006],['Renforcé','Cher, presque aucune panne',.018,.0015]];
/* fenêtres des événements (jour de l'année, 0 = 1er janvier) */
const PK_EV = [{n:'Halloween',a:270,z:299},{n:'Noël',a:330,z:359}];
const pkEvNow = () => PK_EV.find(e=>metDoy()>=e.a&&metDoy()<=e.z)||null;

function pkFix(b){
  const m=b.m; if(!m||m.v===2) return;
  const old=Array.isArray(m.rides)? m.rides : ['carrousel','grand8'];
  const cells=new Array(PK_W*PK_H).fill(null), zones=[{own:1,th:null},{own:0,th:null},{own:0,th:null},{own:0,th:null}];
  const slots=[0,1,2,6,7,8,3,4,5,9,10,11];
  old.forEach((id,k)=>{ const i=slots[k]; if(i===undefined||!pkIt(id)) return; cells[i]={t:id}; zones[pkZone(i)].own=1; });
  b.m={v:2, cells, zones, tk:Math.round(38*(b.price||1)), fp:0, noc:0, ev:0, maint:m.maint===undefined?1:m.maint, wait:m.wait||20, vis:0, spend:0, log:m.log||[]};
  b.price=1; b.mkt=0;
}
function pkInit(b){ const cells=new Array(PK_W*PK_H).fill(null); cells[1]={t:'carrousel'}; cells[7]={t:'grand8'}; cells[8]={t:'kiosque'};
  return {v:2, cells, zones:[{own:1,th:null},{own:0,th:null},{own:0,th:null},{own:0,th:null}], tk:38, fp:0, noc:0, ev:0, maint:1, wait:20, vis:0, spend:0, log:[]}; }
const pkUp = (b,i) => { const c=b.m.cells[i]; return c && !(c.d>S.day); };
/* calcul du parc (sans hasard) */
function pkCalc(b){
  const m=b.m, wx=metWeather(b.city); let A=0, apC=0, apE=0, cap=0, fs=0, ss=0, nR=0, nF=0, nS=0, tags={};
  const dz=[]; m.cells.forEach((y,j)=>{ if(y&&y.t==='decor') dz[pkZone(j)]=1; });
  m.cells.forEach((c,i)=>{ if(!c) return; const it=pkIt(c.t); if(!it) return;
    const z=m.zones[pkZone(i)], th=z.th&&PK_TH[z.th], nb=pkAdj(i).map(j=>m.cells[j]&&pkIt(m.cells[j].t)).filter(Boolean);
    if(it.k==='ride'){ nR++; if(!pkUp(b,i)) return;
      let f=1; if(th&&th.tag===it.tg) f+=.25; nb.forEach(x=>{ if(x.id==='jardin') f+=.06; else if(x.id==='fontaine') f+=.10; });
      if(th&&dz[pkZone(i)]) f+=.12;
      const a=it.ap*f; A+=a; if(it.tg==='cou') apC+=a; if(it.tg==='eau') apE+=a; cap+=it.cap; tags[it.tg]=1; }
    else if(it.k==='food'||it.k==='shop'){ let f=nb.some(x=>x.k==='ride')? 1.25 : 1; if(it.id==='photo'&&nb.some(x=>x.tg==='fri')) f*=1.6; if(it.k==='shop'&&(i/PK_W|0)===PK_H-1) f*=1.15;
      if(it.k==='food'){ nF++; fs+=it.sp*f; } else { nS++; ss+=it.sp*f; } }
  });
  A*= 1+.04*Object.keys(tags).length;
  fs=9*(1-Math.exp(-fs/9)); ss=8*(1-Math.exp(-ss/8));
  const share=A? apC/A : 0, eau=A? apE/A : 0;
  const wxF= wx==='pluie'? .5+.5*share : wx==='soleil'? 1.08*(1+.25*eau) : 1;
  const hi=metSeason(.3)>1.1, ev=m.ev&&pkEvNow();
  const hours=10+(m.noc?3:0);
  const elast=Math.pow(38/m.tk,PK_EL);
  const demand=(1+Math.pow(A,.95))*Math.pow(metSeason(.3),1.2)*wxF*elast*(m.noc?(hi?1.15:1.04):1)*(ev?1.35:1);
  const capU=cap/1200*(hours/10)*Math.sqrt(b.lvl||1);
  return {A, cap, capU, fs, ss, nR, nF, nS, wx, wxF, hours, elast, demand, ev, hi, share};
}
/* débit converti en visiteurs par jour (attente d'environ 25 minutes) */
function pkCapDay(b,cap){ const m=b.m; return cap/1200*((10+(m&&m.noc?3:0))/10)*Math.sqrt(b.lvl||1)*metR0(b)/38; }
function pkFixed(b){ const m=b.m, R0=metR0(b); let n=0, o=0; m.cells.forEach(c=>{ const it=c&&pkIt(c.t); if(!it) return; if(it.k==='ride') n+=it.c<.2?.6:it.c<.5?1:1.8; else if(it.k!=='deco') o++; });
  return R0*(PK_MAINT[m.maint][2]*n+.004*o+(m.noc?.05:0)+(m.ev&&pkEvNow()?.08:0)); }
MET.park = {
  fam:'resto', core:true,
  init: pkInit,
  fix: pkFix,
  ranks:[
    {n:'Coupe-file', d:'Vendez des billets coupe-file et la tour de chute libre est disponible.'},
    {n:'Nocturnes et décors', d:'Ouvertures en soirée, décors de zone, théâtre des spectacles et troisième zone.'},
    {n:'Grands manèges', d:'Looping, bûches du grand plongeon et restaurant à thème.'},
    {n:'Événements', d:'Halloween et Noël, simulateur 4D, grande boutique et quatrième zone.'},
    {n:'Parc de légende', d:'Le méga coaster, l’attraction phare qui attire tout le pays.'}
  ],
  mods(b){ pkFix(b); const m=b.m, p=pkCalc(b);
    const qF= m.wait>40? Math.pow(40/m.wait,.6) : 1;
    const fpRev= m.fp? .12*6 : 0;
    const spend=p.fs+p.ss+fpRev;
    return { vol:p.demand*qF, price:(m.tk+spend)/38, cogs:1+(.35*p.fs+.45*p.ss)/(.4*38), fixed:pkFixed(b) };
  },
  daily(b,ctx){ pkFix(b); const m=b.m;
    m.cells.forEach(c=>{ if(c&&c.d&&c.d<=S.day) delete c.d; });
    const pB=PK_MAINT[m.maint][3];
    m.cells.forEach(c=>{ const it=c&&pkIt(c.t); if(!it||it.k!=='ride'||c.d) return; if(rnd()<pB){ const n=rint(2,5); c.d=S.day+n; metLog(b,'panne sur « '+it.n+' » : fermée '+n+' jours.','warn'); } });
    if(ctx.open&&m.maint===0&&rnd()<.0012){ b.closedUntil=S.day+4; S.rep=clamp(S.rep-3,0,100); metLog(b,'accident sur une attraction mal entretenue : parc fermé 4 jours, enquête en cours.','bad'); }
    const p=pkCalc(b), sp=p.fs+p.ss+(m.fp?.72:0);
    m.spend=sp;
    m.vis= b.last&&b.last.open? b.last.rev/Math.max(1,m.tk+sp) : 0;
    const vU= m.vis*38/Math.max(1,metR0(b));
    m.wait= p.capU>0? clamp(25*Math.pow(vU/p.capU,1.5)*(m.fp?1.1:1),3,150) : 0;
    const e=pkEvNow(); if(m.ev&&e&&metDoy()===e.a) metLog(b,'l’événement '+e.n+' commence : décors, spectacles et visiteurs en plus.','good');
  },
  kpis(b){ pkFix(b); const m=b.m, p=pkCalc(b), down=m.cells.filter(c=>c&&c.d).length;
    return [['Visiteurs / jour', m.vis? fmtN(Math.round(m.vis)) : '—', 'Billet '+eur(m.tk,0)+', dépense '+eur(m.spend||p.fs+p.ss,0)],
            ['Attente moyenne', Math.round(m.wait)+' min', m.wait>40?'Les visiteurs repartent : ajoutez du débit':m.wait<12?'Le parc a de la marge':'Supportable'],
            ['Météo du jour', MET_WXN[p.wx], p.wx==='pluie'?'Seules les attractions couvertes tournent bien':metSeasonName()+(p.ev?' · '+p.ev.n:'')],
            ['Attractions en service', (p.nR-down)+' / '+p.nR, 'Capacité : '+fmtN(Math.round(pkCapDay(b,p.cap)))+' visiteurs / jour']];
  },
  ctl(b){ pkFix(b); const m=b.m, out=[];
    out.push({k:'seg', act:'maint', label:'Entretien des attractions', val:m.maint, opts:PK_MAINT.map((x,i)=>[i,x[0]]), sub:PK_MAINT[m.maint][1]+'.'});
    out.push({k:'seg', act:'tk', label:'Prix du billet : '+eur(m.tk,0), val:'x', opts:[[-5,'−5 €'],[-1,'−1 €'],[1,'+1 €'],[5,'+5 €']], sub:'Un billet cher fait fuir une partie des visiteurs, mais réduit l’attente.'});
    if(mxHas(b,1)) out.push({k:'tog', act:'fp', label:'Coupe-file', val:m.fp, sub:'Environ 12 % des visiteurs paient 6 € de plus. L’attente des autres augmente un peu.'});
    if(mxHas(b,2)) out.push({k:'tog', act:'noc', label:'Nocturnes', val:m.noc, sub:'Trois heures de plus chaque soir : débit et fréquentation en hausse, surtout l’été. Coût : '+eur(metR0(b)*.05,0)+' / jour.'});
    if(mxHas(b,4)) out.push({k:'tog', act:'ev', label:'Événements de saison', val:m.ev, sub:'Halloween (octobre) et Noël (décembre) : +35 % de visiteurs pendant l’événement. Coût : '+eur(metR0(b)*.08,0)+' / jour pendant l’événement.'});
    return out;
  },
  acts:{
    maint:(b,v)=>{ b.m.maint=clamp(v|0,0,2); return ok('Entretien : '+PK_MAINT[b.m.maint][0].toLowerCase()+'.'); },
    tk:(b,v)=>{ b.m.tk=clamp(b.m.tk+(+v||0),15,90); return ok('Billet à '+eur(b.m.tk,0)+'.'); },
    fp:(b,v)=>{ if(!mxHas(b,1)) return err('Palier de maîtrise 1 requis.'); b.m.fp=+v?1:0; return ok(''); },
    noc:(b,v)=>{ if(!mxHas(b,2)) return err('Palier de maîtrise 2 requis.'); b.m.noc=+v?1:0; return ok(''); },
    ev:(b,v)=>{ if(!mxHas(b,4)) return err('Palier de maîtrise 4 requis.'); b.m.ev=+v?1:0; return ok(''); },
    place:(b,arg)=>pkPlace(b,arg,false),
    rm:(b,i)=>pkRemove(b,+i),
    zone:(b,z)=>pkBuyZone(b,+z,false),
    theme:(b,arg)=>pkTheme(b,arg,false)
  },
  auto: pkAuto,
  /* V1.8.2 : achat visé en délégation totale = la construction la plus rentable du moment */
  /* achat visé : une construction sur une case libre, sinon un nouveau terrain ; parc complet → agrandissement (générique).
     Les remplacements se font au fil de l'eau, sans bloquer la réserve. */
  goal(b){ try{ pkFix(b); const m=b.m, free=m.cells.some((c,i)=>!c&&m.zones[pkZone(i)].own);
    if(free){ const sig=m.cells.map(c=>c?c.t+(c.d>S.day?'*':''):'').join(',')+'|'+m.zones.map(z=>z.own).join(''), ca=PK_GC.get(b.id);   /* V2.1.8 : résultat gardé 7 jours tant que le parc ne change pas */
      const x= ca&&ca.sig===sig&&S.day-ca.day<7&&ca.day<=S.day ? ca.x : pkOptimize(b,1,Infinity); if(!ca||ca.x!==x) PK_GC.set(b.id,{sig,day:S.day,x}); if(x&&x.rm===undefined){ const it=pkIt(x.id); return {n:'Construire « '+it.n+' »', c:pkItemCost(b,it)}; } return null; }
    const z=m.zones.findIndex((x,k)=>!x.own&&mxHas(b,PK_ZRANK[k])); if(z>0) return {n:'Nouveau terrain (zone '+(z+1)+')', c:bizDef(b).cost*PK_ZCOST[z]}; }catch(e){} return null; }
};
function pkItemCost(b,it){ return bizDef(b).cost*it.c; }
function pkPlace(b,arg,auto){
  const [si,id]=String(arg).split(':'), i=+si, it=pkIt(id), m=b.m;
  if(!it||!(i>=0&&i<PK_W*PK_H)) return err('Case ou élément inconnu.');
  if(!m.zones[pkZone(i)].own) return err('Achetez d’abord cette zone.');
  if(m.cells[i]) return err('Case déjà occupée.');
  if(!mxHas(b,it.rk)) return err('Palier de maîtrise '+it.rk+' requis.');
  if(it.id==='decor'&&!m.zones[pkZone(i)].th) return err('Choisissez d’abord un thème pour la zone.');
  if(it.id==='decor'&&m.cells.some((c,j)=>c&&c.t==='decor'&&pkZone(j)===pkZone(i))) return err('Cette zone a déjà son décor.');
  if(it.id==='mega'&&m.cells.some(c=>c&&c.t==='mega')) return err('Un seul méga coaster par parc.');
  const c=pkItemCost(b,it), lbl='Parc : « '+it.n+' »';
  if(!(auto? dlSpend(b,c,lbl) : metBuy(b,c,lbl))) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  m.cells[i]={t:id}; metLog(b,(auto?'le directeur fait construire':'nouveau')+' : « '+it.n+' ».','good');
  return ok('« '+it.n+' » construit.');
}
function pkRemove(b,i){
  const m=b.m, c=m.cells[i], it=c&&pkIt(c.t); if(!it) return err('Case vide.');
  const back=pkItemCost(b,it)*.25; m.cells[i]=null; payCap('b:'+b.id,'Parc : démontage de « '+it.n+' »',back); b.inv$=Math.max(0,(b.inv$||0)-pkItemCost(b,it));
  return ok('« '+it.n+' » démonté, '+eur(back,0)+' récupérés.');
}
function pkBuyZone(b,z,auto){
  const m=b.m; if(!(z>=1&&z<=3)) return err('Zone inconnue.'); if(m.zones[z].own) return err('Zone déjà achetée.');
  if(!mxHas(b,PK_ZRANK[z])) return err('Palier de maîtrise '+PK_ZRANK[z]+' requis.');
  const c=bizDef(b).cost*PK_ZCOST[z], lbl='Parc : terrain de la zone '+(z+1);
  if(!(auto? dlSpend(b,c,lbl) : metBuy(b,c,lbl))) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  m.zones[z].own=1; metLog(b,'nouvelle zone ouverte (zone '+(z+1)+').','good'); return ok('Zone '+(z+1)+' achetée.');
}
function pkTheme(b,arg,auto){
  const [sz,th]=String(arg).split(':'), z=+sz, m=b.m; if(!m.zones[z]||!m.zones[z].own) return err('Zone non achetée.'); if(!PK_TH[th]) return err('Thème inconnu.');
  if(m.zones[z].th===th) return ok('');
  if(m.zones[z].th){ const c=bizDef(b).cost*.05; if(!(auto? dlSpend(b,c,'Parc : nouveau thème') : metBuy(b,c,'Parc : nouveau thème'))) return err('Changer de thème coûte '+eur(c,0)+'.'); }
  m.zones[z].th=th; return ok('Zone '+(z+1)+' : '+PK_TH[th].n+'.');
}
/* billet le plus rentable, d'après la fréquentation actuelle (utilisé par le directeur) */
function pkBestTk(b){
  const m=b.m, p=pkCalc(b), sp=p.fs+p.ss, cv=.4*38+.35*p.fs+.45*p.ss, R0=metR0(b)||1;
  const v0=Math.max(m.vis,R0/38*.5), vU0=v0*38/R0; let best=m.tk, bv=-Infinity;
  for(let t=20;t<=90;t+=1){ const f=Math.pow(m.tk/t,PK_EL), vU=vU0*f, w=p.capU>0? 25*Math.pow(vU/p.capU,1.5)*(m.fp?1.1:1) : 99, q=w>40? Math.pow(40/w,.6) : 1;
    const val=v0*f*q*(t+sp-cv); if(val>bv){ bv=val; best=t; } }
  return best;
}
/* ---------- Le directeur du site aux commandes ---------- */
function pkAuto(b,mode,q){
  pkFix(b); const m=b.m, p=pkCalc(b);
  /* quotidien */
  if(S.day%3===0){
    const t=pkBestTk(b)+Math.round((1-q)*6*(rnd()-.5)); m.tk=clamp(m.tk+clamp(t-m.tk,-3,3),15,90);
    m.maint= p.nR>=6&&q>.5? 2 : 1;
    if(mxHas(b,1)) m.fp= m.wait>25?1:0;
    if(mxHas(b,2)) m.noc= p.hi?1:0;
    if(mxHas(b,4)) m.ev=1;
  }
  if(mode!=='full'||S.day%7!==0) return;
  /* thème des zones : selon les attractions déjà en place */
  m.zones.forEach((z,k)=>{ if(!z.own||z.th) return; const cnt={}; m.cells.forEach((c,i)=>{ const it=c&&pkIt(c.t); if(it&&it.k==='ride'&&pkZone(i)===k) cnt[it.tg]=(cnt[it.tg]||0)+1; });
    const best=Object.keys(cnt).sort((a,c)=>cnt[c]-cnt[a])[0]; const th=best&&Object.keys(PK_TH).find(t=>PK_TH[t].tag===best); if(th) z.th=th; });
  const free=[]; m.cells.forEach((c,i)=>{ if(!c&&m.zones[pkZone(i)].own) free.push(i); });
  if(!free.length){ const z=m.zones.findIndex((x,k)=>!x.own&&mxHas(b,PK_ZRANK[k])); if(z>0){ pkBuyZone(b,z,true); return; } }   /* V1.8.6 : il épargne pour le terrain au lieu de remplacer */
  /* V1.8.2 : le directeur évalue chaque attraction possible sur chaque case libre (et le remplacement
     des moins utiles quand le parc est plein) avec le calcul du jeu, puis retient l'achat qui se
     rapporte le plus par jour (remboursé en moins de 30 mois). Un directeur moins bon se trompe parfois de case. */
  /* V2.1.9 : parc plein et agrandissement visé : les remplacements ne prennent que la réserve au-delà de son prix */
  let cap; if(!free.length){ const g=dlGoal(b); if(g&&(g.up||g.rel)){ cap=dlBudget(b)-g.c; if(cap<=0) return; } }
  const best=pkOptimize(b,q,cap); if(!best) return;
  if(best.rm!==undefined) pkRemove(b,best.rm);
  pkPlace(b,best.cell+':'+best.id,true);
}
/* résultat d'un jour avec une attente recalculée (l'attente dépend des visiteurs, qui dépendent de l'attente) */
function pkEst(b){ const m=b.m, w0=m.wait, R0=Math.max(1,metR0(b)); let pr=null;
  try{ for(let k=0;k<5;k++){ pr=bizProjection(b); const p=pkCalc(b), sp=p.fs+p.ss+(m.fp?.72:0), vis=pr.rev/Math.max(1,m.tk+sp), vU=vis*38/R0;
      const w= p.capU>0? clamp(25*Math.pow(vU/p.capU,1.5)*(m.fp?1.1:1),3,150) : 150; m.wait=(m.wait+w)/2; }
    pr=bizProjection(b); } finally{ m.wait=w0; }
  return pr.rev-pr.cogs-(pr.mm.fixed||0); }
function pkOptimize(b,q,cap){ const m=b.m, budget= cap!==undefined? cap : dlBudget(b), n0=pkEst(b);
  const avail=PK_IT.filter(it=>mxHas(b,it.rk)&&!(it.id==='mega'&&m.cells.some(c=>c&&c.t==='mega'))&&it.id!=='decor'&&pkItemCost(b,it)<=budget);
  if(!avail.length) return null;
  const free=[]; m.cells.forEach((c,i)=>{ if(!c&&m.zones[pkZone(i)].own) free.push(i); });
  let best=null;
  const test=(cell,it,rm)=>{ const old=m.cells[cell]; m.cells[cell]={t:it.id}; const v=pkEst(b)-n0; m.cells[cell]=old;
    const cost=pkItemCost(b,it)-(rm!==undefined&&old? pkItemCost(b,pkIt(old.t))*.25 : 0); if(!(v>0)||cost<=0) return;
    /* les cases sont rares : on garde le plus gros gain par jour parmi les achats remboursés en moins de 30 mois */
    if(v*900<cost) return; const sc=v; if(!best||sc>best.sc) best={sc, cell, id:it.id, v, rm, cost}; };
  if(free.length) free.forEach(i=>avail.forEach(it=>test(i,it)));
  else m.cells.forEach((c,i)=>{ if(!c||c.d) return; const cur=pkIt(c.t); if(!cur) return; avail.forEach(it=>{ if(it.id!==cur.id) test(i,it,i); }); });
  if(!best) return null;
  /* remplacement : seulement s'il se rembourse en moins de deux ans */
  if(best.rm!==undefined&&best.v*360<best.cost) return null;
  /* directeur moyen : une fois sur quelques-unes, une case moins bien choisie */
  if(cap===undefined&&free.length>1&&rnd()<(1-q)*.35){ const alt=free[Math.floor(rnd()*free.length)]; best={...best, cell:alt}; }
  return best;
}
{ const _ms=metState; metState=function(b){ const st=_ms(b); const m=metOf(b); if(st&&m&&m.fix){ m.fix(b); return b.m; } return st; }; }

