/* ============================================================
   FOOTBALL : données des championnats (saison 2026-2027)
   Noms de clubs volontairement modifiés de quelques lettres ; la ville reste exacte.
   Blasons dessinés par le jeu (forme et motifs originaux), seules les couleurs
   rappellent le club. Force (note) calée sur la hiérarchie réelle.
   Format d'une ligne : Nom|Ville|couleur 1|couleur 2|note|capacité du stade
   ============================================================ */
const FOOT_NAT = {
  fr:{in:'en France', n:'France',      conf:'eu', cal:[8,5],  city:'paris'},
  en:{in:'en Angleterre', n:'Angleterre', conf:'eu', cal:[8,5], city:'paris'},   /* V2.1.2 */
  es:{in:'en Espagne', n:'Espagne',     conf:'eu', cal:[8,5],  city:'barcelone'},
  de:{in:'en Allemagne', n:'Allemagne',  conf:'eu', cal:[8,5], city:'paris'},
  hr:{in:'en Croatie', n:'Croatie',     conf:'eu', cal:[7,5],  city:'zagreb'},
  us:{in:'aux États-Unis', n:'États-Unis',  conf:'na', cal:[2,12], city:'miami', closed:true},
  br:{in:'au Brésil', n:'Brésil',      conf:'sa', cal:[1,12], city:'rio'},
  cn:{in:'en Chine', n:'Chine',       conf:'as', cal:[3,11], city:'pekin'}
};
/* niveaux : n = nom fictif, up/down = places de montée / descente */
const FOOT_LEAGUES = [
  {id:'fr1',nat:'fr',lvl:1,n:'Première Ligue',      down:2},
  {id:'fr2',nat:'fr',lvl:2,n:'Deuxième Ligue',      up:2, down:2},
  {id:'fr3',nat:'fr',lvl:3,n:'Troisième Ligue',     up:2},
  {id:'es1',nat:'es',lvl:1,n:'Primera Liga',        down:3},
  {id:'es2',nat:'es',lvl:2,n:'Segunda Liga',        up:3, down:4},
  {id:'es3',nat:'es',lvl:3,n:'Tercera Liga',        up:4, groups:2},
  {id:'hr1',nat:'hr',lvl:1,n:'Prva Liga',           down:1},
  {id:'hr2',nat:'hr',lvl:2,n:'Druga Liga',          up:1, down:1},
  {id:'hr3',nat:'hr',lvl:3,n:'Treća Liga',          up:1},
  {id:'us1',nat:'us',lvl:1,n:'Ligue majeure',       groups:2},
  {id:'us2',nat:'us',lvl:2,n:'Championnat national',groups:2},
  {id:'us3',nat:'us',lvl:3,n:'Ligue régionale'},
  {id:'br1',nat:'br',lvl:1,n:'Série A',             down:4},
  {id:'br2',nat:'br',lvl:2,n:'Série B',             up:4, down:4},
  {id:'br3',nat:'br',lvl:3,n:'Série C',             up:4},
  {id:'cn1',nat:'cn',lvl:1,n:'Super Ligue',         down:2},
  {id:'cn2',nat:'cn',lvl:2,n:'Première Ligue',      up:2, down:2},
  {id:'cn3',nat:'cn',lvl:3,n:'Deuxième Ligue',      up:2, groups:2},
  /* V2.1.2 : construits après les clubs étrangers (identifiants des sauvegardes inchangés) ;
     les clubs anglais et allemands déjà connus rejoignent la première division de leur pays */
  {id:'en1',nat:'en',lvl:1,n:'Ligue d’élite',       down:3, ext:'Angleterre'},
  {id:'en2',nat:'en',lvl:2,n:'Championnat',          up:3, ext:'Angleterre'},
  {id:'de1',nat:'de',lvl:1,n:'Erste Liga',           down:2, ext:'Allemagne'},
  {id:'de2',nat:'de',lvl:2,n:'Zweite Liga',          up:2, ext:'Allemagne'}
];
const FOOT_RAW = {
fr1:`Paris Saint-Germont|Paris|004170|DA291C|88|47926
Olympico de Marseille|Marseille|2FAEE0|FFFFFF|80|67394
AC Monaco|Monaco|E51B22|FFFFFF|79|18523
LOSK Lille|Lille|E01E13|1B2A55|79|50186
Olympico Lyonnais|Lyon|FFFFFF|1B3C8C|78|59186
RS Lens|Lens|FFD100|E30613|77|37705
RS Strasbourg Alsace|Strasbourg|009FE3|FFFFFF|74|29230
OGS Nice|Nice|E2001A|111111|73|35624
Stade Rennois|Rennes|E13327|111111|73|29778
Toulouse AC|Toulouse|5B2D8E|FFFFFF|70|33150
Stade Brestais 29|Brest|E30613|FFFFFF|70|15931
Paris AC|Paris|1A2B4C|FFFFFF|68|20000
AC Lorient|Lorient|F28C00|111111|66|18890
Le Havre FC|Le Havre|5CBFEB|003865|65|25178
AS Auxerre|Auxerre|FFFFFF|0050A0|65|21379
Angers SCA|Angers|111111|FFFFFF|65|18752
Le Mans AC|Le Mans|E30613|F7D117|62|25000
ESTAK Troyes|Troyes|0055A4|FFFFFF|62|20400`,
fr2:`AC Nantes|Nantes|FCD405|008A3A|64|35322
AC Metz|Metz|8B1538|FFFFFF|63|28786
US Saint-Étienne|Saint-Étienne|009639|FFFFFF|63|41965
Stade du Reims|Reims|E30613|FFFFFF|62|21029
Montpellier HSK|Montpellier|F28C00|1B2A55|61|32900
AC Annecy|Annecy|E30613|FFFFFF|57|15660
Clermont Fut 63|Clermont-Ferrand|E30613|004B9B|57|11980
En Avent Guingamp|Guingamp|E30613|111111|57|18378
USD Dunkerque|Dunkerque|0055A4|FFFFFF|56|4933
Red Stars FC|Saint-Ouen|00843D|FFFFFF|56|10000
AC Sochaux-Montbéliard|Montbéliard|FCD405|003F87|56|20005
DFKO Dijon|Dijon|E30613|FFFFFF|55|15995
Grenoble Fut 38|Grenoble|0055A4|FFFFFF|55|20068
US Nancy Lorraine|Nancy|E30613|FFFFFF|55|20087
Stade Lavalois|Laval|F28C00|111111|54|18607
Pau AC|Pau|FCD405|003865|54|4031
Rodez AV|Rodez|E30613|FCD405|54|5955
AS Boulogne|Boulogne-sur-Mer|E30613|111111|53|9534`,
fr3:`SN Caen|Caen|003F87|E30613|53|21500
SK Bastia|Bastia|003F87|FFFFFF|53|16078
Amiens SK|Amiens|FFFFFF|111111|52|12097
AC Rouen 1899|Rouen|E30613|FFFFFF|48|8000
AS Quevilly-Rouen|Le Petit-Quevilly|FCD405|E30613|48|12018
Valenciennes AC|Valenciennes|E30613|FFFFFF|48|25172
US Cannes|Cannes|E30613|FFFFFF|47|14000
FBPB 01|Bourg-en-Bresse|E30613|FFFFFF|47|11400
AS Orléans|Orléans|E30613|FFFFFF|47|7533
AC Fleury 91|Fleury-Mérogis|E30613|111111|46|2500
Paris 13 Atletica|Paris|E30613|FCD405|46|7000
AS Concarneau|Concarneau|E30613|003F87|46|6000
AC Versailles 78|Versailles|003F87|FCD405|46|7000
AC Villefranche Beaujolais|Villefranche-sur-Saône|003F87|E30613|45|3000
Le Puy Fut 43|Le Puy-en-Velay|111111|FFFFFF|45|5000
SC Aubagne Air Belle|Aubagne|003F87|FFFFFF|45|3000
US Thionville Lusitanes|Thionville|E30613|009639|44|4000
La Roche VC|La Roche-sur-Yon|FCD405|003F87|44|5000`,
es1:`Reale Madrid|Madrid|FFFFFF|FEBE10|91|83186
CF Barcelona|Barcelone|A50044|004D98|92|62652
Atlética Madrid|Madrid|CB3524|FFFFFF|86|70692
Villarreal FC|Villarreal|FFE667|005187|81|23008
Athletix Bilbao|Bilbao|EE2523|FFFFFF|80|53289
Reale Betos|Séville|00954C|FFFFFF|79|70000
Reale Sociedat|Saint-Sébastien|0067B1|FFFFFF|78|39313
Celto Vigo|Vigo|8AC3EE|FFFFFF|76|24870
Sevilla AC|Séville|FFFFFF|D81E05|75|43883
Valencia FC|Valence|FFFFFF|111111|74|49430
Osasona|Pampelune|D91A21|0A346F|73|23576
Rayo Vallecaño|Madrid|FFFFFF|E53027|73|14708
RCD Espanyal|Barcelone|007FC8|FFFFFF|72|37776
Getafe FC|Getafe|005999|FFFFFF|72|16500
Deportiva Alavés|Vitoria-Gasteiz|0761AF|FFFFFF|70|19840
Elche FC|Elche|FFFFFF|05642C|70|31388
Deportiva La Coruña|La Corogne|0057B8|FFFFFF|70|32660
Levanto UD|Valence|B4053F|004D98|69|26354
Málaga FC|Málaga|00A1E4|FFFFFF|68|30044
Rasing Santander|Santander|FFFFFF|00A650|68|22308`,
es2:`Girona AC|Gérone|E30613|FFFFFF|68|14624
RDC Mallorca|Palma|E30613|111111|67|23142
Reale Oviedo|Oviedo|003F87|FFFFFF|65|30500
AD Las Palmas|Las Palmas|FCD405|003F87|64|32392
AD Almería|Almería|E30613|FFFFFF|63|15000
AD Leganés|Leganés|003F87|FFFFFF|63|14422
Granada FC|Grenade|E30613|FFFFFF|62|19189
Reale Valladolid|Valladolid|5B2D8E|FFFFFF|62|27618
Cádiz FC|Cadix|FCD405|003F87|61|20724
Reale Sportin Gijón|Gijón|E30613|FFFFFF|61|29371
Albacete Balompia|Albacete|FFFFFF|E30613|60|17524
AD Castellón|Castellón|111111|FFFFFF|60|15500
CD Eibar|Eibar|003F87|A50044|60|8164
AC Andorra|Andorre|003F87|FCD405|59|5108
Burgos FC|Burgos|FFFFFF|111111|59|12194
Córdoba FC|Cordoue|00843D|FFFFFF|59|20989
AD Tenerife|Santa Cruz de Tenerife|FFFFFF|003F87|57|22824
AC Ceuta|Ceuta|FFFFFF|111111|55|6500
Celto Fortuna|Vigo|8AC3EE|FFFFFF|54|24870
CD Eldensa|Elda|003F87|E30613|54|5776
CF Sabadell|Sabadell|003F87|FFFFFF|54|11908
Reale Sociedat B|Saint-Sébastien|0067B1|FFFFFF|52|4000`,
es3:`Arenas Klub|Getxo|E30613|111111|45|2000
Reale Avilés Industrial|Avilés|FFFFFF|003F87|47|5400
Barakaldo FC|Barakaldo|FCD405|111111|47|7960
Bilbao Athletix|Bilbao|EE2523|FFFFFF|49|3250
CP Cacereña|Cáceres|00843D|FFFFFF|46|7000
Coria FC|Coria|003F87|FFFFFF|43|3000
Cultura Leonesa|León|FFFFFF|111111|52|13346
Deportiva Fabril|La Corogne|0057B8|FFFFFF|46|1000
FC Extremadura|Almendralejo|00843D|FFFFFF|45|11580
AD Logroñés|Logroño|E30613|FFFFFF|48|16000
AD Lugo|Lugo|E30613|FFFFFF|49|7114
AC Mérida|Mérida|111111|FFFFFF|46|14600
AD Mirandés|Miranda de Ebro|E30613|111111|53|5759
AD Ourense|Ourense|E30613|FFFFFF|45|5000
SD Ponferradino|Ponferrada|003F87|FFFFFF|50|8400
Pontevedra FC|Pontevedra|E30613|111111|47|10500
Rasing Ferrol|Ferrol|00843D|FFFFFF|50|8000
Reale Unión|Irun|FFFFFF|111111|46|5000
Unionistes de Salamanca|Salamanque|FFFFFF|111111|47|4000
Zamora FC|Zamora|E30613|FFFFFF|47|7813
;
Águilas AC|Águilas|E30613|FFFFFF|45|4000
AC Alcorcón|Alcorcón|FCD405|003F87|49|5100
Algeciras FC|Algésiras|E30613|FFFFFF|48|7000
Antequera FC|Antequera|00843D|FFFFFF|46|6000
Atlética Madrileño|Madrid|CB3524|FFFFFF|50|6000
AC Cartagena|Carthagène|111111|FFFFFF|52|15105
CE Europe|Barcelone|FFFFFF|003F87|45|4000
Gimnàstik de Tarragona|Tarragone|E30613|111111|50|14591
Hércules FC|Alicante|003F87|FFFFFF|50|29500
AD Huesca|Huesca|003F87|A50044|53|9100
AD Ibiza|Ibiza|003F87|FFFFFF|49|4500
Reale Jaén|Jaén|FFFFFF|A50044|46|12000
Juventad Torremolinos|Torremolinos|003F87|FFFFFF|45|3000
Reale Murcia|Murcie|E30613|FFFFFF|51|31179
Rayu Majadahonda|Majadahonda|E30613|FFFFFF|45|3500
Reale Madrid Castilla|Madrid|FFFFFF|FEBE10|51|6000
UE Sant Andrea|Barcelone|FCD405|E30613|46|6500
AD Teruel|Teruel|E30613|FFFFFF|45|5000
Villarreal FC B|Villarreal|FFE667|005187|48|5000
Reale Zaragoza|Saragosse|FFFFFF|003F87|54|20000`,
hr1:`GNK Dynamo Zagreb|Zagreb|0057A8|FFFFFF|75|35123
HNK Hajduc Split|Split|FFFFFF|0057A8|70|33987
HSK Rijeka|Rijeka|FFFFFF|0057A8|66|8279
FK Varaždin|Varaždin|003F87|FFFFFF|62|8818
FK Osijek|Osijek|003F87|FFFFFF|62|13005
NK Lokomotiv|Zagreb|003F87|FFFFFF|60|35123
NK Istria 1961|Pula|FCD405|00843D|59|8923
HNK Goriça|Velika Gorica|E30613|FFFFFF|58|5000
NK Slaven Belupa|Koprivnica|FFFFFF|003F87|58|3134
NK Rudež|Zagreb|FCD405|111111|53|2000`,
hr2:`HNC Vukovar 1991|Vukovar|0057A8|FFFFFF|50|3000
HNK Cibalija|Vinkovci|003F87|FFFFFF|49|9958
FK Sesvete|Sesvete|FCD405|003F87|48|2000
FK Dugopolje|Dugopolje|E30613|FFFFFF|46|2000
FK Dubrava|Zagreb|003F87|FFFFFF|46|2000
NK BSC Bijelo Brdo|Bijelo Brdo|FFFFFF|00843D|46|1500
HNK Orient 1919|Rijeka|E30613|FFFFFF|45|3000
HNK Segeste|Sisak|FFFFFF|E30613|45|6000
FK Karlovac 1919|Karlovac|FFFFFF|E30613|44|5000
FK Opatija|Opatija|E30613|FFFFFF|44|2000
FK Hrvace|Hrvace|003F87|FFFFFF|43|1500
NK Kroatia Zmijavci|Zmijavci|E30613|FFFFFF|43|1500`,
hr3:`HNK Šibenic|Šibenik|E30613|FFFFFF|42|8000
FK Jarun|Zagreb|003F87|FFFFFF|41|2000
FK Zadar|Zadar|003F87|FFFFFF|40|5860
FK Solin|Solin|003F87|FFFFFF|39|2000
NK Intra Zaprešić|Zaprešić|FCD405|003F87|39|4528
NK Međimurja|Čakovec|E30613|111111|39|8000
NK Zrinsky Jurjevac|Jurjevac|00843D|FFFFFF|38|1500
NK Kustošia|Zagreb|E30613|FFFFFF|38|2550
NK Marsonija|Slavonski Brod|003F87|FCD405|38|10000
NK Jadran LB|Ploče|003F87|FFFFFF|37|2000
FK Belišće|Belišće|E30613|FFFFFF|37|4000
NK Junac Sinj|Sinj|E30613|FFFFFF|37|3000
NK Mladost Ždralovo|Bjelovar|00843D|FFFFFF|36|1500
FK Bjelovar|Bjelovar|E30613|FFFFFF|36|5000
NK Uskoc|Klis|FFFFFF|003F87|36|1500
FK Novigrad|Novigrad|003F87|FFFFFF|35|1500`,
us1:`Intra Miami CF|Miami|F7B5CD|231F20|72|26700
Nashville FC|Nashville|ECE83A|1F1646|70|30000
Chicago Fyre FC|Chicago|AF2626|0A174A|67|24955
SC Cincinnati|Cincinnati|F05323|263B80|67|26000
New England Revolutions|Foxborough|0A2240|CE0E2D|66|20000
Charlotte SC|Charlotte|1A85C8|111111|66|38000
New York City SC|New York|6CACE4|041E42|65|28743
New York Rad Bulls|New York|ED1E36|23326A|64|25000
Orlando City FC|Orlando|633492|FDE192|63|25500
Toronto SC|Toronto|B81137|455560|63|28351
D.C. Unity|Washington|111111|EF3E42|63|20000
Philadelphia Unio|Philadelphie|071B2C|B19B69|63|18500
Atlanta Unitas FC|Atlanta|80000A|111111|62|42500
FC Montréal|Montréal|111111|0033A1|61|19619
Columbus Krew|Columbus|FEDD00|111111|61|20011
;
Vancouver Whitecap FC|Vancouver|00245E|9DC2EA|70|22120
Los Angeles SC|Los Angeles|111111|C39E6D|69|22000
Houston Dinamo FC|Houston|FF6B00|101820|68|22039
San Jose Earthquake|San José|0067B1|111111|66|18000
SC Dallas|Dallas|E81F3E|2A4076|66|20500
St. Louis City FC|Saint-Louis|DD004C|0A1E2C|66|22423
San Diego SC|San Diego|0B1D36|E0C068|66|35000
Colorado Rapid|Denver|960A2C|9CC2EA|65|18061
Seattle Sounder FC|Seattle|5D9741|005595|65|37722
Minnesota Unitas FC|Saint Paul|8CD2F4|231F20|64|19400
Reale Salt Lake|Salt Lake City|B30838|013A81|64|20213
Portland Timber|Portland|00482B|D69A00|64|25218
LA Galaxie|Los Angeles|00245D|FFD200|64|27000
Austin SC|Austin|00B140|111111|63|20738
Sportin Kansas City|Kansas City|93B1D7|002F65|60|18467`,
us2:`Tampa Bay Rowdys|Tampa|FDD100|00703C|57|7227
Charleston Batterie|Charleston|FDD100|111111|56|5000
Louisville City SC|Louisville|5B2D8E|FDD100|57|15304
Detroit City SC|Detroit|7A1F2B|C6A96C|55|7933
Pittsburgh Riverhound SC|Pittsburgh|111111|FDD100|54|5000
Hartford Athletik|Hartford|00843D|003F87|53|5500
Indy Elevens|Indianapolis|002F65|E30613|53|10524
Rhode Island SC|Providence|002F65|FDD100|53|10500
Miami SC|Miami|003F87|FFFFFF|51|25000
Loudoun Unitas FC|Leesburg|E30613|111111|50|5000
Birmingham Legio FC|Birmingham|111111|E30613|50|47000
Brooklyn SC|New York|111111|FFFFFF|50|7000
Sportin Club Jacksonville|Jacksonville|003F87|FDD100|48|12000
;
El Paso Locomotiv FC|El Paso|002F65|E57200|56|9500
New Mexico Unitas|Albuquerque|FDD100|111111|55|13500
Orange County FC|Irvine|F28C00|111111|55|5000
SC Tulsa|Tulsa|002F65|E57200|55|7833
San Antonio SC|San Antonio|111111|C8102E|55|8296
Colorado Springs Switchback FC|Colorado Springs|002F65|E57200|54|8000
Sacramento Republik FC|Sacramento|A50034|FDD100|54|11569
Lexington FC|Lexington|00843D|FDD100|53|7500
Las Vegas Light FC|Las Vegas|111111|E5007E|52|9334
Phoenix Risen FC|Phoenix|E57200|111111|52|10000
Oakland Root SC|Oakland|111111|FDD100|52|15000
Monterey Bay SC|Seaside|002F65|E30613|48|6000`,
us3:`Charlotte Independance|Charlotte|002F65|E30613|47|5000
Unio Omaha|Omaha|FDD100|111111|47|6000
Forward Madison SC|Madison|E5007E|111111|46|5000
Athletik Club Boise|Boise|00843D|FFFFFF|45|5000
One Knoxville FC|Knoxville|E57200|002F65|45|6000
Chattanooga Red Wolf SC|Chattanooga|A50034|111111|44|5500
Spokane Velocità FC|Spokane|5B2D8E|111111|44|5000
Fort Wayne SC|Fort Wayne|002F65|E30613|43|5000
AV Alto FC|Lancaster|E57200|111111|42|5000
Corpus Christi SC|Corpus Christi|003F87|FDD100|42|5000
SC Naples|Naples|003F87|FFFFFF|41|5000
Sarasota Paradis|Sarasota|00A3E0|FDD100|41|5000
Portland Heart of Pine|Portland|00843D|111111|41|6000
New York Kosmos|Paterson|00843D|FFFFFF|41|8000
Westchester FC|Mount Vernon|002F65|FDD100|40|5000
Greenville Triomph SC|Greenville|002F65|00A3E0|40|5000
Richmond Kicker|Richmond|E30613|FDD100|40|6000`,
br1:`SE Palmeiros|São Paulo|006437|FFFFFF|80|43713
CR Flamenco|Rio de Janeiro|C52613|111111|80|78838
Fluminensa FC|Rio de Janeiro|870A28|00613C|74|78838
Cruzeira EC|Belo Horizonte|003F87|FFFFFF|74|66658
São Paulo SC|São Paulo|FFFFFF|E30613|73|66671
Atlética Mineiro|Belo Horizonte|111111|FFFFFF|73|44892
Botafoga FR|Rio de Janeiro|111111|FFFFFF|73|44661
EC Bahja|Salvador|003F87|E30613|72|50052
SC Corinthian|São Paulo|FFFFFF|111111|72|47252
Athletiko Paranaense|Curitiba|C8102E|111111|71|42372
Red Bragantina|Bragança Paulista|FFFFFF|E30613|71|12000
SC Intercional|Porto Alegre|E30613|FFFFFF|71|49055
Grêmia FBPA|Porto Alegre|0D80BF|111111|70|60540
Santos SC|Santos|FFFFFF|111111|69|16068
Coritiba SC|Curitiba|00544D|FFFFFF|68|40502
CR Vasco de Gama|Rio de Janeiro|111111|FFFFFF|68|24584
EC Vitórya|Salvador|E30613|111111|66|30793
Mirassol SC|Mirassol|FDD100|00843D|66|14534
Clube do Rema|Belém|002F65|FFFFFF|63|13792
Chapecoensa|Chapecó|00843D|FFFFFF|61|20089`,
br2:`Fortaleza SC|Fortaleza|003F87|E30613|63|57876
EC Juventuda|Caxias do Sul|00843D|FFFFFF|60|19924
Sporte Recife|Recife|E30613|111111|60|32983
Criciúma SC|Criciúma|FDD100|111111|59|19225
Grêmia Novorizontino|Novo Horizonte|FDD100|111111|59|16000
Vila Nova SC|Goiânia|E30613|FFFFFF|58|6500
Atlética Goianiense|Goiânia|E30613|111111|58|12500
Ceará FC|Fortaleza|111111|FFFFFF|58|57876
CRV|Maceió|E30613|FFFFFF|57|17126
Goiás SC|Goiânia|00843D|FFFFFF|57|14450
Cuiabá SC|Cuiabá|00843D|FDD100|57|44000
Operária Ferroviário|Ponta Grossa|111111|FFFFFF|55|10632
Clube Náutica|Recife|E30613|FFFFFF|55|22856
Amérika Mineiro|Belo Horizonte|00843D|111111|55|23018
Athletik Club|São João del-Rei|111111|FFFFFF|54|6000
São Bernardo SC|São Bernardo do Campo|FDD100|111111|54|15159
Avaí SC|Florianópolis|003F87|FFFFFF|54|17826
Botafoga-SP|Ribeirão Preto|E30613|111111|53|29292
Londrina SC|Londrina|00A3E0|FFFFFF|51|31000
Ponta Preta|Campinas|111111|FFFFFF|50|19728`,
br3:`Paysando SC|Belém|00A3E0|FFFFFF|51|16200
Guarany FC|Campinas|00843D|FFFFFF|50|29130
Amazonas SC|Manaus|FDD100|111111|49|44000
Brusque SC|Brusque|E30613|FDD100|49|5000
Santa Kruz FC|Recife|E30613|111111|49|60044
Botafoga-PB|João Pessoa|111111|FFFFFF|48|19000
Ferroviária SC|Araraquara|8B1538|FFFFFF|48|20000
Figueirensa FC|Florianópolis|111111|FFFFFF|48|19584
Ituano SC|Itu|E30613|111111|48|18560
SEC Caxias|Caxias do Sul|8B1538|FFFFFF|47|22132
Intra de Limeira|Limeira|111111|FFFFFF|47|18000
Volta Redonda SC|Volta Redonda|FDD100|111111|47|18230
AD Confiansa|Aracaju|003F87|FFFFFF|46|15575
Maringá SC|Maringá|111111|FFFFFF|46|20000
Anápolis SC|Anápolis|E30613|FFFFFF|45|10000
Barra SC|Itajaí|E30613|FFFFFF|45|5000
Floresta SC|Fortaleza|00843D|FFFFFF|45|5000
AO Itabaiano|Itabaiana|E30613|003F87|45|8000
Ypiranga SC|Erechim|00843D|FDD100|45|8000
Maranhão SC|São Luís|E30613|003F87|44|40000`,
cn1:`Chengdu Rongchen|Chengdu|E30613|FFFFFF|64|50695
Shanghai Ports|Shanghai|E30613|FFFFFF|63|37000
Shanghai Shenhwa|Shanghai|003F87|FFFFFF|62|72436
Shandong Taishang|Jinan|F28C00|FFFFFF|62|56808
Beijing Guoen|Pékin|00843D|FFFFFF|61|68000
Zhejiang SC|Hangzhou|00843D|FFFFFF|59|51971
Chongqing Tongliang Lung|Chongqing|003F87|FDD100|58|60295
Dalian Yingbao|Dalian|003F87|FFFFFF|57|63671
Yunnan Yukung|Yuxi|003F87|FDD100|57|30300
Qingdao West Coasts|Qingdao|003F87|FFFFFF|56|27000
Shenzhen Pengcity|Shenzhen|E30613|111111|56|45000
Henan SC|Zhengzhou|E30613|FDD100|56|29860
Liaoning Tiren|Shenyang|003F87|FFFFFF|55|40000
Qingdao Hainio|Qingdao|E30613|FFFFFF|54|50000
Wuhan Three Town|Wuhan|00A3E0|FFFFFF|53|56000
Tianjin Jinmen Tigers|Tianjin|003F87|E30613|51|36390`,
cn2:`Guangdong GZ-Powers|Canton|E30613|FDD100|52|30000
Shenzhen Junior|Shenzhen|00A3E0|FFFFFF|51|20000
Guangxi Hengcheng|Nanning|003F87|FFFFFF|50|60000
Nantong Zhiyung|Nantong|003F87|FFFFFF|50|30000
Yanbian Longdin|Yanji|E30613|FFFFFF|49|30000
Changchun Yatei|Changchun|E30613|FFFFFF|48|25000
Shaanxi Unio|Xi'an|E30613|FFFFFF|48|50000
Ningbo SC|Ningbo|003F87|FDD100|47|30000
Shijiazhuang Gongfo|Shijiazhuang|003F87|FFFFFF|47|30000
Dalian Kun City|Dalian|003F87|FFFFFF|46|30000
Suzhou Dongwo|Suzhou|E30613|FFFFFF|46|45000
Wuxi Wugou|Wuxi|00843D|FFFFFF|46|30000
Jiangxi Dingnan Unity|Dingnan|00843D|FFFFFF|45|15000
Meizhou Haka|Meizhou|E30613|FFFFFF|45|27000
Nanjing Citi|Nankin|003F87|FFFFFF|45|60000
Foshan Nanshe|Foshan|003F87|FDD100|43|20000`,
cn3:`Shandong Taishang B|Jinan|F28C00|FFFFFF|40|10000
Shanghai Ports B|Shanghai|E30613|FFFFFF|40|10000
Qingdao Red Lion|Qingdao|E30613|111111|39|10000
Shanxi Chongde Ronghei|Taiyuan|003F87|FFFFFF|38|20000
Nantong Haimen Kodion|Nantong|00843D|FFFFFF|38|10000
Beijing ITC|Pékin|00843D|111111|38|10000
Dalian Kewai|Dalian|003F87|FFFFFF|37|10000
Tai'an Tiankwang|Tai'an|111111|FCD405|37|10000
Shanghai Seconds|Shanghai|5B2D8E|FFFFFF|37|10000
Dalian Yingbao B|Dalian|003F87|FFFFFF|36|5000
Lanzhou Longyuan Athletik|Lanzhou|E30613|FFFFFF|36|20000
Changchun Xidou|Changchun|003F87|FCD405|36|10000
;
Chengdu Rongchen B|Chengdu|E30613|FFFFFF|39|10000
Wenzhou SC|Wenzhou|003F87|FFFFFF|39|15000
Shenzhen 2028 SC|Shenzhen|00A3E0|111111|38|10000
Hangzhou Linping Wuyua|Hangzhou|00843D|FFFFFF|38|10000
Hubei Istars|Wuhan|E30613|FFFFFF|38|10000
Guizhou Guiyang Athletik|Guiyang|003F87|FCD405|37|20000
Jiangxi Lushang|Ruichang|00843D|FFFFFF|37|10000
Xiamen Feilou|Xiamen|003F87|FFFFFF|37|10000
Ganzhou Ruishe|Ganzhou|E30613|FFFFFF|37|10000
Guangdong Mingto|Canton|E30613|FCD405|36|10000
Guangzhou Dandelions|Canton|FCD405|00843D|36|10000
Wuhan Three Town B|Wuhan|00A3E0|FFFFFF|35|5000`
};
/* V2.1.2 : nouveaux clubs anglais et allemands (en1 et de1 complètent les clubs déjà connus) */
const FOOT_EXT_RAW = {
en1:`Fulam FC|Londres|FFFFFF|111111|74|29600
Brentfort|Londres|E30613|FFFFFF|74|17250
AFC Bornemouth|Bournemouth|DA291C|111111|74|11300
Evertown|Liverpool|003399|FFFFFF|73|52800
West Ham Unitad|Londres|7A263A|1BB1E7|73|62500
Wolverhampton Wanderer|Wolverhampton|FDB913|231F20|72|31750
Sunderlande AFC|Sunderland|EB172B|FFFFFF|69|49000
Leeds Unitad|Leeds|FFFFFF|1D428A|70|37800
Burnlee FC|Burnley|6C1D45|99D6EA|68|21900`,
en2:`Ipswitch Town|Ipswich|0044A9|FFFFFF|68|30300
Leicester Citi|Leicester|003090|FDBE11|68|32260
Southamptown|Southampton|D71920|FFFFFF|67|32380
Sheffield Unitad|Sheffield|EE2737|111111|66|32050
Middlesboro|Middlesbrough|E30613|FFFFFF|66|34740
West Bromwitch Albion|West Bromwich|122F67|FFFFFF|65|26850
Norwitch Citi|Norwich|00A650|FFF200|65|27240
Coventri Citi|Coventry|5DB3E5|FFFFFF|65|32600
Hul Citi|Hull|F5971D|111111|63|25400
Watfort|Watford|FBEE23|ED2127|64|22200
Bristol Citi|Bristol|E21A23|FFFFFF|63|27000
Stok Citi|Stoke-on-Trent|E03A3E|FFFFFF|63|30000
Milwall|Londres|001D5E|FFFFFF|63|20140
Queens Park Rangeur|Londres|1D5BA4|FFFFFF|62|18400
Swanzea Citi|Swansea|FFFFFF|111111|62|21000
Derbi County|Derby|FFFFFF|111111|61|32950
Preston North Ende|Preston|FFFFFF|0B1F4B|61|23400
Blackburne Rovers|Blackburn|009EE0|FFFFFF|61|31370
Portsmouthe|Portsmouth|001489|FFFFFF|60|20900
Charleton Athletic|Londres|D4021D|FFFFFF|60|27100`,
de1:`VfL Wolfsbourg|Wolfsbourg|65B32E|FFFFFF|74|30000
TSG Hoffenheym|Sinsheim|1C63B7|FFFFFF|73|30150
Werdar Bremen|Brême|1D9053|FFFFFF|72|42100
Union Berlinn|Berlin|EB1923|FFFFFF|72|22000
AC Augsbourg|Augsbourg|BA3733|46714D|70|30660
1. AC Köln|Cologne|ED1C24|FFFFFF|70|50000
Hamburgo SV|Hambourg|0A3F86|FFFFFF|70|57000
AC St. Paulo|Hambourg|6B4E3D|FFFFFF|68|29546`,
de2:`AC Heydenheim|Heidenheim|E30613|003D7C|67|15000
VfL Bocum|Bochum|005CA9|FFFFFF|66|26000
Holstein Kiell|Kiel|003F8A|FFFFFF|65|15000
Schalk 04|Gelsenkirchen|004D9D|FFFFFF|66|62271
Herta Berlin|Berlin|005CA9|FFFFFF|65|74475
Hanovre 96|Hanovre|00843D|111111|64|49000
Fortune Düsseldorf|Düsseldorf|E30613|FFFFFF|64|54600
AC Kaiserslauter|Kaiserslautern|D5121E|FFFFFF|64|49327
SV Darmstad 98|Darmstadt|004E9F|FFFFFF|63|17650
SC Paderborne|Paderborn|0B2F6E|FFFFFF|62|15000
Karlsruher AC|Karlsruhe|0057A4|FFFFFF|62|34302
AC Magdebourg|Magdebourg|0A4595|FFFFFF|62|30098
SV Elversburg|Spiesen-Elversberg|111111|FFFFFF|61|10000
Eintrakt Braunschweig|Brunswick|FCD116|0050A0|61|23325
Spielvereinigung Fürt|Fürth|008A3E|FFFFFF|60|16626
Preußen Munster|Münster|00843D|111111|60|14300
Arminia Bielefelde|Bielefeld|005CA9|FFFFFF|61|26515
Dynamo Dresde|Dresde|FCD116|111111|61|32066`
};
/* capacité des stades des clubs déjà connus qui deviennent jouables */
const FOOT_EXT_CAP = {'Arsenol':60704,'Manchester Citi':53400,'Liverpoul':61276,'Chelsee':40343,'Newcastle Unitad':52305,'Aston Vila':42640,'Manchester Unitad':74310,'Tottenham Hotspurs':62850,'Nottingham Forrest':30404,'Brighton Albian':31876,'Crystal Palais':25486,
  'FC Beyern München':75024,'Borussia Dortmond':81365,'Bayer 05 Leverkusen':30210,'RS Leipzig':47069,'Eintrakt Frankfurt':58000,'VfL Stuttgart':60449,'SK Freiburg':34700,'Borussio Mönchengladbach':54042,'Bavière Nord':50000,'Rhénanie 04':33305};
/* Clubs étrangers non jouables (coupes internationales). Format : Nom|Ville|pays|c1|c2|note */
const FOOT_FOREIGN_RAW = `Arsenol|Londres|Angleterre|EF0107|FFFFFF|90
Manchester Citi|Manchester|Angleterre|6CABDD|1C2C5B|89
Liverpoul|Liverpool|Angleterre|C8102E|FFFFFF|89
Chelsee|Londres|Angleterre|034694|FFFFFF|86
Newcastle Unitad|Newcastle|Angleterre|241F20|FFFFFF|82
Aston Vila|Birmingham|Angleterre|670E36|95BFE5|82
Manchester Unitad|Manchester|Angleterre|DA291C|111111|81
Tottenham Hotspurs|Londres|Angleterre|FFFFFF|132257|81
Nottingham Forrest|Nottingham|Angleterre|DD0000|FFFFFF|79
Brighton Albian|Brighton|Angleterre|0057B8|FFFFFF|78
Crystal Palais|Londres|Angleterre|1B458F|C4122E|78
Internaziona Milano|Milan|Italie|0068A8|111111|87
SSC Napoly|Naples|Italie|12A0D7|FFFFFF|85
AC Milano|Milan|Italie|FB090B|111111|83
Juventas|Turin|Italie|111111|FFFFFF|83
Atalante|Bergame|Italie|1E71B8|111111|81
AS Romana|Rome|Italie|8E1F2F|F0BC42|80
SS Lazia|Rome|Italie|87D8F7|FFFFFF|78
Como 1908|Côme|Italie|003F87|FFFFFF|78
Bologna SC|Bologne|Italie|1A2F48|A21C26|78
ACF Fiorentino|Florence|Italie|482E92|FFFFFF|78
FC Beyern München|Munich|Allemagne|DC052D|FFFFFF|91
Borussia Dortmond|Dortmund|Allemagne|FDE100|111111|84
Bayer 05 Leverkusen|Leverkusen|Allemagne|E32221|111111|84
RS Leipzig|Leipzig|Allemagne|DD0741|FFFFFF|81
Eintrakt Frankfurt|Francfort|Allemagne|E1000F|111111|79
VfL Stuttgart|Stuttgart|Allemagne|E32219|FFFFFF|79
SK Freiburg|Fribourg-en-Brisgau|Allemagne|E30613|111111|77
Borussio Mönchengladbach|Mönchengladbach|Allemagne|111111|FFFFFF|76
Sportin CP|Lisbonne|Portugal|008057|FFFFFF|82
SL Benfika|Lisbonne|Portugal|E83030|FFFFFF|81
AC Porto|Porto|Portugal|003F87|FFFFFF|81
SK Braga|Braga|Portugal|E30613|FFFFFF|76
Vitórya Guimarães|Guimarães|Portugal|FFFFFF|111111|72
PSW Eindhoven|Eindhoven|Pays-Bas|E30613|FFFFFF|78
AFC Ajaks|Amsterdam|Pays-Bas|D2122E|FFFFFF|77
Feyenoorde|Rotterdam|Pays-Bas|E30613|FFFFFF|77
AS Alkmaar|Alkmaar|Pays-Bas|E30613|FFFFFF|74
Club Brügge|Bruges|Belgique|0070C0|111111|76
Royal Unio Saint-Gilloise|Bruxelles|Belgique|FDD100|003F87|74
KRS Genk|Genk|Belgique|003F87|FFFFFF|73
RSC Anderlechte|Bruxelles|Belgique|4E2582|FFFFFF|72
Galatasaraï|Istanbul|Turquie|A90432|FDB912|79
Fenerbahça|Istanbul|Turquie|00205B|FFED00|77
Beşiktaz|Istanbul|Turquie|111111|FFFFFF|74
Trabzonspur|Trabzon|Turquie|8B1538|00A3E0|71
Celtik|Glasgow|Écosse|018749|FFFFFF|74
Rangerz|Glasgow|Écosse|1B458F|FFFFFF|72
RS Salzburg|Salzbourg|Autriche|E30613|FFFFFF|73
SK Sturme Graz|Graz|Autriche|111111|FFFFFF|70
BSC Young Boy|Berne|Suisse|FDD100|111111|70
FC Basel 1894|Bâle|Suisse|E30613|003F87|70
SK Slavie Praha|Prague|Tchéquie|E30613|FFFFFF|72
AC Sparte Praha|Prague|Tchéquie|8B1538|FFFFFF|71
Olympiakos|Le Pirée|Grèce|E30613|FFFFFF|74
PAOC|Thessalonique|Grèce|111111|FFFFFF|72
AEC Athens|Athènes|Grèce|FDD100|111111|71
Panathinaikas|Athènes|Grèce|00843D|FFFFFF|70
Crvena Zvesda|Belgrade|Serbie|E30613|FFFFFF|72
Partizane|Belgrade|Serbie|111111|FFFFFF|68
Shaktar Donetsk|Donetsk|Ukraine|F28C00|111111|72
Dynamo Kyev|Kyiv|Ukraine|FFFFFF|003F87|70
AC København|Copenhague|Danemark|FFFFFF|003F87|71
Bodø/Glimp|Bodø|Norvège|FDD100|111111|74
Legio Warszawa|Varsovie|Pologne|00843D|FFFFFF|69
Malmö SF|Malmö|Suède|87CEEB|FFFFFF|69
Ferencváras|Budapest|Hongrie|00843D|FFFFFF|69
Karabağ|Bakou|Azerbaïdjan|111111|FFFFFF|68
FCSV|Bucarest|Roumanie|E30613|003F87|66
Makkabi Tel-Aviv|Tel-Aviv|Israël|FDD100|003F87|66
ŠK Slovann Bratislava|Bratislava|Slovaquie|87CEEB|FFFFFF|66
River Plata|Buenos Aires|Argentine|FFFFFF|E30613|76
Boca Junior|Buenos Aires|Argentine|003F87|FDD100|75
Racing Clube|Avellaneda|Argentine|75AADB|FFFFFF|73
Estudiante LP|La Plata|Argentine|E30613|FFFFFF|71
Vélez Sarsfeld|Buenos Aires|Argentine|FFFFFF|003F87|70
Independienta|Avellaneda|Argentine|E30613|FFFFFF|69
Taller Córdoba|Córdoba|Argentine|003F87|FFFFFF|69
Rosario Centrale|Rosario|Argentine|FDD100|003F87|69
Argentinos Junior|Buenos Aires|Argentine|E30613|FFFFFF|68
San Lorenso|Buenos Aires|Argentine|003F87|E30613|67
Newell's Old Boy|Rosario|Argentine|E30613|111111|66
Peñarole|Montevideo|Uruguay|FDD100|111111|68
Club Nacionale|Montevideo|Uruguay|FFFFFF|003F87|68
Atlético Nacionale|Medellín|Colombie|00843D|FFFFFF|68
Millonario|Bogota|Colombie|003F87|FFFFFF|66
Junior SC|Barranquilla|Colombie|E30613|FFFFFF|66
Deporte Tolima|Ibagué|Colombie|8B1538|FDD100|64
Colo-Kolo|Santiago|Chili|FFFFFF|111111|67
Universidat de Chile|Santiago|Chili|003F87|E30613|66
Olimpya|Asuncion|Paraguay|FFFFFF|111111|66
Cerro Porteña|Asuncion|Paraguay|003F87|E30613|66
Club Libertat|Asuncion|Paraguay|111111|FFFFFF|66
LDV Quito|Quito|Équateur|FFFFFF|003F87|70
Independiente del Vale|Sangolquí|Équateur|111111|003F87|70
Barcelone SC|Guayaquil|Équateur|FDD100|111111|66
Universitaria|Lima|Pérou|FDF5E6|8B1538|64
Alianzza Lima|Lima|Pérou|003F87|FFFFFF|63
Sporting Cristale|Lima|Pérou|87CEEB|FFFFFF|63
Club Bolivare|La Paz|Bolivie|87CEEB|FFFFFF|63
The Strongests|La Paz|Bolivie|FDD100|111111|61
Deportivo Táchyra|San Cristóbal|Venezuela|FDD100|111111|58
Club Amérika|Mexico|Mexique|FDD100|003F87|72
FC Monterrey|Monterrey|Mexique|003F87|FFFFFF|72
Tigre UANL|Monterrey|Mexique|FDD100|003F87|72
Cruz Azzul|Mexico|Mexique|003F87|FFFFFF|71
Deportiva Toluca|Toluca|Mexique|E30613|FFFFFF|71
Chivaz Guadalajara|Guadalajara|Mexique|E30613|FFFFFF|69
FC Pachuca|Pachuca|Mexique|003F87|FFFFFF|69
Puma UNAM|Mexico|Mexique|003F87|C9A227|67
LD Alajuelensa|Alajuela|Costa Rica|E30613|111111|61
Deportivo Saprisa|San José|Costa Rica|5B2D8E|FFFFFF|60
CD Olimpya|Tegucigalpa|Honduras|FFFFFF|003F87|57
Comunicacione|Guatemala|Guatemala|FFFFFF|111111|55
Al-Hilel|Riyad|Arabie saoudite|003F87|FFFFFF|79
Al-Nassar|Riyad|Arabie saoudite|FDD100|003F87|78
Al-Ittihed|Djeddah|Arabie saoudite|FDD100|111111|77
Al-Ahlee|Djeddah|Arabie saoudite|00843D|FFFFFF|77
Al-Qadisia|Khobar|Arabie saoudite|E30613|FDD100|72
Visel Kobe|Kobe|Japon|8B1538|111111|70
Sanfreche Hiroshima|Hiroshima|Japon|5B2D8E|FFFFFF|69
Kashima Antler|Kashima|Japon|8B1538|003F87|68
Kawasaki Frontal|Kawasaki|Japon|00A3E0|111111|68
Yokohama F. Marino|Yokohama|Japon|003F87|FFFFFF|68
Urawa Red Diamond|Saitama|Japon|E30613|111111|68
Ulsan HB|Ulsan|Corée du Sud|003F87|FDD100|68
Jeonbuk Hyundai Motors|Jeonju|Corée du Sud|00843D|111111|68
Pohang Steeler|Pohang|Corée du Sud|E30613|111111|66
Gwangju FC|Gwangju|Corée du Sud|FDD100|E30613|64
Al-Sad|Doha|Qatar|FFFFFF|111111|68
Al-Duhayl|Doha|Qatar|E30613|FFFFFF|66
Al-Ayn|Al-Aïn|Émirats arabes unis|5B2D8E|FFFFFF|67
Shabab Al-Ahly|Dubaï|Émirats arabes unis|E30613|111111|67
Perspolis|Téhéran|Iran|E30613|FFFFFF|64
Esteghlel|Téhéran|Iran|003F87|FFFFFF|64
Buriram Unitad|Buriram|Thaïlande|003F87|FDD100|63
Melbourne Citi|Melbourne|Australie|87CEEB|FFFFFF|62
Sydney SC|Sydney|Australie|87CEEB|003F87|61
Pakhtakorr|Tachkent|Ouzbékistan|00843D|FFFFFF|60
Al-Ahlay|Le Caire|Égypte|E30613|FFFFFF|72
Pyramid FC|Le Caire|Égypte|003F87|FFFFFF|68
Mamelodi Sundown|Pretoria|Afrique du Sud|FDD100|003F87|68
Widad Casablanca|Casablanca|Maroc|E30613|FFFFFF|66
Espérence de Tunis|Tunis|Tunisie|E30613|FDD100|66
Auckland Citi|Auckland|Nouvelle-Zélande|87CEEB|FFFFFF|50
Sporting Lisière|Braga|Portugal|C8102E|FFFFFF|70
Atlético Ribeira|Porto|Portugal|0B3D91|FFFFFF|66
Vitória Serra|Guimarães|Portugal|111111|FFFFFF|65
Union Dijle|Malines|Belgique|E30613|F4D03F|67
Royal Escaut|Anvers|Belgique|D71920|FFFFFF|68
Olympique Meuse|Liège|Belgique|C8102E|FFFFFF|66
Polder Utrecht|Utrecht|Pays-Bas|E30613|FFFFFF|68
Twente Vrij|Enschede|Pays-Bas|C8102E|FFFFFF|69
Amstel Zuid|Amsterdam|Pays-Bas|1F4E9C|FFFFFF|64
Donau Wien|Vienne|Autriche|5B2C83|FFFFFF|67
Alpen Salz|Salzbourg|Autriche|E30613|FFFFFF|70
Steiermark SC|Graz|Autriche|111111|FFFFFF|66
Limmat Zurich|Zurich|Suisse|1F4E9C|FFFFFF|66
Aar Berne|Berne|Suisse|F4D03F|111111|67
Øresund BK|Copenhague|Danemark|0B3D91|FFFFFF|67
Jylland FC|Herning|Danemark|111111|E30613|66
Fjord Bergen|Bergen|Norvège|E30613|FFFFFF|64
Nordlys IL|Bodø|Norvège|F4D03F|111111|68
Mälaren IF|Stockholm|Suède|1F7A3A|FFFFFF|64
Göta FF|Göteborg|Suède|0B3D91|FFFFFF|63
Vistule Varsovie|Varsovie|Pologne|1F7A3A|FFFFFF|66
Silésie KS|Katowice|Pologne|F4D03F|0B3D91|63
Vltava Prague|Prague|Tchéquie|C8102E|FFFFFF|67
Morava Brno|Brno|Tchéquie|E30613|FFFFFF|63
Sava Belgrade|Belgrade|Serbie|111111|FFFFFF|66
Dnipro Steppe|Dnipro|Ukraine|1F4E9C|FFFFFF|65
Égée FC|Thessalonique|Grèce|111111|FFFFFF|66
Bosphore SK|Istanbul|Turquie|F4D03F|0B3D91|68
Anatolie Spor|Ankara|Turquie|C8102E|F4D03F|64
Clyde Rovers|Glasgow|Écosse|0B3D91|FFFFFF|64
Granite City|Aberdeen|Écosse|E30613|FFFFFF|63
Bavière Nord|Nuremberg|Allemagne|8B1A1A|FFFFFF|67
Rhénanie 04|Mayence|Allemagne|E30613|FFFFFF|68
Lombardia Calcio|Bergame|Italie|0B3D91|111111|70
Adriatico FC|Bologne|Italie|8B1A1A|0B3D91|69`;
/* pays étrangers -> confédération */
const FOOT_FCONF = {'Angleterre':'eu','Italie':'eu','Allemagne':'eu','Portugal':'eu','Pays-Bas':'eu','Belgique':'eu','Turquie':'eu','Écosse':'eu','Autriche':'eu','Suisse':'eu','Tchéquie':'eu','Grèce':'eu','Serbie':'eu','Ukraine':'eu','Danemark':'eu','Norvège':'eu','Pologne':'eu','Suède':'eu','Hongrie':'eu','Azerbaïdjan':'eu','Roumanie':'eu','Israël':'eu','Slovaquie':'eu',
  'Argentine':'sa','Uruguay':'sa','Colombie':'sa','Chili':'sa','Paraguay':'sa','Équateur':'sa','Pérou':'sa','Bolivie':'sa','Venezuela':'sa',
  'Mexique':'na','Costa Rica':'na','Honduras':'na','Guatemala':'na',
  'Arabie saoudite':'as','Japon':'as','Corée du Sud':'as','Qatar':'as','Émirats arabes unis':'as','Iran':'as','Thaïlande':'as','Australie':'as','Ouzbékistan':'as',
  'Égypte':'af','Afrique du Sud':'af','Maroc':'af','Tunisie':'af','Nouvelle-Zélande':'oc'};
/* compétitions internationales (noms fictifs) */
const FOOT_COMPS = [
  {id:'eu1',conf:'eu',n:'Coupe d’Europe des champions',size:36},
  {id:'eu2',conf:'eu',n:'Coupe d’Europe',size:36},
  {id:'eu3',conf:'eu',n:'Coupe des confédérations d’Europe',size:36},
  {id:'sa1',conf:'sa',n:'Coupe des Libertés',size:32},
  {id:'na1',conf:'na',n:'Coupe des champions d’Amérique du Nord',size:16},
  {id:'as1',conf:'as',n:'Coupe d’Asie des clubs',size:24},
  {id:'w1', conf:'w', n:'Coupe intercontinentale',size:6}
];

/* ---------- Construction des tables ---------- */
const FOOT = {clubs:[], byLeague:{}, foreign:[]};
(function(){
  let id=0;
  FOOT_LEAGUES.forEach(L=>{ if(L.ext) return;
    const groups=FOOT_RAW[L.id].split('\n;\n');
    FOOT.byLeague[L.id]=[];
    groups.forEach((g,gi)=>g.trim().split('\n').forEach(line=>{
      const [n,city,c1,c2,r,cap]=line.split('|');
      const c={id:++id, n, city, nat:L.nat, lg:L.id, grp:gi, c1:'#'+c1, c2:'#'+c2, r:+r, cap:+cap||5000};
      FOOT.clubs.push(c); FOOT.byLeague[L.id].push(c);
    }));
  });
  FOOT_FOREIGN_RAW.split('\n').forEach(line=>{
    const [n,city,nat,c1,c2,r]=line.split('|');
    FOOT.foreign.push({id:++id, n, city, nat, conf:FOOT_FCONF[nat]||'eu', c1:'#'+c1, c2:'#'+c2, r:+r, foreign:true});
  });
  /* V2.1.2 : championnats anglais et allemands */
  FOOT_LEAGUES.filter(L=>L.ext).forEach(L=>{ const nat=L.nat; FOOT.byLeague[L.id]=[];
    if(L.lvl===1){ FOOT.foreign.filter(c=>c.nat===L.ext).forEach(c=>{ Object.assign(c,{nat, lg:L.id, grp:0, cap:FOOT_EXT_CAP[c.n]||30000}); delete c.foreign; delete c.conf; FOOT.clubs.push(c); FOOT.byLeague[L.id].push(c); });
      FOOT.foreign=FOOT.foreign.filter(c=>!c.lg); }
    FOOT_EXT_RAW[L.id].trim().split('\n').forEach(line=>{ const [n,city,c1,c2,r,cap]=line.split('|');
      const c={id:++id, n, city, nat, lg:L.id, grp:0, c1:'#'+c1, c2:'#'+c2, r:+r, cap:+cap||5000}; FOOT.clubs.push(c); FOOT.byLeague[L.id].push(c); }); });
})();
function footClub(id){ return FOOT.clubs.find(c=>c.id===id) || FOOT.foreign.find(c=>c.id===id); }

/* ---------- Blasons : dessin original, couleurs du club ---------- */
function footHash(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function footInitials(n){
  const skip=/^(de|du|del|da|do|la|le|les|des|of|the|y|e|et|and|\d+)$/i;
  const w=n.replace(/[^\p{L}\d\s'-]/gu,' ').split(/[\s-]+/).filter(x=>x&&!skip.test(x));
  return w.slice(0,3).map(x=>x[0]).join('').toUpperCase();
}
function footCrest(c, size){
  size=size||40; const h=footHash(c.n), shape=h%5, pat=(h>>3)%6, c1=c.c1, c2=c.c2;
  const light=x=>{ const v=parseInt(x.slice(1),16); return ((v>>16)*299+((v>>8)&255)*587+(v&255)*114)/1000>150; };
  const ink=light(c1)? (light(c2)? '#1a1a1a' : c2) : (light(c2)? c2 : '#ffffff');
  const paths=[
    'M20 2 L36 7 V20 C36 30 28 36 20 39 C12 36 4 30 4 20 V7 Z',
    'M5 3 H35 V22 C35 32 27 37 20 39 C13 37 5 32 5 22 Z',
    'M20 1 L37 10 L33 32 L20 39 L7 32 L3 10 Z',
    'M20 2 A18 18 0 1 1 19.99 2 Z',
    'M6 2 H34 L36 8 V24 C36 33 28 38 20 39 C12 38 4 33 4 24 V8 Z'
  ];
  const clip='cl'+h.toString(36);
  const pats=[
    '',
    `<rect x="0" y="0" width="20" height="40" fill="${c2}"/>`,
    `<rect x="0" y="16" width="40" height="9" fill="${c2}"/>`,
    `<rect x="9" y="0" width="5" height="40" fill="${c2}"/><rect x="20" y="0" width="5" height="40" fill="${c2}"/><rect x="31" y="0" width="5" height="40" fill="${c2}"/>`,
    `<path d="M0 0 L40 40 V28 L12 0 Z" fill="${c2}"/>`,
    `<path d="M0 22 L20 12 L40 22 V40 H0 Z" fill="${c2}"/>`
  ];
  const ini=footInitials(c.n);
  return `<svg class="crest" viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true"><defs><clipPath id="${clip}"><path d="${paths[shape]}"/></clipPath></defs>`+
    `<g clip-path="url(#${clip})"><rect width="40" height="40" fill="${c1}"/>${pats[pat]}</g>`+
    `<path d="${paths[shape]}" fill="none" stroke="${light(c1)&&light(c2)?'#999':c2}" stroke-width="2"/>`+
    (pat===2? '' : `<circle cx="20" cy="20" r="9.5" fill="${c1}" stroke="${c2}" stroke-width="1.5"/>`)+
    `<text x="20" y="${pat===2?23.5:24}" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="${ini.length>2?8:ini.length>1?10:12}" fill="${pat===2? (light(c2)?'#1a1a1a':'#fff') : ink}">${ini}</text></svg>`;
}

