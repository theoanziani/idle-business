/* ============================================================
   AGENCE DE RECRUTEMENT : l'appariement
   Des sociétés clientes publient des postes avec un profil recherché (secteur, niveau,
   qualité minimale, budget). On propose un candidat de son vivier ; une bonne correspondance
   rapporte une commission (placement définitif) ou un revenu chaque jour (intérim).
   Systèmes : chasse de candidats (budget), spécialité de l'agence, intérimaires en mission.
   Événements : candidat qui se désiste, profil introuvable, période d'embauche massive.
   Paliers : cadres dirigeants, contrats exclusifs, bureaux à l'étranger, conseil RH, plateforme en ligne.
   Lien : les frais de recrutement de vos autres sociétés baissent (staffingLevel, inchangé).
   État b.m (v:1) : pool[], jobs[], int[] (missions d'intérim), spec, ch (budget de chasse 0-3),
   excl, intl, rh, web, nid, ev, pend, pendC, log.
   ============================================================ */
const ST_SEC = {tech:'Tech', ind:'Industrie', com:'Commerce', fin:'Finance', san:'Santé'};
const ST_LVL = [{n:'Junior', s:28000},{n:'Confirmé', s:40000},{n:'Senior', s:55000},{n:'Dirigeant', s:120000}];
const ST_CL = ['Groupe Alba','Société Vela','Horizon Industrie','Banque Atlante','Clinique Pasteur','Pacifico Distribution','Nova Tech','Laboratoires Orion','Transports Iris','Mutuelle Azur'];
const ST_FN = ['Camille','Lucas','Sarah','Hugo','Inès','Nathan','Léa','Mehdi','Chloé','Yanis','Emma','Karim','Jade','Théo','Lina','Adam'];
const ST_LN = ['Martin','Bernard','Dubois','Moreau','Laurent','Garcia','Roux','Fournier','Girard','Bonnet','Mercier','Faure'];
const ST_CH = [0,.05,.12,.25];
const stPf = b => Math.pow(5/3,(b.lvl||1)-1);
const stRec = b => Math.max(1,(b.staff.recruteur&&b.staff.recruteur.n)||0);
function stCand(b,sec){ const m=b.m, maxL=mxHas(b,1)?3:2, l=Math.min(maxL, wpick([0,1,2,3],x=>[4,4,2.5,mxHas(b,1)?1:0][x]));
  return {id:m.nid++, n:pick(ST_FN)+' '+pick(ST_LN), sec:sec||pick(Object.keys(ST_SEC)), l, q:Math.round(clamp(68+12*norm(),35,98)), sal:Math.round(ST_LVL[l].s*(.9+.25*rnd())/1000)*1000, until:S.day+rint(20,45)}; }
function stJob(b,hard){ const m=b.m, maxL=mxHas(b,1)?3:2, l=Math.min(maxL, wpick([0,1,2,3],x=>[3,4,2.5,mxHas(b,1)?.8:0][x])), sec=pick(Object.keys(ST_SEC));
  const cdi= l>=3 || rnd()<.3;
  m.jobs.push({id:m.nid++, cl:(m.excl&&rnd()<.4? 'Client exclusif · ':'')+pick(ST_CL), sec, l, need:hard? 92 : Math.round(clamp(62+10*norm(),45,88)), bud:Math.round(ST_LVL[l].s*(1+.2*rnd())/1000)*1000, cdi, dur:cdi?0:rint(30,90), exp:S.day+rint(8,15), t0:S.day, prop:null}); }
/* chance qu'une candidature soit retenue */
function stMatch(b,j,c){ const m=b.m; let p=.8;
  p*= c.sec===j.sec? 1 : .3; p*= c.l===j.l? 1 : Math.abs(c.l-j.l)===1? .45 : 0;
  p*= clamp(1+(c.q-j.need)/35,.1,1.15); p*= c.sal<=j.bud? 1 : clamp(1-(c.sal-j.bud)/j.bud*3,0,1);
  if(m.spec===j.sec) p*=1.2; else if(m.spec&&m.spec!=='mix') p*=.92;
  if(m.excl&&j.cl.startsWith('Client exclusif')) p*=1.15;
  return clamp(p,0,.95); }
function stFee(b,j,c){ return (j.cdi? c.sal*(j.l>=3?.25:.15) : 0)*stPf(b); }
function stIntDay(b,c){ return c.sal/220*.12*stPf(b); }
function stInit(b){ const m={v:1, pool:[], jobs:[], int:[], spec:'mix', ch:1, excl:0, intl:0, rh:0, web:0, nid:1, ev:null, pend:0, pendC:0, log:[]}; b.m=m;
  for(let i=0;i<12;i++) m.pool.push(stCand(b)); for(let i=0;i<4;i++) stJob(b);
  /* quelques intérimaires déjà en mission pour une agence qui tournait déjà */
  if(b.hist&&b.hist.length>5) for(let i=0;i<10;i++){ const c=stCand(b); m.int.push({n:c.n, until:S.day+rint(10,80), d:stIntDay(b,c)}); }
  return m; }
MET.staffing = {
  fam:'com', core:true, init:stInit,
  ranks:[
    {n:'Cadres dirigeants', d:'Chasse de têtes pour des postes de direction : commissions de 25 % d’un gros salaire.'},
    {n:'Contrats exclusifs', d:'Des clients vous confient tous leurs recrutements : plus de postes, plus faciles à pourvoir.'},
    {n:'Bureaux à l’étranger', d:'Plus de postes et de candidats.'},
    {n:'Conseil RH', d:'Des contrats de conseil en ressources humaines qui rapportent chaque jour.'},
    {n:'Plateforme en ligne', d:'Les candidats s’inscrivent seuls : le vivier se remplit beaucoup plus vite.'}
  ],
  mods(b){ const m=b.m, R0=metR0(b); return {vol:0, cogs:0, rev:m.pend+(m.rh?R0*.25:0), fixed:m.pendC+R0*ST_CH[m.ch]+(m.intl?R0*.05:0)+(m.web?R0*.04:0)}; },
  daily(b,ctx){ const m=b.m, rec=stRec(b);
    if(ctx.open){ m.pend=0; m.pendC=0; }
    if(m.ev&&m.ev.until<S.day) m.ev=null;
    /* intérim : revenu chaque jour de mission */
    m.int=m.int.filter(x=>{ m.pend+=x.d; return x.until>S.day; });
    if(!ctx.open) return;
    const sf=clamp(staffFactor(b),.3,1.2);
    /* vivier */
    m.pool=m.pool.filter(c=>c.until>=S.day);
    let nc=(.35*rec*sf+ST_CH[m.ch]*metR0(b)/(25*stPf(b)))*(m.intl?1.4:1)*(m.web?2:1);
    while(nc>0){ if(rnd()<Math.min(1,nc)) m.pool.push(stCand(b, m.spec!=='mix'&&rnd()<.35? m.spec : null)); nc--; }
    if(m.pool.length>60) m.pool.splice(0,m.pool.length-60);
    /* postes */
    m.jobs=m.jobs.filter(j=>j.exp>=S.day||j.prop);
    let nj=.12*rec*sf*(m.excl?1.4:1)*(m.intl?1.4:1)*(m.ev&&m.ev.k==='mass'?2:1);
    while(nj>0){ if(rnd()<Math.min(1,nj)) stJob(b, rnd()<.04); nj--; }
    /* V2.1.9 : au-delà de 14 postes, on retire d’abord les plus anciens sans candidature (avant : les candidatures en attente
       étaient supprimées avant la réponse du client, et une grande agence ne plaçait plus personne) */
    if(m.jobs.length>14){ let ex=m.jobs.length-14; m.jobs=m.jobs.filter(j=>{ if(ex>0&&!j.prop){ ex--; return false; } return true; }); }
    /* réponses des clients */
    m.jobs=m.jobs.filter(j=>{ if(!j.prop||S.day<j.prop.d) return true; const c=j.prop.c;
      if(rnd()<j.prop.p&&rnd()>.06){ if(j.cdi){ const f=stFee(b,j,c); m.pend+=f; metLog(b,c.n+' est embauché(e) chez '+j.cl.replace('Client exclusif · ','')+' : commission de '+eur(f,0)+'.','good'); }
        else { m.int.push({n:c.n, until:S.day+j.dur, d:stIntDay(b,c)}); metLog(b,c.n+' part en mission d’intérim pour '+j.dur+' jours ('+eur(stIntDay(b,c),0)+' par jour).','good'); }
        return false; }
      if(rnd()<.06) metLog(b,c.n+' se désiste au dernier moment.','warn'); else metLog(b,'candidature de '+c.n+' refusée par '+j.cl.replace('Client exclusif · ','')+'.','');
      c.until=Math.max(c.until,S.day+5); m.pool.push(c); j.prop=null; return j.exp>=S.day; });
    /* sans consigne, les recruteurs proposent eux-mêmes un profil du même secteur et du même niveau, au bout de quelques jours */
    m.jobs.forEach(j=>{ if(j.prop||S.day-(j.t0||S.day)<6) return; const L=m.pool.filter(c=>c.sec===j.sec&&Math.abs(c.l-j.l)<=1); if(L.length) stProp(b,j.id+':'+pick(L).id); });
    /* événements */
    if(!m.ev&&rnd()<.004){ m.ev={k:'mass', until:S.day+15}; metLog(b,'période d’embauche massive : deux fois plus de postes pendant 15 jours.','good'); }
  },
  kpis(b){ const m=b.m, intD=m.int.reduce((a,x)=>a+x.d,0);
    return [['Postes ouverts', String(m.jobs.length), m.jobs.filter(j=>j.prop).length+' candidature(s) en attente'],
            ['Vivier', String(m.pool.length)+' candidats', m.spec==='mix'?'Généraliste':'Spécialité : '+ST_SEC[m.spec]],
            ['Intérimaires en mission', String(m.int.length), eur(intD,0)+' par jour'],
            ['Recruteurs', String(stRec(b)), 'Plus de recruteurs : plus de postes et de candidats']];
  },
  ctl(b){ const m=b.m, d=bizDef(b), R0=metR0(b), out=[];
    out.push({k:'seg', act:'ch', label:'Chasse de candidats', val:m.ch, opts:ST_CH.map((x,i)=>[i,i?eur(R0*x,0)+' / j':'Aucune']), sub:'Annonces, salons et approche directe pour remplir le vivier.'});
    out.push({k:'seg', act:'spec', label:'Spécialité de l’agence', val:m.spec, opts:[['mix','Généraliste']].concat(Object.keys(ST_SEC).map(k=>[k,ST_SEC[k]])), sub:'Spécialisée, l’agence place mieux dans son secteur (+20 %) et un peu moins bien ailleurs.'});
    if(mxHas(b,2)) out.push(m.excl? {k:'buy', act:'excl', label:'Contrats exclusifs', owned:true, sub:'+40 % de postes, mieux pourvus.'} : {k:'buy', act:'excl', label:'Signer des contrats exclusifs', cost:d.cost*1.5, sub:'+40 % de postes, plus faciles à pourvoir.'});
    if(mxHas(b,3)) out.push(m.intl? {k:'buy', act:'intl', label:'Bureaux à l’étranger', owned:true, sub:'+40 % de postes et de candidats.'} : {k:'buy', act:'intl', label:'Ouvrir des bureaux à l’étranger', cost:d.cost*3, sub:'+40 % de postes et de candidats. '+eur(R0*.05,0)+' par jour.'});
    if(mxHas(b,4)) out.push(m.rh? {k:'buy', act:'rh', label:'Conseil RH', owned:true, sub:'Contrats de conseil.'} : {k:'buy', act:'rh', label:'Lancer le conseil RH', cost:d.cost*4, sub:'Environ '+eur(R0*.25,0)+' par jour de contrats de conseil.'});
    if(mxHas(b,5)) out.push(m.web? {k:'buy', act:'web', label:'Plateforme en ligne', owned:true, sub:'Vivier ×2.'} : {k:'buy', act:'web', label:'Lancer la plateforme en ligne', cost:d.cost*6, sub:'Les candidats s’inscrivent seuls : vivier ×2.'});
    return out;
  },
  acts:{
    ch:(b,v)=>{ b.m.ch=clamp(+v|0,0,3); return ok(''); },
    spec:(b,v)=>{ if(v!=='mix'&&!ST_SEC[v]) return err(''); b.m.spec=v; return ok(''); },
    prop:(b,arg)=>stProp(b,arg),
    excl:(b)=>stBuy(b,'excl',1.5,'Contrats exclusifs',2),
    intl:(b)=>stBuy(b,'intl',3,'Bureaux à l’étranger',3),
    rh:(b)=>stBuy(b,'rh',4,'Conseil RH',4),
    web:(b)=>stBuy(b,'web',6,'Plateforme en ligne',5)
  },
  auto: stAuto
};
function stBuy(b,k,f,label,rk,auto){ const m=b.m; if(!mxHas(b,rk)) return err('Palier '+rk+' requis.'); if(m[k]) return err('Déjà fait.'); const c=bizDef(b).cost*f;
  if(!(auto? dlSpend(b,c,label) : metBuy(b,c,label))) return err('Trésorerie insuffisante : '+eur(c,0)+'.'); m[k]=1; metLog(b,label.toLowerCase()+' : c’est fait.','good'); return ok(label+' : c’est fait.'); }
function stProp(b,arg){ const [jid,cid]=String(arg).split(':').map(Number), m=b.m, j=m.jobs.find(x=>x.id===jid), c=m.pool.find(x=>x.id===cid);
  if(!j) return err('Poste pourvu ou expiré.'); if(j.prop) return err('Une candidature est déjà en attente.'); if(!c) return err('Candidat indisponible.');
  j.prop={c, p:stMatch(b,j,c), d:S.day+3}; m.pool=m.pool.filter(x=>x!==c); return ok('Candidature de '+c.n+' envoyée : réponse dans 3 jours.'); }
/* le directeur d'agence fait les propositions automatiquement */
function stAuto(b,mode,q){ const m=b.m;
  m.jobs.filter(j=>!j.prop).forEach(j=>{ const L=m.pool.map(c=>[c,stMatch(b,j,c)]).sort((x,y)=>y[1]-x[1]); const best= rnd()<(1-q)*.3? L[Math.floor(rnd()*Math.min(3,L.length))] : L[0];
    if(best&&best[1]>.3) stProp(b,j.id+':'+best[0].id); });
  if(S.day%14===0){ m.ch= m.pool.length<15? 2 : m.pool.length<30? 1 : 0;
    const cnt={}; m.jobs.forEach(j=>cnt[j.sec]=(cnt[j.sec]||0)+1); }
  if(mode!=='full'||S.day%14!==0) return;
  for(const [k,f,l,rk] of [['excl',1.5,'Contrats exclusifs',2],['intl',3,'Bureaux à l’étranger',3],['rh',4,'Conseil RH',4],['web',6,'Plateforme en ligne',5]]) if(!m[k]&&mxHas(b,rk)&&stBuy(b,k,f,l,rk,true).ok) break;
}

