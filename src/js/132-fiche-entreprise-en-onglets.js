/* ============================================================
   FICHE ENTREPRISE EN ONGLETS
   Un résumé toujours visible (illustration, chiffres clés, alertes, amélioration), puis
   quatre onglets : Métier, Équipe, Finances, Réglages. La fiche est d'abord construite en entier
   par les modules précédents ; on la range ensuite par onglet après chaque affichage.
   Onglet choisi : ui.ft (gardé pendant la partie).
   ============================================================ */
const FT_TABS = [['met','Métier'],['eq','Équipe'],['fin','Finances'],['reg','Réglages']];
function ftClassOf(el){
  const c=el.classList, id=el.id, h=((el.querySelector('h2,h3')||{}).textContent||'').trim();
  if(c.contains('bhero')||c.contains('bstats')||c.contains('notice')||c.contains('mini')||c.contains('bigup')) return 'top';
  if(id==='bj-met') return 'met';
  if(id==='bj-eq'||c.contains('qacts')||h==='Clients et équipe'||h==='Directeur du site') return 'eq';
  if(c.contains('grid')&&/Flux du dernier jour/.test(el.textContent)) return 'fin';
  if(id==='bj-reloc') return 'fin';
  if(h==='Ce qui fait vos ventes'||(c.contains('row')&&/Céder/.test(el.textContent))) return 'fin';
  if(el.tagName==='SECTION'&&c.contains('card')&&!h) return 'eq';
  return 'reg'; }
function ftApply(){
  if(!ui.modal||ui.modal.type!=='biz') return; const body=document.querySelector('.md .md-b'); if(!body||!body.querySelector('#bj-eq')||body.querySelector('.ft-tabs')) return;
  const kids=[...body.children], cls=kids.map(ftClassOf), have=new Set(cls);
  const tabs=FT_TABS.filter(([k])=>have.has(k)); if(tabs.length<2) return;
  if(!ui.ft||!have.has(ui.ft)) ui.ft=tabs[0][0];
  kids.forEach((el,i)=>{ if(cls[i]!=='top'&&cls[i]!==ui.ft) el.classList.add('ft-hide'); });
  const nav=document.createElement('div'); nav.className='ft-tabs seg'; nav.setAttribute('role','tablist');
  nav.innerHTML=tabs.map(([k,n])=>'<button role="tab" aria-selected="'+(ui.ft===k)+'" class="'+(ui.ft===k?'on':'')+'" data-a="fichetab" data-v="'+k+'">'+n+'</button>').join('');
  /* résumé d'abord, puis la barre d'onglets, puis le reste dans l'ordre d'origine */
  kids.forEach((el,i)=>{ if(cls[i]==='top') body.appendChild(el); }); body.appendChild(nav); kids.forEach((el,i)=>{ if(cls[i]!=='top') body.appendChild(el); });
}
{ const _r=render; render=function(){ const out=_r.apply(this,arguments); try{ ftApply(); }catch(e){ console.error(e); } return out; }; }
ACT.fichetab=el=>{ ui.ft=el.dataset.v; const nav=document.querySelector('.ft-tabs'), md=document.querySelector('.md .md-b'), y=nav&&md? nav.offsetTop : 0; render();
  const n2=document.querySelector('.ft-tabs'); if(n2&&md){ const box=document.querySelector('.md .md-b'); if(box&&box.scrollTop>n2.offsetTop) box.scrollTop=n2.offsetTop-8; } };
/* les raccourcis (Personnel, Pilotage, Sécurité) ouvrent le bon onglet */
{ const _j=ACT.jump; ACT.jump=el=>{ const id=el.dataset.i; if(ui.modal&&ui.modal.type==='biz'){ const t=document.getElementById(id); if(t&&t.classList.contains('ft-hide')){ ui.ft=ftClassOf(t); render(); } } const t2=document.getElementById(id); if(t2) t2.scrollIntoView({behavior:'smooth',block:'start'}); }; }
/* carte « Déménager » (onglet Finances) quand la société est au niveau max de son bâtiment */
function relocCard(b){ if(!b.bld) return ''; const all=ui.rlAll===b.id, LA=relocCands(b,1), L=all? LA : LA.slice(0,8), c=relocCost(b), co=cityOwned(b.city), atMax=b.lvl>=bizMaxHere(b)&&b.lvl<MAXLVL;
  return '<div class="card" id="bj-reloc"><h2>Déménager</h2><div class="sub">'+(atMax? '« '+esc(b.name)+' » a atteint le niveau maximal de ce bâtiment. Dans un plus grand, elle pourra continuer de grandir. ' : 'Changez d’adresse dans '+esc(cityOf(b).n)+' : le quartier modifie la clientèle et le loyer. ')+'Elle garde son niveau et son équipe ; déménagement : '+eur(c,0)+', 3 jours de fermeture.</div>'+
    (b.up? '<div class="notice info">Possible une fois l’agrandissement en cours terminé.</div>' :
    L.length? '<div class="ht-t">'+L.map(x=>'<div class="rs-d"><div><b>'+esc(x.bd.addr)+'</b><small>'+esc(distOfB(x.bd).n)+' · '+x.f[0]+' · '+D.BT[x.bd.t].n+' de '+fmtN(x.bd.surf)+' m² · jusqu’au niveau '+x.mx+(x.h? ' · déjà à vous' : co? ' · ville à vous' : ' · loyer '+eur(bldRent(x.bd),0)+' / j')+'</small></div><button class="btn sm pri" data-a="reloc" data-i="'+b.id+'" data-v="'+x.bd.id+'"'+(availFor(cityOf(b).ccy)<c?' disabled':'')+'>Déménager</button></div>').join('')+'</div>'+
      (LA.length>8? '<div class="row">'+btn(all?'Moins de bâtiments':'Voir les '+LA.length+' bâtiments','rlall',{c:'sm ghost',i:b.id})+'</div>' : '')
      : '<div class="sub">Aucun bâtiment libre assez grand dans cette ville pour le moment.</div>')+'</div>'; }
ACT.rlall=el=>{ const id=+el.dataset.i; ui.rlAll= ui.rlAll===id? null : id; render(); };
ACT.reloc=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b) return; const bd=bldById(el.dataset.v);
  ask('Déménager '+b.name,'Nouvelle adresse : <b>'+esc(bd?bd.addr:'')+'</b>'+(bd? ' ('+esc(distOfB(bd).n)+')' : '')+'. Coût : <b>'+eur(relocCost(b),0)+'</b>, 3 jours de fermeture. L’ancien bâtiment est libéré.','Déménager',()=>after(relocBiz(b,el.dataset.v))); };
/* V1.4.4 : bouton « Tout agrandir » dans Sociétés */
{ const _vbh=vBizHome; vBizHome=function(){ const h=_vbh(); if(!S.biz.length) return h; const I=upAllInfo();
  const card='<section class="card"><div class="row sp"><div><b>Tout agrandir</b><div class="sub">'+(I.L.length? I.L.length+' société'+(I.L.length>1?'s':'')+' peu'+(I.L.length>1?'vent':'t')+' monter d’un niveau ('+eur(I.all,0)+' en tout).'+(I.n<I.L.length? ' Avec votre trésorerie : '+I.n+' ('+eur(I.tot,0)+'), les moins chères d’abord.' : '') : 'Aucune société ne peut monter de niveau pour le moment.')+(I.blk.length? ' '+I.blk.length+' au maximum de leur bâtiment : déménagez-les.' : '')+'</div></div>'+btn('Tout agrandir','upall',{c:'sm pri',dis:!I.n,why:'Aucune société ne peut s’agrandir pour l’instant.'})+'</div></section>';
  const k=h.indexOf('<div class="cat-h">Vos sociétés</div>'); return k<0? h+card : h.slice(0,k)+'<div class="cat-h">Vos sociétés</div>'+card+h.slice(k+'<div class="cat-h">Vos sociétés</div>'.length); }; }
ACT.upall=()=>{ const I=upAllInfo(); if(!I.n) return after(upgradeAll());
  ask('Tout agrandir','Lancer <b>'+I.n+'</b> agrandissement'+(I.n>1?'s':'')+' d’un niveau pour <b>'+eur(I.tot,0)+'</b>'+(I.n<I.L.length? ' ('+(I.L.length-I.n)+' autres attendront faute de trésorerie)' : '')+'. Les chantiers durent plusieurs jours, l’activité continue pendant ce temps.','Agrandir',()=>after(upgradeAll())); };

