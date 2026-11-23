/* ============================================================
   STUDIO VIDÉO ET PLATEFORME : les projets de production
   On lance des projets (émission, série, film) en choisissant le genre, le budget et les talents.
   À la sortie, l'audience décide du succès : recettes de sortie, puis droits du catalogue qui
   rapportent longtemps (de moins en moins). Une plateforme à abonnements valorise le catalogue.
   Talents : ils deviennent célèbres (et plus chers) après un succès.
   Événements : tournage qui dérape, prix dans un festival, succès surprise.
   Paliers : plateforme de streaming, films de cinéma, plateforme internationale, festivals, licences.
   Lien : un studio influent donne de l'influence politique (politics.js, inchangé).
   État b.m (v:1) : prj[] (en production), cat[] (titres sortis), tal[] (talents), gtr{} (tendances),
   plat {on, subs, pr}, intl, fest, lic, idle, nid, ev, pend, pendC, log.
   ============================================================ */
const SD_TYPE = {em:{n:'Émission', d:30, c:8, rk:0}, se:{n:'Série', d:90, c:35, rk:0}, fi:{n:'Film de cinéma', d:150, c:90, rk:2}};
const SD_GEN = {com:'Comédie', dra:'Drame', act:'Action', doc:'Documentaire', sf:'Science-fiction', ani:'Animation'};
const SD_BUD = [{n:'Modeste', f:.6},{n:'Confortable', f:1},{n:'Grand spectacle', f:1.8}];
const SD_FN = ['Alice','Céline','Elsa','Gaëlle','Iris','Katia','Nora','Inès','Bruno','Damien','Fabien','Hakim','Jonas','Louis','Malik','Paul'];
const SD_LN = ['Vasseur','Lemaire','Perrin','Colin','Masson','Barbier','Arnaud','Royer','Noël','Brun','Garnier','Fleury'];
const SD_FEE = [0,1,2,3.5,6,10];
function sdTal(b,i){ const r=x=>{ const v=Math.sin((b.id+3)*127.1+i*311.7+x*74.7)*43758.5453; return v-Math.floor(v); };
  const N=SD_FN.length*SD_LN.length, k=(Math.floor(Math.abs(Math.sin((b.id+3)*5.3))*N)+i*13)%N, fi=k%SD_FN.length, f=fi<8;
  return {id:i, n:SD_FN[fi]+' '+SD_LN[Math.floor(k/SD_FN.length)], role:i%2?(f?'Actrice':'Acteur'):(f?'Réalisatrice':'Réalisateur'), g:Object.keys(SD_GEN)[Math.floor(r(3)*6)], fame:1+Math.floor(r(4)*3)}; }
function sdInit(b){ const m={v:1, prj:[], cat:[], tal:[], gtr:{}, plat:{on:0, subs:0, pr:9}, intl:0, fest:0, lic:0, idle:0, nid:1, ev:null, pend:0, pendC:0, log:[]}; b.m=m;
  for(let i=0;i<8;i++) m.tal.push(sdTal(b,i));
  Object.keys(SD_GEN).forEach(g=>{ m.gtr[g]={v:clamp(Math.exp(.35*norm()),.5,2), d:0}; });
  /* catalogue de départ (droits qui rapportent déjà) */
  const R0=metR0(b), old=b.hist&&b.hist.length>5; for(let i=0;i<(old?6:2);i++) m.cat.push({id:m.nid++, n:sdTitle(), t:'em', g:pick(Object.keys(SD_GEN)), v:R0*(old?60:20), d:S.day-rint(0,200), sc:rint(45,70)});
  return m; }
const SD_TITLES=['Les Ombres de Paris','Le Dernier Été','Nuit blanche','L’Héritage','Les Rives du Nord','Horizon perdu','Le Secret des sables','Ciel de minuit','Les Enfants du large','La Fièvre','Le Grand Départ','Sous la surface','Les Gardiens','La Ville endormie','Mille Lumières','Le Temps des cerises','Les Invisibles','La Dernière Danse','Terres sauvages','Le Bal des menteurs','Point de rupture','Les Âmes errantes','La Route du sel','Le Silence des loups','Un été à Biarritz','La Maison du port','Les Frontières','Hors champ','Le Phare','Électrique'];
function sdTitle(){ const t=pick(SD_TITLES); let n=t, k=2; while(S.biz.some(x=>x.def==='studio'&&x.m&&x.m.cat&&(x.m.cat.some(c=>c.n===n)||x.m.prj.some(c=>c.n===n)))){ n=t+' '+k; k++; } return n; }
const sdTau = b => 200;
function sdRights(b,x){ const t=Math.max(0,S.day-x.d), tau=sdTau(b); return x.v*.55/tau*Math.exp(-t/tau)*(b.m.plat.on?1.25:1); }
function sdCost(b,P){ const R0=metR0(b), T=SD_TYPE[P.t]; return R0*T.c*SD_BUD[P.bud].f+(P.tal||[]).reduce((a,id)=>{ const t=b.m.tal.find(x=>x.id===id); return a+(t?R0*SD_FEE[t.fame]:0); },0); }
/* qualité attendue d'un projet (0 à 1) */
function sdQual(b,P){ const m=b.m, tl=(P.tal||[]).map(id=>m.tal.find(x=>x.id===id)).filter(Boolean);
  const tq=tl.reduce((a,t)=>a+t.fame*.05+(t.g===P.g?.06:0),0), bq=[.1,.2,.3][P.bud], gq=clamp((m.gtr[P.g].v-.5)*.15,-.1,.25);
  return clamp(.25+tq+bq+gq+(m.fest&&P.t==='fi'?.05:0),0,1); }
MET.studio = {
  fam:'lux', core:true, init:sdInit,
  ranks:[
    {n:'Plateforme de streaming', d:'Lancez votre plateforme à abonnements : vos titres y rapportent plus.'},
    {n:'Films de cinéma', d:'Des projets longs et chers, au potentiel énorme.'},
    {n:'Plateforme internationale', d:'Votre plateforme s’ouvre au monde : deux fois plus d’abonnés possibles.'},
    {n:'Festivals de prestige', d:'Vos films visent les grands prix : meilleure qualité et talents plus vite célèbres.'},
    {n:'Licences et produits dérivés', d:'Vos grands succès rapportent aussi des licences.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b);
    const rights=m.cat.reduce((a,x)=>a+sdRights(b,x),0), lic=m.lic? m.cat.filter(x=>x.sc>=80).reduce((a,x)=>a+x.v*.002,0) : 0;
    const plat=m.plat.on? m.plat.subs*m.plat.pr/30 : 0, run=m.plat.on? R0*.05+plat*.25 : 0;
    return {vol:0, cogs:0, rev:m.pend+rights+lic+plat+R0*.26, fixed:m.pendC+run};
  },
  daily(b,ctx){ const m=b.m, R0=metR0(b);
    if(ctx.open){ m.pend=0; m.pendC=0; }
    Object.keys(m.gtr).forEach(g=>{ const t=m.gtr[g]; t.d=clamp(t.d*.98+.005*norm(),-.02,.02); t.v=clamp(t.v*Math.exp(t.d),.4,2.5); });
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    /* production : coûts étalés, tournages qui dérapent */
    m.prj.slice().forEach(P=>{ m.pendC+=P.cost/P.dur; P.left--; if(!P.drap&&rnd()<.002*SD_TYPE[P.t].d/30){ P.drap=1; const add=Math.round(P.dur*.2); P.left+=add; P.dur+=add; P.cost*=1.2; metLog(b,'le tournage de « '+P.n+' » dérape : budget +20 %, sortie repoussée de '+add+' jours.','warn'); }
      if(P.left<=0) sdRelease(b,P); });
    /* sans projet, le studio produit lui-même une petite émission */
    if(!m.prj.length){ m.idle=(m.idle||0)+1; if(m.idle>=20&&dlMode(b)==='me'){ m.idle=0; sdStart(b,{t:'em', g:Object.keys(m.gtr).sort((a,c)=>m.gtr[c].v-m.gtr[a].v)[0], bud:1, tal:[pick(m.tal).id]},true); metLog(b,'faute de nouveau projet, l’équipe lance une petite émission.',''); } } else m.idle=0;
    /* plateforme */
    if(m.plat.on){ const cs=m.cat.filter(x=>S.day-x.d<540).reduce((a,x)=>a+x.v*(x.sc/60),0)/R0, T=R0*(m.intl?1.8:1)*(.4+.3*Math.min(4,Math.sqrt(cs/50)))*30/m.plat.pr*Math.pow(9/m.plat.pr,.6);
      m.plat.subs=Math.max(0,m.plat.subs+(T-m.plat.subs)*.01); }
  },
  kpis(b){ const m=b.m, mm=this.mods(b), rights=m.cat.reduce((a,x)=>a+sdRights(b,x),0), last=m.cat[m.cat.length-1];
    return [['En production', String(m.prj.length), m.prj.length? m.prj.map(p=>p.n+' ('+p.left+' j)').slice(0,2).join(' · ') : 'Aucun projet'],
            ['Catalogue', m.cat.length+' titres', eur(rights,0)+' de droits par jour'],
            ['Dernière sortie', last? 'Audience '+last.sc+' / 100' : '—', last? last.n : 'Aucune sortie'],
            ['Plateforme', m.plat.on? fmtN(Math.round(m.plat.subs))+' abonnés' : 'Pas encore', m.plat.on? eur(m.plat.pr,0)+' par mois'+(m.intl?' · internationale':'') : 'Palier 1']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    if(mxHas(b,1)) out.push(m.plat.on? {k:'seg', act:'pr', label:'Abonnement : '+eur(m.plat.pr,0)+' par mois', val:'x', opts:[[-2,'−2 €'],[-1,'−1 €'],[1,'+1 €'],[2,'+2 €']], sub:'Moins cher, plus d’abonnés. Plus le catalogue est riche et récent, plus la plateforme attire.'} : {k:'buy', act:'plat', label:'Lancer la plateforme de streaming', cost:d.cost*1.5, sub:'Abonnements chaque mois, et vos titres rapportent 25 % de droits en plus.'});
    if(mxHas(b,3)&&m.plat.on) out.push(m.intl? {k:'buy', act:'intl', label:'Plateforme internationale', owned:true, sub:'Deux fois plus d’abonnés possibles.'} : {k:'buy', act:'intl', label:'Ouvrir la plateforme au monde', cost:d.cost*4, sub:'Deux fois plus d’abonnés possibles.'});
    if(mxHas(b,4)) out.push(m.fest? {k:'buy', act:'fest', label:'Festivals de prestige', owned:true, sub:'Meilleurs films, plus de prix.'} : {k:'buy', act:'fest', label:'Viser les festivals', cost:d.cost*2, sub:'Vos films gagnent en qualité et décrochent plus de prix.'});
    if(mxHas(b,5)) out.push(m.lic? {k:'buy', act:'lic', label:'Licences et produits dérivés', owned:true, sub:'Vos grands succès rapportent des licences.'} : {k:'buy', act:'lic', label:'Créer un service de licences', cost:d.cost*5, sub:'Chaque grand succès (audience 80 ou plus) rapporte des licences chaque jour.'});
    return out;
  },
  acts:{
    start:(b,arg)=>{ const [t,g,bud,t1,t2]=String(arg).split(':'); return sdStart(b,{t, g, bud:+bud, tal:[t1,t2].filter(x=>x!==''&&x!==undefined).map(Number)},false); },
    pr:(b,v)=>{ b.m.plat.pr=clamp(b.m.plat.pr+(+v||0),3,25); return ok(''); },
    plat:(b)=>{ const m=b.m; if(!mxHas(b,1)) return err('Palier 1 requis.'); if(m.plat.on) return err('Déjà lancée.'); const c=bizDef(b).cost*1.5; if(!metBuy(b,c,'Plateforme de streaming')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.plat.on=1; m.plat.subs=metR0(b)*.3*30/m.plat.pr; metLog(b,'votre plateforme de streaming est en ligne.','good'); return ok('Plateforme lancée.'); },
    intl:(b)=>sdBuy(b,'intl',4,'Plateforme internationale',3),
    fest:(b)=>sdBuy(b,'fest',2,'Festivals de prestige',4),
    lic:(b)=>sdBuy(b,'lic',5,'Licences et produits dérivés',5)
  },
  auto: sdAuto
};
function sdBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function sdStart(b,P,free){ const m=b.m, T=SD_TYPE[P.t]; if(!T) return err('Type inconnu.'); if(T.rk&&!mxHas(b,T.rk)) return err('Palier '+T.rk+' requis.'); if(!SD_GEN[P.g]) return err('Genre inconnu.');
  if(!(P.bud>=0&&P.bud<=2)) return err('Budget inconnu.'); if(m.prj.length>=2+(b.lvl>=3?1:0)) return err('Le studio tourne déjà au maximum de ses projets.');
  if(P.tal.some(id=>m.prj.some(x=>x.tal.includes(id)))) return err('Ce talent est déjà sur un tournage.');
  const cost=sdCost(b,P); if(availFor(cityOf(b).ccy)<cost*.2) return err('Trésorerie insuffisante.');
  const n=sdTitle(), base=metR0(b)*T.c*SD_BUD[P.bud].f, fs=P.tal.reduce((a,id)=>{ const t=m.tal.find(x=>x.id===id); return a+(t?t.fame:0); },0); m.prj.push({id:m.nid++, n, t:P.t, g:P.g, bud:P.bud, tal:P.tal, cost, base, fs, dur:T.d, left:T.d, q:sdQual(b,P)}); if(!free) metLog(b,'tournage lancé : « '+n+' » ('+T.n.toLowerCase()+', '+SD_GEN[P.g].toLowerCase()+').','');
  return ok('« '+n+' » en production : sortie dans '+T.d+' jours.'); }
function sdRelease(b,P){ const m=b.m; m.prj=m.prj.filter(x=>x!==P);
  const q=P.q+(m.gtr[P.g].v-1)*.08, mult=Math.exp(1.4*(q-.55)+.38*norm())*1.85*(rnd()<.05?2:1);
  const v=(P.base!=null?P.base*(1+.07*P.fs)*(P.cost>P.base+1e-9&&P.drap?1.2:1):P.cost)*mult, sc=Math.round(clamp(30+70*(1-Math.exp(-mult/1.6)),5,99));
  m.pend+=v*.45; m.cat.push({id:P.id, n:P.n, t:P.t, g:P.g, v, d:S.day, sc}); if(m.cat.length>40) m.cat.shift();
  const surprise=mult>3.2; metLog(b,'sortie de « '+P.n+' » : audience '+sc+' / 100'+(surprise?', un succès surprise !':'')+' Recettes de sortie : '+eur(v*.45,0)+'.',sc>=70?'good':sc<40?'bad':'');
  if(sc>=80||surprise) P.tal.forEach(id=>{ const t=m.tal.find(x=>x.id===id); if(t&&t.fame<5){ t.fame++; metLog(b,t.n+' devient plus célèbre (et plus chère).','good'); } });
  if(P.t==='fi'&&rnd()<(m.fest?.25:.08)*q){ m.pend+=P.cost*.3; S.rep=clamp(S.rep+1,0,100); metLog(b,'« '+P.n+' » reçoit un prix dans un grand festival.','good'); P.tal.forEach(id=>{ const t=m.tal.find(x=>x.id===id); if(t&&t.fame<5) t.fame++; }); }
}
/* le directeur des programmes lance des projets dans un budget */
function sdAuto(b,mode,q){ const m=b.m;
  if(m.plat.on&&S.day%14===0){ m.plat.pr=clamp(Math.round(8+(m.intl?1:0)+(1-q)*2*(rnd()-.5)),5,15); }
  if(S.day%5!==0||m.prj.length>=2) return;
  const g=Object.keys(m.gtr).sort((a,c)=>m.gtr[c].v-m.gtr[a].v)[rnd()<(1-q)*.4?2:0];
  const t= mode==='full'&&mxHas(b,2)&&rnd()<.4? 'fi' : rnd()<.5? 'se' : 'em', bud= mode==='full'? 1 : 0;
  const free=m.tal.filter(x=>!m.prj.some(p=>p.tal.includes(x.id))).sort((a,c)=>((c.g===g)-(a.g===g))||(c.fame-a.fame)).slice(0,mode==='full'?2:1).map(x=>x.id);
  sdStart(b,{t,g,bud,tal:free},false);
  if(mode==='full'&&S.day%30===0){ if(mxHas(b,1)&&!m.plat.on&&dlSpend(b,bizDef(b).cost*1.5,'Plateforme de streaming')){ m.plat.on=1; m.plat.subs=metR0(b)*.3*30/m.plat.pr; return; }
    for(const [k,f,l,rk] of [['intl',4,'Plateforme internationale',3],['fest',2,'Festivals de prestige',4],['lic',5,'Licences et produits dérivés',5]]) if(!m[k]&&mxHas(b,rk)&&(k!=='intl'||m.plat.on)&&sdBuy(b,k,f,l,rk,true).ok) break; }
}

