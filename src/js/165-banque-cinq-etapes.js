
/* ============================================================
   V2.7.5 : MA BANQUE EN CINQ ÉTAPES
   B.stg (1 à 5, défaut 1) : locale, nationale, internationale, banque d'affaires, mondiale. Chaque étape demande des
   fonds propres, une note de solvabilité et une licence, et ouvre de nouveaux métiers :
   - 2 nationale : dépôts selon le PIB du pays de résidence, crédits aux grandes entreprises, cartes et paiements,
     prêts à vos propres sociétés (vos emprunts sont pris à votre banque : intérêts gardés dans le groupe) ;
   - 3 internationale : agences dans d'autres pays (B.cty), gestion de fortune (B.aum), salle des marchés, test de
     résistance annuel ;
   - 4 affaires : prêts aux États, introductions en bourse et rachats (commissions) ;
   - 5 mondiale : réseau de paiement IdlePay, une commission sur l'économie des six pays.
   Revenus suivis par métier (B.rv, moyenne sur ~30 jours). Champs lus avec des valeurs par défaut.
   ============================================================ */
const BSTG=[{n:'Locale'},{n:'Nationale',eq:2e7,lic:1e7},{n:'Internationale',eq:1.5e8,lic:6e7},{n:'Banque d’affaires',eq:1e9,lic:3e8},{n:'Mondiale',eq:8e9,lic:2e9}];
const BSHARE=[0,.06,.06,.09,.16];
const bStg = () => S.bank.stg||1;
const bCty = () => { const B=S.bank; return [polHome()].concat((B.cty||[]).filter(c=>c!==polHome())); };
const ctyGdp = id => S.country&&S.country.id===id? S.country.gdp : D.COUNTRIES.find(c=>c.id===id).gdp;
const bSolv = () => { const L=bankLoans(); return L>0? bankEquity()/L : 1; };
const bOpenGdp = () => (bStg()>=2? bCty() : []).reduce((a,c)=>a+ctyGdp(c),0);
/* dépôts : la part de marché porte sur le PIB des pays ouverts */
{ const _dt=depTarget; depTarget=function(sf){ const B=S.bank, base=_dt(sf); if(bStg()<2) return base;
  const solv=B.dep>1000? clamp((bankEquity()/B.dep)/0.04,0.3,1) : 1;
  return base+bOpenGdp()*BSHARE[bStg()-1]*(B.rep/100)*solv*(0.6+0.4*Math.min(1,sf))*clamp(1+0.25*(B.rd-(S.macro.rate-1)),0.3,2); }; }
/* réserves obligatoires : loi de chaque pays, au prorata du PIB */
function bankReqW(){ const C=bCty(); if(bStg()<3||C.length<2) return S.laws.reserve; const T=C.reduce((a,c)=>a+ctyGdp(c),0); return C.reduce((a,c)=>a+ctyGdp(c)/T*(pLaw(c).reserve||S.laws.reserve),0); }
/* grands dossiers de crédit : entreprises (étape 2) et États (étape 4) */
const STG_GR={AAA:'A',AA:'A',A:'A',BBB:'B',BB:'C',B:'D'};
function genBigApp(){ const B=S.bank, base=Math.max(B.dep,1e6);
  if(bStg()>=4&&rnd()<.35){ const C=D.COUNTRIES.map(c=>c.id), c=pick(C), g=bondGrade(c);
    return {id:S.nid++, t:'etat', lab:'Prêt à l’État', n:'État : '+ctyName(c), cty:c, amt:Math.round(base*(.02+rnd()*.04)/1e5)*1e5, term:1800, g:STG_GR[g[0]], c:0, max:Math.round((bondRate(c)+1+rnd()*1.5)*10)/10, born:S.day}; }
  const gw=[.25,.35,.25,.1,.05]; let r=rnd(), i=0; for(;i<4;i++){ r-=gw[i]; if(r<=0) break; }
  return {id:S.nid++, t:'corp', lab:'Crédit grande entreprise', n:pick(['Groupe','Holding','Industries','Compagnie'])+' '+pick(D.LN), amt:Math.round(base*(.004+rnd()*.016)/1e4)*1e4, term:rint(360,1800), g:D.BANK.grades[i], c:rint(20,60), max:Math.round((6+rnd()*6)*10)/10, born:S.day}; }
/* prêts à vos propres sociétés : vos emprunts passent par votre banque quand elle le peut */
const ownDebt = () => S.debts.reduce((a,d)=>a+(d.own?d.p:0),0);
const ownRoom = () => { const B=S.bank; return B.lic&&bStg()>=2? Math.max(0,Math.min(bankCapacity(), .25*bankEquity()-ownDebt())) : 0; };
{ const _b=borrow; borrow=function(a){ const r=_b(a); if(r&&r.ok!==false){ const d=S.debts[S.debts.length-1]; if(d&&!d.own&&ownRoom()>=d.p){ d.own=1; d.r=S.bank.rl; S.bank.res-=d.p; } } return r; }; }
{ const _r=repay; repay=function(id,a){ const d=S.debts.find(x=>x.id===id), p0=d?d.p:0, r=_r(id,a); if(d&&d.own) S.bank.res+=p0-(S.debts.includes(d)?d.p:0); return r; }; }
/* étapes */
function bankUp(){ const B=S.bank, n=bStg(); if(!B.lic) return err('Fondez d’abord votre banque.'); if(n>=5) return err('Votre banque est déjà mondiale.');
  const T=BSTG[n]; if(bankEquity()<T.eq) return err('Fonds propres insuffisants : '+eur(T.eq,0)+' requis.');
  if(bSolv()<.08) return err('Solvabilité insuffisante : 8 % de fonds propres sur les prêts requis.');
  if(S.cash<T.lic) return err('Trésorerie insuffisante : licence de '+eur(T.lic,0)+'.');
  pay('bank','Licence bancaire : '+T.n,-T.lic,'corp'); B.stg=n+1; S.rep=clamp((S.rep||50)+2,0,100);
  log('good','Votre banque devient « '+T.n+' ».'); return ok(); }
ACT.bankup=()=>after(bankUp());
const CTY_OPEN=3e7;
function bankCtyOpen(id){ const B=S.bank; if(bStg()<3) return err('Étape internationale requise.'); B.cty=B.cty||[]; if(id===polHome()||B.cty.includes(id)) return err('Déjà implantée.');
  const c=CTY_OPEN*(1+B.cty.length*.5); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  payCap('bank','Implantation : '+ctyName(id),-c); B.cty.push(id); log('good','Votre banque ouvre ses agences : '+ctyName(id)+'.'); return ok(); }
ACT.bankcty=el=>after(bankCtyOpen(el.dataset.v));
/* métiers et suivi des revenus, chaque jour après bankStep */
const RVK=['int','fees','card','own','aum','trade','deal','net'];
function rvAdd(k,v){ const B=S.bank; B.rvd=B.rvd||{}; B.rvd[k]=(B.rvd[k]||0)+v; }
{ const _bs=bankStep; bankStep=function(){ const B=S.bank; if(!B.lic){ _bs(); return; }
  const st0={i:B.st.intIn,f:B.st.fees,o:B.st.intOut,w:B.st.wage,l:B.st.loss}; B.rvd={};
  if(B.frz&&S.day<B.frz&&B.pol) B.apps=[];
  _bs(); if(!B.lic) return;
  rvAdd('int',B.st.intIn-st0.i); rvAdd('fees',B.st.fees-st0.f);
  const n=bStg(), open=bankOpen(), M=S.macro;
  if(n>=2){ const card=B.dep*.02/360; pay('bank','Cartes et paiements',card,'corp'); rvAdd('card',card);
    const oi=S.debts.reduce((a,d)=>a+(d.own?d.p*d.r/100/360:0),0); if(oi>0){ pay('bank','Intérêts des prêts à vos sociétés',oi,'corp'); rvAdd('own',oi); }
    if(open){ const k=poisson(.25*n); for(let i=0;i<k&&B.apps.length<20;i++) B.apps.push(genBigApp()); } }
  if(n>=3){ const tgt=bOpenGdp()*.15*(B.rep/100)*(1+(S.prestige||0)/3000)*(.8+.2*M.econ); B.aum=(B.aum||0)+(tgt-(B.aum||0))*.02;
    const f=B.aum*.009/360; pay('bank','Gestion de fortune',f,'corp'); rvAdd('aum',f);
    const eq=Math.max(0,bankEquity()), tr=eq*(.08/360+.003*norm()); pay('bank','Salle des marchés',tr,'corp'); rvAdd('trade',tr);
    if(S.day%360===180){ const okT=bSolv()>=.08; B.st5=okT?1:0; if(okT) log('good','Test de résistance réussi : solvabilité '+pct(bSolv(),1)+'.');
      else { const fine=B.dep*.01; pay('bank','Amende du régulateur (test de résistance)',-fine,'corp'); B.frz=S.day+60; log('crit','Test de résistance échoué : amende de '+eur(fine,0)+' et nouveaux prêts gelés 60 jours.'); } } }
  if(n>=4&&open&&rnd()<.08){ const size=bOpenGdp()*(.002+rnd()*.018), fee=size*(.02+rnd()*.01), kind=rnd()<.5;
    pay('bank',kind?'Commission d’introduction en bourse':'Commission de conseil en rachat',fee,'corp'); rvAdd('deal',fee);
    log('good',(kind?'Introduction en bourse de ':'Rachat conseillé : ')+pick(['Groupe','Holding','Industries'])+' '+pick(D.LN)+' ('+eur(size,0)+') : commission de '+eur(fee,0)+'.'); }
  if(n>=5){ const w=D.COUNTRIES.reduce((a,c)=>a+ctyGdp(c.id),0)*.012/360*(.7+.3*M.econ); pay('bank','Réseau IdlePay',w,'corp'); rvAdd('net',w); }
  B.rv=B.rv||{}; RVK.forEach(k=>{ B.rv[k]=(B.rv[k]||0)*(29/30)+((B.rvd[k]||0))/30; });
  const dn=RVK.reduce((a,k)=>a+(B.rvd[k]||0),0)-(B.st.intOut-st0.o)-(B.st.wage-st0.w)-(B.st.loss-st0.l); B.rvN=(B.rvN||0)*(29/30)+dn/30; }; }
{ const _ap=acceptApp; acceptApp=function(id,silent){ const B=S.bank; if(B.frz&&S.day<B.frz) return err('Nouveaux prêts gelés par le régulateur jusqu’au '+dateS(B.frz)+'.'); return _ap(id,silent); }; }
/* ---------- écran ---------- */
function bkStages(){ const B=S.bank, n=bStg(), eq=bankEquity();
  const steps='<div class="bs-st">'+BSTG.map((t,i)=>'<div class="'+(i+1<n?'ok':i+1===n?'cur':'')+'"><i>'+(i+1<n?'✓':i+1)+'</i>'+t.n.replace('Banque d’affaires','Affaires')+'</div>').join('')+'</div>';
  let h='<section class="card"><div class="ch-row"><b>'+esc(S.bankName||'Idle Bank')+'</b><span class="sub">'+BSTG[n-1].n+'</span></div>'+steps+
    '<div class="emp-k"><div><div class="tag">Dépôts</div><b class="num">'+eur(B.dep,0)+'</b></div><div><div class="tag">Prêts</div><b class="num">'+eur(bankLoans(),0)+'</b></div><div><div class="tag">Fonds propres</div><b class="num">'+eur(eq,0)+'</b></div></div><div class="bs-net"><span>Bénéfice net</span><b class="num '+((B.rvN||0)<0?'neg':'pos')+'">'+signed(B.rvN||0,0)+' / j</b></div><div class="sub">Il grandit avec vos fonds propres : chaque euro apporté permet de prêter environ '+Math.floor(1/capr())+' €.</div></section>';
  const R=[['int','Intérêts des prêts',1,'#3DDC97'],['fees','Frais et abonnements',1,'#F2C14E'],['card','Cartes et paiements',2,'#5B8CFF'],['own','Prêts à vos sociétés',2,'#B57BFF'],['aum','Gestion de fortune',3,'#2FC6C6'],['trade','Salle des marchés',3,'#FF8A5C'],['deal','Bourse et rachats',4,'#E86CA8'],['net','Réseau IdlePay',5,'#C9A24A']];
  const rv=B.rv||{}, mx=Math.max(1,...R.map(r=>Math.abs(rv[r[0]]||0)));
  h+=card('D’où viennent les revenus','<div class="sub" style="margin-bottom:6px">Par jour, en moyenne sur un mois. Intérêts versés aux déposants : '+eur(B.dep*B.rd/100/360,0)+' / j.</div>'+R.map(([k,t,s,c])=>{ const v=rv[k]||0, lock=n<s;
    return '<div class="bs-rv'+(lock?' lock':'')+'"><span>'+t+'</span><div class="b"><i style="width:'+(lock?0:Math.min(100,Math.abs(v)/mx*100)).toFixed(0)+'%;background:'+c+'"></i></div><b class="num">'+(lock?'étape '+s : signed(v,0))+'</b></div>'; }).join(''));
  if(n<5){ const T=BSTG[n], p=clamp(eq/T.eq,0,1);
    h+=card('Prochaine étape : '+T.n.toLowerCase(),'<div class="bs-req"><span>Fonds propres '+eur(T.eq,0)+'</span><b class="'+(eq>=T.eq?'pos':'neg')+'">'+eur(eq,0)+'</b></div>'+bar(p,p>=1?'g':'a')+
      '<div class="bs-req"><span>Solvabilité d’au moins 8 %</span><b class="'+(bSolv()>=.08?'pos':'neg')+'">'+pct(Math.min(9.99,bSolv()),1)+'</b></div><div class="bs-req"><span>Licence</span><b>'+eur(T.lic,0)+'</b></div>'+
      '<div class="sub" style="margin:8px 0">'+['','Dépôts selon le PIB de votre pays, crédits aux grandes entreprises, cartes et paiements, prêts à vos sociétés.','Agences dans d’autres pays, gestion de fortune, salle des marchés.','Prêts aux États, introductions en bourse et rachats.','Réseau de paiement mondial IdlePay.'][n]+' Les fonds propres s’augmentent par un apport en capital.</div>'+
      btn('Passer à l’étape '+(n+1)+' · '+eur(T.lic,0),'bankup',{c:'pri',dis:eq<T.eq||bSolv()<.08||S.cash<T.lic,why:eq<T.eq?'Fonds propres insuffisants.':bSolv()<.08?'Solvabilité insuffisante.':'Trésorerie insuffisante.'})); }
  if(n>=3) h+=card('Implantations','<div class="stack">'+D.COUNTRIES.map(c=>{ const on=bCty().includes(c.id), cost=CTY_OPEN*(1+(B.cty||[]).length*.5);
    return '<div class="bs-c"><span class="bs-cn">'+ctyFlag(c.id).replace('width="54" height="36"','width="28" height="19"')+'<span><b>'+esc(c.n)+'</b><div class="sub">Réserves '+pct(pLaw(c.id).reserve||S.laws.reserve,0)+' · PIB '+eur(ctyGdp(c.id),0)+' / an</div></span></span>'+(on?'<span class="pill good">Ouverte</span>':btn('Ouvrir · '+eur(cost,0),'bankcty',{c:'sm',v:c.id,dis:S.cash<cost}))+'</div>'; }).join('')+'</div>');
  const sv=bSolv();
  h+=card('Risques','<div class="bs-req"><span>Solvabilité<small>fonds propres sur prêts, minimum 8 %</small></span><b class="'+(sv>=.1?'pos':sv>=.08?'':'neg')+'">'+pct(Math.min(9.99,sv),1)+'</b></div>'+
    '<div class="bs-req"><span>Liquidité<small>réserve face aux retraits</small></span><b class="'+(B.res>=bankReq()*1.25?'pos':B.res>=bankReq()?'':'neg')+'">'+(B.res>=bankReq()*1.25?'Bonne':B.res>=bankReq()?'Juste':'Insuffisante')+'</b></div>'+
    (n>=3? '<div class="bs-req"><span>Test de résistance<small>chaque année, le '+(B.frz&&S.day<B.frz?'gel des prêts court jusqu’au '+dateS(B.frz):'prochain dans '+plu((180-S.day%360+360)%360||360,'jour'))+'</small></span><b class="'+(B.st5===0?'neg':'pos')+'">'+(B.st5===undefined?'—':B.st5?'Réussi':'Échoué')+'</b></div>' : '')+
    (ownDebt()? '<div class="bs-req"><span>Prêts à vos sociétés<small>limite : 25 % des fonds propres</small></span><b>'+eur(ownDebt(),0)+'</b></div>' : ''));
  return h; }
{ const _bo=bkOwn; bkOwn=function(){ const h=_bo(); return S.bank.lic? bkStages()+h : h; }; }
(function(){ const st=document.createElement('style'); st.textContent=`
.ch-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.ch-row b{font-size:17px}
.bs-st{display:flex;margin:6px 0 12px}.bs-st div{flex:1;text-align:center;font:800 10.5px var(--f-body);color:var(--ink-3)}.bs-st i{display:block;width:30px;height:30px;margin:0 auto 5px;border-radius:50%;border:2px solid var(--line);font-style:normal;line-height:27px;font-size:13px}
.bs-st .ok{color:var(--green)}.bs-st .ok i{border-color:var(--green);background:var(--green-soft)}.bs-st .cur{color:#C9971F}.bs-st .cur i{border-color:#F2C14E;background:rgba(242,193,78,.15)}
.bs-rv{display:flex;align-items:center;gap:8px;margin:7px 0;font-size:13px;font-weight:700}.bs-rv span{width:132px;flex:0 0 auto;font-size:12.5px}.bs-rv .b{flex:1;height:8px;border-radius:5px;background:var(--paper-2);overflow:hidden}.bs-rv .b i{display:block;height:100%;border-radius:5px}.bs-rv b{width:84px;text-align:right;flex:0 0 auto}.bs-rv.lock{opacity:.45}
.bs-c{display:flex;justify-content:space-between;align-items:center;gap:10px}.bs-cn{display:flex;gap:10px;align-items:center;min-width:0}.bs-c .pill,.bs-c .btn{flex:0 0 auto}
.bs-net{display:flex;justify-content:space-between;align-items:center;margin:10px 0 4px;padding:10px 12px;border-radius:12px;background:var(--paper-2);font-weight:800}.bs-net b{font-size:18px}.bs-net .pos{color:var(--green)}.bs-net .neg{color:var(--red)}
.bs-req{display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;margin:6px 0}.bs-req span small{display:block;font-weight:600;color:var(--ink-3);font-size:11.5px}.bs-req b.pos{color:var(--green)}.bs-req b.neg{color:var(--red)}`; document.head.appendChild(st); })();
