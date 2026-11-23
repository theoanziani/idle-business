/* ============================================================
   V1.8.9 : équilibrage des métiers.
   - BAL_F : coup de pouce aux métiers lourds en capital (remboursement trop lent).
   - Saturation : au-delà d'un rendement de BAL_ROI par an (bénéfice des 30 derniers jours
     rapporté à tout l'argent investi), le marché se sature et les recettes baissent
     progressivement (b.satF, lissé chaque jour). Évite les remboursements en quelques jours.
   ============================================================ */
const BAL_F={office:12, airline:3, dealer:1.6, renew:1.35, hotel:1.15, dc:1.2, resto:1.35, electronics:1.15, shipping:3};   /* V2.1.1 : électronique +15 % ; V2.2.8 : maritime +40 % (rentabilité 139 % → 180 % par an des capitaux engagés) ; V2.2.9 : bureaux 8 → 12 */   /* V2.0.6 : resto +35 % */
/* V2.3.1 : pour les activités à gros actifs, le coup de pouce grandit avec le niveau (un agrandissement y coûte très cher) */
const BAL_FL={shipping:1.35, airline:1.25, office:1.6};
function balF(b){ return (BAL_F[b.def]||1)*Math.pow(BAL_FL[b.def]||1,Math.max(0,(b.lvl||1)-1)); }
const BAL_ROI=4.5;          /* 450 % par an, soit un remboursement en 80 jours environ */
const BAL_ROI_D={resto:6, saas:11, ecom:8.5, shipping:5.5, airline:5.5, office:5.5};   /* V2.3.1 : maritime, aérien et bureaux au niveau de la moyenne (remboursement en 65 à 75 jours) */   /* V2.2.5 : SaaS et e-commerce : plafond relevé pour garder leur bénéfice avec la nouvelle saturation */  /* V2.0.6 : le restaurant gastronomique sature plus tard (600 % par an) */
function balInv(b){ const d=bizDef(b); return Math.max(1,(b.inv$||d.cost)+Math.max(0,bizInvested(b)-d.cost)); }
const BAL_SKIP=['promo','build'];
/* V2.2.4 : pour ces métiers, la saturation réduit la demande (commandes et achats de marchandises) au lieu des seules recettes */
const BAL_DEM=['ecom','saas'];   /* ventes par programmes : recettes trop irrégulières pour la saturation */
/* V1.9.5 : les petits commerces du début (paliers 0 et 1) ne saturent pas tant qu'ils restent sous le niveau 4 */
const balFree = b => (bizDef(b).tier||0)<=1 && b.lvl<4;
function balStep(){ S.biz.forEach(b=>{ if(b.status!=='active'||!metOf(b)||BAL_SKIP.includes(b.def)) return; if(balFree(b)){ b.satF=1; return; }
  const L=b.last; if(!L||L.day!==S.day-1&&L.day!==S.day) return;
  /* V1.9.6 : on suit les recettes et le bénéfice « sans saturation » (indépendants du réglage), ce qui évite les à-coups */
  /* V2.2.5 : métiers de BAL_DEM : la saturation réduit aussi les coûts variables, le bénéfice « sans saturation » est donc estimé en proportion */
  const dem=BAL_DEM.includes(b.def), f0=b.satF||1, raw=L.rev/f0, netRaw=dem? (L.rev-L.cogs-L.extra)/f0-(L.wages+L.upkeep+L.rent+L.sec+L.ins+L.mkt) : L.net+raw-L.rev, a=1/60;
  b.rawR= b.rawR===undefined? raw : b.rawR+(raw-b.rawR)*a; b.rawN= b.rawN===undefined? netRaw : b.rawN+(netRaw-b.rawN)*a; b.rawK=(b.rawK||0)+1;
  if(b.rawK<30) return;
  const inv=balInv(b), R=Math.max(1,b.rawR), C=R-b.rawN, roi1=b.rawN*360/inv;
  const RT=BAL_ROI_D[b.def]||((bizDef(b).tier||0)<=1? 6 : BAL_ROI),   /* V2.1.1 : petits commerces 600 % */ lo=dem?.005:.05, tgt= roi1>RT? clamp(dem? RT*inv/360/Math.max(1,b.rawN) : (RT*inv/360+C)/R,lo,1) : 1;
  b.satF=clamp(f0+(tgt-f0)*.03,lo,1); }); }
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); if(!b||b.status!=='active') return z;
  const f=balF(b)*(BAL_DEM.includes(b.def)?1:(b.satF||1)); if(f!==1){ z.vol*=f; z.rev*=f; } return z; }; }
{ const _ll2=lkList; lkList=function(b){ const L=_ll2(b); if(b&&b.satF<.97) L.push(['sat','Marché saturé',(b.def==='saas'?'abonnés payants −':BAL_DEM.includes(b.def)?'commandes −':'recettes −')+Math.round((1-b.satF)*100)+' %. Ce n’est pas une crise : la société rapporte plus de '+Math.round((BAL_ROI_D[b.def]||((bizDef(b).tier||0)<=1? 6 : BAL_ROI))*100)+' % par an de ce qu’elle a coûté. Le plafond monte avec chaque agrandissement ou rénovation ; sinon, ouvrez la même activité dans une autre ville.',1]); return L; }; }

/* ---------- V2.1.3 : événement de la semaine ----------
   Semaine réelle (du lundi au dimanche). Un secteur où vous êtes présent est mis à l'honneur :
   recettes +20 % pour ses sociétés pendant au plus 30 jours de jeu. Défi : un bénéfice cumulé dans ce secteur pendant l'événement
   (environ 18 jours de bénéfice du secteur au départ, au moins 1 500 €). Récompense : 3 % de la valeur nette (au moins 2 000 €).
   État : S.wev {wk, sec, goal, got, done}. La saturation n'est pas recalculée sur les jours d'événement. */
const WEV_T={restauration:'Semaine de la gastronomie', commerce:'Semaine des soldes', hotel:'Semaine du tourisme', loisirs:'Vacances scolaires',
  luxe:'Semaine de la mode', media:'Festival du film', tech:'Salon de la technologie', bureaux:'Semaine de l’emploi', immo:'Salon de l’immobilier',
  online:'Semaine du commerce en ligne', industrie:'Salon de l’industrie', agri:'Salon de l’agriculture'};
const WEV_F=1.2;
const wevWeek = () => Math.floor((Date.now()/864e5+3)/7);
const wevEnd = wk => (wk*7+4)*864e5;                         /* lundi suivant, 0 h UTC */
function wevSecs(){ return [...new Set(S.biz.filter(b=>b.status==='active'&&!BAL_SKIP.includes(b.def)).map(b=>bizSec(b.def)))].filter(k=>WEV_T[k]).sort(); }
function wevCur(){ const wk=wevWeek(); let W=S.wev;
  if(!W||W.wk!==wk){ const L=wevSecs(); if(!L.length) return null;
    const sec=L[(wk*7919)%L.length]; let n=0; S.biz.forEach(b=>{ if(b.status==='active'&&bizSec(b.def)===sec) n+=Math.max(0,dlNet30(b)); });
    W=S.wev={wk, sec, goal:Math.max(1500,Math.round(n*18/100)*100), got:0, done:0, d0:S.day}; }
  return W; }
const WEV_DAYS=30;   /* l'événement dure au plus 30 jours de jeu dans la semaine réelle */
const wevLive = () => { const W=S.wev; return !!(W&&W.wk===wevWeek()&&S.day-(W.d0||0)<WEV_DAYS); };
const wevOn = b => wevLive()&&bizSec(b.def)===S.wev.sec;
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); if(!b||b.status!=='active'||!wevOn(b)) return z; z.vol*=WEV_F; z.rev*=WEV_F; return z; }; }
function wevReward(){ return Math.max(2000,Math.round((S.nw||0)*.03/100)*100); }
function wevStep(){ const W=wevCur(); if(!W||W.done||W.ld===S.day||!wevLive()) return; W.ld=S.day; let n=0;
  S.biz.forEach(b=>{ if(b.status==='active'&&bizSec(b.def)===W.sec&&b.last&&(b.last.day===S.day||b.last.day===S.day-1)) n+=b.last.net||0; });
  W.got=Math.max(0,W.got+n);
  if(W.got>=W.goal){ W.done=1; S.stats.wev=(S.stats.wev||0)+1; const r=wevReward(); payCap('gen','Événement de la semaine réussi : '+WEV_T[W.sec],r); log('good','Défi de la semaine réussi ('+WEV_T[W.sec]+') : '+eur(r,0)+' de prime.'); } }
{ const _bs=balStep; balStep=function(){ const W=S.wev, on=wevLive(); if(!on) return _bs.apply(this,arguments);
    const keep=S.biz.filter(b=>bizSec(b.def)===W.sec).map(b=>[b,b.satF,b.rawR,b.rawN,b.rawK]); _bs.apply(this,arguments);
    keep.forEach(([b,f,r,n,k])=>{ b.satF=f; b.rawR=r; b.rawN=n; b.rawK=k; }); try{ wevStep(); }catch(e){} }; }
{ const _bs2=balStep; balStep=function(){ _bs2.apply(this,arguments); if(!wevLive()) try{ wevStep(); }catch(e){} }; }

/* V2.1.3 : suivi pour l'écran Statistiques. S.stats.bestDay / bestDayD (meilleur bénéfice d'un jour), S.stats.maxBiz,
   S.secH : un relevé tous les 30 jours {d, v:{secteur: bénéfice des 30 derniers jours}}, 48 relevés au plus (4 ans). */
function statsStep(){ const st=S.stats, act=S.biz.filter(b=>b.status==='active'); let n=0;
  act.forEach(b=>{ if(b.last&&(b.last.day===S.day||b.last.day===S.day-1)) n+=b.last.net||0; });
  if(n>(st.bestDay||0)){ st.bestDay=Math.round(n); st.bestDayD=S.day; } st.maxBiz=Math.max(st.maxBiz||0,act.length);
  if(S.day%30===0){ const v={}; act.forEach(b=>{ const k=bizSec(b.def); v[k]=(v[k]||0)+Math.round((b.hist||[]).slice(-30).reduce((a,x)=>a+x,0)); });
    (S.secH=S.secH||[]).push({d:S.day,v}); if(S.secH.length>48) S.secH.shift(); } }
{ const _bs3=balStep; balStep=function(){ _bs3.apply(this,arguments); try{ statsStep(); }catch(e){} }; }

