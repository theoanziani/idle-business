/* ============================================================
   BOUTIQUE E-COMMERCE : l'entonnoir de vente
   Visites, puis paniers, puis commandes. On choisit où dépenser la publicité (réseaux sociaux,
   moteur de recherche, influenceurs), chaque canal ayant son coût par visite et sa conversion.
   Systèmes : catalogue de produits aux tendances qui montent et retombent ; stock propre (meilleure
   marge, risque d'invendus) ou expédition directe par le fournisseur ; retours et avis.
   Événements : produit qui devient viral, soldes, retard d'un transporteur.
   Paliers : livraison express, abonnement fidélité, vente à l'étranger, marque propre, place de marché.
   État b.m (v:1) : cat[] {id, mode, mk, st}, tr{} (tendances), ch{soc,sea,inf} (budgets 0-3), note,
   aord, exp, fid, intl, own, mkt, ord[], stats (dernier jour), ev, pend, pendC, log.
   ============================================================ */
const EC_PROD = [
  {id:'ecou', n:'Écouteurs sans fil', c:32},{id:'coque', n:'Coques de téléphone', c:7},{id:'lampe', n:'Lampes LED design', c:22},
  {id:'gourde', n:'Gourdes isothermes', c:13},{id:'montre', n:'Montres connectées', c:50},{id:'yoga', n:'Tapis de yoga', c:18},
  {id:'sac', n:'Sacs à dos urbains', c:29},{id:'encei', n:'Enceintes portables', c:40},{id:'diff', n:'Diffuseurs d’arômes', c:16},
  {id:'jeu', n:'Jeux de société', c:25},{id:'plaid', n:'Plaids en polaire', c:20},{id:'proj', n:'Mini-projecteurs', c:63}
];
const EC_CH = {soc:{n:'Réseaux sociaux', cpc:.35, cv:1, tr:1.4}, sea:{n:'Moteur de recherche', cpc:.8, cv:1.6, tr:.8}, inf:{n:'Influenceurs', cpc:1.1, cv:.9, tr:1.8}};
const EC_BUD = [0,.1,.25,.5];
const ecP = id => EC_PROD.find(x=>x.id===id);
const ecK = b => metR0(b)/476;
function ecSlots(b){ return 4+(mxHas(b,2)?1:0)+(mxHas(b,4)?1:0); }
function ecInit(b){ const tr={}; EC_PROD.forEach(p=>{ tr[p.id]={v:clamp(Math.exp(.4*norm()),.4,2.2), d:.01*norm(), vir:0}; });
  b.stock=0; b.auto=false;
  return {v:1, cat:[{id:'ecou',mode:'stock',mk:1.8,st:40},{id:'coque',mode:'drop',mk:2.5,st:0},{id:'gourde',mode:'stock',mk:1.8,st:40},{id:'lampe',mode:'stock',mk:1.8,st:40}], tr, ch:{soc:0,sea:0,inf:0}, note:4.2, aord:1, exp:0, fid:0, intl:0, own:0, mkt:0, ord:[], stats:null, ev:null, pend:0, pendC:0, log:[]}; }
const ecPrice = (b,it) => ecP(it.id).c*it.mk*(b.m.own?1.15:1);
function ecTrendTick(m){ EC_PROD.forEach(p=>{ const t=m.tr[p.id]; t.d=clamp(t.d*.97+.006*norm(),-.04,.04); t.v=clamp(t.v*Math.exp(t.d),.2,3); if(t.vir>0) t.vir--; if(t.v<.25&&t.d<0) t.d=.02; }); }
const ecTr = (m,id) => m.tr[id].v*(m.tr[id].vir>0?2.2:1);
/* une journée de l'entonnoir (sans hasard si sim=true, pour les prévisions) */
function ecDay(b,sim){ const m=b.m, k=ecK(b), R0=metR0(b);
  const sale=m.ev&&m.ev.k==='soldes'&&m.ev.until>=S.day, late=m.ev&&m.ev.k==='retard'&&m.ev.until>=S.day;
  const sat=(typeof BAL_DEM!=='undefined'&&BAL_DEM.includes('ecom'))? (b.satF||1) : 1;   /* V2.2.4 : la saturation agit sur la demande */
  let vis={org:sat*1020*k*/* V1.5.6 : +20 % de visiteurs naturels */(.5+.25*m.note)*(m.fid?1.25:1)*(m.intl?1.6:1)*(m.mkt?1.3:1)};
  Object.keys(EC_CH).forEach(c=>{ vis[c]=sat*R0*EC_BUD[m.ch[c]]/EC_CH[c].cpc*(m.intl?1.2:1); });
  const tot=Object.values(vis).reduce((a,x)=>a+x,0);
  const L=m.cat.map(it=>{ const p=ecP(it.id); return {it, p, w:ecTr(m,it.id)}; }), wsum=L.reduce((a,x)=>a+x.w,0)||1;
  let rev=0, cost=0, carts=0, orders=0, ret=0, lost=0, gc=0;
  L.forEach(x=>{ let v=0, cvW=0; Object.keys(vis).forEach(c=>{ const aff=c==='org'?1:EC_CH[c].tr; const vi=vis[c]*x.w*aff/wsum; v+=vi; cvW+=vi*(c==='org'?1.1:EC_CH[c].cv); });
    const cv=v? cvW/v : 1, mk=x.it.mk*(sale?.85:1);
    const cr=.06*Math.pow(1.6/mk,2)*(x.it.mode==='drop'?.85:1)*cv, ab=m.exp? .6 : .7;
    const c0=v*cr; let o=c0*(1-ab)*(sale?1.6:1); carts+=c0;
    if(x.it.mode==='stock'){ if(o>x.it.st){ lost+=o-x.it.st; o=x.it.st; } if(!sim) x.it.st-=o; }
    const price=ecPrice(b,x.it)*(sale?.85:1), rr=(x.it.mode==='drop'?.12:.08)*(late?1.4:1);
    orders+=o; ret+=o*rr; if(x.it.mode==='stock') gc+=o*x.p.c; rev+=o*price*(1-rr); cost+= x.it.mode==='drop'? o*x.p.c*1.25 : 0; cost+=o*(m.exp?2.5:1.5);
  });
  const ads=R0*(EC_BUD[m.ch.soc]+EC_BUD[m.ch.sea]+EC_BUD[m.ch.inf]);
  return {vis:tot, carts, orders, ret, rev, cost, ads, lost, gc};
}
MET.ecom = {
  fam:'com', core:true, init:ecInit,
  ranks:[
    {n:'Livraison express', d:'Livraison en 24 heures : moins de paniers abandonnés, un peu plus cher à expédier.'},
    {n:'Abonnement fidélité', d:'Vos clients reviennent : +25 % de visites naturelles et un produit de plus au catalogue.'},
    {n:'Vente à l’étranger', d:'Ouvrez la boutique à l’international : +60 % de visites naturelles.'},
    {n:'Marque propre', d:'Vos produits sous votre marque : prix 15 % plus hauts et un produit de plus au catalogue.'},
    {n:'Place de marché', d:'D’autres vendeurs proposent leurs produits chez vous : commissions chaque jour et plus de visites.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b); return {vol:0, cogs:0, rev:m.pend+(m.mkt?R0*.15*(.5+.25*m.note):0), fixed:m.pendC}; },
  daily(b,ctx){ const m=b.m;
    if(ctx.open){ m.pend=0; m.pendC=0; }
    ecTrendTick(m);
    m.ord=m.ord.filter(o=>{ if(S.day>=o.d){ const it=m.cat.find(x=>x.id===o.id); if(it) it.st+=o.n; return false; } return true; });
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    const d=ecDay(b,false); m.stats=d;
    /* le stock est payé à la commande (trésorerie) et compté en charge au fil des ventes : plus de grosse perte le jour d'un réassort */
    m.pend+=d.rev; m.pendC+=d.cost+d.ads+d.gc;
    /* avis */
    const tgt=4.4-(m.cat.some(x=>x.mode==='drop')?.25:0)-d.ret/Math.max(1,d.orders)*3-(d.lost>d.orders*.2?.5:0)-(m.ev&&m.ev.k==='retard'?.6:0)+(m.exp?.2:0);
    m.note=clamp(m.note+(tgt-m.note)*.03,1,5);
    /* réassort automatique */
    if(m.aord) m.cat.forEach(it=>{ if(it.mode!=='stock') return; const pend=m.ord.filter(o=>o.id===it.id).reduce((a,o)=>a+o.n,0), rate=d.orders/Math.max(1,m.cat.length)*ecTr(m,it.id);
      if(it.st+pend<rate*6+5) ecOrder(b,it.id,Math.ceil(rate*10/10)*10+10); });
    /* événements */
    if(!m.ev){ const r=rnd();
      if(r<.006&&m.cat.length){ const it=pick(m.cat); m.tr[it.id].vir=7; metLog(b,'« '+ecP(it.id).n+' » devient viral sur les réseaux : ventes ×2 pendant une semaine.','good'); }
      else if(r<.01){ m.ev={k:'soldes', until:S.day+6}; metLog(b,'période de soldes : prix −15 %, beaucoup plus de commandes pendant 7 jours.',''); }
      else if(r<.013){ m.ev={k:'retard', until:S.day+5}; metLog(b,'retard chez le transporteur : clients mécontents et plus de retours.','bad'); } }
  },
  kpis(b){ const m=b.m, d=m.stats||ecDay(b,true), cv=d.vis? d.orders/d.vis : 0;
    return [['Visites / jour', fmtN(Math.round(d.vis)), fmtN(Math.round(d.carts))+' paniers'],
            ['Commandes / jour', fmtN(Math.round(d.orders)), 'Conversion '+(cv*100).toFixed(1).replace('.',NDEC)+' %'],
            ['Avis', m.note.toFixed(1).replace('.',NDEC)+' / 5', fmtN(Math.round(d.ret))+' retours / jour'],
            ['Publicité', eur(d.ads,0)+' / j', d.ads? 'Coût par commande : '+eur(d.ads/Math.max(1,d.orders),1) : 'Visites naturelles seulement']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    Object.keys(EC_CH).forEach(c=>{ const C=EC_CH[c]; out.push({k:'seg', act:'ch', label:'Publicité : '+C.n.toLowerCase(), val:c+':'+m.ch[c], opts:EC_BUD.map((x,i)=>[c+':'+i, i?eur(R0*x,0)+' / j':'Aucune']), sub:'Coût par visite environ '+eur(C.cpc,2)+'. '+(c==='sea'?'Visiteurs qui cherchent déjà à acheter : bonne conversion.':c==='soc'?'Surtout des curieux, attirés par les produits tendance.':'Gros volumes, et parfois un produit qui devient viral.')}); });
    out.push({k:'tog', act:'aord', label:'Réassort automatique', val:m.aord, sub:'Recommande les produits en stock propre avant la rupture. Livraison en 3 jours.'});
    if(mxHas(b,1)) out.push(m.exp? {k:'buy', act:'exp', label:'Livraison express', owned:true, sub:'Moins de paniers abandonnés.'} : {k:'buy', act:'exp', label:'Livraison express', cost:d.cost*1.5, sub:'Paniers abandonnés : 60 % au lieu de 70 %. Expédition un peu plus chère.'});
    if(mxHas(b,2)) out.push(m.fid? {k:'buy', act:'fid', label:'Abonnement fidélité', owned:true, sub:'+25 % de visites naturelles.'} : {k:'buy', act:'fid', label:'Abonnement fidélité', cost:d.cost*2.5, sub:'+25 % de visites naturelles, un produit de plus au catalogue.'});
    if(mxHas(b,3)) out.push(m.intl? {k:'buy', act:'intl', label:'Vente à l’étranger', owned:true, sub:'+60 % de visites naturelles.'} : {k:'buy', act:'intl', label:'Vendre à l’étranger', cost:d.cost*5, sub:'+60 % de visites naturelles, publicité plus efficace.'});
    if(mxHas(b,4)) out.push(m.own? {k:'buy', act:'own', label:'Marque propre', owned:true, sub:'Prix +15 %.'} : {k:'buy', act:'own', label:'Lancer votre marque', cost:d.cost*8, sub:'Prix 15 % plus hauts, un produit de plus au catalogue.'});
    if(mxHas(b,5)) out.push(m.mkt? {k:'buy', act:'mkt', label:'Place de marché', owned:true, sub:'Commissions chaque jour.'} : {k:'buy', act:'mkt', label:'Ouvrir une place de marché', cost:d.cost*15, sub:'D’autres vendeurs chez vous : environ '+eur(R0*.15,0)+' de commissions par jour et +30 % de visites.'});
    return out;
  },
  acts:{
    ch:(b,arg)=>{ const [c,v]=String(arg).split(':'); if(!EC_CH[c]) return err(''); b.m.ch[c]=clamp(+v|0,0,3); return ok(''); },
    aord:(b,v)=>{ b.m.aord=+v?1:0; return ok(''); },
    add:(b,id)=>{ const m=b.m; if(!ecP(id)) return err('Produit inconnu.'); if(m.cat.some(x=>x.id===id)) return err('Déjà au catalogue.'); if(m.cat.length>=ecSlots(b)) return err('Catalogue plein : '+ecSlots(b)+' produits au maximum.');
      m.cat.push({id, mode:'drop', mk:2, st:0}); return ok('« '+ecP(id).n+' » ajouté en expédition directe.'); },
    rm:(b,id)=>{ const m=b.m, it=m.cat.find(x=>x.id===id); if(!it) return err(''); if(it.st>0){ m.pend+=it.st*ecP(id).c*.5; } m.cat=m.cat.filter(x=>x!==it); return ok('Produit retiré'+(it.st>0?' : le stock est bradé à moitié prix.':'.')); },
    mode:(b,id)=>{ const it=b.m.cat.find(x=>x.id===id); if(!it) return err(''); if(it.mode==='stock'&&(it.st>=1||b.m.ord.some(o=>o.id===id))) return err('Écoulez d’abord le stock de ce produit.'); it.mode= it.mode==='stock'? 'drop' : 'stock'; return ok(it.mode==='stock'?'Stock propre : commandez des unités.':'Expédition directe par le fournisseur.'); },
    mk:(b,arg)=>{ const [id,dv]=String(arg).split(':'), it=b.m.cat.find(x=>x.id===id); if(!it) return err(''); it.mk=clamp(Math.round((it.mk+(+dv||0))*10)/10,1.1,3.5); return ok(''); },
    ord:(b,id)=>ecOrder(b,id,50),
    exp:(b)=>ecBuy(b,'exp',1.5,'Livraison express',1),
    fid:(b)=>ecBuy(b,'fid',2.5,'Abonnement fidélité',2),
    intl:(b)=>ecBuy(b,'intl',5,'Vente à l’étranger',3),
    own:(b)=>ecBuy(b,'own',8,'Marque propre',4),
    mkt:(b)=>ecBuy(b,'mkt',15,'Place de marché',5)
  },
  auto: ecAuto
};
function ecBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function ecOrder(b,id,n){ const m=b.m, it=m.cat.find(x=>x.id===id); if(!it) return err('Produit absent du catalogue.'); if(it.mode!=='stock') return err('Ce produit est en expédition directe.');
  const c=ecP(id).c*n; if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); payCap('b:'+b.id,'Achat de stock : '+b.name,-c); settleAccounts(); m.ord.push({id, n, d:S.day+3}); return ok(n+' unités commandées.'); }
/* le responsable marketing répartit le budget publicitaire */
function ecAuto(b,mode,q){ const m=b.m; m.aord=1;
  if(S.day%7===0){
    /* garde le budget le plus rentable */
    let best=m.ch, bv=-1e18; const save=Object.assign({},m.ch);
    for(const s of [0,1,2]) for(const e of [0,1,2]) for(const f of [0,1]){ m.ch={soc:s,sea:e,inf:f}; const d=ecDay(b,true), v=d.rev-d.cost-d.ads-d.gc; if(v>bv){ bv=v; best=Object.assign({},m.ch); } }
    m.ch= rnd()<(1-q)*.3? save : best;
    /* prix : marge proche de l'optimum */
    m.cat.forEach(it=>{ it.mk=clamp(Math.round((1.7+(it.mode==='drop'?.3:0)+(1-q)*.4*(rnd()-.5))*10)/10,1.2,3); });
  }
  if(mode!=='full') return;
  if(S.day%14===0){
    /* remplace le produit le moins tendance par le plus tendance */
    const out=EC_PROD.filter(p=>!m.cat.some(x=>x.id===p.id)).sort((a,c)=>ecTr(m,c.id)-ecTr(m,a.id))[0];
    if(m.cat.length<ecSlots(b)&&out) m.cat.push({id:out.id, mode:'stock', mk:1.7, st:0});
    else { const worst=m.cat.slice().sort((a,c)=>ecTr(m,a.id)-ecTr(m,c.id))[0]; if(out&&worst&&ecTr(m,out.id)>ecTr(m,worst.id)*1.6){ MET.ecom.acts.rm(b,worst.id); m.cat.push({id:out.id, mode:'stock', mk:1.7, st:0}); } }
    for(const [k,f,l,rk] of [['exp',1.5,'Livraison express',1],['fid',2.5,'Abonnement fidélité',2],['intl',5,'Vente à l’étranger',3],['own',8,'Marque propre',4],['mkt',15,'Place de marché',5]]) if(!m[k]&&mxHas(b,rk)&&ecBuy(b,k,f,l,rk,true).ok) break;
  }
}

