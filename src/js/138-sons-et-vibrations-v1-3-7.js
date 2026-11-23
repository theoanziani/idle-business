/* ============================================================
   SONS ET VIBRATIONS (V1.3.7)
   Vibrations courtes et rares : jamais sur chaque toucher, seulement sur les moments qui comptent.
   Dans l'application Android : retour haptique du système (respecte les réglages du téléphone) ;
   dans le navigateur : navigator.vibrate de quelques millisecondes.
   Sons de synthèse (Web Audio), discrets, aucun fichier. Réglages : localStorage « idlebiz.fx ».
   ============================================================ */
const FX={snd:true, hap:true, vol:.5, ctx:null, last:{}};
try{ const v=JSON.parse(localStorage.getItem('idlebiz.fx')||'null'); if(v){ FX.snd=v.snd!==false; FX.hap=v.hap!==false; if(v.vol!==undefined) FX.vol=v.vol; } }catch(e){}
function fxSave(){ try{ localStorage.setItem('idlebiz.fx',JSON.stringify({snd:FX.snd,hap:FX.hap,vol:FX.vol})); }catch(e){} }
/* anti-répétition : un même effet au plus toutes les « ms » millisecondes */
function fxGate(k,ms){ const t=Date.now(); if(FX.last[k]&&t-FX.last[k]<ms) return false; FX.last[k]=t; return true; }
/* retour haptique façon iOS : sel (sélection), light, medium, heavy (impacts), success, warning, error (notifications) */
const HAP_ALIAS={tick:'sel', confirm:'success', reject:'error'};
const HAP_WEB={sel:6, light:10, medium:18, heavy:30, success:[12,70,20], warning:[20,60,20], error:[20,45,20,45,32]};
function haptic(kind){ kind=HAP_ALIAS[kind]||kind; if(!FX.hap||document.hidden||!HAP_WEB[kind]||!fxGate('h'+kind,kind==='sel'?45:kind==='light'?70:220)) return;
  try{ if(window.IBNative&&IBNative.haptic){ IBNative.haptic(kind); return; } }catch(e){}
  try{ if(navigator.vibrate){ navigator.vibrate(HAP_WEB[kind]); return; } }catch(e){}
  hapIOS(kind); }
/* V1.6.9 : Safari sur iPhone n'a pas navigator.vibrate ; basculer un interrupteur natif
   (<input type="checkbox" switch>, iOS 18 et plus) déclenche le retour haptique du système.
   Il ne fonctionne que pendant un toucher : les vibrations différées (doubles) n'en gardent qu'une. */
let HAP_SW=null;
function hapIOS(kind){ try{ if(!/iP(hone|ad|od)/.test(navigator.userAgent)&&!(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)) return;
  if(!HAP_SW){ const l=document.createElement('label'), i=document.createElement('input'); i.type='checkbox'; i.setAttribute('switch',''); i.tabIndex=-1; l.setAttribute('aria-hidden','true');
    l.style.cssText='position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none'; l.appendChild(i); document.body.appendChild(l); HAP_SW=l; }
  HAP_SW.click(); if(kind==='heavy'||kind==='error'||kind==='success'||kind==='warning') setTimeout(()=>{ try{ HAP_SW.click(); }catch(e){} },70); }catch(e){} }
function fxCtx(){ if(FX.ctx) return FX.ctx; try{ const A=window.AudioContext||window.webkitAudioContext; if(A) FX.ctx=new A(); }catch(e){} return FX.ctx; }
/* une note : fréquence, durée, forme, volume relatif, départ décalé */
function fxTone(c,f,d,type,g,at,f2){ const t=c.currentTime+(at||0), o=c.createOscillator(), v=c.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f,t); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+d);
  v.gain.setValueAtTime(0,t); v.gain.linearRampToValueAtTime(g*FX.vol,t+.01); v.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(v); v.connect(c.destination); o.start(t); o.stop(t+d+.02); }
function fxNoise(c,d,g,at,lp){ const t=c.currentTime+(at||0), n=Math.floor(c.sampleRate*d), B=c.createBuffer(1,n,c.sampleRate), x=B.getChannelData(0); for(let i=0;i<n;i++) x[i]=(Math.random()*2-1)*(1-i/n);
  const s=c.createBufferSource(), f=c.createBiquadFilter(), v=c.createGain(); s.buffer=B; f.type='lowpass'; f.frequency.value=lp||1200; v.gain.setValueAtTime(g*FX.vol,t); v.gain.exponentialRampToValueAtTime(.0001,t+d); s.connect(f); f.connect(v); v.connect(c.destination); s.start(t); }
const FX_SND={
  click:c=>fxTone(c,520,.05,'triangle',.08),
  coin:c=>{ fxTone(c,988,.08,'square',.05); fxTone(c,1319,.18,'square',.05,.07); },
  ok:c=>{ fxTone(c,660,.09,'sine',.12); fxTone(c,880,.14,'sine',.1,.07); },
  err:c=>{ fxTone(c,220,.16,'triangle',.12,0,170); },
  fanfare:c=>{ [523,659,784,1047].forEach((f,i)=>fxTone(c,f,.22+i*.05,'triangle',.13,i*.11)); fxTone(c,1568,.5,'sine',.06,.44); },
  whistle:c=>{ fxTone(c,2900,.35,'sine',.07,0,2750); fxTone(c,3100,.35,'sine',.03); },
  goal:c=>{ fxNoise(c,1.4,.22,0,900); fxNoise(c,1.1,.12,.15,2200); fxTone(c,392,.4,'sawtooth',.04,.05); fxTone(c,523,.55,'sawtooth',.04,.3); },
  warn:c=>{ fxTone(c,440,.12,'square',.05); fxTone(c,349,.2,'square',.05,.14); }
};
function sfx(k){ if(!FX.snd||document.hidden||!FX_SND[k]||!fxGate('s'+k,k==='click'?90:250)) return; const c=fxCtx(); if(!c) return; try{ if(c.state==='suspended') c.resume(); FX_SND[k](c); }catch(e){} }
/* le son ne peut démarrer qu'après un premier toucher */
document.addEventListener('pointerdown',()=>{ const c=fxCtx(); if(c&&c.state==='suspended') try{ c.resume(); }catch(e){} },{capture:true,passive:true});

/* ---------- Où on les entend ---------- */
/* résultat d'une action du joueur */
{ const _af=after; after=function(r,okMsg){ try{ if(r&&r.ok===false&&r.msg){ sfx('err'); haptic('reject'); }
    else if(r&&r.ok&&r.msg){ /* achats et décisions importantes : petit son de pièce */ if(/achet|acquis|rachet|vendu|encaiss|signe|recrut|ouvert|lanc|obtenu|c’est fait/i.test(r.msg)){ sfx('coin'); haptic('confirm'); } else sfx('click'); } }catch(e){}
  return _af.apply(this,arguments); }; }
/* jour suivant : un léger tic */
{ const _dn=doNext; doNext=function(n,quiet){ if(!quiet){ sfx('click'); haptic('medium'); } const o=_dn.apply(this,arguments); try{ if(S&&S.stop&&!quiet){ sfx('warn'); haptic('warning'); } }catch(e){} return o; }; }
/* célébrations : paliers, nouveau palier de richesse, victoire */
try{ new MutationObserver(ms=>{ for(const m of ms) for(const n of m.addedNodes){ if(n.classList&&n.classList.contains('pal-cele')){ sfx('fanfare'); haptic('success'); setTimeout(()=>haptic('heavy'),260); return; } } }).observe(document.body,{childList:true}); }catch(e){}
{ const _rf=render; let lastM=null; render=function(){ const o=_rf.apply(this,arguments); try{ const t=ui.modal&&ui.modal.type; if(t!==lastM){ lastM=t; if(t==='tier'||t==='win'||t==='d100'){ sfx('fanfare'); haptic('success'); setTimeout(()=>haptic('heavy'),260); } } }catch(e){} return o; }; }
/* football : coups de sifflet et buts pendant le direct */
{ const _fe=fmEvent; fmEvent=function(L,e){ const o=_fe.apply(this,arguments); try{
    if(e.k==='goal'){ sfx('goal'); const O=fcOwn(), mine=O&&((O.id===L.h&&e.s===0)||(O.id===L.a&&e.s===1)); if(mine){ haptic('heavy'); setTimeout(()=>haptic('success'),300); } else haptic('light'); }
    else if(e.k==='ht'||e.k==='ft'){ sfx('whistle'); haptic(e.k==='ft'?'medium':'light'); } }catch(x){} return o; }; }

/* ---------- Réglages ---------- */
{ const _vs=vSet; vSet=function(){ const h=_vs.apply(this,arguments);
  const c=card('Sons et vibrations','<label class="fc-tg"><span>Sons</span><input type="checkbox" data-a="fxsnd" '+(FX.snd?'checked':'')+' aria-label="Sons"></label>'+
    '<div class="row sp"><span class="sub">Volume</span><div class="seg">'+[[.25,'Faible'],[.5,'Moyen'],[.9,'Fort']].map(([v,t])=>'<button class="'+(Math.abs(FX.vol-v)<.01?'on':'')+'" data-a="fxvol" data-v="'+v+'">'+t+'</button>').join('')+'</div></div>'+
    '<label class="fc-tg"><span>Vibrations</span><input type="checkbox" data-a="fxhap" '+(FX.hap?'checked':'')+' aria-label="Vibrations"></label>'+
    '<div class="sub">Retour haptique façon iPhone : un léger tic à chaque toucher, plus marqué pour le jour suivant, les achats, les erreurs, les paliers et les buts. Il suit aussi les réglages de votre téléphone.</div>');
  const i=h.lastIndexOf('</div>'); return h+c; }; VIEWS.set=vSet; }
ACT.fxsnd=()=>{ FX.snd=!FX.snd; fxSave(); render(); if(FX.snd) sfx('ok'); };
ACT.fxhap=()=>{ FX.hap=!FX.hap; fxSave(); render(); if(FX.hap) haptic('confirm'); };
ACT.fxvol=el=>{ FX.vol=+el.dataset.v; fxSave(); render(); sfx('ok'); };

/* ---------- V1.3.8 : touchers ---------- */
document.addEventListener('click',e=>{ try{ const t=e.target.closest('button,[data-a],summary,label.fc-tg,select'); if(!t||t.disabled) return;
  const a=t.dataset&&t.dataset.a;
  if(a==='tab'||t.closest('nav,.nav,.tabbar,.ft-tabs,.fm-tabs')) haptic('light');
  else if(t.matches('summary')||t.matches('label.fc-tg')||t.closest('.seg')) haptic('sel');
  else if(a&&a!=='closemodal') haptic('sel'); }catch(x){} },{capture:true,passive:true});
document.addEventListener('change',e=>{ if(e.target&&e.target.matches&&e.target.matches('select,input[type=checkbox]')) haptic('sel'); },{capture:true,passive:true});

