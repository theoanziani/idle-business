/* ============================================================
   FERME AGROALIMENTAIRE : le calendrier des parcelles
   Chaque parcelle porte une culture (semis, croissance, récolte, selon la saison),
   un verger ou une vigne (V1.7.1 : première récolte dès la saison de plantation, à 60 % pour de jeunes plants) ou un élevage
   (production chaque jour). Les récoltes rejoignent le stock de la ferme (caisses de produits
   alimentaires), vendu au grossiste ou gardé pour les contrats, comme une usine.
   Systèmes : transformation (moulin, fromagerie, chai), machines, conversion en bio sur trois ans,
   météo (sécheresse, grêle), maladies du bétail, prix du blé qui s'envole.
   Paliers : machines, label bio, vente directe, appellation régionale, grand domaine.
   Lien : vos restaurants paient leurs produits 10 % moins cher.
   État b.m (v:1) : p[] parcelles, own (parcelles achetées), ready (récolte en attente de vente),
   bio (jour de début de conversion, 0 = non), mac {irr, trac, serre}, tr {moulin, from, chai},
   vet, shop, dry (jours secs), ev, log.
   Valeurs : y = récolte en jours de chiffre d'affaires de base (R0) ; k = coût par jour en part de R0.
   ============================================================ */
MET_FAM.ind='Industrie et agriculture';
const FM_CROP = [
  {id:'ble', n:'Blé', k:'cult', a:270, z:330, g:240, y:81, c:.135, dry:1, tr:'moulin'},
  {id:'mais', n:'Maïs', k:'cult', a:90, z:140, g:150, y:89, c:.24, dry:2},
  {id:'tourn', n:'Tournesol', k:'cult', a:100, z:150, g:130, y:68, c:.21, dry:.4},
  {id:'leg', n:'Légumes', k:'cult', a:60, z:270, g:60, y:26, c:.17, dry:1.5, hail:1.5},
  {id:'verger', n:'Verger de pommiers', k:'per', first:30, hd:240, y:94, c:.10, dry:.8, hail:1.3, plant:.4},
  {id:'vigne', n:'Vigne', k:'per', first:30, hd:255, y:144, c:.16, dry:.5, hail:1.2, plant:.6, tr:'chai'},
  {id:'vaches', n:'Vaches laitières', k:'elev', d:.30, c:.12, tr:'from', plant:.5},
  {id:'poules', n:'Poules pondeuses', k:'elev', d:.19, c:.08, plant:.2}
];
const FM_TR = {moulin:{n:'Moulin', d:'Le blé devient farine : récolte vendue 30 % plus cher.', f:1.3, c:.35},
               from:{n:'Fromagerie', d:'Le lait devient fromage : production vendue 60 % plus cher.', f:1.6, c:.6},
               chai:{n:'Chai', d:'Le raisin devient vin : récolte vendue 80 % plus cher.', f:1.8, c:.7}};
const FM_MAC = {irr:{n:'Irrigation', d:'Plus de sécheresse, maïs et légumes +10 %.', c:.4, rk:1},
                trac:{n:'Tracteur moderne', d:'Coûts des parcelles −15 %.', c:.5, rk:1},
                serre:{n:'Serres', d:'Légumes toute l’année, à l’abri de la grêle.', c:.6, rk:1}};
const FM_PCOST=[0,0,0,0,.25,.3,.35,.4,.6,.7,.8,.9];
const fmCrop = id => FM_CROP.find(x=>x.id===id);
const fmDoy = d => ((d-1)%360+360)%360;
/* prochain jour où l'année atteint le jour « doy » */
function fmNextDoy(doy,from){ const f=fmDoy(from); return from+((doy-f+360)%360||360); }
function fmInit(b){
  const ble=fmNextDoy(195,S.day), p=[{c:'ble',s:ble-240,h:ble,auto:1},{c:'ble',s:ble-240,h:ble,auto:1},{c:'vaches',s:S.day},null];
  return {v:1, p, own:4, ready:0, bio:0, mac:{}, tr:{}, vet:0, shop:0, aoc:0, dry:0, ev:null, sold:0, log:[]};
}
function fmOwn(b){ return b.m.own||4; }
function fmCanSow(b,c,day){ if(c.k!=='cult') return true; const d=fmDoy(day||S.day); if(c.id==='leg'&&b.m.mac.serre) return true; return d>=c.a&&d<=c.z; }
function fmBio(b){ const m=b.m; if(!m.bio) return 'non'; return S.day-m.bio>=1080? 'bio' : 'conv'; }
/* valeur d'une unité de récolte d'une parcelle (multiplicateurs de prix) */
function fmMult(b,c){ const m=b.m; let f=1;
  /* le même produit en grande quantité se vend moins bien */
  const same=m.p.filter(x=>x&&x.c===c.id).length; if(same>1) f/=1+.1*(same-1); if(c.tr&&m.tr[c.tr]) f*=FM_TR[c.tr].f*(m.aoc?1.25:1);
  const bio=fmBio(b); if(bio==='bio') f*=1.35; else if(bio==='conv') f*=.85;
  if(c.id==='ble'&&m.ev&&m.ev.k==='ble'&&m.ev.until>=S.day) f*=1.5;
  if(m.shop) f*=1.15;
  if(c.id==='leg'&&m.mac.irr) f*=1.1; if(c.id==='mais'&&m.mac.irr) f*=1.1;
  return f; }
function fmCostDay(b){ const m=b.m, R0=metR0(b); let k=0;
  m.p.forEach(x=>{ if(!x) return; const c=fmCrop(x.c); if(!c) return; if(c.k==='cult'&&!(x.h>S.day)) return; k+=c.c; });
  return R0*k*(m.mac.trac?.85:1)+R0*((m.vet?.02:0)+(m.shop?.03:0)); }
/* production attendue par jour en moyenne (pour l'affichage) */
function fmAvgDay(b){ const m=b.m; let v=0; m.p.forEach(x=>{ if(!x) return; const c=fmCrop(x.c); if(!c) return;
  const f=fmMult(b,c); v+= c.k==='elev'? c.d*f : c.k==='per'? c.y/360*f : c.y/(c.id==='leg'? 120 : 360)*f; }); return v*metR0(b); }
MET.farm = {
  fam:'ind', core:true, init:fmInit,
  ranks:[
    {n:'Machines', d:'Irrigation, tracteur moderne et serres sont disponibles.'},
    {n:'Label bio', d:'Lancez la conversion en bio : trois ans de récoltes un peu plus faibles, puis des prix 35 % plus hauts.'},
    {n:'Vente directe', d:'Un magasin à la ferme vend une partie de la production au prix de détail.'},
    {n:'Appellation régionale', d:'Vos produits transformés (farine, fromage, vin) se vendent 25 % plus cher.'},
    {n:'Grand domaine', d:'Quatre parcelles de plus peuvent être achetées.'}
  ],
  mods(b){ const m=b.m; return { vol:m.ready/Math.max(1,metR0(b)), cogs:0, fixed:fmCostDay(b) }; },
  daily(b,ctx){ const m=b.m, R0=metR0(b), wx=metWeather(b.city), doy=fmDoy(S.day);
    if(ctx.open){ m.sold=m.ready; m.ready=0; }
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    /* sécheresse */
    m.dry= wx==='pluie'? 0 : (m.dry||0)+(wx==='soleil'?1:.5);
    const drought= !m.mac.irr && m.dry>=12 && doy>=150 && doy<240;
    if(drought&&m.dry>=12&&m.dry<13) metLog(b,'sécheresse : les cultures souffrent. L’irrigation protégerait les récoltes.','warn');
    /* événements */
    if(!m.ev){ const r=rnd();
      if(r<.004&&doy>=60&&doy<240){ const L=m.p.map((x,i)=>[x,i]).filter(([x])=>x&&fmCrop(x.c).k!=='elev'&&!(x.c==='leg'&&m.mac.serre));
        if(L.length){ const [x]=pick(L), c=fmCrop(x.c); x.dmg=Math.min(.8,(x.dmg||0)+.5*(c.hail||1)); metLog(b,'orage de grêle : « '+c.n+' » abîmé, récolte réduite.','bad'); } }
      else if(r<.006&&m.p.some(x=>x&&fmCrop(x.c).k==='elev')&&!m.vet){ m.ev={k:'mal', until:S.day+20}; metLog(b,'maladie dans le troupeau : production réduite de 40 % pendant 20 jours. Un suivi vétérinaire l’éviterait.','bad'); }
      else if(r<.0075){ m.ev={k:'ble', until:S.day+30}; metLog(b,'le prix du blé s’envole sur les marchés : +50 % pendant 30 jours.','good'); } }
    /* production du jour */
    let add=0;
    m.p.forEach((x,i)=>{ if(!x) return; const c=fmCrop(x.c); if(!c) return; const f=fmMult(b,c);
      if(c.k==='elev'){ add+=c.d*f*(m.ev&&m.ev.k==='mal'?.6:1); return; }
      if(drought&&c.k!=='elev') x.dmg=Math.min(.8,(x.dmg||0)+.02*(c.dry||1));
      if(c.k==='per'){ if(x.first-x.s>c.first){ x.first=x.s+c.first; } /* V1.7.1 : anciennes plantations ramenées à la nouvelle règle */
        if(S.day>=x.first&&doy===c.hd){ const v=c.y*f*(1-(x.dmg||0))*(x.h1?1:.6); x.h1=1; add+=v; x.dmg=0; metLog(b,'récolte : « '+c.n+' » ('+eur(v*R0,0)+').','good'); } return; }
      if(x.h&&S.day>=x.h){ const v=c.y*f*(1-(x.dmg||0)); add+=v; metLog(b,'récolte : « '+c.n+' » ('+eur(v*R0,0)+').','good'); m.p[i]= x.auto? {c:x.c, wait:1, auto:1} : null; }
    });
    /* resemis automatique quand la saison le permet */
    m.p.forEach((x,i)=>{ if(x&&x.wait){ const c=fmCrop(x.c); if(fmCanSow(b,c)) m.p[i]={c:x.c, s:S.day, h:S.day+c.g, auto:1}; } });
    m.ready+=add*R0;
  },
  kpis(b){ const m=b.m, wx=metWeather(b.city), bio=fmBio(b);
    const used=m.p.filter(Boolean).length;
    return [['Parcelles', used+' / '+fmOwn(b), 'en culture ou en élevage'],
            ['Production moyenne', eur(fmAvgDay(b),0)+' / j', 'Coûts : '+eur(fmCostDay(b),0)+' / j'],
            ['Météo', MET_WXN[wx], m.dry>=12&&!m.mac.irr? 'Sécheresse' : metSeasonName()],
            ['Agriculture', bio==='bio'? 'Bio' : bio==='conv'? 'En conversion' : 'Classique', bio==='conv'? 'Bio dans '+Math.ceil((1080-(S.day-m.bio))/360)+' an(s)' : m.shop? 'Magasin à la ferme' : 'Vente au grossiste']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    Object.keys(FM_TR).forEach(k=>{ const t=FM_TR[k]; out.push(m.tr[k]? {k:'buy', act:'tr', arg:k, label:t.n, owned:true, sub:t.d} : {k:'buy', act:'tr', arg:k, label:t.n, cost:d.cost*t.c, sub:t.d}); });
    out.push(m.vet? {k:'buy', act:'vet', label:'Suivi vétérinaire', owned:true, sub:'Plus de maladies du troupeau. '+eur(R0*.02,0)+' / jour.'} : {k:'buy', act:'vet', label:'Suivi vétérinaire', cost:R0*3, sub:'Évite les maladies du troupeau. Ensuite '+eur(R0*.02,0)+' / jour.'});
    if(mxHas(b,1)) Object.keys(FM_MAC).forEach(k=>{ const t=FM_MAC[k]; out.push(m.mac[k]? {k:'buy', act:'mac', arg:k, label:t.n, owned:true, sub:t.d} : {k:'buy', act:'mac', arg:k, label:t.n, cost:d.cost*t.c, sub:t.d}); });
    if(mxHas(b,2)&&!m.bio) out.push({k:'btn', act:'bio', label:'Lancer la conversion en bio', cost:d.cost*.3, sub:'Trois ans de récoltes 15 % plus faibles, puis le label bio : +35 % sur les prix.'});
    if(mxHas(b,3)) out.push(m.shop? {k:'buy', act:'shop', label:'Magasin à la ferme', owned:true, sub:'Une partie de la production vendue au prix de détail.'} : {k:'buy', act:'shop', label:'Magasin à la ferme', cost:d.cost*.4, sub:'Production vendue 15 % plus cher en moyenne. '+eur(R0*.03,0)+' / jour.'});
    if(mxHas(b,4)) out.push(m.aoc? {k:'buy', act:'aoc', label:'Appellation régionale', owned:true, sub:'Produits transformés +25 %.'} : {k:'buy', act:'aoc', label:'Appellation régionale', cost:d.cost*.5, sub:'Farine, fromage et vin se vendent 25 % plus cher.'});
    return out;
  },
  acts:{
    sow:(b,arg)=>fmSow(b,arg),
    clear:(b,i)=>{ const m=b.m; i=+i; if(!m.p[i]) return err('Parcelle vide.'); const c=fmCrop(m.p[i].c); m.p[i]=null; return ok('Parcelle libérée'+(c?' ('+c.n.toLowerCase()+')':'')+'.'); },
    auto:(b,i)=>{ const x=b.m.p[+i]; if(!x) return err('Parcelle vide.'); x.auto=x.auto?0:1; return ok(x.auto?'Resemis automatique activé.':'Resemis automatique désactivé.'); },
    plot:(b)=>fmBuyPlot(b,false),
    tr:(b,k)=>fmBuyK(b,'tr',k,false),
    mac:(b,k)=>fmBuyK(b,'mac',k,false),
    vet:(b)=>{ if(b.m.vet) return err('Déjà en place.'); const c=metR0(b)*3; if(!metBuy(b,c,'Suivi vétérinaire')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.vet=1; return ok('Suivi vétérinaire en place.'); },
    bio:(b)=>{ const m=b.m; if(!mxHas(b,2)) return err('Palier 2 requis.'); if(m.bio) return err('Conversion déjà lancée.'); const c=bizDef(b).cost*.3; if(!metBuy(b,c,'Conversion en bio')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.bio=S.day; metLog(b,'la conversion en bio commence : trois ans avant le label.','good'); return ok('Conversion lancée.'); },
    shop:(b)=>fmBuyFlag(b,'shop',.4,'Magasin à la ferme',3,false),
    aoc:(b)=>fmBuyFlag(b,'aoc',.5,'Appellation régionale',4,false)
  },
  auto: fmAuto
};
function fmSow(b,arg,auto){ const [si,id]=String(arg).split(':'), i=+si, c=fmCrop(id), m=b.m;
  if(!c||!(i>=0&&i<fmOwn(b))) return err('Parcelle ou culture inconnue.'); if(m.p[i]) return err('Parcelle occupée : libérez-la d’abord.');
  if(!fmCanSow(b,c)) return err('Hors saison : semis du '+footDateLabel(c.a+1,{noY:1})+' au '+footDateLabel(c.z+1,{noY:1})+'.');
  const cost=bizDef(b).cost*(c.plant||0); if(cost>0&&!(auto? dlSpend(b,cost,c.n) : metBuy(b,cost,c.n))) return err('Trésorerie insuffisante : '+eur(cost,0)+'.');
  m.p[i]= c.k==='cult'? {c:id, s:S.day, h:S.day+c.g, auto:1} : c.k==='per'? {c:id, s:S.day, first:S.day+c.first} : {c:id, s:S.day};
  metLog(b,(auto?'le chef d’exploitation installe : ':'parcelle '+(i+1)+' : ')+c.n.toLowerCase()+'.',''); return ok(c.n+' sur la parcelle '+(i+1)+'.'); }
function fmPlotCost(b){ return bizDef(b).cost*(FM_PCOST[fmOwn(b)]||1); }
function fmBuyPlot(b,auto){ const m=b.m, n=fmOwn(b); if(n>=12||(n>=8&&!mxHas(b,5))) return err(n>=12? '12 parcelles au maximum.' : 'Palier 5 requis pour d’autres parcelles.');
  const c=fmPlotCost(b); if(!(auto? dlSpend(b,c,'Achat de terres') : metBuy(b,c,'Achat de terres'))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.own=n+1; while(m.p.length<m.own) m.p.push(null); metLog(b,'nouvelle parcelle achetée ('+m.own+').','good'); return ok('Parcelle '+m.own+' achetée.'); }
function fmBuyK(b,g,k,auto){ const m=b.m, T=g==='tr'? FM_TR : FM_MAC, t=T[k]; if(!t) return err('Inconnu.'); if(g==='mac'&&!mxHas(b,1)) return err('Palier 1 requis.'); if(m[g][k]) return err('Déjà en place.');
  const c=bizDef(b).cost*t.c; if(!(auto? dlSpend(b,c,t.n) : metBuy(b,c,t.n))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[g][k]=1; metLog(b,(auto?'le chef d’exploitation installe : ':'nouveau : ')+t.n.toLowerCase()+'.','good'); return ok(t.n+' : en place.'); }
function fmBuyFlag(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà en place.');
  const c=bizDef(b).cost*f; if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; return ok(label+' : c’est fait.'); }
/* valeur nette attendue par jour d'une culture sur une parcelle vide */
function fmScore(b,c){ const f=fmMult(b,c); if(c.k==='elev') return c.d*f-c.c; if(c.k==='per') return c.y*f/360-c.c-(c.first/3600);
  const cyc=c.id==='leg'? (b.m.mac.serre?60:120) : 360; return c.y*f/cyc-c.c*c.g/cyc; }
/* le chef d'exploitation suit le calendrier */
function fmAuto(b,mode,q){
  const m=b.m;
  m.p.forEach((x,i)=>{ if(x&&x.c&&fmCrop(x.c).k==='cult') x.auto=1; });
  if(S.day%3===0) for(let i=0;i<fmOwn(b);i++){ if(m.p[i]) continue;
    const L=FM_CROP.filter(c=>fmCanSow(b,c)&&(c.k==='cult'||mode==='full')).sort((a,c)=>fmScore(b,c)-fmScore(b,a));
    const c= rnd()<(1-q)*.3? pick(L) : L[0]; if(c) fmSow(b,i+':'+c.id,true); }
  /* V2.5.6 : chaque semaine, jusqu'à 3 achats dans l'ordre de fmNext (avant : toutes les deux semaines,
     les parcelles en tout dernier et seulement si rien d'autre n'avait été tenté, sans objectif affiché) */
  if(mode!=='full'||S.day%7!==0) return;
  for(let k=0;k<3;k++){ const g=fmNext(b); if(!g||!dlCan(b,g.c,g.n)||!dlAct(b,g.c,()=>metAct(b,g.act,g.arg))) break; metLog(b,'Votre chef d’exploitation : '+lc1(g.n)+' ('+eur(g.c,0)+').',''); }
}
/* prochain achat utile : vétérinaire, transport manquant, parcelle quand toutes sont occupées, machines, bio, magasin, appellation */
function fmNext(b){ const m=b.m, d=bizDef(b), n=fmOwn(b);
  if(!m.vet&&m.p.some(x=>x&&fmCrop(x.c).k==='elev')) return {n:'Suivi vétérinaire', c:metR0(b)*3, act:'vet', arg:''};
  for(const k of Object.keys(FM_TR)) if(!m.tr[k]&&m.p.some(x=>x&&fmCrop(x.c).tr===k)) return {n:FM_TR[k].n, c:d.cost*FM_TR[k].c, act:'tr', arg:k};
  const room=n<12&&(n<8||mxHas(b,5)), full=m.p.slice(0,n).every(x=>!!x);
  if(room&&full) return {n:'Achat d’une parcelle ('+(n+1)+'e)', c:fmPlotCost(b), act:'plot', arg:''};
  if(mxHas(b,1)) for(const k of ['irr','trac','serre']) if(!m.mac[k]) return {n:FM_MAC[k].n, c:d.cost*FM_MAC[k].c, act:'mac', arg:k};
  if(mxHas(b,2)&&!m.bio) return {n:'Conversion en bio', c:d.cost*.3, act:'bio', arg:''};
  if(mxHas(b,3)&&!m.shop) return {n:'Magasin à la ferme', c:d.cost*.4, act:'shop', arg:''};
  if(mxHas(b,4)&&!m.aoc) return {n:'Appellation régionale', c:d.cost*.5, act:'aoc', arg:''};
  if(room) return {n:'Achat d’une parcelle ('+(n+1)+'e)', c:fmPlotCost(b), act:'plot', arg:''};
  return null; }
MET.farm.goal=function(b){ return fmNext(b); };
/* lien : vos restaurants s'approvisionnent à votre ferme */
const fmSupplies = () => S.biz.some(x=>x.def==='farm'&&x.status==='active');
{ const _rc=rsCost; rsCost=function(b,x){ return _rc(b,x)*(fmSupplies()?.9:1); }; }

