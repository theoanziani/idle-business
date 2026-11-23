/* ============================================================
   FOOTBALL : compétitions internationales (noms fictifs)
   Coupe d'Europe des champions et Coupe d'Europe (phase de ligue à 36, barrages,
   tours à élimination directe aller-retour, finale), Coupe des Libertés (8 groupes),
   Coupe des champions d'Amérique du Nord (élimination directe), Coupe d'Asie des clubs
   (phase de ligue à 24), Coupe intercontinentale (champions des continents, en décembre).
   Qualifiés : classements finaux des championnats jouables (ou la hiérarchie au départ)
   et meilleurs clubs étrangers. État : S.foot.ic.
   ============================================================ */
const FI = {
  eu1:{n:'Coupe d’Europe des champions', short:'Europe des champions', season:'eu', draw:[8,28], wd:1, prize:1},
  eu2:{n:'Coupe d’Europe', short:'Coupe d’Europe', season:'eu', draw:[8,28], wd:3, prize:.25},
  eu3:{n:'Coupe des confédérations d’Europe', short:'Confédérations', season:'eu', draw:[8,28], wd:3, prize:.12},
  sa1:{n:'Coupe des Libertés', short:'Libertés', season:'cal', draw:[3,1], wd:1, prize:.15},
  na1:{n:'Coupe des champions d’Amérique du Nord', short:'Amérique du Nord', season:'cal', draw:[2,1], wd:1, prize:.06},
  as1:{n:'Coupe d’Asie des clubs', short:'Asie', season:'eu', draw:[8,28], wd:1, prize:.08},
  w1:{n:'Coupe intercontinentale', short:'Intercontinentale', season:'cal', draw:[12,1], wd:2, prize:.5}
};
const FI_ORDER=['eu1','eu2','eu3','sa1','na1','as1','w1'];
const fiDayOn = (day,wd) => { let d=day; while(wdOf(d)!==wd) d++; return d; };
const fiFirst = (y,m,d,wd) => fiDayOn(footDay(y,m,d),wd);

/* ---------- Qualifiés ---------- */
function fiRanked(lid){
  /* classement final de la dernière saison terminée, sinon la hiérarchie actuelle */
  const lg=S.foot.lg[lid];
  if(lg.prev) return lg.prev.tabs.flat ? (lg.prev.tabs.length>1? lg.prev.tabs.flat().sort((a,b)=>(b[7]-a[7])||((b[5]-b[6])-(a[5]-a[6]))).map(r=>r[0]) : lg.prev.tabs[0].map(r=>r[0])) : [];
  return lg.grp.flat().slice().sort((a,b)=>footR(b)-footR(a));
}
function fiForeign(conf,n,exclude,capPer){
  const R=frnd, per={}, out=[];
  const pool=FOOT.foreign.filter(c=>c.conf===conf && !exclude.has(c.id)).map(c=>({c, s:footR(c.id)+(R()-.5)*6})).sort((a,b)=>b.s-a.s);
  for(const x of pool){ if(out.length>=n) break; per[x.c.nat]=(per[x.c.nat]||0)+1; if(per[x.c.nat]>(capPer||4)) continue; out.push(x.c.id); }
  return out;
}
function fiQualify(id){
  const used=new Set(), take=(lid,from,n)=>fiRanked(lid).filter(x=>!used.has(x)).slice(from,from+n).forEach(x=>{ used.add(x); out.push(x); });
  let out=[];
  if(id==='eu1'){ take('en1',0,4); take('de1',0,4); take('es1',0,4); take('fr1',0,3); take('hr1',0,1); fiForeign('eu',36-out.length,used,4).forEach(x=>out.push(x)); }
  else if(id==='eu2'){ const e1=S.foot.ic.eu1&&S.foot.ic.eu1.teams||[]; e1.forEach(x=>used.add(x)); take('en1',0,2); take('de1',0,2); take('es1',0,2); take('fr1',0,2); take('hr1',0,2); const ex=new Set([...used]); fiForeign('eu',36-out.length,ex,3).forEach(x=>out.push(x)); }
  else if(id==='eu3'){ /* V1.9.3 : club suivant au classement et vainqueurs de coupe non qualifiés ailleurs */
    [...(S.foot.ic.eu1&&S.foot.ic.eu1.teams||[]),...(S.foot.ic.eu2&&S.foot.ic.eu2.teams||[])].forEach(x=>used.add(x));
    ['en','de','es','fr','hr'].forEach(n=>{ const h=S.foot.cupHist&&S.foot.cupHist[n], w=h&&h[0]&&h[0].champ; if(w&&!used.has(w)){ used.add(w); out.push(w); } });
    take('en1',0,1); take('de1',0,1); take('es1',0,1); take('fr1',0,1); take('hr1',0,1); fiForeign('eu',36-out.length,new Set([...used]),3).forEach(x=>out.push(x)); }
  else if(id==='sa1'){ take('br1',0,6); fiForeign('sa',32-out.length,used,6).forEach(x=>out.push(x)); }
  else if(id==='na1'){ take('us1',0,4); fiForeign('na',16-out.length,used,9).forEach(x=>out.push(x)); }
  else if(id==='as1'){ take('cn1',0,3); fiForeign('as',24-out.length,used,6).forEach(x=>out.push(x)); }
  else if(id==='w1'){
    const champ=k=>{ const h=S.foot.icHist[k]; return h&&h[0]? h[0].champ : null; };
    const best=conf=>FOOT.foreign.filter(c=>c.conf===conf).sort((a,b)=>footR(b.id)-footR(a.id))[0].id;
    out=[champ('as1')||best('as'), best('af'), champ('na1')||best('na'), best('oc'), champ('sa1')||best('sa'), champ('eu1')||best('eu')];
    out=out.filter((x,i)=>out.indexOf(x)===i); while(out.length<6) out.push(fiForeign('eu',1,new Set(out),9)[0]);
  }
  return out;
}

/* ---------- Calendrier d'une édition ---------- */
function fiPlan(id,y){
  const C=FI[id], wd=C.wd, T=(m,d,yy)=>fiFirst(yy===undefined?y:yy,m,d,wd), Sun=(m,d,yy)=>fiDayOn(footDay(yy===undefined?y:yy,m,d),6);
  const spread=(a,b,n)=>{ const out=[]; for(let i=0;i<n;i++){ let d=Math.round(a+(b-a)*i/(n-1)); d=fiDayOn(d,wd); const doy=(d-1)%360; if(doy>=footDoy(12,20)||doy<=footDoy(1,5)) d=fiDayOn(d+16,wd); if(out.length&&d<=out[out.length-1]) d=fiDayOn(out[out.length-1]+7,wd); out.push(d); } return out; };
  if(id==='eu1'||id==='eu2') return {lp:{k:'swiss',n:8,dates:spread(footDay(y,9,16),footDay(y+1,1,28),8)}, ko:[
    {k:'po',n:'Barrages',d:[T(2,10,y+1),T(2,24,y+1)]},{n:'Huitièmes de finale',d:[T(3,10,y+1),T(3,17,y+1)]},{n:'Quarts de finale',d:[T(4,7,y+1),T(4,14,y+1)]},{n:'Demi-finales',d:[T(4,28,y+1),T(5,5,y+1)]},{n:'Finale',d:[Sun(5,30,y+1)],neutral:1}]};
  /* V1.9.3 : Coupe des confédérations d’Europe, phase de ligue en 6 journées */
  if(id==='eu3') return {lp:{k:'swiss',n:6,dates:spread(footDay(y,9,16),footDay(y,12,10),6)}, ko:[
    {k:'po',n:'Barrages',d:[T(2,10,y+1),T(2,24,y+1)]},{n:'Huitièmes de finale',d:[T(3,10,y+1),T(3,17,y+1)]},{n:'Quarts de finale',d:[T(4,7,y+1),T(4,14,y+1)]},{n:'Demi-finales',d:[T(4,28,y+1),T(5,5,y+1)]},{n:'Finale',d:[Sun(5,30,y+1)],neutral:1}]};
  if(id==='as1') return {lp:{k:'swiss',n:8,dates:spread(footDay(y,9,16),footDay(y+1,2,17),8)}, ko:[
    {n:'Huitièmes de finale',d:[T(3,3,y+1),T(3,10,y+1)]},{n:'Quarts de finale',d:[T(4,7,y+1),T(4,14,y+1)]},{n:'Demi-finales',d:[T(4,21,y+1),T(4,28,y+1)]},{n:'Finale',d:[Sun(5,17,y+1)],neutral:1}]};
  if(id==='sa1') return {lp:{k:'groups',n:6,g:4,dates:spread(footDay(y,4,1),footDay(y,5,28),6)}, ko:[
    {n:'Huitièmes de finale',d:[T(8,12),T(8,19)]},{n:'Quarts de finale',d:[T(9,16),T(9,23)]},{n:'Demi-finales',d:[T(10,21),T(10,28)]},{n:'Finale',d:[Sun(11,28)],neutral:1}]};
  if(id==='na1') return {lp:null, ko:[{n:'Huitièmes de finale',d:[T(2,17),T(2,24)]},{n:'Quarts de finale',d:[T(3,10),T(3,17)]},{n:'Demi-finales',d:[T(4,7),T(4,14)]},{n:'Finale',d:[Sun(6,1)],neutral:1}]};
  if(id==='w1') return {lp:null, ko:[{k:'w1',n:'Premier tour',d:[T(12,9)],neutral:1},{n:'Demi-finales',d:[T(12,13)],neutral:1},{n:'Finale',d:[Sun(12,17)],neutral:1}]};
}
/* phase de ligue « suisse » : chaque club affronte n adversaires différents */
function fiSwiss(teams,n){
  const R=frnd, rounds=[];
  for(let r=0;r<n;r++){
    let ok=false;
    for(let tries=0;tries<60&&!ok;tries++){
      const pool=fshuffle(teams.slice()), pairs=[], seen=new Set();
      ok=true;
      while(pool.length){ const a=pool.shift(); const j=pool.findIndex(b=>!rounds.some(rd=>rd.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a)))); if(j<0){ ok=false; break; } const b=pool.splice(j,1)[0]; pairs.push(R()<.5?[a,b]:[b,a]); }
      if(ok) rounds.push(pairs);
    }
    if(!ok){ const pool=fshuffle(teams.slice()), pairs=[]; while(pool.length>1) pairs.push([pool.shift(),pool.shift()]); rounds.push(pairs); }
  }
  return rounds;
}

/* ---------- Tirage et déroulement ---------- */
function fiState(){ const F=S.foot; F.ic=F.ic||{}; F.icHist=F.icHist||{}; return F.ic; }
function fiSeasonYear(id,day){ const t=footDate(day), C=FI[id]; const dd=footDay(t.y,C.draw[0],C.draw[1]); return day>=dd? t.y : t.y-1; }
function fiDraw(id,y){
  const IC=fiState(), P=fiPlan(id,y), teams=fiQualify(id);
  /* les clubs étrangers évoluent un peu d'une saison à l'autre */
  if(id==='eu1'||id==='sa1'||id==='na1') FOOT.foreign.filter(c=>c.conf===FI_CONF(id)).forEach(c=>{ S.foot.r[c.id]=Math.round(clamp(footR(c.id)+(frnd()-.5)*2.4,40,95)*10)/10; });
  const E={y, teams, P, phase:P.lp?'lp':'ko', ri:0, tab:{}, grp:null, rounds:null, ko:null, ki:0, last:null, champ:null};
  if(P.lp){
    teams.forEach(t=>{ E.tab[t]=[0,0,0,0,0,0,0]; });
    if(P.lp.k==='swiss') E.rounds=fiSwiss(teams,P.lp.n);
    else { const pots=teams.slice().sort((a,b)=>footR(b)-footR(a)), G=[]; for(let g=0;g<teams.length/4;g++) G.push([]); for(let i=0;i<pots.length;i++){ const pot=Math.floor(i/G.length), order=fshuffle(G.map((_,k)=>k)); const k=order.find(k=>G[k].length===pot)??order[0]; G[k].push(pots[i]); } E.grp=G; E.rounds=[]; for(let r=0;r<6;r++){ E.rounds.push([].concat(...G.map(g=>footFixtures(g,2)[r]||[]))); } }
  } else E.ko=fiKoFirst(id,teams);
  IC[id]=E;
  const O=(typeof fcOwn==='function')&&fcOwn(); if(O&&teams.includes(O.id)){ fcNews('Qualifié pour la '+FI[id].n+'.','good'); fiPrize(id,'Participation',.0+1); }
  return E;
}
const FI_CONF = id => ({eu1:'eu',eu2:'eu',eu3:'eu',sa1:'sa',na1:'na',as1:'as'})[id];
function fiKoFirst(id,teams){
  if(id==='w1') return {ties:[[teams[0],teams[1]],[teams[2],teams[3]]], bye:[teams[4],teams[5]]};
  const s=teams.slice().sort((a,b)=>footR(b)-footR(a)), ties=[]; for(let i=0;i<s.length/2;i++) ties.push([s[i],s[s.length-1-i]]);
  return {ties:fshuffle(ties)};
}
function fiTable(E,ids){ return ids.map(id=>({id,t:E.tab[id]})).sort((x,y)=>(y.t[6]-x.t[6])||((y.t[4]-y.t[5])-(x.t[4]-x.t[5]))||(y.t[4]-x.t[4])||(footR(y.id)-footR(x.id))); }
function fiRecord(E,h,a,gh,ga){ const T=E.tab; if(!T[h]||!T[a]) return; footRecord({tab:T,form:{}},h,a,gh,ga); }
/* passage de la phase de ligue aux matchs à élimination directe */
function fiAfterLeague(id,E){
  let ties=[];
  if(E.P.lp.k==='swiss'){
    const t=fiTable(E,E.teams).map(x=>x.id);
    if(id.startsWith('eu')){ E.direct=t.slice(0,8); const po=t.slice(8,24); for(let i=0;i<8;i++) ties.push([po[i],po[15-i]]); E.ko={ties, stage:'po'}; return; }
    const q=t.slice(0,16); for(let i=0;i<8;i++) ties.push([q[i],q[15-i]]);
  } else {
    const W=[],R2=[]; E.grp.forEach(g=>{ const t=fiTable(E,g); W.push(t[0].id); R2.push(t[1].id); });
    for(let i=0;i<W.length;i++) ties.push([W[i],R2[(i+1)%R2.length]]);
  }
  E.ko={ties};
}
/* un match ou une confrontation aller-retour */
function fiPlayLeg(E,stage,leg,day){
  const res=[];
  E.ko.ties.forEach(t=>{
    const [a,b]=t, neutral=!!stage.neutral;
    if(stage.d.length===1){ const r=footKO(a,b); t.r=[r.gh,r.ga]; t.w=r.w; t.pen=r.pen; res.push(r); }
    else if(leg===0){ const [gh,ga]=footPlay(b,a); footRecordGate(b,a); t.l1=[gh,ga]; res.push({h:b,a:a,gh,ga}); }
    else { const [gh,ga]=footPlay(a,b); footRecordGate(a,b); const ta=t.l1[1]+gh, tb=t.l1[0]+ga, r={h:a,a:b,gh,ga,pen:null,w:ta>tb?a:tb>ta?b:null};
      /* V2.5.5 : égalité au cumul : prolongation au retour, puis tirs au but */
      if(!r.w){ r.et=footET(a,b); r.gh+=r.et[0]; r.ga+=r.et[1]; const A=t.l1[1]+r.gh, B=t.l1[0]+r.ga; if(A!==B) r.w=A>B?a:b; else { const T=footShootout(a,b); r.pen=r.w=T.w; r.pk=T.pk; r.ps=T.ps; } footKOOwn(r); }
      t.l2=[r.gh,r.ga]; t.w=r.w; t.pen=r.pen; r.agg=[t.l1[1]+r.gh,t.l1[0]+r.ga]; res.push(r); }
  });
  E.last={name:stage.n+(stage.d.length>1? (leg? ' (retour)':' (aller)') : ''), day, res};
}
function footRecordGate(h,a){ if(typeof fcHomeGate==='function') fcHomeGate(h,a); }
function fiNextStage(id,E){
  const winners=E.ko.ties.map(t=>t.w), stage=E.P.ko[E.ki];
  const O=(typeof fcOwn==='function')&&fcOwn();
  if(O){ E.ko.ties.forEach(t=>{ if(t.w===O.id) fiPrize(id,stage.n+' gagnés',1); }); }
  E.ki++;
  if(winners.length===1 && !E.ko.bye){ E.champ=winners[0]; E.phase='done'; S.foot.icHist[id]=S.foot.icHist[id]||[]; S.foot.icHist[id].unshift({y:E.y,champ:E.champ}); if(S.foot.icHist[id].length>30) S.foot.icHist[id].pop();
    log('good','Football : '+footName(E.champ)+' remporte la '+FI[id].n+' ('+fiLabel(id,E.y)+').','news');
    if(O&&E.champ===O.id&&typeof troAdd==='function') troAdd('ic',FI[id].n,fiLabel(id,E.y));
    if(O&&O.id===E.champ){ fiPrize(id,'Victoire finale',3); fcNews('Votre club remporte la '+FI[id].n+' !','good'); } return; }
  let ties=[];
  if(E.ko.stage==='po'){ /* barrages -> huitièmes : 1 à 8 contre les vainqueurs des barrages */ for(let i=0;i<8;i++) ties.push([E.direct[i],winners[7-i]]); }
  else if(E.ko.bye){ ties=[[E.ko.bye[0],winners[0]],[E.ko.bye[1],winners[1]]]; }
  else for(let i=0;i<winners.length;i+=2) ties.push(footR(winners[i])>=footR(winners[i+1])? [winners[i],winners[i+1]] : [winners[i+1],winners[i]]);
  E.ko={ties};
}
function fiLabel(id,y){ return FI[id].season==='eu'? y+'-'+(y+1) : String(y); }
/* primes pour votre club */
function fiPrize(id,why,mult){ if(typeof fcPay!=='function') return; const v=Math.round(FI[id].prize*(why==='Participation'?18e6:why==='Victoire finale'?6e6:4e6)*mult/1e4)*1e4; if(v>0) fcPay('prize','Club : '+FI[id].short+' ('+why.toLowerCase()+')',v); }
function fiLeagueWin(id,E,res){ const O=(typeof fcOwn==='function')&&fcOwn(); if(!O) return; res.forEach(r=>{ const me= r.h===O.id? 0 : r.a===O.id? 1 : -1; if(me<0) return; const gf=me?r.ga:r.gh, gc=me?r.gh:r.ga; if(gf>gc) fiPrize(id,'Victoire',.5); else if(gf===gc) fiPrize(id,'Match nul',.17); }); }

/* ---------- Pas quotidien ---------- */
function fiStep(day){
  footInit(); const IC=fiState();
  FI_ORDER.forEach(id=>{
    const C=FI[id], t=footDate(day);
    if(t.m===C.draw[0] && t.d===C.draw[1]){ fiDraw(id,t.y).id=id; }
    const E=IC[id]; if(!E || E.phase==='done') return;
    E.id=id;
    if(E.phase==='lp'){
      if(E.P.lp.dates[E.ri]!==undefined && E.P.lp.dates[E.ri]<=day){
        const res=[]; (E.rounds[E.ri]||[]).forEach(([h,a])=>{ const [gh,ga]=footPlay(h,a); fiRecord(E,h,a,gh,ga); res.push({h,a,gh,ga}); });
        E.last={name:(E.P.lp.k==='swiss'?'Phase de ligue':'Phase de groupes')+', journée '+(E.ri+1), day, res}; E.ri++; fiLeagueWin(id,E,res);
        if(E.ri>=E.P.lp.n){ fiAfterLeague(id,E); E.phase='ko'; }
      }
      return;
    }
    const st=E.P.ko[E.ki]; if(!st) return;
    const leg=E.leg||0; if(st.d[leg]>day) return;
    fiPlayLeg(E,st,leg,day); E.leg=leg+1;
    if(E.leg>=st.d.length){ E.leg=0; fiNextStage(id,E); }
  });
}
{ const _fs2=footStep; footStep=function(day){ _fs2(day); try{ fiStep(day); }catch(e){ console.error(e); } }; }
/* compétitions d'un club cette saison */
function fiClubComps(id){ const IC=(S.foot&&S.foot.ic)||{}; return FI_ORDER.filter(k=>IC[k]&&IC[k].teams.includes(id)&&IC[k].phase!=='done'); }

