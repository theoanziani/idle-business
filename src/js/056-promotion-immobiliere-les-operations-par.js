/* ============================================================
   PROMOTION IMMOBILIÈRE : les opérations par étapes
   Terrain → étude du programme → permis de construire → ventes sur plan → chantier → livraison.
   Les ventes sur plan financent le chantier : on peut le lancer dès 30 % de surface vendue,
   ou plus tôt avec un crédit promoteur (intérêts au taux de la banque centrale + 2 points).
   Recettes : 20 % du prix à la signature, 70 % au fil du chantier, 10 % à la livraison.
   Événements : recours de riverains (permis), hausse des taux (événement du jeu), retard de livraison.
   Paliers : programmes mixtes, écoquartier, plusieurs villes, tour, quartier neuf.
   Lien : votre société de construction réduit le coût (−12 %) et la durée (−25 %) des chantiers.
   Unités : une parcelle de taille s porte 3 000 m² × s × densité ; prix et coûts sont exprimés en R0.
   État b.m (v:1) : ops[] (opérations), land[] (terrains proposés), mk{} (marchés), landNext,
   idle, nid, acc, accC, pend, pendC, done (opérations livrées), log.
   ============================================================ */
const PR_PROG = {res:{n:'Résidentiel', mix:{log:1}, rk:0}, mix:{n:'Mixte', mix:{log:.6,bur:.25,com:.15}, rk:1}, bur:{n:'Bureaux', mix:{log:.15,bur:.85}, rk:1}};
const PR_TYPE = {log:{n:'Logements', p:1, v:1, c:1}, bur:{n:'Bureaux', p:1.1, v:.85, c:1.08}, com:{n:'Commerces', p:1.3, v:.6, c:1}};
const PR_DENS = [{n:'Modeste', f:.7, r:.7, pd:0, cd:.9},{n:'Standard', f:1, r:1, pd:0, cd:1},{n:'Dense', f:1.4, r:2, pd:15, cd:1.15},{n:'Tour', f:3, r:2.5, pd:45, cd:1.6, rk:4}];
const PR_ST = ['Terrain','Permis','Ventes sur plan','Chantier','Livraison'];
const PR_LANDT = ['friche industrielle','ancien garage','terrain à bâtir','parking désaffecté','ancienne caserne','entrepôt à démolir','ancien centre commercial'];
const PR_K = {land:55, sale:270, build:120};
function prInit(b){ const m={v:1, ops:[], land:[], mk:{log:{v:1,d:0}, bur:{v:1,d:0}, com:{v:1,d:0}}, landNext:0, idle:0, nid:1, acc:0, accC:0, pend:0, pendC:0, done:0, log:[]}; b.m=m;
  prLand(b);
  /* une société déjà ouverte reprend avec une opération en cours (ventes déjà signées) */
  if(b.hist&&b.hist.length>5){ const L=m.land[0], o={id:m.nid++, n:L.n, city:L.city, cn:L.cn, s:L.s, q:L.q, r:L.r, lp:L.price, prog:'res', dens:1, eco:0, stage:'chantier', d0:S.day-200, pr:1, sold:.5, sv:0, rec:0, cp:.5, loan:0};
    o.sv=.5*prVal(b,o); o.rec=o.sv*.55; o.cc=prCost(b,o); o.cd=prDur(o); m.ops.push(o); m.land.shift(); }
  return m; }
function prCityAvg(cid){ const C=D.CITIES[cid]; return C.d.reduce((a,x)=>a+x.p,0)/C.d.length; }
function prLand(b){ const m=b.m, R0=metR0(b), home=prCityAvg(b.city);
  m.land=[]; const cities=[b.city]; if(mxHas(b,3)) Object.keys(D.CITIES).filter(c=>c!==b.city&&cityUnlocked(c)&&!D.CITIES[c].parent).slice(0,4).forEach(c=>cities.push(c));
  for(let i=0;i<3+(mxHas(b,3)?1:0);i++){ const cid=i===0?b.city:pick(cities), C=D.CITIES[cid], dq=pick(C.d), big=mxHas(b,5)&&i===3-(mxHas(b,3)?0:1)&&rnd()<.5;
    const s=big? 4+2*rnd() : .6+rnd(), q=clamp(Math.sqrt(dq.p/home),.6,1.6);
    m.land.push({id:m.nid++, n:(big?'Grand terrain pour un quartier neuf':cap1(pick(PR_LANDT)))+' · '+dq.n, city:cid, cn:C.n, s, q, r:.06+.22*rnd(), price:R0*PR_K.land*s*q*(.85+.3*rnd()), big}); }
  m.landNext=S.day+30; }
function cap1(t){ return t.charAt(0).toUpperCase()+t.slice(1); }
function prSurf(o){ return 3000*o.s*PR_DENS[o.dens].f; }
/* prix de marché de toute l'opération (avant réglage du prix) */
function prVal(b,o){ const R0=metR0(b), mix=PR_PROG[o.prog].mix;
  return R0*PR_K.sale*o.s*PR_DENS[o.dens].f*o.q*(o.eco?1.15:1)*Object.keys(mix).reduce((a,t)=>a+mix[t]*PR_TYPE[t].p*Math.sqrt(b.m.mk[t].v),0); }
function prCost(b,o){ const R0=metR0(b), mix=PR_PROG[o.prog].mix, D_=PR_DENS[o.dens];
  return R0*PR_K.build*o.s*D_.f*(o.dens===3?1.25:1)*(o.eco?1.08:1)*Object.keys(mix).reduce((a,t)=>a+mix[t]*PR_TYPE[t].c,0)*(buildCoLevel()>0?.88:1); }
function prDur(o){ return Math.round(150*PR_DENS[o.dens].cd*Math.sqrt(o.s)*(buildCoLevel()>0?.75:1)); }
function prPace(b,o){ const mix=PR_PROG[o.prog].mix, rt=clamp(1-.08*(S.macro.rate-4),.5,1.3);
  return .0075*Object.keys(mix).reduce((a,t)=>a+mix[t]*PR_TYPE[t].v*b.m.mk[t].v,0)*Math.pow(o.pr,-3)*rt*(o.eco?1.1:1)/Math.sqrt(Math.max(1,o.s*PR_DENS[o.dens].f/1.5)); }
function prMax(b){ return 2+(mxHas(b,3)?1:0)+(b.lvl>=3?1:0); }
function prStage(o){ return o.stage==='etude'?0:o.stage==='permis'?1:o.stage==='vente'?2:o.stage==='chantier'?3:4; }
/* recettes reconnues : 20 % à la signature, 70 % avec l'avancement, 10 % à la livraison */
function prRecog(b,o){ const tgt=o.sv*(o.stage==='livre'?1:.2+.7*(o.cp||0)); if(tgt>o.rec){ b.m.acc+=tgt-o.rec; o.rec=tgt; } }
function prFile(b,o){ if(o.stage!=='etude') return err('Le permis est déjà déposé.'); const c=metR0(b)*2; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  b.m.accC+=c; const D_=PR_DENS[o.dens]; o.stage='permis'; o.pe=S.day+rint(40,60)+D_.pd; o.rc=0;
  const pr=o.r*D_.r*(o.eco?.5:1); if(rnd()<pr){ o.rc=1; o.rcDay=S.day+rint(10,30); }
  metLog(b,'permis déposé pour « '+o.n+' » : réponse attendue dans '+(o.pe-S.day)+' jours.',''); return ok('Permis déposé.'); }
function prStart(b,o,credit){ if(o.stage!=='vente') return err('Le chantier ne peut pas démarrer maintenant.'); const sh=o.sold;
  if(sh<.3&&!credit) return err('Il faut 30 % de surface vendue sur plan, ou un crédit promoteur.');
  o.stage='chantier'; o.cc=prCost(b,o); o.cd=prDur(o); o.cp=0; o.loan= sh<.3? o.cc*.7 : 0;
  metLog(b,'chantier lancé : « '+o.n+' »'+(o.loan?' avec un crédit promoteur de '+eur(o.loan,0):'')+', livraison dans '+o.cd+' jours.',''); return ok('Chantier lancé.'); }
function prBuyLand(b,id){ const m=b.m, L=m.land.find(x=>x.id===+id); if(!L) return err('Terrain déjà vendu.'); if(m.ops.filter(o=>o.stage!=='fini').length>=prMax(b)) return err(prMax(b)+' opérations au plus en même temps.');
  if(availFor(cityOf(b).ccy)<L.price) return err('Trésorerie insuffisante : '+eur(L.price,0)+'.');
  m.accC+=L.price; m.land=m.land.filter(x=>x!==L);
  m.ops.push({id:m.nid++, n:L.n, city:L.city, cn:L.cn, s:L.s, q:L.q, r:L.r, lp:L.price, big:L.big, prog:'res', dens:1, eco:0, stage:'etude', d0:S.day, pr:1, sold:0, sv:0, rec:0, cp:0, loan:0});
  metLog(b,'terrain acheté : '+L.n+' ('+eur(L.price,0)+').',''); return ok('Terrain acheté : définissez le programme puis déposez le permis.'); }
MET.promo = {
  fam:'imm', core:true, init:prInit,
  ranks:[
    {n:'Programmes mixtes', d:'Bureaux et commerces en plus des logements.'},
    {n:'Écoquartier', d:'Un label qui se vend 15 % plus cher et qui apaise les riverains.'},
    {n:'Plusieurs villes', d:'Des terrains dans les autres villes ouvertes et une opération de plus en même temps.'},
    {n:'Tour', d:'Trois fois plus de surface sur le même terrain, mais un permis long et contesté.'},
    {n:'Quartier neuf', d:'De très grands terrains pour bâtir un quartier entier.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC}; },
  daily(b,ctx){ const m=b.m, R0=metR0(b);
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    /* marchés : logements stables, bureaux qui suivent l'économie, commerces plus volatils */
    Object.keys(m.mk).forEach(t=>{ const k=m.mk[t], amp=t==='log'?.003:t==='bur'?.005:.006; k.d=clamp(k.d*.98+amp*norm(),-.01,.01); k.v=clamp(k.v*Math.exp(k.d+(t==='bur'?.002*(S.macro.econ-1):0)-.002*(k.v-1)),.6,1.5); });
    if(S.day>=m.landNext||m.land.length===0) prLand(b);
    m.ops.forEach(o=>{
      if(o.stage==='permis'){
        if(o.rc===1&&S.day>=o.rcDay){ o.rc=2; const add=rint(40,90); o.pe+=add; let red='';
          if(o.dens>0&&rnd()<.3){ o.dens--; red=' Le tribunal impose une hauteur réduite ('+PR_DENS[o.dens].n.toLowerCase()+').'; }
          metLog(b,'recours de riverains contre « '+o.n+' » : le permis prend '+add+' jours de plus.'+red,'warn'); }
        if(S.day>=o.pe){ o.stage='vente'; o.v0=prVal(b,o); metLog(b,'permis accordé pour « '+o.n+' » : les ventes sur plan commencent.','good'); }
      }
      if(o.stage==='vente'||o.stage==='chantier'||o.stage==='livre'){
        if(o.sold<1){ const df=Math.min(1-o.sold, prPace(b,o)*Math.exp(.35*norm())); if(df>0){ o.sold+=df; o.sv+=df*prVal(b,o)*o.pr; } }
      }
      if(o.stage==='chantier'){
        m.accC+=o.cc/o.cd; o.cp=Math.min(1,o.cp+1/o.cd);
        if(o.loan) m.accC+=o.loan*(S.macro.rate+2)/100/360;
        if(!o.late&&o.cp>.5&&rnd()<.004){ o.late=1; const add=Math.round(o.cd*rint(15,30)/100); o.cc*=1+add/o.cd*.3; o.cd+=add; o.cp=o.cp*(o.cd-add)/o.cd; m.accC+=o.sv*.01; metLog(b,'retard de livraison sur « '+o.n+' » : '+add+' jours de plus, pénalités aux acheteurs.','warn'); }
        if(o.cp>=1){ o.stage='livre'; o.loan=0; m.done++; metLog(b,'livraison de « '+o.n+' » : '+Math.round(o.sold*100)+' % de la surface vendue.','good'); }
      }
      prRecog(b,o);
      if(o.stage==='livre'&&o.sold>=.999){ o.stage='fini'; }
      if(o.stage==='livre'&&S.day-o.d0>900&&o.sold<1){ const rest=1-o.sold; o.sv+=rest*prVal(b,o)*.8; o.sold=1; prRecog(b,o); o.stage='fini'; metLog(b,'les derniers lots de « '+o.n+' » sont cédés à un investisseur avec une décote de 20 %.',''); }
    });
    m.ops=m.ops.filter(o=>o.stage!=='fini');
    /* sans consigne, l'équipe fait avancer les opérations et en lance une petite de temps en temps */
    if(dlMode(b)==='me'){
      m.ops.forEach(o=>{ if(o.stage==='etude'&&S.day-o.d0>=10) prFile(b,o); if(o.stage==='vente'&&o.sold>=.3) prStart(b,o,false); });
      if(!m.ops.length){ m.idle=(m.idle||0)+1; if(m.idle>=15){ const L=m.land.filter(x=>x.city===b.city&&!x.big).sort((x,y)=>y.q*(1-y.r)/y.price-x.q*(1-x.r)/x.price)[0]; if(L&&prBuyLand(b,L.id).ok){ m.idle=0; metLog(b,'faute de nouvelle opération, l’équipe achète un petit terrain.',''); } } } else m.idle=0;
    }
  },
  kpis(b){ const m=b.m, act=m.ops.length, ch=m.ops.filter(o=>o.stage==='chantier').length, mk=m.mk;
    const val=m.ops.reduce((a,o)=>a+o.sv-o.rec,0);
    return [['Opérations', act+' / '+prMax(b), ch? ch+' chantier'+(ch>1?'s':'')+' en cours' : act? 'Aucun chantier en cours' : 'Achetez un terrain'],
            ['Ventes signées à encaisser', eur(val,0), 'Encaissées au fil des chantiers'],
            ['Marché', 'Logements '+Math.round(mk.log.v*100), 'Bureaux '+Math.round(mk.bur.v*100)+' · commerces '+Math.round(mk.com.v*100)],
            ['Taux directeur', S.macro.rate.toFixed(1).replace('.',NDEC)+' %', m.done+' opération'+(m.done>1?'s':'')+' livrée'+(m.done>1?'s':'')]];
  },
  ctl(b){ return []; },
  acts:{
    land:(b,id)=>prBuyLand(b,id),
    prog:(b,arg)=>{ const [id,v]=String(arg).split(':'), o=b.m.ops.find(x=>x.id===+id); if(!o||o.stage!=='etude') return err('Programme figé une fois le permis déposé.'); const P=PR_PROG[v]; if(!P) return err('Programme inconnu.'); if(P.rk&&!mxHas(b,P.rk)) return err('Palier '+P.rk+' requis.'); o.prog=v; return ok(''); },
    dens:(b,arg)=>{ const [id,v]=String(arg).split(':'), o=b.m.ops.find(x=>x.id===+id), D_=PR_DENS[+v]; if(!o||o.stage!=='etude') return err('Densité figée une fois le permis déposé.'); if(!D_) return err('Densité inconnue.'); if(D_.rk&&!mxHas(b,D_.rk)) return err('Palier '+D_.rk+' requis.'); o.dens=+v; return ok(''); },
    eco:(b,id)=>{ const o=b.m.ops.find(x=>x.id===+id); if(!o||o.stage!=='etude') return err('Label figé une fois le permis déposé.'); if(!mxHas(b,2)) return err('Palier 2 requis.'); o.eco=o.eco?0:1; return ok(''); },
    file:(b,id)=>{ const o=b.m.ops.find(x=>x.id===+id); return o? prFile(b,o) : err('Opération introuvable.'); },
    pr:(b,arg)=>{ const [id,v]=String(arg).split(':'), o=b.m.ops.find(x=>x.id===+id); if(!o) return err('Opération introuvable.'); o.pr=clamp(Math.round((o.pr+(+v||0))*100)/100,.85,1.2); return ok(''); },
    start:(b,arg)=>{ const [id,c]=String(arg).split(':'), o=b.m.ops.find(x=>x.id===+id); return o? prStart(b,o,c==='1') : err('Opération introuvable.'); },
    sellrest:(b,id)=>{ const o=b.m.ops.find(x=>x.id===+id); if(!o||o.stage!=='livre') return err('Possible une fois l’opération livrée.'); const rest=1-o.sold; o.sv+=rest*prVal(b,o)*.8; o.sold=1; prRecog(b,o); o.stage='fini'; b.m.ops=b.m.ops.filter(x=>x!==o); metLog(b,'derniers lots de « '+o.n+' » cédés en bloc (décote de 20 %).',''); return ok('Lots restants vendus en bloc.'); }
  },
  auto: prAuto
};
/* le directeur des programmes mène une opération à la fois (plusieurs en délégation totale) */
function prAuto(b,mode,q){ const m=b.m, mx=mode==='full'?prMax(b):Math.min(2,prMax(b));
  m.ops.forEach(o=>{
    if(o.stage==='etude'){ const best=Object.keys(PR_PROG).filter(k=>!PR_PROG[k].rk||mxHas(b,PR_PROG[k].rk)).sort((x,y)=>prVal(b,Object.assign({},o,{prog:y}))/prCost(b,Object.assign({},o,{prog:y}))-prVal(b,Object.assign({},o,{prog:x}))/prCost(b,Object.assign({},o,{prog:x})))[0];
      o.prog= rnd()<q? best : 'res'; o.dens= o.r<.15&&rnd()<q? 2 : 1; if(mxHas(b,2)&&(o.r>.15||rnd()<q)) o.eco=1; prFile(b,o); }
    if(o.stage==='vente'||o.stage==='chantier'){ const pace=prPace(b,o); if(S.day%7===0){ o.pr=clamp(Math.round((o.pr+(pace<.004?-.02:pace>.008?.02:0)+(rnd()-.5)*(1-q)*.04)*100)/100,.9,1.12); } }
    if(o.stage==='vente'&&(o.sold>=.3||(mode==='full'&&o.sold>=.18&&S.macro.rate<3.5&&rnd()<q))) prStart(b,o,o.sold<.3);
    if(o.stage==='livre'&&o.sold<.9&&S.day-o.d0>600) MET.promo.acts.sellrest(b,o.id);
  });
  const act=m.ops.filter(o=>o.stage!=='livre').length;
  if(act<mx&&S.day%5===0){ const L=m.land.filter(x=>!x.big||mode==='full').sort((x,y)=>(y.q/y.price*(1-y.r))-(x.q/x.price*(1-x.r)))[0];
    if(L){ if(mode==='full'){ if(dlCan(b,L.price,'Achat d’un terrain')){ if(prBuyLand(b,L.id).ok) b.dlp-=L.price; } else if(act===0) prBuyLand(b,L.id); } else prBuyLand(b,L.id); } }
}

