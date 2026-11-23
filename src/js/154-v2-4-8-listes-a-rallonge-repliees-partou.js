/* ============================================================
   V2.4.8 : LISTES À RALLONGE REPLIÉES PARTOUT
   Après chaque affichage, toute liste verticale d'au moins MR_MIN éléments semblables (lignes,
   sociétés, contrats, usines, terminaux…) n'en montre que MR_SHOW, puis « Afficher les N autres ».
   Fonctionne dans les écrans du jeu et dans toutes les fiches. État d'interface seulement : ui.mr.
   ============================================================ */
const MR_SHOW=5, MR_MIN=7;
const MR_SEL='.stack,.ht-t,.nf-list,.nf-card,.tw tbody,.pk-list,.mf-b,.met-plan,.card,section,.nf-main>div,.md-b>div';
const MR_NO=/(^|\s)(seg|nf-tabs|nf-steps|nf-seg|nf-mgmt|mini|bstats|qacts|grid|tiles|nf-globe|nav|al2-board|al2-fleet|sh2-fl|row)(\s|$)/;
function mrKey(box){ const c=box.closest('.card,section,.nf-card,.md'), h=c&&c.querySelector('h2,h3,.nf-sec'); let n=0, p=box; while((p=p.previousElementSibling)) n++;
  const root=ui.modal? (ui.modal.type+(ui.modal.id||'')+':'+(ui.ft||'')) : ui.tab; return root+'|'+((h&&h.textContent)||'').slice(0,30)+'|'+(box.className||box.tagName)+'|'+n; }
function mrPass(){ ui.mr=ui.mr||{}; const roots=[document.getElementById('view'),document.querySelector('.md .md-b')].filter(Boolean);
  roots.forEach(R=>R.querySelectorAll(MR_SEL).forEach(box=>{ if(box.dataset.mrd||box.closest('.nf-mr')||MR_NO.test(box.className)) return;
    const K=[...box.children].filter(c=>!c.classList.contains('nf-more')&&!c.classList.contains('mr-more')&&!c.classList.contains('nf-hide')&&!c.classList.contains('ft-hide')&&c.tagName!=='H2'&&c.tagName!=='H3'&&!c.classList.contains('sub'));
    if(K.length<5) return; const tg=K[0].tagName, cl=K[0].className; if(/^(BUTTON|INPUT|SELECT|H2|H3|SPAN|I|B|SMALL|svg)$/i.test(tg)) return;
    let same=0; K.forEach(k=>{ if(k.tagName===tg&&k.className===cl) same++; }); if(same<K.length*.85) return;
    if(K[1].offsetTop<=K[0].offsetTop+4) return; if(K[0].offsetHeight<30) return;
    if(K.slice(0,6).reduce((a,k)=>a+(k.textContent||'').trim().length,0)/6<12) return;
    const L=K.filter(k=>k.tagName===tg&&k.className===cl), tall=K[0].offsetHeight>110, show=tall? 3 : MR_SHOW; if(L.length<(tall? 5 : MR_MIN)) return;
    box.dataset.mrd='1'; const key=mrKey(box), open=!!ui.mr[key], rest=L.length-show;
    if(!open) L.slice(show).forEach(k=>k.classList.add('mr-h'));
    const bt=document.createElement(box.tagName==='TBODY'? 'tr' : 'button'); let b2=bt;
    if(box.tagName==='TBODY'){ const td=document.createElement('td'); td.colSpan=20; b2=document.createElement('button'); td.appendChild(b2); bt.appendChild(td); }
    b2.className='mr-more'; b2.dataset.a='mrtog'; b2.dataset.k=key; b2.setAttribute('aria-expanded',open?'true':'false'); b2.textContent= open? 'Réduire la liste' : 'Afficher '+(rest>1? 'les '+rest+' autres' : 'l’autre');
    const lastL=L[L.length-1]; lastL.after(bt); })); }
ACT.mrtog=el=>{ ui.mr=ui.mr||{}; const k=el.dataset.k; ui.mr[k]=!ui.mr[k]; const y=el.getBoundingClientRect().top; render();
  if(!ui.mr[k]){ const n=[...document.querySelectorAll('.mr-more')].find(x=>x.dataset.k===k); if(n){ const d=n.getBoundingClientRect().top-y; if(Math.abs(d)>40){ const sc=n.closest('.md-b')||document.scrollingElement; sc.scrollTop+=d; } } } };
{ const _r=render; render=function(){ const out=_r.apply(this,arguments); try{ mrPass(); }catch(e){ console.error(e); } return out; }; }

