/* ============================================================
   V2.8.4 : ÉCRAN TITRE · LA VILLE ENTIÈRE
   L'illustration de la ville gardait le cadrage « slice » : sur un téléphone en hauteur, elle était
   agrandie trois fois et coupée (un bout de monument). Elle garde désormais ses proportions, posée en
   bas ; au-dessus, le ciel continue avec la couleur du haut de son dégradé (suivie à toute heure).
   ============================================================ */
{ const _as=artSvg; artSvg=function(key){ const [kind,id,mode]=key.split('|'); if(mode!=='t') return _as(key);
    let a=CITY_ART[id]; if(!a) return ''; return a.replace('<svg ','<svg preserveAspectRatio="xMidYMax meet" ').replace(/(<clipPath[^>]*><rect[^>]*?) rx="22"/,'$1'); }; }
function tsSkyTop(){ document.querySelectorAll('.ts-sky').forEach(d=>{ const st=d.querySelector('linearGradient[id$="sky"] stop'); if(st) d.style.background=st.getAttribute('stop-color')||getComputedStyle(st).stopColor;
    /* la ville se pose juste au-dessus de la carte du bas, assez grande pour remplir le haut de l'écran */
    const sh=document.querySelector('.ts-sheet'), sv=d.querySelector('svg'); if(sh&&sv){ const W=d.clientWidth, top=sh.getBoundingClientRect().top-d.getBoundingClientRect().top;
      const h=Math.max(W*9/16, Math.min(top*.6, W*1.1)), w=h*16/9; sv.style.width=Math.round(w)+'px'; sv.style.left=Math.round((W-w)/2)+'px'; d.style.height=Math.round(top+30)+'px'; sv.style.bottom='14px'; const fd=document.querySelector('.ts-fade'); if(fd){ fd.style.top=Math.round(top-26)+'px'; fd.style.height='56px'; } } }); }
const tsSkyFit = () => { try{ tsSkyTop(); }catch(e){} };
addEventListener('resize',tsSkyFit);
{ const _ac=applyCitySky; applyCitySky=function(){ const r=_ac.apply(this,arguments); tsSkyFit(); requestAnimationFrame(tsSkyFit); setTimeout(tsSkyFit,350); setTimeout(tsSkyFit,1200); return r; }; }
try{ document.fonts&&document.fonts.ready.then(tsSkyFit); }catch(e){}
