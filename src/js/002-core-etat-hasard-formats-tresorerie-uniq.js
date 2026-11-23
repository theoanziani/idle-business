/* ============================================================
   CORE : état, hasard, formats, trésorerie unique, journal
   ============================================================ */
let S = null; // état de la partie

const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
function rnd(){ S.rs = (S.rs + 0x6D2B79F5) | 0; let t = S.rs; t = Math.imul(t ^ t>>>15, t|1); t ^= t + Math.imul(t ^ t>>>7, t|61); return ((t ^ t>>>14)>>>0)/4294967296; }
function norm(){ return Math.sqrt(-2*Math.log(1-rnd()))*Math.cos(2*Math.PI*rnd()); }
function rint(a,b){ return a+Math.floor(rnd()*(b-a+1)); }
function pick(a){ return a[Math.floor(rnd()*a.length)]; }
function poisson(l){ let L=Math.exp(-l),k=0,p=1; do{k++;p*=rnd();}while(p>L&&k<30); return k-1; }
function wpick(items, wf){ let t=0; items.forEach(i=>t+=wf(i)); let r=rnd()*t; for(const i of items){ r-=wf(i); if(r<=0) return i; } return items[items.length-1]; }

/* V2.1.6 : format des nombres selon la langue (anglais : 1,234.5) */
const NLOC = (()=>{ try{ return (typeof localStorage!=='undefined'&&localStorage.getItem('idlebiz.lang')==='en')? 'en-GB' : 'fr-FR'; }catch(e){ return 'fr-FR'; } })();
const NDEC = NLOC==='en-GB'? '.' : ',';   /* séparateur décimal des textes faits à la main */
const NF = new Intl.NumberFormat(NLOC,{maximumFractionDigits:0});
const NF2 = new Intl.NumberFormat(NLOC,{minimumFractionDigits:2,maximumFractionDigits:2});
const NFD = {};
function fmtN(n,d){ return d? (NFD[d]=NFD[d]||new Intl.NumberFormat(NLOC,{minimumFractionDigits:d,maximumFractionDigits:d})).format(n) : NF.format(Math.round(n)); }
const plu=(n,w)=>fmtN(n)+' '+w+(Math.abs(n)>=2?'s':'');
function eur(n,dec){
  if(!isFinite(n)) return '—';
  const a=Math.abs(n), sg=n<0?'−':'';
  if(a>=1e12) return sg+fmtN(a/1e12,2)+' Bn €';
  if(a>=1e9) return sg+fmtN(a/1e9,2)+' Md €';
  if(a>=1e6) return sg+fmtN(a/1e6,2)+' M €';
  if(dec!==undefined) return sg+fmtN(a,dec)+' €';
  if(a<100 && a!==Math.round(a)) return sg+fmtN(a,2)+' €';
  return sg+fmtN(a)+' €';
}
function pct(x,d){ return fmtN(x*100,d===undefined?1:d)+' %'; }

const wdOf = day => (day-1)%7;
const isWE = day => wdOf(day)>=5;
function dateLabel(day){ return D.DAYS[wdOf(day)]+' · semaine '+(Math.floor((day-1)/7)+1); }
function marketsOpen(){ return wdOf(S.day)<5; }

/* ---------- Création d'une partie ---------- */
function newState(name, cap, seed){
  const s = {
    v:1, rs:(seed||Date.now())|0, name:name||'Ma Holding', startCap:cap,
    day:1, cash:cap, rep:50, infl:0, susp:0, prestige:0, peakNW:cap, nw:cap, nid:1,
    macro:{econ:1, shock:0, econPrev:1, rate:4, radd:0, house:1, phase:0},
    laws:Object.assign({},D.LAW0), gov:{pop:55,ten:35,stab:65}, bills:[], lawLog:[], decreeDay:-99,
    biz:[], tagMods:[], sched:[],
    tb:{corp:0,cap:0}, taxPaid30:0, taxLast:[], nextTax:30, negDays:0,
    debts:[], livret:{bal:0},
    pf:{player:{stock:{},bond:{},crypto:{}}, bank:{stock:{},bond:{},crypto:{}}},
    mk:null, vc:{offers:[],mine:[]},
    bank:{lic:false, res:0, dep:0, loans:[], rd:2.0, rl:8.0, br:1, atm:0, mk:0, fees:1, rep:50, apps:[],
      pol:{auto:false, minG:'C', minC:0}, run:{d:0,f:0}, cb:0, ent:{kind:'bank',staff:{},pol:1,cands:{}},
      st:{intIn:0,intOut:0,fees:0,loss:0,wage:0}, failed:0, lastWarn:-99},
    prop:[], listings:[], projects:[],
    lux:[], luxVal:{}, country:null,
    ledger:[], fl:{}, journal:[], nwH:[], ach:{}, chal:{}, tierSeen:0,
    stats:{layoffs30:0, lobby:0, hires:0, flips:0, startupWin:0},
    over:null, won:false, flashTier:null,
    acc:{USD:0,CNY:0,BRL:0}, fx:{USD:D.CCY.USD.eur,CNY:D.CCY.CNY.eur,BRL:D.CCY.BRL.eur}, fxH:{USD:[D.CCY.USD.eur],CNY:[D.CCY.CNY.eur],BRL:[D.CCY.BRL.eur]},
    q:{y:0,cny:0}, diff:'hard', dm:1, sweep:false, citySeen:{paris:1,zagreb:1,barcelone:1}, cities:{}, bld:{}, tut:{}
  };
  return s;
}

/* ---------- Journal ---------- */
function log(sev,msg,k){ S.journal.push({d:S.day,s:sev,m:msg,k:k||'own'}); if(S.journal.length>220) S.journal.shift(); if(sev==='crit') S.stop=true; }

/* ---------- Trésorerie unique ---------- */
function srcName(src){
  if(src.startsWith('c:')){ const c=D.CITIES[src.slice(2)]; return 'Immobilier · '+(c?c.n:'ville'); }
  if(src.startsWith('b:')){ const b=S.biz.find(x=>x.id===+src.slice(2)); return b? b.name : 'Société cédée'; }
  return {bank:'Banque', mk:'Marchés financiers', immo:'Immobilier', lux:'Luxe', tax:'Impôts', pol:'Politique', debt:'Crédits', gen:'Général', vc:'Capital-risque', country:'Pays', livret:'Livret', fx:'Change'}[src]||src;
}
/* Devise du compte qui reçoit ou paie : une société d'une ville étrangère utilise le compte local. Les montants restent exprimés en euros. */
/* V1.3.5 : une seule trésorerie, en euros (les comptes en devises ont été supprimés) */
function srcCcy(src){ return 'EUR'; }
function credit(src,amt){ const cc=srcCcy(src); if(cc==='EUR') S.cash+=amt; else S.acc[cc]+=amt/S.fx[cc]; }
/* Flux d'exploitation : comptent dans le bilan du jour. tax: 'corp' ou 'cap' alimente l'assiette fiscale. */
function pay(src,label,amt,tax){
  if(!amt || !isFinite(amt)) return;
  credit(src,amt);
  const f = S.fl[src] || (S.fl[src]={in:0,out:0});
  if(amt>0) f.in+=amt; else f.out-=amt;
  if(tax==='corp') S.tb.corp+=amt; else if(tax==='cap') S.tb.cap+=amt;
  rec(src,label,amt);
}
/* Mouvements de capital (achats, ventes d'actifs, transferts) : dans le grand livre, pas dans le bilan d'exploitation. */
function payCap(src,label,amt){ if(!amt||!isFinite(amt)) return; credit(src,amt); rec(src,label,amt,1); }
function rec(src,label,amt,cap){
  S.ledger.push({d:S.day, s:src, l:label, a:Math.round(amt*100)/100, b:Math.round(S.cash), c:cap?1:0});
  if(S.ledger.length>600) S.ledger.shift();
}

/* ---------- Palier ---------- */
function tierOf(nw){ let t=0; D.TIERS.forEach((x,i)=>{ if(nw>=x.nw) t=i; }); return t; }
function tierNow(){ return tierOf(S.peakNW); }
const unlocked = tier => tier<=tierNow();

/* ---------- Événements : aides globales ---------- */
function addTagMod(tag,mult,days,label){ S.tagMods.push({tag,mult,until:S.day+days,label}); }
function tagMult(tags){ let m=1; S.tagMods.forEach(x=>{ if(x.until>=S.day && tags.includes(x.tag)) m*=x.mult; }); return m; }
function sentImp(k,v){ S.mk.sent[k]=(S.mk.sent[k]||0)+v; }
function luxShock(f){ D.LUX.forEach(l=>{ if(l.kind==='car'||l.kind==='art') S.luxVal[l.id]*=1+f; }); }

