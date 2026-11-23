/* ============================================================
   INTERFACE : rendu, actions, boucle automatique, démarrage
   ============================================================ */
const NAV=[['home','Accueil'],['biz','Sociétés'],['bank','Banque'],['markets','Marchés'],['immo','Immobilier'],['luxe','Luxe'],['pol','Politique'],['agency','Recrutement'],['books','Comptes'],['set','Réglages']];
const NAVSHORT={logi:'Usines',auction:'Enchères',rivals:'Rivaux',cities:'Villes',fx:'Devises',home:'Accueil',biz:'Sociétés',bank:'Banque',markets:'Marchés',immo:'Immo',luxe:'Luxe',pol:'Politique',agency:'Personnel',guide:'Guide',books:'Comptes',set:'Réglages',plus:'Plus'};
const MENU=[['bank','Banque',''],['markets','Marchés',''],['immo','Immobilier',''],['luxe','Luxe',''],['pol','Politique',''],['cities','Villes',''],['rivals','Rivaux',''],['auction','Salle des ventes',''],['logi','Usines et logistique',''],['agency','Personnel',''],['books','Livre de comptes',''],['guide','Guide du jeu',''],['set','Réglages','']];
const PINMAX=4, BARDEF={l:['markets'],r:['immo']};
const VIEWS={logi:vLogi,auction:vAuction,rivals:vRivals,cities:vCities,fx:()=>{ ui.tab='home'; return vHome(); },home:vHome,biz:vBiz,bank:vBank,markets:vMarkets,immo:vImmo,luxe:vLuxe,pol:vPol,agency:vAgency,guide:vGuide,plus:vPlus,books:vBooks,set:vSet};
const root=()=>$('#app');

function parseAmt(v){
  if(v===undefined||v===null) return NaN; let s=String(v).trim().toLowerCase().replace(/\s/g,'').replace(/€/g,'').replace(',','.');
  let m=1; if(s.endsWith('k')){ m=1e3; s=s.slice(0,-1); } else if(s.endsWith('m')){ m=1e6; s=s.slice(0,-1); }
  const n=parseFloat(s); return isNaN(n)? NaN : n*m;
}
function readIn(id){ const el=document.getElementById(id); return el? parseAmt(el.value) : NaN; }

/* ---------- Rendu ---------- */
function mount(){
  root().innerHTML='<header id="top"><div class="top-in"><div class="dayblock" id="t-day"></div><div class="week" id="t-week" role="group" aria-label="Semaine en cours"></div>'+
    '<div class="ctrl" id="t-ctrl"><button class="btn pri stamp" data-a="next" aria-label="Passer au jour suivant">Jour suivant ›</button><button class="btn" data-a="next7">+7 jours</button></div>'+
    '<div class="kpis" id="t-kpis"></div></div></header><div id="shell"><nav id="nav" aria-label="Sections"></nav><main id="view"></main></div>';
  syncCtrl();
}
function syncCtrl(){
  const b=$('#t-auto'); if(!b) return;
  b.className='btn'+(ui.auto?' on':''); b.textContent=ui.auto?'Pause':'Auto'; b.setAttribute('aria-pressed',ui.auto?'true':'false');
}
function renderTop(){
  const wd=wdOf(S.day), ws=S.day-wd, we=wd>=5, wk=Math.floor((S.day-1)/7)+1;
  const dl=ui.delta;
  const wkc=[0,1,2,3,4,5,6].map(i=>'<div class="wd '+(i>=5?'we ':'')+(i<wd?'past ':'')+(i===wd?'now':'')+'" '+(i===wd?'aria-current="date"':'')+'>'+D.DAYS_SHORT[i]+'<b>'+(ws+i)+'</b></div>').join('');
  $('#t-day').innerHTML='<div class="brand">Idle Business<i>.</i></div><div class="daynum dated" aria-label="'+gameDateLabel(S.day)+', jour '+S.day+'"><small>'+FOOT_MONTHS[footDate(S.day).m-1]+'</small>'+footDate(S.day).d+'<small class="dy">'+footDate(S.day).y+'</small></div><div class="daymeta"><b>'+D.DAYS[wd]+', semaine '+wk+'</b><div class="status">'+
      pill(marketsOpen()?'Bourse ouverte':'Bourse fermée',marketsOpen()?'good':'')+pill(we?'Week-end':'Jour ouvré',we?'warn':'')+'</div></div>';
  $('#t-week').innerHTML=wkc;
  $('#t-kpis').innerHTML=
      '<div class="kpi"><span>Trésorerie</span><b class="num '+(S.cash<0?'neg':'')+'">'+eur(S.cash,0)+'</b>'+(dl!==null&&dl!==undefined?'<small class="'+cls(dl)+'">'+signed(dl,0)+'</small>':'')+'</div>'+
      '<div class="kpi"><span>Valeur nette</span><b class="num">'+eur(S.nw,0)+'</b></div>'+
      '<div class="kpi"><span>Réputation</span><b class="num">'+fmtStar(repNote(S.rep))+'<small class="mut">/5</small></b></div>'+
      '<div class="kpi"><span>Influence</span><b class="num">'+fmtN(S.infl,0)+'</b></div>'+
      '<div class="kpi"><span>Palier</span><b>'+D.TIERS[tierNow()].n+'</b></div>';
  syncCtrl();
  const h=$('#top').offsetHeight; document.documentElement.style.setProperty('--toph',h+'px');
}
/* date du jeu : mois de 30 jours, à partir de janvier 2026 */
function gameDateLabel(day){ const t=footDate(day); return (t.d===1?'1er':t.d)+' '+FOOT_MONTHS[t.m-1]+' '+t.y; }
function navBar(){
  const ok=k=>MENU.some(x=>x[0]===k), seen=new Set(), clean=a=>(Array.isArray(a)?a:[]).filter(k=>ok(k)&&!seen.has(k)&&seen.add(k));
  const b=ui.bar||BARDEF, l=clean(b.l), r=clean(b.r);
  l.splice(2); r.splice(2);
  while(l.length+r.length>PINMAX){ (r.length>l.length? r : l).pop(); }
  return {l,r};
}
const NAVLBL=k=>{ const m=MENU.find(x=>x[0]===k); return m? m[1] : k; };
function saveUI(){ try{ localStorage.setItem('grandlivre.ui',JSON.stringify({tab:ui.tab,speed:ui.speed,theme:ui.theme,bar:navBar(),rp:ui.rp,recent:ui.recent||[]})); }catch(e){} }
function renderNav(){
  const badge={bank:S.bank.lic&&S.bank.apps.length&&bankOpen()?S.bank.apps.length:0, pol:S.bills.length&&!S.country?S.bills.length:0, rivals:rivBadge()};
  const item=(k,t,act)=>'<button class="nv '+(act?'act':'')+'" data-a="tab" data-i="'+k+'" '+(act?'aria-current="page"':'')+'>'+icon(k)+'<span class="lb">'+t+'</span>'+(badge[k]?'<i>'+badge[k]+'</i>':'')+'</button>';
  const B=navBar(), L=B.l, R=B.r, pins=L.concat(R), shown=['home','biz','plus'].concat(pins);
  const lab=k=>NAVSHORT[k]||((MENU.find(x=>x[0]===k)||[])[1])||k;
  $('#nav').className=pins.length>2?'dense':'';
  $('#nav').innerHTML='<div class="nv-g">'+L.map(k=>item(k,lab(k),ui.tab===k)).join('')+item('biz',lab('biz'),ui.tab==='biz')+'</div>'+
    '<div class="nv-c">'+item('home',lab('home'),ui.tab==='home')+'</div>'+
    '<div class="nv-g">'+R.map(k=>item(k,lab(k),ui.tab===k)).join('')+item('plus',lab('plus'),ui.tab==='plus'||!shown.includes(ui.tab))+'</div>';
}
function render(){
  if(!S){ root().innerHTML=vTitle(); renderModal(); return; }
  if(!$('#top')) mount();
  const y=window.scrollY;
  renderTop(); renderNav();
  $('#view').innerHTML=VIEWS[ui.tab]();
  renderModal();
  if(Math.abs(window.scrollY-y)>2) window.scrollTo(0,y);
}
function tierContent(t){
  const L=[];
  const b=D.bizOrder.filter(i=>D.biz[i].tier===t).map(i=>D.biz[i].n); if(b.length) L.push(['Sociétés',b.join(', ')]);
  const st=D.stocks.filter(x=>x.tier===t).map(x=>x.n); if(st.length) L.push(['Actions',st.join(', ')]);
  const bo=D.bonds.filter(x=>x.tier===t).map(x=>x.n); if(bo.length) L.push(['Obligations',bo.join(', ')]);
  const cr=D.crypto.filter(x=>x.tier===t).map(x=>x.n); if(cr.length) L.push(['Cryptomonnaies',cr.join(', ')]);
  const pr=Object.values(D.PROP).filter(x=>x.tier===t).map(x=>x.n).concat(Object.values(D.BUILD).filter(x=>x.tier===t).map(x=>'Chantier : '+x.n)); if(pr.length) L.push(['Immobilier',pr.join(', ')]);
  const lx=D.LUX.filter(x=>x.tier===t).map(x=>x.n); if(lx.length) L.push(['Luxe',lx.join(', ')]);
  if(t===D.BANK.tier) L.push(['Banque','Licence bancaire']); if(t===1) L.push(['Politique','Lobbying et dons']); if(t===2) L.push(['Finance','Capital-risque']); if(t===6) L.push(['Pays','Achat d’une nation']);
  return L;
}
function modalContent(){
  if(S&&inJail()&&(!ui.modal||ui.modal.type!=='jail')) ui.modal={type:'jail'};
  if(ui.modal&&ui.modal.type==='jail'&&!(S&&inJail())) ui.modal=null;
  const m=ui.modal; if(!m) return null;
  if(m.type==='jail') return modalJail();
  if(m.type==='asset') return modalAsset(m.cls,m.id);
  if(m.type==='shop') return modalShop(m.id);
  if(m.type==='plans') return modalPlans(m.id);
  if(m.type==='rival') return modalRival(m.id);
  if(m.type==='offline') return modalOffline(m.n);
  if(m.type==='d100') return modalD100();
  if(m.type==='biz'){ const b=S.biz.find(x=>x.id===m.id); if(!b){ ui.modal=null; return null; } return modalBiz(b); }
  if(m.type==='launch') return modalLaunch(m.def);
  if(m.type==='estab') return modalEstab(m.id);
  if(m.type==='report') return modalReport(m);
  if(m.type==='rpedit') return modalRpEdit();
  if(m.type==='saves') return {title:'Sauvegardes',sm:true,body:'<div class="slots">'+[1,2,3,4,5].map(slotCard).join('')+'</div><div class="sub"></div>'};
  if(m.type==='newgame') return {title:'Nouvelle partie · emplacement '+m.slot,sm:true,body:newGameForm(m.slot)};
  if(m.type==='confirm') return {title:esc(m.title),sm:true,body:'<p style="margin:0">'+m.msg+'</p><div class="row sp">'+btn('Annuler','confirmno',{c:'ghost'})+btn(m.label||'Confirmer','confirmyes',{c:'pri'})+'</div>'};
  if(m.type==='tier'){ const t=m.t; return {title:'Palier '+D.TIERS[t].n,sm:true,body:'<div class="notice good">Valeur nette de '+eur(D.TIERS[t].nw,0)+' atteinte.</div>'+tierContent(t).map(x=>'<div><div class="tag">'+x[0]+'</div><div>'+esc(x[1])+'</div></div>').join('')+'<div>'+btn('Continuer','closemodal',{c:'pri'})+'</div>'}; }
  if(m.type==='over') return {title:'Faillite',sm:true,body:'<div class="notice bad">'+esc(S.over.reason)+'</div><div class="mini"><div><span>Jour</span><b>'+S.over.day+'</b></div><div><span>Palier</span><b>'+D.TIERS[tierNow()].n+'</b></div><div><span>Pic de valeur nette</span><b class="num">'+eur(S.peakNW,0)+'</b></div></div><div>'+btn('Retour au menu','menu',{c:'pri'})+'</div>'};
  if(m.type==='win') return {title:'Souverain',sm:true,body:'<div class="notice good">Vous gouvernez '+(S.country?esc(S.country.name):'une nation')+'. Votre empire a dépassé toutes les ambitions d’un simple homme d’affaires.</div><p style="margin:0">La partie continue : réglez les impôts, décrétez des lois et maintenez la satisfaction de votre peuple.</p><div>'+btn('Gouverner','closemodal',{c:'pri'})+'</div>'};
  return null;
}
function renderModal(){
  const box=$('#modal-root'); if(!box) return;
  const c=modalContent();
  if(!c){ box.innerHTML=''; document.body.style.overflow=''; return; }
  const old=box.querySelector('.ov'); const st=old? old.scrollTop : 0;
  box.innerHTML='<div class="ov" data-a="ovclick"><div class="md '+(c.sm?'sm':'')+'" role="dialog" aria-modal="true" aria-label="'+esc(c.title.replace(/<[^>]+>/g,''))+'"><div class="md-h"><h2>'+c.title+'</h2><button class="x" data-a="closemodal" aria-label="Fermer">×</button></div><div class="md-b">'+c.body+'</div></div></div>';
  const ov=box.querySelector('.ov'); if(old) ov.scrollTop=st;
  document.body.style.overflow='hidden';
}
function ask(title,msg,label,fn){ ui.prev=ui.modal; ui.modal={type:'confirm',title,msg,label}; ui.confirmFn=fn; render(); }

/* ---------- Sauvegarde ---------- */
let saveT=null;
function scheduleSave(){ clearTimeout(saveT); saveT=setTimeout(()=>{ if(S) saveGame(); },700); }
function after(r,okMsg){ if(S){ computeNW(); } if(r) res(r,okMsg); render(); scheduleSave(); return r; }

/* ---------- Passage des jours ---------- */
function stopAuto(show){
  const was=ui.auto; ui.auto=false; clearTimeout(ui.timer); ui.timer=null; syncCtrl();
  if(was && show!==false) openAutoReport();
}
/* Rapport de tous les jours passés en mode auto */
function openAutoReport(){
  const s=(S&&!S.over&&RPT&&RPT.days)? rptSummary() : null; RPT=null; ui.rptLater=false;
  if(s) pushModal({type:'report',s});
}
/* Mode auto : un jour à la fois, en pause tant qu'un doigt est posé, qu'une fenêtre est ouverte ou que l'écran est masqué */
function autoTick(){
  ui.timer=null; if(!ui.auto||!S||S.over) return;
  if(ui.down||ui.modal||document.hidden){ ui.timer=setTimeout(autoTick,250); return; }
  doNext(1,true);
  if(ui.auto&&!ui.timer) ui.timer=setTimeout(autoTick,ui.speed);
}
function startAuto(){ clearTimeout(ui.timer); rptBegin(); ui.auto=true; syncCtrl(); render(); ui.timer=setTimeout(autoTick,300); }
/* pre (V1.7.3) : jours déjà joués un par un par runDays {c0, d0, N, halt} */
function doNext(n,quiet,pre){
  if(!S||(S.over&&!pre)) return;
  const c0=pre? pre.c0 : S.cash, d0=pre? pre.d0 : S.day, N=pre? pre.N : n;
  if(!pre&&(!quiet||!RPT)) rptBegin();
  if(!(pre&&pre.halt)) advance(n);
  ui.delta=S.cash-c0;
  if(S.over){
    stopAuto(false); RPT=null; ui.mq=[]; ui.modal={type:'over'}; const sl=SV.slot; SV.slot=0; SV.dirty=false; if(sl) (SV.busy||Promise.resolve()).then(()=>svDelete(sl));
  } else {
    const ev=[]; let stop=false;
    if(S.flashTier){ ev.push({type:'tier',t:S.flashTier}); S.flashTier=null; stop=true; }
    if(S.flashWin){ ev.push({type:'win'}); S.flashWin=false; stop=true; }
    if(S.flashD100){ ev.push({type:'d100'}); S.flashD100=false; }
    if(S.stop && ui.auto){ stop=true; toast('Pause automatique : événement important. Consultez le journal.','bad'); }
    if(stop) stopAuto(false);
    if(!ui.auto){
      const sm=(RPT&&RPT.days&&(N>1||S.day-d0>1||!rpPrefs().skip1))? rptSummary() : null; RPT=null;
      if(sm) pushModal({type:'report',s:sm});
    }
    ev.forEach(pushModal);
  }
  if(N>1 && S.day-d0<N && !S.over) toast('Arrêt anticipé le '+dateL(S.day)+' : événement important.','bad');
  render(); saveGame();
}

/* V1.7.3 : plusieurs jours joués un par un, l’écran reste réactif (date qui défile), rapport à la fin */
function runDays(N){ if(ui.run||!S||S.over) return; if(N<=1) return doNext(N);
  const pre={c0:S.cash, d0:S.day, N}; rptBegin(); ui.run=1; let k=0;
  const b=document.querySelector('[data-a="next7"]'); if(b){ b.classList.add('busy'); b.setAttribute('aria-busy','true'); }
  const tick=()=>{ let go=false; try{ go= k<N-1 && !S.over && nextDay() && !S.stop && !S.over; }catch(e){ ui.run=0; throw e; }
    if(go){ k++; try{ renderTop(); const t=document.querySelector('[data-a="next7"]'); if(t){ t.classList.add('busy'); t.textContent='Jour '+(k+1)+' / '+N; } }catch(e){} setTimeout(tick,0); return; }
    if(k<N-1||S.stop||S.over) k++;   /* arrêt anticipé : le jour joué compte */
    ui.run=0; pre.halt= S.stop||S.over||k>=N;
    const t=document.querySelector('[data-a="next7"]'); if(t){ t.classList.remove('busy'); t.removeAttribute('aria-busy'); t.textContent='+7 jours'; }
    doNext(N-k,false,pre); };
  setTimeout(tick,16); }
/* ---------- Actions ---------- */
const ACT={
  tab:el=>{ if(el.dataset.i==='biz') ui.bz={c:null,d:null}; ui.tab=el.dataset.i; ui.modal=null; window.scrollTo(0,0); render(); saveUI(); },
  next:()=>{ if(ui.run) return; if(ui.auto){ stopAuto(); render(); return; } doNext(1); }, next7:()=>{ if(ui.auto){ stopAuto(); render(); return; } runDays(7); },
  closemodal:()=>closeModal(),
  ovclick:(el,e)=>{ if(e.target===el&&!(ui.modal&&ui.modal.type==='rpedit')) closeModal(); },
  confirmno:()=>{ ui.modal=ui.prev; ui.prev=null; ui.confirmFn=null; render(); },
  confirmyes:()=>{ const f=ui.confirmFn; ui.modal=ui.prev; ui.prev=null; ui.confirmFn=null; if(f) f(); else render(); },
  /* sociétés */
  launch:el=>{ ui.tmp.inv=0; ui.tmp.ld=null; ui.modal={type:'launch',def:el.dataset.i}; render(); },
  launchlv:el=>{ ui.tmp.inv=+el.dataset.v; render(); },
  launchgo:el=>{ const r=launchBiz(el.dataset.i,+el.dataset.v,ui.tmp.lc,ui.tmp.ld); if(r.ok) ui.modal=null; after(r,D.biz[el.dataset.i].startup?'Start-up lancée.':'Société lancée.'); },
  bizopen:el=>{ ui.modal={type:'biz',id:+el.dataset.i}; render(); },
  upgrade:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); ask('Agrandir '+b.name,'Passer au niveau '+(b.lvl+1)+' coûte <b>'+eur(upgradeCost(b),0)+'</b> et prend '+(Math.ceil(bizDef(b).launch*0.6)+4*b.lvl)+' jours. Les ventes, les postes à pourvoir et les charges augmentent.','Agrandir',()=>after(upgradeBiz(b),'Agrandissement lancé.')); },
  sellbiz:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); ask('Céder '+b.name,'Vous encaissez <b>'+eur(sellPrice(b),0)+'</b> et licenciez '+plu(headcount(b),'employé')+'.','Céder',()=>{ ui.modal=null; after(closeBiz(b),'Société cédée.'); }); },
  setmkt:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setMkt(b,+el.dataset.v); after(); },
  setwk:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setWeekend(b,el.dataset.v==='1'); after(); },
  candopen:el=>{ const k=el.dataset.i,r=el.dataset.j; ui.candRole[k]=ui.candRole[k]===r?null:r; render(); },
  candrefresh:el=>{ const e=entByKey(el.dataset.i); after(refreshCands(e,el.dataset.j)); },
  hire:el=>{ const e=entByKey(el.dataset.i); after(hire(e,el.dataset.j,+el.dataset.v),'Embauche réussie.'); },
  hirefill:el=>{ const e=entByKey(el.dataset.i), r=el.dataset.j; const slot=entRoles(e).find(x=>x[0]===r); const have=(e.staff[r]||{n:0}).n; after(hireFill(e,r,slot[1]-have)); },
  fire:el=>{ const e=entByKey(el.dataset.i); after(fire(e,el.dataset.j,1)); },
  /* banque */
  banklic:()=>after(bankLicence(),'Licence obtenue.'),
  bankfees:el=>{ S.bank.fees=+el.dataset.v; after(); },
  bankmkt:el=>{ S.bank.mk=+el.dataset.v; after(); },
  bankbranch:()=>after(buyBranch(),'Agence ouverte.'), bankatm:()=>after(buyAtm(),'Distributeur installé.'),
  bankinj:()=>{ const a=readIn('in-cap'); ui.qty.cap=''; after(bankInject(a),'Capital injecté.'); },
  bankwd:()=>{ const a=readIn('in-cap'); ui.qty.cap=''; after(bankWithdraw(a),'Capital retiré.'); },
  bankacc:el=>after(acceptApp(+el.dataset.i)), bankref:el=>after(refuseApp(+el.dataset.i)),
  /* marchés */
  mksub:el=>{ ui.sub.markets=el.dataset.i; render(); },
  owner:el=>{ ui.owner=el.dataset.i; render(); },
  buy:el=>{ const cl=el.dataset.i, id=el.dataset.j; const a=readIn('amt-'+cl+'-'+id); ui.qty[cl+id]=''; after(buyAsset(ui.owner,cl,id,a)); },
  sell:el=>after(sellAsset(ui.owner,el.dataset.i,el.dataset.j,+el.dataset.v)),
  livdep:()=>{ const a=readIn('in-liv'); ui.qty.liv=''; after(livretMove(a)); }, livwd:()=>{ const a=readIn('in-liv'); ui.qty.liv=''; after(livretMove(-a)); },
  vcinv:el=>{ const a=readIn('in-vc'+el.dataset.i); ui.qty['vc'+el.dataset.i]=''; after(vcInvest(+el.dataset.i,a)); },
  vcsell:el=>after(vcSell(+el.dataset.i)),
  /* immobilier, luxe, pays */
  renov:el=>after(renovate(+el.dataset.i),'Travaux lancés.'), sellprop:el=>after(sellProp(+el.dataset.i)), buyprop:el=>after(buyProp(+el.dataset.i),'Bien acquis.'),
  build:el=>after(startBuild(el.dataset.i),'Chantier lancé.'),
  buylux:el=>after(buyLux(el.dataset.i),'Acquisition réussie.'), sellux:el=>after(sellLux(el.dataset.i)),
  buycountry:el=>{ const c=D.COUNTRIES.find(x=>x.id===el.dataset.i); ask('Acheter '+c.n,'Prix : <b>'+eur(c.price,0)+'</b>. Vous deviendrez le souverain de ce pays.','Acheter',()=>{ const r=buyCountry(c.id); if(r.ok&&S.flashWin){ ui.modal={type:'win'}; S.flashWin=false; } after(r); }); },
  ctypj:el=>after(ctyStart(el.dataset.v)),
  sellcountry:()=>ask('Céder le pays','Vous le revendez à 70 % de sa valeur.','Céder',()=>after(sellCountry())),
  /* politique */
  lobpre:el=>{ ui.tmp.lob=+el.dataset.v; render(); },
  lobpro:el=>after(lobby(+el.dataset.i,'pro',lobbyPresets()[ui.tmp.lob??1])), lobcon:el=>after(lobby(+el.dataset.i,'con',lobbyPresets()[ui.tmp.lob??1])),
  donate:el=>after(donate(+el.dataset.v)), decree:el=>after(decree(el.dataset.i),'Décret promulgué.'),
  /* comptes */
  borrow:()=>{ const a=readIn('in-bor'); ui.qty.bor=''; after(borrow(a)); },
  repay:el=>{ const d=S.debts.find(x=>x.id===+el.dataset.i); const a=el.dataset.v==='all'?d.p:Math.min(d.p,Math.max(0,S.cash)); after(repay(d.id,a)); },
  /* réglages */
  export:async()=>{ const t=await exportCode(); const done=()=>toast('Code de sauvegarde copié.','good'); const fb=()=>{ ui.tmp.exp=t; toast('Copie impossible : le code est affiché ci-dessous.','bad'); const ta=$('#ta-imp'); if(ta){ ta.value=t; ta.select(); } };
    try{ navigator.clipboard.writeText(t).then(done,fb); }catch(e){ fb(); } },
  savenow:()=>{ SV.dirty=true; svFlush().then(ok=>toast(ok?'Partie sauvegardée sur cet appareil.':'Sauvegarde impossible sur cet appareil : copiez le code de sauvegarde.',ok?'good':'bad')); },
  import:async()=>{ const t=$('#ta-imp').value; if(await importCode(t)){ ui.modal=null; toast('Partie importée.','good'); computeNW(); render(); SV.dirty=true; svFlush(); } else toast('Code invalide.','bad'); },
  menu:async()=>{ stopAuto(false); RPT=null; ui.mq=[]; await svFlush(); S=null; SV.slot=0; ui.modal=null; ui.tab='home'; ui.delta=null; render(); },
  noop:()=>{},
  browse:()=>{ ui.modal={type:'saves'}; render(); },
  continue:async()=>{ const sl=svLast(); if(!sl) return; if(await svLoadGame(sl)){ computeNW(); ui.tab='home'; ui.delta=null; ui.modal=offmDays()>0?{type:'offline',n:offmDays()}:null; mount(); render(); } else toast('Cette sauvegarde est illisible.','bad'); },
  slotplay:async el=>{ const sl=+el.dataset.i; if(await svLoadGame(sl)){ computeNW(); ui.tab='home'; ui.delta=null; ui.modal=offmDays()>0?{type:'offline',n:offmDays()}:null; mount(); render(); } else toast('Cette sauvegarde est illisible.','bad'); },
  slotnew:el=>{ ui.modal={type:'newgame',slot:+el.dataset.i}; render(); },
  slotdel:el=>{ const sl=+el.dataset.i, m=SV.meta[sl-1]; if(!m) return; ask('Supprimer la sauvegarde','Supprimer <b>'+esc(m.name)+'</b> ('+dateL(m.day)+') ? Cette action est définitive.','Supprimer',()=>{ svDelete(sl).then(()=>{ ui.modal={type:'saves'}; render(); }); }); },
  theme:el=>{ setTheme(el.dataset.v); render(); },
  speed:el=>{ ui.speed=+el.dataset.v; render(); },
  startnew:async el=>{ const slot=+el.dataset.i||svFree()||1; const name=($('#in-name').value||'Ma Holding').trim().slice(0,40)||'Ma Holding'; const cap=+$('#sel-cap').value; const df=$('#sel-diff')? $('#sel-diff').value : 'hard'; const md=$('#sel-mode')? $('#sel-mode').value : 'classic'; await svNewGame(slot,name,cap,df,md); ui.tab='home'; ui.delta=null; ui.modal=null; mount(); render(); },
  /* raccourcis */
  baradd:el=>{ const B=navBar(); if(B.l.length+B.r.length>=PINMAX){ toast('Barre pleine : retirez un raccourci.','bad'); return; } (B.l.length<=B.r.length? B.l : B.r).push(el.dataset.i); ui.bar=B; saveUI(); render(); },
  barrm:el=>{ const B=navBar(); B.l=B.l.filter(k=>k!==el.dataset.i); B.r=B.r.filter(k=>k!==el.dataset.i); ui.bar=B; saveUI(); render(); },
  barmove:el=>{ const B=navBar(), k=el.dataset.i, d=+el.dataset.v, s=B.l.includes(k)?'l':'r', a=B[s], i=a.indexOf(k), j=i+d; if(j<0||j>=a.length) return; a.splice(i,1); a.splice(j,0,k); ui.bar=B; saveUI(); render(); },
  barside:el=>{ const B=navBar(), k=el.dataset.i, from=B.l.includes(k)?'l':'r', to=from==='l'?'r':'l'; if(B[to].length>=2){ toast('Deux raccourcis au maximum de chaque côté.','bad'); return; } B[from]=B[from].filter(x=>x!==k); B[to].push(k); ui.bar=B; saveUI(); render(); },
  barreset:()=>{ ui.bar={l:BARDEF.l.slice(),r:BARDEF.r.slice()}; saveUI(); render(); toast('Barre rétablie.','good'); },
  /* agence de recrutement */
  agupgrade:()=>after(agencyUpgrade(),'Agence améliorée.'),
  hrset:el=>after(hrSetK(el.dataset.j,el.dataset.v)),
  agrefresh:()=>after(agencyRefresh(),'Nouveau vivier.'),
  agsearch:el=>after(agencySearch(el.dataset.j)),
  aghire:el=>after(agencyHire(+el.dataset.i,el.dataset.j)),
  agrole:el=>{ ui.agRole=el.dataset.v; render(); }
};
const CH={
  setpol:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setPol(b,el.value/100); after(); },
  setprice:el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); setPrice(b,el.value/100); after(); },
  setrd:el=>{ setBankRate('rd',+el.value); after(); }, setrl:el=>{ setBankRate('rl',+el.value); after(); },
  polauto:el=>{ setPolicy('auto',el.checked); after(); }, polg:el=>{ setPolicy('minG',el.value); after(); }, polc:el=>{ setPolicy('minC',+el.value); after(); },
  ctax:el=>{ setCountry('rate',el.value/100); after(); }, cspend:el=>{ setCountry('spend',el.value/100); after(); },
  ledf:el=>{ ui.tmp.lf=el.value; render(); }
};
function setTheme(v){
  ui.theme=v; const r=document.documentElement; if(v==='light'||v==='dark') r.setAttribute('data-theme',v); else r.removeAttribute('data-theme');
  saveUI();
}

/* ---------- Événements ---------- */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-a]'); if(!el) return;
  const f=ACT[el.dataset.a]; if(!f) return;
  if(el.disabled) return; if(el.dataset.dis){ toast(el.dataset.why||'Indisponible pour le moment.'); return; }
  if(el.dataset.dis){ toast(el.dataset.why||'Indisponible pour le moment.'); return; }
  try{ f(el,e); }catch(err){ console.error(err); toast('Une erreur est survenue : '+err.message,'bad'); }
});
document.addEventListener('change',e=>{
  const el=e.target.closest('[data-ch]'); if(!el||!CH[el.dataset.ch]) return;
  try{ CH[el.dataset.ch](el); }catch(err){ console.error(err); toast('Une erreur est survenue : '+err.message,'bad'); }
});
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset&&el.dataset.live){ const lb=document.getElementById(el.dataset.live); const v=+el.value; if(lb) lb.textContent= el.dataset.fmt==='p1'? v.toFixed(1)+' %' : Math.round(v)+' %'; }
  if(el.dataset&&el.dataset.q!==undefined) ui.qty[el.dataset.q]=el.value;
  if(el.id==='in-cap') ui.qty.cap=el.value;
});
document.addEventListener('pointerdown',()=>{ ui.down=true; },true);
['pointerup','pointercancel'].forEach(k=>document.addEventListener(k,()=>{ setTimeout(()=>{ ui.down=false; },60); },true));
document.addEventListener('visibilitychange',()=>{ if(document.hidden){ if(ui.auto){ stopAuto(false); ui.rptLater=true; } if(S) { SV.dirty=true; svFlush(); } } else if(ui.rptLater&&S){ openAutoReport(); render(); } });
window.addEventListener('pagehide',()=>{ if(S){ SV.dirty=true; svFlush(); } });

/* ---------- Démarrage ---------- */
(async function init(){
  try{ const u=JSON.parse(localStorage.getItem('grandlivre.ui')||'null'); if(u){ if(VIEWS[u.tab]) ui.tab=u.tab; if(Array.isArray(u.recent)) ui.recent=u.recent.filter(k=>VIEWS[k]).slice(0,3); if(u.speed) ui.speed=u.speed; if(u.theme) setTheme(u.theme); if(u.rp&&Array.isArray(u.rp.order)) ui.rp=u.rp; if(u.bar&&Array.isArray(u.bar.l)) ui.bar=u.bar; else if(Array.isArray(u.pins)) ui.bar={l:u.pins.filter((k,i)=>i%2===0),r:u.pins.filter((k,i)=>i%2===1)}; } }catch(e){}
  render();
  try{ await svInit(); }catch(e){ SV.ready=true; }
  if(!S) render();
})();

