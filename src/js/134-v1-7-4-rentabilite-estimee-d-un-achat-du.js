/* ============================================================
   V1.7.4 : rentabilité estimée d'un achat du métier, sur demande (bouton « Estimer »).
   Deux copies de la partie font tourner cette seule société pendant 90 jours, avec et sans
   l'achat, depuis le même hasard ; l'écart de résultat donne le gain par jour et le délai
   de remboursement. La vraie partie n'est pas touchée.
   ============================================================ */
const PB_DAYS=90;
function pbRun(id,act,arg){ const real=S, rpt=RPT; let sum=null;
  try{ S=structuredClone(real); RPT=null; const b=S.biz.find(x=>x.id===id); if(!b) return null;
    if(act){ S.cash=Math.max(S.cash,1e15); const r=metAct(b,act,arg); if(!r||r.ok===false) return null; }
    sum=0; for(let d=0;d<PB_DAYS;d++){ processBiz(b); const L=b.last; sum+=L? (L.net0!==undefined? L.net0 : L.net) : 0; S.day++; } }
  catch(e){ sum=null; } finally{ S=real; RPT=rpt; }
  return sum; }
function pbKey(b,c){ return b.id+':'+c.act+':'+(c.arg===undefined?'':c.arg); }
function pbCache(){ ui._pb=ui._pb||{}; if(ui._pb.day!==S.day) ui._pb={day:S.day}; return ui._pb; }
function pbEstimate(b,c){ const s0=pbRun(b.id,null), s1=pbRun(b.id,c.act,c.arg); if(s0===null||s1===null) return {na:1}; return {g:(s1-s0)/PB_DAYS, cost:c.cost}; }
function pbTxt(r){ if(!r) return ''; if(r.na) return 'Estimation impossible pour cet achat.';
  if(!(r.g>0.5)) return 'Estimation sur 90 jours : pas de gain mesurable (effet trop lent ou indirect : image, satisfaction, palier).';
  const mo=r.cost/r.g/30; return 'Estimation sur 90 jours : +'+eur(r.g,0)+' par jour, remboursé en '+(mo<1? 'moins d’un mois' : mo>120? 'plus de dix ans' : '≈ '+Math.round(mo)+' mois')+'.'; }
{ const _mch=metCtlHtml; metCtlHtml=function(b,c){ let h=_mch(b,c); try{ if((c.k==='buy'||c.k==='btn')&&c.cost>0&&!c.owned&&!c.dis&&c.act){ const r=pbCache()[pbKey(b,c)];
      const add= r? '<div class="sub pb-e">'+esc(pbTxt(r))+'</div>' : '<div class="pb-e"><button class="lnk" data-a="pbest" data-i="'+b.id+'" data-v="'+esc(c.act)+'"'+(c.arg!==undefined?' data-j="'+esc(String(c.arg))+'"':'')+'>Estimer la rentabilité ›</button></div>';
      h=h.replace(/<\/div>$/,add+'</div>'); } }catch(e){} return h; }; }
ACT.pbest=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b) return; const act=el.dataset.v, arg=el.dataset.j;
  const c=metCtl(b).find(x=>x.act===act&&String(x.arg===undefined?'':x.arg)===String(arg===undefined?'':arg)); if(!c) return;
  el.textContent='Calcul…'; el.disabled=true; setTimeout(()=>{ pbCache()[pbKey(b,c)]=pbEstimate(b,c); render(); },20); };

/* V1.7.4 : rentabilité du groupe (bénéfice des 30 derniers jours rapporté à l'argent investi) */
function roiRows(){ return S.biz.filter(b=>b.status==='active').map(b=>{ const h=(b.hist||[]).slice(-30), n=bizCyc(b)? bizNetRef(b) : h.length? h.reduce((a,x)=>a+x,0)/h.length : 0, inv=Math.max(1,(b.inv$||bizDef(b).cost)+Math.max(0,bizInvested(b)-bizDef(b).cost));
  return {b, n, inv, roi:n*360/inv}; }).sort((x,y)=>y.roi-x.roi); }
function roiCard(){ const R=roiRows(); if(R.length<2) return ''; const F=S.fcfold||{}, open=!!F.bz_roi;
  const tot=R.reduce((a,r)=>a+r.n,0), inv=R.reduce((a,r)=>a+r.inv,0), neg=R.filter(r=>r.n<0&&!bizCyc(r.b)).length;
  const row=r=>'<div class="rs-d"><div><b>'+esc(r.b.name)+'</b><small>'+esc(bizDef(r.b).n)+' · '+esc(cityName(r.b.city))+' · investi '+eur(r.inv,0)+'</small><small class="num '+cls(r.n)+'">'+signed(r.n,0)+' / j · '+(r.n>0? fmtN(r.roi*100,0)+' % par an · remboursé en ≈ '+Math.max(1,Math.round(r.inv/r.n/30))+' mois' : bizCyc(r.b)? 'ventes ponctuelles : à juger sur plusieurs mois' : 'en perte sur 30 jours')+'</small></div>'+(r.n<=0&&bizCyc(r.b)? pill('En cycle','info') : pill(r.n<=0?'À revoir':r.roi>=1?'Excellent':r.roi>=.4?'Bon':'Faible',r.n<=0?'bad':r.roi>=.4?'good':'info'))+'</div>';
  return '<section class="card fcd-c"><details class="fcd ag-f" data-k="bz_roi"'+(open?' open':'')+'><summary><span class="ag-s"><h2><span>Rentabilité du groupe</span></h2><small>'+signed(tot,0)+' / j pour '+eur(inv,0)+' investis · '+fmtN(inv>0?tot*360/inv*100:0,0)+' % par an'+(neg?' · <span class="warn-t">'+neg+' en perte</span>':'')+'</small></span></summary>'+
    '<div class="sub">Classement par rendement annuel : bénéfice moyen des 30 derniers jours (4 mois pour les studios, promoteurs, galeries, maisons de couture, fermes et entreprises de construction) rapporté à tout ce que vous avez investi (création, agrandissements, achats). Agrandissez en priorité le haut du classement ; revoyez ou cédez le bas.</div><div class="ht-t">'+R.map(row).join('')+'</div></details></section>'; }
{ const _vbh4=vBizHome; vBizHome=function(){ const h=_vbh4(); return S.biz.length? h+roiCard() : h; }; }

/* V1.8.8 : vue d'ensemble de la délégation (achat visé, réserve, derniers achats de chaque directeur) */
function dlCard(){ const L=S.biz.filter(b=>b.status==='active'&&dlMode(b)!=='me'); if(!L.length) return ''; const F=S.fcfold||{}, open=!!F.bz_dl;
  const rows=L.map(b=>{ const md=dlMode(b), g=md==='full'? dlGoal(b) : null, res=dlBudget(b), x=b.boss;
    const last=((b.m&&b.m.log)||[]).filter(l=>/directeur|priorité du groupe/i.test(l.t||''))[0];
    return '<div class="rs-d"><div><b>'+esc(b.name)+'</b><small>'+esc(DL_MODES[md].n)+(x?' · '+esc(x.name)+' · moral '+Math.round(x.mood):'')+(b.dlg?' · priorité du groupe':'')+'</small>'+
      (md==='full'? (g? '<small>Vise : '+esc(g.n)+' · '+eur(res,0)+' / '+eur(g.c,0)+(g.wait?' (en attente)':'')+'</small>'+bar(Math.min(1,res/Math.max(1,g.c)),'g') : '<small>Aucun achat en vue · réserve '+eur(res,0)+'</small>') : '')+
      (last? '<small class="mut">Dernier : '+esc(String(last.t||last.m||'').replace(/^Votre directeur : /,''))+'</small>' : '')+'</div>'+(x&&x.mood<35? pill('Moral bas','bad') : '')+'</div>'; });
  return '<section class="card fcd-c"><details class="fcd ag-f" data-k="bz_dl"'+(open?' open':'')+'><summary><span class="ag-s"><h2><span>Délégation</span></h2><small>'+L.length+' société'+(L.length>1?'s':'')+' confiée'+(L.length>1?'s':'')+(L.some(b=>b.boss&&b.boss.mood<35)?' · <span class="warn-t">moral bas</span>':'')+'</small></span></summary><div class="ht-t">'+rows.join('')+'</div></details></section>'; }
{ const _vbh5=vBizHome; vBizHome=function(){ const h=_vbh5(); return S.biz.length? h+dlCard() : h; }; }

/* ---------- V2.1.2 : conseiller du jour (accueil) ----------
   Au plus trois conseils, du plus urgent au plus utile : crise sans parade, guerre des prix subie,
   société en perte sur 30 jours, offre de rachat, achat rentable à portée de trésorerie (sociétés gérées par vous). */
function advList(){ const L=[], act=S.biz.filter(b=>b.status==='active');
  try{ if(criOn()&&!S.cri.mit) L.push({p:100, t:'Une crise est en cours', d:'Une parade réduit ses effets de 60 %.', b:btn('Voir la crise','advcri',{c:'sm pri'})}); }catch(e){}
  try{ const R=S.riv; if(R){ const w=R.wars.find(x=>x.resp==='hold'); if(w) L.push({p:90, t:'Guerre des prix sans riposte', d:rivDef(w.rival).n+' casse les prix : '+keyLabel(w.key)+'. Aligner les prix ou lancer une campagne limite les pertes.', b:btn('Riposter','tab',{c:'sm pri',i:'rivals'})});
    if(R.offers.length){ const o=R.offers[0], b=S.biz.find(x=>x.id===o.b); if(b) L.push({p:60, t:'Offre de rachat pour '+b.name, d:rivDef(o.rival).n+' propose '+eur(o.price,0)+'.', b:btn('Voir l’offre','tab',{c:'sm',i:'rivals'})}); } } }catch(e){}
  /* V2.1.3 : trésorerie faible (moins de 15 jours de charges) */
  { let ch=0; act.forEach(b=>{ if(b.last) ch+=Math.max(0,(b.last.rev||0)-(b.last.net||0)); });
    if(ch>0&&S.cash<ch*15) L.push({p:95, t:'Trésorerie faible', d:'Il reste environ '+Math.max(0,Math.floor(S.cash/ch))+' jours de charges en caisse. Évitez les achats et lancements, ou empruntez à la banque : 14 jours à découvert mènent à la faillite.', b:btn('Banque','tab',{c:'sm pri',i:'bank'})}); }
  act.forEach(b=>{ const h=b.hist||[]; if(bizCyc(b)||h.length<30||S.day-b.since<60) return; const n=dlNet30(b);
    if(n<0) L.push({p:80+Math.min(9,-n/1e4), t:b.name+' perd de l’argent', d:'En moyenne '+eur(-n,0)+' par jour sur 30 jours.', b:btn('Gérer','bizopen',{c:'sm pri',i:b.id})}); });
  act.filter(b=>dlMode(b)!=='full').forEach(b=>{ let g=null; try{ g=dlGoal(b); }catch(e){} if(!g||g.wait||!(g.c>0)||g.c>S.cash*.6) return;
    const n=Math.max(1,dlNetL(b)); L.push({p:40+Math.min(15,n*30/g.c), t:b.name+' : '+g.n, d:'Coûte '+eur(g.c,0)+', soit '+Math.max(1,Math.round(g.c/n))+' jours de bénéfice de la société.', b:btn('Gérer','bizopen',{c:'sm',i:b.id})}); });
  return L.sort((x,y)=>y.p-x.p).slice(0,3); }
function advCard(){ const L=advList(); if(!L.length) return '';
  return card('Conseiller du jour','<div class="ht-t">'+L.map(x=>'<div class="rs-d"><div><b>'+esc(x.t)+'</b><small>'+esc(x.d)+'</small></div>'+x.b+'</div>').join('')+'</div>'); }
ACT.advcri=()=>{ pushModal({type:'cri'}); render(); };
{ const _vh=VIEWS.home; VIEWS.home=function(){ const h=_vh.apply(this,arguments); if(!S.biz.length) return h; const c=advCard(); if(!c) return h;
  const k=h.indexOf('<section class="card hero">'); return k>0? h.slice(0,k)+c+h.slice(k) : h+c; }; }

/* V2.1.3 : carte de l'événement de la semaine (accueil) */
function wevCard(){ let W=null; try{ W=wevCur(); }catch(e){} if(!W) return '';
  const live=wevLive(), dl=Math.max(0,WEV_DAYS-(S.day-(W.d0||0)));
  const n=S.biz.filter(b=>b.status==='active'&&bizSec(b.def)===W.sec).length;
  return card('Événement de la semaine','<div class="stack"><div class="row sp"><b>'+esc(WEV_T[W.sec])+'</b>'+pill(W.done?'Réussi':live?'encore '+dl+' j':'Terminé',W.done?'good':live?'info':'')+'</div>'+
    '<div class="sub">'+esc(secName(W.sec))+' : recettes +20 % pour vos '+n+' société'+(n>1?'s':'')+' du secteur pendant '+WEV_DAYS+' jours de jeu, cette semaine. Nouvel événement lundi.</div>'+
    (W.done? '<div class="sub">Défi réussi : prime encaissée.</div>'
      : !live? '<div class="sub">Défi manqué. Revenez lundi pour le prochain.</div>' : '<div class="sub">Défi : '+eur(W.goal,0)+' de bénéfice dans ce secteur. Prime : '+eur(wevReward(),0)+'.</div>'+bar(clamp(W.got/W.goal,0,1),'g')+'<div class="sub">'+eur(W.got,0)+' sur '+eur(W.goal,0)+'</div>')+'</div>'); }
{ const _vh=VIEWS.home; VIEWS.home=function(){ const h=_vh.apply(this,arguments); if(!S.biz.length) return h; const c=wevCard(); if(!c) return h;
  const k=h.indexOf('<section class="card hero">'); return k>0? h.slice(0,k)+c+h.slice(k) : h+c; }; }

/* V2.1.3 : liste complète des succès */
ACT.achall=()=>{ pushModal({type:'achall'}); render(); };
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(!(m&&m.type==='achall')) return _mc();
  const done=ACH.filter(a=>S.ach[a.id]).length;
  return {title:'Succès',sm:true,body:'<div class="stack"><div class="sub">'+done+' sur '+ACH.length+' réalisés. Chaque succès fait gagner un peu de réputation.</div>'+bar(done/ACH.length,'g')+
    '<div class="ht-t">'+ACH.map(a=>{ const d=S.ach[a.id]; return '<div class="rs-d"><div><b>'+esc(a.t)+'</b><small>'+esc(a.d)+'</small></div>'+(d? pill(dateS(d),'good') : pill('À faire',''))+'</div>'; }).join('')+'</div></div>'}; }; }

/* ---------- V2.1.3 : écran Statistiques ---------- */
MENU.splice(MENU.findIndex(x=>x[0]==='books'),0,['stats','Statistiques','']);
function vStats(){ const st=S.stats||{}, act=S.biz.filter(b=>b.status==='active'), O=(S.foot&&S.foot.own)||null;
  let h=head('Statistiques','Votre parcours en chiffres : records, secteurs et meilleures sociétés.');
  h+=card('Valeur nette',lineChart(S.nwH,{h:120,x0:dateS(1),x1:dateS(S.day),label:'Évolution de la valeur nette'}));
  const rec=[['Valeur nette record',eur(S.peakNW||0,0)],['Meilleur jour',eur(st.bestDay||0,0)+(st.bestDayD?' ('+dateS(st.bestDayD)+')':'')],['Sociétés ouvertes (record)',fmtN(Math.max(st.maxBiz||0,act.length),0)],
    ['Employés',fmtN(totalEmployees(),0)],['Jours de jeu',fmtN(S.day,0)],['Succès',ACH.filter(a=>S.ach[a.id]).length+' sur '+ACH.length],
    ['Événements de la semaine réussis',fmtN(st.wev||0,0)],['Guerres des prix lancées',fmtN(st.att||0,0)]];
  if(O) rec.push(['Trophées du club',fmtN((O.cab||[]).length,0)]);
  h+=card('Records','<div class="mini">'+rec.map(r=>'<div><span>'+r[0]+'</span><b class="num">'+r[1]+'</b></div>').join('')+'</div>');
  /* bénéfice par secteur : 30 derniers jours et 12 derniers relevés */
  const m30={}, y={}; act.forEach(b=>{ const k=bizSec(b.def); m30[k]=(m30[k]||0)+(b.hist||[]).slice(-30).reduce((a,x)=>a+x,0); });
  (S.secH||[]).slice(-12).forEach(r=>{ for(const k in r.v) y[k]=(y[k]||0)+r.v[k]; });
  const ks=[...new Set(Object.keys(m30).concat(Object.keys(y)))].sort((a,b)=>(m30[b]||0)-(m30[a]||0)), mx=Math.max(1,...ks.map(k=>Math.abs(m30[k]||0)));
  if(ks.length) h+=card('Bénéfice par secteur','<div class="tw"><table class="tbl"><tr><th>Secteur</th><th class="num">30 jours</th><th class="num">12 mois</th></tr>'+
    ks.map(k=>'<tr><td>'+esc(secName(k))+'<div class="bar"><i style="width:'+Math.round(Math.max(0,m30[k]||0)/mx*100)+'%"></i></div></td><td class="num '+((m30[k]||0)<0?'neg':'')+'">'+eur(m30[k]||0,0)+'</td><td class="num '+((y[k]||0)<0?'neg':'')+'">'+(y[k]!==undefined? eur(y[k],0) : '–')+'</td></tr>').join('')+'</table></div>'+
    '<div class="sub">12 mois : somme des relevés mensuels disponibles.</div>');
  const top=act.map(b=>[b,dlNet30(b)]).sort((a,b)=>b[1]-a[1]).slice(0,5);
  if(top.length) h+=card('Meilleures sociétés (30 jours)','<div class="ht-t">'+top.map(([b,n])=>'<div class="rs-d"><div><b>'+esc(b.name)+'</b><small>'+esc(cityName(b.city))+' · niveau '+b.lvl+' · '+eur(n,0)+' par jour</small></div>'+btn('Gérer','bizopen',{c:'sm',i:b.id})+'</div>').join('')+'</div>');
  return h; }
VIEWS.stats=vStats;
if(typeof MDESC!=='undefined') MDESC.stats='Records, secteurs, meilleures sociétés';
try{ if(typeof ICON==='object') ICON.stats='<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>'; }catch(e){}
try{ if(typeof NAVSHORT==='object') NAVSHORT.stats='Stats'; }catch(e){}

/* ---------- V2.1.3 : taille du texte (préférence de l'appareil, localStorage idlebiz.fs) ---------- */
const FS_OPT=[[.9,'Petite'],[1,'Normale'],[1.15,'Grande'],[1.25,'Très grande']];
function fsGet(){ try{ const v=+localStorage.getItem('idlebiz.fs'); return FS_OPT.some(o=>o[0]===v)? v : 1; }catch(e){ return 1; } }
function fsApply(){ const v=fsGet(); try{ document.body.style.zoom= v===1? '' : String(v); }catch(e){} }
ACT.fsset=el=>{ try{ localStorage.setItem('idlebiz.fs',el.dataset.v); }catch(e){} fsApply(); render(); };
{ const _vs=VIEWS.set; VIEWS.set=function(){ const h=_vs.apply(this,arguments), v=fsGet();
  return h+card('Taille du texte','<div class="stack"><div class="seg">'+FS_OPT.map(o=>'<button class="'+(o[0]===v?'on':'')+'" data-a="fsset" data-v="'+o[0]+'">'+o[1]+'</button>').join('')+'</div><div class="sub">Agrandit ou réduit tout le jeu sur cet appareil.</div></div>'); }; }
try{ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fsApply); else fsApply(); }catch(e){}

