/* ============================================================
   PUBLICITÉS ET ACHATS (V1.7.6) — seulement dans l'application (pont IBNative).
   La version web reste sans publicité, sans achat et sans restriction.
   - Vidéos récompensées (choisies) : revenu du jour doublé, gains d'absence doublés,
     parade de crise gratuite, nouveau vivier de l'agence, chantier fini 2 jours plus tôt.
     Au plus AD_MAX par jour réel.
   - Interstitiel : avant « +7 jours » (au plus un toutes les 90 s), et à la fermeture d'une
     fiche de société ou à la création d'une société (au plus un toutes les 20 minutes).
   - sans_pub (2,99 €) : plus d'interstitiel.
   - pack_pro (4,99 €) : sans pub, récompenses sans vidéo, gérant hors ligne jusqu'à 30 jours,
     achat de bâtiments et de villes (donc les villes secondaires).
   Droits : renvoyés par Google Play à chaque lancement (window.ibEnt), gardés en localStorage.
   ============================================================ */
const AD_MAX=8, AD_GAP7=90e3, AD_GAPBIZ=20*60e3;
const IBN = () => !!(window.IBNative&&typeof IBNative.adReward==='function');
let ENT={noads:false, pro:false};
try{ const v=JSON.parse(localStorage.getItem('idlebiz.ent')||'null'); if(v) ENT={noads:!!v.noads, pro:!!v.pro}; }catch(e){}
window.ibEnt=o=>{ ENT={noads:!!(o&&(o.noads||o.pro)), pro:!!(o&&o.pro)}; try{ localStorage.setItem('idlebiz.ent',JSON.stringify(ENT)); }catch(e){} try{ if(S) render(); }catch(e){} };
const isPro = () => !IBN()||ENT.pro;          /* sur le web, tout est ouvert */
const proLocked = () => IBN()&&!ENT.pro;
const PRO_MSG='Réservé au pack Pro (4,99 €, dans Paramètres) : achat de bâtiments et de villes, villes secondaires, récompenses sans publicité et gérant hors ligne jusqu’à 30 jours.';

/* compteur de vidéos du jour (jour réel) */
function adCount(){ const d=new Date().toDateString(); let c={d,n:0}; try{ const v=JSON.parse(localStorage.getItem('idlebiz.adc')||'null'); if(v&&v.d===d) c=v; }catch(e){} return c; }
function adBump(){ const c=adCount(); c.n++; try{ localStorage.setItem('idlebiz.adc',JSON.stringify(c)); }catch(e){} }
const adLeft = () => Math.max(0,AD_MAX-adCount().n);
/* une récompense est proposée dans l'appli seulement (pack Pro : sans vidéo, sans limite) */
const adOffer = () => IBN()&&(ENT.pro||adLeft()>0);
const adLab = t => t+(ENT.pro? '' : ' · vidéo');

const AD_PEND={}; let adSeq=0, adLastInter=0, adLastBiz=0;
function adReward(fn){ if(!IBN()) return; if(ENT.pro){ fn(); return; } if(adLeft()<=0) return toast('Plus de vidéo disponible aujourd’hui.','bad');
  const tag='r'+(++adSeq); AD_PEND[tag]={fn, kind:'r'}; try{ IBNative.adReward(tag); }catch(e){ delete AD_PEND[tag]; } }
function adInter(gap,then){ const now=Date.now();
  if(!IBN()||ENT.noads||ENT.pro||now-adLastInter<gap){ if(then) then(); return; }
  adLastInter=now; const tag='i'+(++adSeq); AD_PEND[tag]={fn:then, kind:'i'}; try{ IBNative.adInter(tag); }catch(e){ delete AD_PEND[tag]; if(then) then(); } }
window.ibAdDone=(tag,ok)=>{ const p=AD_PEND[tag]; if(!p) return; delete AD_PEND[tag];
  if(p.kind==='i'){ if(p.fn) p.fn(); return; }
  if(ok){ adBump(); try{ p.fn(); }catch(e){ console.error(e); } } else toast('Vidéo indisponible pour le moment. Réessayez dans un instant.','bad'); };

/* ---------- Interstitiels ---------- */
{ const _n7=ACT.next7; ACT.next7=function(el){ if(ui.auto||ui.run) return _n7(el); adInter(AD_GAP7,()=>_n7(el)); }; }
function adBizInter(){ if(Date.now()-adLastBiz<AD_GAPBIZ) return; const t0=adLastInter; adInter(0,null); if(adLastInter!==t0) adLastBiz=Date.now(); }
{ const _cm=closeModal; closeModal=function(){ const t=ui.modal&&ui.modal.type; _cm(); if(t==='biz') adBizInter(); }; }
{ const _lg=ACT.launchgo; ACT.launchgo=function(el){ const n=S.biz.length; _lg(el); if(S.biz.length>n) adBizInter(); }; }

/* ---------- Récompenses ---------- */
/* revenu du jour doublé (rapport d'un jour) et gains d'absence doublés (rapport du gérant) */
{ const _mr=modalReport; modalReport=function(m){ const r=_mr(m), s=m.s;
  try{ if(adOffer()&&s&&s.net>0&&!s.adUsed&&(s.off||(s.days===1&&S.adDay!==S.day))){
    const lab= s.off? 'Doubler les gains de l’absence : +'+eur(s.net,0) : 'Doubler le revenu du jour : +'+eur(s.net,0);
    r.body='<div class="notice good ad-o"><div class="row sp"><span>'+esc(lab)+'</span>'+btn(adLab('Obtenir'),'addbl',{c:'sm pri'})+'</div></div>'+r.body; } }catch(e){}
  return r; }; }
ACT.addbl=()=>{ const m=ui.modal, s=m&&m.s; if(!s||s.adUsed||!(s.net>0)) return; const off=!!s.off, v=s.net;
  adReward(()=>{ if(s.adUsed) return; s.adUsed=1; if(!off) S.adDay=S.day; payCap('gen',off?'Bonus : gains de l’absence doublés':'Bonus : revenu du jour doublé',v); settleAccounts(); toast('+'+eur(v,0)+' encaissés.','good'); render(); }); };
/* crise : parade gratuite */
{ const _mc=modalContent; modalContent=function(){ const r=_mc(), m=ui.modal;
  try{ if(m&&m.type==='cri'&&criOn()&&!S.cri.mit&&adOffer()&&r&&r.body) r.body=r.body.replace('<div class="sub">La parade réduit les effets de 60 %.</div>','<div class="row">'+btn(adLab('Parade gratuite'),'adcri',{c:'sm'})+'</div><div class="sub">La parade réduit les effets de 60 %.</div>'); }catch(e){}
  return r; }; }
ACT.adcri=()=>adReward(()=>{ if(!criOn()||S.cri.mit) return; S.cri.mit=1; ui.modal=null; toast(CRI[S.cri.k].par+' offerte : les effets de la crise sont réduits.','good'); render(); });
/* agence : nouveau vivier */
ACT.adpool=()=>adReward(()=>{ if(!agencyEnts().length) return; agencyGen(); toast('Nouveau vivier.','good'); render(); });
{ const _va=VIEWS.agency; VIEWS.agency=function(){ let h=_va.apply(this,arguments);
  try{ if(adOffer()&&agencyEnts().length){ const k=h.indexOf('data-a="agrefresh"'); if(k>0){ const e=h.indexOf('</button>',k)+9; h=h.slice(0,e)+btn(adLab('Nouveau vivier gratuit'),'adpool',{c:'sm ghost'})+h.slice(e); } } }catch(e){}
  return h; }; }
/* chantier : 2 jours de moins, une fois par jour et par société */
function adFastOk(b){ if(b.adFast===S.day) return false; if(b.status==='build') return b.since+b.t-S.day-1>=1; return !!(b.up&&b.up.t>1); }
{ const _mb=modalBiz; modalBiz=function(b){ const r=_mb(b);
  try{ if(r&&r.body&&adOffer()&&adFastOk(b)) r.body='<div class="notice info ad-o"><div class="row sp"><span>'+(b.status==='build'?'Ouverture':'Agrandissement')+' : finir 2 jours plus tôt</span>'+btn(adLab('Accélérer'),'adfast',{c:'sm pri',i:b.id})+'</div></div>'+r.body; }catch(e){}
  return r; }; }
ACT.adfast=el=>{ const id=+el.dataset.i; adReward(()=>{ const b=S.biz.find(x=>x.id===id); if(!b||!adFastOk(b)) return; b.adFast=S.day;
  if(b.status==='build') b.t=Math.max(S.day+1-b.since,b.t-2); else if(b.up) b.up.t=Math.max(1,b.up.t-2); toast('Chantier avancé de 2 jours.','good'); render(); }); };

/* ---------- Pack Pro ---------- */
{ const _bb=buyBuilding; buyBuilding=function(){ if(proLocked()) return err(PRO_MSG); return _bb.apply(this,arguments); }; }
{ const _bc=buyCity; buyCity=function(){ if(proLocked()) return err(PRO_MSG); return _bc.apply(this,arguments); }; }
{ const _od=offmDays; offmDays=function(){ if(!(IBN()&&ENT.pro)) return _od(); if(!S.offm||!S.offm.on||!S.seen) return 0; return Math.min(30,Math.floor((Date.now()-S.seen)/3600000*OFFM.perHour)); }; }

/* ---------- Boutique (Paramètres) ---------- */
{ const _vs=VIEWS.set; VIEWS.set=function(){ const h=_vs.apply(this,arguments); if(!IBN()) return h;
  const row=(id,n,p,d,own)=>'<div class="rs-d"><div><b>'+n+' · '+p+'</b><small>'+d+'</small></div>'+(own? pill('Acheté','good') : btn('Acheter','shopbuy',{c:'sm pri',v:id}))+'</div>';
  return h+card('Boutique','<div class="ht-t">'+
    row('sans_pub','Sans publicité','2,99 €','Plus aucune publicité plein écran. Les bonus restent disponibles avec une vidéo.',ENT.noads)+
    row('pack_pro','Pack Pro','4,99 €','Sans publicité, tous les bonus sans vidéo, gérant hors ligne jusqu’à 30 jours, achat de bâtiments et de villes, villes secondaires.',ENT.pro)+'</div>'+
    '<div class="row">'+btn('Restaurer mes achats','shoprest',{c:'sm ghost'})+btn('Confidentialité des publicités','adpriv',{c:'sm ghost'})+'</div>'+
    '<div class="sub"><a href="https://theoanziani.github.io/idle-business/confidentialite.html" target="_blank" rel="noopener">Politique de confidentialité</a></div>'+
    (ENT.pro? '' : '<div class="sub">Vidéos bonus restantes aujourd’hui : '+adLeft()+' sur '+AD_MAX+'.</div>')); }; }
ACT.shopbuy=el=>{ try{ IBNative.buy(el.dataset.v); }catch(e){} };
ACT.shoprest=()=>{ try{ IBNative.restorePurchases(); toast('Vérification de vos achats…'); }catch(e){} };
ACT.adpriv=()=>{ try{ IBNative.adPrivacy(); }catch(e){} };

