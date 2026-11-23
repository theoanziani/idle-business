/* ============================================================
   Football : statistiques détaillées des joueurs (V1.1.6)
   - joueurs de champ : vitesse, tir, passe, dribble, défense, physique
   - gardiens : réflexes, vitesse, plongeon, jeu à la main, jeu au pied
   Les stats sont stockées en écarts (p.sd) autour de la note p.o :
   la moyenne pondérée selon le poste redonne la note générale.
   ============================================================ */
const FS_OUT=[['vit','Vitesse'],['tir','Tir'],['pas','Passe'],['dri','Dribble'],['def','Défense'],['phy','Physique']];
const FS_GK=[['ref','Réflexes'],['vit','Vitesse'],['plo','Plongeon'],['mai','Jeu à la main'],['pie','Jeu au pied']];
const FS_PROF={
  G:{ref:3,vit:-8,plo:2,mai:0,pie:-5},
  DL:{vit:5,tir:-14,pas:0,dri:-3,def:3,phy:0},
  DC:{vit:-4,tir:-18,pas:-6,dri:-12,def:8,phy:6},
  MD:{vit:-3,tir:-9,pas:3,dri:-5,def:5,phy:4},
  MC:{vit:-2,tir:-3,pas:6,dri:2,def:-5,phy:0},
  MO:{vit:1,tir:3,pas:6,dri:6,def:-18,phy:-7},
  AIL:{vit:8,tir:1,pas:0,dri:7,def:-22,phy:-7},
  BU:{vit:2,tir:8,pas:-5,dri:2,def:-26,phy:4}};
const FS_W={G:{ref:.35,plo:.3,mai:.15,pie:.1,vit:.1}, DL:{vit:.25,def:.3,pas:.2,phy:.15,dri:.1}, DC:{def:.45,phy:.3,vit:.1,pas:.15},
  MD:{def:.3,pas:.3,phy:.25,vit:.15}, MC:{pas:.4,dri:.2,def:.15,tir:.1,phy:.15}, MO:{pas:.3,dri:.3,tir:.25,vit:.15},
  AIL:{vit:.3,dri:.35,tir:.2,pas:.15}, BU:{tir:.45,phy:.2,vit:.2,dri:.15}};
function fsKeys(p){ return p.p==='G'? FS_GK : FS_OUT; }
/* écarts : profil du poste + caractère propre au joueur, recentrés pour garder la note */
function fsGen(p){
  const R=footSeedRng(footHash(String(p.n)+'|'+p.p)), prof=FS_PROF[p.p]||FS_PROF.MC, W=FS_W[p.p]||FS_W.MC, sd={};
  fsKeys(p).forEach(([k])=>{ sd[k]=(prof[k]||0)+Math.round((R()-.5)*12); });
  let m=0; Object.keys(W).forEach(k=>{ m+=W[k]*(sd[k]||0); }); Object.keys(sd).forEach(k=>{ sd[k]=Math.round(sd[k]-m); });
  return sd;
}
function fsSd(p){ if(!p.sd || (p.p==='G')!==('ref' in p.sd)) p.sd=fsGen(p); return p.sd; }
function fsVal(p,k){ const sd=fsSd(p); return Math.round(clamp(p.o+(sd[k]||0),15,99)); }
/* note générale recalculée depuis les stats (servira aux entraînements) */
function fsOverall(p){ const W=FS_W[p.p]||FS_W.MC; let s=0; Object.keys(W).forEach(k=>{ s+=W[k]*fsVal(p,k); }); return s; }
/* couleur des stats : vert foncé près de 99, rouge loin */
function fsCls(v){ return v>=88? 'st-a' : v>=78? 'st-b' : v>=68? 'st-c' : v>=58? 'st-d' : v>=48? 'st-e' : 'st-f'; }

/* ---------- Lignes d'une équipe ---------- */
const FS_ATK=['AIL','BU','MO'], FS_MID=['MC','MD','MO'], FS_DEF=['DL','DC','MD'];
function fsLines(xi){
  const avg=(pos,f)=>{ const l=xi.filter(p=>pos.includes(p.slot||p.p)); return l.length? l.reduce((s,p)=>s+f(p),0)/l.length : 45; };
  const atk=avg(FS_ATK,p=>.45*fsVal(p,'tir')+.3*fsVal(p,'dri')+.25*fsVal(p,'vit'));
  const mid=avg(FS_MID,p=>.6*fsVal(p,'pas')+.2*fsVal(p,'dri')+.2*fsVal(p,'phy'));
  const def=avg(FS_DEF,p=>.6*fsVal(p,'def')+.25*fsVal(p,'phy')+.15*fsVal(p,'vit'));
  const g=xi.find(p=>(p.slot||p.p)==='G'), gk=g? .4*fsVal(g,'ref')+.35*fsVal(g,'plo')+.15*fsVal(g,'mai')+.1*fsVal(g,'pie') : 40;
  return {atk, mid, def, gk, wall:.65*def+.35*gk};
}
function fsTeamXI(id){ const O=fcOwn(); return O&&O.id===id? fcLineup().xi : footXI(id).xi; }
/* possession attendue (domicile) */
function fsPoss(h,a){ const H=fsLines(fsTeamXI(h)), A=fsLines(fsTeamXI(a)); return clamp(.5+(H.mid-A.mid)/60,.3,.7); }

/* ---------- Moteur du match de votre club : lignes + léger avantage ---------- */
/* buts attendus des deux équipes selon leurs onze (xh, xa) */
function fsRates(h,a,neutral,xh,xa){
  const O=fcOwn(), st=FC_STYLE[O.style]||FC_STYLE.eq, mine=O.id===h?0:1;
  const rh=footR(h), ra=footR(a), adv=neutral?0:.15, H=fsLines(xh), A=fsLines(xa);
  const duel=((H.atk-A.wall)-(A.atk-H.wall))/2, pos=(H.mid-A.mid)/2;
  const e=(rh-ra)/45+duel*.013+pos*.005;   /* note + lignes : même ampleur que l'ancien moteur */
  let lh=1.30*Math.exp(e+adv), la=1.10*Math.exp(-e-(neutral?0:.04));
  if(mine===0){ lh*=st.f*1.07; la*=st.a*.95; } else { la*=st.f*1.07; lh*=st.a*.95; }
  return [Math.min(lh,4.5),Math.min(la,4.5)];
}
footPlay=function(h,a,neutral){
  const O=fcOwn(); if(!O || (O.id!==h && O.id!==a)) return footPlayBase(h,a,neutral);
  const [lh,la]=fsRates(h,a,neutral,fsTeamXI(h),fsTeamXI(a)); let res=[fpois(lh),fpois(la)];
  /* rejeu après vos changements : même tirage au sort, score imposé */
  if(typeof FOOT_FORCE!=='undefined'&&FOOT_FORCE&&FOOT_FORCE.h===h&&FOOT_FORCE.a===a){ res=[FOOT_FORCE.gh,FOOT_FORCE.ga]; FOOT_FORCE=null; }
  O.poss=Math.round(fsPoss(h,a)*100);
  fcAfterMatch(h,a,res[0],res[1]);
  return res;
};

/* ---------- Résultat caché tant que le match n'a pas été regardé ---------- */
function fcHidden(h,a,day){ const O=S&&S.foot&&S.foot.own, L=O&&O.last; return !!(L&&!L.seen&&L.h===h&&L.a===a&&L.day===day); }

