/* ============================================================
   GESTION DE COMMERCE : fatigue, satisfaction, approvisionnement, locaux, service RH
   ============================================================ */
const STKN=['3 jours','7 jours','14 jours'], STKD=[3,7,14];
const HR={names:['Aucun','Assistant RH','Département RH','Direction RH'], desc:['','Pourvoit seul, chaque jour, tous les postes vacants dès qu’un candidat de l’agence respecte vos critères.','Comme l’assistant, et réduit la fatigue et améliore la fidélité.','Recrutement rapide, équipes bien suivies, fatigue très réduite.'],
  cost:[0,9000,70000,450000], tier:[0,1,2,3], day:[0,70,250,800], fill:[0,2,4,7], loy:[0,2,4,6], fat:[1,.85,.7,.55]};
/* Calibrage : à réglages standard, chaque activité rapporte la cible prévue (coût / amortissement) à Paris */
D.CAL={};
const hrLvl = () => (S.hr&&S.hr.lvl)||0;
const fatOf = b => b.fat||0;
const fatF = b => 1-0.2*clamp((fatOf(b)-30)/70,0,1);
const stkOf = b => b.stk===undefined? 1 : b.stk;
/* Quatre critères de satisfaction des clients (0 à 1) et indice global */
function csCrit(b){
  const dd=distOf(b), sec=bizSec(b.def), aff=affOf(sec,cityOf(b),dd);
  const price=clamp(0.5-(b.price-1)*1.67,0,1);
  const service=clamp(staffFactor(b),0,1)*(1-fatOf(b)/200);
  const quality=clamp(0.4+0.22*pqOf(b)+(b.pol-1)*1.2,0,1);   /* la qualité ne dépend plus du stock */
  const addr=clamp(0.5+(aff-1)*3,0,1);
  return {price,service,quality,addr,idx:0.3*price+0.3*service+0.2*quality+0.2*addr};
}
const csOf = b => b.cs===undefined? 65 : b.cs;
const csMult = b => clamp(1+0.3*(csOf(b)/100-.65),.88,1.12);

/* ---------- Avis clients, étoiles et réputation /5 ---------- */
const RV_W=30;                                   /* fenêtre glissante de la note : 30 jours */
const starsOf = b => 1+4*csOf(b)/100;            /* note de la société, de 1 à 5 */
const repNote = r => clamp(1+4*r/100,1,5);       /* réputation générale ramenée sur 5 */
const fmtStar = v => v.toFixed(1).replace('.',NDEC);
const RV_CRIT=['price','service','quality','addr'], RV_WT=[.3,.3,.2,.2];
const RV_TXT={
  price:{lo:['Beaucoup trop cher pour ce que c’est.','Les prix sont abusifs, je ne reviendrai pas.','Rapport qualité-prix décevant.'], hi:['Des prix très corrects.','Franchement pas cher pour la qualité.','Bon rapport qualité-prix, je recommande.']},
  service:{lo:['Beaucoup trop d’attente, l’équipe est débordée.','Personnel épuisé et peu aimable.','On a attendu longtemps, ça manque de monde.'], hi:['Équipe souriante et efficace.','Service rapide, on se sent bien accueilli.','Un personnel au top, merci !']},
  quality:{lo:['La qualité a baissé, je suis déçu.','Produits moyens, on a vu mieux.','Ça manque de soin, dommage.'], hi:['Qualité irréprochable.','Des produits soignés, un vrai plaisir.','On sent le travail bien fait.']},
  addr:{lo:['L’emplacement est peu pratique.','Quartier peu passant, difficile à trouver.','Pas très bien situé, j’hésite à revenir.'], hi:['Très bien situé, facile d’accès.','Un emplacement idéal.','Adresse incontournable du quartier.']}
};
const RV_MID=['Correct, sans plus.','Rien d’exceptionnel mais ça fait le travail.','Moyen, peut mieux faire.','Pas mal, je reviendrai peut-être.'];
const RV_OUT=['Rupture de stock : impossible d’acheter ce que je voulais.','Rayons vides, très décevant.'];
function rvAvg(b,days){ const w=(b.rvw||[]).slice(-days); if(!w.length) return starsOf(b); return w.reduce((a,x)=>a+x.s,0)/w.length; }
function rvDaily(b){
  if(!b.rvw){ b.rvw=[]; b.rvl=[]; b.rv0=1+4*(b.cs===undefined?65:b.cs)/100; }
  const cr=csCrit(b), x=b.rvx||0, buzz=b.buzz>0?(b.buzzV||-0.7):0;
  const n=clamp(1+Math.round(Math.sqrt(Math.max(1,b.lvl||1))*1.5)+rint(0,2),2,9);
  let sum=0;
  for(let i=0;i<n;i++){
    let r=rnd(),k=0; while(k<3&&r>RV_WT[k]){ r-=RV_WT[k]; k++; }
    const mean=1+4*(0.5*cr[RV_CRIT[k]]+0.5*cr.idx)-x+buzz;
    const s=clamp(Math.round(mean+(rnd()+rnd()+rnd()-1.5)*1.6),1,5);
    sum+=s;
    if(i<2||s===1||s===5){
      const outRecent=(b.rvOut||-9)>=S.day-1 && s<=2;
      const t=outRecent&&rnd()<.5? pick(RV_OUT) : s<=2? pick(RV_TXT[RV_CRIT[k]].lo) : s>=4? pick(RV_TXT[RV_CRIT[k]].hi) : pick(RV_MID);
      if(b.rvl.length&&b.rvl[0].d===S.day&&b.rvl.filter(v=>v.d===S.day).length>=3&&s>1&&s<5) continue;
      b.rvl.unshift({d:S.day,s,t,k:RV_CRIT[k]});
    }
  }
  if(b.rvl.length>40) b.rvl.length=40;
  b.rvw.push({d:S.day,s:sum/n,n}); if(b.rvw.length>RV_W) b.rvw.shift();
  const avg=(b.rvw.reduce((a,v)=>a+v.s,0)+(RV_W-b.rvw.length)*b.rv0)/RV_W;
  b.cs=clamp((avg-1)*25,0,100);
  b.rvx=Math.abs(x)<.02? 0 : x*0.85;
  if(b.buzz>0) b.buzz--;
  /* événements liés aux avis */
  const a7=rvAvg(b,7), R0=bizBase(b).R0;
  if(b.rvw.length>=7&&!b.buzz){
    if(a7<=2.4&&rnd()<.05){ b.buzz=10; b.buzzV=-0.7; log('bad','Bad buzz : des avis très négatifs sur « '+b.name+' » circulent. Une réponse publique peut calmer la situation.'); }
    else if(a7>=4.4&&rnd()<.03){ b.buzz=10; b.buzzV=0.4; log('good','Un influenceur parle de « '+b.name+' » : les avis sont élogieux ces jours-ci.'); }
  }
  if(b.rvw.length>=14&&avg<=2.3&&rnd()<.012){
    const f=R0*2; pay('b:'+b.id,'Amende de l’inspection',-f); S.rep=clamp(S.rep-1,0,100);
    log('bad','Inspection chez « '+b.name+' » : mauvais avis répétés, amende de '+eur(f,0)+'.');
  }
}
function rvReply(b){
  if(b.status!=='active') return err('Disponible une fois la société ouverte.');
  if((b.rvAct||-99)>S.day-10) return err('Une réponse aux avis tous les 10 jours.');
  const c=bizBase(b).R0*3; if(!bizCanPay(b,c)) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('b:'+b.id,'Réponse aux avis clients',-c); b.rvAct=S.day;
  if(b.buzz>0&&(b.buzzV||0)<0){ b.buzz=0; b.rvx=(b.rvx||0)-0.2; return ok('Vous répondez publiquement : le bad buzz retombe.'); }
  b.rvx=clamp((b.rvx||0)-0.4,-1,1.6); return ok('Vous répondez aux clients : les prochains avis seront meilleurs.');
}
function rvPromo(b){
  if(b.status!=='active') return err('Disponible une fois la société ouverte.');
  if((b.rvPr||-99)>S.day-10) return err('Une promotion tous les 10 jours.');
  const c=bizBase(b).R0*2; if(!bizCanPay(b,c)) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  pay('b:'+b.id,'Promotion clients',-c); b.rvPr=S.day; b.rvx=clamp((b.rvx||0)-0.6,-1,1.6);
  return ok('Promotion lancée : les clients laisseront de meilleurs avis quelques jours.');
}
/* Note moyenne des sociétés ouvertes, pondérée par leur taille (pour la réputation générale) */
function repClients(){
  let w=0,t=0; S.biz.forEach(b=>{ if(b.status!=='active') return; const p=Math.max(1,bizBase(b).R0)*Math.max(1,b.lvl||1); w+=p; t+=p*csOf(b); });
  return w? t/w : null;
}
function starsHTML(v,big){ v=clamp(v,0,5); return '<span class="stars'+(big?' big':'')+'" style="--v:'+v.toFixed(2)+'" role="img" aria-label="'+fmtStar(v)+' sur 5"></span>'; }
/* Diagnostic clair : étoiles par critère + mot, points forts, points à corriger avec action */
const RV_NAMES={price:'Prix',service:'Service',quality:'Qualité',addr:'Adresse'};
const RV_GOOD={price:'Des prix attractifs pour les clients.',service:'Une équipe complète et en forme.',quality:'Des produits et des salaires de qualité.',addr:'Une très bonne adresse, bien passante.'};
function rvVerdict(k,v){
  const w=k==='price'?['Trop cher','Cher','Dans la moyenne','Abordable','Très abordable']:['Très faible','Faible','Correct','Bon','Excellent'];
  return w[v<.2?0:v<.4?1:v<.6?2:v<.8?3:4];
}
function rvCause(b,k){
  const roles=entRoles(b).reduce((a,r)=>a+r[1],0), miss=Math.max(0,roles-headcount(b)), fat=fatOf(b);
  if(k==='price'){ const p=Math.round((b.price-1)*100);
    return {t:'Vos prix sont '+p+' % au-dessus du marché : les clients trouvent ça cher.', a:(!isFact(b)&&b.price>0.81)?['Baisser les prix de 5 %','rvprice',b.id]:null}; }
  if(k==='service'){
    if(miss>0) return {t:'Il manque '+miss+' employé'+(miss>1?'s':'')+' : l’attente s’allonge.', a:['Recruter','jump','bj-eq']};
    if(fat>40) return {t:'L’équipe est fatiguée ('+Math.round(fat)+' / 100) et travaille moins vite.', a:['Voir l’équipe','jump','bj-eq']};
    return {t:'L’équipe est trop juste pour l’affluence.', a:['Voir l’équipe','jump','bj-eq']};
  }
  if(k==='quality'){
    if(pqOn(b)&&pqOf(b)<2) return {t:'Produit de qualité « '+PQN[pqOf(b)]+' » : les clients attendent mieux.', a:['Améliorer la qualité','jump','bj-pil']};
    if(b.pol<1) return {t:'Salaires sous la moyenne : l’équipe est moins motivée.', a:['Revoir les salaires','jump','bj-pil']};
    return {t:'Qualité jugée moyenne.', a:['Voir le pilotage','jump','bj-pil']};
  }
  return {t:'Cette adresse attire peu de passants.', a:['Plus de marketing','jump','bj-pil']};
}
function rvDiag(b){
  const cr=csCrit(b), W={price:.3,service:.3,quality:.2,addr:.2};
  const rows=RV_CRIT.map(k=>({k,v:cr[k]}));
  let h='<div class="rvcr">'+rows.map(r=>'<div><span>'+RV_NAMES[r.k]+'</span>'+starsHTML(1+4*r.v)+'<b class="'+(r.v<.4?'neg':r.v>=.6?'pos':'mut')+'">'+rvVerdict(r.k,r.v)+'</b></div>').join('')+'</div>';
  const good=rows.filter(r=>r.v>=.65).sort((a,c)=>c.v-a.v).slice(0,2);
  const bad=rows.filter(r=>r.v<.45).sort((a,c)=>W[c.k]*(.65-c.v)-W[a.k]*(.65-a.v)).slice(0,2);
  h+='<h3>Ce que les clients aiment</h3>'+(good.length? '<div class="rvpt g">'+good.map(r=>'<div><b>'+RV_NAMES[r.k]+'</b><span>'+RV_GOOD[r.k]+'</span></div>').join('')+'</div>' : '<div class="sub">Rien ne ressort encore.</div>');
  h+='<h3>Ce qui les fait fuir</h3>'+(bad.length? '<div class="rvpt b">'+bad.map(r=>{ const c=rvCause(b,r.k); return '<div><b>'+RV_NAMES[r.k]+'</b><span>'+c.t+'</span>'+(c.a?btn(c.a[0],c.a[1],{c:'sm',i:c.a[2]}):'')+'</div>'; }).join('')+'</div>' : '<div class="sub">Aucun reproche majeur pour l’instant.</div>');
  return h;
}
function rvCard(b){
  const a7=rvAvg(b,7), a30=starsOf(b), l=(b.rvl||[]).slice(0,8), tr=a7-a30;
  let h='<div class="rvbox"><div class="row sp"><span>'+starsHTML(a30,1)+' <b class="num rvn">'+fmtStar(a30)+'</b><small class="mut"> / 5 · '+(b.rvw?b.rvw.length:0)+' j</small></span><span class="num '+(tr>0.05?'pos':tr<-0.05?'neg':'mut')+'">'+(tr>0.05?'▲':tr<-0.05?'▼':'■')+' 7 j : '+fmtStar(a7)+'</span></div>';
  if(b.buzz>0) h+='<div class="notice '+((b.buzzV||0)<0?'bad':'good')+'">'+((b.buzzV||0)<0?'Bad buzz en cours : avis dégradés encore '+b.buzz+' j.':'Buzz positif en cours : avis élogieux encore '+b.buzz+' j.')+'</div>';
  h+='<div class="rvl">'+(l.length? l.map(v=>'<div><span class="rvs">'+starsHTML(v.s)+'</span><span>'+esc(v.t)+'</span><small class="dim">j'+v.d+'</small></div>').join('') : '<div class="sub">Aucun avis pour l’instant : les clients commencent à écrire dès l’ouverture.</div>')+'</div>';
  const rdy=(k)=>(b[k]||-99)<=S.day-10;
  h+='<div class="row">'+btn('Répondre aux avis : '+eur(bizBase(b).R0*3,0),'rvreply',{c:'sm',i:b.id,dis:!rdy('rvAct')})+btn('Promotion : '+eur(bizBase(b).R0*2,0),'rvpromo',{c:'sm',i:b.id,dis:!rdy('rvPr')})+'</div></div>';
  return h;
}
/* Mise à jour quotidienne (appelée à la fin de processBiz) */
function opsDaily(b,open,we){
  const L=hrLvl(), fill=staffFill(b);
  if(b.cs===undefined){ b.cs=65; b.fat=0; b.stk=1; }
  let f=b.fat||0;
  if(open){ f+=((fill<.85? (0.85-fill)*8 : 0)+(b.wk&&we&&bizDef(b).open!=='always'?1.2:0)+Math.max(0,planEff(b).F))*HR.fat[L]*bossFat(b); f-=0.3+0.2*L-Math.min(0,planEff(b).F); }
  else f-=2.5;
  b.fat=clamp(f,0,100);
  if(open) rvDaily(b);
  else if(b.rvx){ b.rvx*=0.85; if(Math.abs(b.rvx)<.02) b.rvx=0; }
}
/* Approvisionnement */
function setStk(b,v){ b.stk=clamp(v|0,0,2); }
/* Locaux : achat réduit le loyer, valeur indexée sur l'immobilier */
const ownShare = b => (S.cities&&S.cities[b.city]&&S.cities[b.city].own)? 1 : b.bld? ((S.bld&&S.bld[b.bld]&&S.bld[b.bld].st==='own')?1:0) : b.prem? clamp(b.prem.r/(bizBase(b).rent0*rentFactor(b)),0,1) : 0;
function premPrice(b){ return bizBase(b).rent0*rentFactor(b)*progMult()*500; }
function premValue(b){ return b.prem? b.prem.cost*S.macro.house/b.prem.h0 : 0; }
function buyPremises(b){
  if(b.bld) return err('Achetez le bâtiment depuis l’onglet Sociétés.');
  if(b.status==='build') return err('Disponible une fois la société ouverte.');
  const c=Math.max(0,premPrice(b)-premValue(b)); if(c<1) return err('Vous possédez déjà tous les locaux.');
  if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+' requis.');
  payCap('b:'+b.id,'Achat des locaux : '+b.name,-c); settleAccounts();
  b.prem={cost:premPrice(b),h0:S.macro.house,r:bizBase(b).rent0*rentFactor(b)};
  log('good','Vous achetez les locaux de « '+b.name+' » ('+distOf(b).n+') : le loyer baisse de 70 %.');
  return ok();
}
/* Service RH automatisé */
function hrUpgrade(){
  const nx=hrLvl()+1; if(nx>=HR.names.length) return err('Niveau maximal atteint.');
  if(!unlocked(HR.tier[nx])) return err('Palier de richesse insuffisant ('+D.TIERS[HR.tier[nx]].n+').');
  if(S.cash<HR.cost[nx]) return err('Trésorerie insuffisante : '+eur(HR.cost[nx],0)+' requis.');
  payCap('gen','Service RH : '+HR.names[nx],-HR.cost[nx]); S.hr={lvl:nx};
  log('good','Votre service RH passe au niveau « '+HR.names[nx]+' ».'); return ok();
}
function hrStep(){
  const L=hrLvl(); if(!L||!S.biz.length) return;
  pay('gen','Service RH',-HR.day[L]*progMult());
  if(wdOf(S.day)!==0) return;
  const A=agencyInit(); let left=HR.fill[L], n=0;
  agencyVacancies().filter(v=>v.e.kind==='bank'||v.e.status==='active').forEach(v=>{
    for(let i=0;i<v.free&&left>0;i++){
      const c=A.pool.filter(x=>x.role===v.role).sort((a,b)=>b.prod-a.prod)[0]; if(!c) break;
      const fee=agencyFee(v.e,v.role,c); if((v.e.kind==='bank'? S.cash : availFor(cityOf(v.e).ccy))<fee*4+1000) return;
      if(agencyHire(c.id,v.key).ok){ left--; n++; }
    }
  });
  if(n) log('info','Service RH : '+n+' recrutement(s) cette semaine.');
}

/* ---------- Loyers impayés et expulsion ---------- */
const EVICT_DAYS=10;
function rentDay(b){ return bizBase(b).rent0*rentFactor(b)*progMult()*(lawsAt(b.city).rentCap?.88:1)*(1-0.7*ownShare(b)); }
/* Chaque jour de compte en euros négatif compte comme un jour de retard pour les locataires ; à 10 jours, le bailleur expulse et la société ferme */
function evictStep(){
  const neg=S.cash<0;
  S.biz.forEach(b=>{ if(b.status!=='active'||ownShare(b)>=.999){ b.arr=0; return; }
    const was=b.arr||0; b.arr=neg? was+1 : Math.max(0,was-2);
    if(neg&&b.arr===3) log('warn','Loyer impayé : le bailleur de « '+b.name+' » vous met en demeure. Remettez votre compte à flot avant '+(EVICT_DAYS-b.arr)+' jours.');
    if(neg&&b.arr===7) log('bad','Le bailleur de « '+b.name+' » prépare votre expulsion dans '+(EVICT_DAYS-b.arr)+' jours.');
  });
  if(!neg) return;
  const c=S.biz.filter(b=>b.status==='active'&&(b.arr||0)>=EVICT_DAYS&&ownShare(b)<.999).sort((a,b)=>rentDay(b)-rentDay(a))[0];
  if(c) evict(c);
}
function evict(b){
  const p=bizValue(b)*0.4; payCap('b:'+b.id,'Liquidation après expulsion : '+b.name,p);
  if(b.prem){ const pv=premValue(b)*0.9; payCap('b:'+b.id,'Vente forcée des locaux : '+b.name,pv); }
  const n=headcount(b); S.rep=clamp(S.rep-2-Math.min(4,n*0.1),0,100); S.stats.layoffs30+=n; S.gov.ten=clamp(S.gov.ten+Math.min(8,n*0.1),0,100);
  bldRelease(b,true); S.biz=S.biz.filter(x=>x!==b); S.stats.evictions=(S.stats.evictions||0)+1;
  log('crit','Expulsion : le bailleur de « '+b.name+' » ('+distOf(b).n+', '+cityOf(b).n+') récupère les locaux. La société ferme, '+plu(n,'employé')+' licencié(s), liquidation à '+eur(p,0)+'.');
}

