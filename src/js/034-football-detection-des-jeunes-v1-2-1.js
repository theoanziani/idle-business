/* ============================================================
   Football : détection des jeunes (V1.2.1)
   O.ysc : recruteurs de jeunes (3 au plus) {id, n, exp, ex, w, m}
     exp (expérience, 1 à 5) : nombre de jeunes proposés ; ex (expertise, 1 à 5) : qualité et potentiel.
   m (mission) : {c, len, d0, end, nx} : pays, durée (30, 90 ou 180 jours), rapport tous les mois (V1.7.8 ; iv = 30, anciennes missions : 14).
   O.yprop : jeunes proposés {…joueur, fee, until, sc} ; O.yscC : candidats, renouvelés tous les 30 jours.
   Valeurs par défaut : tout est créé à la première lecture (fcYS).
   ============================================================ */
const YS_C = {
  fr:{n:'France', pool:'fr', lat:46, lon:2, t:1.1}, es:{n:'Espagne', pool:'es', lat:40, lon:-4, t:1.1},
  en:{n:'Angleterre', pool:'en', lat:52, lon:-1, t:1}, de:{n:'Allemagne', pool:'de', lat:51, lon:10, t:1.05},
  it:{n:'Italie', pool:'it', lat:43, lon:12, t:1}, pt:{n:'Portugal', pool:'pt', lat:39.5, lon:-8, t:1.05},
  nl:{n:'Pays-Bas', pool:'nl', lat:52.3, lon:5, t:1.05}, hr:{n:'Croatie', pool:'hr', lat:45, lon:16, t:1},
  br:{n:'Brésil', pool:'br', lat:-12, lon:-50, t:1.2}, arg:{n:'Argentine', pool:'la', lat:-35, lon:-64, t:1.15},
  co:{n:'Colombie', pool:'la', lat:4, lon:-73, t:1}, us:{n:'États-Unis', pool:'us', lat:39, lon:-98, t:.9},
  ma:{n:'Maroc', pool:'ar', lat:32, lon:-6, t:.95}, sn:{n:'Sénégal', pool:'af', lat:14.5, lon:-14.5, t:1.05},
  ci:{n:'Côte d’Ivoire', pool:'af', lat:7.5, lon:-5.5, t:1.05}, ng:{n:'Nigeria', pool:'af', lat:9, lon:8, t:1},
  jp:{n:'Japon', pool:'jp', lat:36, lon:138, t:.95}, kr:{n:'Corée du Sud', pool:'kr', lat:36.5, lon:128, t:.9},
  cn:{n:'Chine', pool:'cn', lat:35, lon:104, t:.8},
  /* pays peu communs : vivier modeste, mais une pépite peut surgir */
  no:{n:'Norvège', pool:'no', lat:61, lon:9, t:.85, rare:1}, is:{n:'Islande', pool:'no', lat:65, lon:-18, t:.75, rare:1},
  ge:{n:'Géorgie', pool:'ge', lat:42, lon:43.5, t:.85, rare:1}, ml:{n:'Mali', pool:'af', lat:17, lon:-4, t:.9, rare:1},
  gh:{n:'Ghana', pool:'af', lat:7.9, lon:-1, t:.9, rare:1}, cm:{n:'Cameroun', pool:'af', lat:5.7, lon:12.4, t:.9, rare:1},
  eg:{n:'Égypte', pool:'ar', lat:26.5, lon:30, t:.85, rare:1}, dz:{n:'Algérie', pool:'ar', lat:28, lon:2.6, t:.88, rare:1},
  uy:{n:'Uruguay', pool:'la', lat:-32.8, lon:-56, t:.95, rare:1}, mx:{n:'Mexique', pool:'la', lat:23.6, lon:-102.5, t:.88, rare:1},
  au:{n:'Australie', pool:'en', lat:-25, lon:134, t:.78, rare:1}, ca:{n:'Canada', pool:'en', lat:56, lon:-106, t:.78, rare:1}
};
/* noms et nationalités des nouveaux pays */
/* prénoms et noms pour les nouveaux viviers */
if(!FOOT_NAMES.no) FOOT_NAMES.no=['Erling Martin Sander Kristian Magnus Jonas Henrik Ola Sindre Fredrik Aron Gylfi Jóhann Rúnar Hákon Birkir','Haaland Ødegaard Berg Hansen Johansen Olsen Larsen Andersen Nilsen Solbakken Sørloth Thorsby Sigurdsson Gudmundsson Finnbogason Halldórsson'];
if(!FOOT_NAMES.ge) FOOT_NAMES.ge=['Khvicha Giorgi Levan Otar Zuriko Saba Luka Nika Davit Guram Valeri Lasha','Kvaratskhelia Mamardashvili Kiteishvili Chakvetadze Davitashvili Lochoshvili Mikautadze Zivzivadze Kashia Kvekveskiri Gvelesiani Beridze'];
Object.keys(YS_C).forEach(k=>{ if(!FOOT_NAMES[k]) FOOT_NAMES[k]=FOOT_NAMES[YS_C[k].pool]||FOOT_NAMES.fr; if(!FOOT_NATNAME[k]) FOOT_NATNAME[k]=YS_C[k].n; });
const YS_LEN=[30,90,180], YS_MAX=3;
function fcYS(O){ if(!O.ysc) O.ysc=[]; if(!O.yprop) O.yprop=[]; if(!O.yscC||!(O.yscCd>S.day)){ O.yscC=ysCands(); O.yscCd=S.day+30; } return O; }
function ysClubPos(O){ const nat=footClub(O.id).nat, c=YS_C[nat==='la'?'arg':nat==='af'?'ci':nat==='ar'?'ma':nat]||YS_C.fr; return c; }
function ysDist(a,b){ const R=6371, r=Math.PI/180, dl=(b.lat-a.lat)*r, dn=(b.lon-a.lon)*r, x=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2; return 2*R*Math.asin(Math.sqrt(x)); }
/* coûts : voyage (aller-retour) et frais de mission par mois */
function ysTravel(O,c){ return Math.round((8000+ysDist(ysClubPos(O),YS_C[c])*9)/1000)*1000; }
function ysMonthly(s){ return 12000+6000*s.exp+4000*s.ex; }
function ysMissionCost(O,s,c,len){ return ysTravel(O,c)+ysMonthly(s)*len/30; }
function ysWage(s){ return (s.exp+s.ex)*45000; }
function ysFee(s){ return (s.exp+s.ex)*25000; }
function ysCands(){
  const R=frnd, P=footNamePool('fr'), w=()=>{ const x=R(); return x<.3?1:x<.6?2:x<.82?3:x<.95?4:5; };
  return Array.from({length:4},(_,i)=>({id:'s'+S.day+'_'+i, n:P.f[Math.floor(R()*P.f.length)]+' '+P.l[Math.floor(R()*P.l.length)], exp:w(), ex:w()}));
}
function ysHire(id){
  const O=fcOwn(); if(!O) return err('Aucun club.'); fcYS(O); if(O.ysc.length>=YS_MAX) return err('Trois recruteurs au maximum.');
  const s=O.yscC.find(x=>x.id===id); if(!s) return err('Candidat introuvable.'); const fee=ysFee(s); if(S.cash<fee) return err('Il faut '+eur(fee,0)+'.');
  fcPay('staff','Club : recrutement d’un recruteur de jeunes',-fee); O.yscC=O.yscC.filter(x=>x!==s); s.w=ysWage(s); s.m=null; O.ysc.push(s);
  return ok(s.n+' rejoint votre cellule de recrutement.');
}
/* se séparer d'un recruteur : indemnité de 3 mois de salaire, la mission en cours s'arrête */
function ysSever(s){ return Math.round(s.w*.25/1000)*1000; }
function ysFire(id){ const O=fcOwn(); if(!O) return err('Aucun club.'); fcYS(O); const s=O.ysc.find(x=>x.id===id); if(!s) return err('Recruteur introuvable.');
  const c=ysSever(s); if(S.cash<c) return err('Il faut '+eur(c,0)+' d’indemnité.'); fcPay('staff','Club : départ de '+s.n,-c);
  O.ysc=O.ysc.filter(x=>x!==s); return ok(s.n+' quitte le club (indemnité '+eur(c,0)+').'); }
/* remplacer : départ de l'ancien puis arrivée du nouveau, en une fois */
function ysReplace(oldId,newId){ const O=fcOwn(); if(!O) return err('Aucun club.'); fcYS(O); const s=O.ysc.find(x=>x.id===oldId), n=O.yscC.find(x=>x.id===newId); if(!s||!n) return err('Introuvable.');
  const c=ysSever(s)+ysFee(n); if(S.cash<c) return err('Il faut '+eur(c,0)+'.'); const r1=ysFire(oldId); if(!r1.ok) return r1; const r2=ysHire(newId); return r2.ok? ok(n.n+' remplace '+s.n+'.') : r2; }
function ysSend(id,c,len){
  const O=fcOwn(); if(!O) return err('Aucun club.'); fcYS(O); const s=O.ysc.find(x=>x.id===id); if(!s) return err('Recruteur introuvable.');
  if(s.m) return err(s.n+' est déjà en mission.'); if(!YS_C[c]) return err('Pays inconnu.'); if(!YS_LEN.includes(len)) return err('Durée inconnue.');
  const tr=ysTravel(O,c); if(S.cash<tr) return err('Il faut '+eur(tr,0)+' pour le voyage.');
  fcPay('staff','Club : voyage de '+s.n+' ('+YS_C[c].n+')',-tr);
  s.m={c, len, d0:S.day, end:S.day+len, nx:S.day+30, iv:30};
  return ok(s.n+' part '+len/30+' mois en mission : '+YS_C[c].n+'. Un rapport par mois, le premier dans 30 jours.');
}
function ysRecall(id){ const O=fcOwn(); const s=O&&O.ysc.find(x=>x.id===id); if(!s||!s.m) return err('Pas de mission.'); s.m=null; return ok(s.n+' rentre au club.'); }
/* un jeune repéré : l'expertise relève le potentiel, mais des profils modestes restent proposés */
function ysYouth(O,s,c){
  const R=frnd, C=YS_C[c], P=footNamePool(c), pos=FOOT_SQUAD_SHAPE[Math.floor(R()*FOOT_SQUAD_SHAPE.length)];
  /* pépite : même chance partout, un peu plus dans les pays peu communs (talents méconnus) */
  /* V1.7.9 : moins de pépites pour les meilleurs recruteurs (expertise 5 : 3,4 % → 2,5 % par jeune) ; V1.9.8 : 2,85 % */
  const gem=R()<(.006+.0045*s.ex)*(C.rare?1.3:1), low=!gem&&R()<.5-.07*s.ex;
  const pot=Math.round(clamp(gem? 93+R()*6.4 : low? 50+R()*16 : 48+s.ex*5+R()*14+(C.t-1)*25,48,99));   /* pépite (93 à 99) : rare */
  const a=15+Math.floor(R()*3), o=Math.round(clamp(pot-(14+R()*16)+(a-15)*2,38,72));
  const p={id:'d'+S.day+'_'+Math.floor(R()*1e7), n:P.f[Math.floor(R()*P.f.length)]+' '+P.l[Math.floor(R()*P.l.length)], p:pos, a, o, pot, nat:c, inj:0};
  p.fee=Math.round(4000*Math.exp((pot-50)/8.5)/1000)*1000; p.until=S.day+30; p.sc=s.n; p.cn=C.n; p.rw=Math.max(3,14-2*s.ex);
  return p;
}
function ysReport(O,s){
  const m=s.m, per=[[1,2],[2,3],[3,4],[4,5],[5,7]][s.exp-1], reps=ysReps(m);
  /* nombre de jeunes par mois de mission, réparti entre les rapports */
  const tot=(per[0]+frnd()*(per[1]-per[0]+.99))*m.len/30, n=Math.floor(tot/reps+frnd());
  const L=[]; for(let i=0;i<n;i++) L.push(ysYouth(O,s,m.c));
  O.yprop=L.concat(O.yprop).slice(0,40);
  fcNews('Rapport de '+s.n+' ('+YS_C[m.c].n+') : '+(n? n+' jeune'+(n>1?'s':'')+' proposé'+(n>1?'s':'')+'.' : 'aucun jeune à la hauteur cette fois.'), n?'good':'');
  /* rapport du jour : une ligne dans le journal de vos affaires (pas une simple actualité) */
  const best=L.slice().sort((x,y)=>y.pot-x.pot)[0];
  log(n?'good':'info','Rapport de votre recruteur de jeunes '+s.n+' ('+YS_C[m.c].n+') : '+(n? n+' jeune'+(n>1?'s':'')+' proposé'+(n>1?'s':'')+', le meilleur : '+fpLabel(Math.round((fpRange(best,false)[0]+fpRange(best,false)[1])/2)).toLowerCase()+'. À voir dans Club, onglet Staff.' : 'aucun jeune à la hauteur cette fois.'),'club');
}
/* V1.4.5 : nombre de rapports prévus et rendus ; le dernier tombe au plus tard le jour du retour */
const ysIv = m => m.iv||14;
function ysReps(m){ return Math.max(1,Math.round(m.len/ysIv(m))); }
function ysDone(m){ if(m.rc===undefined) m.rc=Math.max(0,Math.round((m.nx-m.d0)/ysIv(m))-1); return m.rc; }
function ysNext(m){ const left=ysReps(m)-ysDone(m); return left<=0? null : Math.min(m.nx,m.end); }
function ysDaily(day){
  const O=fcOwn(); if(!O||!O.ysc) return; fcYS(O);
  O.ysc.forEach(s=>{ const m=s.m; if(!m) return;
    if((day-m.d0)%30===29) fcPay('staff','Club : frais de mission ('+s.n+')',-ysMonthly(s));
    ysDone(m);
    if(day>=m.nx && m.nx<m.end && m.rc<ysReps(m)){ ysReport(O,s); m.rc++; m.nx+=ysIv(m); }
    if(day>=m.end && m.rc<ysReps(m)){ ysReport(O,s); m.rc++; }
    if(day>=m.end){ fcNews(s.n+' rentre de mission ('+YS_C[m.c].n+').',''); s.m=null; } });
  if(day%7===0) O.yprop=O.yprop.filter(p=>p.until>day);
  /* salaires des recruteurs : chaque lundi, comme l'effectif */
  if(wdOf(day)===0){ const w=O.ysc.reduce((a,s)=>a+s.w,0)/52; if(w>0) fcPay('staff','Club : salaires des recruteurs de jeunes',-w); }
}
function ysSign(id){
  const O=fcOwn(); if(!O) return err('Aucun club.'); fcYS(O); const p=O.yprop.find(x=>x.id===id); if(!p) return err('Proposition expirée.');
  if(S.cash<p.fee) return err('Il faut '+eur(p.fee,0)+'.'); fcPay('transfer','Club : arrivée de '+p.n+' au centre de formation',-p.fee);
  O.yprop=O.yprop.filter(x=>x!==p); const y=Object.assign({},p,{acad:1}); delete y.fee; delete y.until; delete y.sc; delete y.cn; delete y.rw; fcAcad(O).push(y); S.stats.ysign=(S.stats.ysign||0)+1;
  return ok(p.n+' rejoint le centre de formation.');
}
function ysDrop(id){ const O=fcOwn(); if(!O) return err('Aucun club.'); fcYS(O); O.yprop=O.yprop.filter(x=>x.id!==id); return ok('Proposition écartée.'); }
{ const _fd=fcDaily; fcDaily=function(day){ _fd(day); try{ ysDaily(day); }catch(e){ console.error(e); } }; }

