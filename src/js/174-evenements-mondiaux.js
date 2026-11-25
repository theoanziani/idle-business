/* ============================================================
   V2.8.2 : ÉVÉNEMENTS MONDIAUX (refonte des crises)
   2 à 4 par an, 30 à 60 jours chacun. Quand l'un commence, une fenêtre s'ouvre après le rapport du jour :
   illustration animée, effet chiffré sur vos sociétés et vos usines, et 2 ou 3 choix (parade, économies,
   laisser passer ; ou campagne pour profiter d'un événement favorable). Pendant l'événement, une carte sur
   l'accueil montre les jours restants, l'effet depuis le début et ce qu'il aurait coûté sans parade.
   Les anciennes crises de groupe (V1.6.6) sont remplacées.
   État : S.wmo = {k, since, until, ch, acc, est, seen} ; S.wmoN = premier jour possible du suivant.
   ============================================================ */
const WMO={
  nrj:{n:'Crise énergétique mondiale', d:45, txt:'Les prix du gaz et de l’électricité triplent sur tous les continents.', par:'Contrats d’énergie à prix fixe',
    biz:{dc:{fx:1.25}, warehouse:{fx:1.25}, airline:{fx:1.2}, shipping:{fx:1.2}, renew:{rv:1.4}}, fab:{nrj:1.6}},
  tou:{n:'Krach du tourisme', d:40, txt:'Les voyageurs annulent en masse : les réservations s’effondrent partout.', par:'Campagne de promotion',
    biz:{hotel:{rv:.8}, park:{rv:.8}, resto:{rv:.85}, fastfood:{rv:.9}, airline:{rv:.8}}},
  grv:{n:'Grève des transports', d:30, txt:'Trains, camions et ports à l’arrêt dans de nombreux pays.', par:'Prime aux transporteurs',
    biz:{super:{rv:.85}, ecom:{rv:.85}, warehouse:{rv:.85}, shipping:{rv:.85}, repair:{rv:.9}}},
  cyb:{n:'Cyberattaque mondiale', d:30, txt:'Un logiciel malveillant paralyse des milliers d’entreprises.', par:'Cellule de crise informatique',
    biz:{saas:{rv:.75}, dc:{rv:.8}, ecom:{rv:.8}, ai:{rv:.8}, agency:{rv:.85}, cyber:{rv:1.4}}},
  krach:{n:'Krach boursier', d:35, txt:'Les marchés perdent un quart de leur valeur en quelques séances.', par:'Plan de soutien des ventes',
    biz:{gallery:{rv:.8}, couture:{rv:.85}, promo:{rv:.85}, agency:{rv:.85}, staffing:{rv:.85}}},
  guerre:{n:'Guerre commerciale', d:60, txt:'Les grandes puissances doublent leurs droits de douane.', par:'Réorganiser vos exportations',
    biz:{shipping:{rv:.8}, dealer:{rv:.9}}, fab:{p:{aci:.85, auto:.88, comp:.9, vet:.9}}},
  pand:{n:'Pandémie', d:60, txt:'Un virus se propage : confinements et frontières fermées.', par:'Plan sanitaire et vente en ligne',
    biz:{hotel:{rv:.7}, park:{rv:.65}, resto:{rv:.75}, fastfood:{rv:.85}, airline:{rv:.7}, ecom:{rv:1.25}, saas:{rv:1.15}, super:{rv:1.1}}},
  climat:{n:'Catastrophe climatique', d:40, txt:'Tempêtes et inondations frappent plusieurs régions.', par:'Assurance et protection des sites',
    biz:{build:{rv:.85}, promo:{rv:.85}, shipping:{rv:.85}}, fab:{farm:.7}},
  puces:{n:'Pénurie de puces', d:50, txt:'Les fonderies ne suivent plus : 26 semaines de délai.', par:'Contrats d’approvisionnement',
    biz:{dealer:{rv:.85}, repair:{rv:.85}, dc:{rv:.9}}, fab:{p:{comp:1.35}}},
  banque:{n:'Crise bancaire', d:45, txt:'Retraits massifs : le crédit devient rare et cher.', par:'Ligne de crédit de secours',
    biz:{agency:{rv:.8}, promo:{rv:.8}, build:{rv:.85}}},
  sech:{n:'Sécheresse mondiale', d:50, txt:'Récoltes en baisse de 30 % : les prix alimentaires grimpent.', par:'Contrats d’irrigation',
    biz:{resto:{cg:1.1}, fastfood:{cg:1.1}, super:{cg:1.08}}, fab:{farm:.7, p:{alim:1.3, agro:1.15}}},
  tech:{n:'Boom technologique', d:40, good:1, txt:'Une vague d’innovations fait s’envoler la demande numérique.', par:'Campagne pour en profiter',
    biz:{saas:{rv:1.3}, ai:{rv:1.35}, dc:{rv:1.25}}, fab:{p:{comp:1.2}}},
  coupe:{n:'Coupe du monde', d:30, good:1, txt:'Le monde entier suit le tournoi : restaurants et hôtels pleins.', par:'Campagne pour en profiter',
    biz:{resto:{rv:1.15}, fastfood:{rv:1.2}, hotel:{rv:1.15}, park:{rv:1.1}, studio:{rv:1.2}}},
  jeux:{n:'Grands jeux internationaux', d:35, good:1, txt:'Des millions de visiteurs affluent pour les jeux.', par:'Campagne pour en profiter',
    biz:{hotel:{rv:1.2}, resto:{rv:1.15}, airline:{rv:1.2}, studio:{rv:1.2}}}
};
const wmoOn = () => !!(S.wmo&&S.day<=S.wmo.until);
const wmoE = () => wmoOn()? WMO[S.wmo.k] : null;
/* atténuation : parade = effets défavorables −70 % ; campagne = effets favorables +60 % */
function wmoAdj(m,ch){ if(m===undefined) return 1; if(ch==='par'&&m<1) return 1-(1-m)*.3; if(ch==='boost'&&m>1) return 1+(m-1)*1.6; return m; }
const wmoAdjF = (m,ch) => m===undefined? 1 : (ch==='par'&&m>1)? 1+(m-1)*.3 : m;   /* coûts (frais fixes, achats) */
function wmoMods(def,ch){ const E=wmoE(); if(!E||!E.biz[def]) return null; const x=E.biz[def], c= ch===undefined? S.wmo.ch : ch;
  return {rv:wmoAdj(x.rv,c), fx:wmoAdjF(x.fx,c)*(c==='eco'&&(x.rv||1)<=1? .85 : 1), cg:wmoAdjF(x.cg,c)}; }
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); if(!b||b.status!=='active'||!wmoOn()) return z; const m=wmoMods(b.def); if(!m) return z;
  z.rev*=m.rv; z.fixed*=m.fx; z.cogs*=m.cg; return z; }; }
/* usines : prix de gros par famille, énergie, récoltes */
const wmoFabP = g => { const E=wmoE(); const m=E&&E.fab&&E.fab.p&&E.fab.p[g]; return m? (m<1? wmoAdj(m,S.wmo.ch) : (E.good? wmoAdj(m,S.wmo.ch) : m)) : 1; };
const wmoFarmY = () => { const E=wmoE(); const m=E&&E.fab&&E.fab.farm; return m? wmoAdj(m,S.wmo.ch) : 1; };
{ const _fp=fabPrice; fabPrice=function(p){ const P=fabProdDef(p); return _fp(p)*(D.PRODS[p]? wmoFabP(P.g) : 1); }; }
{ const _mo=fabMOpex; fabMOpex=function(t,k,cid){ const o=_mo(t,k,cid), E=wmoE(); if(E&&E.fab&&E.fab.nrj) o.nrj*=wmoAdjF(E.fab.nrj,S.wmo.ch); return o; }; }
/* anciennes crises : remplacées */
criStep=function(){ if(S.cri) S.cri=null; };

/* ---------- ce que l'événement change pour vous ---------- */
function wmoImpact(k,ch){ const E=WMO[k], rows=[]; let day=0; const by={};
  S.biz.forEach(b=>{ if(b.status!=='active'||!E.biz[b.def]) return; const x=E.biz[b.def], m={rv:wmoAdj(x.rv,ch), fx:wmoAdjF(x.fx,ch)*(ch==='eco'&&(x.rv||1)<=1?.85:1), cg:wmoAdjF(x.cg,ch)}, L=b.last||{};
    const rev=Math.max(0,L.rev||0), base= S.wmo&&S.wmo.k===k&&wmoOn()? rev/(wmoMods(b.def)||{rv:1}).rv : rev;
    const fx=Math.max(0,(L.fixed!==undefined? L.fixed : rev*.25)), cg=Math.max(0,(L.cogs!==undefined? L.cogs : rev*.35));
    const d=base*(m.rv-1)-fx*(m.fx-1)-cg*(m.cg-1); day+=d; const g=by[b.def]||(by[b.def]={n:0,d:0,x}); g.n++; g.d+=d; });
  Object.keys(by).forEach(def=>{ const g=by[def], x=g.x, pct= x.rv? Math.round((wmoAdj(x.rv,ch)-1)*100) : x.fx? Math.round((wmoAdjF(x.fx,ch)-1)*100) : Math.round((wmoAdjF(x.cg,ch)-1)*100);
    rows.push([(D.biz[def]?D.biz[def].n:def)+(g.n>1?' ('+g.n+')':''), (x.rv? 'ventes ' : x.fx? 'frais fixes ' : 'achats ')+(pct>0?'+':'')+pct+' %', pct*(x.rv?1:-1)>=0]); });
  if(E.fab&&typeof fabSites==='function'&&fabSites().length){ const F=S.fab.day||{rev:0,cost:0};
    if(E.fab.p) Object.keys(E.fab.p).forEach(g=>{ const has=fabSites().some(s=>s.lines.some(l=>D.PRODS[l.p].g===g)||(g==='alim'&&s.t==='farm')); if(!has) return;
      const m=E.fab.p[g], a= m<1||E.good? wmoAdj(m,ch) : m, pct=Math.round((a-1)*100); rows.push(['Vos usines · '+D.GOODS[g].n.toLowerCase(),'prix de gros '+(pct>0?'+':'')+pct+' %',pct>=0]); day+=(F.rev||0)*.3*(a-1); });
    if(E.fab.nrj){ const a=wmoAdjF(E.fab.nrj,ch), pct=Math.round((a-1)*100); rows.push(['Vos usines','énergie +'+pct+' %',false]); day-=(F.cost||0)*.33*(a-1); }
    if(E.fab.farm&&fabSites().some(s=>s.t==='farm')){ const a=wmoAdj(E.fab.farm,ch), pct=Math.round((a-1)*100); rows.push(['Vos fermes','récoltes '+pct+' %',false]); } }
  return {rows, day}; }
const wmoCost = k => { const E=WMO[k], a=wmoImpact(k,'none').day, b=wmoImpact(k,E.good?'boost':'par').day; return Math.max(1e4,Math.round(Math.abs(b-a)*E.d*.35/1e3)*1e3); };
function wmoChoices(k){ const E=WMO[k], c=wmoCost(k);
  return E.good? [{k:'boost', n:E.par, d:'Effets favorables +60 %.', c}, {k:'none', n:'Laisser faire', d:'Aucun coût.', c:0}]
    : [{k:'par', n:E.par, d:'Effets défavorables réduits de 70 %.', c}, {k:'eco', n:'Mesures d’économie', d:'Frais fixes des sociétés touchées −15 %, réputation −1.', c:0}, {k:'none', n:'Laisser passer', d:'Aucun coût, l’effet complet s’applique.', c:0}]; }

/* ---------- calendrier ---------- */
function wmoStep(){ if(S.wmoN===undefined) S.wmoN=Math.max(S.day+60,120)+Math.floor(rnd()*60);
  if(S.wmo&&S.day>S.wmo.until){ log('info','Fin de l’événement : '+WMO[S.wmo.k].n.toLowerCase()+'.'); S.wmoLast=S.wmo; S.wmo=null; S.wmoN=S.day+60+Math.floor(rnd()*90); return; }
  if(wmoOn()){ const w=S.wmo, a=wmoImpact(w.k,w.ch||'none').day, n=wmoImpact(w.k,'none').day; w.acc+=a; w.est+=n; return; }
  if(S.day<S.wmoN||!S.biz.some(b=>b.status==='active')) return;
  const ks=Object.keys(WMO).filter(k=>k!==(S.wmoLast&&S.wmoLast.k)), mine=ks.filter(k=>S.biz.some(b=>b.status==='active'&&WMO[k].biz[b.def]));
  const k=pick(mine.length? mine : ks), E=WMO[k], d=E.d+Math.floor(rnd()*11)-5;
  S.wmo={k, since:S.day, until:S.day+d, ch:null, acc:0, est:0, seen:0}; S.flashWmo=1;
  log(E.good?'good':'warn','Événement mondial : '+E.n.toLowerCase()+' ('+d+' jours).'); }
{ const _cs=checkChal; checkChal=function(){ const r=_cs.apply(this,arguments); try{ wmoStep(); }catch(e){ console.error(e); } return r; }; }
/* la fenêtre s'ouvre après le rapport du jour */
{ const _dn=doNext; doNext=function(){ const r=_dn.apply(this,arguments); if(S&&S.flashWmo&&!S.over){ S.flashWmo=0; if(ui.auto&&typeof stopAuto==='function') stopAuto(false); ui.wmoPick=null; pushModal({type:'wmo'}); render(); } return r; }; }
function wmoChoose(ch){ const w=S.wmo; if(!wmoOn()) return err('Aucun événement en cours.'); if(w.ch) return err('Votre choix est déjà fait.');
  const C=wmoChoices(w.k).find(x=>x.k===ch); if(!C) return err('Choix inconnu.');
  if(C.c>0){ if(S.cash<C.c) return err('Il faut '+eur(C.c,0)+'.'); payCap('gen',C.n,-C.c); }
  if(ch==='eco') S.rep=clamp(S.rep-1,0,100);
  w.ch=ch; w.seen=1; return ok(); }

/* ---------- écrans ---------- */
NF_CSS.push(WMO_CSS+`
.wmo-md .md-b{padding:0!important}
.wmo-ill{height:170px;overflow:hidden;border-radius:22px 22px 0 0;margin:-1px -1px 0}.wmo-ill svg{display:block;width:100%;height:170px}
.wmo-in{padding:14px 16px 16px}
.wmo-tag{display:inline-block;font:900 10.5px var(--f-body);letter-spacing:.12em;text-transform:uppercase;padding:5px 10px;border-radius:99px;background:#3A1D12;color:#FFB089}
.wmo-tag.good{background:#13261A;color:#6EE7A0}
.wmo-t{font:800 22px var(--f-display,var(--f-body));margin:6px 0 2px}.wmo-d{color:var(--ink-3);font:600 13px var(--f-body)}
.wmo-h{margin:12px 0 4px;font:900 11.5px var(--f-body);letter-spacing:.1em;color:var(--ink-3);text-transform:uppercase}
.wmo-box{background:var(--bg-2,rgba(127,127,127,.08));border-radius:16px;padding:2px 12px;margin-bottom:10px}
.wmo-r{display:flex;justify-content:space-between;gap:8px;padding:8px 0;border-bottom:1px solid var(--line);font:600 13.5px var(--f-body)}.wmo-r:last-child{border:0}
.wmo-neg{color:#FF7B72;font-weight:900}.wmo-pos{color:#5BE39A;font-weight:900}
.wmo-ch{display:block;width:100%;text-align:left;border:1.5px solid var(--line);background:transparent;color:var(--ink);border-radius:16px;padding:11px 12px;margin-bottom:8px;min-height:48px}
.wmo-ch.on{border-color:#E8B84A;background:rgba(232,184,74,.1)}.wmo-ch b{font:800 14.5px var(--f-body)}.wmo-ch small{display:block;font:600 12.5px var(--f-body);color:var(--ink-3);margin-top:2px}
.wmo-ch .row{display:flex;justify-content:space-between;align-items:center;gap:8px}.wmo-pill{font:800 11px var(--f-body);padding:4px 8px;border-radius:99px;background:var(--line);white-space:nowrap}
.wmo-go{display:block;width:100%;min-height:50px;border:0;border-radius:16px;background:#E8B84A;color:#2A1C00;font:900 15px var(--f-body);margin-top:6px}
.wmo-card{background:#160C07;border:1px solid #5A2A14;border-radius:20px;padding:12px 14px;margin-bottom:12px;color:#F2F3F7}
.wmo-card.good{background:#0B1A10;border-color:#1F5A33}
.wmo-card .top{display:flex;gap:12px;align-items:center}.wmo-ico{width:44px;height:44px;border-radius:12px;overflow:hidden;flex:0 0 44px}.wmo-ico svg{width:100%;height:100%}
.wmo-card b{font:800 15px var(--f-body)}.wmo-card small{display:block;color:#B7B9C4;font:600 12.5px var(--f-body)}
.wmo-pg{height:6px;background:#2A2A30;border-radius:3px;overflow:hidden;margin:10px 0 8px}.wmo-pg i{display:block;height:100%;background:#FF8A50}.wmo-card.good .wmo-pg i{background:#5BE39A}
.wmo-jr{font:900 12px var(--f-body);padding:4px 9px;border-radius:99px;background:#3A1D12;color:#FFB089;margin-left:auto;white-space:nowrap}.wmo-card.good .wmo-jr{background:#13261A;color:#6EE7A0}
.wmo-l{display:flex;justify-content:space-between;font:600 12.5px var(--f-body);color:#B7B9C4;margin-top:2px}`);
try{ const e=document.getElementById('nf-css'); if(e) e.textContent+='\n'+NF_CSS[NF_CSS.length-1]; else nfCssOnce(); }catch(e){}
const wmoSigned = v => '<span class="'+(v>=0?'wmo-pos':'wmo-neg')+'">'+(v>=0?'+':'−')+eur(Math.abs(v),0)+'</span>';
{ const _mc=modalContent; modalContent=function(){ const m=ui.modal; if(!(m&&m.type==='wmo')) return _mc(); if(!wmoOn()){ ui.modal=null; return _mc(); }
    const w=S.wmo, E=WMO[w.k], pickK=ui.wmoPick||w.ch||(E.good?'boost':'par'), I=wmoImpact(w.k,pickK), d=w.until-w.since+1;
    let b='<div class="wmo-ill">'+WMO_ART[w.k]+'</div><div class="wmo-in"><span class="wmo-tag'+(E.good?' good':'')+'">Événement mondial · '+d+' jours</span><div class="wmo-t">'+E.n+'</div><div class="wmo-d">'+E.txt+'</div>';
    b+='<div class="wmo-h">Pour votre groupe</div><div class="wmo-box">'+(I.rows.length? I.rows.map(r=>'<div class="wmo-r"><span>'+esc(r[0])+'</span><span class="'+(r[2]?'wmo-pos':'wmo-neg')+'">'+r[1]+'</span></div>').join('')+'<div class="wmo-r"><span>Effet estimé</span>'+wmoSigned(I.day)+'<span style="display:none"></span></div>' : '<div class="wmo-r"><span>Aucune de vos activités n’est touchée.</span></div>')+'</div>';
    if(w.ch){ b+='<div class="wmo-h">Votre choix</div><div class="wmo-box"><div class="wmo-r"><span>'+esc(wmoChoices(w.k).find(x=>x.k===w.ch).n)+'</span></div></div><button class="wmo-go" data-a="closemodal">Fermer</button>'; }
    else { b+=wmoChoices(w.k).map(c=>'<button class="wmo-ch'+(pickK===c.k?' on':'')+'" data-a="wmopick" data-i="'+c.k+'"><span class="row"><b>'+esc(c.n)+'</b><span class="wmo-pill">'+(c.c? eur(c.c,0) : c.k==='eco'? 'gratuit' : '0 €')+'</span></span><small>'+c.d+'</small></button>').join('')+
      '<button class="wmo-go" data-a="wmogo">Valider ce choix</button>'; }
    return {title:'Événement mondial', body:b+'</div>'}; }; }
{ const _ap=nfApply; nfApply=function(){ _ap.apply(this,arguments); const md=document.querySelector('.md'); if(md) md.classList.toggle('wmo-md',!!(ui.modal&&ui.modal.type==='wmo')); }; }
function wmoCard(){ if(!wmoOn()) return ''; const w=S.wmo, E=WMO[w.k], L=w.until-S.day, tot=w.until-w.since, ch=w.ch? wmoChoices(w.k).find(x=>x.k===w.ch) : null;
  return '<div class="wmo-card'+(E.good?' good':'')+'" data-a="wmoopen" role="button"><div class="top"><span class="wmo-ico">'+WMO_ART[w.k].replace('class="wmo-art"','class="wmo-art" style="width:44px;height:44px"')+'</span><span><b>'+E.n+'</b><small>'+(ch? ch.n : 'Choisissez votre réponse')+'</small></span><span class="wmo-jr">J-'+Math.max(0,L)+'</span></div>'+
    '<div class="wmo-pg"><i style="width:'+Math.round(clamp((S.day-w.since)/Math.max(1,tot),0,1)*100)+'%"></i></div>'+
    '<div class="wmo-l"><span>Effet depuis le début</span>'+wmoSigned(w.acc)+'</div>'+(w.ch&&w.ch!=='none'? '<div class="wmo-l"><span>'+(E.good?'Sans campagne':'Sans parade')+', estimé</span>'+wmoSigned(w.est)+'</div>' : '')+'</div>'; }
{ const _vh=VIEWS.home; VIEWS.home=function(){ const h=_vh.apply(this,arguments), c=wmoCard(); if(!c) return h; const k=h.indexOf('<section'); return k>0? h.slice(0,k)+c+h.slice(k) : c+h; }; }
Object.assign(ACT,{
  wmopick:el=>{ ui.wmoPick=el.dataset.i; render(); },
  wmogo:()=>{ const E=WMO[S.wmo.k], r=wmoChoose(ui.wmoPick||(E.good?'boost':'par')); if(r.ok){ ui.wmoPick=null; closeModal(); after(); } else after(r); },
  wmoopen:()=>{ ui.wmoPick=null; pushModal({type:'wmo'}); render(); }
});
/* sauvegardes : une ancienne crise en cours est effacée */
{ const _mig=migrateState; migrateState=function(st){ const r=_mig(st); if(r&&r.cri) r.cri=null; return r; }; }
