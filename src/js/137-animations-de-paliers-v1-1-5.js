/* ============================================================
   ANIMATIONS DE PALIERS (V1.1.5)
   À la première ouverture de la fiche après un palier, une animation le célèbre ; ensuite un
   insigne reste affiché sur l'illustration (étoiles qui scintillent, tapis rouge, etc.).
   Restaurant : étoiles 1 à 3, bistrots, émission de télévision. Hôtel : étoiles, palace, resorts.
   État : b.seenPal (dernier état vu des paliers, pour ne célébrer qu'une fois).
   ============================================================ */
const PAL = {
  resto:{ badges:m=>({stars:m.stars||0, bis:m.bis||0, tv:m.tv?1:0}),
    ev:{stars:['Première étoile au guide !','Deuxième étoile au guide !','Troisième étoile : la consécration !'], bis:['Votre premier bistrot ouvre ses portes'], tv:['Votre émission de cuisine arrive à la télévision']} },
  hotel:{ badges:m=>({stars:Math.max(0,(m.st||3)-3), pal:m.pal?1:0, rs:m.rs||0}),
    ev:{stars:['Votre hôtel passe à 4 étoiles !','Votre hôtel passe à 5 étoiles !'], pal:['Votre hôtel devient un palace'], rs:['Votre premier resort ouvre','Un deuxième resort ouvre','Un troisième resort ouvre']} }
};
function palNow(b){ const P=PAL[b.def]; if(!P||!b.m||b.status!=='active') return null; const n=P.badges(b.m,b); if(!P.sticky) return n;
  const hi=b.palHi||(b.palHi={}); Object.keys(n).forEach(k=>{ hi[k]=Math.max(hi[k]||0,n[k]); }); return Object.assign({},hi); }
/* nouveaux paliers depuis la dernière visite de la fiche */
function palNews(b){ const P=PAL[b.def], now=palNow(b); if(!now) return []; const seen=b.seenPal||{}, out=[];
  Object.keys(now).forEach(k=>{ for(let i=(seen[k]||0);i<now[k];i++){ const L=P.ev[k]; if(L) out.push({k, i, t:L[Math.min(i,L.length-1)]}); } }); return out; }
const PAL_STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z"/></svg>';
function palBadgeHtml(b){ const n=palNow(b); if(!n) return ''; let h='';
  if(b.def==='resto'){ if(n.stars) h+='<div class="pal-stars" aria-label="'+n.stars+' étoile(s) au guide">'+Array.from({length:n.stars},(_,i)=>'<i style="animation-delay:'+(i*.4)+'s">'+PAL_STAR+'</i>').join('')+'</div>';
    if(n.tv) h+='<div class="pal-tag">À la télévision</div>'; if(n.bis) h+='<div class="pal-tag pal-tag2">'+n.bis+' bistrot'+(n.bis>1?'s':'')+'</div>'; }
  if(b.def==='hotel'){ const st=3+n.stars; h+='<div class="pal-stars pal-sm" aria-label="'+st+' étoiles">'+Array.from({length:st},(_,i)=>'<i style="animation-delay:'+(i*.3)+'s">'+PAL_STAR+'</i>').join('')+'</div>';
    if(n.pal) h+='<div class="pal-carpet" aria-label="Palace"></div><div class="pal-tag">Palace</div>'; if(n.rs) h+='<div class="pal-tag pal-tag2">'+n.rs+' resort'+(n.rs>1?'s':'')+'</div>'; }
  if(PAL[b.def].icon) h+=palIconBadge(b,n);
  return h? '<div class="pal-wrap">'+h+'</div>' : ''; }
function palApply(){
  if(!ui.modal||ui.modal.type!=='biz') return; const b=S.biz.find(x=>x.id===ui.modal.id); if(!b||!PAL[b.def]) return;
  const hero=document.querySelector('.md .bhero'); if(hero&&!hero.querySelector('.pal-wrap')){ const x=palBadgeHtml(b); if(x){ hero.style.position='relative'; hero.insertAdjacentHTML('afterbegin',x); } }
  const news=palNews(b); if(!news.length) return;
  b.seenPal=palNow(b); const e=news[news.length-1], md=document.body; if(md.querySelector('.pal-cele')) return;
  const P0=PAL[b.def], big=P0.icon&&e.k!=='stars'? '<i class="pal-ico" style="--pc:'+P0.col+'">'+P0.icon+'</i>' : (e.k==='stars')? Array.from({length:e.i+1},(_,i)=>'<i style="animation-delay:'+(.15+i*.25)+'s">'+PAL_STAR+'</i>').join('') : '<i>'+PAL_STAR+'</i>';
  md.insertAdjacentHTML('beforeend','<div class="pal-cele" data-a="palok" role="dialog" aria-label="'+esc(e.t)+'"><div class="pal-burst">'+Array.from({length:14},(_,i)=>'<span style="--a:'+(i*360/14)+'deg"></span>').join('')+'</div><div class="pal-big">'+big+'</div><b>'+esc(e.t)+'</b><small>'+esc(b.name)+'</small><div class="sub">Touchez pour continuer</div></div>'); }
ACT.palok=()=>{ const c=document.querySelector('.pal-cele'); if(c) c.remove(); };
{ const _r=render; render=function(){ const o=_r.apply(this,arguments); try{ palApply(); }catch(e){ console.error(e); } return o; }; }
/* les anciennes parties ne célèbrent pas tout d'un coup : on part de l'état actuel la première fois */
{ const _ms=metState; metState=function(b){ const r=_ms(b); try{ if(r&&PAL[b.def]&&b.seenPal===undefined&&b.status==='active'&&b.hist&&b.hist.length>1) b.seenPal=PAL[b.def].badges(b.m,b); }catch(e){} return r; }; }

/* ---------- V1.1.7 : un insigne pour chaque autre activité ----------
   icon : pictogramme (trait, couleur --pc) ; tag : texte de l'insigne ; sticky : un palier acquis reste affiché. */
const PI=(d)=>'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';
function palDef(def,o){ PAL[def]=Object.assign({ev:{}},o); }
palDef('farm',{col:'#2e9e4f', icon:PI('<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l8-8"/>'), tag:()=>'Bio',
  badges:(m,b)=>({bio: typeof fmBio==='function'&&fmBio(b)==='bio'?1:0}), ev:{bio:['Votre ferme est certifiée bio']}});
palDef('studio',{col:'#c99a06', icon:PI('<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M9 17h6"/>'), tag:()=>'Festivals',
  badges:m=>({fest:m.fest?1:0}), ev:{fest:['Vos films entrent dans les grands festivals']}});
palDef('gallery',{col:'#7a5cc4', icon:PI('<path d="M3 9l9-5 9 5M4 9h16M6 9v8M10 9v8M14 9v8M18 9v8M3 20h18M4 17h16"/>'), tag:()=>'Musée privé',
  badges:m=>({mus:m.mus?1:0}), ev:{mus:['Votre galerie ouvre son musée privé']}});
palDef('couture',{col:'#c8352a', sticky:1, icon:PI('<path d="M9 10h6v10H9zM3 14h6v6H3zM15 16h6v4h-6z"/><path d="M12 4l.9 1.9 2.1.3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 6.2l2.1-.3z"/>'), tag:()=>'Défilés',
  badges:m=>({show:Math.min(1,m.nsh||0)}), ev:{show:['Votre premier défilé : la maison monte sur le podium']}});
palDef('renew',{col:'#1f7fb8', sticky:1, icon:PI('<path d="M12 9v10M12 9V3M12 9l5.5 3M12 9l-5.5 3"/><circle cx="12" cy="9" r="1"/><path d="M2 20c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0"/>'), tag:()=>'Éolien en mer',
  badges:m=>({mer:(m.pl||[]).some(p=>p.r==='mer')?1:0}), ev:{mer:['Votre première éolienne en mer tourne']}});
palDef('dc',{col:'#0c6b35', sticky:1, icon:PI('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'), tag:()=>'99,99 %',
  badges:m=>({sla:(m.cl||[]).some(c=>c.sla==='9999')?1:0}), ev:{sla:['Premier client à 99,99 % de disponibilité']}});
palDef('promo',{col:'#d06a12', icon:PI('<path d="M8 21V7h7v14M5 21h14M10 10h3M10 13h3M10 16h3"/><path d="M15 7V3M15 3h6M21 3v3"/>'), tag:()=>'Tour en construction',
  badges:m=>({tour:(m.ops||[]).some(o=>o.dens===3&&o.stage!=='fini')?1:0}), ev:{tour:['Votre première tour sort de terre']}});
palDef('saas',{col:'#1f3c88', sticky:1, icon:PI('<path d="M12 3v2M6 16c0-6 2.5-10 6-10s6 4 6 10l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>'), tag:()=>'En bourse',
  badges:m=>({ipo:m.ipo?1:0}), ev:{ipo:['La cloche sonne : votre start-up entre en bourse']}});
palDef('ecom',{col:'#d06a12', icon:PI('<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'), tag:()=>'Express',
  badges:m=>({exp:m.exp?1:0}), ev:{exp:['Vos camions passent à la livraison express']}});
palDef('repair',{col:'#2e9e4f', icon:PI('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 12l3 3 5-6"/>'), tag:()=>'Centre agréé',
  badges:m=>({agr:m.agr?1:0}), ev:{agr:['Votre atelier devient centre agréé']}});
palDef('staffing',{col:'#1f7fb8', icon:PI('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'), tag:()=>'International',
  badges:m=>({intl:m.intl?1:0}), ev:{intl:['Votre cabinet recrute dans le monde entier']}});
palDef('build',{col:'#5a6a7d', sticky:1, icon:PI('<path d="M2 17h20M4 17v-3a8 8 0 0 1 16 0v3M8 17v-3M12 17v-6M16 17v-3"/><path d="M2 20h20"/>'), tag:()=>'Ouvrages d’art',
  badges:m=>({oa:(m.jobs||[]).some(j=>j.k==='oa')?1:0}), ev:{oa:['Votre premier pont est en chantier']}});
palDef('electronics',{col:'#0b6b8a', sticky:1, icon:PI('<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/>'), tag:n=>'Génération '+(n.gen+1),
  badges:m=>({gen:m.g||0}), ev:{gen:['Vos puces passent à une gravure plus fine']}});
palDef('textile',{col:'#7a5cc4', icon:PI('<path d="M3 12V4h8l10 10-7 7z"/><circle cx="7.5" cy="7.5" r="1.5"/>'), tag:()=>'Marque propre',
  badges:m=>({own:m.own?1:0}), ev:{own:['Votre étiquette est cousue sur chaque vêtement']}});
function palIconBadge(b,n){ const P=PAL[b.def]; if(!Object.keys(n).some(k=>n[k]>0)) return '';
  return '<div class="pal-emb" style="--pc:'+P.col+'" aria-label="'+esc(P.tag(n))+'">'+P.icon+'</div><div class="pal-tag" style="background:'+P.col+'">'+esc(P.tag(n))+'</div>'; }
/* compteurs posés par les actions */
{ const _hs=hcShow; hcShow=function(b){ const r=_hs.apply(this,arguments); if(r&&r.ok&&b&&b.m) b.m.nsh=(b.m.nsh||0)+1; return r; }; }
if(MET.saas&&MET.saas.acts&&MET.saas.acts.ipo){ const _ipo=MET.saas.acts.ipo; MET.saas.acts.ipo=function(b){ const r=_ipo.apply(this,arguments); if(r&&r.ok) b.m.ipo=1; return r; }; }

/* V1.2.8 : concession automobile */
palDef('dealer',{col:'#1f3c88', sticky:1, icon:PI('<path d="M3 15l2-5h14l2 5v3H3z"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="16.5" cy="18" r="1.6"/><path d="M12 2.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"/>'),
  tag:n=>n.grp? 'Groupe de distribution' : 'Objectif atteint',
  badges:m=>({obj:Math.min(1,m.qok||0), grp:m.grp?1:0}), ev:{obj:['Premier objectif constructeur atteint : la marque vous félicite'], grp:['Votre deuxième concession ouvre ses portes']}});

/* V1.3.1 : compagnie aérienne */
palDef('airline',{col:'#1f7fb8', sticky:1, icon:PI('<path d="M2.5 13.5l7-1.5L13 4.5c.6-1.2 2.2-1.2 2.2.3L14 12l6 1.2c1 .2 1 1.6 0 1.8L14 16l1.2 5.2c0 1.5-1.6 1.5-2.2.3L9.5 18l-7-1.5z" transform="rotate(-35 12 12)"/>'),
  tag:n=>n.ct? (n.ct+1)+' continents' : 'Long-courrier',
  badges:m=>({lh:m.ln.some(l=>alDist(l.a,l.b)>3500)?1:0, ct:Math.max(0,new Set(m.hubs.map(h=>AL_CO[alAp(h).co].ct)).size-1)}),
  ev:{lh:['Votre premier vol long-courrier décolle'], ct:['Votre compagnie s’installe sur un deuxième continent','Un troisième continent rejoint votre réseau','Quatre continents : une compagnie mondiale','Cinq continents desservis','Les six continents : le monde entier est à vous']}});

/* V1.4.9 : compagnie maritime (V1.5.1 : plus de paliers) */
palDef('shipping',{col:'#1b5e8a', sticky:1, icon:PI('<path d="M3 15l2 5h14l2-5zM5 15V11h14v4M8 11V8h4v3M14 11V6h3v5"/><path d="M2 22c2 0 3-1 5-1s3 1 5 1 3-1 5-1 3 1 5 1"/>'),
  tag:n=>n.ct? (n.ct+1)+' régions' : n.gt? 'Géant des mers' : n.ic? 'Intercontinental' : n.nf? 'Chantier naval' : 'Affrètement',
  badges:m=>({ch:Math.min(1,m.chn||0), ic:(m.ln||[]).some(l=>shPt(l.a).rg!==shPt(l.b).rg&&!SH_NB[shPt(l.a).rg].includes(shPt(l.b).rg))?1:0,
    nf:(m.fl||[]).some(p=>p.own&&!p.occ&&!(p.yard>S.day))?1:0, gt:(m.fl||[]).some(p=>p.t==='g22'&&!(p.yard>S.day))?1:0,
    ct:Math.min(4,Math.max(0,new Set((m.tm||[]).map(id=>shPt(id).rg)).size-1))}),
  ev:{ch:['Votre premier voyage d’affrètement est livré'], ic:['Votre première ligne intercontinentale appareille'], nf:['Le chantier naval vous livre votre premier navire neuf'], gt:['Un géant de 22 000 conteneurs rejoint votre flotte'],
    ct:['Un terminal dans une deuxième région','Votre réseau s’étend à une troisième région','Quatre régions : une compagnie mondiale','Cinq régions reliées par vos navires']}});

/* V1.5.2 : immeuble de bureaux */
palDef('office',{col:'#8a5a44', sticky:1, icon:PI('<path d="M6 21V3h12v18M3 21h18M9 6h2M13 6h2M9 9.5h2M13 9.5h2M9 13h2M13 13h2M10.5 21v-4h3v4"/>'),
  tag:n=>n.pf? (n.pf+1)+' immeubles' : n.sig? 'Signature' : n.gc? 'Grand compte' : n.lbl? 'Label énergie' : 'Complet',
  badges:m=>({full:(m.bd||[]).some(B=>B.fl.every(Boolean))?1:0, gc:Math.min(1,m.gcn||0), lbl:(m.bd||[]).some(B=>B.lbl)?1:0, sig:(m.bd||[]).some(B=>B.std>=5)?1:0, pf:Math.min(4,Math.max(0,(m.bd||[]).length-1))}),
  ev:{full:['Votre immeuble affiche complet'], gc:['Un grand compte signe chez vous'], lbl:['Votre premier immeuble labellisé'], sig:['Un immeuble atteint le standing « Signature »'],
    pf:['Un deuxième immeuble rejoint votre portefeuille','Trois immeubles : un vrai portefeuille','Quatre immeubles dans la ville','Cinq immeubles : vous comptez sur le marché des bureaux']}});

/* V1.6.2 : entrepôt logistique */
palDef('warehouse',{col:'#1b7547', sticky:1, icon:PI('<path d="M2 9l10-5 10 5v12H2zM6 21v-9h12v9M6 15h12M6 18h12"/>'),
  tag:n=>n.tr? 'Flotte de camions' : n.au? 'Automatisé' : n.gc? 'Grand compte' : 'Complet',
  badges:(m,b)=>({full:typeof whUsed==='function'&&whUsed(b)>=whCap(b)*.98?1:0, gc:Math.min(1,m.bign||0), au:m.eq>=2?1:0, tr:m.tr>=5?1:0}),
  ev:{full:['Votre entrepôt affiche complet'], gc:['Un grand compte vous confie ses stocks'], au:['Les robots prennent le relais : entrepôt automatisé'], tr:['Cinq camions à vos couleurs sillonnent les routes']}});

