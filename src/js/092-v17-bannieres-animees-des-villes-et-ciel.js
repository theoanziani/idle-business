/* ============================================================
   V17 : bannières animées des villes et ciel à l'heure réelle
   ============================================================ */
const CITY_CYC = 32;
function cityTimeMode(){ try{ return localStorage.getItem('ib.citytime')||'cycle'; }catch(e){ return 'cycle'; } }
function cityPhase(d){
  const h=d.getHours()+d.getMinutes()/60;
  if(h>=7&&h<17) return .1;                       // jour
  if(h>=17&&h<20) return .25+(h-17)/3*.17;        // crépuscule
  if(h>=20||h<6) return .6;                       // nuit
  return .86+(h-6)*.12;                           // aube
}
function cityBanner(cid,cls){
  const a=CITY_ART[cid]; if(!a) return '';
  return '<div class="cban '+(cls||'')+'" aria-hidden="true">'+(/fm|thumb/.test(cls||'')? a.replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ') : a)+'</div>';
}
function actBanner(def,cls){ const a=(typeof ACT_ART!=='undefined')&&ACT_ART[def]; if(!a) return ''; return '<div class="cban '+(cls||'')+'" aria-hidden="true">'+(/opt/.test(cls||'')? a.replace('<svg ','<svg preserveAspectRatio="xMidYMid slice" ') : a)+'</div>'; }
function valAt(vals,kts,p){
  const v=vals.split(';').map(Number), k=kts? kts.split(';').map(Number) : v.map((_,i)=>i/(v.length-1));
  for(let i=1;i<k.length;i++){ if(p<=k[i]){ const t=(p-k[i-1])/((k[i]-k[i-1])||1); return v[i-1]+(v[i]-v[i-1])*t; } }
  return v[v.length-1];
}
function applyCitySky(){
  const real=cityTimeMode()==='real', p=cityPhase(new Date()), rm=RM();
  document.querySelectorAll('.cban:not([data-sky]) svg').forEach(svg=>{
    svg.parentNode.setAttribute('data-sky','1');
    if(real){
      svg.querySelectorAll('animate[dur="'+CITY_CYC+'s"]').forEach(an=>{
        const el=an.parentNode, attr=an.getAttribute('attributeName');
        if(attr==='opacity'){
          const kv=an.getAttribute('values'), kt=an.getAttribute('keyTimes');
          // scintillements : on garde l'animation seulement s'il fait nuit
          el.setAttribute('opacity', valAt(kv,kt,p).toFixed(3));
          an.remove();
        }
      });
    }
    if(rm||svg.parentNode.classList.contains('still')) svg.pauseAnimations();
  });
}
{ const _r3=render; render=function(){ _r3(); try{ applyCitySky(); }catch(e){ console.error(e); } }; }
ACT.citytime=el=>{ try{ localStorage.setItem('ib.citytime',el.dataset.v); }catch(e){} render(); };

