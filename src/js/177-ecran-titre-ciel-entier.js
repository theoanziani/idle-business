/* ============================================================
   V2.8.7 : ÉCRAN TITRE · ILLUSTRATION RESPONSIVE
   Le ciel occupe exactement l'espace entre le haut de l'écran et la carte du bas (mesuré à chaque
   affichage et redimensionnement). La ville y est posée en bas, en entier ou presque : agrandie au plus
   de 35 % pour occuper la hauteur, sans gros plan. Au-dessus, une copie floutée de la même illustration
   prolonge le ciel avec ses vraies couleurs (jour comme nuit), sans démarcation.
   ============================================================ */
{ const _as=artSvg; artSvg=function(key){ const [kind,id,mode]=key.split('|'); if(mode!=='t') return _as(key);
    let a=CITY_ART[id]; if(!a) return ''; return a.replace('<svg ','<svg preserveAspectRatio="xMidYMax meet" ').replace(/(<clipPath[^>]*><rect[^>]*?) rx="22"/,'$1'); }; }
function tsSkyFit(){ try{ const d=document.querySelector('.ts .ts-sky'), sh=document.querySelector('.ts .ts-sheet'); if(!d||!sh) return;
  const fg=[...d.querySelectorAll(':scope > svg')].find(x=>!x.classList.contains('ts-blur')); if(!fg) return;
  const top=sh.getBoundingClientRect().top-d.getBoundingClientRect().top; if(top<40) return;
  const H=Math.round(top+32), W=d.clientWidth; d.style.height=H+'px';
  /* fond flouté : même illustration, couvrante */
  let bg=d.querySelector('svg.ts-blur'); if(!bg||bg.__src!==fg){ if(bg) bg.remove(); bg=fg.cloneNode(true); bg.classList.add('ts-blur'); bg.setAttribute('preserveAspectRatio','xMidYMin slice'); bg.__src=fg; d.insertBefore(bg,fg); }
  /* ville : largeur de l'écran × zoom limité, posée en bas */
  const z=Math.max(1,Math.min(1.35,(top*.62)/(W*9/16))), w=Math.round(W*z);
  fg.style.width=w+'px'; fg.style.height=Math.round(w*9/16)+'px'; fg.style.left=Math.round((W-w)/2)+'px';
  const fd=document.querySelector('.ts .ts-fade'); if(fd){ fd.style.top=Math.round(top-20)+'px'; fd.style.height='52px'; } }catch(e){} }
{ const _r=render; render=function(){ const o=_r.apply(this,arguments); tsSkyFit(); requestAnimationFrame(tsSkyFit); setTimeout(tsSkyFit,300); return o; }; }
{ const _ac=applyCitySky; applyCitySky=function(){ const r=_ac.apply(this,arguments); const b=document.querySelector('.ts .ts-sky svg.ts-blur'); if(b) b.remove(); tsSkyFit(); return r; }; }
addEventListener('resize',tsSkyFit); addEventListener('orientationchange',()=>setTimeout(tsSkyFit,250));
try{ document.fonts&&document.fonts.ready.then(tsSkyFit); }catch(e){}
