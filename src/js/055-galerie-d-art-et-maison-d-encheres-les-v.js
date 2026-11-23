/* ============================================================
   GALERIE D'ART ET MAISON D'ENCHÈRES : les ventes en direct
   Des collectionneurs confient leurs œuvres (dépôts) ; on les expose, on choisit les lots d'une
   vente, leur ordre et leur prix de réserve, puis la vente se joue en direct : chaque lot vendu
   réchauffe la salle, chaque lot ravalé la refroidit. Commission : 10 % vendeur + 20 % acheteur.
   Lien avec le Luxe : les œuvres d'art achetées dans l'onglet Luxe (et les objets d'art de la
   salle des ventes) peuvent être confiés à la galerie : exposées, leur cote monte, puis on les
   revend aux enchères (5 % de frais pour vous, 10 % de commission acheteur pour la galerie).
   Systèmes : artistes émergents (palier 1), expertise contre les faux, exposition.
   Événements : faux découvert, artiste qui meurt (cote qui s'envole), collectionneur fortuné.
   Paliers : artistes émergents, ventes internationales, foire d'art, laboratoire d'expertise, musée privé.
   État b.m (v:1) : st[] (œuvres en réserve), off[] (propositions de dépôt), art[] (artistes),
   atl[] (œuvres en atelier), cat[] (lots de la prochaine vente, dans l'ordre), sale (vente en
   préparation), last (dernière vente), not (notoriété 0-100), intl, fair, lab, mus, whale,
   fk[] (faux vendus non découverts), idle, nid, acc, accC, pend, pendC, log.
   ============================================================ */
const GA_TITLES=['Composition bleue','Nature morte aux citrons','Portrait de femme','Paysage d’hiver','Sans titre n° 7','La Baie','Étude de mains','Jardin la nuit','Figure assise','Rivage','Le Port au matin','Abstraction rouge','Fenêtre ouverte','La Lectrice','Vue de la Seine','Grand Nu','Champ de blé','Le Violon','Totem','Constellation','Les Baigneuses','Ville sous la pluie','Autoportrait','L’Atelier','Femme au chapeau','Marine','Les Toits','Grand Bleu','Silence','Danseuse'];
const GA_ARTN=['Marcel Doyen','Hélène Varga','Pierre Castel','Ada Lindqvist','Jean Morel','Sofia Reyes','Louis Arnaud','Clara Weiss','Victor Lenoir','Mira Okafor','Paul Sorel','Yuki Tanabe','Anton Kral','Lina Moreau','Hugo Bastide','Nadia Fares'];
const GA_RES={b:{n:'Basse', f:.5}, m:{n:'Moyenne', f:.8}, h:{n:'Haute', f:1}};
const GA_COM=.10, GA_PRM=.20, GA_K=4.5;
const gaBidders=['La salle','Au téléphone','En ligne','Un marchand','Un musée'];
function gaR(b,i,x){ const v=Math.sin((b.id+7)*91.3+i*157.9+x*41.1)*43758.5453; return v-Math.floor(v); }
function gaInit(b){ const old=b.hist&&b.hist.length>5;
  const m={v:1, st:[], off:[], art:[], atl:[], cat:[], sale:null, last:null, not:old?45:30, intl:0, fair:0, lab:0, mus:0, whale:0, fk:[], idle:0, fairNext:0, nid:1, acc:0, accC:0, pend:0, pendC:0, log:[]}; b.m=m;
  for(let i=0;i<6;i++) m.art.push({id:i, n:GA_ARTN[(Math.floor(gaR(b,0,1)*GA_ARTN.length)+i*5)%GA_ARTN.length], c:clamp(.8+.7*gaR(b,i,2),.5,2), t:0, vol:.004, em:0, dead:0});
  for(let i=0;i<(old?4:2);i++) gaOffer(b,true);
  return m; }
const gaArt = (b,id) => b.m.art.find(a=>a.id===id);
function gaTitle(b){ const m=b.m, t=pick(GA_TITLES); let n=t, k=2; while(m.st.some(w=>w.n===n)||m.off.some(w=>w.n===n)){ n=t+' ('+k+')'; k++; } return n; }
/* valeur estimée d'une œuvre */
function gaEst(b,w){
  if(w.o==='lux'){ const l=D.LUX.find(x=>x.id===w.lid); return l? S.luxVal[l.id]*w.gk : 0; }
  if(w.o==='coll'){ const it=S.auc&&S.auc.coll.find(x=>x.id===w.lid); return it? collVal(it)*w.gk : 0; }
  const a=gaArt(b,w.a); return w.e0*(a?a.c:1)*w.gk; }
function gaSlots(b){ return 3+Math.max(0,(b.lvl||1)-1)+(b.m.mus?6:0); }
function gaCap(b){ return 10+(b.m.intl?4:0)+(b.m.mus?4:0); }
function gaMaxLots(b){ return b.m.intl?10:8; }
function gaOffer(b,start){ const m=b.m, R0=metR0(b), a=pick(m.art.filter(x=>!x.em||x.c>.8)||m.art);
  const e0=R0*GA_K*Math.exp(.6*norm())*(m.intl?1.8:1)*(.8+m.not/150);
  m.off.push({id:m.nid++, n:gaTitle(b), a:a.id, e0, o:'dep', fk:rnd()<.08?1:0, ex:0, gk:1, res:'m', until:S.day+8, d:S.day});
  if(m.lab){ const w=m.off[m.off.length-1]; w.ex=1; if(w.fk){ m.off.pop(); if(!start) metLog(b,'le laboratoire écarte un faux proposé en dépôt.',''); } }
}
function gaRmRef(b,id){ const m=b.m; m.cat=m.cat.filter(x=>x!==id); }
/* préparer une vente : 5 jours de catalogue */
function gaPrep(b){ const m=b.m; if(m.sale) return err('Une vente est déjà en préparation.');
  const lots=m.cat.filter(id=>m.st.some(w=>w.id===id)); if(lots.length<3) return err('Il faut au moins 3 lots au catalogue.');
  const c=metR0(b)*.6; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.accC+=c; m.sale={lots, ready:S.day+5}; m.cat=[]; metLog(b,'catalogue en préparation : '+lots.length+' lots, vente dans 5 jours.','');
  return ok('Vente prévue dans 5 jours.'); }
/* la vente en direct : les résultats sont tirés d'un coup, l'écran les rejoue */
function gaRun(b,auto){ const m=b.m, R0=metR0(b), V=m.sale; if(!V) return err('Aucune vente en préparation.'); if(S.day<V.ready) return err('Le catalogue sera prêt dans '+(V.ready-S.day)+' jours.');
  const lots=V.lots.map(id=>m.st.find(w=>w.id===id)).filter(w=>w&&gaEst(b,w)>0);
  const mean=lots.reduce((a,w)=>a+gaEst(b,w),0)/Math.max(1,lots.length);
  let h=.9+m.not/400+(m.intl?.08:0), sold=0, tot=0, com=0; const res=[], wh=m.whale;
  let star=-1; if(wh){ let bv=-1; lots.forEach((w,i)=>{ const v=gaEst(b,w); if(v>bv){ bv=v; star=i; } }); }
  lots.forEach((w,i)=>{ const est=gaEst(b,w), big=est>1.8*mean;
    if(i>=7) h-=.03;
    let f=Math.exp(.2*norm())*h; if(big) f*=1+(h-1)*1.5; if(i===star) f*=1.45;
    const hammer=Math.round(est*f/100)*100, rv=est*GA_RES[w.res].f, ok_=hammer>=rv&&hammer>0;
    const steps=rint(5,9), top= ok_? hammer : Math.max(est*.4, Math.min(hammer, rv*.95)), bids=[];
    for(let k=1;k<=steps;k++) bids.push({p:Math.round((est*.45+(top-est*.45)*Math.pow(k/steps,.8))/100)*100, w:(i===star&&k===steps)?'Un collectionneur fortuné':pick(gaBidders)});
    const r={h, n:w.n, ar:(w.o==='lux'||w.o==='coll')?'Votre collection':(gaArt(b,w.a)||{}).n, o:w.o, est, rv, hammer:ok_?hammer:0, top, sold:ok_, bids};
    if(ok_){ sold++; tot+=hammer; h+=clamp(.03+.25*(f/h-1),-.03,.08);
      if(w.o==='dep'){ const c=hammer*(GA_COM+GA_PRM); m.acc+=c; com+=c; if(hammer<est*.8) m.not=clamp(m.not-.5,0,100); }
      else if(w.o==='own'){ const c=hammer*(1+GA_PRM); m.acc+=c; com+=c; const a=gaArt(b,w.a); if(a&&a.em&&f>1.15) a.c=clamp(a.c*1.08,.1,8); }
      else { const c=hammer*.10; m.acc+=c; com+=c; const net=hammer*.95;
        if(w.o==='lux'){ const o=S.lux.find(x=>x.id===w.lid); payCap('lux','Vente en galerie : '+w.n,net); if(o) S.tb.cap+=net-o.paid; S.lux=S.lux.filter(x=>x.id!==w.lid); }
        else { const it=S.auc.coll.find(x=>x.id===w.lid); payCap('lux','Vente en galerie : '+w.n,net); if(it) S.tb.cap+=net-(it.paid||0); S.auc.coll=S.auc.coll.filter(x=>x.id!==w.lid); } }
      if(w.fk&&!w.ex&&w.o!=='lux'&&w.o!=='coll') m.fk.push({n:w.n, amt:hammer, d:S.day+rint(5,60)});
      m.st=m.st.filter(x=>x!==w);
    } else { h-=.05; if(w.o==='dep'){ m.st=m.st.filter(x=>x!==w); } }
    res.push(r); });
  const rate=lots.length? sold/lots.length : 0; m.not=clamp(m.not+(rate-.7)*6+(tot>mean*lots.length*1.1?1:0),0,100);
  m.whale=0; m.sale=null; m.idle=0;
  m.last={d:S.day, lots:res, sold, n:lots.length, tot, com, auto:!!auto};
  metLog(b,'vente '+(auto?'tenue par l’équipe':'terminée')+' : '+sold+' lots adjugés sur '+lots.length+', '+eur(tot,0)+' au marteau, '+eur(com,0)+' pour la galerie.',rate>=.7?'good':rate<.4?'bad':'');
  return ok(auto? sold+' lots adjugés sur '+lots.length+'.' : ''); }
function gaBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; if(k==='fair') m.fairNext=S.day+30; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function gaWork(b,id){ return b.m.st.find(w=>w.id===+id)||b.m.off.find(w=>w.id===+id); }
/* œuvres du joueur (onglet Luxe) qui peuvent être confiées */
function gaLuxFree(){ const inG=new Set(); S.biz.forEach(x=>{ if(x.def==='gallery'&&x.m&&x.m.st) x.m.st.forEach(w=>{ if(w.o==='lux'||w.o==='coll') inG.add(w.o+':'+w.lid); }); });
  const L=S.lux.filter(o=>{ const l=D.LUX.find(x=>x.id===o.id); return l&&l.kind==='art'&&!inG.has('lux:'+o.id)&&!o.rent; }).map(o=>({o:'lux', lid:o.id, n:D.LUX.find(x=>x.id===o.id).n}));
  const C=(S.auc&&S.auc.coll||[]).filter(it=>it.cat==='art'&&!inG.has('coll:'+it.id)).map(it=>({o:'coll', lid:it.id, n:it.n}));
  return L.concat(C); }
MET.gallery = {
  fam:'lux', core:true, init:gaInit,
  ranks:[
    {n:'Artistes émergents', d:'Repérez de jeunes artistes et achetez leurs œuvres en atelier avant que leur cote monte.'},
    {n:'Ventes internationales', d:'Des œuvres plus chères en dépôt, des acheteurs du monde entier, des ventes de 10 lots.'},
    {n:'Foire d’art', d:'Tous les 90 jours, votre foire : stands loués, dépôts de qualité, grands collectionneurs.'},
    {n:'Laboratoire d’expertise', d:'Chaque œuvre est expertisée gratuitement à son arrivée : plus aucun faux.'},
    {n:'Musée privé', d:'Six salles d’exposition en plus, deux fois plus de visiteurs.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b), ex=m.st.filter(w=>w.exp);
    const lp=ex.filter(w=>w.o==='lux').reduce((a,w)=>{ const l=D.LUX.find(x=>x.id===w.lid); return a+(l?l.pr:0); },0);
    const vis=R0*(.14+.035*ex.length+Math.min(.4,lp*.003))*(.7+m.not/100)*(m.mus?2:1)*weFactor(b);
    return {vol:0, cogs:0, rev:m.pend+vis, fixed:m.pendC+(m.mus?R0*.15:0)+(m.intl?R0*.04:0)};
  },
  daily(b,ctx){ const m=b.m, R0=metR0(b);
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    /* œuvres du joueur vendues ou louées ailleurs entre-temps */
    m.st=m.st.filter(w=> w.o==='lux'? S.lux.some(o=>o.id===w.lid&&!o.rent) : w.o==='coll'? !!(S.auc&&S.auc.coll.some(it=>it.id===w.lid)) : true);
    if(m.sale) m.sale.lots=m.sale.lots.filter(id=>m.st.some(w=>w.id===id)); m.cat=m.cat.filter(id=>m.st.some(w=>w.id===id));
    /* cotes des artistes */
    if(S.day%30===0) m.art.forEach(a=>{ a.p=a.c; });
    m.art.forEach(a=>{ const shown=m.st.some(w=>w.exp&&w.a===a.id&&(w.o==='dep'||w.o==='own'));
      a.c=clamp(a.c*Math.exp((a.em?a.t:0)+a.vol*norm()+(shown?(a.em?.0008:.0003):0)-(a.em?0:(a.c-1.1)*.002)),.1,a.em?4:3); });
    if(rnd()<.0007){ const L=m.art.filter(a=>!a.dead&&m.st.some(w=>w.a===a.id&&w.o!=='lux'&&w.o!=='coll')); if(L.length){ const a=pick(L); a.dead=1; a.c*=2.5; m.atl=m.atl.filter(x=>x.a!==a.id); metLog(b,a.n+' vient de mourir : sa cote s’envole (×2,5).','good'); } }
    /* exposition : la cote des œuvres exposées monte */
    m.st.forEach(w=>{ if(w.exp) w.gk=Math.min(w.o==='lux'||w.o==='coll'?1.10:1.2, w.gk+(w.o==='lux'||w.o==='coll'?.0004:.0009)); });
    /* propositions de dépôt */
    if(rnd()<(.14+m.not/600)*(dlMode(b)==='me'?1:1.35)) gaOffer(b);
    m.not=clamp(m.not-(m.not-40)*.003,0,100);
    m.off=m.off.filter(w=>{ if(S.day>w.until) return false;
      if(dlMode(b)==='me'&&S.day-w.d>=4&&m.st.length<gaCap(b)){ m.st.push(Object.assign(w,{d:S.day})); return false; } return true; });
    /* collectionneur fortuné */
    if(!m.whale&&rnd()<.004){ m.whale=1; metLog(b,'un collectionneur fortuné est en ville : il viendra à votre prochaine vente.','good'); }
    /* faux vendus découverts */
    m.fk=m.fk.filter(f=>{ if(S.day<f.d) return true; if(rnd()<.5){ m.accC+=f.amt*(GA_COM+GA_PRM)+R0*3; m.not=clamp(m.not-8,0,100); S.rep=clamp(S.rep-2,0,100); metLog(b,'« '+f.n+' », vendu par la galerie, est un faux : remboursement et dédommagement ('+eur(f.amt*(GA_COM+GA_PRM)+R0*3,0)+').','bad'); } return false; });
    /* foire d'art */
    if(m.fair&&S.day>=m.fairNext){ m.fairNext=S.day+90; const g=R0*10*(.5+m.not/100); m.acc+=g; for(let i=0;i<3;i++){ gaOffer(b); const w=m.off[m.off.length-1]; if(w) w.e0*=1.6; } if(rnd()<.5) m.whale=1;
      metLog(b,'votre foire d’art a eu lieu : '+eur(g,0)+' de stands, trois dépôts de qualité proposés.','good'); }
    /* ateliers des artistes émergents */
    if(mxHas(b,1)) m.art.filter(a=>a.em&&!a.dead).forEach(a=>{ if(m.atl.filter(x=>x.a===a.id).length<2&&rnd()<.03) m.atl.push({id:m.nid++, a:a.id, n:gaTitle(b), e0:R0*4}); });
    /* vente prête : tenue automatiquement si personne ne la lance */
    if(m.sale&&S.day>=m.sale.ready+(dlMode(b)==='me'?2:0)) gaRun(b,true);
    /* sans vente depuis longtemps, l'équipe en organise une */
    m.idle=(m.idle||0)+1;
    if(!m.sale&&dlMode(b)==='me'&&m.idle>=25&&m.st.length>=3){ m.cat=m.st.filter(w=>w.o==='dep').slice(0,gaMaxLots(b)).map(w=>w.id); if(m.cat.length>=3&&gaPrep(b).ok) metLog(b,'faute de vente prévue, l’équipe prépare un catalogue avec les dépôts.',''); }
  },
  kpis(b){ const m=b.m, ex=m.st.filter(w=>w.exp).length, val=m.st.reduce((a,w)=>a+gaEst(b,w),0), L=m.last;
    return [['Prochaine vente', m.sale? (S.day>=m.sale.ready?'Prête':'Dans '+(m.sale.ready-S.day)+' j') : 'Aucune', m.sale? m.sale.lots.length+' lots au catalogue' : m.cat.length+' lots choisis'],
            ['Réserve', m.st.length+' œuvres', eur(val,0)+' d’estimation · '+ex+' / '+gaSlots(b)+' exposées'],
            ['Dernière vente', L? L.sold+' / '+L.n+' adjugés' : '—', L? eur(L.com,0)+' pour la galerie' : 'Pas encore de vente'],
            ['Notoriété', Math.round(m.not)+' / 100', m.whale? 'Un collectionneur fortuné attend votre vente' : m.off.length+' proposition'+(m.off.length>1?'s':'')+' de dépôt']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    if(mxHas(b,2)) out.push(m.intl? {k:'buy', act:'intl', label:'Ventes internationales', owned:true, sub:'Dépôts plus chers, acheteurs du monde entier.'} : {k:'buy', act:'intl', label:'Ouvrir les ventes à l’international', cost:d.cost*2, sub:'Dépôts 80 % plus chers, salle plus animée, 10 lots par vente.'});
    if(mxHas(b,3)) out.push(m.fair? {k:'buy', act:'fair', label:'Foire d’art', owned:true, sub:'Prochaine foire dans '+Math.max(0,m.fairNext-S.day)+' jours.'} : {k:'buy', act:'fair', label:'Créer votre foire d’art', cost:d.cost*3, sub:'Tous les 90 jours : stands loués, dépôts de qualité, grands collectionneurs.'});
    if(mxHas(b,4)) out.push(m.lab? {k:'buy', act:'lab', label:'Laboratoire d’expertise', owned:true, sub:'Chaque œuvre est expertisée à son arrivée.'} : {k:'buy', act:'lab', label:'Ouvrir un laboratoire d’expertise', cost:d.cost*2, sub:'Expertise gratuite et automatique : plus aucun faux.'});
    if(mxHas(b,5)) out.push(m.mus? {k:'buy', act:'mus', label:'Musée privé', owned:true, sub:'Six salles en plus, deux fois plus de visiteurs.'} : {k:'buy', act:'mus', label:'Ouvrir un musée privé', cost:d.cost*6, sub:'Six salles d’exposition en plus, visiteurs ×2.'});
    return out;
  },
  acts:{
    acc:(b,id)=>{ const m=b.m, w=m.off.find(x=>x.id===+id); if(!w) return err('Proposition expirée.'); if(m.st.length>=gaCap(b)) return err('Réserve pleine ('+gaCap(b)+' œuvres).'); m.off=m.off.filter(x=>x!==w); w.d=S.day; m.st.push(w); return ok('« '+w.n+' » entre en réserve.'); },
    dec:(b,id)=>{ const m=b.m; m.off=m.off.filter(x=>x.id!==+id); return ok(''); },
    exp:(b,id)=>{ const m=b.m, w=gaWork(b,id); if(!w) return err('Œuvre introuvable.'); if(w.ex) return err('Déjà expertisée.'); if(w.o==='lux'||w.o==='coll') return err('Votre œuvre est authentique.');
      const c=metR0(b)*.25; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.accC+=c; w.ex=1;
      if(w.fk){ const inOff=m.off.includes(w); m.off=m.off.filter(x=>x!==w); m.st=m.st.filter(x=>x!==w); gaRmRef(b,w.id); if(m.sale) m.sale.lots=m.sale.lots.filter(x=>x!==w.id);
        if(w.o==='own') metLog(b,'« '+w.n+' » est un faux : l’œuvre achetée ne vaut plus rien.','bad'); else metLog(b,'expertise : « '+w.n+' » est un faux, il est écarté.','warn'); return ok('C’est un faux : '+(inOff?'proposition refusée.':'œuvre retirée.')); }
      return ok('Authentique.'); },
    show:(b,id)=>{ const m=b.m, w=m.st.find(x=>x.id===+id); if(!w) return err('Œuvre introuvable.'); if(!w.exp&&m.st.filter(x=>x.exp).length>=gaSlots(b)) return err('Toutes les salles sont occupées ('+gaSlots(b)+').'); w.exp=w.exp?0:1; return ok(''); },
    res:(b,arg)=>{ const [id,v]=String(arg).split(':'), w=b.m.st.find(x=>x.id===+id); if(!w||!GA_RES[v]) return err('Réglage inconnu.'); w.res=v; return ok(''); },
    cat:(b,id)=>{ const m=b.m, w=m.st.find(x=>x.id===+id); if(!w) return err('Œuvre introuvable.'); if(m.sale&&m.sale.lots.includes(w.id)) return err('Déjà dans la vente en préparation.');
      if(m.cat.includes(w.id)){ m.cat=m.cat.filter(x=>x!==w.id); return ok(''); } if(m.cat.length>=gaMaxLots(b)) return err(gaMaxLots(b)+' lots au plus par vente.'); m.cat.push(w.id); return ok(''); },
    up:(b,id)=>{ const m=b.m, i=m.cat.indexOf(+id); if(i>0){ [m.cat[i-1],m.cat[i]]=[m.cat[i],m.cat[i-1]]; } return ok(''); },
    prep:(b)=>gaPrep(b),
    live:(b)=>gaRun(b,false),
    lux:(b,arg)=>{ const m=b.m, [o,lid]=String(arg).split(':'); const L=gaLuxFree().find(x=>x.o===o&&String(x.lid)===lid); if(!L) return err('Œuvre indisponible.'); if(m.st.length>=gaCap(b)) return err('Réserve pleine ('+gaCap(b)+' œuvres).');
      m.st.push({id:m.nid++, n:L.n, o:L.o, lid:L.o==='lux'?L.lid:+L.lid, e0:0, fk:0, ex:1, gk:1, res:'h', d:S.day, exp:m.st.filter(x=>x.exp).length<gaSlots(b)?1:0}); return ok('« '+L.n+' » est confiée à la galerie.'); },
    back:(b,id)=>{ const m=b.m, w=m.st.find(x=>x.id===+id); if(!w||(w.o!=='lux'&&w.o!=='coll')) return err('Seules vos œuvres peuvent être reprises.'); if(m.sale&&m.sale.lots.includes(w.id)) return err('L’œuvre est au catalogue de la vente.'); m.st=m.st.filter(x=>x!==w); gaRmRef(b,w.id); return ok('Œuvre reprise.'); },
    scout:(b)=>{ const m=b.m; if(!mxHas(b,1)) return err('Palier 1 requis.'); if(m.art.filter(a=>a.em&&!a.dead).length>=4) return err('Vous suivez déjà quatre artistes émergents.');
      const c=metR0(b)*1.5; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.accC+=c;
      const used=new Set(m.art.map(a=>a.n)), n=GA_ARTN.find(x=>!used.has(x))||('Artiste '+m.nid);
      const a={id:m.art.length?Math.max(...m.art.map(x=>x.id))+1:0, n, c:.3+.3*rnd(), t:.0006+.001*norm(), vol:.012, em:1, dead:0}; m.art.push(a);
      for(let i=0;i<2;i++) m.atl.push({id:m.nid++, a:a.id, n:gaTitle(b), e0:metR0(b)*4});
      metLog(b,'vous repérez '+a.n+', artiste émergent.',''); return ok('Nouvel artiste : '+a.n+'.'); },
    buyw:(b,id)=>{ const m=b.m, x=m.atl.find(y=>y.id===+id); if(!x) return err('Œuvre déjà vendue.'); if(m.st.length>=gaCap(b)) return err('Réserve pleine ('+gaCap(b)+' œuvres).');
      const a=gaArt(b,x.a), p=x.e0*(a?a.c:1)*.7; if(availFor(cityOf(b).ccy)<p) return err('Trésorerie insuffisante : '+eur(p,0)+'.'); m.accC+=p; m.atl=m.atl.filter(y=>y!==x);
      m.st.push({id:x.id, n:x.n, a:x.a, e0:x.e0, o:'own', fk:rnd()<.03?1:0, ex:m.lab?1:0, gk:1, res:'m', d:S.day, paid:p}); if(m.lab&&m.st[m.st.length-1].fk){ m.st.pop(); metLog(b,'le laboratoire signale un faux : le vendeur rembourse.',''); m.accC-=p; }
      return ok('Achat en atelier : '+eur(p,0)+'.'); },
    intl:(b)=>gaBuy(b,'intl',2,'Ventes internationales',2),
    fair:(b)=>gaBuy(b,'fair',3,'Foire d’art',3),
    lab:(b)=>gaBuy(b,'lab',2,'Laboratoire d’expertise',4),
    mus:(b)=>gaBuy(b,'mus',6,'Musée privé',5)
  },
  auto: gaAuto
};
/* le commissaire-priseur organise les ventes ; il n'achète rien sans budget accordé */
function gaAuto(b,mode,q){ const m=b.m, R0=metR0(b);
  /* dépôts : il accepte les meilleurs et fait expertiser */
  m.off.slice().sort((x,y)=>gaEst(b,y)-gaEst(b,x)).forEach(w=>{ if(m.st.length>=gaCap(b)) return; if(!m.lab&&!w.ex&&rnd()<.4+.6*q){ if(!MET.gallery.acts.exp(b,w.id).ok) return; if(!m.off.includes(w)) return; } MET.gallery.acts.acc(b,w.id); });
  /* exposition : les plus belles œuvres, hors vente */
  const sl=gaSlots(b); m.st.forEach(w=>{ if(w.o==='dep') w.exp=0; });
  m.st.filter(w=>w.o!=='dep'||true).sort((x,y)=>((y.o==='lux'||y.o==='coll'||y.o==='own')-(x.o==='lux'||x.o==='coll'||x.o==='own'))||gaEst(b,y)-gaEst(b,x)).forEach(w=>{ if(m.st.filter(x=>x.exp).length<sl&&!w.exp) w.exp=1; });
  /* vente : au moins 5 lots, ordre croissant puis la pièce maîtresse aux deux tiers */
  if(!m.sale){ const dep=m.st.filter(w=>w.o==='dep'||(w.o==='own'&&(gaEst(b,w)>(w.paid||0)*1.4||S.day-w.d>180))), old=dep.some(w=>S.day-w.d>30);
    if(dep.length>=5||(old&&dep.length>=3)){ let L=dep.sort((x,y)=>gaEst(b,x)-gaEst(b,y)).slice(-gaMaxLots(b)); if(rnd()<q){ const top=L.pop(); L.splice(Math.floor(L.length*.67),0,top); }
      L.forEach(w=>{ w.res= rnd()<q? 'm' : pick(['b','h']); }); m.cat=L.map(w=>w.id); gaPrep(b); } }
  if(mode==='full'){
    if(mxHas(b,1)&&S.day%20===0){ if(m.art.filter(a=>a.em&&!a.dead).length<3&&dlBudget(b)>R0*6) { const c=R0*1.5; if(dlBudget(b)>=c){ b.dlp-=c; MET.gallery.acts.scout(b); } }
      m.atl.slice().forEach(x=>{ const a=gaArt(b,x.a), p=x.e0*(a?a.c:1)*.7; if(a&&a.t>0&&rnd()<q&&m.st.length<gaCap(b)-2&&dlCan(b,p,'Achat d’une œuvre')){ if(MET.gallery.acts.buyw(b,x.id).ok) b.dlp-=p; } }); }
    if(S.day%30===0) for(const [k,f,l,rk] of [['intl',2,'Ventes internationales',2],['fair',3,'Foire d’art',3],['lab',2,'Laboratoire d’expertise',4],['mus',6,'Musée privé',5]]) if(!m[k]&&mxHas(b,rk)&&gaBuy(b,k,f,l,rk,true).ok) break;
  }
}

