/* ============================================================
   Football : programmes d'entraînement (V1.2.2)
   O.trn = {l:{G,DEF,MID,ATT}, ind:{idJoueur:stat}, ds:bool} (créé au premier besoin).
   Chaque mois, la statistique travaillée monte, les autres stagnent (elles ne baissent qu'avec
   l'âge) ; la note générale suit (dans la limite du potentiel). Avec ds:true, le directeur sportif choisit pour chacun.
   ============================================================ */
const TR_OUT={equ:'Équilibré', vit:'Vitesse', tir:'Tir', pas:'Passe', dri:'Dribble', def:'Défense', phy:'Physique'};
const TR_GK={equ:'Équilibré', ref:'Réflexes', plo:'Plongeon', mai:'Jeu à la main', pie:'Jeu au pied', vit:'Vitesse'};
const TR_LINES={G:['Gardiens',['G']], DEF:['Défenseurs',['DL','DC']], MID:['Milieux',['MD','MC','MO']], ATT:['Attaquants',['AIL','BU']]};
function trOf(O){ if(!O.trn) O.trn={l:{G:'equ',DEF:'equ',MID:'equ',ATT:'equ'}, ind:{}, ds:false}; return O.trn; }
function trProgs(p){ return p.p==='G'? TR_GK : TR_OUT; }
function trLineOf(p){ return Object.keys(TR_LINES).find(k=>TR_LINES[k][1].includes(p.p))||'MID'; }
function trDsOn(O){ return !!(trOf(O).ds && O.ds && O.ds.lvl>0); }
/* choix du directeur sportif : la plus faible des statistiques importantes du poste */
function trDsPick(O,p){ const W=FS_W[p.p]||FS_W.MC, ks=Object.keys(W).sort((a,b)=>W[b]-W[a]).slice(0,O.ds.lvl>=3?3:2); return ks.sort((a,b)=>fsVal(p,a)-fsVal(p,b))[0]; }
function trFocus(O,p){ const T=trOf(O); if(trDsOn(O)) return trDsPick(O,p); const k=T.ind[p.id]||T.l[trLineOf(p)]||'equ'; return k in trProgs(p)? k : 'equ'; }
/* la statistique travaillée monte ; les autres ne bougent pas (elles ne baissent qu'avec l'âge) ;
   la note générale suit, sans dépasser le potentiel */
function trApply(O,p){
  const k=trFocus(O,p); if(k==='equ') return; const sd=fsSd(p); if(!(k in sd)||fsVal(p,k)>=99) return;
  const W=FS_W[p.p]||FS_W.MC, w=W[k]||0, yb=1+.1*(((O.staff&&O.staff.coach)||1)-1);
  let up=Math.min(.9*yb, 99-(p.o+sd[k]));
  const room=fpPot(p)-p.o; if(w>0 && w*up>room) up=Math.max(0,room/w); if(up<=0) return;
  const vals={}; Object.keys(sd).forEach(x=>{ vals[x]=p.o+sd[x]; }); vals[k]+=up;
  const o2=Math.round((p.o+w*up)*100)/100; Object.keys(sd).forEach(x=>{ sd[x]=Math.round((vals[x]-o2)*100)/100; }); p.o=o2;
}
function trSetLine(k,v){ const O=fcOwn(); if(!O||!TR_LINES[k]) return err('Ligne inconnue.'); const P=k==='G'?TR_GK:TR_OUT; if(!P[v]) return err('Programme inconnu.'); trOf(O).l[k]=v; return ok(TR_LINES[k][0]+' : '+P[v].toLowerCase()+'.'); }
function trSetInd(id,v){ const O=fcOwn(); if(!O) return err('Aucun club.'); const p=O.sq.find(x=>String(x.id)===String(id))||fcAcad(O).find(x=>String(x.id)===String(id)); if(!p) return err('Joueur introuvable.');
  const T=trOf(O); if(!v||v==='line'){ delete T.ind[p.id]; return ok(p.n+' suit le programme de sa ligne.'); } if(!trProgs(p)[v]) return err('Programme inconnu.'); T.ind[p.id]=v; return ok(p.n+' : programme '+trProgs(p)[v].toLowerCase()+'.'); }
function trSetDs(on){ const O=fcOwn(); if(!O) return err('Aucun club.'); if(on&&!(O.ds&&O.ds.lvl>0)) return err('Recrutez d’abord un directeur sportif.'); trOf(O).ds=!!on; return ok(on? 'Le directeur sportif choisit les programmes.' : 'Vous choisissez les programmes.'); }
{ const _g=fpGrow; fpGrow=function(p,O){ _g(p,O); try{ trApply(O,p); }catch(e){ console.error(e); } }; }

