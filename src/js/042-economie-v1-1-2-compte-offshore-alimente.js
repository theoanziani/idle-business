/* ============================================================
   ÉCONOMIE V1.1.2 : compte offshore alimenté chaque jour
   Une part des bénéfices du jour (0, 5, 10 ou 20 %) part automatiquement sur le compte offshore.
   Plus le compte pèse lourd par rapport à votre valeur nette, plus le risque de contrôle monte.
   État : S.off.pct (part versée chaque jour).
   ============================================================ */
const OFF_PCTS = [0,.05,.1,.2];
function offDaily(){ const O=S.off; if(!O||!O.on||!O.pct) return;
  const net=S.biz.reduce((a,b)=>a+(b.status==='active'&&b.last&&b.last.net>0? b.last.net : 0),0); if(net<=0) return;
  const a=Math.min(net*O.pct, Math.max(0,S.cash)); if(a<1) return;
  payCap('gen','Versement automatique vers le compte offshore',-a); O.bal+=a; O.risk+=0.15*a/Math.max(1e5,S.nw); }
const offWeight = () => { const O=S.off; return O&&O.on? clamp(O.bal/Math.max(1,S.nw),0,2) : 0; };
{ const _or=offRisk; offRisk=function(){ return clamp(_or()+.25*offWeight(),0,.75); }; }
{ const _nd=nextDay; nextDay=function(){ const r=_nd(); if(r){ try{ offDaily(); }catch(e){ console.error(e); } } return r; }; }
function offSetPct(i){ const O=S.off; if(!O||!O.on) return err('Ouvrez d’abord un compte offshore.'); i=+i; if(!(i>=0&&i<OFF_PCTS.length)) return err('Part inconnue.'); O.pct=OFF_PCTS[i]; return ok(i? Math.round(OFF_PCTS[i]*100)+' % des bénéfices du jour partiront sur le compte.' : 'Versements automatiques arrêtés.'); }
/* ---------- Grand livre : totaux par société et activité depuis les derniers impôts ---------- */
function glInit(){ if(!S.gl) S.gl={since:Math.max(1,(S.nextTax||30)-30), s:{}}; return S.gl; }
{ const _rec=rec; rec=function(src,label,amt,cap){ _rec(src,label,amt,cap); try{ const G=glInit(), x=G.s[src]||(G.s[src]={in:0,out:0}); if(amt>0) x.in+=amt; else x.out-=amt; }catch(e){} }; }
{ const _ts=taxStep; taxStep=function(){ const nt=S.nextTax; _ts(); if(S.nextTax!==nt){ S.gl={since:S.day, s:{}}; } }; }
/* ---------- Service RH : profils visés, lundi et mercredi, moral des directeurs ---------- */
/* Notes des salariés sur 100 : productivité (0,6 → 1,7 devient 0 → 99), fiabilité en %, fidélité sur 100 */
const prodNote = p => clamp(Math.round(60+((p||1)-1)*80),1,99);   /* 1,00 (profil moyen) = 60/100 */
const HR_PROD=[0,40,50,60,70], HR_REL=[0,75,85,90,95], HR_LOY=[0,50,60,70], HR_BOSS=[0,40,55,70];
function hrSet(){ if(!S.hrSet) S.hrSet={prod:0, rel:0, loy:0, boss:0}; return S.hrSet; }
function hrFits(c){ const H=hrSet(); return prodNote(c.prod)>=HR_PROD[H.prod]&&c.rel*100>=HR_REL[H.rel]&&c.loy>=HR_LOY[H.loy]; }
hrStep=function(){
  const L=hrLvl(); if(!L||!S.biz.length) return;
  pay('gen','Service RH',-HR.day[L]*progMult());
  /* V1.4.8 : chaque jour, tout poste vacant est pourvu dès qu'un candidat du vivier respecte vos critères minimaux.
     Le lundi, ce qui reste vide est complété par des profils moyens, seulement si ce profil respecte lui aussi vos critères. */
  const A=agencyInit(), H=hrSet(), mon=wdOf(S.day)===0, avgOk=hrFits({prod:1,rel:.85,loy:62}); let left=Infinity, n=0, avg=0;
  agencyVacancies().filter(v=>v.e.kind==='bank'||v.e.status==='active').forEach(v=>{
    let free=v.free;
    for(let i=0;i<v.free&&left>0;i++){
      const c=A.pool.filter(x=>x.role===v.role&&hrFits(x)).sort((a,b)=>b.prod-a.prod)[0]; if(!c) break;
      const fee=agencyFee(v.e,v.role,c); if((v.e.kind==="bank"? S.cash : availFor(cityOf(v.e).ccy))<fee*4+1000) break;
      if(agencyHire(c.id,v.key).ok){ left--; n++; free--; } else break; }
    if(mon&&avgOk&&free>0){ const r=hireFill(v.e,v.role,free); if(r&&r.ok){ avg+=free; n+=free; } } });
  if(n) log('info','Service RH : '+n+' recrutement(s)'+(avg? ', dont '+avg+' profil'+(avg>1?'s':'')+' moyen'+(avg>1?'s':'')+' faute de candidat dans le vivier' : '')+'.');
  /* moral des directeurs : augmentation de 10 % dès que le moral passe sous le seuil choisi (contrôle chaque jour, plus de délai mensuel) */
  if(H.boss) S.biz.forEach(b=>{ const x=b.boss; if(!x||b.status!=='active'||x.mood>=HR_BOSS[H.boss]||x.hrr===S.day) return;
    x.sal*=1.1; x.mood=clamp(x.mood+15,0,100); x.hrr=S.day; log('info','Service RH : '+x.name+' (« '+b.name+' ») est augmenté de 10 % pour remonter son moral.'); });
};
function hrSetK(k,i){ const H=hrSet(), L={prod:HR_PROD,rel:HR_REL,loy:HR_LOY,boss:HR_BOSS}[k]; if(!L||!(+i>=0&&+i<L.length)) return err('Réglage inconnu.'); H[k]=+i; return ok(''); }
/* ---------- Muter un directeur vers une autre société ---------- */
function moveBoss(from,to){ if(!from||!from.boss) return err('Aucun directeur à muter.'); if(!to||to===from||to.status!=='active') return err('Société de destination indisponible.');
  const x=from.boss, y=to.boss; to.boss=Object.assign({},x,{since:S.day, mood:clamp(x.mood-5,0,100)}); from.boss=y? Object.assign({},y,{since:S.day, mood:clamp(y.mood-5,0,100)}) : null;
  return ok(x.name+' prend la direction de « '+to.name+' »'+(y? ' ; '+y.name+' le remplace à « '+from.name+' ».' : '.')); }
/* ---------- Affichage des effets en pourcentage (au lieu de ×1,06) ---------- */
const pctS = f => { const v=Math.round(f*100); return v===0? '0 %' : (v>0?'+':'−')+Math.abs(v)+' %'; };
const multPct = m => pctS(m-1);
const noteCls = v => v>=80?'nt-a':v>=65?'nt-b':v>=50?'nt-c':v>=35?'nt-d':'nt-e';

