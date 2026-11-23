/* ============================================================
   V1.2.6 : onglet Métier en blocs repliables
   Les indicateurs restent visibles ; chaque bloc (sections du métier, réglages, délégation,
   paliers et achats, journal) est replié avec un résumé d'une ligne. État : S.mfold
   (clé « activité:bloc » → ouvert), valeur par défaut {} (tout replié).
   ============================================================ */
const MF_SPLIT=/^(Le chef|Directeur artistique|Égérie|Artisans)/;
function mfTxt(el){ return ((el&&el.textContent)||'').replace(/\s+/g,' ').trim(); }
function mfHead(el){ const h=el.querySelector('.tag,h3,b'); return mfTxt(h); }
function mfCut(t,n){ n=n||70; try{ if(typeof LANG!=='undefined'&&LANG!=='fr') t=tr(t); }catch(e){} return t.length>n? t.slice(0,n-1).trim()+'…' : t; }
function mfOn(el){ const o=el.querySelector('.seg .on'); return o? mfTxt(o) : ''; }
/* V2.2.6 : S.mfold[k] : 1 ouvert, 0 fermé par le joueur ; sans valeur, ouvert si le bloc l’est par défaut (premier bloc du métier, débouchés) */
function mfWrap(def,key,title,sum,nodes,defOpen){
  const d=document.createElement('details'); d.className='mf'; d.dataset.k=def+':'+key; const v=S.mfold&&S.mfold[d.dataset.k]; if(v===1||v===true||(v===undefined&&defOpen)) d.open=true;
  d.innerHTML='<summary><span><b>'+esc(title)+'</b>'+(sum?'<small>'+esc(sum)+'</small>':'')+'</span></summary>';
  const box=document.createElement('div'); box.className='mf-b'; nodes.forEach(n=>box.appendChild(n)); d.appendChild(box); return d;
}
function mfApply(){
  if(!ui.modal||ui.modal.type!=='biz') return; const M=document.getElementById('bj-met'); if(!M||M.dataset.mf) return; M.dataset.mf='1';
  const b=S.biz.find(x=>x.id===ui.modal.id); if(!b) return; const def=b.def, out=[];
  /* sections propres au métier */
  const plan=M.querySelector(':scope > .met-plan');
  if(plan){ const kids=[...plan.children], groups=[]; let g=null;
    kids.forEach(el=>{ const head=el.classList.contains('pk-head'), t=mfHead(el);
      if(head||!g||MF_SPLIT.test(t)){ g={title: t||'Gestion', sum: head? mfTxt(el).replace(t,'').trim() : '', nodes:[]}; groups.push(g); if(head) return; }
      g.nodes.push(el); });
    groups.forEach((g,i)=>{ if(!g.sum){ const s=g.nodes.map(n=>n.querySelector('small,.sub')).find(Boolean); g.sum= g.nodes.length>1? g.nodes.length+' éléments' : mfTxt(s); }
      out.push(mfWrap(def,'p'+i+':'+g.title,g.title,mfCut(g.sum),g.nodes,i===0)); });
    plan.remove(); }
  M.querySelectorAll(':scope > .met-out').forEach(el=>{ out.push(mfWrap(def,'out:'+el.dataset.t,el.dataset.t,mfCut(el.dataset.s||''),[el],true)); });
  /* réglages, délégation, paliers et achats */
  const cs=M.querySelector(':scope > .met-cs');
  if(cs){ const reg=[], buy=[]; let dl=null;
    [...cs.children].forEach(el=>{ const t=mfHead(el); if(/^Délégation/.test(t)) dl=el; else if(/^Maîtrise/.test(t)||el.classList.contains('met-buy')) buy.push(el); else reg.push(el); });
    if(reg.length) out.push(mfWrap(def,'reg','Prix et réglages',mfCut(reg.slice(0,2).map(el=>{ const t=mfHead(el), o=mfOn(el); return o? t+' : '+o.toLowerCase() : t; }).join(' · ')),reg));
    if(dl) out.push(mfWrap(def,'dl','Délégation',mfOn(dl)||'',[dl]));
    if(buy.length){ const mx=buy.find(el=>/^Maîtrise/.test(mfHead(el))), r=mx&&mfHead(mx).match(/palier (\d) sur 5/), n=buy.filter(el=>el.querySelector('button.pri:not([disabled])')).length;
      out.push(mfWrap(def,'buy','Paliers et achats',(r?'Palier '+r[1]+' sur 5':'')+(n? (r?' · ':'')+n+' achat'+(n>1?'s':'')+' possible'+(n>1?'s':'') : ''),buy)); }
    cs.remove(); }
  const lg=M.querySelector(':scope > .met-log');
  if(lg){ const items=[...lg.children].filter(x=>!x.classList.contains('tag')); lg.querySelector('.tag')&&lg.querySelector('.tag').remove();
    out.push(mfWrap(def,'log','Journal du métier',items.length? mfCut(mfTxt(items[0]).replace(/^J\d+\s*/,'')) : '',[lg])); }
  out.forEach(d=>M.appendChild(d));
}
{ const _r=render; render=function(){ const o=_r.apply(this,arguments); try{ mfApply(); }catch(e){ console.error(e); } return o; }; }
document.addEventListener('toggle',e=>{ const d=e.target; if(!d||!d.classList||!d.classList.contains('mf')) return; if(!S) return; S.mfold=S.mfold||{}; S.mfold[d.dataset.k]=d.open?1:0; },true);

/* V1.4.6 : dans l'agence, les listes qui grandissent avec le nombre de sociétés deviennent des menus déroulants
   à partir de AG_FOLD lignes ; repliées par défaut, l'état est retenu (S.fcfold, clés ag_*) */
const AG_FOLD=5;
function agFoldInfo(){ const A=S.biz.filter(b=>b.status==='active'), vac=agencyVacancies(), ents=[...new Set(vac.map(v=>v.e))], np=vac.reduce((a,v)=>a+v.free,0);
  const low=A.filter(b=>b.boss&&b.boss.mood<45).length, mid=A.filter(b=>b.boss&&b.boss.mood>=45&&b.boss.mood<60).length, none=A.filter(b=>!b.boss).length, pl=A.filter(b=>planOn(b));
  return {
    'Postes à pourvoir':{k:'ag_vac', n:ents.length, s: np? np+' poste'+(np>1?'s':'')+' dans '+ents.length+' société'+(ents.length>1?'s':'') : 'Tous pourvus'},
    'Directeurs de site':{k:'ag_boss', n:A.length, s: A.length+' directeur'+(A.length>1?'s':'')+(low? ' · '+low+' au moral bas' : '')+(mid? ' · '+mid+' fragile'+(mid>1?'s':'') : '')+(none? ' · '+none+' poste'+(none>1?'s':'')+' vacant'+(none>1?'s':'') : '')+(!low&&!mid&&!none? ' · moral correct partout' : '')},
    'Planning des équipes':{k:'ag_plan', n:pl.length, s: pl.length+' société'+(pl.length>1?'s':'')+' en équipes · fatigue moyenne '+Math.round(pl.reduce((a,b)=>a+fatOf(b),0)/Math.max(1,pl.length))}
  }; }
function agFold(h){ let I; try{ I=agFoldInfo(); }catch(e){ return h; } const F=S.fcfold||{};
  return h.replace(/<section class="card ([^"]*)"><h2><span>([^<]*)<\/span><\/h2>([\s\S]*?)<\/section>/g,(all,c,t,body)=>{ const x=I[t]; if(!x||x.n<AG_FOLD) return all;
    const open=!!F[x.k], bad=t==='Directeurs de site'&&/moral bas|vacant/.test(x.s)||t==='Postes à pourvoir'&&x.s!=='Tous pourvus';
    return '<section class="card '+c+' fcd-c"><details class="fcd ag-f" data-k="'+x.k+'"'+(open?' open':'')+'><summary><span class="ag-s"><h2><span>'+t+'</span></h2><small class="'+(bad?'warn-t':'')+'">'+esc(x.s)+'</small></span></summary>'+body+'</details></section>'; }); }
{ const _va=VIEWS.agency; VIEWS.agency=function(){ return agFold(_va.apply(this,arguments)); }; }

/* V1.5.1 : dans Sociétés, vos sociétés rangées en menus déroulants par grande catégorie */
const BZ_GRP=[['com','Commerce et restauration',['commerce','restauration','online']],['loi','Loisirs et hôtellerie',['loisirs','hotel']],['lux','Luxe et médias',['luxe','media']],
  ['tec','Tech et services',['tech','bureaux']],['imm','Immobilier et construction',['immo']],['ind','Industrie et agriculture',['industrie','agri']]];
function bzGroupOf(b){ const s=bizSec(b.def); const g=BZ_GRP.find(x=>x[2].includes(s)); return g? g[0] : 'com'; }
{ const _vbh2=vBizHome; vBizHome=function(){ const h=_vbh2(); if(!S.biz.length) return h; const k=h.lastIndexOf('<div class="grid">'); if(k<0||k<h.indexOf('Vos sociétés')) return h;
  const F=S.fcfold||{}, bad=typeof bizAlertSet==='function'? bizAlertSet() : {}, many=S.biz.length>4;
  const groups=BZ_GRP.map(([g,n])=>{ const L=S.biz.filter(b=>bzGroupOf(b)===g); if(!L.length) return '';
    const tot=L.reduce((a,b)=>a+(b.last?b.last.net:0),0), nb=L.filter(b=>bad[b.id]).length, key='bz_'+g, open= F[key]===undefined? !many : !!F[key];
    return '<section class="card fcd-c bzg"><details class="fcd ag-f" data-k="'+key+'"'+(open?' open':'')+'><summary><span class="ag-s"><h2><span>'+n+'</span></h2><small>'+L.length+' société'+(L.length>1?'s':'')+' · <b class="num '+cls(tot)+'">'+signed(tot,0)+' / j</b>'+(nb? ' · <span class="warn-t">'+nb+' à surveiller</span>' : '')+'</small></span></summary><div class="grid">'+L.map(bizCard).join('')+'</div></details></section>'; }).join('');
  return h.slice(0,k)+groups; }; }


/* V1.6.6 : synergies entre vos sociétés (liens actifs et liens à débloquer) */
const SYN=[
  ['farm',['resto','fastfood','super','hotel'],'Marchandises moins chères : −15 %, hôtels −10 %.'],
  ['renew',null,'Énergie −40 % pour les usines, data centers et entrepôts, selon votre production.'],
  ['build','*','Agrandissements −10 % pour toutes vos autres sociétés.'],
  ['studio',['ecom','couture','airline'],'Publicités maison : ventes +5 %.'],
  ['airline',['hotel'],'Hôtels des villes desservies par vos lignes : clients +8 %.'],
  ['office',['saas','staffing'],'Loyer offert à la start-up SaaS de la même ville, ventes +8 % pour l’agence de recrutement.'],
  ['warehouse','fact','Vos usines de la même ville gardent leur stock plus longtemps.'],
  ['shipping','fact','Vos usines expédient leur production par vos navires.']
];
function synTgt(k,t,b){ if(t==='*') return b.def!==k; if(t==='fact') return isFact(b); if(!t) return renewEligible(b)||b.def==='warehouse'; return t.includes(b.def); }
function synTgtN(k,t){ if(t==='*') return 'toutes vos autres sociétés'; if(t==='fact') return 'une usine'; if(!t) return 'une usine, un data center ou un entrepôt'; return t.map(d=>D.biz[d]?D.biz[d].n.toLowerCase():d).join(', '); }
function synCard(){
  const act=S.biz.filter(b=>b.status==='active'); let on=0;
  const rows=SYN.filter(([k])=>D.biz[k]).map(([k,t,d])=>{ const src=act.some(b=>b.def===k), T=act.filter(b=>synTgt(k,t,b)); const ok=src&&T.length; if(ok) on++;
    const st= ok? T.length+' société'+(T.length>1?'s':'')+' en profite'+(T.length>1?'nt':'')+' : '+T.slice(0,4).map(b=>esc(b.name)).join(', ')+(T.length>4?'…':'')
      : src? 'Il manque : '+esc(synTgtN(k,t))+'.' : 'Il manque : '+esc(D.biz[k].n.toLowerCase())+'.';
    return [ok,'<div class="rs-d"><div><b>'+esc(D.biz[k].n)+'</b><small>'+esc(d)+'</small><small>'+st+'</small></div>'+pill(ok?'Actif':'Inactif',ok?'good':'info')+'</div>']; })
    .sort((x,y)=>y[0]-x[0]).map(x=>x[1]);
  const F=S.fcfold||{}, open=!!F.bz_syn;
  return '<section class="card fcd-c"><details class="fcd ag-f" data-k="bz_syn"'+(open?' open':'')+'><summary><span class="ag-s"><h2><span>Synergies</span></h2><small>'+on+' lien'+(on>1?'s':'')+' actif'+(on>1?'s':'')+' sur '+rows.length+'</small></span></summary><div class="ht-t">'+rows.join('')+'</div></details></section>';
}
{ const _vbh3=vBizHome; vBizHome=function(){ const h=_vbh3(); return S.biz.length? h+synCard() : h; }; }

/* V1.6.6 : fenêtre de crise de groupe */
{ const _dn=doNext; doNext=function(n,q){ _dn.apply(this,arguments); if(S&&S.flashCri){ S.flashCri=false; if(criOn()&&!S.cri.mit){ pushModal({type:'cri'}); render(); } } }; }
{ const _mc3=modalContent; modalContent=function(){ const m=ui.modal; if(!(m&&m.type==='cri')) return _mc3();
  if(!criOn()) return {title:'Crise',sm:true,body:'<div class="sub">La crise est terminée.</div><div>'+btn('Fermer','closemodal',{c:'pri'})+'</div>'};
  const C=CRI[S.cri.k], L=S.biz.filter(criHit);
  return {title:C.n,sm:true,body:'<div class="stack"><div class="notice bad">'+esc(C.eff)+' jusqu’au '+dateL(S.cri.until)+'.</div><div class="sub">Sociétés touchées : '+L.map(b=>esc(b.name)).join(', ')+'.</div>'+
    '<div class="sub">Avec '+esc(C.hasN)+', la prochaine crise de ce type sera atténuée d’office.</div><div class="row sp">'+btn('Subir','closemodal',{c:'ghost'})+btn(C.par+' : '+eur(S.cri.cost,0),'crimit',{c:'pri',dis:S.cash<S.cri.cost})+'</div><div class="sub">La parade réduit les effets de 60 %.</div></div>'}; }; }
ACT.crimit=()=>{ const r=criMit(); if(r.ok){ ui.modal=null; S.stats.mit=(S.stats.mit||0)+1; } after(r); };

