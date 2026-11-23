/* ============================================================
   V2.4.8 : PRESTIGE, LUXE ET CRÉDIT REPENSÉS
   Prestige : recalculé chaque jour à partir de ce que vous possédez (voitures, art, propriétés,
   yachts, monuments, objets de collection, résidences construites ; un bien loué compte pour moitié),
   plus un gala ponctuel. Sept rangs ; chaque rang au-dessus du premier apporte, de façon visible :
   ventes +1,5 % pour vos sociétés de luxe et d'hôtellerie, taux d'emprunt −0,1 point, et la
   réputation et l'influence suivent le prestige (comme avant, racine du score).
   Crédit : note de A à E selon votre endettement ; le taux d'un nouvel emprunt dépend de la note et
   du rang de prestige (il reste fixe ensuite).
   Nouveaux champs (avec valeurs par défaut) : S.prB (détail du prestige, recalculé), S.gala
   ({until, next}, absent = aucun gala), S.luxH (cours hebdomadaires du luxe, {} par défaut).
   ============================================================ */
const PR_RANKS=[[0,'Anonyme'],[25,'Notable'],[100,'Personnalité'],[300,'Figure des affaires'],[800,'Élite'],[2000,'Icône'],[5000,'Légende']];
function prRank(p){ p=p===undefined? (S.prestige||0) : p; let r=0; PR_RANKS.forEach((x,i)=>{ if(p>=x[0]) r=i; }); return r; }
const PR_SALES=.015, PR_RATE=.1, GALA_D=30, GALA_CD=90, GALA_K=.25;
const galaOn = () => !!(S.gala&&S.gala.until>=S.day);
function galaCost(){ return Math.max(50000,Math.round((S.nw||0)*.002/1000)*1000); }
function galaHold(){ if(S.gala&&S.gala.next>S.day) return err('Prochain gala possible le '+dateL(S.gala.next)+'.'); const c=galaCost(); if(S.cash<c) return err('Trésorerie insuffisante.');
  payCap('lux','Gala de prestige',-c); S.gala={until:S.day+GALA_D, next:S.day+GALA_CD}; S.rep=clamp((S.rep||50)+1.5,0,100); prCompute();
  return ok('Gala organisé : prestige +'+Math.round(GALA_K*100)+' % pendant '+GALA_D+' jours.'); }
function prCompute(){ const B={car:0,art:0,estate:0,yacht:0,monument:0,coll:0,home:0,prop:0,gala:0};
  (S.lux||[]).forEach(o=>{ const l=D.LUX.find(x=>x.id===o.id); if(!l) return; B[l.kind]=(B[l.kind]||0)+(o.rent? l.pr*.5 : l.pr); });
  (S.prop||[]).forEach(p=>{ const T=D.PROP[p.t]; if(T&&T.pr) B.prop+=T.pr; });
  if(S.auc&&S.auc.coll) B.coll=S.auc.coll.reduce((a,it)=>a+[1,3,8][it.rar||0],0);
  if(S.bldMod) Object.keys(S.bldMod).forEach(id=>{ const m=S.bldMod[id], h=S.bld&&S.bld[id]; if(!h||m.t!=='home') return; const P=D.PLANS[m.plan]; if(P&&P.pr) B.home+=h.lease? P.pr/2 : P.pr; });
  let base=0; Object.keys(B).forEach(k=>{ if(k!=='gala') base+=B[k]; }); if(galaOn()) B.gala=base*GALA_K;
  S.prB=B; S.prestige=Math.round((base+B.gala)*10)/10; return S.prestige; }
/* recalcul en fin de journée, après les étapes du luxe et des chantiers */
{ const _l2=lux2Step; lux2Step=function(){ _l2.apply(this,arguments); prCompute();
  if(!S.luxH) S.luxH={}; if(S.day%7===0) D.LUX.forEach(l=>{ const h=S.luxH[l.id]||(S.luxH[l.id]=[]); h.push(Math.round(S.luxVal[l.id])); if(h.length>52) h.shift(); }); }; }
{ const _cs=consStep; consStep=function(){ const p=S.prestige; _cs.apply(this,arguments); S.prestige=p; }; }
/* rang de prestige : ventes de vos sociétés de luxe et d'hôtellerie */
const PR_SEC=['luxe','hotel'];
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); try{ if(z&&b&&PR_SEC.includes(bizSec(b.def))){ const r=prRank(); if(r>0){ z.rev*=1+PR_SALES*r; } } }catch(e){} return z; }; }
/* note de crédit et taux */
const CR_G=[['A',.1,2],['B',.25,2.75],['C',.4,3.5],['D',.5,4.75],['E',9,6.5]];
function crLev(){ const d=debtTotal(), g=(S.nw||0)+d; return g>0? d/g : 0; }
function crGrade(){ const L=crLev(); return CR_G.find(x=>L<x[1])||CR_G[CR_G.length-1]; }
debtRate=function(){ return Math.max(.5,S.macro.rate+crGrade()[2]-PR_RATE*prRank()); };
/* voitures : modèles fictifs (aucune marque réelle) */
{ const RN={p911:'Coupé sport Arvel GT',rr:'Limousine Sovereign',lamb:'Supercar Taurex V12',db5:'Grand tourisme Ashby 1964',chiron:'Hypercar Velocis',gto:'Berlinette Corsa 1962'};
  D.LUX.forEach(l=>{ if(RN[l.id]) l.n=RN[l.id]; }); }

