/* ============================================================
   V2.5.9 : ILLUSTRATIONS DU LUXE DÉTAILLÉES, VILLES ET PAYS UTILES
   Illustrations : scènes complètes dessinées en SVG (voitures fictives avec carrosserie, vitres,
   jantes et décor ; œuvres dans une salle de musée ; propriétés, yachts et monuments dans leur paysage).
   Villes possédées : loyers des locataires à 10 % par an de la valeur (avant 3,5 %), vos sociétés de la
   ville vendent 5 % de plus, prestige +1 point par 100 M€ du prix d'achat.
   Pays gouverné : vos sociétés du pays ne paient plus l'impôt sur les sociétés sur leurs bénéfices,
   vendent encore 5 % de plus, prestige +1 point par 100 M€ du prix du pays.
   Aucun nouveau champ sauvegardé : tout est recalculé.
   ============================================================ */
const PXK={}; let PXN=0;
function pxR(seed){ let x=(seed>>>0)||1; return ()=>{ x^=x<<13; x>>>=0; x^=x>>17; x^=x<<5; x>>>=0; return x/4294967296; }; }
const pxLG=(id,st,x2,y2)=>'<linearGradient id="'+id+'" x1="0" y1="0" x2="'+(x2===undefined?0:x2)+'" y2="'+(y2===undefined?1:y2)+'">'+st.map(([o,c,a])=>'<stop offset="'+o+'" stop-color="'+c+'"'+(a!==undefined?' stop-opacity="'+a+'"':'')+'/>').join('')+'</linearGradient>';
const pxRG=(id,st,cx,cy,r)=>'<radialGradient id="'+id+'" cx="'+(cx===undefined?.5:cx)+'" cy="'+(cy===undefined?.5:cy)+'" r="'+(r===undefined?.5:r)+'">'+st.map(([o,c,a])=>'<stop offset="'+o+'" stop-color="'+c+'"'+(a!==undefined?' stop-opacity="'+a+'"':'')+'/>').join('')+'</radialGradient>';
function pxShade(hex,k){ const n=parseInt(hex.slice(1),16); let r=n>>16, g=(n>>8)&255, b=n&255; const f=v=>Math.round(k<0? v*(1+k) : v+(255-v)*k); return '#'+[f(r),f(g),f(b)].map(v=>Math.max(0,Math.min(255,v)).toString(16).padStart(2,'0')).join(''); }
/* ---------- voitures ---------- */
const PX_CARS={
  p911:{c:'#8FA9C4', bg:'alp', w:[126,276], r:19, rim:'five',
    body:'M80 142 L82 124 Q88 113 118 109 L168 104 Q190 83 224 79 Q264 77 288 96 Q310 105 318 118 L322 134 Q322 142 310 143 L80 143 Z',
    win:'M180 104 Q198 88 224 85 Q250 84 268 98 L272 104 Z', pil:[[228,86,226,104]], lamp:[84,118,12,7], tail:[308,112,12,6]},
  rr:{c:'#2B2530', bg:'city', w:[104,300], r:21, rim:'multi',
    body:'M58 143 L58 118 Q60 106 78 104 L118 102 L148 78 L272 76 L302 102 L336 106 Q348 108 348 122 L348 143 Z',
    win:'M154 82 L268 80 L294 102 L132 102 Z', pil:[[196,80,196,102],[240,79,240,102]], lamp:[60,108,10,8], tail:[338,110,10,9], grille:1},
  lamb:{c:'#F2B705', bg:'desert', w:[122,290], r:19, rim:'blade',
    body:'M66 140 L68 128 L108 118 L188 92 Q210 86 240 88 L292 100 L332 112 L336 130 L330 141 L66 141 Z',
    win:'M194 94 L238 90 L270 101 L196 106 Z', pil:[[236,91,240,104]], lamp:[70,121,22,4], tail:[318,112,16,4], intake:1},
  db5:{c:'#A7B3AA', bg:'country', w:[118,290], r:20, rim:'wire',
    body:'M66 143 L68 121 Q76 112 108 110 L160 108 Q176 88 210 85 L252 85 Q274 87 290 106 L326 110 Q340 114 340 127 L338 143 Z',
    win:'M168 108 Q182 91 210 89 L250 89 Q268 91 282 106 Z', pil:[[230,89,230,107]], lamp:[70,114,9,9,'round'], tail:[330,114,8,7], chrome:1},
  chiron:{c:'#1F4E8A', c2:'#0E1220', bg:'night', w:[124,292], r:20, rim:'multi',
    body:'M70 140 L72 124 Q94 111 140 107 Q180 85 222 83 Q264 83 292 100 L330 110 Q342 116 340 130 L336 141 L70 141 Z',
    win:'M168 104 Q190 89 222 87 Q256 87 278 101 Z', pil:[[226,88,226,103]], lamp:[76,116,18,5], tail:[322,112,14,4], cline:1},
  gto:{c:'#C8202B', bg:'track', w:[116,286], r:19, rim:'wire',
    body:'M60 143 L62 124 Q66 111 108 107 L190 103 Q206 85 236 83 Q262 83 282 96 L318 110 Q334 116 332 130 L328 143 Z',
    win:'M198 103 Q212 88 236 87 Q258 87 274 99 Z', pil:[], lamp:[66,112,9,9,'round'], tail:[320,114,8,6], roundel:1}
};
function pxWheel(x,y,r,kind,u){ return '<g class="pxa-spin">'+pxWheel0(x,y,r,kind,u)+'</g>'; }
function pxWheel0(x,y,r,kind,u){ let s='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#15161a"/><circle cx="'+x+'" cy="'+y+'" r="'+(r-1.5)+'" fill="none" stroke="#2d2f36" stroke-width="2"/>'+
  '<circle cx="'+x+'" cy="'+y+'" r="'+(r*.66)+'" fill="url(#'+u+'rim)"/>'; const rr=r*.62;
  if(kind==='wire'){ for(let i=0;i<24;i++){ const a=i*Math.PI/12; s+='<line x1="'+x+'" y1="'+y+'" x2="'+(x+Math.cos(a)*rr).toFixed(1)+'" y2="'+(y+Math.sin(a)*rr).toFixed(1)+'" stroke="#e9edf2" stroke-width=".7"/>'; } s+='<circle cx="'+x+'" cy="'+y+'" r="'+(r*.2)+'" fill="#d8dde3" stroke="#8b929b"/>'; }
  else { const n= kind==='five'?5 : kind==='blade'?6 : 10; for(let i=0;i<n;i++){ const a=i*2*Math.PI/n-.3; s+='<path d="M'+x+' '+y+' L'+(x+Math.cos(a-.16)*rr).toFixed(1)+' '+(y+Math.sin(a-.16)*rr).toFixed(1)+' L'+(x+Math.cos(a+(kind==='blade'?.32:.16))*rr).toFixed(1)+' '+(y+Math.sin(a+(kind==='blade'?.32:.16))*rr).toFixed(1)+' Z" fill="#3a3f47" opacity=".75"/>'; }
    s+='<rect x="'+(x-r*.42)+'" y="'+(y-r*.18)+'" width="'+(r*.2)+'" height="'+(r*.36)+'" rx="2" fill="#C8202B"/><circle cx="'+x+'" cy="'+y+'" r="'+(r*.16)+'" fill="#9aa1ab" stroke="#5c636d"/>'; }
  return s; }
function pxBack(kind,u){ const W=400;
  if(kind==='alp') return pxLGd(u,'sk',[[0,'#7FB6E8'],[1,'#E6F2FB']])+'<path d="M0 98 L50 60 L92 84 L140 40 L196 88 L240 52 L300 92 L350 58 L400 86 L400 150 L0 150Z" fill="#9DB1C7"/><path d="M140 40 L156 54 L148 54 L160 64 L128 58Z M240 52 L254 64 L232 62Z M350 58 L362 68 L342 68Z" fill="#fff"/><path d="M0 118 Q80 100 160 112 T320 106 T400 112 L400 150 L0 150Z" fill="#6E9A62"/>'+pxTrees(16,[10,390],120,u)+pxRoad(u);
  if(kind==='city') return pxLGd(u,'sk',[[0,'#C9D6E6'],[1,'#F2F0EA']])+'<rect x="0" y="34" width="400" height="116" fill="#E7DCC8"/>'+[0,1,2,3,4,5,6].map(i=>'<rect x="'+(14+i*56)+'" y="46" width="28" height="40" rx="2" fill="#8FA6BF"/><rect x="'+(14+i*56)+'" y="46" width="28" height="6" fill="#6E829A"/>').join('')+'<rect x="0" y="30" width="400" height="8" fill="#CDBFA6"/><rect x="0" y="94" width="400" height="6" fill="#CDBFA6"/>'+[0,1,2,3,4,5,6,7].map(i=>'<rect x="'+(i*52)+'" y="100" width="8" height="40" fill="#D9CBB2"/>').join('')+pxRoad(u,'#7d7f86');
  if(kind==='desert') return pxLGd(u,'sk',[[0,'#F08A4B'],[.55,'#F7C67A'],[1,'#FCE6B8']])+'<circle cx="300" cy="88" r="26" fill="#FFE7A3" opacity=".9" class="pxa-sun"/><path d="M0 104 L60 92 L80 80 L104 92 L170 96 L200 74 L220 74 L240 96 L400 100 L400 150 L0 150Z" fill="#B5643F" opacity=".8"/><path d="M0 116 Q100 108 200 116 T400 114 L400 150 L0 150Z" fill="#D99A62"/>'+pxRoad(u,'#4e4a4a');
  if(kind==='country') return pxLGd(u,'sk',[[0,'#A9D0EE'],[1,'#F1F7FB']])+'<path d="M0 104 Q60 84 130 98 T260 92 T400 98 L400 150 L0 150Z" fill="#8DB86B"/><path d="M0 116 Q90 100 190 112 T400 110 L400 150 L0 150Z" fill="#6FA04E"/><rect x="292" y="72" width="44" height="30" fill="#EFE6D2"/><path d="M288 74 L314 56 L340 74Z" fill="#8A4B32"/><rect x="306" y="86" width="10" height="16" fill="#6B4A2B"/>'+pxTrees(10,[20,270],112,u)+pxRoad(u,'#6c6a66');
  if(kind==='night') return pxLGd(u,'sk',[[0,'#0B1026'],[1,'#2A2450']])+[...Array(14)].map((_,i)=>{ const x=i*29, h=40+((i*37)%50); return '<rect x="'+x+'" y="'+(120-h)+'" width="26" height="'+h+'" fill="#151a33"/>'+[...Array(Math.floor(h/9))].map((__,j)=>'<rect x="'+(x+4+(j%2)*10)+'" y="'+(124-h+j*9)+'" width="6" height="4" fill="'+((i+j)%3?'#F6D37A':'#4F5B8A')+'" opacity=".85"'+pxTw(i*7+j)+'/>').join(''); }).join('')+'<circle cx="340" cy="30" r="12" fill="#F4F1DE"/>'+pxRoad(u,'#262838');
  return pxLGd(u,'sk',[[0,'#9ED0F2'],[1,'#EAF6FD']])+'<rect x="0" y="80" width="400" height="34" fill="#E9E4DA"/>'+[...Array(20)].map((_,i)=>'<rect x="'+(i*20)+'" y="80" width="10" height="6" fill="'+(i%2?'#C8202B':'#fff')+'"/>').join('')+'<rect x="0" y="92" width="400" height="22" fill="#B9C1C9"/>'+[...Array(16)].map((_,i)=>'<circle cx="'+(12+i*25)+'" cy="100" r="5" fill="'+['#E9573F','#2E86DE','#F7C948','#21A179'][i%4]+'"/>').join('')+'<rect x="0" y="114" width="400" height="36" fill="#5a5d63"/>'+[...Array(10)].map((_,i)=>'<rect x="'+(i*40)+'" y="114" width="20" height="4" fill="'+(i%2?'#C8202B':'#fff')+'"/>').join('')+'<rect x="0" y="146" width="400" height="34" fill="#4c4f55"/>'; }
const pxLGd=(u,k,st)=>'<defs>'+pxLG(u+k,st)+'</defs><rect width="400" height="180" fill="url(#'+u+k+')"/>';
function pxRoad(u,c){ return '<rect x="0" y="140" width="400" height="40" fill="'+(c||'#5a5d63')+'"/><rect x="0" y="138" width="400" height="4" fill="#cfd3d8"/>'+'<g class="pxa-road">'+[...Array(11)].map((_,i)=>'<rect x="'+(i*44+6)+'" y="162" width="24" height="3" fill="#f2f2f2" opacity=".8"/>').join('')+'</g>'; }
function pxTrees(n,[a,b],y,u){ const R=pxR(n*97+y); let s=''; for(let i=0;i<n;i++){ const x=a+(b-a)*R(), h=14+R()*16; s+='<path d="M'+x.toFixed(1)+' '+(y-h).toFixed(1)+' L'+(x+6).toFixed(1)+' '+y+' L'+(x-6).toFixed(1)+' '+y+'Z" fill="'+(R()<.5?'#2F6B3A':'#3E7E45')+'"/>'; } return s; }
function pxCar(l){ const C=PX_CARS[l.id], u='pxc'+l.id; if(!C) return '';
  const c=C.c, d=pxShade(c,-.45), lt=pxShade(c,.35);
  let s='<defs>'+pxLG(u+'b',[[0,lt],[.45,c],[1,d]])+pxLG(u+'w',[[0,'#cfe3f5'],[.5,'#5d7894'],[1,'#22303f']],1,1)+pxRG(u+'rim',[[0,'#f4f6f9'],[.7,'#b9c0c9'],[1,'#7d858f']])+'<clipPath id="'+u+'cl"><path d="'+C.body+'"/></clipPath></defs>';
  s+=pxBack(C.bg,u);
  s+='<ellipse cx="'+((C.w[0]+C.w[1])/2)+'" cy="'+(143+C.r*.15)+'" rx="'+((C.w[1]-C.w[0])/2+60)+'" ry="7" fill="#000" opacity=".35"/>';
  s+='<g class="pxa-bob"><path d="'+C.body+'" fill="url(#'+u+'b)"/>';
  if(C.c2) s+='<g clip-path="url(#'+u+'cl)"><path d="M70 150 L70 104 L170 100 Q150 126 170 150Z" fill="'+C.c2+'" opacity=".9"/></g>';
  s+='<g clip-path="url(#'+u+'cl)"><rect x="0" y="'+(C.w[0]?118:118)+'" width="400" height="2.2" fill="#fff" opacity=".35"/><rect x="0" y="134" width="400" height="12" fill="#000" opacity=".22"/></g>';
  s+='<path d="'+C.win+'" fill="url(#'+u+'w)" stroke="'+pxShade(c,-.6)+'" stroke-width="1"/>'+(C.pil||[]).map(p=>'<line x1="'+p[0]+'" y1="'+p[1]+'" x2="'+p[2]+'" y2="'+p[3]+'" stroke="'+pxShade(c,-.55)+'" stroke-width="3"/>').join('');
  s+='<path d="'+C.win+'" fill="#fff" opacity=".18" transform="translate(6 -1) scale(.96 1)"/>';
  const dx=(C.w[0]+C.w[1])/2; s+='<line x1="'+(dx-26)+'" y1="106" x2="'+(dx-30)+'" y2="136" stroke="'+pxShade(c,-.5)+'" stroke-width="1"/><line x1="'+(dx+28)+'" y1="106" x2="'+(dx+26)+'" y2="136" stroke="'+pxShade(c,-.5)+'" stroke-width="1"/><rect x="'+(dx+8)+'" y="114" width="12" height="2.5" rx="1" fill="'+pxShade(c,-.6)+'"/>';
  s+='<path d="M'+(dx-48)+' 103 l-9 -2 l1 6 z" fill="'+pxShade(c,-.3)+'"/>';
  const L=C.lamp; s+= L[4]==='round'? '<circle cx="'+(L[0]+L[2]/2)+'" cy="'+(L[1]+L[3]/2)+'" r="'+(L[2]/2+1)+'" fill="#FFF6D5" stroke="#c9ccd1" stroke-width="1.5"/>' : '<rect x="'+L[0]+'" y="'+L[1]+'" width="'+L[2]+'" height="'+L[3]+'" rx="2" fill="#FFF6D5" stroke="'+pxShade(c,-.5)+'" stroke-width=".8"/>';
  const T=C.tail; s+='<rect x="'+T[0]+'" y="'+T[1]+'" width="'+T[2]+'" height="'+T[3]+'" rx="2" fill="#D7262E"/>';
  if(C.grille) s+='<rect x="57" y="110" width="6" height="26" fill="#d9dde2" stroke="#8b929b" stroke-width=".8"/>'+[0,1,2,3,4].map(i=>'<line x1="58" y1="'+(113+i*5)+'" x2="62" y2="'+(113+i*5)+'" stroke="#8b929b" stroke-width=".6"/>').join('')+'<circle cx="60" cy="104" r="2.5" fill="#d9dde2"/>';
  if(C.chrome) s+='<rect x="62" y="134" width="18" height="4" rx="2" fill="#dfe3e8"/><rect x="326" y="134" width="16" height="4" rx="2" fill="#dfe3e8"/><line x1="100" y1="121" x2="320" y2="121" stroke="#e7ebef" stroke-width="1.2"/>';
  if(C.intake) s+='<path d="M250 112 L292 106 L296 124 L262 126Z" fill="#1d1d1f"/><path d="M256 114 L288 110 M258 118 L290 114 M260 122 L292 118" stroke="#444" stroke-width="1"/>';
  if(C.cline) s+='<path d="M240 90 Q206 112 230 138" fill="none" stroke="#d9dde2" stroke-width="3"/>';
  if(C.roundel) s+='<circle cx="190" cy="122" r="9" fill="#fff"/><text x="190" y="126" text-anchor="middle" font-size="11" font-weight="800" fill="#111" font-family="Nunito,sans-serif">62</text><rect x="96" y="104" width="28" height="3" rx="1.5" fill="#111"/>';
  s+='</g>'+pxWheel(C.w[0],143-C.r*.12,C.r,C.rim,u)+pxWheel(C.w[1],143-C.r*.12,C.r,C.rim,u);
  return s; }
/* ---------- art ---------- */
function pxPaint(l,x,y,w,h,u){ const R=pxR(pxHash(l.id)); let s='';
  if(l.id==='gravure'){ s+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#ECE1C6"/><defs><pattern id="'+u+'ht" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="3" stroke="#5a4630" stroke-width=".6"/></pattern><pattern id="'+u+'hx" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="3" stroke="#5a4630" stroke-width=".5"/></pattern></defs>';
    s+='<path d="M'+x+' '+(y+h*.62)+' Q'+(x+w*.3)+' '+(y+h*.42)+' '+(x+w*.55)+' '+(y+h*.58)+' T'+(x+w)+' '+(y+h*.5)+' L'+(x+w)+' '+(y+h)+' L'+x+' '+(y+h)+'Z" fill="url(#'+u+'ht)"/>';
    s+='<path d="M'+x+' '+(y+h*.8)+' Q'+(x+w*.5)+' '+(y+h*.68)+' '+(x+w)+' '+(y+h*.78)+' L'+(x+w)+' '+(y+h)+' L'+x+' '+(y+h)+'Z" fill="url(#'+u+'hx)"/>';
    const cx=x+w*.66, cy=y+h*.38; s+='<rect x="'+(cx-10)+'" y="'+(cy-4)+'" width="20" height="18" fill="url(#'+u+'hx)" stroke="#4a3925" stroke-width=".7"/><rect x="'+(cx-14)+'" y="'+(cy-12)+'" width="7" height="26" fill="url(#'+u+'ht)" stroke="#4a3925" stroke-width=".7"/><path d="M'+(cx-15)+' '+(cy-12)+' L'+(cx-10.5)+' '+(cy-20)+' L'+(cx-6)+' '+(cy-12)+'Z" fill="#4a3925"/>';
    for(let i=0;i<6;i++){ const tx=x+8+i*14+R()*6, ty=y+h*.62+R()*8; s+='<path d="M'+tx.toFixed(1)+' '+(ty-14).toFixed(1)+' q6 4 4 14 h-8 q-2 -10 4 -14z" fill="url(#'+u+'hx)" stroke="#4a3925" stroke-width=".5"/>'; }
    for(let i=0;i<9;i++) s+='<path d="M'+(x+4+R()*(w-8)).toFixed(1)+' '+(y+6+R()*h*.25).toFixed(1)+' q4 -2 8 0" stroke="#6e5a40" stroke-width=".5" fill="none"/>';
    s+='<rect x="'+(x+3)+'" y="'+(y+3)+'" width="'+(w-6)+'" height="'+(h-6)+'" fill="none" stroke="#5a4630" stroke-width=".6"/>'; }
  else if(l.id==='peint'){ s+='<defs>'+pxLG(u+'wa',[[0,'#3E6E7A'],[.5,'#5E8E86'],[1,'#7E6A93']])+'</defs><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#'+u+'wa)"/>';
    const P=['#8DB8A8','#B7C9D9','#6B9C8F','#A48CB8','#D6E3C9','#4F7F77'];
    for(let i=0;i<70;i++){ const sx=x+R()*w, sy=y+R()*h; s+='<path d="M'+sx.toFixed(1)+' '+sy.toFixed(1)+' l'+(6+R()*14).toFixed(1)+' '+((R()-.5)*2).toFixed(1)+'" stroke="'+P[i%P.length]+'" stroke-width="'+(1.5+R()*2).toFixed(1)+'" stroke-linecap="round" opacity=".7"/>'; }
    for(let i=0;i<16;i++){ const px=x+6+R()*(w-12), py=y+h*.35+R()*h*.6, r=4+R()*6; s+='<path d="M'+(px+r)+' '+py+' A'+r+' '+(r*.45)+' 0 1 1 '+(px+r*.7)+' '+(py-r*.25)+' L'+px+' '+py+'Z" fill="'+(R()<.5?'#5E8F4E':'#7BA75B')+'"/>'; if(R()<.45) s+='<circle cx="'+(px+(R()-.5)*3).toFixed(1)+'" cy="'+(py-2).toFixed(1)+'" r="'+(1.5+R()*1.6).toFixed(1)+'" fill="'+(R()<.6?'#F2A7C3':'#FFF3F6')+'"/>'; }
    for(let i=0;i<10;i++){ const vx=x+R()*w; s+='<path d="M'+vx.toFixed(1)+' '+y+' q'+((R()-.5)*6).toFixed(1)+' '+(h*.3).toFixed(1)+' 0 '+(h*.45).toFixed(1)+'" stroke="#2E5C4E" stroke-width="1.2" fill="none" opacity=".55"/>'; } }
  else if(l.id==='nuit'){ s+='<defs>'+pxLG(u+'ns',[[0,'#13215A'],[.6,'#22408A'],[1,'#1B2F5E']])+'</defs><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#'+u+'ns)"/>';
    for(let k=0;k<5;k++){ const cx=x+w*(.18+k*.17), cy=y+h*(.25+(k%2)*.12); s+='<g class="pxa-swirl" style="animation-duration:'+(10+k*3)+'s'+(k%2?';animation-direction:reverse':'')+'">'; for(let r=4;r<22;r+=4) s+='<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+r+'" fill="none" stroke="'+(r%8?'#9EC3F0':'#E8F1FF')+'" stroke-width="1.6" stroke-dasharray="'+(3+R()*4).toFixed(1)+' '+(2+R()*3).toFixed(1)+'" opacity=".8"/>'; s+='</g>'; }
    s+='<path d="M'+(x+w*.1)+' '+(y+h*.42)+' C'+(x+w*.35)+' '+(y+h*.2)+' '+(x+w*.55)+' '+(y+h*.55)+' '+(x+w*.9)+' '+(y+h*.3)+'" stroke="#DDE9FF" stroke-width="3" fill="none" stroke-dasharray="5 3" opacity=".75"/>';
    for(let i=0;i<9;i++){ const sx=x+10+R()*(w-20), sy=y+6+R()*h*.45; s+='<circle cx="'+sx.toFixed(1)+'" cy="'+sy.toFixed(1)+'" r="'+(5+R()*3).toFixed(1)+'" fill="#F3D35B" opacity=".35" class="pxa-halo" style="animation-delay:-'+(i*.4)+'s"/><circle cx="'+sx.toFixed(1)+'" cy="'+sy.toFixed(1)+'" r="'+(2+R()*1.5).toFixed(1)+'" fill="#FFF3B0"/>'; }
    s+='<circle cx="'+(x+w*.86)+'" cy="'+(y+h*.16)+'" r="9" fill="#F7D774"/><circle cx="'+(x+w*.86+4)+'" cy="'+(y+h*.16-2)+'" r="8" fill="#22408A"/>';
    s+='<path d="M'+x+' '+(y+h*.78)+' Q'+(x+w*.4)+' '+(y+h*.66)+' '+(x+w)+' '+(y+h*.74)+' L'+(x+w)+' '+(y+h)+' L'+x+' '+(y+h)+'Z" fill="#2A3D6E"/>';
    for(let i=0;i<9;i++){ const hx=x+w*.35+i*9, hy=y+h*.8+R()*4; s+='<rect x="'+hx.toFixed(1)+'" y="'+hy.toFixed(1)+'" width="7" height="6" fill="#33467A"/><rect x="'+(hx+2).toFixed(1)+'" y="'+(hy+2).toFixed(1)+'" width="2" height="2" fill="#F3D35B"/>'; }
    s+='<path d="M'+(x+w*.58)+' '+(y+h*.8)+' l3 -16 l3 16z" fill="#33467A"/>';
    s+='<path d="M'+(x+w*.14)+' '+(y+h)+' C'+(x+w*.06)+' '+(y+h*.6)+' '+(x+w*.2)+' '+(y+h*.4)+' '+(x+w*.16)+' '+(y+h*.08)+' C'+(x+w*.24)+' '+(y+h*.4)+' '+(x+w*.3)+' '+(y+h*.7)+' '+(x+w*.24)+' '+(y+h)+'Z" fill="#14281C"/>'; }
  else { s+='<defs>'+pxLG(u+'jl',[[0,'#8FA38A'],[.5,'#9C8E62'],[1,'#5E4A30']])+pxRG(u+'jf',[[0,'#E5C59A'],[1,'#B98A5E']],.45,.4,.6)+'</defs><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="url(#'+u+'jl)"/>';
    s+='<path d="M'+x+' '+(y+h*.36)+' Q'+(x+w*.25)+' '+(y+h*.3)+' '+(x+w*.3)+' '+(y+h*.42)+' M'+(x+w*.7)+' '+(y+h*.4)+' Q'+(x+w*.82)+' '+(y+h*.3)+' '+(x+w)+' '+(y+h*.34)+'" stroke="#6E8A86" stroke-width="5" fill="none" opacity=".6"/><path d="M'+(x+w*.08)+' '+(y+h*.55)+' q12 -6 18 4 t16 -2" stroke="#7A6A48" stroke-width="2" fill="none"/>';
    const cx=x+w/2; s+='<path d="M'+(cx-w*.34)+' '+(y+h)+' Q'+(cx-w*.3)+' '+(y+h*.58)+' '+(cx-w*.14)+' '+(y+h*.5)+' L'+(cx+w*.14)+' '+(y+h*.5)+' Q'+(cx+w*.3)+' '+(y+h*.58)+' '+(cx+w*.34)+' '+(y+h)+'Z" fill="#2B2419"/>';
    s+='<path d="M'+(cx-w*.2)+' '+(y+h*.5)+' Q'+(cx-w*.22)+' '+(y+h*.12)+' '+cx+' '+(y+h*.1)+' Q'+(cx+w*.22)+' '+(y+h*.12)+' '+(cx+w*.2)+' '+(y+h*.5)+'Z" fill="#1E1810"/>';
    s+='<ellipse cx="'+cx+'" cy="'+(y+h*.3)+'" rx="'+(w*.12)+'" ry="'+(h*.15)+'" fill="url(#'+u+'jf)"/><path d="M'+(cx-w*.1)+' '+(y+h*.5)+' Q'+cx+' '+(y+h*.58)+' '+(cx+w*.1)+' '+(y+h*.5)+' L'+(cx+w*.06)+' '+(y+h*.44)+' L'+(cx-w*.06)+' '+(y+h*.44)+'Z" fill="#D2AE82"/>';
    s+='<path d="M'+(cx-w*.04)+' '+(y+h*.36)+' q'+(w*.04)+' '+(h*.015)+' '+(w*.08)+' 0" stroke="#8A5E3C" stroke-width="1" fill="none"/><circle cx="'+(cx-w*.045)+'" cy="'+(y+h*.28)+'" r="1.3" fill="#3B2A1A"/><circle cx="'+(cx+w*.045)+'" cy="'+(y+h*.28)+'" r="1.3" fill="#3B2A1A"/>';
    s+='<path d="M'+(cx-w*.2)+' '+(y+h*.86)+' Q'+cx+' '+(y+h*.78)+' '+(cx+w*.22)+' '+(y+h*.84)+' Q'+cx+' '+(y+h*.9)+' '+(cx-w*.2)+' '+(y+h*.86)+'Z" fill="url(#'+u+'jf)"/>'; }
  return s; }
function pxArtWork(l){ const u='pxa'+l.id, port=l.id==='joconde', fw=port?100:150, fh=port?120:96, fx=200-fw/2, fy=port?16:24;
  let s='<defs>'+pxLG(u+'wl',[[0,'#7A1F2B'],[1,'#4E1119']])+pxLG(u+'fr',[[0,'#F4D58A'],[.5,'#B8892C'],[1,'#7A5718']],1,1)+pxRG(u+'sp',[[0,'#FFF4D6',.55],[1,'#FFF4D6',0]],.5,.3,.6)+'</defs>';
  s+='<rect width="400" height="180" fill="url(#'+u+'wl)"/>'+[...Array(8)].map((_,i)=>'<rect x="'+(i*52)+'" y="0" width="2" height="150" fill="#000" opacity=".12"/>').join('');
  s+='<rect x="0" y="146" width="400" height="34" fill="#7A5232"/>'+[...Array(14)].map((_,i)=>'<rect x="'+(i*30)+'" y="146" width="1" height="34" fill="#5C3C22"/>').join('')+'<rect x="0" y="142" width="400" height="5" fill="#E6D3B0"/>';
  s+='<ellipse cx="200" cy="70" rx="150" ry="90" fill="url(#'+u+'sp)" class="pxa-glow"/>';
  s+='<rect x="'+(fx-12)+'" y="'+(fy-10)+'" width="'+(fw+24)+'" height="'+(fh+20)+'" fill="url(#'+u+'fr)"/><rect x="'+(fx-6)+'" y="'+(fy-4)+'" width="'+(fw+12)+'" height="'+(fh+8)+'" fill="none" stroke="#6B4B12" stroke-width="2"/><rect x="'+(fx-9)+'" y="'+(fy-7)+'" width="'+(fw+18)+'" height="'+(fh+14)+'" fill="none" stroke="#FBE7A8" stroke-width="1" opacity=".7"/>';
  [[fx-12,fy-10],[fx+fw+12,fy-10],[fx-12,fy+fh+10],[fx+fw+12,fy+fh+10]].forEach(([cx,cy])=>{ s+='<circle cx="'+cx+'" cy="'+cy+'" r="5" fill="#E8C468" stroke="#7A5718"/>'; });
  s+=pxPaint(l,fx,fy,fw,fh,u)+'<rect x="'+fx+'" y="'+fy+'" width="'+fw+'" height="'+fh+'" fill="none" stroke="#3a2a10" stroke-width="1.5"/>';
  s+='<rect x="182" y="'+(fy+fh+16)+'" width="36" height="9" rx="1" fill="#D9C08A"/><rect x="186" y="'+(fy+fh+19)+'" width="28" height="1.5" fill="#6B4B12"/>';
  [[96,'l'],[304,'r']].forEach(([px])=>{ s+='<rect x="'+(px-2)+'" y="124" width="4" height="26" fill="#C9A227"/><circle cx="'+px+'" cy="123" r="4" fill="#E8C468"/><ellipse cx="'+px+'" cy="150" rx="8" ry="2.5" fill="#B8892C"/>'; });
  s+='<path d="M96 127 Q200 150 304 127" stroke="#9E1B2E" stroke-width="4" fill="none"/>';
  return s; }
/* ---------- propriétés ---------- */
function pxEstate(l){ const u='pxe'+l.id, R=pxR(pxHash(l.id)); let s='';
  if(l.id==='penth'){ s+='<defs>'+pxLG(u+'s',[[0,'#0D1433'],[.7,'#3B2C5E'],[1,'#B4577A']])+pxLG(u+'g',[[0,'#9FD4F5'],[1,'#2C4A73']],1,1)+'</defs><rect width="400" height="180" fill="url(#'+u+'s)"/><circle cx="330" cy="30" r="11" fill="#F4F1DE"/>';
    for(let i=0;i<40;i++) s+='<circle cx="'+(R()*400).toFixed(0)+'" cy="'+(R()*60).toFixed(0)+'" r=".8" fill="#fff" opacity=".7"'+pxTw(i)+'/>';
    let x=0; while(x<400){ const w=18+R()*26, h=40+R()*80; s+='<rect x="'+x.toFixed(0)+'" y="'+(180-h).toFixed(0)+'" width="'+w.toFixed(0)+'" height="'+h.toFixed(0)+'" fill="'+(R()<.5?'#1B2142':'#222A52')+'"/>'; for(let yy=180-h+6;yy<176;yy+=8) for(let xx=x+3;xx<x+w-4;xx+=7) if(R()<.45) s+='<rect x="'+xx.toFixed(0)+'" y="'+yy.toFixed(0)+'" width="3.5" height="4" fill="#F6D37A" opacity=".85"'+pxTw(xx+yy)+'/>'; x+=w+2; }
    s+='<rect x="150" y="34" width="100" height="146" fill="#2A3150"/><rect x="140" y="40" width="120" height="6" fill="#59618A"/><rect x="152" y="12" width="96" height="28" fill="url(#'+u+'g)" stroke="#9BB6D6" stroke-width="1.5"/>'+[0,1,2,3,4].map(i=>'<line x1="'+(152+i*24)+'" y1="12" x2="'+(152+i*24)+'" y2="40" stroke="#9BB6D6"/>').join('')+'<rect x="146" y="40" width="108" height="3" fill="#C9D3E0"/>'+[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>'<line x1="'+(148+i*9.5)+'" y1="34" x2="'+(148+i*9.5)+'" y2="40" stroke="#C9D3E0" stroke-width=".8"/>').join('')+'<circle cx="236" cy="30" r="6" fill="#3E8E4E"/><rect x="234" y="34" width="3" height="6" fill="#6B4A2B"/>';
    for(let yy=52;yy<176;yy+=10) for(let xx=158;xx<244;xx+=12) s+='<rect x="'+xx+'" y="'+yy+'" width="7" height="6" fill="'+(R()<.6?'#F6D37A':'#46507C')+'"/>'; }
  else if(l.id==='chateau'){ s+='<defs>'+pxLG(u+'s',[[0,'#A6CBEA'],[1,'#F3F8FC']])+pxLG(u+'r',[[0,'#7FA7C2'],[1,'#3F6A86']])+'</defs><rect width="400" height="180" fill="url(#'+u+'s)"/><path d="M0 96 Q100 84 200 92 T400 90 L400 130 L0 130Z" fill="#9CBF7A"/>'+pxTrees(14,[0,400],112,u);
    const tw=(x,w,h)=>'<rect x="'+x+'" y="'+(104-h)+'" width="'+w+'" height="'+h+'" fill="#F1EBDD"/><path d="M'+(x-3)+' '+(106-h)+' L'+(x+w/2)+' '+(76-h)+' L'+(x+w+3)+' '+(106-h)+'Z" fill="#3E4B5E"/><rect x="'+(x+w/2-.6)+'" y="'+(70-h)+'" width="1.2" height="8" fill="#333"/>'+[0,1].map(k=>'<rect x="'+(x+w/2-3)+'" y="'+(112-h+k*16)+'" width="6" height="10" rx="3" fill="#5D7894"/>').join('');
    s+='<rect x="110" y="56" width="180" height="48" fill="#F4EFE3"/><path d="M106 58 L130 34 L270 34 L294 58Z" fill="#46556B"/>'+[0,1,2,3,4,5,6,7,8].map(i=>'<rect x="'+(118+i*19)+'" y="64" width="8" height="14" fill="#5D7894"/><rect x="'+(118+i*19)+'" y="84" width="8" height="12" fill="#5D7894"/>').join('')+[0,1,2,3].map(i=>'<rect x="'+(140+i*36)+'" y="40" width="10" height="12" fill="#F4EFE3"/><path d="M138 '+'40'+' l7 -7 l7 7z" fill="#46556B" transform="translate('+(i*36)+' 0)"/>').join('');
    s+=tw(84,28,56)+tw(288,28,56)+tw(186,28,72);
    s+='<rect x="0" y="104" width="400" height="76" fill="url(#'+u+'r)"/><g opacity=".22" transform="translate(0 208) scale(1 -1)"><rect x="110" y="70" width="180" height="34" fill="#F4EFE3"/><rect x="84" y="74" width="28" height="30" fill="#F1EBDD"/><rect x="288" y="74" width="28" height="30" fill="#F1EBDD"/></g>'+[...Array(8)].map((_,i)=>'<rect x="'+(20+i*48)+'" y="'+(120+i%3*12)+'" width="26" height="1.5" fill="#fff" opacity=".6"/>').join(''); }
  else if(l.id==='ile'){ s+='<defs>'+pxRG(u+'l',[[0,'#7FE3E0'],[.6,'#22B3C6'],[1,'#0F6E9C']],.5,.55,.65)+'</defs><rect width="400" height="180" fill="url(#'+u+'l)"/>'+[...Array(18)].map(()=>'<path d="M'+(R()*400).toFixed(0)+' '+(R()*180).toFixed(0)+' q6 -3 12 0" stroke="#fff" stroke-width="1" fill="none" opacity=".5" class="pxa-wave" style="animation-delay:-'+(R()*4).toFixed(1)+'s"/>').join('');
    s+='<ellipse cx="200" cy="96" rx="120" ry="52" fill="#9BE3DC" opacity=".7"/><ellipse cx="200" cy="96" rx="96" ry="40" fill="#F1DFAE"/><ellipse cx="206" cy="92" rx="70" ry="28" fill="#5EA646"/><ellipse cx="190" cy="86" rx="40" ry="16" fill="#4C9139"/>';
    for(let i=0;i<9;i++){ const px=150+R()*110, py=74+R()*30; s+='<circle cx="'+px.toFixed(0)+'" cy="'+py.toFixed(0)+'" r="'+(5+R()*4).toFixed(1)+'" fill="'+(R()<.5?'#2F7D3A':'#3F8F45')+'"/>'; }
    s+='<rect x="214" y="82" width="34" height="16" fill="#FBF7EE"/><path d="M210 83 L231 72 L252 83Z" fill="#C8763E"/><rect x="226" y="88" width="8" height="10" fill="#6B4A2B"/><rect x="216" y="100" width="28" height="8" rx="2" fill="#4FD1E0"/>';
    s+='<rect x="276" y="104" width="70" height="3" fill="#9B7650"/>'+[0,1,2,3,4,5].map(i=>'<rect x="'+(280+i*12)+'" y="104" width="2" height="8" fill="#7A5A3A"/>').join('')+'<path d="M330 114 l22 0 l-4 6 l-16 0z" fill="#fff"/><rect x="338" y="104" width="1.5" height="10" fill="#555"/><path d="M339.5 104 l8 7 l-8 0z" fill="#F2F2F2"/>'; }
  else { s+='<defs>'+pxLG(u+'s',[[0,'#5EA9DD'],[1,'#CFE9F8']])+pxLG(u+'m',[[0,'#2C7FB8'],[1,'#164F7A']])+'</defs><rect width="400" height="180" fill="url(#'+u+'s)"/><rect y="96" width="400" height="84" fill="url(#'+u+'m)"/>'+[...Array(12)].map(()=>'<path d="M'+(R()*400).toFixed(0)+' '+(100+R()*70).toFixed(0)+' q8 -3 16 0" stroke="#fff" stroke-width="1" fill="none" opacity=".45" class="pxa-wave" style="animation-delay:-'+(R()*4).toFixed(1)+'s"/>').join('');
    s+='<path d="M0 70 Q40 60 90 72 L140 96 L0 110Z" fill="#B08A5A"/><path d="M260 80 Q320 62 400 70 L400 118 L230 112Z" fill="#A47F52"/><path d="M230 112 L400 118 L400 132 L250 126Z" fill="#8C6A44"/>';
    s+='<rect x="276" y="62" width="88" height="34" fill="#FBF6EC"/><rect x="270" y="58" width="100" height="6" fill="#D96B3B"/><rect x="300" y="44" width="46" height="18" fill="#FBF6EC"/><rect x="296" y="40" width="54" height="5" fill="#D96B3B"/>'+[0,1,2,3,4].map(i=>'<rect x="'+(282+i*16)+'" y="70" width="10" height="16" fill="#6FA6CF"/>').join('')+'<rect x="268" y="96" width="104" height="3" fill="#E6E6E6"/>'+[0,1,2,3,4,5,6,7,8,9,10].map(i=>'<rect x="'+(270+i*10)+'" y="90" width="1.2" height="6" fill="#ccc"/>').join('');
    s+='<rect x="286" y="102" width="56" height="10" rx="3" fill="#4FD1E0" stroke="#fff"/><path d="M380 104 Q382 76 390 64" stroke="#6B4A2B" stroke-width="3.5" fill="none"/>'+[10,50,95,140,175].map(a=>'<path d="M390 64 q'+(Math.cos(a*Math.PI/180)*20).toFixed(1)+' '+(-Math.sin(a*Math.PI/180)*8+5).toFixed(1)+' '+(Math.cos(a*Math.PI/180)*28).toFixed(1)+' 10" stroke="#2F7D3A" stroke-width="4" fill="none" stroke-linecap="round"/>').join('')+'<rect x="254" y="70" width="6" height="30" rx="3" fill="#2F5D34"/>'; }
  return s; }
/* ---------- yachts ---------- */
function pxYacht(l){ const u='pxy'+l.id, R=pxR(pxHash(l.id)); let s='<defs>'+pxLG(u+'s',[[0,'#F5A25D'],[.5,'#F9D29B'],[1,'#BFE0F2']])+pxLG(u+'m',[[0,'#2F8FC0'],[1,'#0F4C75']])+pxLG(u+'h',[[0,'#FFFFFF'],[1,'#D6DEE6']])+'</defs><rect width="400" height="180" fill="url(#'+u+'s)"/><circle cx="80" cy="96" r="20" fill="#FFE7A3" class="pxa-sun"/><rect y="104" width="400" height="76" fill="url(#'+u+'m)"/>';
  for(let i=0;i<22;i++) s+='<path d="M'+(R()*400).toFixed(0)+' '+(110+R()*66).toFixed(0)+' q7 -3 14 0" stroke="#fff" stroke-width="1" fill="none" opacity=".5" class="pxa-wave" style="animation-delay:-'+(R()*4).toFixed(1)+'s"/>';
  s+='<rect x="40" y="104" width="80" height="2" fill="#FFE7A3" opacity=".6"/><g class="pxa-float">';
  if(l.id==='voilier'){ s+='<path d="M120 118 L292 118 L276 134 L136 134Z" fill="url(#'+u+'h)" stroke="#9fb0c0"/><rect x="124" y="121" width="160" height="3" fill="#1F4E8A"/><rect x="198" y="14" width="3" height="104" fill="#7A6040"/><path d="M202 18 L202 112 L270 112 Z" fill="#FDFDFD" stroke="#ccd"/><path d="M196 24 L196 112 L140 112 Z" fill="#F2F4F6" stroke="#ccd"/><path d="M202 20 L298 116 M196 24 L124 116" stroke="#555" stroke-width=".6"/><path d="M202 40 L240 76 L202 76Z" fill="#E8EDF2" opacity=".6"/><rect x="230" y="112" width="26" height="6" fill="#E9E1D0"/>'; }
  else { const big=l.id==='mega', x0=big?44:84, w=big?312:232;
    s+='<path d="M'+x0+' 112 L'+(x0+w)+' 112 L'+(x0+w-26)+' 134 L'+(x0+20)+' 134 Q'+(x0+6)+' 128 '+x0+' 112Z" fill="url(#'+u+'h)" stroke="#9fb0c0"/><rect x="'+(x0+10)+'" y="120" width="'+(w-40)+'" height="4" fill="#1F2A44"/>'+[...Array(Math.floor((w-50)/14))].map((_,i)=>'<rect x="'+(x0+18+i*14)+'" y="126" width="6" height="3" rx="1.5" fill="#1F2A44"/>').join('');
    const deck=(dx,dy,dw,dh)=>'<path d="M'+dx+' '+(dy+dh)+' L'+(dx+8)+' '+dy+' L'+(dx+dw-14)+' '+dy+' L'+(dx+dw)+' '+(dy+dh)+'Z" fill="url(#'+u+'h)" stroke="#9fb0c0"/><rect x="'+(dx+12)+'" y="'+(dy+3)+'" width="'+(dw-30)+'" height="'+(dh-6)+'" fill="#24344F"/>'+[...Array(Math.floor((dw-30)/16))].map((_,i)=>'<rect x="'+(dx+16+i*16)+'" y="'+(dy+4)+'" width="2" height="'+(dh-8)+'" fill="#9fb0c0" opacity=".6"/>').join('');
    s+=deck(x0+40,98,w-90,14)+deck(x0+70,86,w-150,12);
    if(big){ s+=deck(x0+100,76,w-210,10)+'<circle cx="'+(x0+w-60)+'" cy="106" r="12" fill="#D6DEE6" stroke="#9fb0c0"/><text x="'+(x0+w-60)+'" y="110" text-anchor="middle" font-size="11" font-weight="800" fill="#7d8792" font-family="Nunito,sans-serif">H</text><rect x="'+(x0+60)+'" y="104" width="34" height="6" rx="3" fill="#4FD1E0"/><path d="M'+(x0+w-22)+' 130 l16 0 l-3 5 l-12 0z" fill="#fff"/>'; }
    s+='<path d="M'+(x0+w/2-6)+' '+(big?76:86)+' L'+(x0+w/2+2)+' '+(big?62:72)+' L'+(x0+w/2+18)+' '+(big?62:72)+'" stroke="#d0d6dd" stroke-width="3" fill="none"/><circle cx="'+(x0+w/2+6)+'" cy="'+(big?58:68)+'" r="3" fill="#fff" stroke="#9fb0c0"/>';
    s+='<path d="M'+(x0+w-26)+' 134 q30 4 60 -2" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>'; }
  return s+'</g>'; }
/* ---------- monuments ---------- */
function pxMonument(l){ const u='pxm'+l.id, R=pxR(pxHash(l.id)); let s='';
  const sky=(a,b)=>'<defs>'+pxLG(u+'s',[[0,a],[1,b]])+'</defs><rect width="400" height="180" fill="url(#'+u+'s)"/>'+pxClouds(R);
  if(l.id==='bigben'){ s+=sky('#8FB2D3','#E9EEF2')+'<rect y="140" width="400" height="40" fill="#5D7C8F"/>'+[...Array(10)].map(()=>'<rect x="'+(R()*400).toFixed(0)+'" y="'+(146+R()*30).toFixed(0)+'" width="18" height="1.2" fill="#fff" opacity=".5"/>').join('');
    s+='<rect x="0" y="104" width="400" height="36" fill="#C9B48A"/>'+[...Array(25)].map((_,i)=>'<rect x="'+(i*16+4)+'" y="96" width="4" height="10" fill="#C9B48A"/><path d="M'+(i*16+4)+' 96 l2 -6 l2 6z" fill="#B59E73"/><rect x="'+(i*16+6)+'" y="112" width="4" height="16" fill="#8A7650"/>').join('');
    s+='<rect x="178" y="40" width="44" height="100" fill="#D4BF92"/>'+[...Array(9)].map((_,i)=>'<rect x="'+(182+i*4.4)+'" y="96" width="2" height="40" fill="#A8925F"/>').join('')+'<rect x="174" y="40" width="52" height="40" fill="#CDB685"/><circle cx="200" cy="60" r="15" fill="#F6EFD9" stroke="#6E5A30" stroke-width="2.5"/>'+[...Array(12)].map((_,i)=>{ const a=i*Math.PI/6; return '<line x1="'+(200+Math.cos(a)*12).toFixed(1)+'" y1="'+(60+Math.sin(a)*12).toFixed(1)+'" x2="'+(200+Math.cos(a)*14).toFixed(1)+'" y2="'+(60+Math.sin(a)*14).toFixed(1)+'" stroke="#333" stroke-width="1"/>'; }).join('')+'<line x1="200" y1="60" x2="200" y2="50" stroke="#222" stroke-width="1.6" class="pxa-hand"/><line x1="200" y1="60" x2="207" y2="62" stroke="#222" stroke-width="1.4"/>';
    s+='<path d="M174 40 L180 28 L220 28 L226 40Z" fill="#B89F6A"/><path d="M182 28 L200 -4 L218 28Z" fill="#5E6F5E"/>'+[184,192,208,216].map(x=>'<path d="M'+x+' 28 l2 -10 l2 10z" fill="#7A8A6E"/>').join(''); }
  else if(l.id==='liberte'){ s+=sky('#7DB9E3','#EAF5FC')+'<rect y="128" width="400" height="52" fill="#3F7FA6"/>'+[...Array(30)].map((_,i)=>'<rect x="'+(i*14)+'" y="'+(110+((i*7)%22))+'" width="12" height="'+(18-((i*7)%22)/2)+'" fill="#9DB3C6" opacity=".7"/>').join('');
    s+='<path d="M150 136 L250 136 L240 126 L160 126Z" fill="#8A8F7E"/><path d="M168 126 L232 126 L226 104 L174 104Z" fill="#B7AE97"/><rect x="180" y="86" width="40" height="18" fill="#C4BBA3"/>';
    s+='<path d="M188 86 Q186 60 192 46 L208 46 Q214 60 212 86Z" fill="#5E9C8A"/><path d="M190 86 Q196 70 194 56 M206 84 Q202 68 206 56" stroke="#4A8070" stroke-width="1.2" fill="none"/><circle cx="200" cy="40" r="7" fill="#5E9C8A"/>'+[...Array(7)].map((_,i)=>{ const a=-Math.PI*(.15+i*.12); return '<path d="M'+(200+Math.cos(a)*6).toFixed(1)+' '+(40+Math.sin(a)*6).toFixed(1)+' L'+(200+Math.cos(a)*14).toFixed(1)+' '+(40+Math.sin(a)*14).toFixed(1)+'" stroke="#5E9C8A" stroke-width="2"/>'; }).join('');
    s+='<path d="M206 48 L216 18" stroke="#5E9C8A" stroke-width="4" stroke-linecap="round"/><path d="M212 16 L222 16 L219 10 L215 10Z" fill="#5E9C8A"/><path d="M217 10 Q214 2 218 -2 Q222 4 219 10Z" fill="#F2C94C" class="pxa-flame"/><rect x="186" y="58" width="8" height="10" fill="#4A8070" transform="rotate(-10 190 63)"/>'; }
  else if(l.id==='eiffel'){ s+=sky('#9EC6EA','#F4F1EA')+'<rect y="140" width="400" height="40" fill="#8DB86B"/>'+pxTrees(22,[0,400],146,u);
    const T='#6E5A45'; s+='<path d="M200 2 L204 40 L214 92 L236 142 L218 142 Q200 112 182 142 L164 142 L186 92 L196 40Z" fill="'+T+'"/>';
    for(let y=44;y<140;y+=8){ const k=(y-40)/100, hw=4+k*34; s+='<path d="M'+(200-hw)+' '+y+' L'+(200+hw*.6)+' '+(y+8)+' M'+(200+hw)+' '+y+' L'+(200-hw*.6)+' '+(y+8)+'" stroke="#9B8468" stroke-width=".8"/>'; }
    s+='<rect x="182" y="90" width="36" height="5" fill="'+T+'"/><rect x="191" y="56" width="18" height="4" fill="'+T+'"/><rect x="198" y="0" width="4" height="6" fill="'+T+'"/><path d="M186 142 Q200 120 214 142" fill="none" stroke="#9B8468" stroke-width="1.5"/>'; }
  else if(l.id==='colisee'){ s+=sky('#7FB3DF','#F3EEE4')+'<rect y="142" width="400" height="38" fill="#C9B79A"/>';
    s+='<path d="M60 142 L60 40 Q200 18 340 40 L340 142Z" fill="#D9BE8E"/><path d="M280 30 Q314 34 340 40 L340 142 L300 142 L300 60 Q296 44 280 40Z" fill="#C8AB7B"/>';
    for(let r=0;r<3;r++) for(let i=0;i<13;i++){ const x=70+i*20.5, y=50+r*30; s+='<path d="M'+x+' '+(y+22)+' L'+x+' '+(y+8)+' Q'+(x+6)+' '+y+' '+(x+12)+' '+(y+8)+' L'+(x+12)+' '+(y+22)+'Z" fill="#8A6B42"/><rect x="'+(x-3)+'" y="'+y+'" width="2" height="24" fill="#E6CFA2"/>'; }
    s+='<rect x="60" y="138" width="280" height="4" fill="#B89B6C"/><rect x="60" y="36" width="280" height="8" fill="#CDB283"/>'+[...Array(14)].map((_,i)=>'<rect x="'+(66+i*20)+'" y="38" width="6" height="4" fill="#9C7C50"/>').join(''); }
  else if(l.id==='taj'){ s+=sky('#F5C9A8','#FBEFE3')+'<rect y="118" width="400" height="62" fill="#B9C9A0"/><rect x="176" y="118" width="48" height="62" fill="#7FB3D6"/><g opacity=".35" transform="translate(0 236) scale(1 -1)"><rect x="150" y="72" width="100" height="46" fill="#F7F3EC"/><path d="M168 72 Q200 22 232 72Z" fill="#F7F3EC"/></g>'+[...Array(7)].map((_,i)=>'<path d="M'+(150-i*20)+' 160 l5 -26 l5 26z M'+(240+i*20)+' 160 l5 -26 l5 26z" fill="#2F6B3A"/>').join('');
    s+='<rect x="140" y="110" width="120" height="8" fill="#EFE8DA"/><rect x="150" y="72" width="100" height="40" fill="#F7F3EC"/><path d="M168 72 Q166 36 200 26 Q234 36 232 72Z" fill="#FBF8F2" stroke="#E3DACA"/><rect x="198" y="14" width="4" height="14" fill="#D9C28A"/><circle cx="200" cy="12" r="2.5" fill="#D9C28A"/>'+[[158,66],[242,66]].map(([x,y])=>'<path d="M'+(x-8)+' '+y+' Q'+x+' '+(y-16)+' '+(x+8)+' '+y+'Z" fill="#F7F3EC"/>').join('')+'<path d="M186 112 L186 90 Q200 76 214 90 L214 112Z" fill="#E3DACA"/>'+[[160,94],[232,94]].map(([x,y])=>'<path d="M'+(x-5)+' '+(y+14)+' L'+(x-5)+' '+y+' Q'+x+' '+(y-6)+' '+(x+5)+' '+y+' L'+(x+5)+' '+(y+14)+'Z" fill="#E3DACA"/>').join('')+[120,280].map(x=>'<rect x="'+(x-3)+'" y="44" width="6" height="74" fill="#F2ECE0"/><rect x="'+(x-4.5)+'" y="60" width="9" height="2" fill="#E3DACA"/><rect x="'+(x-4.5)+'" y="84" width="9" height="2" fill="#E3DACA"/><path d="M'+(x-5)+' 46 Q'+x+' 36 '+(x+5)+' 46Z" fill="#F2ECE0"/>').join(''); }
  else { s+=sky('#F2B36A','#FCEBCB')+'<circle cx="320" cy="46" r="22" fill="#FFF0B5" class="pxa-sun"/><path d="M0 132 Q100 118 200 130 T400 126 L400 180 L0 180Z" fill="#E2B572"/><path d="M0 150 Q120 138 240 150 T400 146 L400 180 L0 180Z" fill="#D4A060"/>';
    const py=(cx,b,h,c1,c2)=>'<path d="M'+(cx-b)+' 136 L'+cx+' '+(136-h)+' L'+(cx+b)+' 136Z" fill="'+c1+'"/><path d="M'+cx+' '+(136-h)+' L'+(cx+b)+' 136 L'+(cx+b*.35)+' 136Z" fill="'+c2+'"/>'+[...Array(Math.floor(h/6))].map((_,i)=>{ const y=136-i*6, k=(i*6)/h; return '<line x1="'+(cx-b*(1-k)).toFixed(1)+'" y1="'+y+'" x2="'+(cx+b*(1-k)).toFixed(1)+'" y2="'+y+'" stroke="#9C7A42" stroke-width=".5" opacity=".6"/>'; }).join('');
    s+=py(300,52,58,'#D8B06A','#B38A4A')+py(196,72,86,'#DDB774','#B8904F')+py(96,44,48,'#D8B06A','#B38A4A');
    s+='<path d="M236 136 L236 126 Q240 118 250 120 L262 120 L262 116 Q266 110 272 116 L272 136Z" fill="#B38A4A"/>'; }
  return s; }
function pxTw(i){ return ' class="pxa-tw" style="animation-delay:-'+((i*1.37)%5).toFixed(2)+'s;animation-duration:'+(3+(i*0.71)%4).toFixed(1)+'s"'; }
function pxClouds(R){ let s=''; for(let i=0;i<3;i++){ const y=12+R()*40, k=.6+R()*.6, d=34+R()*26;
  s+='<g class="pxa-cloud" style="animation-duration:'+d.toFixed(0)+'s;animation-delay:-'+(R()*d).toFixed(0)+'s"><g transform="translate(0 '+y.toFixed(0)+') scale('+k.toFixed(2)+')" fill="#fff" opacity=".85"><ellipse cx="30" cy="12" rx="30" ry="9"/><ellipse cx="22" cy="6" rx="13" ry="9"/><ellipse cx="40" cy="5" rx="15" ry="10"/></g></g>'; } return s; }
pxArt=function(l){ const k=l.id; if(PXK[k]) return PXK[k];
  let body= l.kind==='car'? pxCar(l) : l.kind==='art'? pxArtWork(l) : l.kind==='estate'? pxEstate(l) : l.kind==='yacht'? pxYacht(l) : pxMonument(l);
  return PXK[k]='<svg viewBox="0 0 400 180" width="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+body+'</svg>'; };
(function(){ const st=document.createElement('style'); st.textContent=`.px-im svg{height:168px}
.pxa-spin{transform-box:fill-box;transform-origin:center;animation:pxspin .7s linear infinite}
.pxa-road{animation:pxroad .6s linear infinite}
.pxa-bob{animation:pxbob .35s ease-in-out infinite alternate}
.pxa-tw{animation:pxtw 4s ease-in-out infinite}
.pxa-wave{animation:pxwave 4s ease-in-out infinite alternate}
.pxa-float{transform-box:view-box;transform-origin:200px 130px;animation:pxfloat 4.5s ease-in-out infinite}
.pxa-sun{transform-box:fill-box;transform-origin:center;animation:pxsun 5s ease-in-out infinite alternate}
.pxa-swirl{transform-box:fill-box;transform-origin:center;animation:pxspin 14s linear infinite}
.pxa-halo{transform-box:fill-box;transform-origin:center;animation:pxsun 2.4s ease-in-out infinite alternate}
.pxa-glow{animation:pxglow 6s ease-in-out infinite alternate}
.pxa-hand{transform-origin:200px 60px;animation:pxspin 12s linear infinite}
.pxa-flame{transform-box:fill-box;transform-origin:50% 100%;animation:pxflame .5s ease-in-out infinite alternate}
.pxa-cloud{animation:pxcloud 40s linear infinite}
@keyframes pxspin{to{transform:rotate(360deg)}}
@keyframes pxroad{to{transform:translateX(-44px)}}
@keyframes pxbob{to{transform:translateY(-.8px)}}
@keyframes pxtw{0%,100%{opacity:.9}50%{opacity:.25}}
@keyframes pxwave{to{transform:translateX(10px)}}
@keyframes pxfloat{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-2.5px) rotate(-.8deg)}}
@keyframes pxsun{to{transform:scale(1.08);opacity:.75}}
@keyframes pxglow{to{opacity:.55}}
@keyframes pxflame{to{transform:scale(.8,1.25)}}
@keyframes pxcloud{from{transform:translateX(-90px)}to{transform:translateX(420px)}}
@media (prefers-reduced-motion:reduce){[class^="pxa-"]{animation:none!important}}`; document.head.appendChild(st); })();

/* ---------- villes et pays : ce qu'ils rapportent ---------- */
const CITY_YIELD=.10, CITY_SALES=.05, CTY_SALES=.05, PR_PER=1e8;
cityIncome=function(id){ const o=S.cities[id]; return cityValue(id)*CITY_YIELD/360*CPOL[o.pol===undefined?1:o.pol][1]*cityOcc(id)/.8; };
const ctyOf = c => D.COUNTRIES.find(x=>x.cities.includes(c));
const ctyGov = city => !!(S.country&&S.country.cities&&S.country.cities.includes(city));
{ const _mm=metMods; metMods=function(b){ const z=_mm(b); try{ if(z&&b){ const k=(cityOwned(b.city)?1+CITY_SALES:1)*(ctyGov(b.city)?1+CTY_SALES:1); if(k>1){ if(z.vol>0) z.vol*=k; else z.rev=(z.rev||0)*k; } } }catch(e){} return z; }; }
/* impôt sur les sociétés : les bénéfices de vos sociétés du pays gouverné en sont exonérés */
function ctyExempt(){ return S.country&&S.country.ex!==false? ctyProfit() : 0; }
function ctyProfit(){ if(!S.country) return 0; return S.biz.filter(b=>b.status==='active'&&ctyGov(b.city)).reduce((a,b)=>a+Math.max(0,(b.hist||[]).slice(-30).reduce((x,y)=>x+y,0)),0); }
{ const _te=taxEstimate; taxEstimate=function(){ const e=_te(); try{ const nc=Math.max(0,S.tb.corp)*corpRateEff(); e.total+=nc-e.corp; e.corp=nc; }catch(e2){} return e; }; }
/* prestige : villes et pays */
PX_SRC.city='Villes'; PX_SRC.country='Pays';
{ const _pc=prCompute; prCompute=function(){ _pc(); const B=S.prB; let c=0; Object.keys(S.cities||{}).forEach(id=>{ if(cityOwned(id)) c+=(S.cities[id].cost||0)/PR_PER; }); const k=S.country? (S.country.price||0)/PR_PER : 0;
  B.city=Math.round(c); B.country=Math.round(k); const add=(B.city+B.country)*(galaOn()?1+GALA_K:1); if(galaOn()) B.gala+=(B.city+B.country)*GALA_K; S.prestige=Math.round((S.prestige+add)*10)/10; return S.prestige; }; }
/* estimations affichées */
const bizRevDay = b => (b.last&&b.last.rev)||0;
function cityGain(id){ const own=cityOwned(id), L=S.biz.filter(b=>b.status==='active'&&b.city===id), price=own? (S.cities[id].cost||cityPriceEur(id)) : cityPriceEur(id);
  const rent= own? cityIncome(id)-cityUpkeep(id) : price*CITY_YIELD/360*.7-price*.005/360;
  const sales=L.reduce((a,b)=>a+bizRevDay(b),0)*CITY_SALES/(own?1+CITY_SALES:1);
  const save= own? 0 : L.reduce((a,b)=>{ try{ const bd=b.bld&&bldById(b.bld), h=bldHeld(b.bld); return a+(bd&&h&&h.st==='rent'? bldRent(bd) : bd&&h&&h.st==='own'? bldRent(bd)*.3 : 0); }catch(e){ return a; } },0);
  return {n:L.length, rent, sales, save, pr:Math.round(price/PR_PER), price}; }
function ctyGain(c){ const L=S.biz.filter(b=>b.status==='active'&&c.cities.includes(b.city)), gov=S.country&&S.country.id===c.id;
  const prof=L.reduce((a,b)=>a+Math.max(0,(b.hist||[]).slice(-30).reduce((x,y)=>x+y,0)),0), tax=prof*(gov? ctyLaws().corpTax : S.laws.corpTax);
  const sales=L.reduce((a,b)=>a+bizRevDay(b),0)*CTY_SALES/(gov?1+CTY_SALES:1), fisc= gov? S.country.revenue : (c.gdp/360)*(.25-.22)*S.macro.econ;
  return {n:L.length, tax, sales, fisc, pr:Math.round((gov?S.country.price:c.price)/PR_PER)}; }
const gRow=(t,v,s)=>'<div class="cg-r"><span>'+t+(s?'<small>'+s+'</small>':'')+'</span><b class="num">'+v+'</b></div>';
function cityGainHtml(id){ const g=cityGain(id), own=cityOwned(id), kids=D.CITY_ORDER.filter(k=>D.CITIES[k].parent===id);
  return '<div class="cg"><div class="cg-h">'+(own?'Ce que la ville vous rapporte':'Ce que la ville vous rapporterait')+'</div>'+
    gRow('Loyers des locataires',signed(g.rent,0)+' / j','10 % de sa valeur par an, entretien déduit')+
    gRow('Vos sociétés ici ('+g.n+')',g.n? '+'+eur(g.sales,0)+' / j' : '—','ventes +5 %'+(own?'':', plus de loyer'+(g.save>0?' (−'+eur(g.save,0)+' / j)':'')))+
    gRow('Prestige','+'+fmtN(g.pr),'1 point par 100 M€ du prix')+(kids.length&&!own? gRow('Débloque',esc(kids.map(k=>D.CITIES[k].n).join(', ')),'') : '')+'</div>'; }
{ const _cc=cityCard; cityCard=function(id){ const h=_cc(id); try{ if(!cityUnlocked(id)&&!cityOwned(id)) return h; const k=h.lastIndexOf('</section>'); return k<0? h : h.slice(0,k)+cityGainHtml(id)+h.slice(k); }catch(e){ return h; } }; }
/* drapeaux simplifiés */
function ctyFlag(id){ const F={france:'<rect width="30" height="60" fill="#1F4E9E"/><rect x="30" width="30" height="60" fill="#fff"/><rect x="60" width="30" height="60" fill="#D7262E"/>',
  croatie:'<rect width="90" height="20" fill="#D7262E"/><rect y="20" width="90" height="20" fill="#fff"/><rect y="40" width="90" height="20" fill="#1F3F8F"/>'+[...Array(16)].map((_,i)=>'<rect x="'+(37+(i%4)*4)+'" y="'+(16+Math.floor(i/4)*4)+'" width="4" height="4" fill="'+(((i%4)+Math.floor(i/4))%2?'#fff':'#D7262E')+'"/>').join('')+'<rect x="37" y="16" width="16" height="16" fill="none" stroke="#1F3F8F" stroke-width="1"/>',
  espagne:'<rect width="90" height="15" fill="#C8202B"/><rect y="15" width="90" height="30" fill="#F6C200"/><rect y="45" width="90" height="15" fill="#C8202B"/><rect x="20" y="22" width="10" height="14" rx="2" fill="#C8202B" opacity=".75"/>',
  usa:[...Array(13)].map((_,i)=>'<rect y="'+(i*60/13).toFixed(2)+'" width="90" height="'+(60/13).toFixed(2)+'" fill="'+(i%2?'#fff':'#B22234')+'"/>').join('')+'<rect width="38" height="32.3" fill="#3C3B6E"/>'+[...Array(20)].map((_,i)=>'<circle cx="'+(4+(i%5)*7.5)+'" cy="'+(4+Math.floor(i/5)*7.5)+'" r="1.3" fill="#fff"/>').join(''),
  bresil:'<rect width="90" height="60" fill="#169B3A"/><path d="M45 6 L84 30 L45 54 L6 30Z" fill="#F6D200"/><circle cx="45" cy="30" r="13" fill="#1F3F8F"/><path d="M33 27 Q45 23 57 31" stroke="#fff" stroke-width="2" fill="none"/>',
  chine:'<rect width="90" height="60" fill="#DE2910"/><path d="M15 6 L18 15 L27 15 L20 20 L23 29 L15 23 L7 29 L10 20 L3 15 L12 15Z" fill="#FFDE00"/>'+[[32,6],[38,13],[38,22],[32,29]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="2.3" fill="#FFDE00"/>').join('')};
  return '<svg viewBox="0 0 90 60" width="54" height="36" aria-hidden="true" style="border-radius:5px;box-shadow:0 1px 3px rgba(0,0,0,.3);flex:0 0 auto">'+(F[id]||'<rect width="90" height="60" fill="#888"/>')+'</svg>'; }
function ctyGainHtml(c){ const g=ctyGain(c), gov=S.country&&S.country.id===c.id;
  return '<div class="cg"><div class="cg-h">'+(gov?'Ce que le pays vous rapporte':'Ce que le pays vous rapporterait')+'</div>'+
    (gov&&S.country.ex===false? gRow('Impôt sur les sociétés évité','suspendu','vous avez renoncé à l’exonération') : gRow('Impôt sur les sociétés évité',g.n? '+'+eur(g.tax,0)+' / mois' : '—',g.n? plu(g.n,'société')+' du pays n’en paient plus' : 'aucune de vos sociétés dans le pays'))+
    gRow('Ventes de vos sociétés du pays',g.n? '+'+eur(g.sales,0)+' / j' : '—','+5 %, en plus du bonus de chaque ville')+
    gRow('Recettes fiscales nettes',signed(g.fisc,0)+' / j','impôts moins dépenses publiques, réglables')+
    gRow('Prestige','+'+fmtN(g.pr),'1 point par 100 M€ du prix, plus réputation +10')+gRow('Influence politique','+'+CTY_INF/.002+' à terme','plus 100 par ville possédée')+(gov? ctyExHtml() : '')+'</div>'; }
function pxCountries(){ let h='<div class="notice info">Une ville achetée vous verse les loyers de ses locataires et fait vendre 5 % de plus à vos sociétés qui s’y trouvent. Avec les trois villes d’un pays, vous pouvez acheter le pays : vos sociétés n’y paient plus l’impôt sur les sociétés et vendent encore 5 % de plus.</div>';
  if(S.country){ const c=D.COUNTRIES.find(x=>x.id===S.country.id); const o=_vLuxeOld(), k=o.indexOf('<div class="cat-h">Pays entiers</div>');
    h+='<section class="card px-cty"><div class="px-ch">'+ctyFlag(c.id)+'<div><b>'+esc(c.n)+'</b><small>Vous gouvernez ce pays</small></div></div>'+ctyGainHtml(c)+'</section>'+(k>=0? o.slice(k+'<div class="cat-h">Pays entiers</div>'.length) : ''); return h; }
  return h+'<div class="px-list">'+D.COUNTRIES.map(c=>{ const lock=!unlocked(c.tier), have=c.cities.filter(cityOwned).length;
    return '<section class="card px-cty'+(lock?' lock':'')+'"><div class="px-ch">'+ctyFlag(c.id)+'<div><b>'+esc(c.n)+'</b><small>'+esc(c.pop)+' · PIB '+eur(c.gdp,0)+' par an</small></div></div>'+
      '<div class="px-cv">'+c.cities.map(x=>'<span class="'+(cityOwned(x)?'on':'')+'">'+(cityOwned(x)?'✓ ':'')+esc(cityVisible(x)?D.CITIES[x].n:'Ville à découvrir')+'</span>').join('')+'</div>'+ctyGainHtml(c)+
      '<div class="px-a">'+(lock? '<span class="sub">Palier '+esc(D.TIERS[c.tier].n)+' requis</span>' : have<3? '<span class="sub">Possédez les trois villes ('+have+' / 3)</span>' : btn('Acheter le pays · '+eur(c.price,0),'buycountry',{c:'sm pri',i:c.id,dis:S.cash<c.price,why:'Trésorerie insuffisante : il manque '+eur(c.price-S.cash,0)+'.'}))+'</div></section>'; }).join('')+'</div>'; }
{ const _vl=vLuxe; vLuxe=function(){ const t=ui.lx; if(t!=='country') return _vl(); const o=_vl(), k=o.indexOf('<div class="px-tabs"'); const j=o.indexOf('</button></div>',k); return (j>0? o.slice(0,j+'</button></div>'.length) : o)+pxCountries(); }; VIEWS.luxe=vLuxe; }
(function(){ const st=document.createElement('style'); st.textContent=`
.cg{margin-top:10px;border-top:1px solid var(--line);padding-top:8px}
.cg-h{font:800 12.5px var(--f-body);color:var(--ink-2);margin-bottom:4px}
.cg-r{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:13px;border-bottom:1px dashed var(--line)}
.cg-r:last-child{border-bottom:0}.cg-r small{display:block;font-size:11px;color:var(--ink-3)}.cg-r b{white-space:nowrap}
.px-cty{padding:14px}.px-cty.lock{opacity:.75}
.px-ch{display:flex;gap:12px;align-items:center}.px-ch b{display:block;font:800 17px var(--f-display)}.px-ch small{display:block;font-size:12px;color:var(--ink-3)}
.px-cv{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.px-cv span{font:700 12px var(--f-body);padding:4px 9px;border-radius:999px;background:var(--paper-2);color:var(--ink-3)}.px-cv span.on{background:var(--green-soft);color:var(--green)}
`; document.head.appendChild(st); })();


