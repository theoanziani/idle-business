/* ============================================================
   NOUVELLE FICHE : illustrations détaillées (voitures, tableaux, silhouettes, vêtements,
   électronique, ferme, colis, chantier). Chaque bibliothèque est isolée dans NFA.<nom>.
   ============================================================ */
const NFA={};
NFA.cars=(function(){
/* Voitures vues de profil, avant à droite. car(type, couleur, largeur) */
let CAR_N=0;
function shade(hex,f){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=n>>8&255,b=n&255;
  if(f<0){ r*=1+f; g*=1+f; b*=1+f; } else { r+=(255-r)*f; g+=(255-g)*f; b+=(255-b)*f; }
  return '#'+[r,g,b].map(x=>Math.round(x).toString(16).padStart(2,'0')).join(''); }
const CAR_T={
  citadine:{w:[30,88], r:10, body:'M12 41 C11 33 13 30 17 29 L20 16 C21 13.5 23 12.5 26 12.5 L70 12.5 C74 12.5 77 13.5 80 16.5 L90 28 L101 30 C106 31 108 34 108 40 L108 43 L12 43 Z',
    win:['M23 27 L25.5 16 L46 16 L46 27 Z','M49 16 L69 16 C72 16 74.5 17 77 19.5 L84.5 27 L49 27 Z'], door:[47.5], line:'M14 31 L106 32', lamp:[103,31], tail:[13,30]},
  berline:{w:[29,92], r:10, body:'M5 40 C5 34 8 31.5 15 31 L33 29 L43 18 C45 15.5 48 14.5 52 14.5 L77 14.5 C81 14.5 84 15.5 87 18.5 L97 28.5 L109 30.5 C114 31.5 116 34.5 116 40 L116 43 L5 43 Z',
    win:['M45.5 28 L52 18 L63 18 L63 28 Z','M66 18 L77 18 C80 18 82.5 19 85 21.5 L91.5 28 L66 28 Z'], door:[64.5], line:'M7 33 L114 33.5', lamp:[110,32], tail:[7,32]},
  break:{w:[29,92], r:10, body:'M5 40 C5 32 6.5 29.5 10 28.5 L13 15.5 C14 13.5 16 13 19 13 L78 13 C82 13 85 14 88 17 L98 28.5 L109 30.5 C114 31.5 116 34.5 116 40 L116 43 L5 43 Z',
    win:['M16 27 L18 16 L40 16 L40 27 Z','M43 16 L63 16 L63 28 L43 28 Z','M66 16 L78 16 C81 16 83.5 17 86 19.5 L93 28 L66 28 Z'], door:[41.5,64.5], line:'M7 32.5 L114 33.5', lamp:[110,32], tail:[7,31]},
  suv:{w:[29,91], r:11.5, body:'M5 41 C4.5 30 6 27.5 9 26.5 L11 11.5 C12 9.5 14 9 17 9 L80 9 C84 9 86.5 10 89.5 13 L101 26 L109 28 C113.5 29 115.5 32 115.5 41 L115.5 44 L5 44 Z',
    win:['M14 25 L15.5 12.5 L38 12.5 L38 25 Z','M41 12.5 L62 12.5 L62 25.5 L41 25.5 Z','M65 12.5 L79 12.5 C82 12.5 84.5 13.5 87 16 L96 25.5 L65 25.5 Z'], door:[39.5,63.5], line:'M7 30 L113 31', lamp:[110,30], tail:[7,29], rack:true},
  coupe:{w:[30,92], r:10, body:'M5 39.5 C5 35 9 33 19 32 L39 30.5 L53 21 C56 19 59 18.5 63 18.5 L78 18.5 C82 18.5 85 19.5 88 21.5 L99 29.5 L111 31.5 C115 32.5 116 35 116 39.5 L116 42 L5 42 Z',
    win:['M55 29.5 L60 21.5 L72 21.5 L72 29.5 Z','M75 21.5 L79 21.5 C82 21.5 84 22.3 86 24 L92 29.5 L75 29.5 Z'], door:[73.5], line:'M7 34 L114 34.5', lamp:[111,33.5], tail:[6,33.5], spoiler:true}
};
function wheel(cx,cy,r,id){ let s='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="#1d1f23"/><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.66)+'" fill="url(#rim'+id+')"/>';
  for(let k=0;k<5;k++){ const a=k*Math.PI*2/5-Math.PI/2, x=cx+Math.cos(a)*r*.6, y=cy+Math.sin(a)*r*.6; s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="#6b737e" stroke-width="'+(r*.2).toFixed(1)+'" stroke-linecap="round"/>'; }
  return s+'<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*.18)+'" fill="#e6e9ee" stroke="#8a929c" stroke-width=".6"/><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#33363c" stroke-width="1.2"/>'; }
function car(type,c,w){ const T=CAR_T[type]||CAR_T.berline, id=++CAR_N, W=w||110, H=Math.round(W*56/120);
  const hi=shade(c,.45), mid=c, lo=shade(c,-.35), wy=(type==='suv'?44:43);
  const nums=T.body.match(/[\d.]+/g).map(Number), xs=nums.filter((v,i)=>i%2===0), maxX=Math.max(...xs), minX=Math.min(...xs);
  const wt=Math.min(...T.win.join(' ').match(/[\d.]+/g).map(Number).filter((v,i)=>i%2===1));
  let s='<svg width="'+W+'" height="'+H+'" viewBox="0 0 120 56"><defs>'+
   '<linearGradient id="bd'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+hi+'"/><stop offset=".45" stop-color="'+mid+'"/><stop offset="1" stop-color="'+lo+'"/></linearGradient>'+
   '<linearGradient id="gl'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9eefb"/><stop offset=".55" stop-color="#7fa4bf"/><stop offset="1" stop-color="#3b5266"/></linearGradient>'+
   '<radialGradient id="rim'+id+'"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#9aa2ad"/></radialGradient></defs>'+
   '<ellipse cx="60" cy="'+(wy+6)+'" rx="56" ry="3.2" fill="rgba(0,0,0,.22)"/>';
  if(T.rack) s+='<rect x="22" y="6.5" width="52" height="2" rx="1" fill="#2b2f35"/><rect x="28" y="7" width="2" height="3" fill="#2b2f35"/><rect x="66" y="7" width="2" height="3" fill="#2b2f35"/>';
  s+='<path d="'+T.body+'" fill="url(#bd'+id+')" stroke="'+shade(c,-.5)+'" stroke-width=".8"/>';
  /* passages de roue */
  T.w.forEach(x=>{ s+='<path d="M'+(x-T.r-2.5)+' '+wy+' A'+(T.r+2.5)+' '+(T.r+2.5)+' 0 0 1 '+(x+T.r+2.5)+' '+wy+' Z" fill="#141518"/>'; });
  /* vitres, montants */
  s+=T.win.map(p=>'<path d="'+p+'" fill="url(#gl'+id+')" stroke="#22262b" stroke-width="1.2" stroke-linejoin="round"/>').join('');
  /* reflet sur les vitres */
  s+='<path d="M'+(T.win[0].match(/M([\d.]+)/)[1]*1+4)+' '+(type==='suv'?23:26)+' l8 -8 l3 0 l-8 8 z" fill="rgba(255,255,255,.35)"/>';
  /* ligne de caisse, portes, poignées */
  s+='<path d="'+T.line+'" stroke="'+shade(c,.6)+'" stroke-width=".9" opacity=".7"/>';
  T.door.forEach(x=>{ s+='<line x1="'+x+'" y1="'+wt+'" x2="'+(x+.5)+'" y2="'+(wy-1)+'" stroke="'+shade(c,-.45)+'" stroke-width=".8"/><rect x="'+(x+4)+'" y="'+(type==='suv'?29:31.5)+'" width="6" height="1.6" rx=".8" fill="'+shade(c,-.5)+'"/>'; });
  /* rétroviseur, phares, feux, pare-chocs */
  const L=T.lamp, Tl=T.tail;
  s+='<rect x="'+(L[0]-6)+'" y="'+(L[1]-1.8)+'" width="7" height="3.6" rx="1.6" fill="#fff8d6" stroke="#9a8f5a" stroke-width=".5"/><rect x="'+(L[0]-5)+'" y="'+(L[1]-1)+'" width="3" height="2" rx="1" fill="#fff"/>';
  s+='<rect x="'+Tl[0]+'" y="'+(Tl[1]-1.6)+'" width="4" height="3.4" rx="1.2" fill="#d22d2d"/>';
  s+='<rect x="'+(maxX-11)+'" y="'+(wy-5)+'" width="12" height="3.2" rx="1.5" fill="'+shade(c,-.55)+'"/>';
  s+='<rect x="'+(minX-1)+'" y="'+(wy-5)+'" width="11" height="3.2" rx="1.5" fill="'+shade(c,-.55)+'"/>';
  /* rétroviseur */
  const ws=T.win[T.win.length-1].match(/[\d.]+/g).map(Number), mx=ws[0]+6;
  s+='<path d="M'+(maxX-30)+' '+(wt+8)+' l5 -1 l1 3 l-5 1 z" fill="'+shade(c,-.4)+'"/>';
  if(T.spoiler) s+='<path d="M5 31 L16 30.5 L16 29 L6 29.5 Z" fill="'+shade(c,-.5)+'"/>';
  /* reflet de carrosserie */
  s+='<path d="M14 '+(type==='suv'?27:30)+' Q60 '+(type==='suv'?24:27)+' 106 '+(type==='suv'?28:31)+'" stroke="rgba(255,255,255,.55)" stroke-width="1.4" fill="none"/>';
  s+=wheel(T.w[0],wy,T.r,id)+wheel(T.w[1],wy,T.r,id);
  return s+'</svg>'; }

return {car};
})();
NFA.paint=(function(){
/* Tableaux détaillés, dessinés en SVG. paint(sujet, largeur, hauteur) */
let PT_N=0;
function paint(kind,W,H){ const id='pt'+(++PT_N); let d='', s='';
  const vb='0 0 100 '+Math.round(100*H/W), h=Math.round(100*H/W);
  /* grain de toile commun */
  d+='<filter id="'+id+'g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="'+PT_N+'"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>';
  d+='<filter id="'+id+'b"><feGaussianBlur stdDeviation="1.6"/></filter><filter id="'+id+'s"><feGaussianBlur stdDeviation=".5"/></filter>';
  if(kind==='geo'){ /* Composition bleue : formes géométriques à la Kandinsky */
    d+='<linearGradient id="'+id+'a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f5d8a"/><stop offset="1" stop-color="#16324f"/></linearGradient>';
    s+='<rect width="100" height="'+h+'" fill="url(#'+id+'a)"/>';
    s+='<circle cx="64" cy="'+(h*.3)+'" r="20" fill="#e9c46a"/><circle cx="64" cy="'+(h*.3)+'" r="13" fill="#d1495b"/><circle cx="64" cy="'+(h*.3)+'" r="6" fill="#1d3557"/>';
    s+='<path d="M8 '+(h*.88)+' L44 '+(h*.38)+' L58 '+(h*.88)+' Z" fill="#f4a261" opacity=".92"/>';
    s+='<rect x="14" y="'+(h*.12)+'" width="26" height="18" fill="#a8dadc" transform="rotate(-12 27 '+(h*.2)+')"/>';
    s+='<line x1="4" y1="'+(h*.62)+'" x2="96" y2="'+(h*.48)+'" stroke="#f1faee" stroke-width="1.6"/><line x1="30" y1="4" x2="82" y2="'+(h-6)+'" stroke="#111" stroke-width="1.2"/>';
    s+='<path d="M70 '+(h*.7)+' q8 -10 16 0 t16 0" stroke="#e9c46a" stroke-width="2" fill="none"/>';
    for(let i=0;i<9;i++) s+='<circle cx="'+(12+i*9)+'" cy="'+(h*.95-(i%3)*3)+'" r="'+(1+i%3*.6)+'" fill="'+['#f1faee','#e9c46a','#d1495b'][i%3]+'"/>';
    s+='<path d="M78 '+(h*.55)+' l12 -6 l-3 12 z" fill="#111"/><circle cx="22" cy="'+(h*.55)+'" r="5" fill="none" stroke="#f1faee" stroke-width="1.3"/>';
  }
  if(kind==='lemons'){ /* Nature morte aux citrons */
    d+='<radialGradient id="'+id+'w" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#5a4632"/><stop offset="1" stop-color="#1f1710"/></radialGradient>';
    d+='<linearGradient id="'+id+'t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9dfcf"/><stop offset="1" stop-color="#b9ab95"/></linearGradient>';
    d+='<radialGradient id="'+id+'l" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff3a3"/><stop offset=".55" stop-color="#f2c21b"/><stop offset="1" stop-color="#b98a0a"/></radialGradient>';
    d+='<linearGradient id="'+id+'j" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2e4a6b"/><stop offset=".35" stop-color="#6f8fb3"/><stop offset="1" stop-color="#1c2f45"/></linearGradient>';
    s+='<rect width="100" height="'+h+'" fill="url(#'+id+'w)"/>';
    s+='<path d="M0 '+(h*.62)+' L100 '+(h*.58)+' L100 '+h+' L0 '+h+' Z" fill="url(#'+id+'t)"/>';
    s+='<path d="M8 '+(h*.62)+' Q20 '+(h*.78)+' 12 '+h+' L40 '+h+' Q34 '+(h*.75)+' 44 '+(h*.61)+' Z" fill="#f7f2e8" opacity=".85"/>';
    /* cruche */
    s+='<path d="M54 '+(h*.62)+' C48 '+(h*.5)+' 50 '+(h*.34)+' 58 '+(h*.3)+' L60 '+(h*.2)+' L74 '+(h*.2)+' L76 '+(h*.3)+' C84 '+(h*.34)+' 86 '+(h*.5)+' 80 '+(h*.62)+' Z" fill="url(#'+id+'j)"/>';
    s+='<path d="M80 '+(h*.36)+' q10 2 6 14 q-2 4 -6 4" stroke="#24405e" stroke-width="2.4" fill="none"/>';
    s+='<path d="M58 '+(h*.36)+' q-3 8 0 18" stroke="rgba(255,255,255,.55)" stroke-width="1.6" fill="none"/>';
    s+='<ellipse cx="67" cy="'+(h*.2)+'" rx="7" ry="1.6" fill="#16263a"/>';
    /* citrons */
    [[24,.66,9],[38,.7,8],[30,.58,7.5]].forEach(([x,y,r],k)=>{ s+='<ellipse cx="'+(x+2)+'" cy="'+(h*y+r*.8)+'" rx="'+r+'" ry="2" fill="rgba(0,0,0,.25)" filter="url(#'+id+'s)"/>'+
      '<ellipse cx="'+x+'" cy="'+(h*y)+'" rx="'+r+'" ry="'+(r*.78)+'" fill="url(#'+id+'l)" transform="rotate('+(k*14-10)+' '+x+' '+(h*y)+')"/>'+
      '<circle cx="'+(x+r*.95)+'" cy="'+(h*y)+'" r="1.1" fill="#a07a08"/><ellipse cx="'+(x-r*.35)+'" cy="'+(h*y-r*.35)+'" rx="'+(r*.25)+'" ry="'+(r*.15)+'" fill="#fffbe0" opacity=".8"/>'; });
    s+='<path d="M30 '+(h*.5)+' q6 -6 12 -2 q-6 4 -12 2" fill="#3f6b2a"/>';
    /* citron coupé */
    s+='<circle cx="48" cy="'+(h*.8)+'" r="6" fill="#f2c21b"/><circle cx="48" cy="'+(h*.8)+'" r="4.8" fill="#fff1a8"/>';
    for(let i=0;i<8;i++){ const a=i*Math.PI/4; s+='<line x1="48" y1="'+(h*.8)+'" x2="'+(48+Math.cos(a)*4.6).toFixed(1)+'" y2="'+(h*.8+Math.sin(a)*4.6).toFixed(1)+'" stroke="#f2d25a" stroke-width=".6"/>'; }
    s+='<path d="M60 '+(h*.86)+' L86 '+(h*.82)+' L87 '+(h*.835)+' L61 '+(h*.875)+' Z" fill="#c9ced6"/><rect x="52" y="'+(h*.86)+'" width="9" height="2.2" rx="1" fill="#5a3a20" transform="rotate(-8 56 '+(h*.87)+')"/>';
  }
  if(kind==='portrait'){ /* Portrait de femme, à l'ancienne */
    d+='<radialGradient id="'+id+'bg" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#6b5440"/><stop offset="1" stop-color="#1e140e"/></radialGradient>';
    d+='<radialGradient id="'+id+'f" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#f3d3b8"/><stop offset=".7" stop-color="#d9a882"/><stop offset="1" stop-color="#a87455"/></radialGradient>';
    d+='<linearGradient id="'+id+'d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b4f6b"/><stop offset="1" stop-color="#18222f"/></linearGradient>';
    const cx=50, fy=h*.36;
    s+='<rect width="100" height="'+h+'" fill="url(#'+id+'bg)"/>';
    s+='<path d="M14 '+h+' C16 '+(h*.74)+' 30 '+(h*.64)+' 50 '+(h*.63)+' C70 '+(h*.64)+' 84 '+(h*.74)+' 86 '+h+' Z" fill="url(#'+id+'d)"/>';
    s+='<path d="M36 '+(h*.66)+' Q50 '+(h*.78)+' 64 '+(h*.66)+'" fill="#e9d8c4" opacity=".9"/>';
    s+='<path d="M44 '+(h*.5)+' L44 '+(h*.64)+' Q50 '+(h*.68)+' 56 '+(h*.64)+' L56 '+(h*.5)+' Z" fill="#cf9d79"/>';
    s+='<ellipse cx="'+cx+'" cy="'+(fy+h*.03)+'" rx="15" ry="'+(h*.17)+'" fill="url(#'+id+'f)"/>';
    s+='<path d="M34 '+(fy+h*.02)+' C32 '+(fy-h*.2)+' 68 '+(fy-h*.2)+' 66 '+(fy+h*.02)+' C64 '+(fy-h*.08)+' 52 '+(fy-h*.12)+' 40 '+(fy-h*.06)+' Z" fill="#2a1a10"/>';
    s+='<circle cx="'+cx+'" cy="'+(fy-h*.17)+'" r="8" fill="#2a1a10"/>';
    s+='<path d="M43 '+(fy+h*.01)+' q3 -1.6 6 0 M52 '+(fy+h*.01)+' q3 -1.6 6 0" stroke="#3a2416" stroke-width="1" fill="none"/>';
    s+='<ellipse cx="46" cy="'+(fy+h*.025)+'" rx="1.4" ry=".9" fill="#2a1a10"/><ellipse cx="55" cy="'+(fy+h*.025)+'" rx="1.4" ry=".9" fill="#2a1a10"/>';
    s+='<path d="M50 '+(fy+h*.04)+' q-1.5 '+(h*.04)+' 1.2 '+(h*.05)+'" stroke="#b07e5e" stroke-width=".8" fill="none"/>';
    s+='<path d="M46.5 '+(fy+h*.12)+' q3.5 1.6 7 0" stroke="#9c4a42" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    s+='<ellipse cx="42" cy="'+(fy+h*.08)+'" rx="3" ry="1.6" fill="#e59a86" opacity=".35"/><ellipse cx="58" cy="'+(fy+h*.08)+'" rx="3" ry="1.6" fill="#e59a86" opacity=".35"/>';
    s+='<circle cx="35.5" cy="'+(fy+h*.07)+'" r="1.4" fill="#f5f1e6"/>';
    s+='<path d="M30 '+(h*.68)+' q20 10 40 0" stroke="#f5f1e6" stroke-width="1" stroke-dasharray="1.2 1.4" fill="none"/>';
  }
  if(kind==='winter'){ /* Paysage d'hiver */
    d+='<linearGradient id="'+id+'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb3d4"/><stop offset=".6" stop-color="#e4d7cf"/><stop offset="1" stop-color="#f3e2c9"/></linearGradient>';
    s+='<rect width="100" height="'+h+'" fill="url(#'+id+'k)"/>';
    s+='<circle cx="74" cy="'+(h*.3)+'" r="7" fill="#fff4dc" opacity=".9"/>';
    s+='<path d="M0 '+(h*.55)+' L16 '+(h*.36)+' L28 '+(h*.48)+' L44 '+(h*.28)+' L62 '+(h*.5)+' L78 '+(h*.38)+' L100 '+(h*.54)+' L100 '+h+' L0 '+h+'Z" fill="#9aa8bd"/>';
    s+='<path d="M40 '+(h*.32)+' L44 '+(h*.28)+' L49 '+(h*.33)+' L46 '+(h*.32)+' L43 '+(h*.35)+'Z" fill="#fff"/><path d="M13 '+(h*.4)+' L16 '+(h*.36)+' L20 '+(h*.41)+'Z" fill="#fff"/>';
    s+='<path d="M0 '+(h*.7)+' Q30 '+(h*.58)+' 60 '+(h*.68)+' T100 '+(h*.64)+' L100 '+h+' L0 '+h+'Z" fill="#eef2f6"/>';
    s+='<path d="M0 '+(h*.86)+' Q40 '+(h*.76)+' 100 '+(h*.84)+' L100 '+h+' L0 '+h+'Z" fill="#fbfcfd"/>';
    s+='<path d="M20 '+(h*.88)+' Q46 '+(h*.82)+' 60 '+(h*.74)+'" stroke="#c9d3df" stroke-width="2" fill="none"/>';
    const tree=(x,y,k)=>{ let t='<rect x="'+(x-.8)+'" y="'+(y-1)+'" width="1.6" height="4" fill="#4a3424"/>'; for(let i=0;i<3;i++){ const w=(7-i*1.8)*k, yy=y-i*4*k; t+='<path d="M'+(x-w)+' '+yy+' L'+x+' '+(yy-7*k)+' L'+(x+w)+' '+yy+'Z" fill="#2f5240"/><path d="M'+(x-w*.6)+' '+(yy-1)+' L'+x+' '+(yy-7*k)+' L'+(x+w*.3)+' '+(yy-2)+'Z" fill="#f4f7fa" opacity=".8"/>'; } return t; };
    s+=tree(12,h*.76,1)+tree(22,h*.8,1.2)+tree(84,h*.72,.9)+tree(92,h*.78,1.1)+tree(76,h*.66,.6);
    s+='<rect x="52" y="'+(h*.6)+'" width="13" height="8" fill="#8a4b32"/><path d="M50 '+(h*.6)+' L58.5 '+(h*.53)+' L67 '+(h*.6)+'Z" fill="#f4f7fa"/><rect x="55" y="'+(h*.62)+'" width="3" height="3" fill="#ffd36b"/><rect x="61" y="'+(h*.555)+'" width="2" height="3" fill="#5a3a26"/>';
    s+='<path d="M62 '+(h*.55)+' q-2 -4 1 -7 q3 -3 0 -7" stroke="#dfe5ec" stroke-width="1.4" fill="none" opacity=".8"/>';
    for(let i=0;i<26;i++) s+='<circle cx="'+((i*37)%100)+'" cy="'+(((i*53)%100)/100*h*.9)+'" r=".7" fill="#fff" opacity=".85"/>';
  }
  if(kind==='rothko'){ /* Abstraction rouge : grands champs de couleur */
    s+='<rect width="100" height="'+h+'" fill="#7a1a1a"/>';
    s+='<rect x="9" y="'+(h*.08)+'" width="82" height="'+(h*.42)+'" rx="3" fill="#d1452f" filter="url(#'+id+'b)"/>';
    s+='<rect x="9" y="'+(h*.56)+'" width="82" height="'+(h*.08)+'" rx="2" fill="#2a0c0c" filter="url(#'+id+'b)"/>';
    s+='<rect x="9" y="'+(h*.7)+'" width="82" height="'+(h*.22)+'" rx="3" fill="#e57a3b" filter="url(#'+id+'b)"/>';
    for(let i=0;i<14;i++) s+='<path d="M'+(10+i*6)+' '+(h*.1)+' q2 '+(h*.2)+' 0 '+(h*.38)+'" stroke="rgba(255,190,150,.12)" stroke-width="2" fill="none"/>';
  }
  return '<svg width="'+W+'" height="'+H+'" viewBox="'+vb+'" preserveAspectRatio="xMidYMid slice" style="display:block"><defs>'+d+'</defs>'+s+'<rect width="100" height="'+h+'" fill="#fff" filter="url(#'+id+'g)"/></svg>'; }

return {paint};
})();
NFA.fashion=(function(){
/* Croquis de mode détaillés : silhouette, visage, coiffure, tenue avec plis, matières et accessoires.
   fig(style, couleur, largeur, peau) — viewBox 0 0 100 260 */
let FG_N=0;
function fshade(hex,f){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=n>>8&255,b=n&255;
  if(f<0){ r*=1+f; g*=1+f; b*=1+f; } else { r+=(255-r)*f; g+=(255-g)*f; b+=(255-b)*f; }
  return '#'+[r,g,b].map(x=>Math.round(x).toString(16).padStart(2,'0')).join(''); }
function fig(sty,c,W,skin){ const id='fg'+(++FG_N), H=Math.round(W*2.6), sk=skin||'#E9C3A6', sk2=fshade(sk,-.18), hi=fshade(c,.42), lo=fshade(c,-.38), lo2=fshade(c,-.55);
  const HAIR={cla:'#2a1d16',avg:'#111',min:'#6b4a2e',rom:'#8a5a2b',str:'#1c1c1c',bar:'#3a2214'}[sty]||'#2a1d16';
  let d='<linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+lo+'"/><stop offset=".38" stop-color="'+c+'"/><stop offset=".62" stop-color="'+hi+'"/><stop offset="1" stop-color="'+lo+'"/></linearGradient>'+
    '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+sk2+'"/><stop offset=".5" stop-color="'+sk+'"/><stop offset="1" stop-color="'+sk2+'"/></linearGradient>'+
    '<radialGradient id="'+id+'f" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="'+fshade(sk,.15)+'"/><stop offset="1" stop-color="'+sk2+'"/></radialGradient>';
  /* motifs de matière */
  if(sty==='cla') d+='<pattern id="'+id+'p" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 0 L3 3 M3 0 L0 3" stroke="'+hi+'" stroke-width=".35" opacity=".5"/></pattern>';
  if(sty==='bar') d+='<pattern id="'+id+'p" width="10" height="12" patternUnits="userSpaceOnUse"><path d="M5 1 C8 3 8 6 5 7 C2 6 2 3 5 1 Z M5 7 C6 9 6 10 5 11 C4 10 4 9 5 7" fill="none" stroke="#d4af37" stroke-width=".6" opacity=".8"/><circle cx="0" cy="6" r=".8" fill="#d4af37" opacity=".7"/><circle cx="10" cy="6" r=".8" fill="#d4af37" opacity=".7"/></pattern>';
  if(sty==='rom') d+='<pattern id="'+id+'p" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".5" fill="#fff" opacity=".55"/></pattern>';
  if(sty==='avg') d+='<linearGradient id="'+id+'m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f7f7"/><stop offset=".3" stop-color="#9aa0a8"/><stop offset=".55" stop-color="#ffffff"/><stop offset=".8" stop-color="#7d838c"/><stop offset="1" stop-color="#d9dde2"/></linearGradient>';
  if(sty==='str') d+='<pattern id="'+id+'p" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 2 H4" stroke="'+hi+'" stroke-width=".4" opacity=".35"/></pattern>';
  let s='<ellipse cx="50" cy="253" rx="24" ry="3.2" fill="rgba(0,0,0,.16)"/>';
  const fold=(p,o)=>'<path d="'+p+'" fill="none" stroke="'+lo2+'" stroke-width=".9" opacity="'+(o||.55)+'" stroke-linecap="round"/>';
  const shine=(p)=>'<path d="'+p+'" fill="none" stroke="'+hi+'" stroke-width="1.4" opacity=".6" stroke-linecap="round"/>';
  /* jambes galbées, escarpins */
  const legs='<path d="M44.5 150 C43 180 43.5 210 42.6 240 L46.2 240 C47 210 48.5 180 49.5 152 Z" fill="url(#'+id+'s)"/><path d="M55.5 150 C57 180 56.5 210 57.4 240 L53.8 240 C53 210 51.5 180 50.5 152 Z" fill="url(#'+id+'s)"/>';
  const heels=(col)=>'<path d="M40.5 240 Q44 238 47 240 L48.5 246 L46.5 246 L46 243 L41 246 Q39.5 245 40.5 240Z M53 240 Q56 238 59.5 240 Q60.5 245 59 246 L54 243 L53.5 246 L51.5 246Z" fill="'+(col||'#16161a')+'"/><path d="M41 245.5 L46 243" stroke="#fff" stroke-width=".4" opacity=".4"/>';
  /* bras fins avec mains */
  const arms=(sl,len)=>{ const L=len||0; return '<path d="M38.5 50 C33.5 66 32 86 33.5 110 L36.6 110 C36.4 88 38.6 70 42 58 Z" fill="'+(sl||'url(#'+id+'s)')+'"/><path d="M61.5 50 C66.5 66 68 86 66.5 110 L63.4 110 C63.6 88 61.4 70 58 58 Z" fill="'+(sl||'url(#'+id+'s)')+'"/>'+
    '<path d="M33.2 109 C32 113 32.5 118 34.6 119.5 C36.4 118.5 37 114 36.8 109 Z" fill="'+sk+'"/><path d="M66.8 109 C68 113 67.5 118 65.4 119.5 C63.6 118.5 63 114 63.2 109 Z" fill="'+sk+'"/>'+
    (sl&&L? '<path d="M33.3 106 L36.7 106" stroke="'+lo2+'" stroke-width="1.4"/><path d="M63.3 106 L66.7 106" stroke="'+lo2+'" stroke-width="1.4"/>' : ''); };
  /* tête : visage, yeux, sourcils, lèvres, coiffure selon le style */
  const head=()=>{ let h='<path d="M47.2 37 L47.2 47 Q50 49 52.8 47 L52.8 37 Z" fill="url(#'+id+'s)"/><path d="M47.2 44 Q50 46.5 52.8 44" stroke="'+sk2+'" stroke-width=".8" fill="none" opacity=".7"/>';
    h+='<ellipse cx="50" cy="29" rx="7.6" ry="9.6" fill="url(#'+id+'f)"/>';
    h+='<path d="M45.6 27.4 q1.4 -.9 2.8 0 M51.6 27.4 q1.4 -.9 2.8 0" stroke="#2b1b12" stroke-width=".6" fill="none"/>';
    h+='<ellipse cx="47" cy="29.2" rx="1.1" ry=".65" fill="#2b1b12"/><ellipse cx="53" cy="29.2" rx="1.1" ry=".65" fill="#2b1b12"/><circle cx="47.3" cy="29" r=".25" fill="#fff"/><circle cx="53.3" cy="29" r=".25" fill="#fff"/>';
    h+='<path d="M50 30 q-.8 2.4 .4 3" stroke="'+sk2+'" stroke-width=".6" fill="none"/>';
    h+='<path d="M47.8 34.8 q2.2 1.2 4.4 0 q-2.2 -.7 -4.4 0" fill="#b5474a"/>';
    h+='<ellipse cx="45.6" cy="32.2" rx="1.6" ry=".9" fill="#e59a86" opacity=".35"/><ellipse cx="54.4" cy="32.2" rx="1.6" ry=".9" fill="#e59a86" opacity=".35"/>';
    if(sty==='cla') h+='<path d="M42.2 29 C41 17 59 15.5 58 29 C57 22 52 20 47 21.5 C44.5 22.5 43 25 42.2 29Z" fill="'+HAIR+'"/><ellipse cx="50" cy="19.5" rx="5" ry="3.5" fill="'+HAIR+'"/><circle cx="42.6" cy="32" r=".9" fill="#f5f1e6"/><circle cx="57.4" cy="32" r=".9" fill="#f5f1e6"/>';
    if(sty==='avg') h+='<path d="M42 31 C40 16 60 14 58.5 27 L58 23 C54 21 48 20 44 24 Z" fill="'+HAIR+'"/><path d="M42 31 L41 22 L50 18 Z" fill="'+HAIR+'"/><path d="M38 19 L64 12 L62 16 L40 23 Z" fill="#16161a"/><path d="M40 21 L63 14" stroke="#9aa0a8" stroke-width=".6"/>';
    if(sty==='min') h+='<path d="M42.4 30 C40.5 16 59.5 16 57.6 30 C57.2 24 54 21.5 50 21.5 C46 21.5 42.8 24 42.4 30 Z" fill="'+HAIR+'"/><path d="M42.4 30 C42 36 42.5 40 44 42 L44.5 30Z M57.6 30 C58 36 57.5 40 56 42 L55.5 30Z" fill="'+HAIR+'"/>';
    if(sty==='rom') h+='<path d="M42 30 C39.5 15 60.5 15 58 30 C57 23 53 20.5 50 20.5 C47 20.5 43 23 42 30Z" fill="'+HAIR+'"/>'+[0,1,2,3].map(i=>'<path d="M'+(42.5-i*.6)+' '+(32+i*4)+' q-3 2 -1 5 q2 2 -1 5" stroke="'+HAIR+'" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M'+(57.5+i*.6)+' '+(32+i*4)+' q3 2 1 5 q-2 2 1 5" stroke="'+HAIR+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>').join('').slice(0,9999)+'<path d="M44 19.5 Q50 16 56 19.5" stroke="#f3c6cf" stroke-width="2" fill="none"/><circle cx="56.5" cy="20" r="1.6" fill="#f3c6cf"/>';
    if(sty==='str') h+='<path d="M41.8 26 C41 15 59 15 58.2 26 Z" fill="#16161a"/><path d="M41 26 L64 26 Q63 28.5 58 28 L42 28 Z" fill="#16161a"/><path d="M44 20 L56 20" stroke="#fff" stroke-width=".7" opacity=".6"/><path d="M42.4 28 L43 33 M57.6 28 L57 33" stroke="'+HAIR+'" stroke-width="1.4"/><rect x="44.5" y="27.6" width="11" height="3.2" rx="1.4" fill="#111" opacity=".85"/>';
    if(sty==='bar') h+='<path d="M42 30 C40 15 60 15 58 30 C57 22 53 20 50 20 C47 20 43 22 42 30Z" fill="'+HAIR+'"/><ellipse cx="50" cy="16" rx="6.5" ry="5" fill="'+HAIR+'"/><path d="M43.5 18 L46 12 L48 16 L50 10 L52 16 L54 12 L56.5 18 Z" fill="#d4af37" stroke="#9a7a1e" stroke-width=".4"/><circle cx="50" cy="12.6" r="1" fill="#b5243a"/><path d="M42.4 31 l0 4" stroke="#d4af37" stroke-width=".8"/><circle cx="42.4" cy="36" r="1.1" fill="#b5243a"/><path d="M57.6 31 l0 4" stroke="#d4af37" stroke-width=".8"/><circle cx="57.6" cy="36" r="1.1" fill="#b5243a"/>';
    return h; };

  if(sty==='cla'){ /* tailleur en tweed, jupe crayon, ceinture, sac */
    s+=legs+heels()+arms('url(#'+id+')',1);
    s+='<path d="M37.5 50 Q50 44.5 62.5 50 L61 99 L39 99 Z" fill="url(#'+id+')"/><path d="M37.5 50 Q50 44.5 62.5 50 L61 99 L39 99 Z" fill="url(#'+id+'p)"/>';
    s+='<path d="M50 47 L45 62 L50 99 L55 62 Z" fill="'+lo+'"/><path d="M45 47 L50 60 L55 47" fill="none" stroke="'+hi+'" stroke-width="1.2"/><path d="M42 49 L46 64 L41 70 M58 49 L54 64 L59 70" fill="none" stroke="'+lo2+'" stroke-width="1"/>';
    s+=[60,70,80].map(y=>'<circle cx="51.5" cy="'+y+'" r="1.3" fill="#d4af37" stroke="#9a7a1e" stroke-width=".3"/>').join('')+'<path d="M41 78 L47 78 L47 84 L41 84Z M53 78 L59 78 L59 84 L53 84Z" fill="none" stroke="'+lo2+'" stroke-width=".8"/>';
    s+='<rect x="39" y="96" width="22" height="4.2" fill="#16161a"/><rect x="47.8" y="96" width="4.4" height="4.2" rx=".6" fill="none" stroke="#d4af37" stroke-width="1"/>';
    s+='<path d="M39.2 100 L38.6 160 L61.4 160 L60.8 100Z" fill="url(#'+id+')"/><path d="M39.2 100 L38.6 160 L61.4 160 L60.8 100Z" fill="url(#'+id+'p)"/>'+fold('M44 104 L43 158')+fold('M56 104 L57 158')+'<path d="M50 140 L50 160" stroke="'+lo2+'" stroke-width="1"/>';
    s+='<path d="M64 104 Q71 102 72 112 L72 128 L60 128 L60 112 Q61 104 64 104Z" fill="#7a2d22"/><path d="M62.5 106 Q66 98 70 106" fill="none" stroke="#d4af37" stroke-width=".9"/><rect x="64.6" y="114" width="3" height="2" fill="#d4af37"/>';
    s+=head(); }
  if(sty==='avg'){ /* volumes architecturaux métallisés, asymétrie */
    s+=legs+heels('#c9ced6')+arms();
    s+='<path d="M35 46 L72 38 L63 70 L68 150 L34 170 L40 100 Z" fill="url(#'+id+'m)"/><path d="M72 38 L90 30 L76 60 Z" fill="url(#'+id+'m)" stroke="#7d838c" stroke-width=".5"/><path d="M34 170 L68 150 L77 182 Z" fill="'+lo+'"/>';
    s+='<path d="M40 100 L66 90" stroke="#16161a" stroke-width="2.4"/><path d="M38 122 L66 130" stroke="#7d838c" stroke-width="1"/><path d="M36 140 L66 146" stroke="#7d838c" stroke-width=".7"/>';
    s+='<path d="M48 46 L56 100 L50 165" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/><path d="M63 70 L68 150" fill="none" stroke="#5c626a" stroke-width="1"/>';
    for(let i=0;i<6;i++) s+='<circle cx="'+(44+i*4.2)+'" cy="'+(103-i*1.6)+'" r=".9" fill="#16161a"/>';
    s+=head(); }
  if(sty==='min'){ /* robe colonne drapée, une épaule */
    s+='<path d="M41 241 Q44.5 239 47.6 241 L48.5 246 L41 246Z M52.4 241 Q55.5 239 59 241 L59 246 L51.5 246Z" fill="#16161a"/>'+arms();
    s+='<path d="M40 52 L60 48 Q61 74 62.5 100 L64.6 242 L35.4 242 L37.6 100 Q38.6 74 40 52Z" fill="url(#'+id+')"/>';
    s+='<path d="M60 48 L63 50 L62 56 Z" fill="'+lo+'"/>'+fold('M44 60 Q46 140 43 240',.45)+fold('M50 56 Q52 150 50 241',.35)+fold('M56 58 Q55 150 58 240',.45)+shine('M47 64 Q49 150 47 238');
    s+='<path d="M40 52 Q48 62 60 48" fill="none" stroke="'+lo2+'" stroke-width="1"/><path d="M38 100 Q50 104 62 100" fill="none" stroke="'+lo2+'" stroke-width=".7" opacity=".5"/>';
    s+='<path d="M36 242 Q50 236 64.6 242" fill="none" stroke="'+lo2+'" stroke-width="1"/>'+head(); }
  if(sty==='rom'){ /* robe de bal en tulle, volants, corsage brodé */
    s+=arms();
    s+='<path d="M40.5 50 Q50 46 59.5 50 L57 97 L43 97 Z" fill="url(#'+id+')"/><path d="M40.5 50 Q50 46 59.5 50 L57 97 L43 97 Z" fill="url(#'+id+'p)"/>';
    s+='<path d="M42 54 Q50 60 58 54" fill="none" stroke="#fff" stroke-width="2.2" opacity=".85"/><path d="M44 66 L50 94 L56 66" fill="none" stroke="'+lo2+'" stroke-width=".7" opacity=".6"/>';
    /* trois couches de tulle transparentes */
    s+='<path d="M43 97 C26 140 12 200 6 245 L94 245 C88 200 74 140 57 97 Z" fill="'+lo+'"/>';
    s+='<path d="M43 97 C30 140 18 200 12 243 L88 243 C82 200 70 140 57 97 Z" fill="url(#'+id+')" opacity=".92"/>';
    s+='<path d="M43 97 C34 140 26 190 22 236 L78 236 C74 190 66 140 57 97 Z" fill="'+hi+'" opacity=".35"/>';
    for(let i=0;i<5;i++){ const y=136+i*22, w=12+i*8.5; s+='<path d="M'+(50-w)+' '+y+' q'+(w/4)+' 5 '+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0" stroke="'+hi+'" stroke-width="1.8" fill="none" opacity=".9"/><path d="M'+(50-w)+' '+(y+2)+' q'+(w/4)+' 5 '+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0 t'+(w/2)+' 0" stroke="'+lo2+'" stroke-width=".7" fill="none" opacity=".5"/>'; }
    s+=fold('M46 100 Q40 170 30 240')+fold('M54 100 Q60 170 70 240')+fold('M50 100 L50 243',.3);
    s+='<path d="M42 97 Q50 101 58 97" fill="none" stroke="'+hi+'" stroke-width="2.6"/><path d="M52 96 q4 -4 7 0 q-3 4 -7 0 M52 96 q-4 -4 -7 0 q3 4 7 0" fill="'+fshade(c,.6)+'"/><circle cx="52" cy="96" r="1.4" fill="'+lo+'"/>';
    s+=head(); }
  if(sty==='str'){ /* sweat oversize, pantalon cargo, baskets */
    s+='<path d="M37.5 140 L33 242 L48.5 242 L50 152 L51.5 242 L67 242 L62.5 140 Z" fill="#2b2f35"/><path d="M37.5 140 L33 242 L48.5 242 L50 152 L51.5 242 L67 242 L62.5 140 Z" fill="url(#'+id+'p)"/>';
    s+='<path d="M35 176 L45 176 L45 192 L35 192Z M55 176 L65 176 L65 192 L55 192Z" fill="#363b43" stroke="#1d2025" stroke-width=".7"/>'+'<path d="M41 150 L40 240 M59 150 L60 240" stroke="#1d2025" stroke-width=".7"/>';
    s+='<path d="M31 240 L49 240 L50 247 L30 247 Q29 243 31 240Z M51 240 L69 240 Q71 243 70 247 L50 247Z" fill="#f2f2f2" stroke="#c9ced6" stroke-width=".6"/><path d="M30 246 L50 246 M50 246 L70 246" stroke="#d62828" stroke-width="1.4"/><path d="M35 242 L40 242 M55 242 L60 242" stroke="#9aa2ae" stroke-width=".8"/>';
    s+='<path d="M33 50 Q50 41 67 50 L74 118 L67 121 L65 143 L35 143 L33 121 L26 118 Z" fill="url(#'+id+')"/><path d="M33 50 Q50 41 67 50 L74 118 L67 121 L65 143 L35 143 L33 121 L26 118 Z" fill="url(#'+id+'p)"/>';
    s+='<path d="M41 46 Q50 62 59 46 Q50 40 41 46Z" fill="'+lo+'"/><path d="M46.5 56 L46 72 M53.5 56 L54 72" stroke="#f2f2f2" stroke-width="1"/><circle cx="46" cy="73" r="1" fill="#c9ced6"/><circle cx="54" cy="73" r="1" fill="#c9ced6"/>';
    s+='<rect x="38.5" y="78" width="23" height="11" rx="2" fill="#f2f2f2"/><text x="50" y="86.4" text-anchor="middle" font-size="6" font-weight="900" fill="'+lo+'" font-family="sans-serif" letter-spacing=".5">MAISON</text>';
    s+='<path d="M39 102 L61 102 L58 116 L42 116Z" fill="'+lo+'" opacity=".55"/>'+fold('M36 60 Q38 100 35 140')+fold('M64 60 Q62 100 65 140')+'<path d="M35 138 L65 138" stroke="'+lo2+'" stroke-width="2.4"/><path d="M26 116 L33 119 M74 116 L67 119" stroke="'+lo2+'" stroke-width="2.4"/>';
    s+='<path d="M34.4 118 C33 122 33.6 126 35.6 127 C37 126 37.4 122 37 118Z M65.6 118 C67 122 66.4 126 64.4 127 C63 126 62.6 122 63 118Z" fill="'+sk+'"/>';
    s+=head(); }
  if(sty==='bar'){ /* robe de cour brodée d'or, col, traîne */
    s+=arms('url(#'+id+')',1);
    s+='<path d="M40 50 Q50 46 60 50 L57 100 L43 100 Z" fill="url(#'+id+')"/><path d="M40 50 Q50 46 60 50 L57 100 L43 100 Z" fill="url(#'+id+'p)"/>';
    s+='<path d="M50 51 L45.5 70 L50 100 L54.5 70 Z" fill="#d4af37"/><path d="M50 55 L47 70 L50 94 L53 70 Z" fill="'+lo+'"/>'+[60,70,80,90].map(y=>'<circle cx="50" cy="'+y+'" r="1.1" fill="#f5e6a8"/>').join('');
    s+='<path d="M43 100 C28 150 20 210 14 246 L86 246 C80 210 72 150 57 100 Z" fill="url(#'+id+')"/><path d="M43 100 C28 150 20 210 14 246 L86 246 C80 210 72 150 57 100 Z" fill="url(#'+id+'p)"/>';
    s+='<path d="M50 102 L38 246 L62 246 Z" fill="'+fshade(c,.15)+'" opacity=".55"/><path d="M50 102 L38 246 L62 246 Z" fill="url(#'+id+'p)"/>';
    s+=fold('M44 104 Q34 180 22 244')+fold('M56 104 Q66 180 78 244')+'<path d="M14 246 Q50 238 86 246" fill="none" stroke="#d4af37" stroke-width="2"/>';
    for(let i=0;i<9;i++) s+='<circle cx="'+(18+i*8)+'" cy="'+(242-Math.abs(4-i)*.6)+'" r="1.6" fill="#d4af37" stroke="#9a7a1e" stroke-width=".3"/>';
    s+='<path d="M34 52 Q50 36 66 52 L68 42 Q50 26 32 42Z" fill="#f5efe0" opacity=".9"/><path d="M34 52 Q50 36 66 52" fill="none" stroke="#d4af37" stroke-width="1"/>'+[0,1,2,3,4,5,6].map(i=>'<path d="M'+(33+i*5)+' '+(43-Math.sin(i/6*Math.PI)*6)+' l1.6 -4" stroke="#d4af37" stroke-width=".5"/>').join('');
    s+='<path d="M33.4 106 L36.8 106 M63.2 106 L66.6 106" stroke="#d4af37" stroke-width="2"/>'+head(); }
  return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 100 260"><defs>'+d+'</defs>'+s+'</svg>'; }

return {fig};
})();
NFA.textile=(function(){
/* Vêtements détaillés (matière, coutures, plis, boutons) et rouleaux de tissu, en SVG */
let TX_N=0;
function tshade(hex,f){ const n=parseInt(hex.slice(1),16); let r=n>>16,g=n>>8&255,b=n&255;
  if(f<0){ r*=1+f; g*=1+f; b*=1+f; } else { r+=(255-r)*f; g+=(255-g)*f; b+=(255-b)*f; }
  return '#'+[r,g,b].map(x=>Math.round(x).toString(16).padStart(2,'0')).join(''); }
/* texture de matière par vêtement */
function txPat(id,kind,c){ const lo=tshade(c,-.25), hi=tshade(c,.35);
  if(kind==='shirt') return '<pattern id="'+id+'t" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><rect width="1.2" height="1.2" fill="'+lo+'" opacity=".18"/><rect x="1.2" y="1.2" width="1.2" height="1.2" fill="'+lo+'" opacity=".18"/></pattern>';
  if(kind==='tee'||kind==='hoodie'||kind==='street') return '<pattern id="'+id+'t" width="3" height="2.6" patternUnits="userSpaceOnUse"><path d="M0 1.3 Q.75 0 1.5 1.3 T3 1.3" stroke="'+lo+'" stroke-width=".35" fill="none" opacity=".35"/></pattern>';
  if(kind==='denim') return '<pattern id="'+id+'t" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 3 L3 0 M-1 1 L1 -1 M2 4 L4 2" stroke="'+hi+'" stroke-width=".55" opacity=".45"/></pattern>';
  if(kind==='dress') return '<pattern id="'+id+'t" width="14" height="14" patternUnits="userSpaceOnUse">'+
    [[3,3,'#f6e7a8'],[10,9,'#f4f1ea']].map(([x,y,col])=>[0,72,144,216,288].map(a=>'<ellipse cx="'+(x+Math.cos(a*Math.PI/180)*1.7).toFixed(1)+'" cy="'+(y+Math.sin(a*Math.PI/180)*1.7).toFixed(1)+'" rx="1.3" ry=".9" transform="rotate('+a+' '+(x+Math.cos(a*Math.PI/180)*1.7).toFixed(1)+' '+(y+Math.sin(a*Math.PI/180)*1.7).toFixed(1)+')" fill="'+col+'"/>').join('')+'<circle cx="'+x+'" cy="'+y+'" r=".8" fill="#e07a5f"/>').join('')+
    '<path d="M6 11 q2 -2 4 0" stroke="#5b7a3a" stroke-width=".7" fill="none"/><path d="M12 4 q-1 2 -3 2" stroke="#5b7a3a" stroke-width=".7" fill="none"/></pattern>';
  return ''; }
function garment(kind,c,W,hanger){ const id='gm'+(++TX_N), lo=tshade(c,-.3), lo2=tshade(c,-.5), hi=tshade(c,.32); let s='';
  const st='stroke="'+lo2+'" stroke-width="1" stroke-linejoin="round"';
  const stitch=(p,col)=>'<path d="'+p+'" stroke="'+(col||tshade(c,.55))+'" stroke-width=".7" stroke-dasharray="1.4 1.2" fill="none"/>';
  const fold=(p,o)=>'<path d="'+p+'" stroke="'+lo2+'" stroke-width="1" fill="none" opacity="'+(o||.35)+'" stroke-linecap="round"/>';
  const btn=(x,y,col)=>'<circle cx="'+x+'" cy="'+y+'" r="1.7" fill="'+(col||'#f4f1ea')+'" stroke="'+lo2+'" stroke-width=".4"/><circle cx="'+(x-.5)+'" cy="'+(y-.5)+'" r=".28" fill="'+lo2+'"/><circle cx="'+(x+.5)+'" cy="'+(y+.5)+'" r=".28" fill="'+lo2+'"/>';
  const body=(p)=>'<path d="'+p+'" fill="url(#'+id+')" '+st+'/><path d="'+p+'" fill="url(#'+id+'t)"/>';
  const label='<rect x="46" y="15" width="8" height="5" rx=".6" fill="#f4f1ea" stroke="'+lo2+'" stroke-width=".3"/><path d="M47.5 17.5 h5" stroke="#d43f3a" stroke-width=".6"/>';
  if(kind==='shirt'){
    s=body('M30 12 L42 8 Q50 13 58 8 L70 12 L87 31 L77 41 L69 33 L69 91 Q50 95 31 91 L31 33 L23 41 L13 31 Z');
    s+='<path d="M41 8 L50 23 L59 8 L55 5.5 L50 11 L45 5.5Z" fill="'+hi+'" '+st+'/><path d="M45 5.5 L50 11 L55 5.5" fill="none" stroke="'+lo+'" stroke-width=".8"/>';
    s+='<path d="M48 23 L48 92 M52 23 L52 92" stroke="'+lo+'" stroke-width=".7"/>'+[32,45,58,71,84].map(y=>btn(50,y)).join('');
    s+='<path d="M34 42 L45 42 L45 52 L39.5 54 L34 52Z" fill="none" stroke="'+lo+'" stroke-width=".8"/>'+stitch('M34.8 44 L44.2 44');
    s+='<path d="M13 31 L23 41 L19 45 L9 35Z" fill="'+hi+'" '+st+'/><path d="M87 31 L77 41 L81 45 L91 35Z" fill="'+hi+'" '+st+'/>'+btn(15,38,'#fff')+btn(85,38,'#fff');
    s+=fold('M37 60 Q40 75 36 88')+fold('M63 58 Q60 74 64 88')+fold('M31 33 Q36 37 40 34',.25)+stitch('M31.8 89 Q50 93 68.2 89'); }
  if(kind==='hoodie'){
    s=body('M28 16 Q50 2 72 16 L89 45 L80 54 L71 41 L71 86 L29 86 L29 41 L20 54 L11 45 Z');
    s+='<path d="M29 84 L71 84 L71 93 L29 93Z" fill="'+lo+'" '+st+'/>'+[34,40,46,52,58,64].map(x=>'<line x1="'+x+'" y1="85" x2="'+x+'" y2="92" stroke="'+lo2+'" stroke-width=".5" opacity=".6"/>').join('');
    s+='<path d="M11 45 L20 54 L18 58 L8 49Z M89 45 L80 54 L82 58 L92 49Z" fill="'+lo+'" '+st+'/>';
    s+='<path d="M36 12 Q50 34 64 12 Q50 2 36 12Z" fill="'+lo2+'" opacity=".85"/><path d="M38 13 Q50 30 62 13" fill="none" stroke="'+hi+'" stroke-width="1"/>';
    s+='<path d="M46 22 Q45 30 44.5 38 M54 22 Q55 30 55.5 38" stroke="#f4f1ea" stroke-width="1.3" fill="none"/><rect x="43.6" y="37.5" width="1.8" height="3" rx=".6" fill="#c9ced6"/><rect x="54.6" y="37.5" width="1.8" height="3" rx=".6" fill="#c9ced6"/>';
    s+='<path d="M36 60 L64 60 L60 76 L40 76Z" fill="'+lo+'" opacity=".55"/>'+stitch('M36.6 61 L63.4 61')+fold('M40 60 Q42 68 40 76',.3)+fold('M32 44 Q35 64 32 82')+fold('M68 44 Q65 64 68 82');
    s+=label; }
  if(kind==='tee'){
    s=body('M32 12 Q50 20 68 12 L87 27 L79 39 L69 33 L69 91 Q50 94 31 91 L31 33 L21 39 L13 27 Z');
    s+='<path d="M39 12.6 Q50 23 61 12.6" fill="none" stroke="'+lo+'" stroke-width="2.4"/><path d="M39 12.6 Q50 21 61 12.6" fill="none" stroke="'+hi+'" stroke-width=".7"/>';
    s+=stitch('M14.6 29 L22 37.4')+stitch('M85.4 29 L78 37.4')+stitch('M32 88.6 Q50 92 68 88.6')+fold('M36 40 Q40 64 35 86')+fold('M64 40 Q60 64 65 86')+fold('M45 70 Q50 74 56 69',.25)+label; }
  if(kind==='dress'){
    s=body('M38 8 L44 8 L46.5 19 L53.5 19 L56 8 L62 8 L64.5 36 Q76 62 85 93 Q50 99 15 93 Q24 62 35.5 36 Z');
    s+='<path d="M35.5 36 Q50 41 64.5 36 L64 40 Q50 45 36 40Z" fill="'+lo+'"/><path d="M48 39 q2 -3 4 0 q-2 3 -4 0" fill="'+hi+'"/>';
    s+=fold('M42 42 Q34 70 24 92')+fold('M50 43 L50 96',.25)+fold('M58 42 Q66 70 76 92')+fold('M46 44 Q44 70 40 94',.2)+fold('M54 44 Q56 70 60 94',.2);
    s+='<path d="M15 93 q6 4 11 0 t11 0 t11 0 t11 0 t11 0 t11 0 t3 0" stroke="'+hi+'" stroke-width="1.4" fill="none"/>'+stitch('M44.6 9 L46.6 18.6')+stitch('M55.4 9 L53.4 18.6'); }
  if(kind==='street'){
    s=body('M24 16 Q50 6 76 16 L95 53 L84 59 L75 45 L75 87 L25 87 L25 45 L16 59 L5 53 Z');
    s+='<path d="M25 85 L75 85 L75 95 L25 95Z" fill="'+lo+'" '+st+'/><path d="M5 53 L16 59 L13 64 L2 58Z M95 53 L84 59 L87 64 L98 58Z" fill="'+lo+'" '+st+'/>';
    s+='<path d="M39 13.4 Q50 25 61 13.4" fill="none" stroke="'+lo+'" stroke-width="3.4"/>';
    s+='<rect x="34" y="34" width="32" height="20" rx="3" fill="#f4f1ea"/><text x="50" y="47.6" text-anchor="middle" font-size="9.5" font-weight="900" fill="'+lo2+'" font-family="sans-serif" letter-spacing="1">STR</text><path d="M37 50.4 L63 50.4" stroke="#d43f3a" stroke-width="1"/>';
    s+=fold('M30 30 Q34 60 29 84')+fold('M70 30 Q66 60 71 84')+fold('M16 40 L22 50',.3)+fold('M84 40 L78 50',.3)+label; }
  if(kind==='denim'){
    s=body('M30 12 L42 8 L50 16 L58 8 L70 12 L85 33 L85 72 L74 72 L72 42 L71 92 L29 92 L28 42 L26 72 L15 72 L15 33 Z');
    s+='<path d="M42 8 L50 30 L58 8 L54.5 6.5 L50 15 L45.5 6.5Z" fill="'+lo+'" '+st+'/><line x1="50" y1="30" x2="50" y2="92" stroke="'+lo2+'" stroke-width=".9"/>';
    s+='<path d="M33 38 L46 38 L46 50 L39.5 52.5 L33 50Z M54 38 L67 38 L67 50 L60.5 52.5 L54 50Z" fill="'+tshade(c,-.1)+'" stroke="'+lo2+'" stroke-width=".6"/>'+stitch('M33.8 41 L45.2 41','#e0a85a')+stitch('M54.8 41 L66.2 41','#e0a85a')+stitch('M34 48.6 L39.5 51 L45 48.6','#e0a85a')+stitch('M55 48.6 L60.5 51 L66 48.6','#e0a85a');
    s+=[38,51,64,77].map(y=>'<circle cx="53" cy="'+y+'" r="2" fill="#c98b3c" stroke="#8a5a1e" stroke-width=".5"/><circle cx="53" cy="'+y+'" r=".7" fill="#e8c27a"/>').join('');
    s+='<path d="M29 84 L71 84 L71 92 L29 92Z" fill="'+lo+'" opacity=".6"/>'+stitch('M29.6 85 L70.4 85','#e0a85a')+stitch('M15.6 66 L25.6 66','#e0a85a')+stitch('M74.4 66 L84.4 66','#e0a85a');
    s+=stitch('M30 13 L28.6 42 L29.6 91','#e0a85a')+stitch('M70 13 L71.4 42 L70.4 91','#e0a85a')+fold('M36 56 Q40 70 36 82')+fold('M64 56 Q60 70 64 82'); }
  let hg=''; if(hanger) hg='<path d="M50 -4 q-4 0 -4 -4 q0 -4 4 -4 q4 0 4 4" stroke="#9aa2ae" stroke-width="1.6" fill="none" transform="translate(0 4)"/><path d="M50 4 L26 14 L74 14 Z" fill="none" stroke="#9aa2ae" stroke-width="1.8" stroke-linejoin="round"/>';
  return '<svg width="'+W+'" height="'+W+'" viewBox="0 '+(hanger?-10:0)+' 100 '+(hanger?110:100)+'"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+hi+'"/><stop offset=".5" stop-color="'+c+'"/><stop offset="1" stop-color="'+lo+'"/></linearGradient>'+txPat(id,kind,c)+'</defs>'+hg+s+'</svg>'; }
/* rouleau de tissu de trois quarts : trame visible, spirale d'enroulement, pan déroulé drapé, étiquette */
function roll(c,pat,W,tag){ const id='rl'+(++TX_N), lo=tshade(c,-.38), lo2=tshade(c,-.55), hi=tshade(c,.38);
  let p='';
  if(pat==='lin') p='<pattern id="'+id+'p" width="2.4" height="2.4" patternUnits="userSpaceOnUse"><path d="M0 1.2 H2.4" stroke="'+lo+'" stroke-width=".45" opacity=".55"/><path d="M1.2 0 V2.4" stroke="'+hi+'" stroke-width=".45" opacity=".55"/></pattern>';
  if(pat==='laine') p='<pattern id="'+id+'p" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 5 L5 0 M-1.25 1.25 L1.25 -1.25 M3.75 6.25 L6.25 3.75" stroke="'+lo2+'" stroke-width="1.1" opacity=".5"/><path d="M0 2.5 L2.5 0 M2.5 5 L5 2.5" stroke="'+hi+'" stroke-width=".5" opacity=".4"/></pattern>';
  if(pat==='soie') p='<pattern id="'+id+'p" width="24" height="70" patternUnits="userSpaceOnUse"><path d="M2 0 Q14 35 2 70" stroke="#fff" stroke-width="3.5" opacity=".28" fill="none"/><path d="M12 0 Q22 35 12 70" stroke="#fff" stroke-width="1.2" opacity=".18" fill="none"/></pattern>';
  if(pat==='jean') p='<pattern id="'+id+'p" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 3 L3 0 M-1 1 L1 -1 M2 4 L4 2" stroke="'+hi+'" stroke-width=".6" opacity=".5"/></pattern>';
  let spiral=''; for(let i=0;i<7;i++){ const r=19-i*2.2; spiral+='<ellipse cx="30" cy="10" rx="'+r+'" ry="'+(r*.26)+'" fill="none" stroke="'+(i%2?lo:hi)+'" stroke-width=".55" opacity=".65"/>'; }
  return '<svg width="'+W+'" height="'+Math.round(W*1.45)+'" viewBox="0 0 66 96"><defs>'+p+
   '<linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+lo2+'"/><stop offset=".3" stop-color="'+hi+'"/><stop offset=".6" stop-color="'+c+'"/><stop offset="1" stop-color="'+lo2+'"/></linearGradient>'+
   '<linearGradient id="'+id+'d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+c+'"/><stop offset=".5" stop-color="'+hi+'"/><stop offset="1" stop-color="'+lo+'"/></linearGradient></defs>'+
   '<ellipse cx="34" cy="90" rx="28" ry="3.4" fill="rgba(0,0,0,.2)"/>'+
   /* pan déroulé qui tombe et s'étale au sol */
   '<path d="M48 22 Q58 40 54 62 Q52 76 62 86 L40 89 Q46 76 44 62 Q46 42 42 24 Z" fill="url(#'+id+'d)"/><path d="M48 22 Q58 40 54 62 Q52 76 62 86 L40 89 Q46 76 44 62 Q46 42 42 24 Z" fill="url(#'+id+'p)"/>'+
   '<path d="M47 30 Q52 48 49 66 Q48 76 54 86" stroke="'+lo2+'" stroke-width=".9" fill="none" opacity=".45"/><path d="M45 36 Q48 52 47 66" stroke="'+hi+'" stroke-width="1.2" fill="none" opacity=".5"/>'+
   '<rect x="10" y="10" width="40" height="70" fill="url(#'+id+')"/><rect x="10" y="10" width="40" height="70" fill="url(#'+id+'p)"/>'+
   '<path d="M10 80 Q30 86 50 80 L50 80 Q30 90 10 80Z" fill="'+lo2+'"/><ellipse cx="30" cy="80" rx="20" ry="5.2" fill="'+lo+'"/>'+
   '<ellipse cx="30" cy="10" rx="20" ry="5.2" fill="'+hi+'"/>'+spiral+
   '<ellipse cx="30" cy="10" rx="4.4" ry="1.6" fill="#8a6a44"/><ellipse cx="30" cy="10" rx="2.8" ry="1" fill="#4a3424"/>'+
   (tag? '<path d="M14 34 Q8 36 9 42" stroke="#8a6a44" stroke-width=".6" fill="none"/><g transform="rotate(-8 8 46)"><rect x="2" y="42" width="13" height="9" rx="1.4" fill="#f6e9da" stroke="#c9a66b" stroke-width=".5"/><circle cx="4.4" cy="44.4" r=".8" fill="#c9a66b"/><text x="9" y="48.6" text-anchor="middle" font-size="2.9" font-weight="800" fill="#6e4729" font-family="sans-serif">'+tag+'</text></g>' : '')+
   '<path d="M14 16 L14 76" stroke="#fff" stroke-width="1.4" opacity=".25"/></svg>'; }

return {garment,roll};
})();
NFA.elec=(function(){
/* Illustrations de l'usine électronique : plaquette de silicium, puce, produits, smartphone */
let EL_N=0;
/* plaquette vue de dessus : chaque carré est une puce, bonne (dorée) ou ratée (sombre) selon le rendement */
function wafer(y,W,seed){ const id='wf'+(++EL_N); let s='', n=0, ok=0; const R=46, step=6.4; let r=seed||7;
  const rnd=()=>{ r=(r*9301+49297)%233280; return r/233280; };
  for(let ky=-7;ky<7;ky++) for(let kx=-7;kx<7;kx++){ const gx=kx*step, gy=ky*step, cx=gx+step/2, cy=gy+step/2; if(Math.hypot(cx,cy)>R-4) continue; n++;
    const edge=Math.hypot(cx,cy)/R, good=rnd()<Math.min(.98,y*(1.15-edge*.3)); if(good) ok++;
    s+='<rect x="'+(50+gx+.5).toFixed(1)+'" y="'+(50+gy+.5).toFixed(1)+'" width="'+(step-1)+'" height="'+(step-1)+'" rx=".5" fill="'+(good?'url(#'+id+'d)':'#4a3f5c')+'" opacity="'+(good?1:.85)+'"/>'+
      (good? '<rect x="'+(50+gx+1.6).toFixed(1)+'" y="'+(50+gy+1.6).toFixed(1)+'" width="'+(step-3.2).toFixed(1)+'" height="'+(step-3.2).toFixed(1)+'" fill="none" stroke="#7a5a1c" stroke-width=".25"/>' : '<path d="M'+(50+gx+1.5).toFixed(1)+' '+(50+gy+1.5).toFixed(1)+' l'+(step-3)+' '+(step-3)+'" stroke="#c8352a" stroke-width=".5"/>'); }
  return {ok,n,svg:'<svg width="'+W+'" height="'+W+'" viewBox="0 0 100 100"><defs>'+
    '<radialGradient id="'+id+'" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e6e9f5"/><stop offset=".4" stop-color="#a7b0d6"/><stop offset=".7" stop-color="#7d6fb5"/><stop offset="1" stop-color="#4b8fa8"/></radialGradient>'+
    '<linearGradient id="'+id+'d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e2a0"/><stop offset=".5" stop-color="#d9b25a"/><stop offset="1" stop-color="#a8802e"/></linearGradient>'+
    '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.55)"/><stop offset=".4" stop-color="rgba(255,255,255,0)"/><stop offset=".7" stop-color="rgba(255,255,255,0)"/><stop offset="1" stop-color="rgba(255,255,255,.25)"/></linearGradient></defs>'+
    '<circle cx="50" cy="51.5" r="48" fill="rgba(0,0,0,.25)"/><circle cx="50" cy="50" r="48" fill="url(#'+id+')"/><circle cx="50" cy="50" r="48" fill="none" stroke="#c9cfe6" stroke-width="1"/>'+s+
    '<circle cx="50" cy="50" r="48" fill="url(#'+id+'s)"/><path d="M46 97.6 L54 97.6 L52 95.6 L48 95.6 Z" fill="#2a2f45"/></svg>'}; }
/* puce encapsulée avec pattes et gravure */
function chip(label,W,col){ const id='ch'+(++EL_N), c=col||'#1d2230';
  let pins=''; for(let i=0;i<7;i++){ const p=22+i*9.4; pins+='<rect x="'+p+'" y="8" width="4" height="12" rx="1" fill="url(#'+id+'p)"/><rect x="'+p+'" y="80" width="4" height="12" rx="1" fill="url(#'+id+'p)"/><rect x="8" y="'+p+'" width="12" height="4" rx="1" fill="url(#'+id+'p)"/><rect x="80" y="'+p+'" width="12" height="4" rx="1" fill="url(#'+id+'p)"/>'; }
  return '<svg width="'+W+'" height="'+W+'" viewBox="0 0 100 100"><defs><linearGradient id="'+id+'p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3e2b0"/><stop offset="1" stop-color="#a8802e"/></linearGradient>'+
    '<linearGradient id="'+id+'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4257"/><stop offset="1" stop-color="'+c+'"/></linearGradient></defs>'+pins+
    '<rect x="18" y="18" width="64" height="64" rx="6" fill="url(#'+id+'b)" stroke="#0e1118" stroke-width="1.2"/><rect x="30" y="30" width="40" height="40" rx="3" fill="#a7b0d6" opacity=".2" stroke="#c9cfe6" stroke-width=".6"/>'+
    '<path d="M30 40 H42 V30 M58 30 V42 H70 M70 58 H58 V70 M42 70 V58 H30" stroke="#d9b25a" stroke-width=".8" fill="none" opacity=".8"/><circle cx="25" cy="25" r="2" fill="#0e1118"/>'+
    '<text x="50" y="54" text-anchor="middle" font-family="Space Mono,monospace" font-size="10" font-weight="700" fill="#e6e9f5">'+label+'</text></svg>'; }
/* produits de l'usine */
function prod(k,W){ const id='pd'+(++EL_N); let s='';
  if(k==='ecr') s='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3e7a"/><stop offset=".5" stop-color="#7a4fb5"/><stop offset="1" stop-color="#1fb5c7"/></linearGradient></defs>'+
    [0,1,2].map(i=>'<rect x="'+(18+i*6)+'" y="'+(16+i*8)+'" width="58" height="40" rx="3" fill="#11141c" stroke="#3a4257"/><rect x="'+(21+i*6)+'" y="'+(19+i*8)+'" width="52" height="34" rx="1.5" fill="url(#'+id+')" opacity="'+(.5+i*.25)+'"/>').join('')+'<path d="M40 38 L70 38 L64 58 Z" fill="#fff" opacity=".12"/>';
  if(k==='bat') s='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e8a55"/><stop offset=".4" stop-color="#5ee0a0"/><stop offset="1" stop-color="#16804d"/></linearGradient></defs>'+
    [0,1,2].map(i=>'<rect x="'+(18+i*24)+'" y="24" width="18" height="60" rx="5" fill="url(#'+id+')" stroke="#0e5a35"/><rect x="'+(23+i*24)+'" y="18" width="8" height="8" rx="1.5" fill="#c9cfe6"/><rect x="'+(18+i*24)+'" y="48" width="18" height="12" fill="#11141c" opacity=".85"/><text x="'+(27+i*24)+'" y="57" text-anchor="middle" font-size="7" font-weight="800" fill="#5ee0a0" font-family="sans-serif">+</text>').join('');
  if(k==='pau') s='<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6e9ee"/><stop offset=".5" stop-color="#9aa2ae"/><stop offset="1" stop-color="#5e6b7a"/></linearGradient></defs>'+
    '<g transform="translate(50 52)">'+Array.from({length:10},(_,i)=>'<rect x="-5" y="-38" width="10" height="12" rx="2" fill="url(#'+id+')" transform="rotate('+(i*36)+')"/>').join('')+'<circle r="28" fill="url(#'+id+')" stroke="#5e6b7a"/><circle r="10" fill="#2b2f35"/><circle r="16" fill="none" stroke="#5e6b7a" stroke-width="1.2"/></g>';
  if(k==='puc') return chip('5nm',W,'#1d2230');
  return '<svg width="'+W+'" height="'+W+'" viewBox="0 0 100 100">'+s+'</svg>'; }
/* smartphone de face et de dos : écran (1-3) et appareil photo (1-3) */
function phone(e,p,W,col){ const id='ph'+(++EL_N), c=col||'#2b2f45', H=Math.round(W*1.0);
  const cam=[ '<circle cx="128" cy="30" r="7" fill="#0a0c12" stroke="#3a4257" stroke-width="1.6"/><circle cx="128" cy="30" r="2.6" fill="#2b4c8a"/>',
    '<rect x="116" y="18" width="26" height="40" rx="8" fill="#151821"/><circle cx="129" cy="29" r="6.4" fill="#0a0c12" stroke="#4a5470" stroke-width="1.6"/><circle cx="129" cy="47" r="6.4" fill="#0a0c12" stroke="#4a5470" stroke-width="1.6"/><circle cx="129" cy="29" r="2.4" fill="#2b4c8a"/><circle cx="129" cy="47" r="2.4" fill="#2b4c8a"/>',
    '<rect x="112" y="14" width="38" height="42" rx="10" fill="#151821"/><circle cx="123" cy="25" r="6.2" fill="#0a0c12" stroke="#5a6480" stroke-width="1.8"/><circle cx="139" cy="25" r="6.2" fill="#0a0c12" stroke="#5a6480" stroke-width="1.8"/><circle cx="123" cy="44" r="6.2" fill="#0a0c12" stroke="#5a6480" stroke-width="1.8"/><circle cx="139" cy="44" r="3" fill="#f6e2a0"/><circle cx="123" cy="25" r="2.4" fill="#3b5fa8"/><circle cx="139" cy="25" r="2.4" fill="#3b5fa8"/><circle cx="123" cy="44" r="2.4" fill="#3b5fa8"/><text x="131" y="52" font-size="4" fill="#c9cfe6" font-family="sans-serif">ZOOM</text>' ][p-1];
  const scr=['<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fa4c8"/><stop offset="1" stop-color="#5a6f9a"/></linearGradient>',
    '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7a59"/><stop offset=".5" stop-color="#b44fd0"/><stop offset="1" stop-color="#2b6cd6"/></linearGradient>',
    '<linearGradient id="'+id+'s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd36b"/><stop offset=".35" stop-color="#ff5a8a"/><stop offset=".7" stop-color="#7a3cff"/><stop offset="1" stop-color="#18c7d9"/></linearGradient>'][e-1];
  const bez=[6,3.2,2][e-1];
  return '<svg width="'+Math.round(W*1.6)+'" height="'+H+'" viewBox="0 0 160 100"><defs>'+scr+
    '<linearGradient id="'+id+'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c+'"/><stop offset=".5" stop-color="#4a5470"/><stop offset="1" stop-color="'+c+'"/></linearGradient></defs>'+
    '<ellipse cx="80" cy="97" rx="66" ry="2.4" fill="rgba(0,0,0,.2)"/>'+
    /* face avant */
    '<rect x="14" y="4" width="50" height="92" rx="9" fill="#0e1118" stroke="#8a92a8" stroke-width="1.4"/><rect x="'+(14+bez)+'" y="'+(4+bez)+'" width="'+(50-2*bez)+'" height="'+(92-2*bez)+'" rx="'+(9-bez/2)+'" fill="url(#'+id+'s)"/>'+
    '<rect x="33" y="'+(6+bez)+'" width="12" height="3.6" rx="1.8" fill="#0e1118"/>'+
    '<text x="39" y="34" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="sans-serif">9:41</text><text x="39" y="41" text-anchor="middle" font-size="3.6" fill="#fff" opacity=".85" font-family="sans-serif">jeudi 19 novembre</text>'+
    [0,1,2,3].map(i=>'<rect x="'+(22+i*9)+'" y="78" width="6.4" height="6.4" rx="1.8" fill="#fff" opacity=".85"/>').join('')+'<rect x="31" y="'+(92-bez-2)+'" width="16" height="1.2" rx=".6" fill="#fff" opacity=".8"/>'+
    '<path d="M'+(14+bez)+' '+(4+bez)+' L44 '+(4+bez)+' L'+(14+bez)+' 60 Z" fill="#fff" opacity=".08"/>'+
    /* dos */
    '<rect x="96" y="4" width="50" height="92" rx="9" fill="url(#'+id+'b)" stroke="#8a92a8" stroke-width="1.4"/>'+cam.replace(/(x|cx)="(\d+)"/g,(m0,a,v)=>a+'="'+(+v-8)+'"')+
    '<text x="121" y="76" text-anchor="middle" font-size="5" font-weight="800" fill="#c9cfe6" font-family="Space Mono,monospace" letter-spacing="1">VOLT</text><path d="M100 10 L106 10 L100 70Z" fill="#fff" opacity=".07"/></svg>'; }

return {wafer,chip,prod,phone};
})();
NFA.farm=(function(){
/* Parcelles vues du ciel et bâtiments de la ferme */
let FM_N=0;
function frnd(seed){ let r=seed; return ()=>{ r=(r*9301+49297)%233280; return r/233280; }; }
function parcel(kind,stage,W,H,seed){ const id='pc'+(++FM_N), R=frnd(seed||FM_N*17); let d='', s='';
  const soil='<rect width="100" height="70" fill="#8a6340"/><pattern id="'+id+'so" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#6e4a2c"/><circle cx="5" cy="4.5" r=".6" fill="#a07650"/></pattern><rect width="100" height="70" fill="url(#'+id+'so)"/>';
  const grass=(c1,c2)=>'<rect width="100" height="70" fill="'+c1+'"/>'+Array.from({length:60},()=>'<circle cx="'+(R()*100).toFixed(1)+'" cy="'+(R()*70).toFixed(1)+'" r="'+(1+R()*2.2).toFixed(1)+'" fill="'+c2+'" opacity=".5"/>').join('');
  if(kind==='ble'){
    if(stage==='semis'){ s=soil; for(let y=5;y<70;y+=6) s+='<line x1="0" y1="'+y+'" x2="100" y2="'+(y-3)+'" stroke="#6e4a2c" stroke-width="1.6"/>'+Array.from({length:14},(_,i)=>'<path d="M'+(i*7.2+R()*2)+' '+(y-.2-i*.21)+' l.6 -2.4 l.6 2.4" stroke="#7fb24a" stroke-width=".7" fill="none"/>').join(''); }
    else { const c=stage==='rec'? ['#e8c25a','#d4a73a','#f3dc8a'] : ['#8fbf4f','#6fa23a','#b5d97a'];
      s='<rect width="100" height="70" fill="'+c[0]+'"/>'; for(let y=2;y<72;y+=3.4) s+='<path d="M0 '+y+' Q50 '+(y-2)+' 100 '+(y-4)+'" stroke="'+c[1]+'" stroke-width="1.4" fill="none"/>';
      for(let i=0;i<120;i++) s+='<ellipse cx="'+(R()*100).toFixed(1)+'" cy="'+(R()*70).toFixed(1)+'" rx="1.2" ry=".5" fill="'+c[2]+'" transform="rotate(-20)"/>';
      if(stage==='rec') s+='<path d="M0 46 L100 38 L100 70 L0 70Z" fill="#c9a548"/>'+Array.from({length:8},(_,i)=>'<line x1="0" y1="'+(50+i*3)+'" x2="100" y2="'+(42+i*3.4)+'" stroke="#b08a34" stroke-width=".9"/>').join('')+'<rect x="64" y="36" width="16" height="9" rx="2" fill="#2f7a3a"/><rect x="58" y="38" width="7" height="6" fill="#d8d8d8"/><circle cx="68" cy="46" r="3" fill="#1d1f23"/><circle cx="78" cy="45.5" r="2.2" fill="#1d1f23"/><rect x="69" y="31" width="7" height="6" rx="1" fill="#9fd0e6" stroke="#2f7a3a"/>'; } }
  if(kind==='mais'){ s='<rect width="100" height="70" fill="#4f8a35"/>'; for(let x=3;x<100;x+=6){ s+='<rect x="'+x+'" y="0" width="3.6" height="70" fill="#3b7027"/>'; for(let y=3;y<70;y+=5) s+='<path d="M'+(x+1.8)+' '+y+' l-3 2 M'+(x+1.8)+' '+y+' l3 2" stroke="#7fbf55" stroke-width=".9"/>'+(stage==='rec'?'<circle cx="'+(x+1.8)+'" cy="'+(y-1)+'" r=".9" fill="#f2cf4a"/>':''); } }
  if(kind==='tourn'){ s='<rect width="100" height="70" fill="#4d7f32"/>'; for(let y=4;y<70;y+=7) for(let x=4+(y%14?3:0);x<100;x+=7){ s+='<circle cx="'+x+'" cy="'+y+'" r="3.2" fill="#f5c518"/><circle cx="'+x+'" cy="'+y+'" r="1.4" fill="#6b3f12"/>'; } }
  if(kind==='leg'){ s=soil; const rows=['#3e8f3a','#e07a2f','#c8352a','#6fbf4a','#7a4fb5']; for(let i=0;i<7;i++){ const y=6+i*9.4, c=rows[i%5]; s+='<rect x="0" y="'+(y-3.4)+'" width="100" height="6.8" rx="3" fill="#6e4a2c"/>'; for(let x=4;x<100;x+=6.2){ if(c==='#e07a2f') s+='<path d="M'+x+' '+(y+1)+' l-1.4 -3 M'+x+' '+(y+1)+' l1.4 -3 M'+x+' '+(y+1)+' l0 -3.4" stroke="#5aa83a" stroke-width=".8"/><circle cx="'+x+'" cy="'+(y+1.4)+'" r=".9" fill="'+c+'"/>'; else if(c==='#c8352a') s+='<circle cx="'+x+'" cy="'+y+'" r="2.4" fill="#4a8f34"/><circle cx="'+(x-.8)+'" cy="'+(y-.6)+'" r=".9" fill="'+c+'"/><circle cx="'+(x+1)+'" cy="'+(y+.6)+'" r=".9" fill="'+c+'"/>'; else s+='<circle cx="'+x+'" cy="'+y+'" r="2.5" fill="'+c+'"/><circle cx="'+(x-.6)+'" cy="'+(y-.6)+'" r="1.2" fill="'+(c==='#7a4fb5'?'#a887d6':'#9be07a')+'" opacity=".7"/>'; } } }
  if(kind==='verger'){ s=grass('#7cb85a','#94cc6e'); for(let y=10;y<70;y+=17) for(let x=10+(y%34?8:0);x<100;x+=17){ s+='<ellipse cx="'+(x+2.6)+'" cy="'+(y+3)+'" rx="7.4" ry="5" fill="rgba(0,0,0,.2)"/><circle cx="'+x+'" cy="'+y+'" r="7" fill="#3f7a2c"/><circle cx="'+(x-2)+'" cy="'+(y-2.2)+'" r="4.2" fill="#5a9a3c"/><circle cx="'+(x-2.6)+'" cy="'+(y-3)+'" r="1.6" fill="#7fbf55"/>'+(stage!=='semis'? Array.from({length:6},()=>'<circle cx="'+(x+(R()-.5)*10).toFixed(1)+'" cy="'+(y+(R()-.5)*10).toFixed(1)+'" r="1" fill="#d6332a"/>').join('') : ''); } }
  if(kind==='vigne'){ s=grass('#9cba62','#b2cc7c'); for(let y=6;y<70;y+=8){ s+='<rect x="0" y="'+(y-1.4)+'" width="100" height="2.8" fill="#6e4a2c" opacity=".6"/><line x1="0" y1="'+y+'" x2="100" y2="'+y+'" stroke="#8a6340" stroke-width=".5"/>'; for(let x=3;x<100;x+=5.6) s+='<circle cx="'+x+'" cy="'+y+'" r="2.4" fill="#4d7f32"/><circle cx="'+(x-.6)+'" cy="'+(y-.8)+'" r="1.2" fill="#6fa23a"/>'+(stage==='rec'?'<circle cx="'+(x+1.1)+'" cy="'+(y+1)+'" r="1" fill="#5b2a6e"/><circle cx="'+(x+.3)+'" cy="'+(y+1.6)+'" r=".8" fill="#6e3585"/>':''); for(let x=0;x<100;x+=22) s+='<rect x="'+x+'" y="'+(y-1.6)+'" width="1.4" height="3.2" fill="#5a3a20"/>'; } }
  if(kind==='vaches'){ s=grass('#6fae4c','#86c264'); s+='<rect x="2" y="2" width="96" height="66" fill="none" stroke="#8a6340" stroke-width="1.4" stroke-dasharray="4 2"/><rect x="76" y="8" width="16" height="5" rx="1.5" fill="#6e8fa8" stroke="#4a5a6a"/>'+'<path d="M10 58 Q40 50 90 62" stroke="#a88a5a" stroke-width="3" fill="none" opacity=".5"/>';
    [[22,22,0],[44,34,30],[66,24,-20],[30,50,15],[70,48,190]].forEach(([x,y,a])=>{ s+='<g transform="translate('+x+' '+y+') rotate('+a+')"><ellipse cx="1.4" cy="1.6" rx="7" ry="3.6" fill="rgba(0,0,0,.2)"/><ellipse rx="7" ry="3.6" fill="#f4f1ea" stroke="#2a2a2a" stroke-width=".4"/><ellipse cx="-2" cy="-1" rx="2.4" ry="1.6" fill="#2a2a2a"/><ellipse cx="2.6" cy="1.2" rx="1.8" ry="1.3" fill="#2a2a2a"/><ellipse cx="8" rx="2.6" ry="2" fill="#f4f1ea" stroke="#2a2a2a" stroke-width=".4"/><ellipse cx="9.6" rx="1.2" ry="1.3" fill="#e9a3a3"/><path d="M7 -2 l-1 -1.6 M7 2 l-1 1.6" stroke="#c9b48a" stroke-width=".8"/></g>'; }); }
  if(kind==='poules'){ s='<rect width="100" height="70" fill="#d9c08a"/>'+Array.from({length:50},()=>'<circle cx="'+(R()*100).toFixed(1)+'" cy="'+(R()*70).toFixed(1)+'" r=".6" fill="#b89a60"/>').join('');
    s+='<rect x="6" y="8" width="30" height="22" fill="#a3483a"/><path d="M4 8 L21 0 L38 8 Z" fill="#7e3329"/><rect x="18" y="20" width="6" height="10" fill="#3a2214"/><rect x="2" y="2" width="96" height="66" fill="none" stroke="#c9ced6" stroke-width="1" stroke-dasharray="1 1.4"/>';
    for(let i=0;i<16;i++){ const x=40+R()*54, y=8+R()*56, c=R()<.5?'#f4f1ea':'#a8692e'; s+='<g transform="translate('+x.toFixed(1)+' '+y.toFixed(1)+')"><ellipse rx="2.6" ry="2" fill="'+c+'" stroke="rgba(0,0,0,.25)" stroke-width=".3"/><circle cx="2.2" cy="-1" r="1.2" fill="'+c+'"/><path d="M3.2 -1 l1 .3 l-1 .3z" fill="#f2a33a"/><circle cx="2.2" cy="-2" r=".5" fill="#d6332a"/></g>'; } }
  if(kind==='lock'){ s='<rect width="100" height="70" fill="#b7c49a"/><pattern id="'+id+'h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="8" fill="rgba(0,0,0,.08)"/></pattern><rect width="100" height="70" fill="url(#'+id+'h)"/><rect x="42" y="30" width="16" height="13" rx="2" fill="#5e6b7a"/><path d="M45 30 v-4 a5 5 0 0 1 10 0 v4" stroke="#5e6b7a" stroke-width="2.4" fill="none"/>'; }
  return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" style="display:block"><defs>'+d+'</defs>'+s+'</svg>'; }
/* bâtiments de transformation */
function bld(k,W){ let s='';
  if(k==='moulin') s='<rect x="40" y="54" width="20" height="38" fill="#e8dcc4" stroke="#8a6340"/><path d="M38 54 L50 42 L62 54Z" fill="#a3483a"/><rect x="46" y="76" width="8" height="16" fill="#5a3a20"/><g transform="translate(50 47) scale(.82)">'+[0,90,180,270].map(a=>'<g transform="rotate('+(a+20)+')"><rect x="-2" y="-34" width="4" height="34" fill="#6e4a2c"/><rect x="-7" y="-33" width="5" height="26" fill="#f4f1ea" stroke="#8a6340" stroke-width=".6"/></g>').join('')+'<circle r="3" fill="#3a2214"/></g>';
  if(k==='from') s='<rect x="14" y="44" width="72" height="40" fill="#f2e6c9" stroke="#a88a5a"/><path d="M10 44 L50 22 L90 44Z" fill="#7e5a3a"/><rect x="24" y="56" width="14" height="12" fill="#9fd0e6" stroke="#6e4a2c"/><rect x="62" y="56" width="14" height="28" fill="#6e4a2c"/>'+'<g transform="translate(36 76)"><path d="M0 8 L14 8 L14 2 L0 -2Z" fill="#f2c94c" stroke="#c9a030"/><path d="M0 -2 L14 2 L22 -4 L8 -8Z" fill="#f7dc7a" stroke="#c9a030"/><circle cx="5" cy="4" r="1.2" fill="#d9a830"/><circle cx="10" cy="3" r=".9" fill="#d9a830"/></g>';
  if(k==='chai') s='<rect x="10" y="40" width="80" height="44" rx="4" fill="#c9a06a" stroke="#7a5a3a"/><path d="M6 42 Q50 14 94 42Z" fill="#8a5a3a"/>'+[0,1,2].map(i=>'<g transform="translate('+(26+i*24)+' 66)"><ellipse rx="10" ry="12" fill="#8a5a3a" stroke="#5a3a20"/><ellipse rx="10" ry="12" fill="none" stroke="#3a2214" stroke-width="1.4" stroke-dasharray="0 6 30"/><line x1="-10" y1="-5" x2="10" y2="-5" stroke="#3a2214" stroke-width="1.2"/><line x1="-10" y1="5" x2="10" y2="5" stroke="#3a2214" stroke-width="1.2"/><circle r="2" fill="#5a3a20"/></g>').join('');
  if(k==='trac') s='<rect x="22" y="40" width="38" height="22" rx="3" fill="#2f7a3a"/><rect x="40" y="22" width="22" height="22" rx="3" fill="#9fd0e6" stroke="#2f7a3a" stroke-width="3"/><rect x="16" y="46" width="10" height="12" fill="#2f7a3a"/><rect x="24" y="30" width="3" height="12" fill="#2b2f35"/><circle cx="62" cy="64" r="16" fill="#1d1f23"/><circle cx="62" cy="64" r="8" fill="#f2c94c"/><circle cx="28" cy="70" r="10" fill="#1d1f23"/><circle cx="28" cy="70" r="5" fill="#f2c94c"/>';
  if(k==='irr') s='<line x1="10" y1="40" x2="90" y2="40" stroke="#9aa2ae" stroke-width="3"/>'+[20,40,60,80].map(x=>'<path d="M'+x+' 40 L'+(x-8)+' 80 M'+x+' 40 L'+(x+8)+' 80" stroke="#9aa2ae" stroke-width="2"/><circle cx="'+(x-8)+'" cy="80" r="3" fill="#2b2f35"/><circle cx="'+(x+8)+'" cy="80" r="3" fill="#2b2f35"/>').join('')+[15,30,45,60,75,90].map(x=>'<path d="M'+x+' 42 q-3 8 -6 14 M'+x+' 42 q3 8 6 14" stroke="#5ab4e6" stroke-width="1.2" fill="none" opacity=".8"/>').join('');
  if(k==='serre') s='<path d="M12 84 L12 50 Q50 18 88 50 L88 84Z" fill="#cfe9f2" stroke="#9aa2ae" stroke-width="2" opacity=".9"/>'+[30,50,70].map(x=>'<path d="M'+x+' 84 L'+x+' '+(x===50?30:38)+'" stroke="#9aa2ae" stroke-width="1.4"/>').join('')+[22,36,64,78].map(x=>'<circle cx="'+x+'" cy="76" r="5" fill="#4a8f34"/><circle cx="'+(x+1)+'" cy="75" r="1.6" fill="#c8352a"/>').join('');
  return '<svg width="'+W+'" height="'+W+'" viewBox="0 0 100 100">'+s+'</svg>'; }
/* caisse en bois */
function crate(label,col,W){ return '<svg width="'+W+'" height="'+W+'" viewBox="0 0 60 60"><rect x="6" y="14" width="48" height="40" rx="2" fill="#c99b66" stroke="#8a6340"/><rect x="6" y="14" width="48" height="6" fill="#b08550"/><line x1="6" y1="34" x2="54" y2="34" stroke="#8a6340"/><line x1="6" y1="44" x2="54" y2="44" stroke="#8a6340" opacity=".6"/>'+[14,24,34,44].map((x,i)=>'<circle cx="'+x+'" cy="'+(12-i%2)+'" r="5" fill="'+col+'"/><circle cx="'+(x-1.4)+'" cy="'+(10.6-i%2)+'" r="1.6" fill="#fff" opacity=".45"/>').join('')+'<rect x="18" y="24" width="24" height="8" fill="#f6e9da"/><text x="30" y="30" text-anchor="middle" font-size="5" font-weight="800" fill="#6e4729" font-family="sans-serif">'+label+'</text></svg>'; }

return {parcel,bld,crate};
})();
NFA.ecom=(function(){
/* Produits de la boutique en ligne, dessinés en SVG */
let EC_N=0;
function product(k,W){ const id='ep'+(++EC_N); let s='';
  const sh='<ellipse cx="50" cy="92" rx="30" ry="4" fill="rgba(0,0,0,.14)"/>';
  if(k==='ecou') s=sh+'<rect x="22" y="40" width="56" height="44" rx="20" fill="#f4f6fa" stroke="#c9d1dc" stroke-width="1.5"/><path d="M22 58 H78" stroke="#c9d1dc"/><circle cx="50" cy="70" r="2" fill="#3CF29B"/>'+
    '<g transform="translate(34 24) rotate(-15)"><ellipse rx="9" ry="11" fill="#fff" stroke="#c9d1dc" stroke-width="1.4"/><rect x="-3" y="6" width="6" height="22" rx="3" fill="#fff" stroke="#c9d1dc" stroke-width="1.4"/><ellipse cx="-2" cy="-3" rx="4" ry="5" fill="#2b2f35"/></g><g transform="translate(66 24) rotate(15)"><ellipse rx="9" ry="11" fill="#fff" stroke="#c9d1dc" stroke-width="1.4"/><rect x="-3" y="6" width="6" height="22" rx="3" fill="#fff" stroke="#c9d1dc" stroke-width="1.4"/><ellipse cx="2" cy="-3" rx="4" ry="5" fill="#2b2f35"/></g>';
  if(k==='montre') s=sh+'<rect x="38" y="6" width="24" height="26" rx="6" fill="#ff7a59"/><rect x="38" y="68" width="24" height="24" rx="6" fill="#ff7a59"/>'+[12,18,24,74,80,86].map(y=>'<line x1="40" y1="'+y+'" x2="60" y2="'+y+'" stroke="#d95a3a" stroke-width="1"/>').join('')+
    '<rect x="28" y="26" width="44" height="48" rx="12" fill="#1d2230"/><rect x="32" y="30" width="36" height="40" rx="9" fill="url(#'+id+')"/><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3e7a"/><stop offset="1" stop-color="#7a3cff"/></linearGradient></defs>'+
    '<text x="50" y="50" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="11" fill="#fff">10:08</text><circle cx="50" cy="60" r="4" fill="none" stroke="#3CF29B" stroke-width="1.6" stroke-dasharray="18 7"/><rect x="72" y="42" width="4" height="10" rx="2" fill="#9aa2ae"/>';
  if(k==='lampe') s=sh+'<ellipse cx="50" cy="88" rx="20" ry="5" fill="#2b2f35"/><rect x="48" y="40" width="4" height="48" fill="#9aa2ae"/><path d="M50 40 L74 20" stroke="#9aa2ae" stroke-width="4" stroke-linecap="round"/><path d="M62 16 L86 10 L90 30 L68 32Z" fill="#f2c94c" stroke="#c9a030"/><path d="M68 32 L90 30 L96 72 L56 72Z" fill="#fff3b0" opacity=".55"/><circle cx="50" cy="40" r="4" fill="#5e6b7a"/>';
  if(k==='gourde') s=sh+'<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1f8a7a"/><stop offset=".4" stop-color="#5fe0c8"/><stop offset="1" stop-color="#16675b"/></linearGradient></defs><rect x="38" y="6" width="24" height="10" rx="3" fill="#2b2f35"/><path d="M44 16 L56 16 L56 22 Q70 26 70 40 L70 82 Q70 90 62 90 L38 90 Q30 90 30 82 L30 40 Q30 26 44 22Z" fill="url(#'+id+')"/><rect x="30" y="50" width="40" height="14" fill="#fff" opacity=".85"/><text x="50" y="60" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="7" fill="#16675b">FRESH</text><path d="M36 30 L36 82" stroke="#fff" stroke-width="2" opacity=".5"/>';
  if(k==='sac') s=sh+'<path d="M38 18 Q50 4 62 18" fill="none" stroke="#3a3f47" stroke-width="4"/><rect x="24" y="18" width="52" height="72" rx="14" fill="#3e5a7a"/><rect x="30" y="50" width="40" height="30" rx="8" fill="#2f4660"/><path d="M30 58 H70" stroke="#f2c94c" stroke-width="1.8"/><rect x="46" y="30" width="8" height="4" rx="2" fill="#f2c94c"/><path d="M28 24 Q50 32 72 24" stroke="#2f4660" stroke-width="2" fill="none"/>';
  if(k==='encei') s=sh+'<rect x="16" y="30" width="68" height="56" rx="20" fill="#d6332a"/><rect x="22" y="36" width="56" height="44" rx="15" fill="#b02720"/><pattern id="'+id+'" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#7a1a14"/></pattern><rect x="22" y="36" width="56" height="44" rx="15" fill="url(#'+id+')"/><circle cx="50" cy="58" r="12" fill="#7a1a14"/><circle cx="50" cy="58" r="5" fill="#2b2f35"/><path d="M28 30 Q50 18 72 30" fill="none" stroke="#2b2f35" stroke-width="3"/>';
  if(k==='proj') s=sh+'<path d="M14 60 L24 30 L76 30 L86 60Z" fill="#e9edf3"/><rect x="14" y="58" width="72" height="26" rx="6" fill="#f4f6fa" stroke="#c9d1dc"/><circle cx="34" cy="70" r="10" fill="#1d2230"/><circle cx="34" cy="70" r="6" fill="#2b4c8a"/><circle cx="32" cy="68" r="2" fill="#9fd0e6"/><rect x="56" y="66" width="22" height="3" rx="1.5" fill="#c9d1dc"/><rect x="56" y="72" width="14" height="3" rx="1.5" fill="#c9d1dc"/><path d="M24 70 L-10 50 L-10 92 Z" fill="#fff6c0" opacity=".5"/>';
  if(k==='plaid') s=sh+'<rect x="14" y="56" width="72" height="32" rx="8" fill="#c06b4e"/><rect x="18" y="44" width="64" height="22" rx="8" fill="#e0b48a"/><rect x="22" y="32" width="56" height="20" rx="8" fill="#8a9a6a"/>'+[0,1,2].map(i=>'<path d="M'+(22-i*4)+' '+(42+i*12)+' H'+(78+i*4)+'" stroke="#fff" stroke-width="1" stroke-dasharray="2 2" opacity=".6"/>').join('')+'<path d="M86 64 l4 2 M86 70 l4 2 M86 76 l4 2" stroke="#c06b4e" stroke-width="1.6"/>';
  return '<svg width="'+W+'" height="'+W+'" viewBox="0 0 100 100">'+s+'</svg>'; }
/* carton d'expédition */
function parcel(W,tape){ return '<svg width="'+W+'" height="'+W+'" viewBox="0 0 60 60"><path d="M8 22 L30 12 L52 22 L52 46 L30 56 L8 46Z" fill="#c99b66"/><path d="M8 22 L30 32 L52 22 L30 12Z" fill="#dcb27e"/><path d="M30 32 L30 56" stroke="#a87a48"/><path d="M19 17 L41 27" stroke="'+(tape||'#e9dfcf')+'" stroke-width="4"/><path d="M41 27 L41 38" stroke="'+(tape||'#e9dfcf')+'" stroke-width="4"/><rect x="34" y="40" width="12" height="7" fill="#fff" transform="skewY(-24) translate(0 18)"/></svg>'; }

return {product,parcel};
})();
NFA.build=(function(){
/* Chantier : immeuble en construction avec grue, échafaudages, engins */
let BD_N=0;
function site(floorsDone,floorsTotal,W){ const id='bs'+(++BD_N), H=Math.round(W*.75); let s='';
  s+='<defs><linearGradient id="'+id+'k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0f0"/><stop offset="1" stop-color="#e8f4fb"/></linearGradient></defs>';
  s+='<rect width="200" height="150" fill="url(#'+id+'k)"/><circle cx="170" cy="24" r="10" fill="#fff3c4"/>';
  s+='<rect x="0" y="128" width="200" height="22" fill="#b89a6a"/><rect x="0" y="126" width="200" height="4" fill="#9a7a4a"/>';
  /* palissade rayée */
  s+='<rect x="0" y="118" width="200" height="12" fill="#f2c94c"/>'+Array.from({length:20},(_,i)=>'<path d="M'+(i*10)+' 130 L'+(i*10+6)+' 118 L'+(i*10+10)+' 118 L'+(i*10+4)+' 130Z" fill="#1d1f23"/>').join('');
  /* immeuble : étages finis en béton, en cours en coffrage, restants en pointillés */
  const fx=60, fw=80, fh=13;
  for(let f=0;f<floorsTotal;f++){ const y=118-(f+1)*fh;
    if(f<floorsDone){ s+='<rect x="'+fx+'" y="'+y+'" width="'+fw+'" height="'+fh+'" fill="#c9ced6" stroke="#9aa2ae" stroke-width=".6"/>'; for(let w=0;w<5;w++) s+='<rect x="'+(fx+6+w*15)+'" y="'+(y+3)+'" width="9" height="7" fill="'+(f<floorsDone-1?'#7fa4bf':'#3a3f47')+'"/>'; }
    else if(f===floorsDone){ s+='<rect x="'+fx+'" y="'+(y+8)+'" width="'+fw+'" height="5" fill="#a8b0ba"/>'+[0,1,2,3,4,5].map(k=>'<rect x="'+(fx+2+k*15)+'" y="'+y+'" width="3" height="9" fill="#9aa2ae"/>').join('')+'<rect x="'+(fx+30)+'" y="'+(y+3)+'" width="22" height="5" fill="#d9a552"/>'; }
    else s+='<rect x="'+fx+'" y="'+y+'" width="'+fw+'" height="'+fh+'" fill="none" stroke="#5e6b7a" stroke-width=".8" stroke-dasharray="3 3" opacity=".6"/>'; }
  /* échafaudage */
  const top=118-(floorsDone+1)*fh; s+='<g stroke="#d9a552" stroke-width="1.2">'+[fx-8,fx+fw+2].map(x=>'<line x1="'+x+'" y1="118" x2="'+x+'" y2="'+top+'"/><line x1="'+(x+6)+'" y1="118" x2="'+(x+6)+'" y2="'+top+'"/>'+Array.from({length:floorsDone+1},(_,k)=>'<line x1="'+x+'" y1="'+(118-k*fh)+'" x2="'+(x+6)+'" y2="'+(118-(k+1)*fh)+'"/><line x1="'+(x-1)+'" y1="'+(118-k*fh)+'" x2="'+(x+7)+'" y2="'+(118-k*fh)+'"/>').join('')).join('')+'</g>';
  /* grue à tour */
  s+='<g><rect x="150" y="20" width="6" height="108" fill="#f2c94c"/>'+Array.from({length:12},(_,k)=>'<path d="M150 '+(28+k*8.4)+' L156 '+(32+k*8.4)+'" stroke="#c9a030" stroke-width="1"/>').join('')+
    '<rect x="70" y="16" width="120" height="5" fill="#f2c94c"/>'+Array.from({length:15},(_,k)=>'<path d="M'+(72+k*8)+' 21 L'+(76+k*8)+' 16" stroke="#c9a030" stroke-width="1"/>').join('')+
    '<path d="M153 20 L153 6 L176 16" fill="none" stroke="#c9a030" stroke-width="1.4"/><rect x="172" y="21" width="16" height="9" fill="#5e6b7a"/><rect x="148" y="21" width="10" height="8" fill="#1d6fb2"/>'+
    '<line x1="96" y1="21" x2="96" y2="'+(top-6)+'" stroke="#2b2f35" stroke-width=".8"/><rect x="88" y="'+(top-8)+'" width="16" height="4" fill="#8a6340"/><rect x="92" y="18" width="8" height="4" fill="#2b2f35"/></g>';
  /* ouvriers casqués */
  [[66,top+2],[120,top+2],[30,124],[44,124]].forEach(([x,y])=>{ s+='<circle cx="'+x+'" cy="'+(y-6)+'" r="2" fill="#e9c3a6"/><path d="M'+(x-2.4)+' '+(y-7)+' a2.4 2.4 0 0 1 4.8 0Z" fill="#f2c94c"/><rect x="'+(x-2)+'" y="'+(y-4)+'" width="4" height="5" fill="#ff7a3c"/>'; });
  /* bétonnière */
  s+='<g transform="translate(8 108)"><rect x="0" y="6" width="34" height="10" rx="2" fill="#e9edf3" stroke="#9aa2ae"/><ellipse cx="18" cy="2" rx="13" ry="8" fill="#ff7a3c" transform="rotate(-12 18 2)"/><path d="M8 -2 L28 6 M10 4 L26 -2" stroke="#d9501a" stroke-width="1.2"/><circle cx="7" cy="17" r="3.4" fill="#1d1f23"/><circle cx="28" cy="17" r="3.4" fill="#1d1f23"/><rect x="30" y="4" width="6" height="8" fill="#1d6fb2"/></g>';
  return '<svg width="'+W+'" height="'+H+'" viewBox="0 0 200 150" style="display:block">'+s+'</svg>'; }
function engine(k,W){ let s='';
  if(k==='pelle') s='<rect x="10" y="62" width="56" height="12" rx="6" fill="#2b2f35"/>'+[16,28,40,52,62].map(x=>'<circle cx="'+x+'" cy="68" r="4" fill="#5e6b7a"/>').join('')+'<rect x="16" y="40" width="40" height="22" rx="3" fill="#f2c94c"/><rect x="40" y="26" width="18" height="18" rx="2" fill="#9fd0e6" stroke="#f2c94c" stroke-width="3"/><path d="M56 44 L78 22 L90 40" fill="none" stroke="#f2c94c" stroke-width="6" stroke-linecap="round"/><path d="M84 38 L96 44 L90 56 L80 50Z" fill="#5e6b7a"/>';
  if(k==='grue') s='<rect x="44" y="10" width="6" height="66" fill="#f2c94c"/><rect x="14" y="10" width="76" height="5" fill="#f2c94c"/><path d="M47 10 V2 L70 10" stroke="#c9a030" fill="none" stroke-width="1.4"/><rect x="74" y="15" width="12" height="7" fill="#5e6b7a"/><line x1="24" y1="15" x2="24" y2="44" stroke="#2b2f35"/><rect x="18" y="44" width="12" height="6" fill="#8a6340"/><rect x="36" y="76" width="22" height="6" fill="#9aa2ae"/>';
  if(k==='toupie') s='<rect x="8" y="56" width="74" height="12" rx="3" fill="#e9edf3" stroke="#9aa2ae"/><ellipse cx="40" cy="44" rx="26" ry="14" fill="#ff7a3c" transform="rotate(-10 40 44)"/><path d="M20 38 L60 52 M24 50 L58 36" stroke="#d9501a" stroke-width="2"/><rect x="66" y="34" width="20" height="22" rx="3" fill="#1d6fb2"/><rect x="70" y="38" width="12" height="8" fill="#9fd0e6"/><circle cx="20" cy="70" r="7" fill="#1d1f23"/><circle cx="50" cy="70" r="7" fill="#1d1f23"/><circle cx="76" cy="70" r="7" fill="#1d1f23"/>';
  return '<svg width="'+W+'" height="'+Math.round(W*.85)+'" viewBox="0 0 100 85">'+s+'</svg>'; }
/* plan d'architecte en vignette */
function blueprint(kind,W){ let s='<rect width="100" height="70" fill="#1d4f91"/><pattern id="bpg'+(++BD_N)+'" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M6 0 H0 V6" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".5"/></pattern><rect width="100" height="70" fill="url(#bpg'+BD_N+')"/>';
  const L='stroke="#e8f1ff" stroke-width="1.2" fill="none"';
  if(kind==='mais') s+='<path d="M20 60 V32 L50 12 L80 32 V60Z" '+L+'/><rect x="44" y="42" width="12" height="18" '+L+'/><rect x="26" y="36" width="10" height="9" '+L+'/><rect x="64" y="36" width="10" height="9" '+L+'/><path d="M14 64 H86" '+L+' stroke-dasharray="2 2"/>';
  if(kind==='imm') s+='<rect x="28" y="8" width="44" height="54" '+L+'/>'+[0,1,2,3,4].map(r=>[0,1,2].map(c=>'<rect x="'+(33+c*13)+'" y="'+(12+r*10)+'" width="8" height="6" '+L+'/>').join('')).join('');
  if(kind==='oa') s+='<path d="M4 46 H96" '+L+'/><path d="M10 46 Q30 14 50 46 Q70 14 90 46" '+L+'/>'+[18,30,42,58,70,82].map(x=>'<line x1="'+x+'" y1="46" x2="'+x+'" y2="'+(46-Math.abs(Math.sin((x-10)/40*Math.PI))*24)+'" '+L+'/>').join('')+'<path d="M4 62 H96" '+L+' stroke-dasharray="3 2"/>';
  if(kind==='comm') s+='<rect x="14" y="24" width="72" height="36" '+L+'/><path d="M14 24 L50 10 L86 24" '+L+'/><rect x="24" y="36" width="20" height="24" '+L+'/><rect x="54" y="34" width="24" height="12" '+L+'/>';
  s+='<text x="94" y="66" text-anchor="end" font-family="monospace" font-size="5" fill="#e8f1ff" opacity=".8">ÉCH. 1:200</text>';
  return '<svg width="'+W+'" height="'+Math.round(W*.7)+'" viewBox="0 0 100 70" style="display:block">'+s+'</svg>'; }

return {site,engine,blueprint};
})();

