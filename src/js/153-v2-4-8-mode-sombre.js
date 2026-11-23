/* ============================================================
   V2.4.8 : MODE SOMBRE
   Un seul thème sombre : fond noir, surfaces gris neutre (aucune teinte bleue).
   La classe html.dk est posée dès que le thème sombre est actif (choix « Sombre », ou « Système »
   avec un appareil en sombre).
   Fiches de société : leurs feuilles de style (claires) sont converties au chargement en une
   version sombre (fonds clairs vers le noir, textes foncés vers le clair, couleurs vives gardées) ;
   les illustrations ne sont pas touchées.
   ============================================================ */
function dkOn(){ const t=(typeof ui!=='undefined'&&ui.theme)||'auto'; if(t==='dark') return true; if(t==='light') return false; try{ return matchMedia('(prefers-color-scheme: dark)').matches; }catch(e){ return false; } }
function dkSync(){ const r=document.documentElement; if(!r) return; r.classList.toggle('dk',dkOn()); r.removeAttribute('data-dk'); }
{ const _st=setTheme; setTheme=function(v){ _st(v); dkSync(); }; }
try{ matchMedia('(prefers-color-scheme: dark)').addEventListener('change',dkSync); }catch(e){}
{ const _r=render; render=function(){ dkSync(); return _r.apply(this,arguments); }; }
try{ dkSync(); }catch(e){}

/* ---------- conversion des feuilles de style des fiches ---------- */
function dkParse(c){ c=c.trim(); let m;
  if((m=c.match(/^#([0-9a-f]{3,8})$/i))){ let h=m[1]; if(h.length===3||h.length===4) h=h.split('').map(x=>x+x).join(''); if(h.length!==6&&h.length!==8) return null; return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),h.length===8? parseInt(h.slice(6,8),16)/255 : 1]; }
  if((m=c.match(/^rgba?\(([^)]*)\)$/i))){ const p=m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat); if(p.length<3) return null; return [p[0],p[1],p[2],p.length>3? p[3] : 1]; }
  if(c==='white') return [255,255,255,1]; if(c==='black') return [0,0,0,1]; return null; }
function dkHsl(r,g,b){ r/=255; g/=255; b/=255; const mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2, d=mx-mn; let h=0, s=0;
  if(d){ s=d/(1-Math.abs(2*l-1)); h= mx===r? ((g-b)/d)%6 : mx===g? (b-r)/d+2 : (r-g)/d+4; h*=60; if(h<0) h+=360; } return [h,s,l,d]; }
const dkOut=(h,s,l,a)=>'hsla('+Math.round(h)+','+Math.round(Math.min(1,s)*100)+'%,'+Math.round(Math.max(0,Math.min(1,l))*100)+'%,'+(+a.toFixed(3))+')';
function dkSurf(c){ const p=dkParse(c); if(!p) return null; const [h,s,l,ch]=dkHsl(p[0],p[1],p[2]), a=p[3];
  if(a<1){ if(l<.25) return 'rgba(255,255,255,'+(+(a*.9).toFixed(3))+')'; return null; }
  if(l>=.95&&ch<.06) return 'var(--dk-card)';
  if(l>=.84&&ch<.12) return 'var(--dk-card2)';
  if(l>=.8) return dkOut(h,Math.min(s,.12),.12,1);
  if(l>=.45){ if(ch>.25) return null; return dkOut(h,0,1.02-l,1); }
  return dkNeutral(h,s,l,a); }
function dkNeutral(h,s,l,a){ if(h>=170&&h<=265&&s>.12&&l<.45) return dkOut(0,0,l*.55,a); return null; }
function dkDarkSurf(c){ const p=dkParse(c); if(!p) return null; const q=dkHsl(p[0],p[1],p[2]); return dkNeutral(q[0],q[1],q[2],p[3]); }
function dkText(c){ const p=dkParse(c); if(!p) return null; const [h,s,l,ch]=dkHsl(p[0],p[1],p[2]), a=p[3]; if(l>=.55) return null;
  if(ch>.28) return dkOut(h,s,Math.max(l+.3,.66),a); return dkOut(h,s*.55,.95-l*.4,a); }
function dkAcc(c){ const p=dkParse(c); if(!p) return null; const [h,s,l]=dkHsl(p[0],p[1],p[2]); if(l>=.5) return null; return dkOut(h,Math.max(s,.35),.6,p[3]); }
const DK_COL=/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\bwhite\b|\bblack\b/g;
const dkMap=(v,f)=>{ let ch=false; const o=v.replace(DK_COL,m=>{ const r=f(m); if(r==null) return m; ch=true; return r; }); return ch? o : null; };
const DK_SKIP=/g-leg|g-hint|nf-hero|nf-ov|nf-chip|nf-lvl|nf-ban|cban|\bsvg\b|\.im\b|nf-tog::after/;
function dkIsDark(v){ const m=(v||'').match(DK_COL); if(!m) return false; const p=dkParse(m[0]); if(!p||p[3]<.8) return false; return dkHsl(p[0],p[1],p[2])[2]<.3; }
function dkKept(v){ if(/var\(--nf-acc|var\(--blue\)|var\(--good|var\(--bad|var\(--lime|var\(--stamp/.test(v||'')) return true; const m=(v||'').match(DK_COL); if(!m) return false; const p=dkParse(m[0]); if(!p) return false; const q=dkHsl(p[0],p[1],p[2]); return p[3]>=.8&&(q[2]<.45||(q[3]>.25&&q[2]<.8)); }
function dkCss(src){
  src=src.replace(/\/\*[\s\S]*?\*\//g,'');
  /* blocs @… (polices, animations, requêtes média) laissés de côté */
  let out='', i=0; const plain=[]; while(i<src.length){ const at=src.indexOf('@',i); if(at<0){ plain.push(src.slice(i)); break; } plain.push(src.slice(i,at)); let j=src.indexOf('{',at), d=0; if(j<0) break; for(;j<src.length;j++){ if(src[j]==='{') d++; else if(src[j]==='}'){ d--; if(!d) break; } } i=j+1; }
  const css=plain.join(''), RX=/([^{}]+)\{([^{}]*)\}/g; let m;
  while((m=RX.exec(css))){ const sel=m[1].trim(); if(!sel||DK_SKIP.test(sel)) continue;
    const D=m[2].split(';').map(x=>x.trim()).filter(Boolean).map(x=>{ const k=x.indexOf(':'); return k<0? null : [x.slice(0,k).trim().toLowerCase(),x.slice(k+1).trim()]; }).filter(Boolean);
    const bg=D.find(d=>/^background(-color)?$/.test(d[0])); if(bg&&dkIsDark(bg[1])&&!/^--/.test(bg[0])){ const O=[]; D.forEach(([k,v])=>{ if(/^(background|background-color|background-image|box-shadow|border.*)$/.test(k)){ const r=dkMap(v,dkDarkSurf); if(r!=null) O.push(k+':'+r); } }); if(O.length) out+=sel.split(',').map(x=>'html.dk '+x.trim()).join(',')+'{'+O.join(';')+'}\n'; continue; }
    
    const keepText=bg&&dkKept(bg[1]), O=[];
    D.forEach(([k,v])=>{ let r=null;
      if(k==='--nf-bg') r='var(--dk-bg)'; else if(k==='--nf-card') r='var(--dk-card)'; else if(k==='--nf-bg2') r='var(--dk-line)'; else if(k==='--nf-sh') r='var(--dk-sh)';
      else if(k==='--nf-acc') r=dkMap(v,dkAcc);
      else if(k==='--nf-acc2') r=null;
      else if(/^(color|fill|stroke|caret-color|-webkit-text-fill-color|text-decoration-color|--nf-h|--ink.*)$/.test(k)){ if(!keepText||/^--/.test(k)) r=dkMap(v,dkText); }
      else if(/^(background|background-color|background-image|box-shadow|border.*|outline.*|--.*)$/.test(k)) r=dkMap(v,dkSurf);
      if(r!=null) O.push(k+':'+r); });
    if(O.length) out+=sel.split(',').map(x=>'html.dk '+x.trim()).join(',')+'{'+O.join(';')+'}\n'; }
  return out; }
{ const _c=nfCssOnce; nfCssOnce=function(){ const had=!!document.getElementById('nf-css'); _c(); if(had||document.getElementById('nf-dk')) return;
  let x=''; try{ x=dkCss(NF_BASE_CSS+'\n'+NF_CSS.join('\n')); }catch(e){ console.error(e); }
  x+=`html.dk .md.nf{--ink:var(--dk-ink);--ink-2:var(--dk-ink2);--ink-3:var(--dk-ink3);--red:#FF8A7D;--red-soft:#2C1614;--green:#4BE29A;--green-soft:#0D251B;--amber:#FFD25E;--amber-soft:#2A2310;--lime:#FFC93C;color-scheme:dark}
html.dk .md.nf .nf-tog{background:#3a3a40}
html.dk .md.nf .nf-chip{color:#1B2550}
html.dk .md.nf .nf-more{background:rgba(255,255,255,.06)}
html.dk .md.nf .nf-hero{box-shadow:0 4px 0 var(--dk-sh)}
html.dk .md.nf .nf-res small{color:var(--dk-ink3)}
`;
  const st=document.createElement('style'); st.id='nf-dk'; st.textContent=x; document.head.appendChild(st); }; }
NF_CSS.push(`html.dk .nf-globe{background:radial-gradient(circle at 50% 45%,#141414 0%,#050505 60%,#000 100%);box-shadow:0 4px 0 #000}`);

