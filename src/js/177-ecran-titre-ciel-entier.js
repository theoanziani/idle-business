/* ============================================================
   V2.8.4 : ÉCRAN TITRE · LA VILLE ENTIÈRE
   L'illustration de la ville gardait le cadrage « slice » : sur un téléphone en hauteur, elle était
   agrandie trois fois et coupée (un bout de monument). Elle garde désormais ses proportions, posée en
   bas ; au-dessus, le ciel continue avec la couleur du haut de son dégradé (suivie à toute heure).
   ============================================================ */
{ const _as=artSvg; artSvg=function(key){ const [kind,id,mode]=key.split('|'); if(mode!=='t') return _as(key);
    let a=CITY_ART[id]; if(!a) return ''; return a.replace('<svg ','<svg preserveAspectRatio="xMidYMax meet" ').replace(/(<clipPath[^>]*><rect[^>]*?) rx="22"/,'$1'); }; }
function tsSkyTop(){ document.querySelectorAll('.ts-sky').forEach(d=>{ const st=d.querySelector('linearGradient[id$="sky"] stop'); if(st) d.style.background=st.getAttribute('stop-color')||getComputedStyle(st).stopColor;
    /* la ville se pose juste au-dessus de la carte du bas */
    const sh=document.querySelector('.ts-sheet'), sv=d.querySelector('svg'); if(sh&&sv){ const top=sh.getBoundingClientRect().top-d.getBoundingClientRect().top; sv.style.bottom=Math.round(d.clientHeight-top-28)+'px'; } }); }
addEventListener('resize',()=>{ try{ tsSkyTop(); }catch(e){} });
{ const _ac=applyCitySky; applyCitySky=function(){ const r=_ac.apply(this,arguments); try{ tsSkyTop(); }catch(e){} return r; }; }
