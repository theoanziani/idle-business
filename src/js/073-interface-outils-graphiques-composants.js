/* ============================================================
   INTERFACE : outils, graphiques, composants
   ============================================================ */
const $ = (s,r)=> (r||document).querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ui = { tab:'home', sub:{markets:'savings'}, modal:null, confirm:null, auto:false, speed:900, timer:null, delta:null, candRole:{}, qty:{}, owner:'player', tmp:{} };

const ICON = {
  home:'<rect x="3" y="3" width="7" height="8"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="15" width="7" height="6"/>',
  biz:'<path d="M4 21V8l8-4 8 4v13M9 21v-6h6v6M8 11h2M14 11h2"/>',
  bank:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18"/>',
  markets:'<path d="M3 20h18M5 16l4-5 4 3 6-8"/>',
  immo:'<path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6"/>',
  luxe:'<path d="M6 4h12l3 5-9 11L3 9zM3 9h18M9 4l-2 5 5 11 5-11-2-5"/>',
  pol:'<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0zM8 21h8"/>',
  books:'<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11"/>',
  set:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  agency:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5.2a3 3 0 010 5.6M18 14.4c1.9.8 3 2.7 3 5.6"/>',
  guide:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 115 0c0 1.7-2.5 2-2.5 4M12 17h.01"/>',
  cities:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  fx:'<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
  rivals:'<path d="M4 20l6-6M14 10l6-6M4 4l16 16M5 5l3 0M16 19l3 0"/>',
  auction:'<path d="M14 4l6 6-3 3-6-6zM11 7l-7 7 3 3 7-7M3 21h10"/>',
  logi:'<path d="M3 21V10l6 4V10l6 4V6l6 4v11zM7 17h2M12 17h2M17 17h2"/>',
  plus:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
};
const icon = k => '<svg viewBox="0 0 24 24" aria-hidden="true">'+ICON[k]+'</svg>';

/* ---------- composants ---------- */
const signed = (n,dec) => (n>0?'+':'')+eur(n,dec);
const cls = n => n>0.005?'pos':n<-0.005?'neg':'dim';
const pill = (t,k) => '<span class="pill '+(k||'')+'">'+t+'</span>';
const bar = (p,k) => '<div class="bar '+(k||'')+'"><i style="width:'+clamp(p*100,0,100).toFixed(1)+'%"></i></div>';
const btn = (label,a,o) => { o=o||{}; return '<button class="btn '+(o.c||'')+'" data-a="'+a+'"'+(o.i!==undefined?' data-i="'+esc(o.i)+'"':'')+(o.j!==undefined?' data-j="'+esc(o.j)+'"':'')+(o.v!==undefined?' data-v="'+esc(o.v)+'"':'')+(o.dis?' aria-disabled="true" data-dis="1" data-why="'+esc(disWhy(label,o))+'"':'')+(o.t?' title="'+esc(o.t)+'"':'')+'>'+label+'</button>'; };
/* Bouton indisponible : il reste touchable et dit pourquoi. */
function disWhy(label,o){ if(o.why) return o.why; if(o.t) return o.t;
  { const pm=String(label).replace(/<[^>]*>/g,' ').match(/(palier de maîtrise \d+ requis|palier « [^»]+ » requis|palier \d+ requis)/i); if(pm) return pm[1].charAt(0).toUpperCase()+pm[1].slice(1)+'.'; }
  try{ const L=String(label).replace(/<[^>]*>/g,''), re=/(\d[\d\s\u202f\u00a0.,]*?)\s*(Bn|Md|M)?\s*€/g; let m, last=null; while((m=re.exec(L))) last=m;
    if(!last){ const re2=/€\s?(\d[\d,.]*)\s*(Bn|bn|Md|B|M)?/g; while((m=re2.exec(L))) last=[m[0],m[1],m[2]==='B'||m[2]==='bn'?'Md':m[2]]; }
    if(last){ const fr=(typeof LANG==='undefined'||LANG==='fr'), n=fr? last[1].replace(/[\s\u202f\u00a0]/g,'').replace(',','.') : last[1].replace(/[,\s\u202f\u00a0]/g,''), v=parseFloat(n)*({Bn:1e12,Md:1e9,M:1e6}[last[2]]||1); if(isFinite(v)&&S.cash<v) return 'Trésorerie insuffisante : il manque '+eur(v-S.cash,0)+'.'; } }catch(e){}
  return 'Indisponible pour le moment.'; }
/* Poste à pourvoir : statut clair + une seule action (remplace les Oui/Non). */
function hireRow(on,a,o){ o=o||{}; const x={i:o.i};
  return '<div class="row sp hire-r"><span class="pill '+(on?'good':'')+'">'+(on?'En poste':'Poste vacant')+'</span>'+(on?btn('Licencier',a,Object.assign({c:'sm ghost',v:0},x)):btn('Recruter · '+eur(o.hire||0,0),a,Object.assign({c:'sm pri',v:1},x)))+'</div>'; }
const dots = (n,max) => '<span class="dots" title="Risque">'+Array.from({length:max||5},(_,i)=>'<i class="'+(i<n?'on':'')+'"></i>').join('')+'</span>';
const card = (title,body,o) => { o=o||{}; return '<section class="card '+(o.c||'')+'">'+(title?'<h2><span>'+title+'</span>'+(o.tools?'<span class="tools">'+o.tools+'</span>':'')+'</h2>':'')+body+'</section>'; };
function toast(m,k){
  const box=$('#toast-root'); if(!box) return; const d=document.createElement('div'); d.className='toast '+(k||''); d.textContent=m; box.appendChild(d);
  setTimeout(()=>{ d.remove(); },k==='bad'?5200:3200);
}
function res(r,okMsg){ if(!r) return r; if(r.ok){ if(r.msg||okMsg) toast(r.msg||okMsg,'good'); } else toast(fxHint(r.msg||'Action impossible.'),'bad'); return r; }
/* rappel : à l'étranger, on paie avec le compte de la devise du pays */
function fxHint(m){ return m; }

/* ---------- graphiques SVG ---------- */
let chartId=0;
function lineChart(vals,o){
  o=o||{}; const W=o.w||640,H=o.h||150,pl=o.pl||8,pr=o.pr||50,pt=10,pb=18;
  if(!vals||vals.length<2) return '<div class="sub">Pas encore assez de données.</div>';
  let mn=Math.min(...vals), mx=Math.max(...vals); if(o.zero){ mn=Math.min(mn,0); mx=Math.max(mx,0); }
  if(mx===mn){ mx+=1; mn-=1; } const pad=(mx-mn)*0.08; mn-=pad; mx+=pad;
  const X=i=>pl+(W-pl-pr)*i/(vals.length-1), Y=v=>pt+(H-pt-pb)*(1-(v-mn)/(mx-mn));
  const col=o.color||'var(--ink)', fc=o.color||'var(--lime)'; const id='g'+(++chartId);
  let d=vals.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+','+Y(v).toFixed(1)).join('');
  let grid=''; for(let k=0;k<4;k++){ const v=mn+(mx-mn)*k/3, y=Y(v); grid+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y.toFixed(1)+'" y2="'+y.toFixed(1)+'" stroke="var(--line)" stroke-width="1"/><text x="'+(W-pr+5)+'" y="'+(y+3).toFixed(1)+'">'+(o.fmt?o.fmt(v):eur(v))+'</text>'; }
  const lx=X(vals.length-1), ly=Y(vals[vals.length-1]);
  let zero=''; if(o.zero&&mn<0&&mx>0) zero='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+Y(0).toFixed(1)+'" y2="'+Y(0).toFixed(1)+'" stroke="var(--ink-3)" stroke-dasharray="3 3"/>';
  return '<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'Graphique')+'"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+fc+'" stop-opacity="'+(o.color?'.28':'.55')+'"/><stop offset="1" stop-color="'+fc+'" stop-opacity="0"/></linearGradient></defs>'+grid+zero+
    (o.fill===false?'':'<path d="'+d+'L'+lx.toFixed(1)+','+(H-pb)+'L'+pl+','+(H-pb)+'Z" fill="url(#'+id+')"/>')+
    '<path d="'+d+'" fill="none" stroke="'+col+'" stroke-width="2" stroke-linejoin="round"/><circle cx="'+lx.toFixed(1)+'" cy="'+ly.toFixed(1)+'" r="3.5" fill="'+col+'"/>'+
    (o.x0!==undefined?'<text x="'+pl+'" y="'+(H-3)+'">'+o.x0+'</text><text x="'+(W-pr)+'" y="'+(H-3)+'" text-anchor="end">'+o.x1+'</text>':'')+'</svg>';
}
function spark(vals,w,h){
  w=w||110;h=h||30; if(!vals||vals.length<2) return '';
  const mn=Math.min(...vals), mx=Math.max(...vals), r=(mx-mn)||1, up=vals[vals.length-1]>=vals[0];
  const d=vals.map((v,i)=>(i?'L':'M')+(w*i/(vals.length-1)).toFixed(1)+','+(h-2-(h-4)*(v-mn)/r).toFixed(1)).join('');
  return '<svg viewBox="0 0 '+w+' '+h+'" width="'+w+'" height="'+h+'" aria-hidden="true"><path d="'+d+'" fill="none" stroke="'+(up?'var(--green)':'var(--red)')+'" stroke-width="1.6" stroke-linejoin="round"/></svg>';
}
function barsChart(vals,o){
  o=o||{}; const W=o.w||300,H=o.h||70; if(!vals.length) return '';
  const mx=Math.max(1,...vals.map(Math.abs)); const bw=(W-4)/vals.length; const mid=H/2;
  return '<svg class="chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'Résultats quotidiens')+'"><line x1="0" x2="'+W+'" y1="'+mid+'" y2="'+mid+'" stroke="var(--line)"/>'+
    vals.map((v,i)=>{ const h=Math.abs(v)/mx*(mid-3); return '<rect x="'+(2+i*bw+0.5).toFixed(1)+'" y="'+(v>=0?mid-h:mid).toFixed(1)+'" width="'+Math.max(1,bw-1.5).toFixed(1)+'" height="'+Math.max(0.5,h).toFixed(1)+'" fill="'+(v>=0?'var(--green)':'var(--red)')+'" rx="1"/>'; }).join('')+'</svg>';
}

/* ---------- tableau des effectifs (société ou banque) ---------- */
function staffPanel(e,kind){
  const roles=entRoles(e); const key=kind==='bank'?'bank':'b'+e.id;
  let h='<div class="tw"><table class="tbl"><thead><tr><th>Poste</th><th class="r">Effectif</th><th class="r">Product.</th><th class="r">Fiabilité</th><th class="r">Fidélité</th><th class="r">Salaire/j</th><th></th></tr></thead><tbody>';
  roles.forEach(([r,slots])=>{
    const c=e.staff[r]||{n:0,prod:0,rel:0,loy:0}; const w=c.n? wageOf(e,r,c):0;
    h+='<tr><td>'+roleS(e,r)+'</td><td class="r num">'+c.n+' / '+slots+'</td><td class="r num '+(c.n?noteCls(prodNote(c.prod)):'')+'">'+(c.n?prodNote(c.prod)+' <small>('+multPct(c.prod)+')</small>':'—')+'</td><td class="r num">'+(c.n?Math.round(c.rel*100)+' %':'—')+'</td><td class="r num '+(c.n&&c.loy<35?'neg':'')+'">'+(c.n?Math.round(c.loy):'—')+'</td><td class="r num">'+(c.n?eur(w,0):'—')+'</td><td class="r"><div class="row" style="justify-content:flex-end;gap:4px">'
      +btn('Recruter','candopen',{c:'sm',i:key,j:r,dis:c.n>=slots,why:'Tous les postes de ce rôle sont pourvus.'})
      +btn('Compléter','hirefill',{c:'sm ghost',i:key,j:r,dis:c.n>=slots,t:'Recrute des profils moyens jusqu’à pourvoir tous les postes'})
      +btn('−1','fire',{c:'sm ghost dng',i:key,j:r,dis:!c.n,t:'Licencier un employé (indemnités)'})+'</div></td></tr>';
    if(ui.candRole[key]===r){
      const cs=candsFor(e,r);
      h+='<tr><td colspan="7"><div class="stack" style="padding:6px 0"><div class="row sp"><b>Candidats pour « '+roleS(e,r)+' »</b>'+btn('Chercher d’autres profils ('+eur(60*(e.kind==='bank'?1:e.lvl),0)+')','candrefresh',{c:'sm',i:key,j:r})+'</div>';
      if(!cs.length) h+='<div class="sub">Aucun candidat. Lancez une recherche.</div>';
      cs.forEach(c=>{
        const tmp={prod:c.prod}, w=wageOf(e,r,tmp);
        h+='<div class="cand"><div><b>'+esc(c.name)+'</b>'+(e.def==='repair'&&c.sk?'<div class="sub">'+rpSkTxt(c.sk)+'</div>':'')+'</div><div><span class="tag">Product.</span><br><span class="num '+noteCls(prodNote(c.prod))+'">'+prodNote(c.prod)+'</span></div><div><span class="tag">Fiabilité</span><br><span class="num">'+Math.round(c.rel*100)+' %</span></div><div><span class="tag">Salaire/j</span><br><span class="num">'+eur(w,0)+'</span></div>'+btn('Embaucher','hire',{c:'sm pri',i:key,j:r,v:c.id})+'</div>';
      });
      h+='</div></td></tr>';
    }
  });
  return h+'</tbody></table></div><div class="row sp" style="margin-top:8px"><span class="sub"></div>';
}

