
/* ============================================================
   V2.7.9 : BLASONS DE FOOTBALL DÉTAILLÉS ET HOLOGRAPHIQUES
   Chaque blason reste dessiné par le jeu à partir du nom et des couleurs du club (aucune reprise de vrai logo) :
   8 formes, 7 motifs, un emblème (coq, lion, aigle, tour, ancre, navire, étoile, couronne, ballon), un ruban avec
   les initiales, l'année de fondation, un bord en métal biseauté, du relief, et un reflet holographique animé.
   ============================================================ */
const FC_SHAPES=[
  'M50 4 L90 16 V50 C90 76 70 94 50 104 C30 94 10 76 10 50 V16 Z',
  'M12 6 H88 V56 C88 82 68 98 50 104 C32 98 12 82 12 56 Z',
  'M50 2 L93 26 L84 80 L50 106 L16 80 L7 26 Z',
  'M50 4 A50 50 0 1 1 49.9 4 Z',
  'M16 4 H84 L92 18 V60 C92 84 70 100 50 106 C30 100 8 84 8 60 V18 Z',
  'M50 2 L96 54 L50 106 L4 54 Z',
  'M10 8 Q50 -2 90 8 V58 Q90 92 50 106 Q10 92 10 58 Z',
  'M10 4 H90 V70 Q70 70 50 106 Q30 70 10 70 Z'];
const FC_EMB={
  coq:'<path d="M34 58 C22 50 18 36 24 24 C26 38 30 46 38 52 Z"/><path d="M34 62 C18 60 11 48 13 36 C19 48 26 54 36 58 Z" opacity=".9"/><path d="M35 66 C22 70 13 64 11 55 C19 62 28 64 36 63 Z" opacity=".8"/>'+
    '<path d="M32 72 C27 60 33 49 44 47 C46 40 50 33 56 31 C61 29 65 31 65 36 L72 38 L65 41 C65 46 61 50 59 54 C67 57 71 65 66 73 C58 78 40 78 32 72 Z"/>'+
    '<path d="M55 31 C54 25 58 24 59 28 C60 23 64 24 63 29 C65 26 69 28 66 32 Z" class="fc-red"/><path d="M64 41 C65 46 61 47 60 43 Z" class="fc-red"/><circle cx="60" cy="35" r="1.7" class="fc-eye"/>'+
    '<path d="M41 57 C47 55 53 57 57 63 M43 62 C48 61 52 63 55 67" class="fc-line"/><path d="M46 76 V86 M55 76 V86 M41 86 H49 M51 86 H59" class="fc-leg"/>',
  lion:[...Array(14)].map((_,i)=>'<ellipse cx="50" cy="27" rx="7.5" ry="13" transform="rotate('+(i*360/14)+' 50 50)"/>').join('')+'<circle cx="50" cy="50" r="19"/>'+
    '<circle cx="38" cy="36" r="5" class="fc-face"/><circle cx="62" cy="36" r="5" class="fc-face"/><path d="M36 46 C36 34 64 34 64 46 C64 60 57 68 50 68 C43 68 36 60 36 46 Z" class="fc-face"/>'+
    '<path d="M41 45 L47 47 M59 45 L53 47" class="fc-line2"/><circle cx="45" cy="48" r="1.9"/><circle cx="55" cy="48" r="1.9"/><path d="M45 55 H55 L50 60 Z"/><path d="M50 60 V63 M50 63 C47 66 44 65 43 63 M50 63 C53 66 56 65 57 63" class="fc-line2"/>',
  aigle:'<path d="M50 34 C46 34 44 38 46 42 C40 42 26 34 12 36 C22 42 30 46 36 50 C28 50 20 54 16 60 C28 58 38 56 44 58 L42 76 L50 70 L58 76 L56 58 C62 56 72 58 84 60 C80 54 72 50 64 50 C70 46 78 42 88 36 C74 34 60 42 54 42 C56 38 54 34 50 34Z"/><circle cx="51" cy="38" r="1.4" class="fc-eye"/><path d="M53 39 L57 40 L53 42" class="fc-acc"/>',
  tour:'<path d="M34 80 V40 H30 V30 H36 V34 H42 V30 H48 V34 H52 V30 H58 V34 H64 V30 H70 V40 H66 V80 Z"/><path d="M44 80 V66 A6 6 0 0 1 56 66 V80 Z" class="fc-face"/><rect x="40" y="46" width="5" height="8" rx="2.5" class="fc-face"/><rect x="55" y="46" width="5" height="8" rx="2.5" class="fc-face"/><path d="M34 60 H66 M34 70 H44 M56 70 H66" class="fc-line"/>',
  ancre:'<circle cx="50" cy="28" r="6" fill="none" stroke-width="4"/><path d="M50 34 V80" stroke-width="5" fill="none"/><path d="M38 44 H62" stroke-width="4.5" fill="none"/><path d="M26 64 C28 76 40 82 50 82 C60 82 72 76 74 64" stroke-width="5" fill="none"/><path d="M22 60 L28 66 L32 58Z M78 60 L72 66 L68 58Z"/>',
  navire:'<path d="M24 66 H76 L68 78 H32 Z"/><path d="M50 26 V66" stroke-width="2.5" fill="none"/><path d="M50 28 C62 36 64 52 50 62 Z"/><path d="M48 32 C38 40 36 52 48 60 Z" opacity=".8"/><path d="M50 24 L60 27 L50 30Z" class="fc-acc"/><path d="M20 84 Q30 80 40 84 T60 84 T80 84" class="fc-line"/>',
  etoile:'<path d="M50 22 L58 42 L80 43 L63 57 L69 79 L50 66 L31 79 L37 57 L20 43 L42 42 Z"/><path d="M50 22 L50 52 L80 43 M50 52 L69 79 M50 52 L31 79 M50 52 L20 43" class="fc-line" opacity=".45"/>',
  couronne:'<path d="M24 62 L20 34 L34 46 L42 28 L50 42 L58 28 L66 46 L80 34 L76 62 Z"/><rect x="24" y="62" width="52" height="10" rx="3"/>'+[[20,32],[42,26],[58,26],[80,32],[50,40]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3.4" class="fc-gem"/>').join('')+'<circle cx="36" cy="67" r="2.2" class="fc-acc"/><circle cx="50" cy="67" r="2.2" class="fc-acc"/><circle cx="64" cy="67" r="2.2" class="fc-acc"/>',
  arc:'<rect x="24" y="27" width="52" height="5" rx="1"/><path d="M27 34 H73 V41 H27Z"/><path d="M28 43 H72 V80 H59 V62 A9 9 0 0 0 41 62 V80 H28Z"/><path d="M28 52 H41 M59 52 H72" class="fc-line"/><path d="M33 58 V76 M67 58 V76" class="fc-line"/>',
  bonnemere:'<path d="M14 84 Q50 62 86 84Z"/><path d="M30 70 V56 H70 V70Z"/><path d="M30 56 L50 48 L70 56Z"/><path d="M45 56 V30 H55 V56Z"/><path d="M44 30 H56 L50 24Z"/><path d="M48.6 24 L50 12 L51.4 24Z" class="fc-acc"/><circle cx="50" cy="11" r="2.2" class="fc-acc"/><path d="M47 38 H53 M47 46 H53" class="fc-line2"/><path d="M36 70 V62 M42 70 V62 M58 70 V62 M64 70 V62" class="fc-line2"/>',
  voilier:'<path d="M22 66 H78 L70 77 H30Z"/><path d="M52 18 V64 H76Z"/><path d="M48 26 V64 H30Z" opacity=".85"/><path d="M50 16 V66" stroke-width="2" fill="none"/><path d="M50 14 L58 17 L50 20Z" class="fc-acc"/><path d="M18 84 Q28 80 38 84 T58 84 T82 84" class="fc-line"/>',
  beffroi:'<path d="M37 80 V46 H63 V80Z"/><path d="M42 46 V35 H58 V46Z"/><path d="M41 35 L50 14 L59 35Z"/><path d="M34 46 L37 39 L40 46Z M60 46 L63 39 L66 46Z"/><circle cx="50" cy="56" r="5.5" class="fc-face"/><path d="M50 56 V52.5 M50 56 L52.5 57.5" class="fc-line2"/><path d="M45 80 V71 A5 5 0 0 1 55 71 V80Z" class="fc-face"/><rect x="46" y="38" width="8" height="6" rx="3" class="fc-face"/>',
  lampe:'<circle cx="50" cy="20" r="4.5" fill="none" stroke-width="2.6"/><path d="M39 30 H61 L58 37 H42Z"/><path d="M40 37 H60 V60 H40Z" class="fc-acc"/><path d="M40 37 H60 V60 H40Z M46 37 V60 M54 37 V60" fill="none" stroke-width="2.4"/><path d="M50 56 C45 52 47 46 50 42 C53 46 55 52 50 56Z" class="fc-red"/><path d="M37 60 H63 L60 76 H40Z"/><path d="M42 66 H58" class="fc-line2"/>',
  palmier:'<path d="M47 82 C49 66 50 54 51 40 H55 C54 54 54 68 55 82Z"/><path d="M53 40 C46 30 34 30 24 38 C34 35 44 36 53 42Z"/><path d="M53 40 C60 30 72 30 80 38 C70 35 62 36 53 42Z"/><path d="M53 40 C48 30 42 22 32 20 C40 26 46 32 52 41Z"/><path d="M53 40 C58 30 64 22 74 20 C66 26 60 32 54 41Z"/><path d="M53 40 C52 30 53 22 56 16 C58 24 57 32 54 41Z"/><circle cx="51" cy="43" r="2.4" class="fc-acc"/><circle cx="56" cy="44" r="2.2" class="fc-acc"/><path d="M20 84 Q32 80 44 84 T68 84 T84 84" class="fc-line"/>',
  violette:[...Array(5)].map((_,i)=>'<ellipse cx="50" cy="31" rx="8.5" ry="12" transform="rotate('+(i*72)+' 50 44)"/>').join('')+'<circle cx="50" cy="44" r="5" class="fc-acc"/><path d="M50 57 C50 66 48 74 45 84" stroke-width="3" fill="none"/><path d="M48 72 C40 64 30 66 26 73 C34 76 42 76 48 72Z"/><path d="M48 72 C35 70 32 72 26 73" class="fc-line2"/>',
  fleche:'<path d="M36 80 V48 H64 V80Z"/><path d="M42 48 V34 H58 V48Z"/><path d="M43 34 L50 10 L57 34Z"/><path d="M46 28 H54 M47.5 22 H52.5" class="fc-line2"/><circle cx="50" cy="58" r="6" class="fc-face"/><path d="M50 52 V64 M44 58 H56" class="fc-line2"/><path d="M46 80 V72 L50 67 L54 72 V80Z" class="fc-face"/><path d="M36 48 L32 52 V80 H36 M64 48 L68 52 V80 H64"/>',
  pont:'<path d="M16 46 H84 V53 H16Z"/><path d="M19 53 H81 V78 H74 C74 64 62 64 62 78 H58 C58 62 42 62 42 78 H38 C38 64 26 64 26 78 H19Z"/><path d="M22 46 V40 M36 46 V40 M50 46 V40 M64 46 V40 M78 46 V40 M20 40 H80" class="fc-line"/><path d="M16 86 Q28 82 40 86 T64 86 T86 86" class="fc-line"/>',
  drapeau:'<path d="M30 18 V84" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="30" cy="17" r="2.6" class="fc-acc"/><path d="M32 22 C44 18 54 26 66 22 C70 21 73 20 76 20 V48 C66 50 56 44 44 48 C40 49 36 50 32 50Z"/>'+[...Array(4)].map((_,i)=>[...Array(3)].map((__,j)=>(i+j)%2?'':'<rect x="'+(32+i*11)+'" y="'+(23+j*9)+'" width="11" height="9" class="fc-face" transform="skewY(-3)"/>').join('')).join(''),
  abeille:'<ellipse cx="36" cy="40" rx="13" ry="7" transform="rotate(-28 36 40)" class="fc-face" opacity=".85"/><ellipse cx="64" cy="40" rx="13" ry="7" transform="rotate(28 64 40)" class="fc-face" opacity=".85"/><ellipse cx="50" cy="58" rx="13" ry="18"/><path d="M38 52 H62 M37 60 H63 M39 68 H61" class="fc-line2" style="stroke-width:3.6"/><circle cx="50" cy="36" r="7.5"/><path d="M47 30 C44 23 40 21 37 21 M53 30 C56 23 60 21 63 21" fill="none" stroke-width="2"/><path d="M46 75 L50 83 L54 75Z"/>',
  volcan:'<path d="M14 82 L40 40 H60 L86 82Z"/><path d="M40 40 C44 46 47 42 50 48 C53 42 56 46 60 40Z" class="fc-red"/><path d="M34 62 C40 58 44 66 50 60 C56 66 60 58 66 62" class="fc-line2"/><circle cx="47" cy="30" r="5" class="fc-face" opacity=".7"/><circle cx="55" cy="22" r="6" class="fc-face" opacity=".6"/><circle cx="46" cy="14" r="4" class="fc-face" opacity=".5"/>',
  ballon:'<circle cx="50" cy="52" r="24"/><path d="M50 40 L60 47 L56 59 H44 L40 47 Z" class="fc-face"/><path d="M50 40 V30 M60 47 L71 43 M56 59 L63 69 M44 59 L37 69 M40 47 L29 43" class="fc-line"/>'};
const FC_KEYS=[[/marseille|lorient|brest|naples|napoli|genoa|g[eê]nes|porto|hamburg|le havre|bordeaux/i,'mer'],[/lyon|leon|chelsea|leicester|lens/i,'lion'],[/eagle|lazio|benfica|frankfurt|crystal/i,'aigle'],[/real|royal|rey|reims|king|monaco/i,'couronne'],[/nice|lazio|frankfurt/i,'aigle'],[/paris|turin|torino|londres|london|madrid/i,'tour'],[/toulouse|rennes|lille|losk|strasbourg|nantes/i,'coq'],[/star|estrel|roter stern|crvena/i,'etoile']];
const FC_ID={ // motif du maillot, symbole de la ville choisi par le jeu, couleurs réelles (aucun élément de vrai blason)
  'Paris Saint-Germont':[7,'arc','004170','DA291C'],'Olympico de Marseille':[0,'bonnemere','FFFFFF','2FAEE0'],'AC Monaco':[4,'voilier'],'LOSK Lille':[0,'beffroi'],
  'Olympico Lyonnais':[9,'pont','FFFFFF','1B3C8C','E30613'],'RS Lens':[0,'lampe'],'RS Strasbourg Alsace':[0,'fleche'],'OGS Nice':[3,'palmier'],'Stade Rennois':[8,'tour'],
  'Toulouse AC':[0,'violette'],'Stade Brestais 29':[0,'navire'],'Paris AC':[0,'tour'],'AC Lorient':[0,'ancre'],'Le Havre FC':[8,'voilier','5CBFEB','003865'],
  'AS Auxerre':[2,'fleche'],'Angers SCA':[3,'tour'],'Le Mans AC':[0,'drapeau'],
  'Reale Madrid':[0,'arc'],'CF Barcelona':[3,'fleche'],'Atlética Madrid':[3,'tour'],'Athletix Bilbao':[3,'pont'],'Sevilla AC':[0,'fleche'],'Valencia FC':[0,'palmier'],
  'Arsenol':[0,'beffroi'],'Chelsee':[0,'pont'],'Tottenham Hotspurs':[0,'tour'],'Liverpoul':[0,'ancre'],'Manchester Citi':[0,'abeille'],'Manchester Unitad':[0,'abeille'],'Newcastle Unitad':[3,'pont'],
  'Juventas':[3,'fleche'],'Internaziona Milano':[3,'etoile'],'AC Milano':[3,'fleche'],'SSC Napoly':[0,'volcan'],'AS Romana':[0,'arc'],
  'FC Beyern München':[0,'tour'],'Borussia Dortmond':[0,'lampe'],'Bayer 05 Leverkusen':[2,'ballon'],
  'SL Benfika':[0,'navire'],'AC Porto':[3,'pont'],'AFC Ajaks':[7,'pont','FFFFFF','D2122E'],'Celtik':[10,'navire'],'Galatasaraï':[1,'tour'],'Fenerbahça':[3,'ancre']};
const FC_ORDER=['lion','aigle','tour','ancre','navire','etoile','couronne','ballon','coq'];
const fcLight = x=>{ const v=parseInt(x.slice(1),16); return ((v>>16)*299+((v>>8)&255)*587+(v&255)*114)/1000>150; };
const fcShade = (hex,k)=>{ const n=parseInt(hex.slice(1),16), f=v=>Math.max(0,Math.min(255,Math.round(k<0? v*(1+k) : v+(255-v)*k))); return '#'+[n>>16,(n>>8)&255,n&255].map(v=>f(v).toString(16).padStart(2,'0')).join(''); };
footCrest=function(c,size){ size=size||40; const h=footHash(c.n), id='fc'+h.toString(36), shape=FC_SHAPES[h%8], fx=FC_ID[c.n], pat=fx? fx[0] : (h>>>3)%7, c1=fx&&fx[2]? '#'+fx[2] : c.c1, c2=fx&&fx[3]? '#'+fx[3] : c.c2, c3=fx&&fx[4]? '#'+fx[4] : c2;
  const kw=FC_KEYS.find(k=>k[0].test(c.n+' '+(c.city||''))), k0=kw? kw[1] : FC_ORDER[(h>>>6)%FC_ORDER.length], emb=fx? FC_EMB[fx[1]] : FC_EMB[k0==='mer'? ((h>>>5)%2?'ancre':'navire') : k0];
  const both=fcLight(c1)&&fcLight(c2), ink= fcLight(c1)? (both? '#1a1a1a' : c2) : (fcLight(c2)? c2 : '#ffffff'), ink2= ink==='#ffffff'? '#1a1a1a' : '#ffffff';
  const gold=(h>>>9)%3===0, m1=gold?'#FFF3C8':'#F4F6F9', m2=gold?'#D9A63A':'#AEB6C4', m3=gold?'#7A5212':'#59616E';
  const ini=footInitials(c.n), yr=1872+(h>>>11)%95;
  const P=[ '',
    '<rect x="0" y="0" width="50" height="110" fill="url(#'+id+'p)"/>',
    '<rect x="0" y="42" width="100" height="20" fill="url(#'+id+'p)"/>',
    [14,36,58,80].map(x=>'<rect x="'+x+'" y="0" width="10" height="110" fill="url(#'+id+'p)"/>').join(''),
    '<path d="M0 0 L100 110 V80 L28 0 Z" fill="url(#'+id+'p)"/>',
    '<path d="M0 66 L50 40 L100 66 V110 H0 Z" fill="url(#'+id+'p)"/>',
    [...Array(5)].map((_,i)=>[...Array(5)].map((__,j)=>(i+j)%2?'<rect x="'+i*20+'" y="'+j*22+'" width="20" height="22" fill="url(#'+id+'p)"/>':'').join('')).join(''),
    '<rect x="35" y="0" width="30" height="110" fill="#fff"/><rect x="38.5" y="0" width="23" height="110" fill="url(#'+id+'p)"/>',
    '<rect x="0" y="54" width="100" height="56" fill="url(#'+id+'p)"/>',
    '<rect x="0" y="68" width="100" height="7" fill="url(#'+id+'q)"/><rect x="0" y="75" width="100" height="7" fill="url(#'+id+'p)"/>',
    [0,22,44,66,88].map(y=>'<rect x="0" y="'+y+'" width="100" height="11" fill="url(#'+id+'p)"/>').join('')][pat];
  return '<svg class="crest fc" viewBox="-4 -4 108 118" width="'+size+'" height="'+size+'" aria-hidden="true"><defs>'+
    '<clipPath id="'+id+'c"><path d="'+shape+'"/></clipPath>'+
    '<linearGradient id="'+id+'b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+fcShade(c1,.18)+'"/><stop offset="1" stop-color="'+fcShade(c1,-.28)+'"/></linearGradient>'+
    '<linearGradient id="'+id+'p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+fcShade(c2,.15)+'"/><stop offset="1" stop-color="'+fcShade(c2,-.25)+'"/></linearGradient>'+
    '<linearGradient id="'+id+'q" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+fcShade(c3,.15)+'"/><stop offset="1" stop-color="'+fcShade(c3,-.25)+'"/></linearGradient>'+
    '<linearGradient id="'+id+'m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+m1+'"/><stop offset=".5" stop-color="'+m2+'"/><stop offset="1" stop-color="'+m3+'"/></linearGradient>'+
    '<radialGradient id="'+id+'v" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>'+
    '<linearGradient id="'+id+'h" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".38" stop-color="#FF7AD9" stop-opacity=".0"/><stop offset=".45" stop-color="#FF7AD9" stop-opacity=".55"/><stop offset=".5" stop-color="#7AF0FF" stop-opacity=".7"/><stop offset=".55" stop-color="#C9FF7A" stop-opacity=".55"/><stop offset=".6" stop-color="#FFE27A" stop-opacity=".45"/><stop offset=".68" stop-color="#B07AFF" stop-opacity="0"/></linearGradient>'+
    '<filter id="'+id+'s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2.2" stdDeviation="1.6" flood-color="#000" flood-opacity=".45"/></filter></defs>'+
    '<path d="'+shape+'" fill="#000" opacity=".35" transform="translate(0 3)"/>'+
    '<g clip-path="url(#'+id+'c)"><rect x="-4" y="-4" width="108" height="118" fill="url(#'+id+'b)"/>'+P+
    '<path d="M10 92 H90" stroke="'+ink+'" stroke-opacity=".12" stroke-width="30"/>'+
    '<g fill="'+ink+'" stroke="'+ink+'" filter="url(#'+id+'s)" class="fc-emb" style="--fc-ink2:'+ink2+'" transform="translate(50 50) scale(.78) translate(-50 -50)">'+emb+'</g>'+
    '<rect x="-4" y="-4" width="108" height="118" fill="url(#'+id+'v)"/>'+
    '<g class="fc-holo"><rect x="-120" y="-4" width="240" height="118" fill="url(#'+id+'h)"/></g>'+
    [[22,24],[78,30],[30,80],[72,74]].map(([x,y],i)=>'<path class="fc-spk" style="animation-delay:'+(i*.7+(h%7)*.2).toFixed(1)+'s" d="M'+x+' '+(y-4)+' L'+(x+1)+' '+(y-1)+' L'+(x+4)+' '+y+' L'+(x+1)+' '+(y+1)+' L'+x+' '+(y+4)+' L'+(x-1)+' '+(y+1)+' L'+(x-4)+' '+y+' L'+(x-1)+' '+(y-1)+'Z" fill="#fff"/>').join('')+'</g>'+
    '<path d="'+shape+'" fill="none" stroke="url(#'+id+'m)" stroke-width="6"/><path d="'+shape+'" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1" transform="translate(50 54) scale(.93) translate(-50 -54)"/>'+
    '<g transform="translate(0 0)"><path d="M14 84 L22 80 H78 L86 84 L78 88 V96 H22 V88 Z" fill="url(#'+id+'m)" stroke="#000" stroke-opacity=".35" stroke-width=".8"/><path d="M22 80 V96 M78 80 V96" stroke="#000" stroke-opacity=".25"/>'+
    '<text x="50" y="92.5" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="900" font-size="'+(ini.length>2?10:11)+'" letter-spacing="1.5" fill="'+(gold?'#3A2400':'#1E232C')+'">'+ini+'</text></g>'+
    (size>=30? '<text x="50" y="20" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="6.5" letter-spacing="1.2" fill="'+ink+'" opacity=".85" clip-path="url(#'+id+'c)">'+yr+'</text>' : '')+
    '</svg>'; };
NF_CSS.push(`
.fc .fc-holo{mix-blend-mode:screen;animation:fcholo 4.5s ease-in-out infinite}
.fc .fc-spk{opacity:0;transform-box:fill-box;transform-origin:center;animation:fcspk 3.2s ease-in-out infinite}
.fc .fc-emb .fc-face{fill:var(--fc-ink2);stroke:none;opacity:.9}.fc .fc-emb .fc-eye{fill:var(--fc-ink2);stroke:none}.fc .fc-emb .fc-line{fill:none;stroke-width:1.6}.fc .fc-emb .fc-acc,.fc .fc-emb .fc-gem{fill:#E8B84A;stroke:none}.fc .fc-emb .fc-red{fill:#E23B3B;stroke:none}.fc .fc-emb .fc-leg{fill:none;stroke-width:2.6;stroke-linecap:round}.fc .fc-emb .fc-line2{fill:none;stroke:var(--fc-ink2);stroke-width:1.6;stroke-linecap:round}
@keyframes fcholo{0%{transform:translateX(-60px)}55%,100%{transform:translateX(130px)}}
@keyframes fcspk{0%,70%,100%{opacity:0;transform:scale(.4)}80%{opacity:.95;transform:scale(1.2)}}
@media (prefers-reduced-motion:reduce){.fc .fc-holo,.fc .fc-spk{animation:none;opacity:0}}`);
try{ nfCssOnce(); }catch(e){}
