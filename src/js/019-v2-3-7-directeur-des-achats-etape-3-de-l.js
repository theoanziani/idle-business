/* ============================================================
   V2.3.7 : DIRECTEUR DES ACHATS (étape 3 de la refonte de l'approvisionnement)
   Recruté au niveau du groupe. Chaque lundi : choisit le fournisseur de chaque société cliente (vos usines seulement
   si elles couvrent sans risque le besoin, mixte sinon, marché si aucune ne produit), règle la répartition et la
   qualité des lignes de vos usines (textile et composants ; la ferme suit ses parcelles, il n'y règle que la qualité)
   selon les besoins du groupe, et fait garder plus de stock d'avance. En pénurie, il sert d'abord les sociétés en
   « vos usines seulement », puis celles qui gagnent le plus à la qualité.
   Compétence : grandit avec l'ancienneté (S.achD, jour d'embauche) de 55 à 95 %. Le joueur peut reprendre la main
   sur une société (b.srcMan) ou une usine (b.fpMan) : le directeur ne la touche plus.
   ============================================================ */
D.MGR.ach={n:'Directeur des achats', hire:40000, day:450, txt:'Chaque lundi, choisit le fournisseur de chaque société cliente de vos usines, règle la production et la qualité de vos usines selon les besoins du groupe et fait garder du stock d’avance pour éviter les ruptures.'};
{ const _sm=setMgr; setMgr=function(k,v){ const was=mgrOn(k), r=_sm(k,v); if(k==='ach'&&r&&r.ok&&v&&!was) S.achD=S.day; return r; }; }
const achQ = () => mgrOn('ach')? clamp(.55+(S.day-(S.achD||S.day))/720*.4,.55,.95) : 0;
function achStep(){ if(!mgrOn('ach')) return; const q=achQ(), I=S.ind;
  /* 1. production : répartition et qualité des usines (demande de toutes vos sociétés clientes, quel que soit leur fournisseur) */
  const allC = p => S.biz.filter(c=>SUP_NEED[c.def]&&SUP_NEED[c.def][p]&&c.status==='active');
  const nF = p => Math.max(1,S.biz.filter(x=>isFact(x)&&x.status==='active'&&fpInit(x)&&x.st[p]).length);
  S.biz.filter(f=>isFact(f)&&f.status==='active'&&!f.fpMan&&fpInit(f)).forEach(f=>{ const P=prodsOf(f), V=f.prodAvgV||0; if(V<=0) return;
    const dem={}; P.forEach(p=>{ dem[p]=allC(p).reduce((a,c)=>a+supNeedP(c,p),0)/nF(p); });
    if(I) I.active.forEach(c=>{ if(c.st==='open'&&P.includes(c.p)) dem[c.p]+=c.qty*pPrice(c.p,c.qm)/Math.max(5,c.due-S.day); });
    const tot=P.reduce((a,p)=>a+dem[p],0);
    /* le surplus au-delà des besoins reste réparti comme avant (vente au gros) */
    if(f.def!=='farm'&&tot>0){ const k=Math.min(1,tot/V); P.forEach(p=>{ const base=(f.mix[p]||0)/fpW(f); f.mix[p]=Math.max(dem[p]>0?.3:0, (dem[p]/tot*k+base*(1-k))*10); }); }
    /* qualité : celle qui rapporte le plus au groupe (bonus de ventes des clients − manque à gagner de l'usine) */
    P.forEach(p=>{ const Vp=V*fpShare(f,p); if(dem[p]<=0){ f.pq[p]=0; return; } let best=0, bv=-1e18;
      for(let k=0;k<3;k++){ const sup=Vp*QV[k]/QC[k], cov=Math.min(1,sup/dem[p]);
        const gain=allC(p).reduce((a,c)=>{ const N=SUP_NEED[c.def], w=N[p]/Object.values(N).reduce((x,y)=>x+y,0); return a+Math.max(0,c.last&&c.last.rev||0)*(SUP_QB[c.def]||0)*k/2*w*cov/nF(p); },0)*(.25+q*.25) - Vp*(1-QV[k]/QC[k]);
        if(gain>bv){ bv=gain; best=k; } } f.pq[p]=best; }); });
  /* 2. fournisseur de chaque société cliente */
  S.biz.filter(c=>SUP_NEED[c.def]&&c.status==='active'&&!c.srcMan).forEach(c=>{ const N=SUP_NEED[c.def]; let need=0, cov=0;
    Object.keys(N).forEach(p=>{ const n=supNeedP(c,p); need+=n; const F=supFactsP(p); if(!F.length) return;
      const cap=F.reduce((a,f)=>a+(f.prodAvgV||0)*fpShare(f,p)*QV[f.pq[p]||0]/QC[f.pq[p]||0],0), dmd=Math.max(1,supClientsP(p).reduce((a,x)=>a+supNeedP(x,p),0));
      cov+=n*Math.min(1,cap/dmd); });
    const r= need>0? cov/need : 0; c.src= r>=1.25-q*.2? 'own' : r>0? 'mix' : 'mkt'; });
}
{ const _ms=mgrStep; mgrStep=function(){ _ms(); try{ if(mgrOn('ach')&&wdOf(S.day)===0) achStep(); }catch(e){ console.error(e); } }; }
/* réserve : plus de stock d'avance avec le directeur (2 à 3,5 jours au lieu de 1,5) */
supReserveV=(function(_r){ return function(g,b){ return _r(g,b)*(mgrOn('ach')? (1.35+achQ()*1.0) : 1); }; })(supReserveV);

/* V2.4.8 : production encore libre d'un produit sur « days » jours : stock (qualité ≥ qm) + production nette
   des livraisons quotidiennes à vos sociétés, moins les contrats signés non livrés. Rien de sauvegardé. */
function contFree(p,qm,days){ const P=D.PRODS[p]; if(!P) return {free:0,rate:0,own:0,stock:0,cmt:0}; days=Math.max(0,days);
  let rate=0, stock=0, q0=0, n=0; S.biz.forEach(b=>{ if(!isFact(b)||b.status!=='active') return; fpInit(b); if(!b.st||!b.st[p]) return;
    stock+=fpUnits(b,p,qm); const q=(b.pq&&b.pq[p])||0; if(b.mix&&b.mix[p]>0&&q>=qm){ rate+=(b.prodAvgV||b.prodDayV||0)*fpShare(b,p)/(P.v*QC[q]); q0+=q; n++; } });
  let own=0; try{ if(S.biz.some(f=>isFact(f)&&f.status==='active'&&supOn(f)&&f.mix&&f.mix[p]>0)){ const pr=pPrice(p,n? Math.round(q0/n) : 0); own=supClientsP(p).reduce((a,c)=>a+supNeedP(c,p),0)/Math.max(.01,pr); } }catch(e){}
  const cmt=(S.ind? S.ind.active : []).filter(c=>c.st==='open'&&c.p===p).reduce((a,c)=>a+c.qty,0);
  return {free: stock+Math.max(0,rate-own)*days*.9-cmt-own*1.5, rate, own, stock, cmt}; }

