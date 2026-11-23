/* ============================================================
   V2.4.4 : NOUVELLE FICHE SOCIÉTÉ, UN ÉCRAN PROPRE À CHAQUE MÉTIER
   L'onglet principal de la fiche est remplacé par l'écran du métier (FX2[def].body), avec son
   ambiance (couleurs, police), puis, en bas, les paliers, quatre raccourcis communs (Équipe,
   Finances, Local, Sécurité) et une ligne de délégation.
   Les autres onglets restent ceux d'avant. Affichage seulement : aucun état sauvegardé
   (seulement des choix d'interface dans ui.nf).
   Une société sans entrée dans NF garde l'ancienne fiche.
   ============================================================ */
const FX2 = {};
const NF_CSS = [];
function nfUi(b){ if(!ui.nf||ui.nf.b!==b.id) ui.nf={b:b.id}; return ui.nf; }
ACT.nfui=el=>{ const b=S.biz.find(x=>x.id===+el.dataset.i); if(!b) return; const U=nfUi(b), k=el.dataset.v, v=el.dataset.j===undefined? 1 : el.dataset.j; U[k]= String(U[k])===String(v)? null : v; render(); };

/* ---------- contrôles du métier (metCtl) dans le style de la fiche ---------- */
function nfCtx(b){ const C=metCtl(b), used=new Set();
  return { C, get:a=>{ const c=C.find(x=>x.act===a); if(c) used.add(c); return c; }, has:a=>C.some(x=>x.act===a), rest:()=>C.filter(c=>!used.has(c)) }; }
function nfAttr(b,c,j){ return ' data-a="met" data-i="'+b.id+'" data-v="'+esc(c.act)+'"'+(j!==undefined? ' data-j="'+esc(j)+'"' : c.arg!==undefined? ' data-j="'+esc(c.arg)+'"' : ''); }
function nfBtn(b,c,label,o){ o=o||{}; const dis=o.dis;
  return '<button class="btn nf-b'+(o.c?' '+o.c:'')+'"'+nfAttr(b,c,o.j)+(dis?' disabled':'')+(dis&&(c.why||c.sub)?' data-why="'+esc(c.why||c.sub)+'"':'')+(o.l?' aria-label="'+esc(o.l)+'"':'')+'>'+label+'</button>'; }
function nfCan(b,x){ return availFor(cityOf(b).ccy)>=x; }
function nfSegH(b,c,opts,o){ o=o||{}; opts=opts||c.opts||[]; return '<div class="nf-seg'+(o.c?' '+o.c:'')+'" role="group" aria-label="'+esc(c.label)+'">'+opts.map(x=>'<button class="'+(String(x[0])===String(c.val)?'on':'')+'"'+nfAttr(b,c,x[0])+'>'+esc(x[1])+'</button>').join('')+'</div>'; }
function nfTogH(b,c,o){ o=o||{}; const on=!!c.val; return '<button class="nf-tog'+(on?' on':'')+'"'+nfAttr(b,c,on?0:1)+' role="switch" aria-checked="'+on+'" aria-label="'+esc(c.label)+'"'+(o.dis?' disabled':'')+'></button>'; }
function nfRowH(t,s,right,o){ o=o||{}; return '<div class="nf-row'+(o.c?' '+o.c:'')+'"><span><b>'+t+'</b>'+(s?'<small>'+s+'</small>':'')+'</span>'+(right||'')+'</div>'; }
/* une décision générique (seg, interrupteur, achat, bouton) */
function nfCtlH(b,c){ if(!c) return '';
  if(c.k==='tog') return nfRowH(esc(c.label),esc(c.sub||''),nfTogH(b,c));
  if(c.k==='seg'){ if(c.val==='x') return '<div class="nf-ctl">'+nfRowH(esc(c.label),esc(c.sub||''))+nfSegH(b,c)+'</div>'; return '<div class="nf-ctl">'+nfRowH(esc(c.label),esc(c.sub||''))+nfSegH(b,c)+'</div>'; }
  if(c.k==='buy'||c.k==='stars'){ const r= c.owned? '<span class="nf-ok">En place</span>' : c.dis&&c.k==='stars'? '<span class="nf-ok">Maximum</span>' : nfBtn(b,c,(c.k==='stars'?'Monter · ':'')+eur(c.cost,0),{c:'a',dis:c.dis||!nfCan(b,c.cost)}); return nfRowH(esc(c.label),esc(c.sub||''),r); }
  if(c.k==='btn'){ const lab= c.bl? esc(c.bl) : c.gain!==undefined? 'Encaisser '+eur(c.gain,0) : c.cost!==undefined? eur(c.cost,0) : 'OK'; return nfRowH(esc(c.label),esc(c.sub||''),nfBtn(b,c,lab,{c:'a',dis:c.dis||(c.cost!==undefined&&!nfCan(b,c.cost))})); }
  return ''; }
function nfSec(t,sm){ return '<h2 class="nf-sec">'+t+(sm?'<small>'+sm+'</small>':'')+'</h2>'; }
function nfDots(v,n){ n=n||5; const k=Math.round(clamp(v,0,n)); return '<span class="nf-dots" aria-label="'+k+' sur '+n+'">'+'●'.repeat(k)+'<i>'+'●'.repeat(n-k)+'</i></span>'; }

/* ---------- bas de fiche commun ---------- */
function nfPath(b,o){ const m=metOf(b); if(!m||!m.ranks) return ''; const r=mxRank(b), U=nfUi(b);
  let h=nfSec((o&&o.t)||'Les paliers','palier '+r+' sur 5')+'<div class="nf-card nf-path"><div class="nf-steps">'+m.ranks.map((k,i)=>(i?'<span class="ln'+(i<=r?' on':'')+'"></span>':'')+'<button class="p'+(i<r?' done':i===r?' now':'')+'" data-a="nfui" data-i="'+b.id+'" data-v="path" aria-label="Palier '+(i+1)+' : '+esc(k.n)+'"><i>'+(i<r?'✓':i+1)+'</i>'+esc(k.n)+'</button>').join('')+'</div>';
  if(U.path) h+='<div class="nf-pathd">'+mxHtml(b)+'</div>';
  return h+'</div>'; }
function nfMgmt(b,o){ o=o||{}; const roles=entRoles(b).reduce((a,x)=>a+x[1],0), l=b.last; let loc='—';
  try{ const own=ownShare(b)>=1||cityOwned(b.city), bd=b.bld&&bldById(b.bld); loc= own? 'propriétaire' : bd? 'locataire · '+eur(bldRent(bd),0)+' / j' : 'locataire'; }catch(e){}
  const T=[['Équipe',headcount(b)+' / '+roles+' · fatigue '+Math.round(fatOf(b)),'fichetab','eq'],['Finances',l? signed(l.net,0)+' hier' : '—','fichetab','fin'],[o.local||'Local',o.localTxt||loc,'fichetab','reg'],['Sécurité',SECN[b.sec||0].toLowerCase()+' · '+(b.ins?'assuré':'non assuré'),'jump','bj-sec']];
  return nfSec(o.t||'Gestion du site')+'<div class="nf-mgmt">'+T.map(t=>'<button class="nf-mg" data-a="'+t[2]+'" '+(t[2]==='jump'?'data-i':'data-v')+'="'+t[3]+'">'+esc(t[0])+'<small>'+esc(t[1])+'</small></button>').join('')+'</div>'; }
function nfDlg(b,o){ o=o||{}; const m=metOf(b), x=b.boss, U=nfUi(b), md=dlMode(b);
  let h='<div class="nf-dlg"><span><b>'+(x? esc(x.name)+', '+esc(o.role||'directeur du site') : 'Aucun directeur de site')+'</b>'+(x? (md==='me'? esc(o.txt||'peut gérer la société à votre place') : 'mode : '+esc(DL_MODES[md].n.toLowerCase())) : 'recrutez-en un pour lui confier la société')+'</span>'+
    (x? '<button class="nf-lnk" data-a="nfui" data-i="'+b.id+'" data-v="dl">'+(U.dl?'Fermer':md==='me'?'Confier':'Régler')+'</button>' : '<button class="nf-lnk" data-a="fichetab" data-v="eq">Recruter</button>')+'</div>';
  if(x&&U.dl&&m&&m.auto) h+='<div class="nf-card nf-dlp">'+dlHtml(b)+'</div>';
  return h; }
function nfLog(b,n){ const st=metState(b); if(!st||!st.log||!st.log.length) return ''; return nfSec('Les dernières nouvelles')+'<div class="nf-card nf-log">'+st.log.slice(0,n||4).map(x=>'<div class="'+(x.c==='bad'?'neg':x.c==='good'?'pos':'')+'"><span>'+dateS(x.d)+'</span>'+esc(x.t.charAt(0).toUpperCase()+x.t.slice(1))+'</div>').join('')+'</div>'; }
function nfRest(b,X,t){ const R=X.rest(); if(!R.length) return ''; return nfSec(t||'Autres décisions')+'<div class="nf-card nf-list">'+R.map(c=>nfCtlH(b,c)).join('')+'</div>'; }
/* l'écran d'avant du métier (complet), rangé dans une carte, pour les métiers très riches */
function nfLegacy(b,t,sm){ const m=metOf(b); let x=''; try{ x=m&&m.html? m.html(b) : ''; }catch(e){ console.error(e); } if(!x) return ''; return (t?nfSec(t,sm):'')+'<div class="nf-card nf-leg">'+x+'</div>'; }
function nfSupply(b,t){ let x=''; try{ x= isFact(b)? factOutHtml(b) : supInHtml(b); }catch(e){} if(!x) return ''; const U=nfUi(b);
  return nfSec(t||(isFact(b)?'Les ventes et les stocks':'Les fournisseurs'))+'<div class="nf-card nf-sup">'+nfRowH(isFact(b)?'Écoulement de la production':'Approvisionnement',U.sup?'':'grossistes, vos usines, contrats','<button class="nf-lnk" data-a="nfui" data-i="'+b.id+'" data-v="sup">'+(U.sup?'Fermer':'Ouvrir')+'</button>')+(U.sup?'<div style="margin-top:8px">'+x+'</div>':'')+'</div>'; }

/* ---------- assemblage ---------- */
function nfOn(b){ return !!(b&&b.status==='active'&&FX2[b.def]&&metOf(b)&&b.m); }
function nfHero(b,F){ const d=bizDef(b); let chip=''; try{ chip=F.chip? F.chip(b) : ''; }catch(e){}
  return '<div class="nf-hero"><div class="nf-ban"></div>'+'<div class="nf-chips">'+(chip?'<span class="nf-chip"><i></i>'+esc(chip)+'</span>':'<span></span>')+'<span class="nf-lvl">Niv. '+b.lvl+'</span></div>'+
    '<div class="nf-ov"><div class="nf-nm"><h1>'+esc(b.name)+'</h1><button class="nf-edit" data-a="bzren" data-i="'+b.id+'" aria-label="Renommer '+esc(b.name)+'">✎</button></div><div class="nf-subt">'+esc(d.n)+' · '+esc(bizAddr(b))+'</div></div></div>'; }
function nfRes(b,F){ const l=b.last, h=(b.hist||[]).slice(-30), avg=h.length? h.reduce((a,x)=>a+x,0)/h.length : 0; let st=null; try{ st=F.stat&&F.stat(b); }catch(e){}
  if(!st) st=['Moyenne 30 jours', '<b class="'+cls(avg)+'">'+signed(avg,0)+'</b>'];
  else st=[st[0],'<b>'+esc(st[1])+'</b>'];
  return '<div class="nf-res"><div><small>Bénéfice hier</small><b class="'+cls(l?l.net:0)+'">'+(l? signed(l.net,0) : '—')+'</b></div><div style="text-align:right"><small>'+esc(st[0])+'</small>'+st[1]+'</div></div>'; }
function nfBody(b){ const F=FX2[b.def]; let h='';
  try{ const X=nfCtx(b); h=F.body(b,X,nfUi(b));
    if(!F.noRest) h+=nfRest(b,X);
    if(!F.noSup) h+=nfSupply(b);
  }catch(e){ console.error(e); h='<div class="notice bad">Affichage du métier indisponible.</div>'; }
  if(!F.noPath) h+=nfPath(b,F.path);
  h+=nfLog(b)+nfMgmt(b,F.mgmt)+nfDlg(b,F.dlg);
  return h; }
function nfCssOnce(){ if(document.getElementById('nf-css')) return; const st=document.createElement('style'); st.id='nf-css'; st.textContent=nfFontCss()+NF_BASE_CSS+NF_CSS.join('\n'); document.head.appendChild(st); }
function nfApply(){
  const md=document.querySelector('.md'), body=md&&md.querySelector('.md-b'); if(!md||!body) return;
  md.classList.remove('nf'); [...md.classList].forEach(c=>{ if(/^nf-/.test(c)) md.classList.remove(c); }); md.removeAttribute('data-nf');
  if(!ui.modal||ui.modal.type!=='biz') return; const b=S.biz.find(x=>x.id===ui.modal.id); if(!b||!FX2[b.def]) return;
  if(body.querySelector(':scope > .nf-top')) return;
  const ft=ui.ft||'met', live=nfOn(b)&&ft==='met'&&!!body.querySelector('#bj-met');
  nfCssOnce(); const F=FX2[b.def];
  md.classList.add('nf','nf-'+b.def,'nf-t-'+ft); md.setAttribute('style',(md.getAttribute('style')||'').replace(/--nf[^;]*;/g,'')+(F.vars||''));
  ['.bhero','.bstats','.mini'].forEach(s=>body.querySelectorAll(':scope > '+s).forEach(e=>e.classList.add('nf-hide')));
  if(live){ body.querySelectorAll(':scope > #bj-met').forEach(e=>e.classList.add('nf-hide'));
    body.querySelectorAll(':scope > section.card:not(.met):not(.ft-hide)').forEach(e=>{ if(!e.id) e.classList.add('nf-hide'); }); }
  const top=document.createElement('div'); top.className='nf-top'; top.innerHTML=nfHero(b,F)+(b.status==='active'? nfRes(b,F) : ''); body.insertBefore(top,body.firstChild);
  const ban=body.querySelector('.bhero .cban'), nb=top.querySelector('.nf-ban'); if(ban&&nb) nb.appendChild(ban);
  /* barre d'onglets aux couleurs de la fiche (remplace l'ancienne) */
  const old=body.querySelector(':scope > .ft-tabs'); let nav=null;
  if(old){ old.classList.add('nf-hide'); nav=document.createElement('div'); nav.className='nf-tabs'; nav.setAttribute('role','tablist');
    nav.innerHTML=[...old.querySelectorAll('button')].map(x=>'<button role="tab" aria-selected="'+(x.dataset.v===ft)+'" class="'+(x.dataset.v===ft?'on':'')+'" data-a="fichetab" data-v="'+esc(x.dataset.v)+'">'+esc(x.textContent)+'</button>').join(''); old.before(nav); }
  if(!live) return;
  const main=document.createElement('div'); main.className='nf-main'; main.innerHTML=nfBody(b);
  main.insertAdjacentHTML('afterbegin',nfFlowHtml(b));
  const anchor=nav||body.querySelector(':scope > .fam-todo')||body.querySelector(':scope > .bigup')||top; anchor.after(main);
  try{ nfMorePass(b,main); }catch(e){ console.error(e); }
  const up=body.querySelector(':scope > .bigup'); if(up&&F.up){ try{ const t=F.up(b); if(t){ const n=up.firstChild; if(n&&n.nodeType===3) n.textContent=t+' '; } }catch(e){} }
}
/* parcours qui ouvraient une fenêtre (ouvrir une ligne, ajouter un navire ou un avion, affrètement) :
   affichés dans la fiche ; l'état du parcours est dans ui.nfm, la fiche reste ouverte */
const NF_FLOW_T=['shnew','shadd','shch','alnew','aladd'];
function nfFlowWrap(keys){ keys.forEach(k=>{ const f=ACT[k]; if(!f||f.__nf) return;
  const g=el=>{ const M=ui.modal, inNf=!!document.querySelector('.md.nf');
    if(!ui.nfm&&!(inNf&&M&&M.type==='biz')) return f(el);
    const biz= M&&M.type==='biz'? M : (ui.nfm? {type:'biz',id:ui.nfm.id} : M);
    if(ui.nfm) ui.modal=ui.nfm;
    const _r=render; render=function(){}; let done=false;
    try{ f(el); } finally{ render=_r; }
    const N=ui.modal; ui.nfm= N&&NF_FLOW_T.includes(N.type)? N : null;
    if(!N||N.type==='biz'||ui.nfm) ui.modal=biz;
    render();
    if(ui.nfm) setTimeout(()=>{ const e=document.querySelector('.nf-flow'); if(e) e.scrollIntoView({behavior:'smooth',block:'start'}); },30); };
  g.__nf=1; ACT[k]=g; }); }
ACT.nfflowx=()=>{ ui.nfm=null; render(); };
function nfFlowHtml(b){ const F=ui.nfm; if(!F||F.id!==b.id) return '';
  const save=ui.modal; let r=null; ui.modal=F; try{ r=modalContent(); }catch(e){ console.error(e); } ui.modal=save;
  if(!r||!r.body) { ui.nfm=null; return ''; }
  const body=r.body.replace(/<button class="back"[^>]*>[\s\S]*?<\/button>/,'');
  return '<div class="nf-card nf-flow"><div class="hd"><b>'+esc(r.title||'')+'</b><button class="nf-lnk" data-a="nfflowx">Annuler</button></div>'+body+'</div>'; }
/* listes longues : n premiers éléments, puis « Afficher les autres » (ui.nf.mr_<clé>) */
function nfMorePass(b,root){ const U=nfUi(b); root.querySelectorAll('.nf-mr').forEach(box=>{ const k=box.dataset.k, n=+box.dataset.n||3, open=!!U['mr_'+k];
  let G=[]; if(box.classList.contains('grp')){ [...box.children].forEach(c=>{ if(c.classList.contains('sh2-rg')||!G.length) G.push([c]); else G[G.length-1].push(c); }); } else G=[...box.children].map(c=>[c]);
  if(G.length<=n+1) return; const rest=G.length-n; if(!open) G.slice(n).forEach(g=>g.forEach(c=>c.classList.add('nf-hide')));
  const bt=document.createElement('button'); bt.className='nf-more'; bt.dataset.a='nfui'; bt.dataset.i=b.id; bt.dataset.v='mr_'+k; bt.setAttribute('aria-expanded',open?'true':'false');
  bt.textContent= open? 'Réduire la liste' : 'Afficher '+(rest>1?'les '+rest+' autres':'l’autre'); box.appendChild(bt); }); }
{ const _r=render; render=function(){ const out=_r.apply(this,arguments); try{ nfApply(); }catch(e){ console.error(e); } return out; }; }

const NF_FONTS=['caveat:Caveat:700'];
const nfFontCss=()=>NF_FONTS.map(f=>{ const [k,n,w]=f.split(':'); return "@font-face{font-family:'"+n+"';font-style:normal;font-weight:"+w+";font-display:swap;src:url(fonts/nf-"+k+".woff) format('woff')}"; }).join('');
const NF_BASE_CSS = `
.md.nf{--shadow:0 4px 0 var(--nf-sh)}
.nf-tabs{position:sticky;top:-1px;z-index:6;display:flex;gap:4px;margin:14px 0 0;padding:4px;border-radius:18px;background:var(--nf-card);box-shadow:0 3px 0 var(--nf-sh)}
.nf-tabs button{flex:1;min-width:0;min-height:44px;border:0;border-radius:14px;background:none;font:800 13px var(--fb);color:var(--ink-3);padding:0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nf-tabs button.on{background:var(--nf-acc);color:#fff;box-shadow:0 2px 0 var(--nf-acc2)}
.md.nf .md-b>.card,.md.nf .md-b>section.card{border-radius:20px;box-shadow:0 4px 0 var(--nf-sh);padding:14px 14px 16px;margin-top:12px}
.md.nf .md-b>.card>h2,.md.nf .md-b>section.card>h2{font:var(--nf-hf);color:var(--nf-h);letter-spacing:0}
.md.nf .md-b>.notice{border-radius:16px;margin-top:12px}
.md.nf .md-b>.qacts{margin-top:12px}
.md.nf .md-b>.qacts .btn{border-radius:16px;box-shadow:0 3px 0 var(--nf-sh);min-height:60px}
.md.nf .btn.pri,.md.nf .seg button.on{color:#fff}
.md.nf:not(.nf-t-met) .md-b>.bigup{margin-top:10px}
.md.nf{--paper:var(--nf-bg);--paper-2:var(--nf-bg2);--card:var(--nf-card);--line:var(--nf-bg2);--btn-line:var(--nf-bg2);--lime:#FFC93C;--lime-ink:#3A2A00;--blue:var(--nf-acc);--blue-ink:#FFFFFF;--blue-soft:color-mix(in srgb,var(--nf-acc) 13%,var(--nf-card));--red-soft:#FFE4E0;--green-soft:#DFF5EA;--amber-soft:#FFF1C7;--sh:var(--nf-sh);--pri-sh:var(--nf-acc2);--good-bg:#2BB673;--good-sh:#1E8A55;--bad-bg:#FF6B5B;--bad-sh:#D9483A;--shadow:0 4px 0 var(--sh);--fd:'Baloo 2','Nunito',system-ui,sans-serif;--fb:'Nunito',system-ui,sans-serif;--ink:#1B2550;--ink-2:#3E4A7A;--ink-3:#56638F;--red:#C8352A;--green:#16804D;--amber:#875C00;color:var(--ink);--nf-bg:#F4F6FB;--nf-bg2:#DCE3F0;--nf-acc:#1F3C88;--nf-acc2:#142A63;--nf-h:#1B2550;--nf-hf:800 18px var(--fd);--nf-card:#fff;--nf-sh:var(--nf-bg2);--nf-acc-t:var(--nf-acc);background:var(--nf-bg)}
.md.nf .md-b{background:var(--nf-bg)}
.md.nf .nf-hide{display:none!important}
.nf-hero{position:relative;border-radius:22px;overflow:hidden;box-shadow:0 4px 0 var(--nf-bg2)}
.nf-hero .cban,.nf-hero .cban.act{display:block;position:relative;height:auto;margin:0;border-radius:0}
.nf-hero .cban svg{display:block;width:100%;height:auto}
.nf-ov{position:absolute;left:0;right:0;bottom:0;padding:40px 16px 12px;background:linear-gradient(transparent,rgba(12,14,24,.86))}
.nf-nm{display:flex;align-items:center;gap:2px}
.nf-hero h1{margin:0;font:var(--nf-h1,800 26px/1.05 var(--fd));color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nf-subt{color:#E3E6EF;font-size:13px;margin-top:3px}
.nf-edit{width:44px;height:44px;margin:-8px 0;border:0;background:none;color:#fff;font-size:17px;opacity:.85;flex:0 0 auto}
.nf-chips{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.nf-chip{display:inline-flex;align-items:center;gap:6px;font:700 12px var(--fb);padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.93);color:var(--ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nf-chip i{width:8px;height:8px;border-radius:50%;background:#2BB673;flex:0 0 auto}
.nf-lvl{font:800 14px var(--fd);background:#FFC93C;color:#3A2A00;padding:3px 12px;border-radius:12px;box-shadow:0 3px 0 #D9A400;flex:0 0 auto}
.nf-res{display:flex;justify-content:space-between;align-items:center;margin:10px 0 0;padding:0 4px}
.nf-res b{font:800 22px var(--fd)}.nf-res small{display:block;font:700 12px var(--fb);color:var(--ink-3)}
.md.nf .bigup{margin-top:10px}
.md.nf .fam-todo{background:#FFF1C7;border:0;border-radius:16px;margin-top:12px}
.md.nf .fam-todo>b{color:#875C00}
.nf-main{padding-bottom:6px}
.nf-sec{font:var(--nf-hf);color:var(--nf-h);margin:22px 4px 8px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.nf-sec{white-space:nowrap}
.nf-sec small{white-space:normal;min-width:0;flex:0 1 auto;font:700 12px var(--fb);color:var(--ink-3);letter-spacing:0;text-transform:none;text-align:right}
.nf-card{background:var(--nf-card);border-radius:20px;padding:12px;box-shadow:0 4px 0 var(--nf-sh)}
.nf-card+.nf-card{margin-top:10px}
.md.nf .nf-b{border:0;border-radius:14px;min-height:44px;padding:0 14px;font:800 13.5px var(--fb);background:#fff;color:var(--ink);box-shadow:0 3px 0 var(--nf-sh),inset 0 0 0 1.5px var(--nf-sh);white-space:nowrap;flex:0 0 auto}
.md.nf .nf-b.a{background:var(--nf-acc);color:#fff;box-shadow:0 3px 0 var(--nf-acc2)}
.md.nf .nf-b[disabled],.md.nf .nf-b[aria-disabled="true"]{opacity:.5}
.md.nf .nf-b.w{width:100%}
.nf-seg{display:flex;background:var(--nf-bg);border-radius:14px;padding:4px;gap:4px;margin-top:6px}
.nf-seg button{flex:1;border:0;background:none;border-radius:11px;min-height:42px;font:800 12.5px var(--fb);color:var(--ink-3);padding:0 6px}
.nf-seg button.on{background:var(--nf-acc);color:#fff}
.nf-tog{position:relative;width:52px;height:30px;border-radius:15px;background:#d5dae2;border:0;flex:0 0 auto;padding:0;margin:7px 0}
.nf-tog::after{content:'';position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.nf-tog.on{background:#2BB673}.nf-tog.on::after{left:25px}
.nf-row{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:12.5px;color:var(--ink-3)}
.nf-row>span{min-width:0;flex:1}
.nf-row b{display:block;color:var(--ink);font-size:14px}
.nf-row small{display:block;font-size:12px;color:var(--ink-3);margin-top:1px}
.nf-list>.nf-row,.nf-list>.nf-ctl{padding:8px 0;border-top:1px solid var(--nf-bg2)}
.nf-list>:first-child{border-top:0;padding-top:0}
.nf-ok{font:800 11px var(--fb);background:#DFF5EA;color:#16804D;border-radius:8px;padding:3px 8px;white-space:nowrap}
.nf-dots{letter-spacing:-1px;color:currentColor}.nf-dots i{font-style:normal;opacity:.3}
.nf-path{padding:12px 8px}
.nf-steps{display:flex;align-items:flex-start}
.nf-steps .p{flex:0 0 60px;text-align:center;font:800 10px/1.2 var(--fb);color:var(--ink-3);border:0;background:none;padding:0;min-height:44px}
.nf-steps .p i{display:grid;place-items:center;width:38px;height:38px;margin:0 auto 4px;border-radius:12px;background:var(--nf-bg);font:800 14px var(--fd);font-style:normal;color:var(--ink-3)}
.nf-steps .p.done i{background:var(--nf-acc);color:#fff;opacity:.6}
.nf-steps .p.now i{background:var(--nf-acc);color:#fff;box-shadow:0 0 0 3px var(--nf-bg2)}
.nf-steps .ln{flex:1;height:3px;margin-top:18px;background:var(--nf-acc);opacity:.18;border-radius:2px}
.nf-steps .ln.on{opacity:.6}
.nf-pathd .met-c{margin-top:10px}
.nf-mgmt{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.nf-mg{border:0;text-align:left;background:#fff;border-radius:16px;padding:10px 12px;min-height:60px;box-shadow:0 3px 0 var(--nf-sh);font:800 13.5px var(--fb);color:var(--ink)}
.nf-mg small{display:block;font:600 12px var(--fb);color:var(--ink-3);margin-top:1px}
.nf-dlg{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:8px;background:#fff;border-radius:16px;padding:10px 12px;box-shadow:0 3px 0 var(--nf-sh);font-size:13px;color:var(--ink-3)}
.nf-dlg b{color:var(--ink);font-size:13.5px;display:block}
.nf-lnk{border:0;background:#fff;color:var(--nf-acc);font:800 13px var(--fb);border-radius:12px;min-height:44px;padding:0 14px;box-shadow:0 3px 0 var(--nf-sh),inset 0 0 0 1.5px var(--nf-sh);flex:0 0 auto}
.nf-dlp{margin-top:8px}
.nf-log>div{font-size:12.5px;color:var(--ink-2,#3E4A7A);padding:5px 0;border-top:1px solid var(--nf-bg2)}
.nf-log>div:first-child{border-top:0;padding-top:0}
.nf-log span{font:800 11px var(--fb);color:var(--ink-3);margin-right:6px}
.nf-log .neg{color:var(--red)}.nf-log .pos{color:var(--green)}
.nf-sup{margin-top:10px}
.nf-leg .pk-head:first-child{margin-top:0}
.nf-leg>.pk-head{margin-top:14px}
.nf-more{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:44px;margin-top:8px;border:0;border-radius:14px;background:rgba(0,0,0,.05);color:var(--nf-acc);font:800 13px var(--fb)}
.nf-more::after{content:'';width:8px;height:8px;border-right:2.5px solid currentColor;border-bottom:2.5px solid currentColor;transform:rotate(45deg) translateY(-2px)}
.nf-more[aria-expanded="true"]::after{transform:rotate(-135deg) translateY(-2px)}
.nf-mr{display:contents}
.nf-mr>.nf-more{grid-column:1 / -1}
.nf-list>.nf-mr>.nf-row,.nf-list>.nf-mr>.nf-ctl{padding:8px 0;border-top:1px solid var(--nf-bg2)}
.nf-list>.nf-mr:first-child>:first-child{border-top:0;padding-top:0}
.nf-flow{margin-top:12px;box-shadow:0 0 0 2px var(--nf-acc),0 4px 0 var(--nf-sh)}
.nf-flow>.hd{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}
.nf-flow>.hd b{font:var(--nf-hf);color:var(--nf-h)}
.nf-flow .pk-list{margin-top:6px}
.nf-pick{display:grid;gap:6px;margin-top:8px}
.nf-pick button{text-align:left;border:0;border-radius:12px;padding:8px 10px;min-height:48px;background:rgba(255,255,255,.08);color:inherit;font:700 13px var(--fb)}
.nf-pick button small{display:block;font:600 11.5px var(--fb);opacity:.75}
`;

