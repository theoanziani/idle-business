/* ============================================================
   V1.3.9 : fatigue pendant le match et changements délégués à l'entraîneur
   Énergie d'un joueur : baisse au fil des minutes, moins vite avec un bon physique ; un gardien se fatigue peu.
   Un joueur fatigué joue moins bien (note effective plus basse) dans la fin de match rejouée après un changement.
   O.autoSub (défaut : absent = vous faites les changements) : l'entraîneur remplace les joueurs fatigués vers 55, 65, 75 et 82 minutes.
   ============================================================ */
function fmEnergy(L,s,i,t){ const p=L.M.xi[s][i]; if(!p) return 1; const ent=(L.ent&&L.ent[s][i])||0, G=(p.slot||p.p)==='G';
  const phy=G? 75 : fsVal(p,'phy'), rate=clamp(.42-(phy-60)*.006,.18,.62)*(G?.35:1)*(s===L.ownS? 1 : .8);
  return clamp(1-rate*Math.max(0,t-ent)/5400,.3,1); }
function fmFatXI(L,s,t){ return L.M.xi[s].map((p,i)=>Object.assign({},p,{o:p.o-(1-fmEnergy(L,s,i,t))*14})); }
const FM_AUTO_T=[55,65,75,82];
function fmAutoSub(L){ const O=fcOwn(); if(!O||!O.autoSub||!L.own||L.done||L.subs>=FM_MAXSUB) return; const m=Math.floor(L.t/60); L.autoDone=L.autoDone||[];
  const k=FM_AUTO_T.find(x=>m>=x&&!L.autoDone.includes(x)); if(k===undefined) return; L.autoDone.push(k);
  const s=L.ownS, xi=L.M.xi[s], bench=fmSubBench(L); let n=k>=75? 2 : 1;
  const tired=xi.map((p,i)=>({p,i,e:fmEnergy(L,s,i,L.t)})).filter(x=>(x.p.slot||x.p.p)!=='G'&&x.e<.74&&!L.used.includes(String(x.p.id))).sort((a,b)=>a.e-b.e);
  tired.forEach(x=>{ if(n<=0||L.subs>=FM_MAXSUB) return; const pos=x.p.slot, cand=bench.filter(q=>!L.used.includes(String(q.id))&&!xi.some(z=>String(z.id)===String(q.id))).sort((a,b)=>(FOOT_NEAR[pos].includes(b.p)-FOOT_NEAR[pos].includes(a.p))||(b.o-a.o))[0];
    if(cand&&FOOT_NEAR[pos].includes(cand.p)&&cand.o>=x.p.o-(1-x.e)*14-8){ fmDoSub(L,x.i,cand); n--; } });
  if(n<(k>=75?2:1)) render(); }
{ const _st2=fmStep; fmStep=function(L,dt){ _st2(L,dt); try{ if(L&&L.own&&!L.done) fmAutoSub(L); }catch(e){ console.error(e); } }; }
/* énergie affichée : compositions et choix du joueur qui sort */
function fmEnBar(e){ return '<i class="fm-en '+(e>=.75?'ok':e>=.55?'mid':'low')+'" style="--e:'+Math.round(e*100)+'%" aria-label="Forme '+Math.round(e*100)+' %"></i>'; }
{ const _th2=fmTabHtml; fmTabHtml=function(L){ let h=_th2(L);
  if(L.own&&L.tab==='xi'){ const s=L.ownS; h='<div class="tag">'+esc(footName(s?L.a:L.h))+' · forme des joueurs</div>'+L.M.xi[s].map((p,i)=>{ const e=fmEnergy(L,s,i,L.t); return '<div class="fm-xi"><span>'+FOOT_POS_S[p.slot]+'</span>'+esc(p.n)+fmEnBar(e)+'<small class="num">'+Math.round(e*100)+' %</small></div>'; }).join('')+
    '<div class="sub">Un joueur fatigué joue moins bien jusqu’à la fin. Le physique ralentit la fatigue.</div>'+(fcOwn()&&fcOwn().autoSub? '<div class="sub">Les changements sont confiés à l’entraîneur.</div>' : ''); }
  if(L.own&&L.tab==='sub'&&L.subUI&&L.subUI.o===null){ const s=L.ownS; L.M.xi[s].forEach((p,i)=>{ const e=fmEnergy(L,s,i,L.t); h=h.replace('data-a="fmsubo" data-i="'+i+'"><span class="fpos">','data-a="fmsubo" data-i="'+i+'"><span class="fpos">').replace(new RegExp('(data-a="fmsubo" data-i="'+i+'">[\\s\\S]*?<small>)'),'$1Forme '+Math.round(e*100)+' % · '); }); }
  return h; }; }

/* V2.5.5 : prolongation et tirs au but gardés seulement si vos changements laissent le score du temps réglementaire inchangé ;
   plus de nouvelle simulation une fois la prolongation commencée */
{ const _rs=fmResim; fmResim=function(L){ const M=L.M; if(M.ee&&L.t>=M.end) return; const X=M.ev.filter(e=>M.ee&&e.t>=M.end&&e.k!=='ft'), g0=[M.gh,M.ga];
  _rs(L); if(!M.ee) return; const fin=M.ev.find(e=>e.k==='ft');
  if(M.gh===g0[0]&&M.ga===g0[1]){ M.ev=M.ev.filter(e=>e.k!=='ft').concat(X,fin?[fin]:[]); }
  else { M.ee=0; M.pks=0; M.ps=null; if(fin){ fin.t=M.end; fin.m=90; } }
  M.ev.sort((x,y)=>x.t-y.t); let sc=[0,0]; M.ev.forEach(e=>{ if(e.k==='goal'&&e.t<M.end) sc[e.s]++; }); M.gh=sc[0]; M.ga=sc[1];
  sc=[0,0]; M.ev.forEach(e=>{ if(e.k==='goal') sc[e.s]++; e.sc=sc.slice(); }); L.i=M.ev.filter(e=>e.t<=L.t).length; }; }

