/* ============================================================
   FOOTBALL : effectifs
   Chaque club a 24 joueurs. Les joueurs connus des grands clubs viennent de
   FOOT_REAL (foot_players.js, noms modifiés de quelques lettres) ; le reste de
   l'effectif est créé par le jeu à partir de la note du club, toujours de la même
   façon pour un club donné (rien n'est sauvegardé tant qu'aucun joueur ne change).
   Postes : G gardien, DL latéral, DC défenseur central, MD milieu défensif,
   MC milieu, MO milieu offensif, AIL ailier, BU buteur.
   ============================================================ */
const FOOT_POS = {G:'Gardien', DL:'Latéral', DC:'Défenseur central', MD:'Milieu défensif', MC:'Milieu', MO:'Milieu offensif', AIL:'Ailier', BU:'Avant-centre'};
const FOOT_POS_S = {G:'G', DL:'DL', DC:'DC', MD:'MD', MC:'MC', MO:'MO', AIL:'AIL', BU:'BU'};
const FOOT_START = {G:1,DL:2,DC:2,MD:1,MC:2,MO:1,AIL:2,BU:1};
/* composition type d'un effectif de 24 */
const FOOT_SQUAD_SHAPE = ['G','G','G','DL','DL','DL','DL','DC','DC','DC','DC','DC','MD','MD','MC','MC','MC','MO','MO','AIL','AIL','AIL','BU','BU'];

/* ---------- Noms par nationalité (prénoms et noms courants, combinés au hasard) ---------- */
const FOOT_NAMES = {
  fr:['Lucas Hugo Théo Nathan Mathis Enzo Louis Raphaël Tom Noah Yanis Rayan Adam Kylian Bastien Maxime Antoine Romain Kévin Florian Mehdi Karim Moussa Ibrahima Mamadou Sékou Amadou Jordan Yoann Clément Benjamin Quentin Valentin Alexis Dylan Wesley Steve Loïc Malik Ilyes',
      'Martin Bernard Dubois Thomas Robert Richard Petit Durand Leroy Moreau Simon Laurent Lefebvre Michel Garcia David Bertrand Roux Vincent Fournier Morel Girard André Mercier Blanc Guérin Boyer Garnier Chevalier François Legrand Gauthier Perrin Robin Clément Morin Nicolas Henry Roussel Mathieu Diallo Traoré Koné Camara Sissoko Touré Bamba Cissé Kanté Diakité Mendy Gomis Sylla Doucouré Fofana Konaté Ba Ndiaye Sarr'],
  es:['Pablo Álvaro Hugo Mario Adrián Javier Sergio Daniel Alejandro Iván Rubén Raúl Diego Jorge Carlos Marcos Óscar Gonzalo Víctor Iker Unai Aitor Asier Mikel Jon Ander Borja Íñigo Joan Marc Pau Pol Jordi Nacho Dani Fran Juanmi Manu Rafa',
      'García Fernández González Rodríguez López Martínez Sánchez Pérez Gómez Martín Jiménez Ruiz Hernández Díaz Moreno Muñoz Álvarez Romero Alonso Gutiérrez Navarro Torres Domínguez Vázquez Ramos Gil Ramírez Serrano Blanco Molina Morales Suárez Ortega Delgado Castro Ortiz Rubio Marín Sanz Iglesias Medina Garrido Cortés Castillo Santos Lozano Guerrero Cano Prieto Méndez Cruz Calvo Gallego Herrera Márquez León Peña Flores Cabrera Campos Vega Fuentes Carrasco Etxeberria Aguirre Zubiaurre Goikoetxea'],
  hr:['Luka Ivan Marko Josip Ante Mateo Petar Filip Karlo Dario Tomislav Mario Domagoj Nikola Igor Stipe Bruno Toni Lovro Borna Duje Mislav Marin Roko Fran Leon Dino Kristijan Antonio Hrvoje',
      'Horvat Kovačević Babić Marić Jurić Novak Kovačić Knežević Vuković Marković Petrović Matić Tomić Pavlović Božić Blažević Grgić Pavić Radić Perić Šarić Lovrić Vidović Perković Galić Barić Brkić Jukić Lončar Bašić Šimić Mikulić Bilić Vrdoljak Ćorić Glavaš Rukavina Jelavić Sučić Vlašić'],
  us:['Jack Tyler Ryan Brandon Jordan Kyle Austin Cole Logan Mason Ethan Caleb Hunter Chase Dylan Owen Gavin Nolan Miles Jalen Marcus Darius Andre Malik Brenden Christian Diego Alejandro Josh Zack Tanner Brady Drew',
      'Smith Johnson Williams Brown Jones Miller Davis Wilson Anderson Taylor Thomas Moore Jackson White Harris Martin Thompson Clark Lewis Robinson Walker Young Allen Wright Scott Hill Green Adams Baker Nelson Carter Mitchell Roberts Turner Phillips Campbell Parker Evans Edwards Collins Stewart Morris Rogers Reed Cook Bell Murphy Bailey Cooper Howard Ward Cox Hughes Price Bennett Wood Barnes Ross Henderson Coleman Jenkins Perry Powell Long Patterson Flores'],
  br:['Gabriel Lucas Matheus Pedro Guilherme Rafael Gustavo Felipe Bruno Thiago Vitor Caio Diego Igor João Arthur Davi Breno Danilo Everton Wellington Rodrigo Leandro Marcos Fabrício Renan Willian Douglas Paulinho Juninho Luizão Kaio Erick Yago Wesley',
      'Silva Santos Oliveira Souza Rodrigues Ferreira Alves Pereira Lima Gomes Costa Ribeiro Martins Carvalho Almeida Lopes Soares Fernandes Vieira Barbosa Rocha Dias Nascimento Andrade Moreira Nunes Marques Machado Mendes Freitas Cardoso Ramos Gonçalves Santana Teixeira Araújo Pinto Correia Moura Cavalcanti Batista Campos Monteiro Farias'],
  cn:['Wei Lei Jun Hao Yang Peng Bin Tao Chao Bo Long Fei Xin Jie Yu Kai Ming Rui Hang Zhen Yi Lin Qiang Gang Feng Hui Xiang Liang Yuan Zhi',
      'Wang Li Zhang Liu Chen Yang Huang Zhao Wu Zhou Xu Sun Ma Zhu Hu Guo He Gao Lin Luo Zheng Liang Xie Song Tang Han Feng Deng Cao Peng Zeng Xiao Tian Dong Yuan Pan Cai Jiang Yu Du Ye Cheng Wei Su Lü Ding Ren Shen Yao Lu Jin'],
  en:['Jack Harry Oliver Charlie George James Thomas William Joe Alfie Freddie Archie Leo Jacob Josh Callum Connor Reece Ben Sam Luke Kieran Jamie Aaron Mason Cole Owen Lewis',
      'Smith Jones Taylor Brown Williams Wilson Johnson Davies Robinson Wright Thompson Evans Walker White Roberts Green Hall Wood Jackson Clarke Hughes Edwards Turner Cooper Harris Ward Lewis Morgan Baker Bennett Shaw Barnes Hill Kelly Mills Walsh Lloyd Palmer Hart'],
  it:['Lorenzo Leonardo Francesco Alessandro Andrea Matteo Gabriele Riccardo Tommaso Federico Davide Giacomo Nicolò Simone Marco Luca Stefano Daniele Fabio Gianluca Mattia Samuele Manuel Raoul',
      'Rossi Russo Ferrari Esposito Bianchi Romano Colombo Ricci Marino Greco Bruno Gallo Conti De_Luca Mancini Costa Giordano Rizzo Lombardi Moretti Barbieri Fontana Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone Longo Gentile Martinelli Vitale Lombardo Serra Coppola De_Santis'],
  de:['Leon Lukas Finn Jonas Felix Paul Elias Noah Ben Luca Maximilian Tim Niklas Jan Florian Julian Kai Marvin Timo Dennis Kevin Sebastian Moritz Jannik Robin',
      'Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann Schäfer Koch Bauer Richter Klein Wolf Schröder Neumann Schwarz Zimmermann Braun Krüger Hofmann Hartmann Lange Schmitt Werner Krause Meier Lehmann Köhler Herrmann König Walter Kaiser Fuchs Peters Lang Scholz Möller'],
  pt:['João Rodrigo Martim Tomás Duarte Francisco Afonso Gonçalo Diogo Rúben Nuno Bruno Pedro Vitinha André Ricardo Rafael Fábio Hugo Tiago',
      'Silva Santos Ferreira Pereira Oliveira Costa Rodrigues Martins Jesus Sousa Fernandes Gonçalves Gomes Lopes Marques Alves Almeida Ribeiro Pinto Carvalho Teixeira Moreira Correia Mendes Nunes Soares Vieira Monteiro Cardoso Rocha'],
  nl:['Daan Sem Lucas Milan Levi Luuk Thijs Jesse Bram Stijn Tim Ruben Joey Kenneth Ryan Jurriën Teun Xavi Jorrel Quilindschy',
      'de_Jong Jansen de_Vries van_den_Berg van_Dijk Bakker Janssen Visser Smit Meijer de_Boer Mulder de_Groot Bos Vos Peters Hendriks van_Leeuwen Dekker Brouwer de_Wit Dijkstra Smits de_Graaf van_der_Meer'],
  ar:['Mohamed Ahmed Ali Omar Youssef Hassan Khalid Abdullah Salem Fahad Saud Nasser Faisal Hamza Karim Hakim Sofiane Ismaël Bilal Yassine Amine Walid Emre Burak Mert Kerem',
      'Al-Harbi Al-Otaibi Al-Qahtani Al-Ghamdi Al-Zahrani Al-Shammari Al-Mutairi Al-Dossary Haddad Mansour Khalil Saleh Hamdi Benali El_Amrani Bennani Alaoui Tazi Idrissi Chakir Belkacem Saidi Mejri Trabelsi Jaziri Gharbi Demir Kaya Çelik Şahin Yılmaz Aydın Öztürk Arslan Doğan'],
  jp:['Takumi Kaoru Daichi Ritsu Takefusa Wataru Junya Kyogo Ayase Hidemasa Yuki Shogo Ko Hiroki Keito Daizen Koki Reo Sota Yuto',
      'Sato Suzuki Takahashi Tanaka Watanabe Ito Yamamoto Nakamura Kobayashi Kato Yoshida Yamada Sasaki Yamaguchi Matsumoto Inoue Kimura Hayashi Shimizu Mori Ikeda Hashimoto Ishikawa Ogawa Okada Fujita Nishimura Aoki Fukuda'],
  kr:['Min-jae Heung-min Kang-in Hee-chan Jae-sung Seung-ho Woo-young Gue-sung In-beom Young-gwon Jin-su Hyun-woo Sang-ho Ji-sung Dong-gyeong',
      'Kim Lee Park Choi Jung Kang Cho Yoon Jang Lim Han Oh Seo Shin Kwon Hwang Ahn Song Jeon Hong'],
  af:['Sadio Victor Wilfried Serge Ismaïla Kalidou Edouard Idrissa Franck Nicolas Sébastien Simon Ademola Alex Kelechi Bertrand Thomas Andre Jordan Percy Themba Lyle Teboho Bongani Moses Emmanuel Samuel Joseph',
      'Diallo Traoré Koné Ouattara Bamba Coulibaly Diarra Kouassi Yao Okafor Adeyemi Okonkwo Mensah Boateng Asante Owusu Nkosi Dlamini Mokoena Ndlovu Khumalo Zulu Mbatha Moyo Banda Phiri Mwangi Otieno Kamau Mbarga Ngono Essomba Abena Fofana Sangaré'],
  la:['Juan Santiago Matías Nicolás Rodrigo Thiago Facundo Franco Agustín Lucas Gonzalo Ezequiel Cristian Leandro Valentín Germán Brian Kevin Luis Luciano Maximiliano',
      'González Rodríguez Gómez Fernández López Díaz Martínez Pérez Romero Sánchez García Sosa Benítez Ramírez Torres Ruiz Flores Acosta Medina Herrera Suárez Aguirre Giménez Gutiérrez Pereyra Rojas Molina Castro Ortiz Silva Núñez Luna Juárez Cabrera Ríos Ferreyra Godoy Morales Domínguez']
};
/* nationalité dominante selon le pays du club */
const FOOT_NATPOOL = {fr:'fr',es:'es',hr:'hr',us:'us',br:'br',cn:'cn','Angleterre':'en','Écosse':'en','Australie':'en','Nouvelle-Zélande':'en','Italie':'it','Allemagne':'de','Autriche':'de','Suisse':'de','Portugal':'pt','Pays-Bas':'nl','Belgique':'nl','Danemark':'de','Norvège':'de','Suède':'de','Pologne':'hr','Tchéquie':'hr','Slovaquie':'hr','Serbie':'hr','Ukraine':'hr','Hongrie':'hr','Roumanie':'hr','Grèce':'it','Turquie':'ar','Azerbaïdjan':'ar','Israël':'ar',
  'Argentine':'la','Uruguay':'la','Colombie':'la','Chili':'la','Paraguay':'la','Équateur':'la','Pérou':'la','Bolivie':'la','Venezuela':'la','Mexique':'la','Costa Rica':'la','Honduras':'la','Guatemala':'la',
  'Arabie saoudite':'ar','Qatar':'ar','Émirats arabes unis':'ar','Iran':'ar','Égypte':'ar','Maroc':'ar','Tunisie':'ar','Ouzbékistan':'ar','Japon':'jp','Corée du Sud':'kr','Thaïlande':'jp','Afrique du Sud':'af'};
/* étrangers possibles dans un effectif, selon le pays */
const FOOT_IMPORT = {fr:['af','af','es','pt','br','la'], es:['la','la','fr','pt','br','af'], hr:['af','br','es'], us:['la','la','en','af','fr'], br:['la','la'], cn:['br','br','af','es'], en:['fr','es','pt','br','af','la','nl','de'], it:['fr','af','la','br','nl','hr'], de:['fr','af','nl','hr','en'], ar:['br','af','fr','pt','es']};
const FOOT_NATNAME = {fr:'France',es:'Espagne',hr:'Croatie',us:'États-Unis',br:'Brésil',cn:'Chine',en:'Angleterre',it:'Italie',de:'Allemagne',pt:'Portugal',nl:'Pays-Bas',ar:'Moyen-Orient et Maghreb',jp:'Japon',kr:'Corée du Sud',af:'Afrique',la:'Amérique latine'};
const FOOT_NPOOL={};
function footNamePool(k){ if(!FOOT_NPOOL[k]){ const s=FOOT_NAMES[k]||FOOT_NAMES.fr; FOOT_NPOOL[k]={f:s[0].split(' '), l:s[1].split(' ').map(x=>x.replace(/_/g,' '))}; } return FOOT_NPOOL[k]; }

/* ---------- Hasard déterministe (graine = club) ---------- */
function footSeedRng(seed){ let s=seed>>>0||1; return ()=>{ s=(s+0x6D2B79F5)|0; let t=s; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }

/* ---------- Effectif d'un club ---------- */
const FOOT_SQ={};
function footSquad(id){
  const c=footClub(id); if(!c) return [];
  const r=Math.round(footR(id)), key=id+':'+r;
  if(FOOT_SQ[id] && FOOT_SQ[id].k===key) return FOOT_SQ[id].p;
  const R=footSeedRng(footHash(c.n)*7+id), home=FOOT_NATPOOL[c.nat]||'fr', imp=FOOT_IMPORT[home]||['fr','br','af'];
  const real=(typeof FOOT_REAL!=='undefined' && FOOT_REAL[c.n])? FOOT_REAL[c.n].trim().split('\n').map(l=>{ const [n,p,a,o,nat]=l.split('|'); return {n, p, a:+a, o:+o, nat:nat||home, real:1}; }) : [];
  const need=FOOT_SQUAD_SHAPE.slice(), out=[];
  real.forEach(p=>{ out.push(p); const i=need.indexOf(p.p); if(i>=0) need.splice(i,1); else need.splice(need.length-1,1); });
  const used=new Set(out.map(p=>p.n)), cnt={}; out.forEach(p=>{ cnt[p.p]=(cnt[p.p]||0)+1; });
  need.slice(0,Math.max(0,24-out.length)).forEach((pos,i)=>{
    const nat= R()<(c.nat==='br'||c.nat==='cn'? .12 : .3)? imp[Math.floor(R()*imp.length)] : home, P=footNamePool(nat);
    let n; for(let k=0;k<6;k++){ n=P.f[Math.floor(R()*P.f.length)]+' '+P.l[Math.floor(R()*P.l.length)]; if(!used.has(n)) break; } used.add(n);
    const a=17+Math.floor(R()*17), lead=(cnt[pos]=(cnt[pos]||0)+1)<=(FOOT_START[pos]||1);   /* titulaires probables */
    const o=Math.round(clamp(r+(lead?1:-6)-(pos==='G'&&!lead?3:0)+(R()-.5)*10-(a<20?5:0)-(a>32?3:0),30,94));
    out.push({n, p:pos, a, o, nat});
  });
  out.forEach((p,i)=>{ p.id=id*100+i; p.club=id; });
  FOOT_SQ[id]={k:key, p:out};
  return out;
}
/* onze de départ (4-3-3) : meilleurs joueurs par poste */
const FOOT_433 = [['G',1],['DL',2],['DC',2],['MD',1],['MC',1],['MO',1],['AIL',2],['BU',1]];
const FOOT_NEAR = {G:['G'],DL:['DL','DC','MD'],DC:['DC','MD','DL'],MD:['MD','MC','DC'],MC:['MC','MD','MO'],MO:['MO','MC','AIL'],AIL:['AIL','MO','BU'],BU:['BU','AIL','MO']};
function footXI(id){
  const sq=footSquad(id).slice().sort((a,b)=>b.o-a.o), taken=new Set(), xi=[];
  FOOT_433.forEach(([pos,k])=>{ for(let j=0;j<k;j++){ let pl=null; for(const alt of FOOT_NEAR[pos]){ pl=sq.find(p=>p.p===alt&&!taken.has(p.id)); if(pl) break; } if(!pl) pl=sq.find(p=>!taken.has(p.id)); taken.add(pl.id); xi.push(Object.assign({}, pl, {slot:pos})); } });
  return {xi, bench:sq.filter(p=>!taken.has(p.id))};
}

