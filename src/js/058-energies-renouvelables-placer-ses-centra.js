/* ============================================================
   ÉNERGIES RENOUVELABLES : placer ses centrales sur la carte
   Des régions plus ou moins ensoleillées, ventées ou arrosées. On y installe des centrales
   solaires, éoliennes ou hydrauliques (une autorisation par région). La production varie
   chaque jour avec la météo ; l'électricité se vend au prix du jour ou par contrat d'un an.
   Les batteries captent l'écart entre heures creuses et heures chères, et gardent l'énergie
   des jours bon marché pour les jours chers.
   Événements : tempête (production d'éolien en hausse, éoliennes parfois endommagées),
   vague de froid (prix qui flambent), opposition locale (autorisation refusée).
   Paliers : éolien en mer, stockage géant, hydrogène, réseau intelligent, parcs géants.
   Lien : vos usines (industrie) et data centers paient leur énergie 40 % moins cher, à hauteur
   de votre production (renewSaving, appliqué dans metMods).
   Unité : 1 u = la valeur de R0 au prix 1. État b.m (v:1) : reg{} (régions : auth, req, ban),
   pl[] (centrales), px (prix du jour), pxh[] (historique), wx{} (météo), ctr {sh, p, until},
   bat {cap, lvl, pol}, h2, smart, ev {k, until}, nid, acc, accC, pend, pendC, last, log.
   ============================================================ */
const RN_REG = {
  bea:{n:'Plaine de la Beauce', s:1.0, w:1.15, h:0},
  bre:{n:'Côte bretonne', s:.85, w:1.4, h:0},
  pro:{n:'Provence', s:1.4, w:1.05, h:0},
  alp:{n:'Vallées des Alpes', s:1.05, w:.8, h:1.5},
  mas:{n:'Massif central', s:1.0, w:1.1, h:1.2},
  lan:{n:'Landes', s:1.25, w:.95, h:0},
  mer:{n:'Mer du Nord (en mer)', s:0, w:1.85, h:0, rk:1}
};
const RN_T = {sol:{n:'Solaire', c:.45, k:.08, rs:'s'}, eol:{n:'Éolien', c:.55, k:.10, rs:'w'}, hyd:{n:'Hydraulique', c:.85, k:.15, rs:'h'}};
const RN_BAT = [{n:'Batterie', cap:.3, c:.15},{n:'Stockage géant', cap:3, c:1.2, rk:2}];
const RN_POL = {off:{n:'Vendre tout de suite', lo:-1, hi:-1}, pru:{n:'Prudent', lo:.9, hi:1.15}, agr:{n:'Ambitieux', lo:.95, hi:1.1}};
function rnInit(b){ const old=b.hist&&b.hist.length>5, home=b.city==='paris'||!D.CITIES[b.city]? 'bea' : 'pro';
  const m={v:1, reg:{}, pl:[], px:1, pxh:[], wx:{}, ctr:{sh:0, p:1, until:0}, bat:{cap:0, lvl:0, pol:'pru'}, h2:0, smart:0, big:0, ev:null, nid:1, acc:0, accC:0, pend:0, pendC:0, last:null, log:[]}; b.m=m;
  Object.keys(RN_REG).forEach(k=>{ m.reg[k]={auth:k===home?1:0, req:0, ban:0}; m.wx[k]={s:1, w:1, h:1}; });
  const add=(t,r)=>m.pl.push({id:m.nid++, t, r, sz:1, down:0});
  add('sol',home); add('eol',home); add('sol',home); add('eol',home); add('sol',home); add('eol',home); m.bat.cap=.3; if(old){ const h2=home==='bea'?'pro':'bea'; m.reg[h2].auth=1; add('eol',h2); add('sol',h2); add('eol',h2); }
  for(let i=0;i<60;i++) m.pxh.push(1);
  return m; }
function rnSeasonPx(){ return 1+.25*Math.cos(2*Math.PI*(metDoy()-15)/360); }
function rnOut(b,p){ const m=b.m, R=RN_REG[p.r], T=RN_T[p.t], w=m.wx[p.r]; if(p.down>S.day) return 0;
  const res= T.rs==='s'? R.s*w.s : T.rs==='w'? R.w*w.w : R.h*w.h; return T.k*res*p.sz*(p.r==='mer'?1.2:1); }
function rnCost(b,t,r,sz){ return bizDef(b).cost*RN_T[t].c*(r==='mer'?1.8:1)*(sz===3?2.6:1); }
function rnCanBuild(b,t,r){ const R=RN_REG[r], m=b.m; if(!R) return 'Région inconnue.'; if(R.rk&&!mxHas(b,R.rk)) return 'Palier '+R.rk+' requis.'; if(!m.reg[r].auth) return 'Il faut d’abord une autorisation dans cette région.';
  if(t==='hyd'&&!R.h) return 'Pas de rivière exploitable dans cette région.'; if(t==='sol'&&r==='mer') return 'Pas de solaire en mer.';
  if(t==='hyd'&&m.pl.filter(p=>p.r===r&&p.t==='hyd').length>=2) return 'Les deux sites hydrauliques de la région sont équipés.';
  if(m.pl.filter(p=>p.r===r).length>=6) return 'La région est pleine (6 sites).'; return ''; }
/* économie sur l'énergie de vos autres sociétés (industrie, data center) */
function renewEligible(b){ const d=bizDef(b); return b.status==='active'&&(b.def==='dc'||b.def==='warehouse'||(d.tags||[]).includes('industry')); }
function renewSaving(b){ if(!renewEligible(b)) return 0; const R=S.biz.filter(x=>x.def==='renew'&&x.status==='active'&&x.m&&x.m.pl); if(!R.length) return 0;
  const prod=R.reduce((a,x)=>a+x.m.pl.reduce((c,p)=>c+RN_T[p.t].k*p.sz,0)*metR0(x),0), need=S.biz.filter(renewEligible).reduce((a,x)=>a+metR0(x)*.1,0);
  return metR0(b)*.1*.4*Math.min(1,prod/Math.max(1,need)); }
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); try{ const s=renewSaving(b); if(s>0) z.fixed=(z.fixed||0)-s; }catch(e){} return z; }; }
function rnBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function rnBuild(b,t,r,sz,auto){ const m=b.m; if(!RN_T[t]) return err('Type inconnu.'); const e=rnCanBuild(b,t,r); if(e) return err(e); sz=sz===3&&m.big?3:1;
  const c=rnCost(b,t,r,sz); if(!(auto? dlSpend(b,c,'Centrale '+RN_T[t].n.toLowerCase()) : metBuy(b,c,'Centrale '+RN_T[t].n.toLowerCase()))) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  m.pl.push({id:m.nid++, t, r, sz, down:0}); metLog(b,'nouvelle centrale '+RN_T[t].n.toLowerCase()+(sz===3?' géante':'')+' : '+RN_REG[r].n+'.','good'); return ok('Centrale en service.'); }
function rnReq(b,r){ const m=b.m, R=RN_REG[r], g=m.reg[r]; if(!R) return err('Région inconnue.'); if(R.rk&&!mxHas(b,R.rk)) return err('Palier '+R.rk+' requis.'); if(g.auth) return err('Déjà autorisé.'); if(g.req) return err('Demande en cours.');
  if(g.ban>S.day) return err('L’opposition locale bloque toute demande pendant encore '+(g.ban-S.day)+' jours.');
  const c=metR0(b); if(availFor(cityOf(b).ccy)<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.accC+=c; g.req=S.day+rint(30,50); return ok('Demande déposée : réponse dans '+(g.req-S.day)+' jours.'); }
MET.renew = {
  fam:'ind', core:true, init:rnInit,
  ranks:[
    {n:'Éolien en mer', d:'La mer du Nord : un vent fort et régulier, des éoliennes plus chères mais bien plus productives.'},
    {n:'Stockage géant', d:'Des batteries dix fois plus grandes pour garder l’énergie des jours bon marché.'},
    {n:'Hydrogène', d:'Les jours où l’électricité ne vaut presque rien, elle part en hydrogène vendu à prix fixe.'},
    {n:'Réseau intelligent', d:'Vos ventes suivent les heures chères : +6 % sur le prix du jour.'},
    {n:'Parcs géants', d:'Des centrales trois fois plus grandes, un peu moins chères à la puissance.'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC+metR0(b)*.008*m.pl.reduce((a,p)=>a+p.sz,0)}; },
  daily(b,ctx){ const m=b.m, R0=metR0(b), doy=metDoy();
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    /* météo du jour, région par région (soleil l'été, vent l'hiver, pluie au printemps) */
    const sS=1+.45*Math.cos(2*Math.PI*(doy-180)/360), sW=1+.3*Math.cos(2*Math.PI*(doy-20)/360), sH=1+.3*Math.cos(2*Math.PI*(doy-100)/360);
    let wAvg=0; Object.keys(m.wx).forEach(k=>{ const w=m.wx[k];
      w.s=clamp(.6*w.s+.4*sS*Math.exp(.3*norm()),.1,2); w.w=clamp(.7*w.w+.3*sW*Math.exp(.45*norm())*(m.ev&&m.ev.k==='storm'?1.8:1),.05,3); w.h=clamp(.97*w.h+.03*sH*Math.exp(.3*norm()),.3,2); wAvg+=w.w; });
    wAvg/=Object.keys(m.wx).length;
    /* événements */
    if(!m.ev){ if(rnd()<.003){ m.ev={k:'storm', until:S.day+4}; metLog(b,'tempête : l’éolien tourne à plein, mais gare à la casse.','warn'); }
      else if(rnd()<.004&&(doy<60||doy>330)){ m.ev={k:'cold', until:S.day+10}; metLog(b,'vague de froid : le prix de l’électricité flambe pendant dix jours.','good'); } }
    if(m.ev&&m.ev.k==='storm') m.pl.forEach(p=>{ if(p.t==='eol'&&p.down<=S.day&&rnd()<.04){ p.down=S.day+20; m.accC+=rnCost(b,'eol',p.r,p.sz)*.05; metLog(b,'une éolienne endommagée par la tempête ('+RN_REG[p.r].n+') : 20 jours d’arrêt.','bad'); } });
    /* prix du jour : plus cher l'hiver, plus bas les jours de grand vent */
    const tgt=rnSeasonPx()*(1-.08*(wAvg-1))*(m.ev&&m.ev.k==='cold'?2.2:1);
    m.px=clamp(Math.exp(.75*Math.log(m.px)+.25*Math.log(tgt)+.07*norm()),.25,4); m.pxh.push(m.px); if(m.pxh.length>60) m.pxh.shift();
    /* autorisations */
    Object.keys(m.reg).forEach(k=>{ const g=m.reg[k]; if(g.req&&S.day>=g.req){ g.req=0; if(rnd()<(k==='mer'?.1:.22)){ g.ban=S.day+120; metLog(b,'opposition locale : l’autorisation est refusée en '+RN_REG[k].n+'.','bad'); } else { g.auth=1; metLog(b,'autorisation obtenue : '+RN_REG[k].n+'.','good'); } } });
    /* production, stockage, vente */
    const prod=m.pl.reduce((a,p)=>a+rnOut(b,p),0), pol=RN_POL[m.bat.pol]||RN_POL.pru, B=m.bat;
    let sell=prod, stored=0, out=0;
    if(B.cap>0&&pol.lo>0){ if(m.px<pol.lo){ stored=Math.min(prod*.6,B.cap-B.lvl); B.lvl+=stored; sell-=stored; } else if(m.px>pol.hi&&B.lvl>0){ out=B.lvl*.5; B.lvl-=out; sell+=out*.9; } }
    const arb=Math.min(B.cap,prod)*.12*m.px;
    if(m.ctr.until<S.day&&m.ctr.sh){ metLog(b,'votre contrat de vente d’électricité arrive à échéance.',''); m.ctr.sh=0; }
    const sp=m.px*(m.smart?1.06:1), h2= m.h2&&m.px<.75 ? .75 : 0;
    const rev=R0*(sell*(m.ctr.sh*m.ctr.p+(1-m.ctr.sh)*(h2||sp))+arb);
    m.acc+=rev; m.last={prod, sell, stored, out, px:m.px, rev};
  },
  kpis(b){ const m=b.m, L=m.last, R0=metR0(b), cap=m.pl.reduce((a,p)=>a+RN_T[p.t].k*p.sz,0), sav=S.biz.reduce((a,x)=>a+renewSaving(x),0);
    return [['Prix du jour', String(m.px.toFixed(2)).replace('.',NDEC), m.ev&&m.ev.k==='cold'? 'Vague de froid' : m.ev&&m.ev.k==='storm'? 'Tempête' : m.px>1.15? 'Électricité chère' : m.px<.85? 'Électricité bon marché' : 'Prix normal'],
            ['Production', L? Math.round(L.prod/Math.max(1e-9,cap)*100)+' % du maximum' : '—', m.pl.length+' centrales · '+eur(L?L.rev:0,0)+' de ventes'],
            ['Contrat', m.ctr.sh? Math.round(m.ctr.sh*100)+' % à '+m.ctr.p.toFixed(2).replace('.',NDEC) : 'Aucun', m.ctr.sh? 'Jusqu’au '+dateL(m.ctr.until) : 'Tout au prix du jour'],
            ['Vos autres sociétés', sav>0? eur(sav,0)+' / j' : '—', sav>0? 'économisés sur leur énergie' : 'Usines et data centers paient leur énergie moins cher']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[];
    out.push({k:'seg', act:'pol', label:'Batteries : '+(RN_POL[m.bat.pol]||RN_POL.pru).n.toLowerCase(), val:m.bat.pol, opts:Object.keys(RN_POL).map(k=>[k,RN_POL[k].n]), sub:m.bat.cap? 'Stockées '+Math.round(m.bat.lvl/m.bat.cap*100)+' %. « Prudent » stocke sous 0,90 et vend au-dessus de 1,15 ; « Ambitieux » stocke sous 0,95 et vend dès 1,10.' : 'Achetez d’abord une batterie.'});
    RN_BAT.forEach((x,i)=>{ if(x.rk&&!mxHas(b,x.rk)) return; out.push({k:'btn', act:'bat', arg:i, label:'Ajouter : '+x.n.toLowerCase(), cost:d.cost*x.c, sub:'Capacité '+String(x.cap).replace('.',NDEC)+' u. Capte l’écart entre heures creuses et heures chères chaque jour.'}); });
    if(mxHas(b,3)) out.push(m.h2? {k:'buy', act:'h2', label:'Électrolyseur à hydrogène', owned:true, sub:'Sous 0,75, l’électricité part en hydrogène vendu à 0,75.'} : {k:'buy', act:'h2', label:'Construire un électrolyseur', cost:d.cost*2, sub:'Sous 0,75, l’électricité part en hydrogène vendu à 0,75.'});
    if(mxHas(b,4)) out.push(m.smart? {k:'buy', act:'smart', label:'Réseau intelligent', owned:true, sub:'+6 % sur le prix du jour.'} : {k:'buy', act:'smart', label:'Passer au réseau intelligent', cost:d.cost*2.5, sub:'+6 % sur le prix du jour.'});
    if(mxHas(b,5)) out.push(m.big? {k:'buy', act:'big', label:'Parcs géants', owned:true, sub:'Vous pouvez construire des centrales trois fois plus grandes.'} : {k:'buy', act:'big', label:'Ouvrir les parcs géants', cost:d.cost*3, sub:'Centrales trois fois plus grandes, 13 % moins chères à la puissance.'});
    return out;
  },
  acts:{
    build:(b,arg)=>{ const [t,r,sz]=String(arg).split(':'); return rnBuild(b,t,r,+sz||1,false); },
    req:(b,r)=>rnReq(b,String(r)),
    sell:(b,id)=>{ const m=b.m, p=m.pl.find(x=>x.id===+id); if(!p) return err('Centrale introuvable.'); const g=rnCost(b,p.t,p.r,p.sz)*.5; payCap('b:'+b.id,'Vente d’une centrale : '+b.name,g); m.pl=m.pl.filter(x=>x!==p); return ok('Centrale revendue '+eur(g,0)+'.'); },
    ctr:(b,v)=>{ const m=b.m, sh=+v; if(![0,.3,.6,.9].includes(sh)) return err('Part inconnue.'); if(sh===0){ m.ctr={sh:0,p:1,until:0}; return ok('Contrat résilié : tout part au prix du jour.'); }
      const avg=m.pxh.reduce((a,x)=>a+x,0)/m.pxh.length, p=Math.round(avg*.97*100)/100; m.ctr={sh, p, until:S.day+360}; metLog(b,'contrat d’un an signé : '+Math.round(sh*100)+' % de la production à '+String(p).replace('.',NDEC)+'.',''); return ok('Contrat signé à '+String(p).replace('.',NDEC)+'.'); },
    pol:(b,v)=>{ if(!RN_POL[v]) return err('Réglage inconnu.'); b.m.bat.pol=v; return ok(''); },
    bat:(b,i)=>{ const x=RN_BAT[+i]; if(!x) return err('Batterie inconnue.'); if(x.rk&&!mxHas(b,x.rk)) return err('Palier '+x.rk+' requis.'); const c=bizDef(b).cost*x.c; if(!metBuy(b,c,x.n)) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.bat.cap+=x.cap; return ok(x.n+' installée.'); },
    h2:(b)=>rnBuy(b,'h2',2,'Électrolyseur à hydrogène',3),
    smart:(b)=>rnBuy(b,'smart',2.5,'Réseau intelligent',4),
    big:(b)=>rnBuy(b,'big',3,'Parcs géants',5)
  },
  auto: rnAuto
};
/* le directeur de l'exploitation choisit quand vendre et stocker */
function rnAuto(b,mode,q){ const m=b.m;
  if(m.bat.cap>0) m.bat.pol= rnd()<q? 'pru' : 'agr';
  const avg=m.pxh.reduce((a,x)=>a+x,0)/m.pxh.length;
  if(!m.ctr.sh&&avg>rnSeasonPx()*1.03&&rnd()<q) MET.renew.acts.ctr(b,.6);
  if(mode!=='full') return;
  if(S.day%10===0){ /* autorisations puis centrales dans la meilleure région */
    const regs=Object.keys(RN_REG).filter(r=>!RN_REG[r].rk||mxHas(b,RN_REG[r].rk));
    const nf=regs.find(r=>!m.reg[r].auth&&!m.reg[r].req&&m.reg[r].ban<=S.day); if(nf&&dlBudget(b)>metR0(b)){ b.dlp-=metR0(b); rnReq(b,nf); }
    let best=null, bv=0; regs.forEach(r=>Object.keys(RN_T).forEach(t=>{ if(rnCanBuild(b,t,r)) return; const sz=m.big?3:1, v=RN_T[t].k*sz*(RN_T[t].rs==='s'?RN_REG[r].s:RN_T[t].rs==='w'?RN_REG[r].w:RN_REG[r].h)*(r==='mer'?1.2:1)/rnCost(b,t,r,sz); if(v>bv){ bv=v; best=[t,r,sz]; } }));
    if(best&&dlCan(b,rnCost(b,...best),'Nouvelle centrale')) rnBuild(b,best[0],best[1],best[2],true);
    if(m.bat.cap<.6&&dlCan(b,bizDef(b).cost*.15,'Batteries')) { if(dlSpend(b,bizDef(b).cost*.15,'Batterie')) m.bat.cap+=.3; }
    for(const [k,f,l,rk] of [['h2',2,'Électrolyseur à hydrogène',3],['smart',2.5,'Réseau intelligent',4],['big',3,'Parcs géants',5]]) if(!m[k]&&mxHas(b,rk)&&rnBuy(b,k,f,l,rk,true).ok) break; }
}

