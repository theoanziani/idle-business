
/* ============================================================
   V2.7.7 : BANQUE · CONQUÊTE MONDIALE (étape 5)
   L'économie mondiale en 5 régions (PIB réels, ~100 000 Md€ par an). Votre part de marché par région (B.w.sh, en %)
   fait vivre quatre métiers : paiements IdlePay (2 % du PIB × part), gestion d'actifs (richesse = 4 × PIB, 50 % gérés
   × part, frais 1 %), services aux États (0,3 % du PIB × part) et la cryptomonnaie IdleCoin (palier 4).
   Paliers selon la part mondiale : 0, 5, 10, 20, 30 %. Plafond anticoncurrence : 35 % par région (45 % au palier 5).
   La part monte en investissant (coût par point qui grandit avec la part), en rachetant des banques locales
   (noms et logos inventés, dans le style de chaque pays) et un peu chaque jour avec la réputation.
   Risques : régulateur, cyberattaques, crises mondiales, nationalisations. Tout l'état est dans S.bank.w (défauts lus).
   ============================================================ */
const WREG=[
  {k:'eur',n:'Europe',c:'#A78BFA',rgb:'167,139,250',gdp:24000,lat:50,lon:14,hub:[50.1,8.7],tier:1},
  {k:'nam',n:'Amérique du Nord',c:'#2FC6C6',rgb:'47,198,198',gdp:30000,lat:42,lon:-98,hub:[40.7,-74],tier:1},
  {k:'asi',n:'Asie-Pacifique',c:'#F2C14E',rgb:'242,193,78',gdp:34000,lat:22,lon:112,hub:[1.35,103.8],tier:2},
  {k:'lat',n:'Amérique latine',c:'#3DDC97',rgb:'61,220,151',gdp:6500,lat:-14,lon:-58,hub:[-23.5,-46.6],tier:3},
  {k:'afr',n:'Afrique et Moyen-Orient',c:'#E86CA8',rgb:'232,108,168',gdp:5500,lat:8,lon:24,hub:[25.2,55.3],tier:4}];
const WTIERS=[['Entrée dans le monde',0,'Europe et Amérique du Nord · paiements IdlePay · investir'],['Banque multinationale',5,'Asie-Pacifique · gestion d’actifs · rachats de banques'],
  ['Partenaire des États',10,'Amérique latine · services aux États et banques centrales'],['Pilier financier mondial',20,'Afrique et Moyen-Orient · cryptomonnaie IdleCoin'],['Banque systémique',30,'Plafond anticoncurrence porté à 45 % · crises deux fois plus rares']];
const WGDP=WREG.reduce((a,r)=>a+r.gdp,0);
/* banques à racheter : [id, nom, pays, région, points gagnés, difficulté, logo] ; noms et logos inventés */
const WBANKS=[
  ['rho','Banque Rhodanienne','France','eur',3,'easy'],
  ['han','Hanseatische Kreditbank','Allemagne','eur',3,'reg'],
  ['ibe','Banco Ibérico Atlántico','Espagne','eur',2,'easy'],
  ['fct','First Continental Trust','États-Unis','nam',4,'comp'],
  ['map','Maple Shield Bank','Canada','nam',2,'easy'],
  ['pcb','Pacific Crown Bank','Singapour','asi',5,'comp'],
  ['lot','Golden Lotus Commercial Bank','Chine','asi',6,'reg'],
  ['kae','Kaede Trust Bank','Japon','asi',4,'easy'],
  ['mer','Banco Meridional','Brésil','lat',4,'easy'],
  ['and','Banco Andino del Pacífico','Chili','lat',3,'pol'],
  ['gul','Gulf Pearl Bank','Émirats arabes unis','afr',4,'easy'],
  ['kil','Kilimanjaro Commercial Bank','Kenya','afr',2,'pol']];
/* logos des banques à racheter, 96×96 (inventés, dans le style de chaque pays) : fond émaillé en dégradé, cadre biseauté, emblème en relief */
const BLG=(id,inner,c1,c2,pat)=>'<svg viewBox="0 0 96 96" width="46" height="46" aria-hidden="true"><defs>'+
  '<radialGradient id="lb'+id+'" cx=".3" cy=".25" r="1"><stop offset="0" stop-color="'+c1+'"/><stop offset="1" stop-color="'+c2+'"/></radialGradient>'+
  '<linearGradient id="lg'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3C8"/><stop offset=".45" stop-color="#E2B24C"/><stop offset="1" stop-color="#8A5A12"/></linearGradient>'+
  '<linearGradient id="ls'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>'+
  '<filter id="le'+id+'"><feDropShadow dx="0" dy="1.6" stdDeviation="1.2" flood-color="#000" flood-opacity=".5"/></filter><clipPath id="lc'+id+'"><rect width="96" height="96" rx="22"/></clipPath></defs>'+
  '<g clip-path="url(#lc'+id+')"><rect width="96" height="96" fill="url(#lb'+id+')"/>'+(pat||'')+'<g filter="url(#le'+id+')">'+inner+'</g><rect width="96" height="48" fill="url(#ls'+id+')"/></g>'+
  '<rect x="1" y="1" width="94" height="94" rx="21" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2"/><rect x="5" y="5" width="86" height="86" rx="18" fill="none" stroke="#000" stroke-opacity=".25"/></svg>';
const bRing=(n,r,c,o)=>{ let s=''; for(let i=0;i<n;i++){ const a=i/n*2*Math.PI; s+='<circle cx="'+(48+r*Math.cos(a)).toFixed(1)+'" cy="'+(48+r*Math.sin(a)).toFixed(1)+'" r="1" fill="'+c+'" opacity="'+o+'"/>'; } return s; };
const bLines=(c,o,step,ang)=>{ let s='<g opacity="'+o+'" transform="rotate('+(ang||0)+' 48 48)">'; for(let y=-40;y<140;y+=step) s+='<line x1="-40" y1="'+y+'" x2="140" y2="'+y+'" stroke="'+c+'" stroke-width=".6"/>'; return s+'</g>'; };
const bWaves=(y0,n,c,o)=>{ let s=''; for(let j=0;j<n;j++){ const y=y0+j*5; s+='<path d="M0 '+y+' Q12 '+(y-3)+' 24 '+y+' T48 '+y+' T72 '+y+' T96 '+y+'" fill="none" stroke="'+c+'" stroke-opacity="'+o+'" stroke-width=".8"/>'; } return s; };
const bMaple='M48 14 L52 28 L58 24 L57 36 L68 30 L65 40 L74 42 L63 50 L66 56 L52 54 L50 70 H46 L44 54 L30 56 L33 50 L22 42 L31 40 L28 30 L39 36 L38 24 L44 28 Z';
const bMomiji='M48 16 L53 33 L67 22 L60 39 L79 38 L62 47 L75 58 L56 54 L58 72 L48 58 L38 72 L40 54 L21 58 L34 47 L17 38 L36 39 L29 22 L43 33 Z';
const BLOGOS={
 rho:BLG('rho','<circle cx="48" cy="44" r="27" fill="none" stroke="url(#lgrho)" stroke-width="4"/>'+bRing(36,32,'#E8C77A',.7)+'<circle cx="48" cy="30" r="5" fill="url(#lgrho)"/><path d="M18 50 Q30 40 42 50 T66 50 T80 46" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M18 60 Q30 50 42 60 T66 60 T80 56" fill="none" stroke="#9FD8B0" stroke-width="3.5" stroke-linecap="round"/>','#1D8A63','#06301F',bLines('#9FD8B0',.12,6,-20)),
 han:BLG('han','<circle cx="48" cy="48" r="34" fill="none" stroke="#C9D6E8" stroke-width="2.5"/>'+bRing(28,31,'#C9D6E8',.8)+'<path d="M26 58 H72 L64 70 H32 Z" fill="#E8EEF6"/><path d="M28 62 H68 M30 66 H66" stroke="#14284B" stroke-width="1" opacity=".5"/><path d="M48 20 V58" stroke="#E8EEF6" stroke-width="2.5"/><path d="M34 26 H62 Q64 40 62 54 H34 Q32 40 34 26Z" fill="#fff"/><path d="M34 33 H62 M34 47 H62" stroke="#C8102E" stroke-width="5"/><path d="M34 40 H62" stroke="#fff" stroke-width="2"/><path d="M48 18 L58 21 L48 24Z" fill="#C8102E"/>','#2A4B8A','#0A1530',bWaves(76,4,'#9FB7DA',.35)),
 ibe:BLG('ibe',[...Array(16)].map((_,i)=>{ const a=i/16*2*Math.PI; return '<path d="M'+(48+18*Math.cos(a)).toFixed(1)+' '+(40+18*Math.sin(a)).toFixed(1)+' L'+(48+27*Math.cos(a+.1)).toFixed(1)+' '+(40+27*Math.sin(a+.1)).toFixed(1)+' L'+(48+27*Math.cos(a-.1)).toFixed(1)+' '+(40+27*Math.sin(a-.1)).toFixed(1)+'Z" fill="#FFD66B" opacity=".9"/>'; }).join('')+'<circle cx="48" cy="40" r="15" fill="url(#lgibe)"/><circle cx="44" cy="36" r="5" fill="#fff" opacity=".35"/><path d="M0 60 Q12 54 24 60 T48 60 T72 60 T96 60 V96 H0Z" fill="#1B5FA8"/><path d="M0 68 Q12 62 24 68 T48 68 T72 68 T96 68 V96 H0Z" fill="#2C7FCF"/><path d="M0 76 Q12 70 24 76 T48 76 T72 76 T96 76 V96 H0Z" fill="#5AA9F0"/>','#F07A2E','#8E2A0A'),
 fct:BLG('fct','<path d="M18 34 L48 16 L78 34Z" fill="url(#lgfct)"/><path d="M24 32 L48 20 L72 32Z" fill="#0B2545"/><path d="M48 22 l1.6 4.6 h4.8 l-3.9 2.8 1.5 4.6 -4-2.9 -4 2.9 1.5-4.6 -3.9-2.8 h4.8Z" fill="#fff"/><rect x="20" y="36" width="56" height="5" fill="#E8EEF6"/>'+[26,38,52,64].map(x=>'<rect x="'+x+'" y="42" width="7" height="26" fill="#fff"/><path d="M'+(x+2.3)+' 43 V67 M'+(x+4.7)+' 43 V67" stroke="#9FB0C8" stroke-width=".8"/>').join('')+'<rect x="18" y="68" width="60" height="5" fill="#E8EEF6"/><rect x="14" y="73" width="68" height="5" fill="#C9D6E8"/><path d="M14 84 H82" stroke="#C8102E" stroke-width="2.5"/><path d="M14 88 H82" stroke="#fff" stroke-width="1.5" opacity=".6"/>','#1F4E8A','#06142B'),
 map:BLG('map','<path d="M48 12 L78 20 V46 C78 64 64 76 48 84 C32 76 18 64 18 46 V20 Z" fill="#fff"/><path d="M48 16 L74 23 V46 C74 61 62 72 48 79 C34 72 22 61 22 46 V23 Z" fill="none" stroke="#C8102E" stroke-width="1.5"/><path d="'+bMaple+'" fill="#D7262E" transform="translate(0,4) scale(1)"/><path d="M48 58 V74" stroke="#D7262E" stroke-width="2.5"/>','#7A1420','#2A0509',bLines('#fff',.06,5,45)),
 pcb:BLG('pcb','<path d="M20 50 L24 26 L34 40 L41 20 L48 36 L55 20 L62 40 L72 26 L76 50 Z" fill="url(#lgpcb)" stroke="#6E4E12" stroke-width="1"/>'+[[24,24],[41,18],[55,18],[72,24],[48,34]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3" fill="#fff"/><circle cx="'+(x-1)+'" cy="'+(y-1)+'" r="1" fill="#fff" opacity=".9"/>').join('')+'<rect x="20" y="50" width="56" height="8" rx="2" fill="url(#lgpcb)"/>'+[30,42,54,66].map((x,i)=>'<circle cx="'+x+'" cy="54" r="2.2" fill="'+['#C8102E','#1E88E5','#C8102E','#1E88E5'][i]+'"/>').join('')+'<path d="M12 70 Q24 64 36 70 T60 70 T84 70" fill="none" stroke="#7FD0FF" stroke-width="3.5" stroke-linecap="round"/><path d="M12 79 Q24 73 36 79 T60 79 T84 79" fill="none" stroke="#3FA9F5" stroke-width="2.5" stroke-linecap="round"/>','#9C1B30','#3A050E'),
 lot:BLG('lot','<path d="M48 20 C56 32 56 46 48 58 C40 46 40 32 48 20Z" fill="url(#lglot)"/><path d="M48 58 C36 56 28 46 26 36 C36 38 44 46 48 58Z M48 58 C60 56 68 46 70 36 C60 38 52 46 48 58Z" fill="#F7B733"/><path d="M48 58 C40 60 30 58 20 50 C32 48 42 52 48 58Z M48 58 C56 60 66 58 76 50 C64 48 54 52 48 58Z" fill="#E8962A"/><path d="M48 24 V54 M36 42 L46 56 M60 42 L50 56" stroke="#8A5A12" stroke-width=".8" opacity=".6"/><path d="M22 66 H74" stroke="url(#lglot)" stroke-width="2.5"/><path d="M28 72 H68 M34 78 H62" stroke="#FFD66B" stroke-width="1.2" opacity=".7"/>'+bRing(40,40,'#FFD66B',.25),'#D41E2C','#4A0308'),
 kae:BLG('kae','<circle cx="48" cy="48" r="30" fill="#fff"/><circle cx="48" cy="48" r="30" fill="none" stroke="#C8102E" stroke-width="2"/><circle cx="48" cy="48" r="26" fill="none" stroke="#C8102E" stroke-width=".8" opacity=".5"/>'+[[-112,15],[-75,20],[-38,24],[0,27],[38,24],[75,20],[112,15]].map(([a,L])=>'<path d="M48 50 C'+(48-L*.42)+' '+(50-L*.45)+' '+(48-L*.3)+' '+(50-L*.85)+' 48 '+(50-L)+' C'+(48+L*.3)+' '+(50-L*.85)+' '+(48+L*.42)+' '+(50-L*.45)+' 48 50Z" fill="#C8102E" transform="rotate('+a+' 48 50)"/>').join('')+'<circle cx="48" cy="50" r="2.4" fill="#C8102E"/><path d="M48 52 Q50 62 54 70" fill="none" stroke="#C8102E" stroke-width="2" stroke-linecap="round"/>',
   '#2B2B33','#0A0A0E',[...Array(5)].map((_,j)=>[...Array(6)].map((__,i)=>'<path d="M'+(i*20-10+(j%2)*10)+' '+(j*14+80)+' a10 10 0 0 1 20 0" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1"/>').join('')).join('')),
 mer:BLG('mer',[...Array(5)].map((_,i)=>'<ellipse cx="48" cy="30" rx="9" ry="16" fill="url(#lgmer)" transform="rotate('+(i*72)+' 48 46)"/>').join('')+[...Array(5)].map((_,i)=>'<path d="M48 46 L48 34" stroke="#8A5A12" stroke-width=".9" opacity=".7" transform="rotate('+(i*72)+' 48 46)"/>').join('')+'<circle cx="48" cy="46" r="6" fill="#7A3E0A"/>'+[...Array(8)].map((_,i)=>'<circle cx="'+(48+4*Math.cos(i*.8)).toFixed(1)+'" cy="'+(46+4*Math.sin(i*.8)).toFixed(1)+'" r="1" fill="#FFD66B"/>').join('')+'<path d="M48 70 V88" stroke="#5A3A14" stroke-width="3"/>','#1EA45A','#05391B',bLines('#BFF2D0',.1,7,30)),
 and:BLG('and','<path d="M6 78 L28 46 L38 58 L52 34 L72 62 L80 54 L92 78Z" fill="#E8EEF6"/><path d="M47 42 L52 34 L57 42 L52 40Z M24 52 L28 46 L32 52Z" fill="#fff"/><path d="M6 78 H92" stroke="#7FB8E8" stroke-width="2"/><path d="M48 30 C40 22 26 20 14 24 C24 26 30 28 36 32 C30 32 24 34 20 38 C30 36 40 36 48 34 C56 36 66 36 76 38 C72 34 66 32 60 32 C66 28 72 26 82 24 C70 20 56 22 48 30Z" fill="#1B1B20"/><circle cx="48" cy="28" r="3.2" fill="#fff"/><path d="M48 31 l2 3 h-4z" fill="#F2C14E"/><path d="M76 14 l1.4 4 h4.2 l-3.4 2.5 1.3 4 -3.5-2.5 -3.5 2.5 1.3-4 -3.4-2.5 h4.2Z" fill="#fff"/>','#2E64A8','#08203F'),
 gul:BLG('gul',[...Array(9)].map((_,i)=>{ const a=Math.PI+i/8*Math.PI; return '<path d="M48 60 L'+(48+30*Math.cos(a)).toFixed(1)+' '+(60+30*Math.sin(a)).toFixed(1)+'" stroke="#E9D8A6" stroke-width="1.2" opacity=".85"/>'; }).join('')+'<path d="M18 60 A30 30 0 0 1 78 60 Z" fill="url(#lggul)" opacity=".35"/><path d="M18 60 A30 30 0 0 1 78 60" fill="none" stroke="url(#lggul)" stroke-width="3"/><path d="M20 62 Q48 80 76 62" fill="url(#lggul)"/><circle cx="48" cy="60" r="9" fill="#F4F1EA"/><circle cx="45" cy="57" r="3" fill="#fff"/><circle cx="48" cy="60" r="9" fill="none" stroke="#C9C2B2" stroke-width=".8"/>','#13615D','#03201F',bWaves(80,3,'#7FE3D8',.3)),
 kil:BLG('kil','<circle cx="60" cy="40" r="20" fill="#FFB547"/><circle cx="60" cy="40" r="26" fill="#FFB547" opacity=".25"/><path d="M0 64 L22 50 L34 56 L50 46 L70 58 L96 52 V96 H0Z" fill="#5A2A0E" opacity=".55"/><path d="M0 74 H96 V96 H0Z" fill="#3A1A08"/><path d="M30 74 V52" stroke="#1A0D05" stroke-width="3"/><path d="M14 52 Q30 40 46 52 Q30 46 14 52Z" fill="#1A0D05"/><path d="M18 48 Q30 38 42 48" fill="none" stroke="#1A0D05" stroke-width="4"/><path d="M30 60 L22 54 M30 58 L38 52" stroke="#1A0D05" stroke-width="2"/><path d="M70 74 l4-8 4 8 M76 74 l3-6 3 6" stroke="#1A0D05" stroke-width="2" fill="none"/>','#F26B1D','#7A1E05')};

WBANKS.forEach(b=>{ b[6]=BLOGOS[b[0]]; });
const WDIFF={easy:['Intégration facile','r1'],reg:['Régulateur méfiant','r2'],comp:['Concurrence forte','r2'],pol:['Instabilité politique','r2']};
/* ---------- état ---------- */
function W(){ const B=S.bank; if(!B.w) B.w={sh:{eur:4.5,nam:3.5,asi:0,lat:0,afr:0}, acq:[], cyb:S.day, cri:0, coin:{sup:0,px:1,res:.25,hist:[]}, rv:{}}; return B.w; }
const wOn = () => S.bank.lic&&bStg()>=5;
const wWorld = () => { const w=W(); return WREG.reduce((a,r)=>a+r.gdp*(w.sh[r.k]||0),0)/WGDP; };
const wTier = () => { const s=wWorld(); let t=0; WTIERS.forEach((x,i)=>{ if(s>=x[1]) t=i; }); return t+1; };
const wOpen = r => wTier()>=r.tier;
const wCap = r => (wTier()>=5?45:35)+(S.country&&r.k==='eur'&&['france','croatie','espagne'].includes(S.country.id)?5:0)+(S.country&&r.k==='nam'&&S.country.id==='usa'?5:0)+(S.country&&r.k==='lat'&&S.country.id==='bresil'?5:0)+(S.country&&r.k==='asi'&&S.country.id==='chine'?5:0);
const wPtCost = r => r.gdp*1e9*.00025*(1+(W().sh[r.k]||0)/10);
const wBankPrice = b => { const r=WREG.find(x=>x.k===b[3]); return Math.round(b[4]*r.gdp*1e9*.00025*.75*(1+(W().sh[r.k]||0)/12)/1e8)*1e8; };
/* ---------- revenus du jour ---------- */
function wRev(){ const w=W(), t=wTier(), M=S.macro, cri=w.cri>S.day? .6 : 1, o={pay:0,aum:0,sta:0,coin:0};
  WREG.forEach(r=>{ if(!wOpen(r)) return; const s=(w.sh[r.k]||0)/100, g=r.gdp*1e9*(.85+.15*M.econ)*cri;
    o.pay+=g*s*.005/360; if(t>=2) o.aum+=g*s*.005/360; if(t>=3) o.sta+=g*s*.00075/360; });
  if(t>=4) o.coin=w.coin.sup*1e9*w.coin.px*.00015*cri; return o; }
/* ---------- actions ---------- */
function wInvest(k){ if(!wOn()) return err('Étape mondiale requise.'); const r=WREG.find(x=>x.k===k), w=W(); if(!wOpen(r)) return err('Région débloquée au palier '+r.tier+'.');
  if((w.sh[k]||0)+1>wCap(r)) return err('Plafond anticoncurrence atteint dans cette région ('+wCap(r)+' %).'); const c=wPtCost(r); if(S.cash<c) return err('Trésorerie insuffisante : '+eur(c,0)+'.');
  payCap('bank','Expansion : '+r.n,-c); w.sh[k]=(w.sh[k]||0)+1; return ok(); }
function wBuy(id){ const b=WBANKS.find(x=>x[0]===id), w=W(); if(!b||w.acq.includes(id)) return err('Banque indisponible.'); const r=WREG.find(x=>x.k===b[3]);
  if(wTier()<2) return err('Rachats possibles au palier 2.'); if(!wOpen(r)) return err('Région débloquée au palier '+r.tier+'.');
  const gain=b[4]*(b[5]==='comp'?.7:1); if((w.sh[r.k]||0)+gain>wCap(r)) return err('Le régulateur bloque ce rachat : plafond de '+wCap(r)+' % dans la région.');
  const p=wBankPrice(b)*(b[5]==='reg'?1.05:1); if(S.cash<p) return err('Trésorerie insuffisante : '+eur(p,0)+'.');
  payCap('bank','Rachat de '+b[1],-p); w.acq.push(id); w.sh[r.k]=(w.sh[r.k]||0)+gain; log('good','Rachat de '+b[1]+' ('+b[2]+') : part de marché +'+fmtN(gain,1)+' point'+(gain>=2?'s':'')+' en '+r.n+'.'); return ok(); }
function wCoin(a){ const w=W(), C=w.coin; if(wTier()<4) return err('IdleCoin se débloque au palier 4.');
  const T=wCoinTarget();
  const x=Math.max(1,T*.1);
  if(a==='emit'){ const c=x*1e9*C.px*C.res; if(S.cash<c) return err('Trésorerie insuffisante : la réserve demande '+eur(c,0)+'.'); C.sup+=x; payCap('bank','Réserve d’IdleCoin',-c); }
  else if(a==='buy'){ const y=Math.min(C.sup,x); C.sup-=y; payCap('bank','Rachat d’IdleCoin : réserve libérée',y*1e9*C.px*C.res); }
  else { const n2= C.res>=.5? .1 : C.res>=.25? .5 : .25, d=C.sup*1e9*C.px*(n2-C.res); if(d>0&&S.cash<d) return err('Trésorerie insuffisante.'); payCap('bank','Ajustement de la réserve d’IdleCoin',-d); C.res=n2; }
  return ok(); }
const wCoinTarget = () => WREG.reduce((a,r)=>a+(wOpen(r)?r.gdp*(W().sh[r.k]||0)/100*.02:0),0); /* en Md d'IdleCoin */
function rvW(k,v){ const w=W(); w.rvd=w.rvd||{}; w.rvd[k]=(w.rvd[k]||0)+v; }
ACT.winv=el=>after(wInvest(el.dataset.v)); ACT.wbuy=el=>after(wBuy(el.dataset.v)); ACT.wcoin=el=>after(wCoin(el.dataset.v));
ACT.wreg=el=>{ ui.wr= ui.wr===el.dataset.v? null : el.dataset.v; render(); }; ACT.bkw=el=>{ ui.bkw=el.dataset.v; render(); };
/* ---------- chaque jour ---------- */
{ const _bs=bankStep; bankStep=function(){ _bs(); if(!wOn()) return; const w=W(), t=wTier(), C=w.coin; w.rvd=w.rvd||{};
  const o=wRev(); Object.keys(o).forEach(k=>{ if(o[k]){ pay('bank',{pay:'Paiements IdlePay',aum:'Gestion d’actifs mondiale',sta:'Services aux États',coin:'Frais IdleCoin'}[k],o[k],'corp'); rvW(k,o[k]); } });
  /* croissance naturelle avec la réputation */
  WREG.forEach(r=>{ if(!wOpen(r)) return; const s=w.sh[r.k]||0; if(s<wCap(r)) w.sh[r.k]=Math.min(wCap(r),s+.004*(S.bank.rep/60)*(r.tier===4&&s<.5?3:1)); if(s>wCap(r)){ const fine=wPtCost(r)*.5; pay('bank','Amende anticoncurrence : '+r.n,-fine,'corp'); w.sh[r.k]=wCap(r); log('crit','Le régulateur impose une cession en '+r.n+' et une amende de '+eur(fine,0)+'.'); } });
  if(t>=4&&C.sup>0){ const T=wCoinTarget(), over=T>0? C.sup/T-1 : 1, vol=.01+.05*(1-C.res); C.px=Math.max(.05,C.px*Math.exp(.0006-.01*Math.max(0,over)+vol*norm()*.3)); C.hist.push(Math.round(C.px*1000)/1000); if(C.hist.length>90) C.hist.shift();
    if(C.res<.2&&rnd()<.002){ C.px*=.4; WREG.forEach(r=>{ w.sh[r.k]=Math.max(0,(w.sh[r.k]||0)-.5); }); log('crit','Krach d’IdleCoin : le cours perd 60 %, la confiance recule dans toutes les régions.'); } }
  const tot=Object.values(o).reduce((a,v)=>a+v,0);
  if(rnd()<.002*(1+wWorld()/10)){ const c=tot*2; pay('bank','Cyberattaque contre IdlePay',-c,'corp'); S.bank.rep=Math.max(0,S.bank.rep-2); w.cyb=S.day; log('crit','Cyberattaque contre vos systèmes : '+eur(c,0)+' de pertes et réputation en baisse.'); }
  if(w.cri<=S.day&&rnd()<.0008*(t>=5?.5:1)){ w.cri=S.day+60; log('crit','Crise financière mondiale : vos revenus mondiaux baissent de 40 % pendant 60 jours.'); }
  WREG.forEach(r=>{ const s=w.sh[r.k]||0; if(s>5&&(r.k==='afr'||r.k==='lat')&&rnd()<.0003){ const lost=s*.4, comp=lost*wPtCost(r)*.3; w.sh[r.k]=s-lost; payCap('bank','Indemnité de nationalisation : '+r.n,comp); log('crit','Nationalisation d’une partie de vos filiales en '+r.n+' : part de marché −'+fmtN(lost,1)+' point(s).'); } });
  const B2=S.bank; B2.rv=B2.rv||{}; B2.rv.net=(B2.rv.net||0)+tot/30; B2.rvN=(B2.rvN||0)+tot/30; w.rv=w.rv||{}; ['pay','aum','sta','coin'].forEach(k=>{ w.rv[k]=(w.rv[k]||0)*(29/30)+(w.rvd[k]||0)/30; }); w.rvd={}; }; }
/* ---------- écran ---------- */
function coinLogo(sz){ const u='icl', c=100; let k=''; for(let a=0;a<120;a++){ const t=a/120*2*Math.PI; k+='<line x1="'+(c+92*Math.cos(t)).toFixed(1)+'" y1="'+(c+92*Math.sin(t)).toFixed(1)+'" x2="'+(c+98*Math.cos(t)).toFixed(1)+'" y2="'+(c+98*Math.sin(t)).toFixed(1)+'" stroke="#6D28D9" stroke-width="1.4"/>'; }
  return '<svg viewBox="0 0 200 204" width="'+sz+'" height="'+sz+'" aria-label="IdleCoin" role="img"><defs><linearGradient id="'+u+'r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6D2FF"/><stop offset=".5" stop-color="#6D28D9"/><stop offset="1" stop-color="#E6D2FF"/></linearGradient><radialGradient id="'+u+'m" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#C9A7FF"/><stop offset=".55" stop-color="#7C3AED"/><stop offset="1" stop-color="#2E1065"/></radialGradient><linearGradient id="'+u+'t" x1="0" y1="0" x2="1" y2="1"><stop offset=".2" stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'+
    '<circle cx="100" cy="104" r="98" fill="#000" opacity=".35"/><circle cx="100" cy="100" r="98" fill="url(#'+u+'r)"/>'+k+'<circle cx="100" cy="100" r="86" fill="url(#'+u+'m)"/><circle cx="100" cy="100" r="86" fill="url(#'+u+'t)" opacity=".5"/><circle cx="100" cy="100" r="84" fill="none" stroke="#E6D2FF" stroke-width="1.2" opacity=".8"/><circle cx="100" cy="100" r="62" fill="none" stroke="#F3E8FF" stroke-width="1" opacity=".55"/>'+
    '<path id="'+u+'p" d="M100,100 m-73,0 a73,73 0 1,1 146,0 a73,73 0 1,1 -146,0" fill="none"/><text font-weight="900" font-size="10.5" letter-spacing="2.6" fill="#F3E8FF" opacity=".9" style="font-family:var(--f-body)"><textPath href="#'+u+'p">IDLECOIN · IDLE BANK · IDLECOIN · IDLE BANK · </textPath></text>'+
    '<g style="filter:drop-shadow(0 1.5px 1px rgba(0,0,0,.45))"><path d="M78 70 V130 M70 70 H86 M70 130 H86" stroke="#fff" stroke-width="9" stroke-linecap="round"/><path d="M134 80 A30 30 0 1 0 134 120" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>'+
    [[40,92,14],[40,108,10],[146,100,14]].map(([x,y,d])=>'<path d="M'+x+' '+y+' h'+d+'" stroke="#E6D2FF" stroke-width="2" opacity=".7"/><circle cx="'+(x+d)+'" cy="'+y+'" r="2.4" fill="#E6D2FF"/>').join('')+'</g></svg>'; }
function wGlobe(){ const w=W(), H=[48.86,2.35];
  const data={zones:WREG.filter(wOpen).map(r=>[r.lat,r.lon,.24+Math.min(.4,(w.sh[r.k]||0)/60),r.rgb,.35+Math.min(.5,(w.sh[r.k]||0)/50)]), pts:[[H[0],H[1],1]].concat(WREG.filter(wOpen).map(r=>[r.hub[0],r.hub[1],0])), routes:WREG.filter(wOpen).map(r=>({p:glbArc(H,r.hub,60).p,c:r.c,h:.12,n:2,sp:7}))};
  return glbHtml('wbank',data,{l:'Globe de votre banque mondiale'}); }
function vConquest(){ try{ nfCssOnce(); }catch(e){} const w=W(), t=wTier(), ws=wWorld(), rv=w.rv||{}, rvT=['pay','aum','sta','coin'].reduce((a,k)=>a+(rv[k]||0),0);
  let h='<section class="card wq-hero">'+wGlobe()+'<div class="wq-leg">'+WREG.map(r=>'<span class="'+(wOpen(r)?'':'off')+'"><i style="background:'+r.c+'"></i>'+r.n+' '+(wOpen(r)? fmtN(w.sh[r.k]||0,1)+' %' : '· palier '+r.tier)+'</span>').join('')+'</div>'+
    '<div class="emp-k"><div><div class="tag">Revenus mondiaux</div><b class="num pos">'+signed(rvT,0)+' / j</b></div><div><div class="tag">Part mondiale</div><b class="num">'+fmtN(ws,1)+' %</b></div><div><div class="tag">Clients</div><b class="num">'+fmtN(Math.round(ws*26),0)+' M</b></div></div></section>';
  h+=card('Paliers de la conquête',WTIERS.map((x,i)=>'<div class="wq-pa'+(i<t?' ok':'')+'"><i>'+(i<t?'✓':i+1)+'</i><div><b>'+x[0]+'</b><small>'+(i?x[1]+' % de part mondiale':'Étape mondiale atteinte')+'</small><span>'+x[2]+'</span></div></div>').join(''));
  h+=card('Régions','<div class="sub" style="margin-bottom:4px">Trait rouge : plafond anticoncurrence.</div>'+WREG.map(r=>{ const s=w.sh[r.k]||0, cap=wCap(r), on=wOpen(r), inc=wRevReg(r);
    return '<div class="wq-rg'+(on?'':' lock')+'"><div class="wq-rh"><span class="dot" style="background:'+r.c+'"></span><b>'+r.n+'</b><em>'+(on? signed(inc,0)+' / j' : 'palier '+r.tier)+'</em></div>'+
      '<div class="wq-sh"><div class="trk"><i style="width:'+Math.min(100,s/50*100).toFixed(1)+'%;background:'+r.c+'"></i><u style="left:'+(cap/50*100)+'%"></u></div><span>'+fmtN(s,1)+' %</span></div>'+
      '<div class="wq-rs"><span>PIB '+fmtN(r.gdp,0)+' Md€ / an</span>'+(on&&s>cap-4?'<span class="warn">Plafond proche</span>':'')+'</div>'+
      (on? '<div class="wq-ra">'+btn('Investir · +1 pt · '+eur(wPtCost(r),0),'winv',{c:'sm',v:r.k,dis:S.cash<wPtCost(r)||s+1>cap,why:s+1>cap?'Plafond anticoncurrence atteint.':'Trésorerie insuffisante.'})+(t>=2?btn(ui.wr===r.k?'Toutes les banques':'Banques à racheter','wreg',{c:'sm pri',v:r.k}):'')+'</div>' : '')+'</div>'; }).join(''));
  const L=[['pay','Paiements IdlePay','#C9A24A',1],['aum','Gestion d’actifs','#2FC6C6',2],['sta','Services aux États','#5B8CFF',3],['coin','IdleCoin','#B57BFF',4]], mx=Math.max(1,...L.map(x=>rv[x[0]]||0));
  h+=card('Métiers',L.map(([k,n,c,p])=>{ const lock=t<p, v=rv[k]||0; return '<div class="bs-rv'+(lock?' lock':'')+'"><span>'+n+'</span><div class="b"><i style="width:'+(lock?0:v/mx*100).toFixed(0)+'%;background:'+c+'"></i></div><b class="num">'+(lock?'palier '+p:signed(v,0))+'</b></div>'; }).join(''));
  const avail=WBANKS.filter(b=>!w.acq.includes(b[0])&&(!ui.wr||b[3]===ui.wr));
  h+=card('Rachats possibles'+(ui.wr?' · '+WREG.find(r=>r.k===ui.wr).n:''), t<2? '<div class="sub">Les rachats de banques se débloquent au palier 2 (5 % de part mondiale).</div>' : (avail.length? avail.map(b=>{ const r=WREG.find(x=>x.k===b[3]), p=wBankPrice(b)*(b[5]==='reg'?1.05:1), d=WDIFF[b[5]], on=wOpen(r);
    return '<div class="wq-aq"><div class="wq-al">'+b[6]+'</div><div class="wq-ad"><b>'+esc(b[1])+'</b><small>'+b[2]+' · '+r.n+'</small><div class="wq-tags"><span>+'+b[4]+' pt'+(b[4]>1?'s':'')+' de part</span><span class="'+d[1]+'">'+d[0]+'</span></div></div><div class="wq-ap"><b class="num">'+eur(p,0)+'</b>'+btn(on?'Racheter':'Palier '+r.tier,'wbuy',{c:'sm pri',v:b[0],dis:!on||S.cash<p,why:!on?'Région pas encore ouverte.':'Trésorerie insuffisante.'})+'</div></div>'; }).join('') : '<div class="sub">Toutes les banques disponibles ont été rachetées.</div>')+(w.acq.length?'<div class="sub" style="margin-top:6px">Déjà rachetées : '+w.acq.map(id=>esc(WBANKS.find(b=>b[0]===id)[1])).join(', ')+'.</div>':''));
  const C=w.coin;
  if(t<4) h+='<section class="card wq-lock"><div class="ch-row"><b>IdleCoin</b><span class="sub">cryptomonnaie de votre banque</span></div><div class="wq-coin"><div style="filter:grayscale(1) brightness(.6)">'+coinLogo(64)+'</div><div><b>Verrouillée</b><div class="sub">Se débloque au palier 4 « Pilier financier mondial », à 20 % de part mondiale. Votre part : '+fmtN(ws,1)+' %.</div></div></div>'+bar(Math.min(1,ws/20),'a')+'</section>';
  else { const sp=C.hist.length>1? (()=>{ const a=C.hist, mn=Math.min(...a), mxx=Math.max(...a), k=mxx-mn||1; return '<svg viewBox="0 0 300 50" width="100%" preserveAspectRatio="none" style="margin-top:8px"><polyline points="'+a.map((v,i)=>(i/(a.length-1)*300).toFixed(1)+','+(46-(v-mn)/k*42).toFixed(1)).join(' ')+'" fill="none" stroke="#B57BFF" stroke-width="2"/></svg>'; })() : '';
    const T=wCoinTarget(), m30=C.hist.length>30? C.px/C.hist[C.hist.length-31]-1 : 0;
    h+=card('IdleCoin','<div class="wq-coin">'+coinLogo(64)+'<div><b class="num" style="font-size:20px">'+fmtN(C.px,2)+' €</b> <span class="'+(m30>=0?'pos':'neg')+'" style="font-weight:900">'+(m30>=0?'▲ ':'▼ ')+pct(Math.abs(m30),0)+' / mois</span><div class="sub">'+fmtN(C.sup,1)+' Md d’IdleCoin en circulation · demande '+fmtN(T,1)+' Md · réserve '+pct(C.res,0)+'</div></div></div>'+sp+
      '<div class="sub" style="margin:8px 0">Chaque IdleCoin en circulation rapporte des frais. Émettre demande de placer la réserve en trésorerie ; au-delà de la demande, le cours baisse. Une réserve sous 20 % expose à un krach.</div><div class="wq-ra">'+btn('Émettre '+fmtN(Math.max(1,T*.1),1)+' Md','wcoin',{c:'sm pri',v:'emit'})+btn('Racheter','wcoin',{c:'sm',v:'buy',dis:C.sup<=0})+btn('Réserve '+pct(C.res,0),'wcoin',{c:'sm',v:'res'})+'</div>'); }
  const regMax=Math.max(...WREG.filter(wOpen).map(r=>(w.sh[r.k]||0)/wCap(r))), cybD=S.day-(w.cyb||S.day);
  const G=(t1,s,v,c)=>'<div class="wq-rk"><div><b>'+t1+'</b><small>'+s+'</small></div><div class="ga"><i style="width:'+Math.round(v*100)+'%;background:'+c+'"></i></div></div>';
  const top=WREG.filter(wOpen).sort((a,b)=>(w.sh[b.k]||0)/wCap(b)-(w.sh[a.k]||0)/wCap(a))[0];
  h+=card('Risques',G('Régulateur anticoncurrence',top? top.n+' à '+fmtN(w.sh[top.k]||0,1)+' % sur '+wCap(top)+' %' : '—',regMax,regMax>.85?'#F2A93B':'#3DDC97')+
    G('Cybersécurité',cybD? 'Dernière attaque il y a '+plu(cybD,'jour') : 'Aucune attaque',Math.min(1,.2+wWorld()/40),'#F2C14E')+
    G('Crise financière mondiale',w.cri>S.day? 'Crise en cours jusqu’au '+dateS(w.cri) : (t>=5?'Risque réduit (banque systémique)':'Économie calme'),w.cri>S.day?.9:(t>=5?.12:.22),w.cri>S.day?'#FF6B5C':'#3DDC97')+
    G('Nationalisation','Amérique latine et Afrique au-delà de 5 % de part',Math.min(1,((w.sh.lat||0)+(w.sh.afr||0))/40),'#F2C14E'));
  return h; }
function wRevReg(r){ const w=W(), t=wTier(), s=(w.sh[r.k]||0)/100, g=r.gdp*1e9*(.85+.15*S.macro.econ)*(w.cri>S.day?.6:1); return g*s*.005/360+(t>=2?g*s*.005/360:0)+(t>=3?g*s*.00075/360:0); }
{ const _bo=bkOwn; bkOwn=function(){ if(!wOn()) return _bo(); const tab=ui.bkw||'world';
  return '<div class="seg wq-seg">'+[['world','Conquête mondiale'],['mgmt','Gestion']].map(([v,t1])=>'<button class="'+(tab===v?'on':'')+'" data-a="bkw" data-v="'+v+'">'+t1+'</button>').join('')+'</div>'+(tab==='world'? vConquest() : _bo()); }; }
{ const _r=render; render=function(){ const x=_r.apply(this,arguments); try{ glbMountAll(); }catch(e){} return x; }; }
NF_CSS.push(`
.wq-seg{display:flex;margin-bottom:12px}.wq-seg button{flex:1}
.wq-hero{padding:10px}.wq-leg{display:flex;flex-wrap:wrap;gap:6px 12px;margin:10px 4px;font:700 11.5px var(--f-body);color:var(--ink-2)}.wq-leg i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px}.wq-leg .off{opacity:.45}
.wq-pa{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--line)}.wq-pa:last-child{border:0}.wq-pa i{flex:0 0 28px;height:28px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-style:normal;font-weight:900;font-size:12px;color:var(--ink-3)}.wq-pa.ok i{border-color:var(--green);color:var(--green);background:var(--green-soft)}
.wq-pa b{font-size:14px}.wq-pa small{display:block;color:#C9971F;font-weight:800;font-size:11.5px}.wq-pa span{display:block;color:var(--ink-2);font-size:12px;font-weight:600;margin-top:2px}
.wq-rg{padding:11px 0;border-bottom:1px solid var(--line)}.wq-rg:last-child{border:0}.wq-rg.lock{opacity:.5}.wq-rh{display:flex;align-items:center;gap:8px}.wq-rh b{flex:1;font-size:14.5px}.wq-rh em{font-style:normal;color:var(--green);font-weight:900;font-size:14px}.wq-rh .dot{width:10px;height:10px;border-radius:50%}
.wq-sh{display:flex;align-items:center;gap:10px;margin:8px 0 4px}.wq-sh span{font-weight:900;font-size:14px;width:48px;text-align:right}.wq-sh .trk{flex:1;height:10px;border-radius:6px;background:var(--paper-2);position:relative}.wq-sh .trk i{display:block;height:100%;border-radius:6px}.wq-sh .trk u{position:absolute;top:-4px;bottom:-4px;width:2px;background:#FF6B5C}
.wq-rs{display:flex;justify-content:space-between;font-size:11.5px;color:var(--ink-3);font-weight:700}.wq-rs .warn{color:#FF8A5C}.wq-ra{display:flex;gap:8px;margin-top:9px;flex-wrap:wrap}.wq-ra .btn{flex:1;min-height:44px}
.wq-aq{display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}.wq-aq:last-of-type{border:0}.wq-al{flex:0 0 46px}.wq-al svg{display:block;border-radius:12px}.wq-ad{flex:1;min-width:0}.wq-ad b{font-size:14px}.wq-ad small{display:block;color:var(--ink-3);font-size:11.5px;font-weight:600}
.wq-tags{display:flex;gap:5px;margin-top:5px;flex-wrap:wrap}.wq-tags span{font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:8px;background:var(--green-soft);color:var(--green)}.wq-tags .r2{background:rgba(242,169,59,.16);color:#D9861A}.wq-tags .r1{background:rgba(91,140,255,.14);color:#5B8CFF}
.wq-ap{text-align:right;flex:0 0 auto}.wq-ap b{display:block;font-size:14px;margin-bottom:5px}
.wq-coin{display:flex;gap:12px;align-items:center}.wq-lock{opacity:.9}
.wq-rk{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)}.wq-rk:last-child{border:0}.wq-rk b{font-size:13.5px}.wq-rk small{display:block;color:var(--ink-3);font-size:11.5px;font-weight:600}.wq-rk .ga{width:90px;height:8px;border-radius:5px;background:var(--paper-2);overflow:hidden;flex:0 0 auto}.wq-rk .ga i{display:block;height:100%}`);
