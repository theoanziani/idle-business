/* ============================================================
   BANQUE : dépôts, prêts, taux, réserves, liquidité, réputation
   ============================================================ */
const CAPR=0.05; // fonds propres minimaux / prêts
const APP_TYPES=[
  {k:'conso',lab:'Crédit consommation',w:.45,amt:[1000,15000],term:[90,360],col:[0,25],gw:[.15,.30,.30,.17,.08],mx:[10,20]},
  {k:'immo',lab:'Crédit immobilier',w:.15,amt:[40000,350000],term:[360,1080],col:[70,100],gw:[.30,.40,.20,.08,.02],mx:[6,11]},
  {k:'pme',lab:'Crédit PME',w:.30,amt:[15000,250000],term:[180,720],col:[0,50],gw:[.10,.30,.35,.18,.07],mx:[8,15]},
  {k:'startup',lab:'Prêt start-up',w:.10,amt:[30000,600000],term:[180,540],col:[0,10],gw:[.02,.10,.25,.40,.23],mx:[10,22]}
];
const bankOpen = () => wdOf(S.day)<5;
const bankLoans = () => S.bank.loans.reduce((a,l)=>a+l.p,0);
function bankEquity(){ const B=S.bank; return B.res+bankLoans()+holdingsValue('bank')-B.dep-(B.cb||0); }
const bankReq = () => S.laws.reserve*S.bank.dep;
function bankCapacity(){ const B=S.bank; return Math.max(0,Math.min(bankEquity()/CAPR-bankLoans(), B.res-bankReq())); }
function bankRoles(){ const B=S.bank; return [['banquier',1+Math.floor(B.dep/1.5e6)+Math.floor(B.atm/10),110],['manager',Math.floor(B.dep/6e6),140]].filter(r=>r[1]>0); }

function depTarget(sf){
  const B=S.bank, M=S.macro;
  const solv=B.dep>1000? clamp((bankEquity()/B.dep)/0.04,0.3,1) : 1;
  return solv*(150000+650000*Math.pow(B.br,0.9)+40000*B.atm)*(0.5+0.9*B.rep/100)*clamp(1+0.35*(B.rd-(M.rate-1)),0.2,2.5)*D.BANK.mktBoost[B.mk]*(0.6+0.4*Math.min(1,sf))*(0.85+0.15*M.econ)*(1+0.25*tierNow());
}

function bankLicence(){
  const B=S.bank, c=D.BANK.licenceCost+D.BANK.minCapital;
  if(!unlocked(D.BANK.tier)) return err('Palier Entrepreneur requis.');
  if(B.lic) return err('Vous possédez déjà une licence.');
  const lc=D.BANK.licenceCost*(1+B.failed);
  if(S.cash<lc+D.BANK.minCapital) return err('Trésorerie insuffisante : '+eur(lc+D.BANK.minCapital)+' requis (licence + capital initial).');
  pay('bank','Licence bancaire',-lc,'corp'); payCap('bank','Capital initial de la banque',-D.BANK.minCapital);
  B.lic=true; B.res=D.BANK.minCapital; B.rep=50; B.br=1; B.atm=0; B.loans=[]; B.apps=[]; B.ent={kind:'bank',staff:{},pol:1,cands:{}};
  startCrew(B.ent,1);
  B.dep=depTarget(1)*0.12; B.res+=B.dep;
  log('good','Votre banque ouvre ses portes. Les premiers clients arrivent.');
  return ok();
}
function bankInject(a){
  if(!(a>0)) return err('Montant invalide.'); if(S.cash<a) return err('Trésorerie insuffisante.');
  payCap('bank','Apport en capital à la banque',-a); S.bank.res+=a; return ok();
}
function bankWithdraw(a){
  const B=S.bank; if(!(a>0)) return err('Montant invalide.');
  const max=Math.max(0,Math.min(B.res-bankReq(), bankEquity()-CAPR*bankLoans()));
  if(a>max+0.01) return err('Retrait possible : '+eur(max)+' (réserves obligatoires et fonds propres).');
  B.res-=a; payCap('bank','Retrait de capital de la banque',a); return ok();
}
function setBankRate(k,v){ const B=S.bank; if(k==='rd') B.rd=clamp(Math.round(v*10)/10,0,12); if(k==='rl') B.rl=clamp(Math.round(v*10)/10,2,25); }
function buyBranch(){
  const B=S.bank; if(B.br>=12) return err('Réseau complet : 12 agences maximum.');
  const c=D.BANK.branchCost*(1+0.15*(B.br-1)); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c)+' requis.');
  payCap('bank','Ouverture d’une agence',-c); B.br++; return ok();
}
function buyAtm(){
  const B=S.bank; if(B.atm>=60) return err('Réseau de distributeurs complet.');
  if(S.cash<D.BANK.atmCost) return err('Trésorerie insuffisante.');
  payCap('bank','Installation d’un distributeur',-D.BANK.atmCost); B.atm++; return ok();
}

function genApp(){
  const t=wpick(APP_TYPES,x=>x.w), tier=tierNow();
  const g=D.BANK.grades[(()=>{ let r=rnd(),i=0; for(;i<4;i++){ r-=t.gw[i]; if(r<=0) break; } return i; })()];
  const amt=Math.round((t.amt[0]+rnd()*(t.amt[1]-t.amt[0]))*(1+0.35*tier)/100)*100;
  const nm= t.k==='startup'? pick(D.VC_NAMES) : t.k==='pme'? 'Éts '+pick(D.LN) : pick(D.FN)+' '+pick(D.LN);
  return {id:S.nid++, t:t.k, lab:t.lab, n:nm, amt, term:rint(t.term[0],t.term[1]), g, c:rint(t.col[0],t.col[1]), max:Math.round((t.mx[0]+rnd()*(t.mx[1]-t.mx[0]))*10)/10, born:S.day};
}
const appRate = a => S.bank.rl+D.BANK.prem[a.g];
function acceptApp(id,silent){
  const B=S.bank, a=B.apps.find(x=>x.id===id); if(!a) return err('Dossier introuvable.');
  if(!bankOpen()) return err('Agences fermées le week-end.');
  const r=appRate(a); if(r>a.max) return err('Taux proposé trop élevé : le client refuse.');
  if(a.amt>bankCapacity()) return err('Capacité de prêt insuffisante : '+eur(bankCapacity())+' (réserves ou fonds propres).');
  B.loans.push({id:a.id, t:a.t, n:a.n, p:a.amt, r, mat:S.day+a.term, g:a.g, c:a.c/100, day:S.day});
  B.res-=a.amt; B.apps=B.apps.filter(x=>x!==a);
  return ok(silent?'':'Prêt de '+eur(a.amt)+' accordé à '+r.toFixed(1)+' %.');
}
function refuseApp(id){ S.bank.apps=S.bank.apps.filter(x=>x.id!==id); return ok(); }
function setPolicy(k,v){ const P=S.bank.pol; if(k==='auto') P.auto=!!v; else if(k==='minG') P.minG=v; else if(k==='minC') P.minC=clamp(v|0,0,100); }

function bankFail(){
  const B=S.bank;
  pay('bank','Amende de faillite bancaire',-Math.max(0,S.nw)*0.02);
  S.rep=clamp(S.rep-35,0,100); B.lic=false; B.dep=0; B.loans=[]; B.res=0; B.apps=[]; B.run={d:0,f:0}; B.cb=0; B.failed++;
  S.pf.bank={stock:{},bond:{},crypto:{}}; B.ent.staff={};
  log('crit','Faillite de votre banque : licence retirée, déposants lésés. Votre réputation s’effondre.');
}
function bankLiquidity(){
  const B=S.bank;
  if(B.res<0){
    ['bond','stock','crypto'].forEach(cls=>{
      for(const id in S.pf.bank[cls]){
        if(B.res>=0) break;
        const a=assetInfo(cls,id), cur=S.pf.bank[cls][id]; if(!a) continue;
        const pr=cur.q*a.p*0.97; B.res+=pr; S.tb.corp+=pr-cur.cost; delete S.pf.bank[cls][id];
        log('warn','Liquidité : vente forcée de '+a.name+' pour '+eur(pr)+'.');
      }
    });
  }
  if(B.res<0){
    const room=Math.max(0,0.25*B.dep-(B.cb||0)), draw=Math.min(room,-B.res);
    if(draw>0){ B.cb=(B.cb||0)+draw; B.res+=draw; log('crit','Liquidité : la banque centrale vous prête '+eur(draw)+' en urgence (taux pénalisant).'); }
  }
  if(B.res<0){
    const need=-B.res;
    if(S.cash>=need*1.05){ payCap('bank','Recapitalisation d’urgence',-need); pay('bank','Pénalité du régulateur',-need*0.05,'corp'); B.res=0; S.rep=clamp(S.rep-5,0,100); log('crit','Crise de liquidité : recapitalisation d’urgence de '+eur(need)+'.'); }
    else bankFail();
  } else if(B.lic && bankEquity()<0){
    const need=-bankEquity()*1.1;
    if(S.cash>=need){ payCap('bank','Recapitalisation (insolvabilité)',-need); B.res+=need; log('crit','Votre banque était insolvable : recapitalisation de '+eur(need)+'.'); }
    else bankFail();
  }
}

function bankStep(){
  const B=S.bank; if(!B.lic) return;
  const open=bankOpen(), sf=Math.min(1.1,staffFactor(B.ent));
  /* dépôts */
  const tgt=depTarget(sf);
  let dD=(tgt-B.dep)*0.04+norm()*tgt*0.003;
  if(B.run.d>0){ dD-=B.dep*B.run.f*clamp(1.3-B.rep/100,0.5,1.3); B.run.d--; }
  dD=Math.max(dD,-B.dep); B.dep+=dD; B.res+=dD;
  const iOut=B.dep*B.rd/100/360; if(iOut>0) pay('bank','Intérêts versés aux déposants',-iOut,'corp'); B.st.intOut+=iOut;
  /* prêts */
  let iIn=0, loss=0; const keep=[];
  B.loans.forEach(L=>{
    iIn+=L.p*L.r/100/360;
    if(S.day>=L.mat){ B.res+=L.p; return; }
    const pd=D.BANK.pd[L.g]/360*Math.pow(Math.max(0.3,2.2-S.macro.econ),1.5)*(1+Math.max(0,L.r-12)*0.04);
    if(rnd()<pd){ const rec=L.p*L.c*0.8; B.res+=rec; loss+=L.p-rec; if(L.p>50000) log('warn','Défaut de paiement : '+L.n+' ne rembourse pas son prêt de '+eur(L.p)+' (perte '+eur(L.p-rec)+').'); return; }
    keep.push(L);
  });
  B.loans=keep;
  if(iIn>0) pay('bank','Intérêts perçus sur les prêts',iIn,'corp'); B.st.intIn+=iIn;
  if(loss>0){ B.st.loss+=loss; S.tb.corp-=loss; }
  const L0=bankLoans(); B.lossEMA=(B.lossEMA||0)*0.98+(L0>0? loss/L0 : 0)*0.02;
  /* frais */
  const fr=[0.008,0.016,0.028][B.fees]/360;
  const fees=B.dep*fr+(B.payFees||0); B.payFees=0;
  if(fees>0) pay('bank','Frais de tenue de compte, cartes et paiements',fees,'corp'); B.st.fees+=fees;
  /* charges */
  const pm=progMult();
  const cost=(open? wageBill(B.ent,false):0)+B.br*40*pm+B.atm*6*pm+D.BANK.mktCost[B.mk]*(1+0.5*tierNow());
  pay('bank','Salaires, agences, distributeurs et marketing',-cost,'corp'); B.st.wage+=cost;
  /* dossiers de prêt */
  if(open){
    const lam=(0.5+0.25*B.br+0.25*B.mk)*(0.7+0.3*S.macro.econ)*clamp(1.3-0.04*(B.rl-6),0.4,1.6)*(0.6+0.4*Math.min(1,sf));
    const n=poisson(lam); for(let i=0;i<n && B.apps.length<14;i++) B.apps.push(genApp());
    B.apps=B.apps.filter(a=>S.day-a.born<=6);
    if(B.pol.auto){
      const gi=g=>D.BANK.grades.indexOf(g);
      B.apps.slice().forEach(a=>{ if(gi(a.g)<=gi(B.pol.minG) && a.c>=B.pol.minC && appRate(a)<=a.max) acceptApp(a.id,true); });
    }
  }
  /* réputation de la banque */
  const rt=clamp(55+3*(B.rd-(S.macro.rate-1))-5*(B.fees-1)-clamp((B.lossEMA||0)*360*100*1.5,0,25)+Math.min(8,B.br),10,95);
  B.rep+=(rt-B.rep)*0.03;
  /* risque de panique et de liquidité */
  const req=bankReq();
  if(B.run.d<=0){
    let p=0; if(B.rep<40) p+=0.004*(40-B.rep)/10; if(B.res<1.25*req && B.dep>0) p+=0.003; if(B.dep>10000 && bankEquity()/B.dep<0.03) p+=0.004;
    if(rnd()<p){ B.run={d:rint(3,6),f:0.03+0.05*rnd()}; log('crit','Panique : vos clients retirent massivement leurs dépôts !'); }
  }
  bankLiquidity();
  if(B.lic && B.cb>0){
    pay('bank','Intérêts de la facilité de liquidité',-B.cb*(S.macro.rate+5)/100/360,'corp');
    const free=B.res-req*1.1; if(free>0){ const r=Math.min(B.cb,free); B.cb-=r; B.res-=r; if(B.cb<1) B.cb=0; }
  }
  if(B.lic && B.res<req && B.res>=0 && B.dep>0){
    pay('bank','Pénalité de réserves obligatoires insuffisantes',-(req-B.res)*0.0008,'corp');
    if(S.day-B.lastWarn>=6){ B.lastWarn=S.day; log('warn','Réserves de la banque sous le minimum légal ('+eur(B.res)+' pour '+eur(req)+' exigés). Injectez du capital.'); }
  }
}

