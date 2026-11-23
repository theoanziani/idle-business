/* ============================================================
   V2.2.6 : FICHES PAR FAMILLE D'ACTIVITÉ
   Les chiffres du résumé, le nom de l'onglet principal et une ligne « À faire » dépendent de la famille :
   usine, accueil du public, numérique, services. (Affichage seulement, aucun état sauvegardé.)
   ============================================================ */
/* V2.2.6 : noms de familles manquants (le badge affichait « Métier ») */
Object.assign(MET_FAM,{num:'Numérique', com:'Commerce et services', lux:'Luxe et création', imm:'Immobilier et construction'}, MET_FAM);
const FAM_UI = {
  usine:{defs:['textile','electronics','farm'], tab:'Production'},
  public:{defs:['resto','hotel','park','repair','dealer','gallery','couture'], tab:'Activité'},
  num:{defs:['saas','dc','ecom'], tab:'Plateforme'},
  serv:{defs:[], tab:'Activité'}
};
const FAM_KPI={build:0, staffing:2, promo:0, office:0, studio:0, warehouse:0, shipping:0, renew:1, airline:0, gallery:1, couture:0, dealer:0, hotel:0, park:0, dc:0};
function famOf(b){ for(const k in FAM_UI) if(FAM_UI[k].defs.includes(b.def)) return k; return 'serv'; }
/* chiffre central du résumé : [libellé, valeur] */
function famStat(b){ const f=famOf(b), l=b.last, m=b.m||{};
  if(f==='usine') return ['Production / j', eur(b.prodDayV||0,0)];
  if(b.def==='saas'&&m.P!==undefined) return ['Abonnés payants', fmtN(Math.round((m.P||0)+(m.E||0)))];
  if(b.def==='ecom'&&m.stats) return ['Commandes / j', fmtN(Math.round(m.stats.orders||0))];
  /* V2.2.7 : chiffre clé propre à l'activité (indice de l'indicateur du métier) */
  if(FAM_KPI[b.def]!==undefined){ try{ const k=metKpis(b)[FAM_KPI[b.def]]; if(k&&k[1]&&k[1]!=='—') return [k[0].replace(/ \/ ?jour$/,' / j'),k[1]]; }catch(e){} }
  if(f==='public'){ try{ const k=metKpis(b)[0]; if(k&&/\/ ?jour|par jour/.test(k[0])) return [k[0].replace(/ \/ ?jour| par jour/,' / j'),k[1]]; }catch(e){} return null; }
  return ['Ventes / j', l&&l.rev? eur(l.rev,0) : '—']; }
/* une action utile maintenant, ou rien */
function famTodo(b){ if(b.status!=='active') return null; const l=b.last, roles=entRoles(b).reduce((a,x)=>a+x[1],0), hc=headcount(b);
  if(isFact(b)){ fpInit(b); const g=goodOf(b), I=indInit(), st=fpRefValue(b), cap=factCap(b);
    if(b.fmode==='store'&&st>cap*.9) return ['Stock presque plein','Vendez le stock ou passez en vente au gros (onglet Production).'];
    const o=I.offers.find(x=>prodsOf(b).includes(x.p)); if(o&&I.active.length<5) return ['Contrat à signer',o.client+' propose '+fmtN(o.qty)+' '+D.PRODS[o.p].u+' de '+D.PRODS[o.p].n.toLowerCase()+' à '+eur(o.px,2)+' (onglet Production).'];
    if(!supClients(g).length&&!b.dlg) return null; }
  if(hc<roles) return ['Postes vacants',(roles-hc)+' poste'+(roles-hc>1?'s':'')+' à pourvoir : recrutez dans l’onglet Équipe.'];
  const h=(b.hist||[]).slice(-30); if(b.def!=='saas'&&h.length>=20&&h.reduce((a,x)=>a+x,0)<0) return ['Pertes sur 30 jours','Vérifiez les prix et les réglages de l’onglet '+FAM_UI[famOf(b)].tab+', ou confiez la société à son directeur.'];
  const g=supGood(b); if(g&&!S.biz.some(x=>isFact(x)&&goodOf(x)===g&&x.status==='active')&&(l&&l.rev>0)) return null;
  return null; }
{ const _mb=modalBiz; modalBiz=function(b){ const r=_mb(b); if(!r||!r.body) return r;
  try{ const st=famStat(b);
    if(st) r.body=r.body.replace(/<div><span>Clients \/ j<\/span><b class="num">[^<]*<\/b><\/div>/,'<div><span>'+esc(st[0])+'</span><b class="num">'+esc(st[1])+'</b></div>');
    r.body=r.body.replace('<span>Fidélité moyenne</span>','<span>Fidélité de l’équipe</span>');
    const T=famTodos(b); if(T.length){ const k=r.body.indexOf('<div class="mini">'); const x='<div class="notice info fam-todo"><b>À faire maintenant</b>'+T.map(t=>'<div class="row sp td-r"><span><b>'+esc(t[0])+'</b> · '+esc(t[1])+'</span>'+(t[2]?btn('Voir','fichetab',{c:'sm ghost',v:t[2]}):'')+'</div>').join('')+'</div>'; if(k>=0) r.body=r.body.slice(0,k)+x+r.body.slice(k); }
  }catch(e){ console.error(e); }
  return r; }; }
/* nom de l'onglet principal selon la famille */
{ const _fa=ftApply; ftApply=function(){ try{ const b=ui.modal&&ui.modal.type==='biz'&&S.biz.find(x=>x.id===ui.modal.id); FT_TABS[0][1]= b? FAM_UI[famOf(b)].tab : 'Métier'; }catch(e){} return _fa(); }; }

/* « À faire maintenant » : jusqu'à 3 actions, chacune avec l'onglet à ouvrir. */
function famTodos(b){ const out=[]; if(b.status!=='active') return out; const add=(a,c,t)=>{ if(out.length<3&&!out.some(x=>x[0]===a)) out.push([a,c,t]); };
  try{ const roles=entRoles(b).reduce((a,x)=>a+x[1],0), hc=headcount(b);
    if(hc<roles) add('Postes vacants',(roles-hc)+' poste'+(roles-hc>1?'s':'')+' à pourvoir.','eq');
    if(isFact(b)){ fpInit(b); const I=indInit(), P=prodsOf(b);
      I.active.filter(c=>c.st==='open'&&P.includes(c.p)).forEach(c=>{ const d=c.due-S.day; if(d<0) add('Contrat en retard',c.client+' : livraison dépassée de '+(-d)+' j, prix réduit de 30 %.','met'); else if(d<=3) add('Contrat bientôt dû',c.client+' : '+d+' j pour livrer.','met'); });
      if(b.fmode==='store'&&fpRefValue(b)>factCap(b)*.9) add('Stock presque plein','Vendez le stock ou passez en vente au gros.','met');
      const o=I.offers.find(x=>P.includes(x.p)); if(o&&I.active.length<5) add('Contrat à signer',o.client+' propose '+fmtN(o.qty)+' '+D.PRODS[o.p].u+' de '+D.PRODS[o.p].n.toLowerCase()+' à '+eur(o.px,2)+'.','met'); }
    if(isStock(b)&&b.auto===false&&b.stock<stockTarget(b)*.3) add('Stock bas','Commande automatique désactivée : remplissez le stock.','reg');
    const h=(b.hist||[]).slice(-30); if(b.def!=='saas'&&h.length>=20&&h.reduce((a,x)=>a+x,0)<0) add('Pertes sur 30 jours','Vérifiez les prix et les réglages, ou confiez la société à son directeur.','met');
  }catch(e){ console.error(e); }
  return out; }
/* Tous les boutons indisponibles restent touchables et disent pourquoi (toast). */
function disPass(){ document.querySelectorAll('button.btn[disabled],button.pk-o[disabled]').forEach(el=>{ if(!el.dataset.a||el.dataset.a==='noop') return;
  el.disabled=false; el.setAttribute('aria-disabled','true'); el.dataset.dis='1'; if(!el.dataset.why) el.dataset.why=disWhy(el.textContent,{t:el.getAttribute('title')||''}); }); }
{ const _r=render; render=function(){ const out=_r.apply(this,arguments); try{ disPass(); }catch(e){ console.error(e); } return out; }; }
/* Aide de première visite : une phrase par écran, fermée une fois pour toutes. */
const TIP1={
  home:'Accueil : votre tableau de bord. « Jour suivant » fait avancer le temps ; les alertes indiquent ce qui demande votre attention.',
  biz:'Sociétés : toutes vos activités. Touchez une société pour ouvrir sa fiche ; le bloc « À faire maintenant » y résume les urgences.',
  bank:'Banque : empruntez pour financer vos projets et remboursez quand la trésorerie le permet.',
  markets:'Marchés : placez votre trésorerie. Les achats et les ventes ne se font que lorsque le marché est ouvert.',
  immo:'Immobilier : achetez des biens pour toucher des loyers ou y installer vos sociétés.',
  luxe:'Luxe : des biens de prestige à acheter et à revendre ; ils comptent dans votre valeur nette.',
  pol:'Politique : lobbying, dons et décrets pèsent sur les lois qui touchent vos sociétés.',
  agency:'Agence de recrutement : recrutez vos équipes et vos directeurs. Un directeur gère seul une partie du groupe contre un salaire quotidien.',
  logi:'Logistique : vue d’ensemble de vos usines et de ce qu’elles livrent à vos sociétés.',
  cities:'Villes : une nouvelle ville s’ouvre quand votre valeur nette atteint le seuil indiqué.',
  rivals:'Concurrents : suivez vos rivaux et défendez vos parts de marché.',
  auction:'Enchères : des lots en vente pour quelques jours ; la meilleure offre l’emporte.'};
function tipPass(){ const v=document.getElementById('view'); if(!v||!TIP1[ui.tab]||!S) return;
  if(!S.tips){ S.tips={}; if((S.day||0)>30) Object.keys(TIP1).forEach(k=>S.tips[k]=1); }
  if(S.tips[ui.tab]||v.querySelector('.tip1')) return;
  const d=document.createElement('div'); d.className='notice info tip1'; d.innerHTML='<span>'+esc(TIP1[ui.tab])+'</span><button class="btn sm ghost tip-x" data-a="tipx" data-v="'+ui.tab+'" aria-label="Fermer">OK</button>';
  const h=v.querySelector('h1'); if(h) h.after(d); else v.prepend(d); }
ACT.tipsreset=()=>{ S.tips={}; Object.keys(TIP1).forEach(k=>S.tips[k]=0); toast('Les aides réapparaîtront à la prochaine visite de chaque écran.','good'); render(); };
ACT.tipx=el=>{ S.tips=S.tips||{}; S.tips[el.dataset.v]=1; render(); };
{ const _r=render; render=function(){ const out=_r.apply(this,arguments); try{ tipPass(); }catch(e){ console.error(e); } return out; }; }
/* Écran Sociétés : dès 4 sociétés, « Vos sociétés » passe avant les villes. */
{ const _vbh3=vBizHome; vBizHome=function(){ const h=_vbh3(); try{ if(S.biz.length<4) return h; const V='<div class="cat-h">Villes</div>', Y='<div class="cat-h">Vos sociétés</div>', a=h.indexOf(V), b=h.indexOf(Y);
  if(a<0||b<a) return h; return h.slice(0,a)+h.slice(b)+h.slice(a,b); }catch(e){ return h; } }; }

