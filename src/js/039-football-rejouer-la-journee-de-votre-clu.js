/* ============================================================
   Football : rejouer la journée de votre club (V1.2.4)
   Avant une journée où votre club joue, on garde une copie de l'état du football et des comptes
   (en mémoire seulement). Si vos changements en direct modifient le score, on restaure cette copie
   et on rejoue la journée avec le même tirage au sort : seul votre score change, dans toutes les
   compétitions (championnat, coupe, séries, coupes internationales, tirs au but compris).
   ============================================================ */
var FOOT_SNAP=null, FOOT_FORCE=null, FOOT_REPLAY=false;
const FR_KEYS=['foot','cash','acc','fl','tb','ledger','journal','gl'];
function frPlaysOn(day){ const O=fcOwn(); if(!O||typeof fcUpcoming!=='function') return false; const sd=S.day; S.day=day; try{ const u=fcUpcoming(O); return !!(u&&!u.start&&u.day===day); }catch(e){ return false; } finally{ S.day=sd; } }
{ const _fs=footStep; footStep=function(day){
  if(FOOT_REPLAY||!frPlaysOn(day)) return _fs(day);
  const snap=JSON.stringify(FR_KEYS.map(k=>S[k]===undefined?null:S[k])), O=fcOwn(), before=O&&O.last;
  _fs(day);
  const O2=fcOwn(); FOOT_SNAP= O2&&O2.last&&O2.last!==before? {day, snap, h:O2.last.h, a:O2.last.a, d:O2.last.day} : null;
}; }
/* la journée peut-elle encore être rejouée ? (aucun jour joué depuis) */
function frCanReplay(h,a,day){ const F=FOOT_SNAP; return !!(F&&F.h===h&&F.a===a&&F.d===day&&S.day===F.day+1); }
function frReplay(gh,ga){
  const F=FOOT_SNAP; if(!F) return false;
  const v=JSON.parse(F.snap); FR_KEYS.forEach((k,i)=>{ if(v[i]===null) delete S[k]; else S[k]=v[i]; });
  FOOT_FORCE={h:F.h, a:F.a, gh, ga}; FOOT_REPLAY=true;
  try{ footStep(F.day); } finally { FOOT_REPLAY=false; FOOT_FORCE=null; }
  FOOT_SNAP=null; return true;
}

