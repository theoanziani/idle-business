/* ============================================================
   REFONTE DES SOCIÉTÉS : socle commun
   - Activités retirées (cybersécurité, supermarché, agence immobilière, fast-food) et
     fusionnées (start-up SaaS + IA = start-up tech ; composants + smartphones = électronique).
   - Activités « cœur » (MET[def].core) : leur propre fonctionnement remplace le prix et
     le marketing génériques.
   - Délégation au directeur du site (b.boss) : « Je gère », « Assisté », « Délégation totale »
     (MET[def].auto(b, mode, qualité, budget)).
   - Paliers de maîtrise (b.mx) : 5 paliers par activité, qui débloquent des options (MET[def].ranks).
   ============================================================ */
/* Retirées : les sociétés existantes sont rachetées à leur valeur.
   Fusionnées : plus de nouvelles créations ; les sociétés existantes continuent
   telles quelles jusqu'à la refonte de l'activité qui les absorbe. */
const BIZ_GONE = ['cyber','super','agency','fastfood'];
const BIZ_MERGED = {ai:'saas', phones:'electronics'}; /* les usines de smartphones sont converties par metier_elec.js */
D.biz.saas.n='Start-up tech'; D.biz.saas.sub='Logiciel, puis intelligence artificielle';
/* week-end : les commerces de proximité vendent plus le samedi et le dimanche (salaires ×1,5) */
Object.entries({repair:1.35, resto:1.5, gallery:1.45, couture:1.5, dealer:1.5}).forEach(([k,v])=>{ if(D.biz[k]) D.biz[k].wkf=v; });
function weFactor(b){ const d=bizDef(b); return isWE(S.day)&&(d.open==='always'||b.wk)? d.wkf : 1; }
/* start-up : phases deux fois plus courtes */
Object.keys(D.biz).forEach(k=>{ const su=D.biz[k].startup; if(su&&!su.half){ su.ph=su.ph.map(([n,d])=>[n,Math.max(2,Math.round(d/2))]); su.half=1; D.biz[k].launch=Math.round(D.biz[k].launch/2); } });
D.biz.electronics.n='Électronique'; D.biz.electronics.sub='Composants, puis smartphones';
BIZ_GONE.concat(Object.keys(BIZ_MERGED)).forEach(k=>{ if(D.biz[k]) D.biz[k].retired=true; });
D.bizOrder=D.bizOrder.filter(k=>!D.biz[k].retired);
function bizMigrateRetired(s){
  if(!s||!Array.isArray(s.biz)) return;
  s.biz.forEach(b=>{ if(BIZ_GONE.includes(b.def)&&!b.retiredFrom){ b.retiredFrom=b.def;
    s.journal=s.journal||[]; s.journal.push({d:s.day,s:'warn',k:'own',m:'« '+b.name+' » ('+D.biz[b.def].n+') : cette activité disparaît du jeu. La société est rachetée à sa valeur.'}); } });
}
{ const _mig=migrateState; migrateState=function(s){ const r=_mig(s); try{ bizMigrateRetired(r); }catch(e){ console.error(e); } return r; }; }
function bizRetireStep(){
  S.biz.slice().forEach(b=>{ if(!BIZ_GONE.includes(b.def)) return;
    const v=b.status==='active'? Math.max(bizValue(b),bizDef(b).cost*.8) : Math.max(b.inv$||0,bizDef(b).cost*.8);
    closeBiz(b,v,'un repreneur'); });
  /* les enseignes rivales des activités retirées changent d'activité (ou ferment) */
  if(S.riv&&Array.isArray(S.riv.deals)) S.riv.deals=S.riv.deals.filter(x=>D.biz[x.def]&&!D.biz[x.def].retired);
  if(S.riv&&Array.isArray(S.riv.shops)) S.riv.shops=S.riv.shops.filter(sh=>{ if(!D.biz[sh.def]||!D.biz[sh.def].retired) return true;
    const bd=bldById(sh.bld), opts=bd? bldDefs(bd).filter(d=>!D.biz[d].startup) : []; if(!opts.length) return false;
    const same=opts.filter(d=>bizSec(d)===bizSec(sh.def)); sh.def=pick(same.length?same:opts); sh.lvl=Math.max(1,Math.min(sh.lvl,bldMaxLvl(bd,sh.def))); return true; });
}

/* ---------- Activités « cœur » : pas de prix ni de marketing génériques ---------- */
const metCore = b => !!(metOf(b) && metOf(b).core);
{ const _pb=processBiz; processBiz=function(b){ if(metCore(b)){ if(b.status==='active') metState(b); b.price=1; b.mkt=0; } return _pb(b); }; }

/* ---------- Paliers de maîtrise ---------- */
const MX_STEPS=[0,25,80,180,340,600];
function mxRank(b){ const mm=metOf(b); if(mm&&mm.rank&&b.m) return mm.rank(b); const x=b.mx||0; let r=0; MX_STEPS.forEach((v,i)=>{ if(x>=v) r=i; }); return r; }
function mxNext(b){ const r=mxRank(b); return r>=5? null : MX_STEPS[r+1]; }
function mxDaily(b){
  if(b.status!=='active'||!metOf(b)) return;
  const R0=metR0(b)||1, net=b.last? (b.last.net0!==undefined? b.last.net0 : b.last.net) : 0, r0=mxRank(b);   /* la maîtrise suit le vrai résultat du jour, avant report des frais */
  b.mx=(b.mx||0)+clamp(.35+net/R0*.6,0,1.6);
  const r1=mxRank(b), m=metOf(b);
  if(r1>r0 && m.ranks && m.ranks[r1-1]){ metLog(b,'palier de maîtrise '+r1+' atteint : '+m.ranks[r1-1].n+'. '+m.ranks[r1-1].d,'good'); }
}
const mxHas = (b,r) => mxRank(b)>=r;

/* ---------- Délégation au directeur du site ---------- */
const DL_MODES = {me:{n:'Je gère', d:'Le directeur conseille, vous décidez.'}, assist:{n:'Assisté', d:'Il gère le quotidien (entretien, réglages, prix selon la saison). Les investissements restent à vous.'}, full:{n:'Délégation totale', d:'Il gère tout et investit une part des bénéfices dans l’activité.'}};
const DL_BUD = [.1,.25,.5];
function dlMode(b){ return (b.boss && b.dl) || 'me'; }
function dlQuality(b){ return b.boss? clamp(bossAvg(b.boss)/10,.2,1) : 0; }
function setDelegation(b,mode,bud){
  if(mode!==undefined){ if(!DL_MODES[mode]) return err('Mode inconnu.'); if(mode!=='me'&&!b.boss) return err('Recrutez d’abord un directeur du site.'); b.dl=mode; }
  if(bud!==undefined) b.dlb=clamp(+bud|0,0,2);
  return ok(mode? 'Délégation : '+DL_MODES[b.dl||'me'].n.toLowerCase()+'.' : 'Budget mis à jour.');
}
/* réserve d'investissement du directeur : une part des bénéfices de chaque jour, plafonnée à un an de cette part */
const lc1 = s => s.charAt(0).toLowerCase()+s.slice(1);   /* V2.5.3 : minuscule initiale seulement (noms propres gardés) */
function dlBudget(b){ return Math.max(0,b.dlp||0); }
function dlSpend(b,cost,label){ if(cost>dlBudget(b)) return false; if(!metBuy(b,cost,label)) return false; b.dlp=dlBudget(b)-cost; return true; }
/* prochain achat visé par le directeur : le moins cher des investissements encore possibles */
/* V1.8.2 : achats « bouton » payants compris (montée en gamme, resort…), achats refusés écartés 30 jours,
   et à défaut l'agrandissement de la société : il y a toujours un achat visé tant qu'un niveau reste à gagner */
const dlSkipped = (b,k) => !!(b.dlSkip&&b.dlSkip[k]>S.day);
const dlNet30 = b => { const h=(b.hist||[]).slice(-30); return h.length? h.reduce((a,x)=>a+x,0)/h.length : 0; };
/* V2.0.2 : bénéfice moyen sur environ 120 jours (activités à cycles : collections, récoltes, films) */
const dlNetL = b => b.dlE!==undefined? Math.max(b.dlE,dlNet30(b)) : dlNet30(b);
/* V2.5.8 : activités à ventes ponctuelles (films, programmes immobiliers, enchères, collections, récoltes, chantiers) :
   leurs alertes de perte se fondent sur la moyenne d'environ 4 mois, jamais sur 10 ou 30 jours */
const BIZ_CYC=['studio','promo','gallery','couture','farm','build'];
const bizCyc = b => BIZ_CYC.includes(b.def);
const bizNetRef = b => bizCyc(b)? (b.dlE!==undefined? b.dlE : dlNet30(b)) : dlNet30(b);
/* V2.1.9 : bâtiment visé pour grandir : le meilleur emplacement, puis le loyer le plus bas parmi ceux qui permettent
   au moins trois niveaux de plus (avant : toujours le plus grand, au loyer souvent démesuré pour l’activité) */
function dlRelocPick(b){ const L=relocCands(b,1).filter(x=>x.mx>b.lvl); if(!L.length) return null; const need=Math.min(MAXLVL,b.lvl+3);
  const top=Math.max(...L.map(x=>x.fit)), T=L.filter(x=>x.fit===top), big=T.filter(x=>x.mx>=need);
  return (big.length? big : T).sort((x,y)=>big.length? bldRent(x.bd)-bldRent(y.bd) : (y.mx-x.mx)||(bldRent(x.bd)-bldRent(y.bd)))[0]; }
function dlGoal(b){ const mm=metOf(b); if(!mm||b.status!=='active') return null; let best=null;
  try{ metCtl(b).forEach(c=>{ if((c.k==='buy'||(c.k==='btn'&&c.once))&&!c.owned&&!c.dis&&c.cost>0&&c.act&&!dlSkipped(b,c.act+':'+c.arg)&&(!best||c.cost<best.c)) best={n:c.label, c:c.cost, act:c.act, arg:c.arg}; });
    if(mm.goal){ const g=mm.goal(b); if(g&&(!best||g.c<best.c)) best=g; } }catch(e){}
  /* V1.8.6 : pas d'agrandissement si la société perd de l'argent, ni si le précédent n'a pas fait monter le bénéfice */
  const n30=dlNetL(b), upOk= n30>0 && (b.dlUpN===undefined || n30>=b.dlUpN*1.05 || S.day-(b.dlUpD||0)>=180);   /* V2.0.1 : nouvel essai au bout de 180 jours */
  /* V1.8.4 : l'agrandissement reste l'achat visé (la réserve peut donc l'atteindre), y compris pendant un
     agrandissement en cours (niveau suivant) ; s'il vient d'échouer, il reste visé mais n'est retenté qu'après 30 jours */
  if(!best&&b.up&&b.lvl+1<MAXLVL&&upOk){ b.lvl++; const c=upgradeCost(b); b.lvl--; best={n:'Agrandir au niveau '+(b.lvl+2)+' (après le chantier en cours)', c, up:1, wait:1}; }
  if(!best&&!b.up&&b.lvl<MAXLVL&&upOk){ const bd=b.bld&&bldById(b.bld), full=bd&&b.lvl+1>bldMaxLvl(bd,b.def);
    if(!full) best={n:'Agrandir la société (niveau '+(b.lvl+1)+')', c:upgradeCost(b), up:1, wait:dlSkipped(b,'up')?1:0};
    /* V1.8.3 : bâtiment trop petit pour grandir : déménager dans la même ville vers un bâtiment plus grand */
    else if(full&&!dlSkipped(b,'rel')){ try{ const C=dlRelocPick(b);
      if(C) best={n:'Déménager au '+C.bd.addr+' pour grandir (niveau '+C.mx+' au plus)', c:relocCost(b), rel:C.bd.id}; }catch(e){} } }
  return best; }
/* achat d'une action métier payée sur la trésorerie, décomptée de la réserve */
function dlAct(b,cost,fn){ if(!(cost>0)||dlBudget(b)<cost) return false; const r=fn(); if(r&&r.ok){ b.dlp=dlBudget(b)-cost; return true; } return false; }
function dlDaily(b){
  const m=metOf(b); if(!m||!m.auto||b.status!=='active') return;
  /* V2.5.8 : moyenne longue tenue aussi quand vous gérez vous-même (sert aux alertes des activités à ventes ponctuelles) */
  if(b.last&&b.last.day!==b.dlEd){ b.dlEd=b.last.day; const n=b.last.net||0; b.dlE= b.dlE===undefined? n : b.dlE+(n-b.dlE)/120; }
  const mode=dlMode(b); if(mode==='me') return;
  if(mode==='full'&&b.last){ const add=DL_BUD[b.dlb||0]*Math.max(0,b.last.net0!==undefined? b.last.net0 : b.last.net), g=dlGoal(b);
    /* V1.5.8 : réserve plafonnée à trois ans de mise de côté, ou au prix du prochain achat visé s'il est plus cher */
    b.dlp=Math.min(dlBudget(b)+add, Math.max(dlBudget(b),add*1080,g? g.c*1.05 : 0));
    /* V1.6.6 : plus rien à acheter : la réserve ne garde que trois mois de mise de côté */
    if(!g) b.dlp=Math.min(b.dlp,add*90); }
  try{ if(!b.m) metState(b); m.auto(b,mode,dlQuality(b)); }catch(e){ console.error(e); }   /* V2.1.8 : état du métier recréé s’il manque */
  /* V1.8.1 : en délégation totale, le directeur achète lui-même l'achat visé dès que la réserve le couvre
     (avant : seuls les achats prévus par le métier étaient faits, la réserve pouvait dormir) */
  if(mode==='full'){ try{ for(let k=0;k<3;k++){ const g=dlGoal(b); if(!g||g.wait||!(g.act||g.up||g.rel)) break;
      /* V1.8.8 : « priorité du groupe » : à mi-chemin de l'achat visé, le directeur complète avec la trésorerie
         générale, sans descendre sous un mois de dépenses du groupe */
      if(dlBudget(b)<g.c&&b.dlg&&dlBudget(b)>=g.c*.5){ const need=g.c-dlBudget(b); if(S.cash-need>=finBuf()){ b.dlp=(b.dlp||0)+need; metLog(b,'priorité du groupe : '+eur(need,0)+' de la trésorerie générale pour « '+lc1(g.n)+' ».'); } }
      if(dlBudget(b)<g.c) break; const key=g.up? 'up' : g.rel? 'rel' : g.act+':'+g.arg;
      const done=dlAct(b,g.c,()=>{ const r= g.up? (b.dlUpN=dlNetL(b), b.dlUpD=S.day, upgradeBiz(b)) : g.rel? relocBiz(b,g.rel) : metAct(b,g.act,g.arg); if(r&&r.ok!==false) metLog(b,'Votre directeur : '+lc1(g.n)+' ('+eur(g.c,0)+').'); return r; });
      /* refusé, ou achat renouvelable (cave, stock…) : on n'y revient pas avant 30 jours */
      b.dlSkip=b.dlSkip||{}; b.dlSkip[key]=S.day+30; if(!done) continue; } }catch(e){ console.error(e); } }
}
{ const _ns=nextDay; nextDay=function(){ const ok=_ns(); if(ok){ try{ bizRetireStep(); S.biz.forEach(b=>{ mxDaily(b); dlDaily(b); }); }catch(e){ console.error(e); } } return ok; }; }

/* V2.3.2 : « priorité du groupe » pour tous les achats du directeur, y compris ceux de son métier (terminaux, quais,
   navires, places dans les tours, créneaux, avions, immeubles, travaux…) : dès que sa réserve couvre la moitié du prix,
   la trésorerie générale complète, sans descendre sous un mois de dépenses du groupe (avant : seuls l'agrandissement,
   le déménagement et les améliorations du métier en profitaient ; le reste attendait que la réserve atteigne tout le prix). */
function dlTopUp(b,c,label){ if(!b||!b.dlg||!(c>0)) return; const r=dlBudget(b); if(r>=c||r<c*.5) return; const need=c-r;
  if(S.cash-need<finBuf()) return; b.dlp=r+need; metLog(b,'priorité du groupe : '+eur(need,0)+' de la trésorerie générale pour « '+lc1(String(label||'un achat'))+' ».'); }
{ const _ds=dlSpend; dlSpend=function(b,c,l){ dlTopUp(b,c,l); return _ds(b,c,l); }; }
function dlCan(b,c,l){ dlTopUp(b,c,l); return dlBudget(b)>=c; }
{ const _da=dlAct; dlAct=function(b,c,fn){ dlTopUp(b,c); return _da(b,c,fn); }; }

