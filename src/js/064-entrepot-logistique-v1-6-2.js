/* ============================================================
   ENTREPÔT LOGISTIQUE (V1.6.2)
   - Capacité en emplacements de palettes (selon le niveau), rayonnages hauts pour l'augmenter.
   - Contrats de stockage : des clients (e-commerce, industrie, grande distribution, pharmacie…) louent des
     emplacements à un prix par palette et par jour, plus la manutention (entrées et sorties). Durée de 3 à
     12 mois ; à l'échéance, un client satisfait renouvelle. Négocier : +8 %, une chance sur deux de refus.
   - Équipement : transpalettes, chariots élévateurs, puis entrepôt automatisé (manutention moins chère et
     plus rapide). Logiciel de gestion : moins d'erreurs. Zone frigorifique : contrats sous température.
   - Camions : livraison des colis de vos clients (revenus selon leurs mouvements).
   - Vos usines de la même ville gardent leur stock plus longtemps (déjà en place).
   - Événements : pic de fin d'année, grève des transports, client en faillite, panne des chariots.
   État b.m (v:1) : ct[] {id, n, sec, pal, p, rot, fr, until, sat}, off[], eq (0-2), wms, fr (zone froide),
   rk (rayonnages), tr (camions), mk (marché), ev[], nid, st, acc, accC, pend, pendC, log.
   ============================================================ */
D.biz.warehouse.sub='Stockage, manutention et livraison pour vos clients';
const WH_CL=[['Colibri Shop','e-commerce'],['Maison Ardent','grande distribution'],['Novapharm','pharmacie'],['Atelier Brume','mode'],['Ferrandi Industrie','industrie'],['Bio Vallée','alimentaire'],['Pixel Store','e-commerce'],['Mécaplus','industrie'],['Cave Saint-Clair','boissons'],['Glacier Polaire','alimentaire'],['TechNord','électronique'],['Jouets Lutin','jouets'],['Verdure & Co','jardinage'],['Opti Santé','pharmacie'],['Sport Élan','sport']];
const WH_EQ=[{n:'Transpalettes', h:2.4, sp:1},{n:'Chariots élévateurs', h:1.5, sp:1.25, c:4},{n:'Entrepôt automatisé', h:.8, sp:1.6, c:14, rk:3}];
const WH_P0=1.12;          /* V1.7.2 : 1,05 → 1,12 */
const WH_F={wms:.42,fr:1.05,exp:1.4,hub:2.8}; /* V1.7.2 : options 30 % moins chères */
const WH_RK=5;          /* prix moyen d'une palette stockée, € par jour */
const whK = b => metR0(b)/3454;
function whCap(b){ const m=b.m; return Math.round(1700*whK(b)*(1+.3*(m.rk||0))); }
function whUsed(b){ return b.m.ct.reduce((a,c)=>a+c.pal,0); }
function whFrCap(b){ return b.m.fr? Math.round(whCap(b)*.25) : 0; }
function whFrUsed(b){ return b.m.ct.filter(c=>c.fr).reduce((a,c)=>a+c.pal,0); }
function whEv(m,k){ return (m.ev||[]).some(e=>e.k===k&&e.until>=S.day); }
function whPeak(){ const mo=footDate(S.day).m; return mo===11||mo===12; }
function whOffer(b,big){ const m=b.m, c=pick(WH_CL), cap=whCap(b), fr=!!m.fr&&(c[1]==='pharmacie'||c[1]==='alimentaire')&&rnd()<.7;
  const pal=Math.max(20,Math.round(cap*(big? .3+rnd()*.15 : .04+rnd()*rnd()*.22)/10)*10), rot=+(c[1]==='e-commerce'? .18+rnd()*.12 : .04+rnd()*.1).toFixed(2);
  const p=+(WH_P0*m.mk*(fr?1.7:1)*(big?1.15:1)*(m.hub?1.12:1)*(.85+rnd()*.3)).toFixed(2);
  return {id:m.nid++, n:c[0], sec:c[1], pal, p, rot, fr, mo:pick(big?[12]:[3,6,6,12]), exp:S.day+8+Math.floor(rnd()*8), big:big?1:0}; }
function whInit(b){ const m={v:1, brk:1, ct:[], off:[], eq:0, wms:0, fr:0, rk:0, tr:0, mk:1, ev:[], nid:1, st:null, acc:0, accC:0, pend:0, pendC:0, log:[]};
  b.m=m; b.stock=0;
  /* l'entrepôt démarre à moitié plein, avec des contrats de durées variées */
  let used=0; const cap=whCap(b); while(used<cap*.55){ const o=whOffer(b,false); if(o.fr) continue; const c=whSign(b,o,true); c.until=S.day+30+Math.floor(rnd()*300); used+=c.pal; }
  for(let i=0;i<3;i++) m.off.push(whOffer(b,false));
  return m; }
function whSign(b,o,silent){ const m=b.m, c={id:m.nid++, n:o.n, sec:o.sec, pal:o.pal, p:o.p, rot:o.rot, fr:o.fr, until:S.day+o.mo*30, sat:65, big:o.big};
  m.ct.push(c); if(o.big) m.bign=(m.bign||0)+1; if(!silent) metLog(b,c.n+' confie '+fmtN(c.pal,0)+' palettes à l’entrepôt ('+fmtN(c.p,2)+' € par palette et par jour).','good'); return c; }
/* une journée (sans hasard) */
function whDay(b){ const m=b.m, E=WH_EQ[m.eq], k=whK(b); let rev=0, cost=0, mv=0, sto=0;
  const peak=whPeak()? 1.4 : 1, brk=whEv(m,'pan');
  m.ct.forEach(c=>{ const x=c.pal*c.rot*peak; mv+=x; sto+=c.pal*c.p; rev+=c.pal*c.p+x*3.2; if(c.fr) cost+=c.pal*.16; });
  const capMv=1700*k*.35*E.sp*(brk?.5:1), done=Math.min(mv,capMv), late=mv-done;
  cost+=done*E.h*(m.wms?.9:1)+late*E.h*2;                  /* manutention ; les retards coûtent double (heures supplémentaires) */
  /* camions : chacun livre 140 colis par jour, 3,8 € le colis ; payés même à l'arrêt */
  const strike=whEv(m,'gr'), want=mv*.6, cap=m.tr*140, del=strike? 0 : Math.min(want,cap);
  rev+=del*3.8*(m.exp?1.25:1); cost+=m.tr*290;
  const used=whUsed(b), cap0=whCap(b);
  cost+=Math.max(0,cap0-used)*.05;                          /* emplacements vides : éclairage, gardiennage */
  return {rev, sto, cost, net:rev-cost, mv, done, late, del, occ:cap0? used/cap0 : 0, used, cap:cap0}; }
MET.warehouse={
  fam:'ind', core:true, init:whInit,
  ranks:[
    {n:'Logiciel de gestion', d:'Chaque palette est suivie : moins d’erreurs, clients plus satisfaits, manutention −10 %.'},
    {n:'Zone frigorifique', d:'Un quart de l’entrepôt sous température : contrats alimentaires et pharmaceutiques mieux payés.'},
    {n:'Entrepôt automatisé', d:'Robots et convoyeurs : manutention deux fois moins chère et beaucoup plus rapide.'},
    {n:'Livraison express', d:'Vos camions livrent en 24 heures : +25 % par colis.'},
    {n:'Plateforme multimodale', d:'Rail, route et port : des clients plus gros et mieux payés (+12 %).'}
  ],
  mods(b){ const m=b.m; return {vol:0, cogs:0, rev:m.pend, fixed:m.pendC}; },
  daily(b,ctx){ const m=b.m;
    if(ctx.open){ m.pend=m.acc; m.pendC=m.accC; m.acc=0; m.accC=0; }
    m.ev=(m.ev||[]).filter(e=>e.until>=S.day);
    m.mk=clamp(m.mk+(1-m.mk)*.01+.006*norm(),.8,1.2);
    const d=whDay(b); m.st=d; if(ctx.open){ m.acc+=d.rev; m.accC+=d.cost; } else { m.acc+=d.sto; m.accC+=d.cost*.35; }   /* le week-end, le stockage reste payé */
    /* satisfaction : retards, erreurs, prix */
    m.ct.slice().forEach(c=>{ const tgt=clamp(70-(d.mv? d.late/d.mv : 0)*120+(m.wms?8:0)-(m.eq===0?6:0)-Math.max(0,c.p/(WH_P0*m.mk*(c.fr?1.7:1))-1)*60,0,100); c.sat=clamp(c.sat+(tgt-c.sat)/40,0,100);
      if(c.until<=S.day){ if(rnd()<clamp(c.sat/100*1.15-.1,.05,.95)){ c.p=+((c.p*.5+WH_P0*m.mk*(c.fr?1.7:1)*.5)).toFixed(2); c.until=S.day+pick([3,6,12])*30; metLog(b,c.n+' renouvelle son contrat ('+fmtN(c.pal,0)+' palettes).','good'); }
        else { m.ct=m.ct.filter(x=>x!==c); metLog(b,c.n+' ne renouvelle pas et retire ses '+fmtN(c.pal,0)+' palettes.','warn'); } } });
    /* commercial : sans consigne, il remplit les emplacements vides avec des clients moyens, 8 % sous le prix du marché */
    if(m.brk&&rnd()<.07){ const o=whOffer(b,false); if(!o.fr&&whUsed(b)+o.pal<=whCap(b)){ o.p=+(o.p*.92).toFixed(2); whSign(b,o,true); metLog(b,'le commercial signe '+o.n+' ('+fmtN(o.pal,0)+' palettes).',''); } }
    m.off=m.off.filter(o=>o.exp>S.day); if(m.off.length<(whPeak()?6:4)&&rnd()<.25) m.off.push(whOffer(b,false));
    whRisks(b);
  },
  kpis(b){ const m=b.m, d=m.st||whDay(b);
    return [['Occupation', Math.round(d.occ*100)+' %', fmtN(d.used,0)+' palettes sur '+fmtN(d.cap,0)],
            ['Mouvements / jour', fmtN(Math.round(d.mv)), d.late>1? fmtN(Math.round(d.late))+' en retard' : 'Tout est traité à temps'],
            ['Clients', String(m.ct.length), whPeak()? 'Pic de fin d’année' : 'Activité normale'],
            ['Camions', String(m.tr), m.tr? fmtN(Math.round(d.del))+' colis livrés par jour' : 'Aucun camion']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), out=[], R0=metR0(b);
    out.push({k:'tog', act:'brk', label:'Commercial', tl:[[0,'Aucun'],[1,'Recruté']], val:m.brk?1:0, sub:'Il remplit seul les emplacements vides, 8 % sous le prix du marché.'});
    const nx=WH_EQ[m.eq+1]; if(nx&&(!nx.rk||mxHas(b,nx.rk))) out.push({k:'buy', act:'eq', label:nx.n, cost:R0*nx.c, sub:'Manutention moins chère et plus rapide.'});
    else out.push({k:'buy', act:'eq', label:WH_EQ[m.eq].n, owned:true, sub:'Équipement actuel.'});
    out.push({k:'btn', act:'rk', label:'Rayonnages hauts ('+(m.rk||0)+' / '+WH_RK+')', cost:R0*3*(1+(m.rk||0)), dis:(m.rk||0)>=WH_RK, sub:'+30 % d’emplacements à chaque fois.'});
    out.push({k:'btn', act:'tr', label:'Acheter un camion ('+m.tr+')', cost:R0*5, sub:'140 colis livrés par jour pour vos clients, 290 € de frais quotidiens.'});
    if(m.tr) out.push({k:'btn', act:'trs', label:'Revendre un camion', gain:R0*3, sub:'Un camion de moins.'});
    [['wms',1,WH_F.wms,'Logiciel de gestion','Moins d’erreurs, manutention −10 %.'],['fr',2,WH_F.fr,'Zone frigorifique','Un quart des emplacements sous température.'],['exp',4,WH_F.exp,'Livraison express','+25 % par colis livré.'],['hub',5,WH_F.hub,'Plateforme multimodale','Clients plus gros, +12 % de prix.']].forEach(([k2,rk,f,l,s])=>{
      if(mxHas(b,rk)) out.push(m[k2]? {k:'buy', act:k2, label:l, owned:true, sub:s} : {k:'buy', act:k2, label:l, cost:d.cost*f, sub:s}); });
    return out; },
  acts:{
    brk:(b,v)=>{ b.m.brk= v===undefined? (b.m.brk?0:1) : (+v?1:0); return ok(b.m.brk? 'Le commercial remplit l’entrepôt.' : 'Vous choisissez vos clients.'); },
    sign:(b,arg)=>{ const [oid,neg]=String(arg).split(':'); return whTake(b,+oid,+neg||0); },
    end:(b,id)=>{ const m=b.m, c=m.ct.find(x=>x.id===+id); if(!c) return err('Contrat introuvable.'); const pen=c.pal*c.p*30; if(!metBuy(b,pen,'Rupture de contrat : '+c.n)) return err('Il faut '+eur(pen,0)+' d’indemnité (un mois).'); m.ct=m.ct.filter(x=>x!==c); return ok('Contrat rompu : '+fmtN(c.pal,0)+' palettes libérées.'); },
    eq:(b)=>{ const m=b.m, nx=WH_EQ[m.eq+1]; if(!nx) return err('Équipement au maximum.'); if(nx.rk&&!mxHas(b,nx.rk)) return err('Palier '+nx.rk+' requis.'); const c=metR0(b)*nx.c; if(!metBuy(b,c,nx.n)) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.eq++; metLog(b,'nouvel équipement : '+nx.n.toLowerCase()+'.','good'); return ok(nx.n+' en service.'); },
    rk:(b)=>{ const m=b.m; if((m.rk||0)>=WH_RK) return err('Rayonnages au maximum.'); const c=metR0(b)*3*(1+(m.rk||0)); if(!metBuy(b,c,'Rayonnages hauts')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m.rk=(m.rk||0)+1; return ok(fmtN(whCap(b),0)+' emplacements.'); },
    tr:(b)=>{ const c=metR0(b)*5; if(!metBuy(b,c,'Achat d’un camion')) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); b.m.tr++; return ok('Camion en service.'); },
    trs:(b)=>{ const m=b.m; if(!m.tr) return err('Aucun camion.'); m.tr--; payCap('b:'+b.id,'Revente d’un camion',metR0(b)*3); settleAccounts(); return ok('Camion revendu.'); },
    wms:(b)=>whBuyR(b,'wms',WH_F.wms,'Logiciel de gestion',1),
    fr:(b)=>whBuyR(b,'fr',WH_F.fr,'Zone frigorifique',2),
    exp:(b)=>whBuyR(b,'exp',WH_F.exp,'Livraison express',4),
    hub:(b)=>whBuyR(b,'hub',WH_F.hub,'Plateforme multimodale',5)
  },
  auto: whAuto
};
function whBuyR(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function whTake(b,oid,neg){ const m=b.m, o=m.off.find(x=>x.id===oid); if(!o) return err('Ce client a trouvé ailleurs.');
  if(o.fr&&(!m.fr||whFrUsed(b)+o.pal>whFrCap(b))) return err('Il faut de la place en zone frigorifique.');
  if(whUsed(b)+o.pal>whCap(b)) return err('Pas assez d’emplacements libres ('+fmtN(whCap(b)-whUsed(b),0)+').');
  if(neg){ if(rnd()<.5){ m.off=m.off.filter(x=>x!==o); return err(o.n+' refuse vos conditions et s’en va.'); } o.p=+(o.p*1.08).toFixed(2); }
  m.off=m.off.filter(x=>x!==o); const c=whSign(b,o); return ok(c.n+' signe pour '+o.mo+' mois.'); }
function whRisks(b){ const m=b.m, r=rnd();
  if(r<.002&&!whEv(m,'gr')&&m.tr){ m.ev.push({k:'gr',until:S.day+3}); metLog(b,'grève des transports : vos camions restent à quai trois jours.','bad'); }
  else if(r<.0035&&!whEv(m,'pan')){ m.ev.push({k:'pan',until:S.day+4}); metLog(b,'panne des chariots : la manutention tourne au ralenti quatre jours.','bad'); }
  else if(r<.0055){ m.off.push(whOffer(b,true)); metLog(b,'un grand compte cherche de la place pour un an : offre valable une semaine.','good'); }
  const F=m.ct.filter(c=>c.sec==='mode'||c.sec==='jouets'); if(F.length&&rnd()<.0004*F.length){ const c=pick(F); m.ct=m.ct.filter(x=>x!==c); metLog(b,c.n+' fait faillite : ses palettes sont vendues aux enchères, le dernier mois est perdu.','bad'); } }
/* le directeur : signe les clients qui tiennent dans l'entrepôt ; en délégation totale, équipe et achète des camions */
function whAuto(b,mode,q){ const m=b.m;
  if(S.day%2===0) m.off.slice().sort((x,y)=>y.p*y.pal-x.p*x.pal).forEach(o=>{ if(o.p>=WH_P0*m.mk*(o.fr?1.7:1)*.85||rnd()<q) whTake(b,o.id,0); });
  if(mode!=='full'||S.day%30) return;
  const d=m.st||whDay(b), R0=metR0(b), nx=WH_EQ[m.eq+1];
  if(nx&&(!nx.rk||mxHas(b,nx.rk))&&d.late>0&&dlSpend(b,R0*nx.c,nx.n)){ m.eq++; return; }
  if(d.occ>.9&&(m.rk||0)<WH_RK&&dlSpend(b,R0*3*(1+(m.rk||0)),'Rayonnages hauts')){ m.rk=(m.rk||0)+1; return; }
  if(d.mv*.6>m.tr*140+140&&dlSpend(b,R0*5,'Achat d’un camion')){ m.tr++; return; }
  for(const [k,f,l,rk] of [['wms',WH_F.wms,'Logiciel de gestion',1],['fr',WH_F.fr,'Zone frigorifique',2],['exp',WH_F.exp,'Livraison express',4],['hub',WH_F.hub,'Plateforme multimodale',5]]) if(!m[k]&&mxHas(b,rk)&&whBuyR(b,k,f,l,rk,true).ok) break; }

