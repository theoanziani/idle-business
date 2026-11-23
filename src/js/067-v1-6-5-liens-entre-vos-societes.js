/* ============================================================
   V1.6.5 : liens entre vos sociétés
   - Ferme → restaurants, fast-foods, supermarchés : marchandises −15 % ; hôtels : −10 % et frais −5 %.
   - Énergies renouvelables : l’entrepôt rejoint les usines et data centers (énergie −40 %, renewSaving).
   - Société de construction → agrandissements de vos autres sociétés −10 %.
   - Studio vidéo → e-commerce, haute couture, compagnie aérienne : publicités maison, ventes +5 %.
   - Compagnie aérienne → hôtels des villes desservies par vos lignes : clients +8 %.
   - Immeuble de bureaux → start-up SaaS de la même ville : loyer offert ; agence de recrutement : ventes +8 %.
   - Directeur général : salaires et frais fixes −4 % partout.
   ============================================================ */
function lkAny(def){ return S.biz.some(x=>x.def===def&&x.status==='active'); }
function lkCity(def,city){ return S.biz.some(x=>x.def===def&&x.status==='active'&&x.city===city); }
function lkAirCity(city){ const cn=(D.CITIES[city]||{}).n; if(!cn) return false;
  return S.biz.some(a=>a.def==='airline'&&a.status==='active'&&a.m&&((a.m.ln||[]).some(l=>[l.a,l.b].some(id=>{ const A=AL_AP[id]; return A&&A.n.indexOf(cn)===0; }))||(a.m.hubs||[]).some(id=>AL_AP[id]&&AL_AP[id].n.indexOf(cn)===0))); }
function lkList(b){ const d=b.def, L=[];
  /* V2.3.6 : « Produits de votre ferme » remplacé par l’approvisionnement réel (industry.js) */
  if(SUP_NEED[d]&&b.supIn>0) L.push(['sup','Produits de vos usines',eur(b.supSave||0,0)+' économisés hier'+(b.supQ>.05?', qualité +'+Math.round((SUP_QB[d]||0)*b.supQ/2*100)+' % de ventes':'')]);
  if(renewEligible(b)&&lkAny('renew')) L.push(['renew','Énergie de vos centrales','énergie −40 %, selon votre production']);
  if(['ecom','couture','airline'].includes(d)&&lkAny('studio')) L.push(['studio','Publicités de votre studio','ventes +5 %']);
  if(d==='hotel'&&lkAirCity(b.city)) L.push(['airline','Vols de votre compagnie','clients +8 %']);
  if(d==='saas'&&lkCity('office',b.city)) L.push(['office','Siège dans votre immeuble','loyer offert']);
  if(d==='staffing'&&lkAny('office')) L.push(['office','Vos locataires de bureaux','ventes +8 %']);
  if(d!=='build'&&lkAny('build')) L.push(['build','Votre société de construction','agrandissements −10 %']);
  if(mgrOn('ceo')) L.push(['ceo','Directeur général','salaires et frais fixes −4 %']);
  if(ctyIn(b)&&ctyHas('tou')) L.push(['cty','Promotion touristique de votre pays','ventes +4 %']);
  if(ctyIn(b)&&ctyHas('zf')) L.push(['cty','Zone franche de votre pays','coûts −5 %']);
  return L; }
function lkRentF(b){ return b&&b.def==='saas'&&lkCity('office',b.city)? 0 : 1; }
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); if(!b||b.status!=='active') return z;
  const d=b.def, up=(f)=>{ z.vol*=f; z.rev*=f; };
  if(['ecom','couture','airline'].includes(d)&&lkAny('studio')) up(1.05);
  if(d==='hotel'&&lkAirCity(b.city)) up(1.08);
  if(d==='staffing'&&lkAny('office')) up(1.08);
  if(mgrOn('ceo')){ z.wage*=.96; z.fixed*=.96; }
  if(ctyIn(b)){ if(ctyHas('tou')) up(1.04); if(ctyHas('zf')){ z.cogs*=.95; z.fixed*=.95; z.wage*=.95; } }
  return z; }; }
{ const _uc=upgradeCost; upgradeCost=function(b){ const c=_uc(b); return b&&b.def!=='build'&&lkAny('build')? c*.9 : c; }; }

