/* ============================================================
   FOOTBALL : joueurs connus des grands clubs (noms modifiés de quelques lettres)
   Effectifs de référence : saison 2025-2026 (transferts de l'été 2026 non inclus).
   Format : Nom|poste|âge en 2026|note|nationalité. Le reste de chaque effectif est créé par le jeu.
   ============================================================ */
const FOOT_REAL = {
'Paris Saint-Germont':`Lucas Chevallier|G|24|84|France
Matveï Safanov|G|27|80|Russie
Achraf Hakimy|DL|27|88|Maroc
Nuno Mendez|DL|24|87|Portugal
Lucas Hernandes|DL|30|82|France
Marquinhas|DC|32|85|Brésil
Willian Pachu|DC|24|85|Équateur
Ilya Zabarny|DC|23|82|Ukraine
Lucas Beraldi|DC|22|78|Brésil
João Nevas|MD|21|87|Portugal
Vitinho|MC|26|89|Portugal
Fabián Ruís|MC|30|84|Espagne
Warren Zaïre-Emeri|MC|20|82|France
Lee Kang-un|MO|25|80|Corée du Sud
Senny Mayolu|MO|20|75|France
Khvicha Kvaratskhelya|AIL|25|89|Géorgie
Désiré Doé|AIL|21|86|France
Bradley Barcolla|AIL|23|84|France
Ousmane Dembéla|BU|29|90|France
Gonçalo Ramas|BU|25|80|Portugal`,
'Olympico de Marseille':`Gerónimo Rully|G|34|82|Argentine
Leonardo Balerdy|DC|27|80|Argentine
Nayef Aguert|DC|30|80|Maroc
Facundo Medino|DC|27|79|Argentine
CJ Egan-Rilley|DC|23|74|Angleterre
Emerson Palmiery|DL|32|76|Italie
Timothy Wea|DL|26|77|États-Unis
Geoffrey Kondogbya|MD|33|77|Centrafrique
Pierre-Emile Højberg|MC|30|82|Danemark
Angel Gomez|MC|25|78|Angleterre
Arthur Vermeren|MC|21|77|Belgique
Hamed Traorè|MO|26|77|Côte d'Ivoire
Mason Greenwod|AIL|24|84|Angleterre
Igor Paixãu|AIL|26|80|Brésil
Amine Gouri|BU|26|81|Algérie
Pierre-Emerick Aubameyeng|BU|37|79|Gabon`,
'AC Monaco':`Philipp Köhm|G|28|78|Suisse
Thilo Kehrar|DC|29|78|Allemagne
Mohammed Salizu|DC|27|78|Ghana
Eric Diar|DC|32|77|Angleterre
Vandersen|DL|25|80|Brésil
Caio Henrico|DL|29|78|Brésil
Denis Zakarya|MD|29|81|Suisse
Lamine Camarra|MC|22|79|Sénégal
Paul Pogbat|MC|33|76|France
Aleksandr Golovine|MO|30|81|Russie
Maghnes Akliouch|MO|24|82|France
Takumi Minamono|MO|31|79|Japon
Ansu Fatti|AIL|23|78|Espagne
Folarin Balogan|BU|25|80|États-Unis
Mika Bieret|BU|23|78|Danemark`,
'LOSK Lille':`Berke Özar|G|26|78|Turquie
Aïssa Mandy|DC|34|75|Algérie
Nathan Ngoi|DC|22|76|Belgique
Tiago Santas|DL|23|77|Portugal
Romain Peraud|DL|28|76|France
Thomas Meunié|DL|34|75|Belgique
Benjamin Andrée|MD|35|78|France
Ayyoub Bouadi|MD|18|77|France
Hákon Arnar Haraldson|MO|23|80|Islande
Matías Fernandez-Pardo|AIL|21|77|Belgique
Osame Sahraouy|AIL|24|76|Norvège
Felix Correa|AIL|25|76|Portugal
Hamza Igamano|BU|23|77|Maroc
Olivier Girod|BU|39|76|France`,
'Olympico Lyonnais':`Dominik Grief|G|29|78|Slovaquie
Moussa Niakhatè|DC|30|79|Sénégal
Clinton Matta|DC|33|76|Angola
Nicolás Tagliafigo|DL|33|78|Argentine
Ainsley Maitland-Nilles|DL|28|75|Angleterre
Tanner Tesmann|MD|24|77|États-Unis
Orel Mangalla|MD|28|77|Belgique
Corentin Tolissa|MC|32|79|France
Pavel Šulk|MO|25|79|Tchéquie
Adam Karabek|MO|22|75|Tchéquie
Malick Fofanna|AIL|21|80|Belgique
Ernest Nuameh|AIL|22|77|Ghana
Afonso Moreyra|AIL|21|74|Portugal
Martin Satriani|BU|25|74|Uruguay`,
'RS Lens':`Robin Riser|G|21|77|France
Jonathan Gradix|DC|33|76|France
Malang Sar|DC|27|76|France
Samson Baido|DC|22|74|Autriche
Ruben Aguillar|DL|33|74|France
Adrien Thomason|MC|32|79|France
Mamadou Sangarè|MC|23|77|Mali
Florian Thovin|AIL|33|80|France
Abdallah Simma|AIL|24|77|Sénégal
Rayan Fofani|AIL|19|72|France
Wesley Saïde|BU|31|77|France
Odsonne Édouart|BU|28|77|France`,
'RS Strasbourg Alsace':`Mike Pender|G|20|76|Belgique
Andrew Omobamidelle|DC|24|76|Irlande
Guéla Doé|DL|23|77|Côte d'Ivoire
Ben Chillwell|DL|29|76|Angleterre
Valentín Barko|MC|22|78|Argentine
Félix Lemaréchall|MC|22|76|France
Julio Encisso|MO|22|77|Paraguay
Diego Moreyra|AIL|21|77|Belgique
Sebastian Nanasy|AIL|24|76|Suède
Martial Godot|AIL|22|74|Angleterre
Joaquín Panicheli|BU|23|78|Argentine`,
'OGS Nice':`Yehvann Diouff|G|26|77|Sénégal
Dantè|DC|42|70|Brésil
Antoine Mendi|DC|22|74|France
Jonathan Klauss|DL|33|76|France
Melvin Barde|DL|25|75|France
Charles Vanhoute|MD|27|75|Belgique
Morgan Sansone|MC|31|74|France
Tom Louchez|MC|22|73|France
Tanguy Ndombelle|MC|29|74|France
Sofiane Dyop|MO|26|78|Maroc
Mohamed-Ali Cha|AIL|22|74|France
Terem Moffy|BU|26|77|Nigeria`,
'Stade Rennois':`Brice Sambo|G|32|81|France
Anthony Rouaut|DC|24|76|France
Abdelhamid Aït Boudlel|DC|20|74|Maroc
Przemysław Frankowsky|DL|31|76|Pologne
Quentin Merlain|DL|24|76|France
Mahdi Camarra|MD|28|76|France
Seko Fofanah|MC|31|78|Côte d'Ivoire
Valentin Ronjier|MC|31|77|France
Ludovic Blass|MO|28|77|France
Mousa Al-Tamary|AIL|28|76|Jordanie
Esteban Lepaule|BU|26|78|France
Breel Embollo|BU|29|78|Suisse`,
'Toulouse AC':`Guillaume Reste|G|21|78|France
Charlie Creswell|DC|23|76|Angleterre
Mark McKenzy|DC|27|75|États-Unis
Rasmus Nicolaïsen|DC|29|74|Danemark
Warren Kamanzy|DL|25|73|Norvège
Djibril Sidibè|DL|33|72|France
Cristian Cásseres|MC|26|76|Venezuela
Santiago Hidalga|MO|21|74|Argentine
Aron Dønum|AIL|28|75|Norvège
Yann Gboha|AIL|25|76|France
Frank Magry|BU|26|75|Cameroun`,
'Stade Brestais 29':`Grégoire Coudart|G|27|74|France
Brendan Chardonet|DC|31|75|France
Bradley Loko|DL|24|75|France
Kenny Lalla|DL|34|73|France
Hugo Magneti|MC|27|75|France
Pierre Lees-Mellou|MC|33|76|France
Kamory Doumbya|MO|23|75|Mali
Romain Del Castilla|AIL|30|77|France
Mama Baldè|AIL|30|74|Guinée-Bissau
Ludovic Ajorc|BU|32|75|France`,
'Paris AC':`Kevin Trap|G|36|78|Allemagne
Maxime Lopes|MC|28|77|France
Vincent Marcheti|MC|28|73|France
Ilan Kebal|MO|28|77|Algérie
Moses Simone|AIL|31|78|Nigeria
Jean-Philippe Kraso|BU|29|75|Côte d'Ivoire
Willem Geubels|BU|25|74|France
Pierre-Yves Hamelle|BU|32|71|France`,
'AC Lorient':`Yvon Mvoggo|G|32|76|Suisse
Bamo Meïtè|DC|24|73|France
Laurent Abergell|MD|33|75|France
Arthur Avome|MC|22|73|Cameroun
Tosin Aiyegon|AIL|28|75|Bénin
Pablo Pagys|AIL|23|74|France
Théo Le Briz|AIL|24|73|France
Mohamed Bamby|BU|24|74|Côte d'Ivoire`,
'Le Havre FC':`Arthur Desmass|G|32|74|France
Gautier Loris|DC|30|72|France
Abdoulaye Tourè|MC|32|74|Guinée
Rassoul Ndiay|MC|24|73|France
Yassine Keshta|MO|24|73|Maroc
Issa Soumarè|AIL|26|73|Sénégal`,
'AS Auxerre':`Donovan Léone|G|33|75|France
Juball|DC|32|73|Brésil
Gideon Mensa|DL|27|73|Ghana
Elisha Owuso|MD|28|74|Ghana
Kevin Danoix|MC|21|72|France
Gauthier Heim|MO|29|75|France
Lassine Sinayoka|BU|26|76|Mali`,
'Angers SCA':`Hervé Koffy|G|29|74|Burkina Faso
Jordan Lefore|DC|32|72|France
Haris Belkeba|MD|32|72|Algérie
Himad Abdelly|MC|26|76|Algérie
Prosper Petter|AIL|21|72|Nigeria
Sidiki Chérrif|BU|19|74|France`,
'Reale Madrid':`Thibaut Courtoix|G|34|89|Belgique
Andriy Lunyn|G|27|78|Ukraine
Trent Alexander-Arnolt|DL|27|85|Angleterre
Dani Carvajel|DL|34|82|Espagne
Álvaro Careras|DL|23|82|Espagne
Ferland Mendi|DL|31|79|France
Éder Militãu|DC|28|84|Brésil
Antonio Rüdinger|DC|33|84|Allemagne
Dean Huisjen|DC|21|84|Espagne
Raúl Asensio|DC|23|79|Espagne
Aurélien Tchouaméné|MD|26|86|France
Federico Valverdi|MC|28|88|Uruguay
Eduardo Camavingha|MC|23|83|France
Dani Ceballas|MC|29|79|Espagne
Jude Bellinghem|MO|23|89|Angleterre
Arda Gülar|MO|21|84|Turquie
Brahim Díez|MO|26|81|Maroc
Vinícios Júnior|AIL|26|90|Brésil
Rodrigho|AIL|25|85|Brésil
Franco Mastantono|AIL|19|78|Argentine
Kylian Mbapé|BU|27|92|France
Gonzalo Garsía|BU|22|76|Espagne`,
'CF Barcelona':`Joan Garsía|G|25|86|Espagne
Marc-André ter Stegan|G|34|84|Allemagne
Jules Koundè|DL|27|86|France
Alejandro Balda|DL|22|83|Espagne
Pau Cubarsy|DC|19|85|Espagne
Ronald Arajo|DC|27|83|Uruguay
Eric Garçia|DC|25|80|Espagne
Andreas Christensan|DC|30|80|Danemark
Marc Casadu|MD|22|79|Espagne
Frenkie de Jongh|MC|29|86|Pays-Bas
Pedry|MC|23|90|Espagne
Gavy|MC|21|82|Espagne
Dani Olmos|MO|28|85|Espagne
Fermín Lópes|MO|23|83|Espagne
Lamine Yamel|AIL|19|91|Espagne
Raphynha|AIL|29|89|Brésil
Marcus Rashfort|AIL|28|81|Angleterre
Robert Lewandowsky|BU|37|85|Pologne
Ferran Torras|BU|26|81|Espagne`,
'Atlética Madrid':`Jan Oblac|G|33|87|Slovénie
José María Ginénez|DC|31|80|Uruguay
Robin Le Normant|DC|29|81|Espagne
Dávid Hanko|DC|28|82|Slovaquie
Clément Lenglat|DC|31|77|France
Marcos Llorante|DL|31|82|Espagne
Nahuel Molino|DL|28|79|Argentine
Matteo Ruggieri|DL|23|77|Italie
Johnny Cardozo|MD|24|79|États-Unis
Koque|MC|34|78|Espagne
Pablo Barrias|MC|23|82|Espagne
Conor Galagher|MC|26|81|Angleterre
Álex Baina|MO|25|83|Espagne
Thiago Almeda|MO|25|80|Argentine
Giuliano Simeoni|AIL|23|80|Argentine
Nico Gonzales|AIL|28|80|Argentine
Antoine Griezman|BU|35|83|France
Julián Álvares|BU|26|87|Argentine
Alexander Sørlot|BU|30|81|Norvège`,
'Villarreal FC':`Luiz Junyor|G|25|79|Brésil
Juan Foith|DC|28|79|Argentine
Renato Veyga|DC|23|79|Portugal
Rafa Marim|DC|24|78|Espagne
Sergi Cardonna|DL|26|77|Espagne
Thomas Partei|MD|33|80|Ghana
Pape Gueie|MD|27|78|Sénégal
Santi Comesana|MC|29|78|Espagne
Dani Pareja|MC|37|78|Espagne
Alberto Molero|MO|22|79|Espagne
Nicolas Pépè|AIL|31|79|Côte d'Ivoire
Tajon Buchanen|AIL|27|77|Canada
Georges Mikaoutadze|BU|25|80|Géorgie
Ayoze Péres|BU|33|80|Espagne
Gerard Morena|BU|34|79|Espagne`,
'Athletix Bilbao':`Unai Simone|G|29|84|Espagne
Dani Vivien|DC|26|81|Espagne
Aitor Paredas|DC|26|78|Espagne
Yeray Álvares|DC|31|77|Espagne
Jesús Arezo|DL|27|78|Espagne
Yuri Berchice|DL|36|74|Espagne
Mikel Jauregisar|MD|23|79|Espagne
Beñat Prado|MC|25|77|Espagne
Oihan Sanset|MO|26|82|Espagne
Nico Willians|AIL|24|85|Espagne
Iñaki Willians|AIL|32|80|Ghana
Álex Berenger|AIL|31|77|Espagne
Gorka Guruzetta|BU|30|78|Espagne
Maroan Sanadi|BU|25|75|Maroc`,
'Reale Betos':`Pau Lópes|G|31|79|Espagne
Álvaro Valés|G|29|78|Espagne
Natán|DC|25|78|Brésil
Diego Llorante|DC|32|77|Espagne
Marc Bartro|DC|35|74|Espagne
Héctor Bellerim|DL|31|76|Espagne
Ricardo Rodrigues|DL|33|76|Suisse
Sofyan Amrabet|MD|29|79|Maroc
Marc Rocca|MD|29|78|Espagne
Pablo Fornels|MC|30|79|Espagne
Isko|MO|34|82|Espagne
Giovani Lo Celsio|MO|30|80|Argentine
Antonny|AIL|26|81|Brésil
Abde Ezzalzouly|AIL|24|80|Maroc
Cucho Hernandes|BU|27|80|Colombie
Chimy Ávilla|BU|32|75|Argentine`,
'Reale Sociedat':`Álex Remira|G|31|82|Espagne
Igor Zubeldya|DC|29|79|Espagne
Aritz Elustonda|DC|32|75|Espagne
Jon Aramburo|DL|23|77|Venezuela
Sergio Gomes|DL|25|78|Espagne
Jon Gorrotxategui|MD|23|75|Espagne
Brais Mendes|MC|29|80|Espagne
Carlos Solar|MC|29|78|Espagne
Pablo Marim|MC|22|76|Espagne
Takefusa Kubu|AIL|25|82|Japon
Ander Barrenetxa|AIL|24|79|Espagne
Gonçalo Guedez|AIL|29|78|Portugal
Mikel Oyarsabal|BU|29|83|Espagne
Orri Óskarson|BU|22|77|Islande`,
'Celto Vigo':`Iván Vilar|G|29|76|Espagne
Carl Starfeldt|DC|31|76|Suède
Óscar Minguesa|DL|27|78|Espagne
Marcos Alonzo|DL|35|75|Espagne
Fran Beltrám|MC|27|77|Espagne
Ilaix Moribo|MC|23|76|Guinée
Williot Swedburg|AIL|22|76|Suède
Hugo Álvares|AIL|22|75|Espagne
Pablo Durám|AIL|25|75|Espagne
Iago Aspaz|BU|38|78|Espagne
Borja Iglesyas|BU|33|77|Espagne
Ferran Jutgal|BU|27|76|Espagne`,
'Sevilla AC':`Odysseas Vlachodimas|G|32|77|Grèce
Ørjan Nylund|G|35|75|Norvège
Kike Salaz|DC|24|75|Espagne
Tanguy Nianzu|DC|24|75|France
José Ángel Carmonna|DL|24|76|Espagne
Nemanja Gudel|MD|34|76|Serbie
Batista Mendi|MD|26|74|France
Djibril Sowe|MC|29|76|Suisse
Rubén Vargaz|AIL|28|78|Suisse
Chidera Ejouke|AIL|28|77|Nigeria
Akor Adems|BU|26|76|Nigeria
Isaac Romera|BU|26|75|Espagne
Alexis Sanches|BU|37|74|Chili`,
'Valencia FC':`Julen Agirrezabal|G|25|77|Espagne
Stole Dimitrievsky|G|32|77|Macédoine du Nord
César Tárraga|DC|24|77|Espagne
Mouctar Diakhabi|DC|29|76|Guinée
José Gayò|DL|31|77|Espagne
Dimitri Foulquié|DL|33|73|France
Pepellu|MD|27|77|Espagne
Javi Guera|MC|23|79|Espagne
André Almeyda|MC|26|76|Portugal
Diego Lópes|AIL|24|77|Espagne
Luis Rioha|AIL|32|75|Espagne
Hugo Durro|BU|26|76|Espagne
Dani Rava|BU|30|74|Espagne`,
'Osasona':`Sergio Herera|G|32|78|Espagne
Alejandro Catenna|DC|31|77|Espagne
Jorge Herrandu|DC|25|74|Espagne
Juan Kruz|DL|26|74|Espagne
Lucas Toró|MD|31|76|Espagne
Jon Moncayolla|MC|28|77|Espagne
Aimar Oros|MO|24|77|Espagne
Moi Gomes|MO|32|75|Espagne
Rubén Garsía|AIL|32|76|Espagne
Víctor Muños|AIL|23|76|Espagne
Ante Budimyr|BU|35|78|Croatie`,
'Rayo Vallecaño':`Augusto Batala|G|29|77|Argentine
Florian Lejeunne|DC|35|75|France
Andrei Rațio|DL|28|78|Roumanie
Pep Chavaría|DL|28|76|Espagne
Óscar Valentim|MD|32|76|Espagne
Pathé Cisse|MD|32|75|Sénégal
Unai Lópes|MC|30|77|Espagne
Isi Palazom|MO|31|78|Espagne
Jorge de Frutas|AIL|29|78|Espagne
Álvaro Garsia|AIL|33|76|Espagne
Sergio Camelo|BU|25|75|Espagne
Alemãu|BU|28|74|Brésil`,
'RCD Espanyal':`Marko Dmitrovič|G|34|77|Serbie
Leandro Cabrero|DC|34|75|Uruguay
Fernando Calera|DC|30|74|Espagne
Omar El Hilaly|DL|23|76|Maroc
Carlos Romera|DL|24|75|Espagne
Pol Losano|MD|26|74|Espagne
Edu Expósita|MC|30|76|Espagne
Javi Puadu|AIL|28|77|Espagne
Tyrhys Dolam|AIL|24|75|Angleterre
Roberto Fernandes|BU|24|75|Espagne
Pere Mila|BU|33|74|Espagne`,
'Getafe FC':`David Sorya|G|33|79|Espagne
Djené Dakonan|DC|34|76|Togo
Domingos Duarta|DC|31|75|Portugal
Juan Iglesyas|DL|28|74|Espagne
Mauro Arambary|MD|30|78|Uruguay
Luis Mila|MC|31|77|Espagne
Borja Mayorel|BU|29|76|Espagne
Juanmy|BU|33|73|Espagne`,
'Deportiva Alavés':`Antonio Siverra|G|29|77|Espagne
Facundo Garsés|DC|26|75|Argentine
Víctor Parado|DL|24|73|Espagne
Antonio Blanko|MD|25|76|Espagne
Carles Aleña|MC|28|75|Espagne
Jon Guridy|MC|31|74|Espagne
Carlos Visente|AIL|27|76|Espagne
Toni Martines|BU|28|75|Espagne
Lucas Boyè|BU|30|75|Argentine`,
'Elche FC':`Matías Dituru|G|39|74|Argentine
Pedro Bigaz|DC|36|72|Espagne
Marc Aguadu|MD|26|74|Espagne
Aleix Febaz|MC|30|74|Espagne
Germán Valero|AIL|23|74|Espagne
André Silvo|BU|30|76|Portugal
Rafa Myr|BU|29|75|Espagne`,
'Deportiva La Coruña':`Germán Pareño|G|33|72|Espagne
Yeremay Hernandes|AIL|23|77|Espagne
David Mela|AIL|20|74|Espagne
Lucas Péres|BU|37|72|Espagne`,
'Levanto UD':`Mathew Ryen|G|34|75|Australie
Unai Elgesabal|DC|33|72|Espagne
Pablo Martines|MC|28|74|Espagne
Carlos Álvares|AIL|23|76|Espagne
Roger Brugè|AIL|30|73|Espagne
Iván Romera|BU|25|74|Espagne`,
'Rasing Santander':`Peio Canalés|MO|21|73|Espagne
Andrés Martím|AIL|27|74|Espagne`,
'Arsenol':`David Rayo|G|30|87|Espagne
William Salyba|DC|25|88|France
Gabriel Magalhãe|DC|28|87|Brésil
Piero Hincapyé|DC|24|82|Équateur
Jurriën Tymber|DL|25|84|Pays-Bas
Riccardo Calafiory|DL|24|82|Italie
Ben Whyte|DL|28|82|Angleterre
Declan Ryce|MD|27|88|Angleterre
Martín Zubimendy|MD|27|86|Espagne
Mikel Merina|MC|30|82|Espagne
Martin Ødegard|MO|27|87|Norvège
Eberechi Eza|MO|28|84|Angleterre
Bukayo Sakka|AIL|24|88|Angleterre
Gabriel Martinely|AIL|25|82|Brésil
Leandro Trosard|AIL|31|81|Belgique
Noni Madueka|AIL|24|81|Angleterre
Viktor Gyökers|BU|28|86|Suède
Kai Haverts|BU|27|83|Allemagne`,
'Manchester Citi':`Gianluigi Donnaruma|G|27|87|Italie
Rúben Diaz|DC|29|87|Portugal
Joško Gvardiel|DC|24|86|Croatie
Nathan Akè|DC|31|81|Pays-Bas
Rico Lewys|DL|21|80|Angleterre
Matheus Nunez|DL|27|80|Portugal
Nico O'Reily|DL|21|78|Angleterre
Rodry|MD|30|89|Espagne
Tijjani Reinders|MC|27|84|Pays-Bas
Bernardo Sylva|MC|31|85|Portugal
Phil Fodden|MO|26|86|Angleterre
Rayan Cherky|MO|22|84|France
Jérémy Dokou|AIL|24|84|Belgique
Savinha|AIL|22|82|Brésil
Erling Haland|BU|25|91|Norvège
Omar Marmouch|BU|27|82|Égypte`,
'Liverpoul':`Alison|G|33|88|Brésil
Virgil van Dyk|DC|34|88|Pays-Bas
Ibrahima Konatè|DC|27|85|France
Jeremie Frimpang|DL|25|83|Pays-Bas
Milos Kerkes|DL|22|82|Hongrie
Andy Robertsen|DL|32|82|Écosse
Conor Bradly|DL|23|79|Irlande du Nord
Ryan Gravenberg|MD|24|86|Pays-Bas
Alexis Mac Alister|MC|27|87|Argentine
Dominik Szoboszlay|MC|25|86|Hongrie
Curtis Jonas|MC|25|80|Angleterre
Florian Wirts|MO|23|88|Allemagne
Mohamed Salha|AIL|34|88|Égypte
Cody Gackpo|AIL|27|84|Pays-Bas
Federico Chiesi|AIL|28|78|Italie
Alexander Isaak|BU|26|88|Suède
Hugo Ekitikè|BU|24|85|France`,
'Chelsee':`Robert Sanches|G|28|81|Espagne
Levi Colwil|DC|23|83|Angleterre
Wesley Fofanna|DC|25|81|France
Trevoh Chaloba|DC|26|80|Angleterre
Reece Jamess|DL|26|84|Angleterre
Marc Cucurela|DL|27|84|Espagne
Malo Gusta|DL|23|80|France
Moisés Caisedo|MD|24|88|Équateur
Enzo Fernandes|MC|25|86|Argentine
Cole Palmar|MO|24|88|Angleterre
Pedro Netto|AIL|26|82|Portugal
Estêvan|AIL|19|82|Brésil
Alejandro Garnatcho|AIL|22|80|Argentine
Jamie Gitens|AIL|21|79|Angleterre
João Pedra|BU|24|83|Brésil
Liam Delapp|BU|23|79|Angleterre`,
'Newcastle Unitad':`Nick Pape|G|34|81|Angleterre
Sven Botmann|DC|26|81|Pays-Bas
Malick Thiau|DC|24|81|Allemagne
Fabian Schärr|DC|34|79|Suisse
Dan Burne|DC|34|78|Angleterre
Tino Livramenta|DL|23|81|Angleterre
Kieran Tripier|DL|35|78|Angleterre
Bruno Guimarãe|MC|28|87|Brésil
Sandro Tonaly|MC|26|85|Italie
Joelington|MC|29|82|Brésil
Anthony Gordan|AIL|25|84|Angleterre
Harvey Barns|AIL|28|79|Angleterre
Jacob Murfy|AIL|31|79|Angleterre
Nick Woltermade|BU|24|82|Allemagne
Yoane Wisa|BU|29|81|RD Congo`,
'Aston Vila':`Emiliano Martines|G|33|86|Argentine
Ezri Konza|DC|28|82|Angleterre
Pau Torras|DC|29|82|Espagne
Lucas Dignes|DL|32|78|France
Matty Kash|DL|28|79|Pologne
Boubacar Kamarra|MD|26|83|France
Amadou Onanna|MD|24|82|Belgique
Youri Tielmans|MC|29|83|Belgique
John McGin|MC|31|81|Écosse
Morgan Rodgers|MO|23|84|Angleterre
Emi Buendya|MO|29|78|Argentine
Jadon Sanchou|AIL|26|78|Angleterre
Ollie Watkin|BU|30|84|Angleterre`,
'Manchester Unitad':`Senne Lamens|G|24|79|Belgique
Lisandro Martines|DC|28|83|Argentine
Matthijs de Light|DC|26|82|Pays-Bas
Leny Yorro|DC|20|80|France
Diogo Dalott|DL|27|80|Portugal
Luke Shau|DL|30|78|Angleterre
Casemyro|MD|34|79|Brésil
Kobbie Mainou|MC|21|80|Angleterre
Bruno Fernandez|MO|31|86|Portugal
Matheus Kunha|MO|27|84|Brésil
Mason Mounts|MO|27|78|Angleterre
Bryan Mbeumu|AIL|26|84|Cameroun
Amad Dialo|AIL|23|81|Côte d'Ivoire
Benjamin Šesko|BU|23|82|Slovénie`,
'Tottenham Hotspurs':`Guglielmo Vicaria|G|29|82|Italie
Cristian Romera|DC|28|85|Argentine
Micky van der Ven|DC|25|84|Pays-Bas
Pedro Poro|DL|26|82|Espagne
Destiny Udoggie|DL|23|80|Italie
Djed Spense|DL|25|78|Angleterre
João Palinha|MD|30|82|Portugal
Rodrigo Betancur|MC|29|80|Uruguay
Pape Matar Sar|MC|23|80|Sénégal
James Madison|MO|29|82|Angleterre
Xavi Simmons|MO|23|84|Pays-Bas
Mohammed Kudos|AIL|25|83|Ghana
Dejan Kulusevsky|AIL|26|82|Suède
Dominic Solanka|BU|28|80|Angleterre
Richarlisson|BU|29|78|Brésil`,
'Nottingham Forrest':`Matz Sells|G|34|80|Belgique
Murilo|DC|23|81|Brésil
Nikola Milenkovič|DC|28|82|Serbie
Neco Willians|DL|25|79|Pays de Galles
Ibrahim Sangarè|MD|28|79|Côte d'Ivoire
Elliot Andersen|MC|23|83|Angleterre
Morgan Gibbs-Whyte|MO|26|83|Angleterre
Callum Hudson-Odoï|AIL|25|79|Angleterre
Chris Woods|BU|34|80|Nouvelle-Zélande`,
'Brighton Albian':`Bart Verbrugen|G|23|81|Pays-Bas
Jan Paul van Heke|DC|25|80|Pays-Bas
Lewis Dunck|DC|34|78|Angleterre
Carlos Baleva|MD|22|82|Cameroun
Jack Hinshelwod|MC|21|77|Angleterre
Georginio Rutar|MO|24|79|France
Kaoru Mitona|AIL|29|81|Japon
Yankuba Minte|AIL|21|79|Gambie
Danny Welbek|BU|35|77|Angleterre`,
'Crystal Palais':`Dean Hendersen|G|29|81|Angleterre
Maxence Lacroy|DC|26|81|France
Daniel Muños|DL|30|81|Colombie
Tyrick Mitchel|DL|26|78|Angleterre
Jefferson Lerna|MD|31|78|Colombie
Adam Warton|MC|22|82|Angleterre
Ismaïla Sar|AIL|28|81|Sénégal
Yeremy Pina|AIL|23|79|Espagne
Jean-Philippe Mateto|BU|29|82|France`,
'Internaziona Milano':`Yann Sommar|G|37|83|Suisse
Alessandro Bastone|DC|27|87|Italie
Stefan de Vrei|DC|34|80|Pays-Bas
Yann Biseck|DC|25|81|Allemagne
Francesco Acerby|DC|38|78|Italie
Denzel Dumfrees|DL|30|83|Pays-Bas
Federico Dimarko|DL|28|85|Italie
Hakan Çalhanoglou|MD|32|85|Turquie
Nicolò Barela|MC|29|86|Italie
Henrikh Mkhitarian|MC|37|80|Arménie
Davide Fratesi|MC|26|80|Italie
Piotr Zielinsky|MC|32|80|Pologne
Andy Diouff|MC|23|78|France
Lautaro Martines|BU|28|88|Argentine
Marcus Thuran|BU|28|85|France
Ange-Yoan Bony|BU|22|78|France
Pio Esposita|BU|21|77|Italie`,
'SSC Napoly':`Vanja Milinkovič-Savič|G|29|81|Serbie
Alex Merett|G|29|80|Italie
Amir Rahmani|DC|32|82|Kosovo
Alessandro Buongiorna|DC|27|83|Italie
Sam Beukama|DC|27|82|Pays-Bas
Giovanni Di Lorenza|DL|32|82|Italie
Mathías Oliveira|DL|28|79|Uruguay
Leonardo Spinazola|DL|33|77|Italie
Stanislav Lobotko|MD|31|84|Slovaquie
Scott McTominey|MC|29|86|Écosse
Frank Anguisa|MC|30|83|Cameroun
Kevin De Bruyn|MO|35|85|Belgique
Matteo Politanno|AIL|32|80|Italie
David Neris|AIL|29|80|Brésil
Noa Lange|AIL|27|79|Pays-Bas
Rasmus Højlunt|BU|23|82|Danemark
Romelu Lukako|BU|33|81|Belgique`,
'AC Milano':`Mike Maignant|G|30|87|France
Fikayo Tomory|DC|28|81|Angleterre
Strahinja Pavlovič|DC|25|80|Serbie
Matteo Gabia|DC|26|79|Italie
Pervis Estupiñam|DL|28|79|Équateur
Alexis Saelemakers|DL|27|80|Belgique
Youssouf Fofanna|MD|27|80|France
Samuele Ricchi|MD|24|79|Italie
Luka Modrič|MC|40|82|Croatie
Adrien Rabiott|MC|31|83|France
Ruben Loftus-Chek|MC|30|78|Angleterre
Christopher Nkunkou|MO|28|81|France
Christian Pulisik|AIL|27|85|États-Unis
Rafael Leãu|AIL|27|85|Portugal
Santiago Gimenes|BU|25|79|Mexique`,
'Juventas':`Michele Di Gregoria|G|28|82|Italie
Gleison Bremmer|DC|29|85|Brésil
Pierre Kaloulou|DC|26|81|France
Federico Gati|DC|27|80|Italie
Lloyd Kely|DC|27|78|Angleterre
Andrea Cambiasso|DL|26|83|Italie
Manuel Locateli|MD|28|83|Italie
Khéphren Thuran|MC|25|83|France
Teun Koopmeyners|MC|28|81|Pays-Bas
Weston McKenny|MC|27|80|États-Unis
Kenan Yildis|AIL|21|85|Turquie
Francisco Conseição|AIL|23|82|Portugal
Edon Zegrova|AIL|27|80|Kosovo
Dušan Vlahovič|BU|26|83|Serbie
Jonathan Davyd|BU|26|82|Canada
Loïs Opanda|BU|26|80|Belgique`,
'Atalante':`Marco Carnesechi|G|25|83|Italie
Isak Hiem|DC|27|80|Suède
Berat Djimsity|DC|33|78|Albanie
Sead Kolasinač|DC|33|77|Bosnie-Herzégovine
Raoul Belanova|DL|26|79|Italie
Davide Zapacosta|DL|34|77|Italie
Édersom|MD|27|83|Brésil
Marten de Roen|MD|35|79|Pays-Bas
Charles De Ketelare|MO|25|83|Belgique
Ademola Lookmann|AIL|28|84|Nigeria
Kamaldeen Sulemanna|AIL|24|77|Ghana
Gianluca Scamaca|BU|27|80|Italie
Nikola Krstovič|BU|26|79|Monténégro`,
'AS Romana':`Mile Svilan|G|26|84|Serbie
Gianluca Mancinni|DC|30|80|Italie
Evan Ndicca|DC|26|81|Côte d'Ivoire
Mario Hermosso|DC|31|77|Espagne
Wesly|DL|22|79|Brésil
Angelinho|DL|29|79|Espagne
Bryan Cristanti|MD|31|79|Italie
Manu Konè|MC|25|82|France
Neil El Aynaouy|MC|25|79|Maroc
Lorenzo Pellegrino|MO|30|79|Italie
Paulo Dibala|MO|32|82|Argentine
Matías Soulè|AIL|23|81|Argentine
Artem Dovbik|BU|29|80|Ukraine
Evan Fergusson|BU|21|77|Irlande`,
'SS Lazia':`Ivan Provedell|G|32|80|Italie
Alessio Romagnolli|DC|31|80|Italie
Mario Gilla|DC|25|80|Espagne
Nuno Tavarez|DL|26|79|Portugal
Adam Marusič|DL|33|77|Monténégro
Nicolò Rovela|MD|24|80|Italie
Mattéo Guendouzy|MC|27|81|France
Mattia Zacagni|AIL|31|81|Italie
Gustav Isaksem|AIL|25|78|Danemark
Taty Castelanos|BU|27|79|Argentine
Boulaye Dya|BU|29|78|Sénégal`,
'Como 1908':`Jean Butet|G|31|79|France
Diego Karlos|DC|33|77|Brésil
Marc-Oliver Kemp|DC|31|76|Allemagne
Álex Vale|DL|22|77|Espagne
Maximo Perone|MD|23|79|Argentine
Lucas Da Kunha|MC|25|79|France
Nico Pas|MO|22|84|Argentine
Assane Dyao|AIL|20|78|Sénégal
Jesús Rodrigues|AIL|20|78|Espagne
Álvaro Morato|BU|33|77|Espagne
Tasos Douvicas|BU|27|76|Grèce`,
'Bologna SC':`Łukasz Skorupsky|G|35|79|Pologne
Jhon Lucumy|DC|27|80|Colombie
Torbjørn Hegem|DC|27|77|Norvège
Juan Mirando|DL|26|77|Espagne
Remo Freuller|MD|34|79|Suisse
Lewis Fergusen|MC|26|80|Écosse
Riccardo Orsolino|AIL|29|81|Italie
Jonathan Row|AIL|23|77|Angleterre
Federico Bernardeski|AIL|32|77|Italie
Santiago Kastro|BU|21|78|Argentine`,
'ACF Fiorentino':`David de Gaia|G|35|82|Espagne
Pietro Comuzo|DC|21|78|Italie
Luca Raniery|DC|27|77|Italie
Marin Pongračič|DC|28|77|Croatie
Robin Gossens|DL|32|78|Allemagne
Dodò|DL|27|79|Brésil
Rolando Mandragorra|MD|29|77|Italie
Nicolò Fagiolli|MC|25|78|Italie
Albert Guðmundson|MO|29|79|Islande
Moise Keane|BU|26|83|Italie
Edin Džecko|BU|40|75|Bosnie-Herzégovine`,
'FC Beyern München':`Manuel Neuers|G|40|84|Allemagne
Jonas Urbik|G|22|76|Allemagne
Dayot Upamecanu|DC|27|85|France
Jonathan Thah|DC|30|85|Allemagne
Kim Min-je|DC|29|83|Corée du Sud
Joshua Kimmisch|DL|31|87|Allemagne
Alphonso Davis|DL|25|83|Canada
Konrad Leimer|DL|29|81|Autriche
Josip Stanišič|DL|26|80|Croatie
Aleksandar Pavlovič|MD|22|83|Allemagne
Leon Goretska|MC|31|81|Allemagne
Jamal Musialla|MO|23|89|Allemagne
Lennart Karll|MO|18|77|Allemagne
Michael Olisse|AIL|24|88|France
Luis Díez|AIL|29|86|Colombie
Serge Gnabri|AIL|31|81|Allemagne
Harry Kaine|BU|33|90|Angleterre
Nicolas Jakson|BU|25|79|Sénégal`,
'Borussia Dortmond':`Gregor Kobell|G|28|86|Suisse
Nico Schlotterback|DC|26|84|Allemagne
Waldemar Antom|DC|30|80|Allemagne
Niklas Süla|DC|31|78|Allemagne
Julian Ryersen|DL|28|79|Norvège
Daniel Svenson|DL|24|78|Suède
Ramy Bensebainy|DL|31|77|Algérie
Emre Kan|MD|32|79|Allemagne
Felix Nmetcha|MC|25|81|Allemagne
Marcel Sabitser|MC|32|80|Autriche
Jobe Bellinghem|MC|20|78|Angleterre
Julian Brand|MO|30|82|Allemagne
Karim Adeyemy|AIL|24|81|Allemagne
Maximilian Beyer|BU|23|80|Allemagne
Serhou Guirassi|BU|30|85|Guinée`,
'Bayer 05 Leverkusen':`Mark Fleken|G|32|80|Pays-Bas
Edmond Tapsova|DC|27|82|Burkina Faso
Jarell Quanshah|DC|23|79|Angleterre
Loïc Badè|DC|26|79|France
Alejandro Grimalda|DL|30|84|Espagne
Robert Andrisch|MD|31|80|Allemagne
Ezequiel Fernandes|MD|23|79|Argentine
Exequiel Palacio|MC|27|82|Argentine
Malik Tilman|MO|24|81|États-Unis
Ibrahim Massa|MO|20|78|Algérie
Martin Terier|AIL|29|78|France
Ernest Pokou|AIL|22|77|Pays-Bas
Patrik Shick|BU|30|82|Tchéquie
Christian Kofani|BU|19|76|Cameroun`,
'RS Leipzig':`Péter Gulácsy|G|36|79|Hongrie
Maarten Vandevort|G|24|78|Belgique
Castello Lukeva|DC|23|82|France
Willi Orbám|DC|33|80|Hongrie
David Rahm|DL|28|80|Allemagne
Ridle Bacu|DL|28|78|Allemagne
Xaver Schlagger|MD|28|81|Autriche
Assan Ouédraogu|MC|20|78|Allemagne
Christoph Baumgarter|MO|26|80|Autriche
Antonio Nousa|AIL|21|79|Norvège
Yan Diomanda|AIL|19|78|Côte d'Ivoire
Johan Bakayoco|AIL|23|79|Belgique
Romulo|BU|24|77|Brésil`,
'Eintrakt Frankfurt':`Kauã Santas|G|23|78|Brésil
Robin Kosch|DC|30|80|Allemagne
Arthur Teate|DC|26|79|Belgique
Nathaniel Browne|DL|23|78|Allemagne
Rasmus Kristensem|DL|29|78|Danemark
Ellyes Skhiry|MD|31|79|Tunisie
Hugo Larson|MC|22|80|Suède
Can Uzum|MO|20|80|Turquie
Farès Chaïby|MO|23|78|Algérie
Mario Götse|MO|34|78|Allemagne
Ritsu Doane|AIL|28|79|Japon
Ansgar Knauf|AIL|24|77|Allemagne
Jonathan Burkhardt|BU|26|80|Allemagne`,
'VfL Stuttgart':`Alexander Nübell|G|29|81|Allemagne
Jeff Chabbot|DC|28|79|Allemagne
Finn Jeltch|DC|19|77|Allemagne
Maximilian Mittelstät|DL|29|79|Allemagne
Josha Vagnomann|DL|25|76|Allemagne
Angelo Stiler|MD|25|82|Allemagne
Atakan Karasor|MD|29|78|Allemagne
Chema Andres|MC|21|77|Espagne
Bilal El Khanouss|MO|22|79|Maroc
Chris Fürich|AIL|28|79|Allemagne
Jamie Lewelling|AIL|25|79|Allemagne
Ermedin Demirovič|BU|28|80|Bosnie-Herzégovine
Deniz Undaf|BU|30|80|Allemagne`,
'SK Freiburg':`Noah Atubolou|G|24|80|Allemagne
Matthias Ginterr|DC|32|79|Allemagne
Philipp Lienhard|DC|30|77|Autriche
Christian Günther|DL|33|76|Allemagne
Maximilian Egestein|MC|29|78|Allemagne
Johan Manzamby|MC|20|77|Suisse
Vincenzo Griffo|AIL|33|78|Italie
Yuito Suzaki|AIL|24|77|Japon
Igor Matanovič|BU|23|76|Croatie`,
'Borussio Mönchengladbach':`Moritz Nikolas|G|29|78|Allemagne
Nico Elvedy|DC|29|78|Suisse
Ko Itakure|DC|29|79|Japon
Joe Scaly|DL|23|77|États-Unis
Rocco Reits|MC|24|79|Allemagne
Florian Neuhauss|MC|29|77|Allemagne
Kevin Stöcker|MO|32|77|Autriche
Franck Honorad|AIL|29|77|France
Tim Kleindiest|BU|30|78|Allemagne
Haris Tabakovič|BU|32|76|Bosnie-Herzégovine`,
'Sportin CP':`Rui Sylva|G|32|81|Portugal
Ousmane Diomandi|DC|22|82|Côte d'Ivoire
Gonçalo Inácia|DC|24|82|Portugal
Zeno Debasth|DC|22|79|Belgique
Maxi Arauju|DL|26|79|Uruguay
Iván Fresnedo|DL|21|76|Espagne
Morten Hjulmann|MD|26|83|Danemark
Hidemasa Morito|MC|31|79|Japon
Pedro Gonçalvez|MO|27|82|Portugal
Francisco Trincãu|AIL|26|82|Portugal
Geny Catamu|AIL|25|78|Mozambique
Luis Suares|BU|28|82|Colombie
Fotis Ioanidis|BU|26|78|Grèce`,
'SL Benfika':`Anatoliy Trubine|G|24|82|Ukraine
Antonio Sylva|DC|22|81|Portugal
Nicolás Otamendy|DC|38|79|Argentine
Tomás Arauju|DC|24|79|Portugal
Amar Dedič|DL|23|79|Bosnie-Herzégovine
Samuel Dhal|DL|23|76|Suède
Enzo Barrenechia|MD|25|78|Argentine
Fredrik Aursness|MC|30|81|Norvège
Richard Ryos|MC|26|80|Colombie
Leandro Barreira|MC|26|78|Luxembourg
Georgiy Sudacov|MO|23|80|Ukraine
Dodi Lukebakyo|AIL|28|79|Belgique
Andreas Schjeldrup|AIL|22|78|Norvège
Gianluca Prestiani|AIL|20|76|Argentine
Vangelis Pavlides|BU|27|82|Grèce`,
'AC Porto':`Diogo Kosta|G|26|85|Portugal
Jakub Kiwyor|DC|26|79|Pologne
Jan Bednarec|DC|30|78|Pologne
Nehuén Péres|DC|26|77|Argentine
Francisco Mourra|DL|26|78|Portugal
Alberto Kosta|DL|22|77|Portugal
Alan Varella|MD|24|81|Argentine
Victor Froholt|MC|20|79|Danemark
Gabri Veyga|MC|24|80|Espagne
Rodrigo Morra|MO|19|80|Portugal
Pepè|AIL|29|79|Brésil
Borja Sains|AIL|25|78|Espagne
William Gomez|AIL|20|77|Brésil
Samu Aghehova|BU|22|82|Espagne`,
'PSW Eindhoven':`Matěj Kovár|G|26|78|Tchéquie
Armando Obispa|DC|27|76|Pays-Bas
Ryan Flamengo|DC|23|77|Pays-Bas
Jerdy Schoutten|MD|29|80|Pays-Bas
Joey Veermann|MC|27|80|Pays-Bas
Guus Till|MO|28|79|Pays-Bas
Ismael Saibary|MO|25|80|Maroc
Ivan Perišič|AIL|37|77|Croatie
Couhaib Driouesh|AIL|24|77|Pays-Bas
Dennis Mann|AIL|27|77|Roumanie
Ricardo Peppi|BU|23|77|États-Unis`,
'AFC Ajaks':`Vítězslav Jaros|G|24|77|Tchéquie
Josip Šutallo|DC|26|78|Croatie
Youri Baaz|DC|23|77|Pays-Bas
Anton Gaei|DL|23|76|Danemark
Lucas Rossa|DL|25|75|Brésil
Kenneth Tailor|MC|24|80|Pays-Bas
Oscar Glouk|MO|22|79|Israël
Davy Klaasen|MO|33|75|Pays-Bas
Mika Gods|AIL|21|78|Belgique
Kasper Dolbergh|BU|28|77|Danemark
Wout Weghurst|BU|34|75|Pays-Bas`,
'Feyenoorde':`Timon Wellenreuter|G|30|77|Allemagne
Gernot Traunner|DC|34|76|Autriche
Tsuyoshi Watanebe|DC|29|76|Japon
Hugo Bueña|DL|23|75|Espagne
Quinten Tymber|MC|25|79|Pays-Bas
Sem Steyn|MO|24|78|Pays-Bas
Anis Hadj Mousa|AIL|24|79|Algérie
Leo Sauerr|AIL|20|75|Slovaquie
Ayase Ueta|BU|28|78|Japon`,
'Galatasaraï':`Uğurcan Çakir|G|30|81|Turquie
Davinson Sanches|DC|30|80|Colombie
Wilfried Sengo|DC|25|79|Côte d'Ivoire
Abdulkerim Bardakci|DC|31|77|Turquie
Lucas Toreira|MD|30|81|Uruguay
Gabriel Sarra|MC|26|80|Brésil
İlkay Gündogan|MC|35|82|Allemagne
Leroy Sanè|AIL|30|82|Allemagne
Barış Alper Yilmaz|AIL|26|80|Turquie
Yunus Akgum|AIL|25|78|Turquie
Victor Osimen|BU|27|87|Nigeria
Mauro Ikardi|BU|33|79|Argentine`,
'Fenerbahça':`Edersson|G|32|85|Brésil
Milan Škrinar|DC|31|81|Slovaquie
Çağlar Soyüncü|DC|30|77|Turquie
Nélson Semeda|DL|32|78|Portugal
Archie Browne|DL|24|76|Angleterre
Edson Álvares|MD|28|80|Mexique
Fredh|MC|33|79|Brésil
Marco Asencio|MO|30|81|Espagne
Taliska|MO|32|78|Brésil
Kerem Akturkoglu|AIL|27|80|Turquie
Youssef En-Nesiri|BU|29|80|Maroc
Jhon Durám|BU|22|79|Colombie`,
'Celtik':`Kasper Schmeichell|G|39|78|Danemark
Cameron Carter-Vikers|DC|28|77|États-Unis
Liam Scails|DC|27|74|Irlande
Callum MacGregor|MC|33|77|Écosse
Reo Hatata|MC|28|77|Japon
Arne Engles|MC|22|76|Belgique
Daizen Maeta|AIL|28|80|Japon
Benjamin Nygran|AIL|25|76|Suède`,
'Rangerz':`Jack Buttland|G|33|77|Angleterre
John Soutar|DC|29|74|Écosse
James Tavernyer|DL|34|76|Angleterre
Nicolas Raskine|MC|25|76|Belgique
Mohamed Dyomande|MC|24|77|Côte d'Ivoire
Cyriel Desers|BU|31|74|Nigeria`,
'Al-Hilel':`Yassine Bounu|G|35|82|Maroc
Kalidou Koulibali|DC|35|79|Sénégal
João Cancello|DL|32|83|Portugal
Théo Hernandes|DL|28|84|France
Rúben Nevez|MD|29|83|Portugal
Sergej Milinkovič-Savič|MC|31|83|Serbie
Malcon|AIL|29|81|Brésil
Salem Al-Dossari|AIL|34|78|Arabie saoudite
Darwin Nunes|BU|27|82|Uruguay
Marcos Leonarda|BU|23|77|Brésil`,
'Al-Nassar':`Bentu|G|27|79|Brésil
Íñigo Martines|DC|35|79|Espagne
Mohamed Simakam|DC|26|80|France
Marcelo Brozovič|MD|33|81|Croatie
João Félis|MO|26|80|Portugal
Kingsley Komán|AIL|30|81|France
Sadio Manè|AIL|34|80|Sénégal
Cristiano Ronalda|BU|41|82|Portugal`,
'Al-Ittihed':`Predrag Rajkovič|G|30|79|Serbie
Danilo Pereyra|DC|34|77|Portugal
N'Golo Kantè|MD|35|81|France
Fabynho|MD|32|80|Brésil
Houssem Aouarr|MC|28|78|Algérie
Moussa Diabi|AIL|27|81|France
Steven Bergwyn|AIL|28|78|Pays-Bas
Karim Benzima|BU|38|82|France`,
'Al-Ahlee':`Édouard Mendi|G|34|80|Sénégal
Roger Ibanes|DC|27|79|Brésil
Merih Demirel|DC|28|80|Turquie
Franck Kessiè|MC|29|80|Côte d'Ivoire
Enzo Milot|MO|24|80|France
Riyad Mahres|AIL|35|80|Algérie
Galenu|AIL|28|80|Brésil
Ivan Tony|BU|30|82|Angleterre`,
'Al-Qadisia':`Natcho|DC|36|76|Espagne
Julián Quiñonez|BU|29|79|Mexique
Mateo Retegi|BU|27|81|Italie`,
'SE Palmeiros':`Weverson|G|38|79|Brésil
Gustavo Gomes|DC|33|80|Paraguay
Murillo|DC|29|77|Brésil
Joaquín Piquerés|DL|27|79|Uruguay
Aníbal Morena|MD|27|78|Argentine
Lucas Evangelisto|MC|31|76|Brésil
Andreas Pereyra|MC|30|78|Brésil
Raphael Veyga|MO|31|79|Brésil
Mauricinho|MO|25|77|Brésil
Facundo Torras|AIL|26|79|Uruguay
Felipe Andersen|AIL|33|77|Brésil
Vitor Roké|BU|21|80|Brésil
José Manuel Lópes|BU|25|78|Argentine`,
'CR Flamenco':`Agustín Rosi|G|30|81|Argentine
Léo Ortis|DC|30|80|Brésil
Léo Pereyra|DC|30|78|Brésil
Ayrton Lukas|DL|29|77|Brésil
Guillermo Varella|DL|33|76|Uruguay
Alex Sandra|DL|35|76|Brésil
Emerson Royale|DL|27|76|Brésil
Jorjinho|MD|34|79|Italie
Erick Pulgas|MD|32|78|Chili
Nicolás de la Kruz|MC|29|81|Uruguay
Saúl Ñigues|MC|31|77|Espagne
Giorgian de Arrascaeto|MO|32|83|Uruguay
Samuel Linno|AIL|26|80|Brésil
Luiz Arauju|AIL|30|78|Brésil
Gonzalo Platta|AIL|25|78|Équateur
Bruno Henrike|AIL|35|76|Brésil
Pedru|BU|29|80|Brésil`,
'Fluminensa FC':`Fábyo|G|45|74|Brésil
Thiago Sylva|DC|41|77|Brésil
Martinely|MC|24|76|Brésil
Hérkules|MC|25|75|Brésil
Lucho Akosta|MO|31|78|Argentine
Gansu|MO|36|74|Brésil
Agustín Canobio|AIL|27|76|Uruguay
Kevin Sernna|AIL|28|75|Colombie
Germán Kano|BU|38|75|Argentine
John Kenedy|BU|24|75|Brésil`,
'Cruzeira EC':`Cássyo|G|39|75|Brésil
Fabrício Brunno|DC|30|77|Brésil
Kaiky|DL|22|74|Brésil
Lucas Romera|MD|32|77|Argentine
Kristian|MC|24|75|Brésil
Matheus Pereyra|MO|30|81|Brésil
Wandersom|AIL|31|75|Brésil
Kaio Jorje|BU|24|79|Brésil
Gabygol|BU|29|77|Brésil`,
'São Paulo SC':`Raphael|G|36|76|Brésil
Robert Arboledo|DC|34|76|Équateur
Alan Franko|DC|29|76|Argentine
Marcus Antônio|MC|26|76|Brésil
Oskar|MO|34|77|Brésil
Lucas Mourra|AIL|33|78|Brésil
Ferreyra|AIL|28|75|Brésil
Jonathan Caleri|BU|32|76|Argentine
Lucianu|BU|32|75|Brésil`,
'Atlética Mineiro':`Éversom|G|35|77|Brésil
Junior Alonzo|DC|33|76|Paraguay
Lyanko|DC|29|75|Brésil
Guilherme Aranna|DL|29|78|Brésil
Gustavo Scarppa|MO|32|78|Brésil
Bernardt|MO|33|75|Brésil
Ronny|AIL|31|75|Brésil
Duddu|AIL|34|75|Brésil
Hulc|BU|40|77|Brésil`,
'Botafoga FR':`John Vitor|G|30|77|Brésil
Alexander Barbosa|DC|31|77|Argentine
Bastoz|DC|34|75|Angola
Vytinho|DL|26|76|Brésil
Marlon Freytas|MD|30|78|Brésil
Danillo|MC|24|76|Brésil
Santi Rodrigues|MO|25|76|Uruguay
Jefferson Savarina|AIL|29|77|Venezuela
Matheus Martims|AIL|22|75|Brésil
Arthur Kabral|BU|28|75|Brésil`,
'EC Bahja':`Marcos Felype|G|30|76|Brésil
Gabriel Chavier|DC|25|74|Brésil
Luciano Jubba|DL|26|77|Brésil
Caio Alexandri|MD|27|77|Brésil
Jean Lukas|MC|27|77|Brésil
Rodrigo Nestorr|MC|25|75|Brésil
Everton Ribeyro|MO|37|76|Brésil
Erick Pulgha|AIL|26|76|Brésil
Willian Josè|BU|34|74|Brésil`,
'SC Corinthian':`Hugo Sousa|G|27|78|Brésil
André Ramalio|DC|34|75|Brésil
Gustavo Henrike|DC|33|75|Brésil
Matheus Biddu|DL|27|75|Brésil
José Martines|MD|31|75|Venezuela
Rodrigo Garo|MO|28|79|Argentine
André Carillo|AIL|35|74|Pérou
Memphis Depai|BU|32|80|Pays-Bas
Yuri Alberta|BU|25|78|Brésil`,
'Athletiko Paranaense':`Santoz|G|36|74|Brésil
Thiago Helenno|DC|37|72|Brésil
Fernandynho|MD|41|72|Brésil
Bruno Mastriany|BU|33|73|Uruguay`,
'Red Bragantina':`Kleiton|G|28|76|Brésil
Pedro Henrike|DC|30|74|Brésil
Juninho Capichaba|DL|29|75|Brésil
Eric Ramirez|MC|26|75|Brésil
Jhon Jhom|MO|24|76|Brésil
Vinissinho|AIL|21|73|Brésil
Eduardo Sacha|BU|34|74|Brésil`,
'SC Intercional':`Sergio Rochett|G|33|78|Uruguay
Vitãu|DC|26|76|Brésil
Gabriel Mercada|DC|39|72|Argentine
Alexandro Bernabey|DL|26|77|Argentine
Thiago Maya|MD|29|75|Brésil
Alan Patrik|MO|35|78|Brésil
Johan Carbonera|AIL|26|75|Colombie
Rafael Borrè|BU|30|77|Colombie
Enner Valença|BU|37|75|Équateur`,
'Santos SC':`Gabriel Brazãu|G|26|75|Brésil
Zé Ivaldu|DC|29|73|Brésil
Gabriel Bontempa|MC|20|72|Brésil
Neymer|MO|34|82|Brésil
Benjamín Rolheiser|MO|26|75|Argentine
Guillerme|AIL|30|75|Brésil
Tiquinho Soarez|BU|35|72|Brésil`,
'Grêmia FBPA':`Tiago Volpy|G|35|75|Brésil
Walter Kanemann|DC|35|74|Argentine
Jemersom|DC|33|73|Brésil
Arthur Mello|MC|29|76|Brésil
Franco Cristalda|MO|30|77|Argentine
Francis Amouzou|AIL|27|75|Belgique
Martin Brathwaite|BU|35|75|Danemark
Carlos Vinícios|BU|31|75|Brésil`,
'CR Vasco de Gama':`Léo Jardym|G|31|77|Brésil
Lucas Freytas|DC|24|73|Brésil
Paulo Henrike|DL|29|74|Brésil
Hugo Mourra|MD|28|74|Brésil
Philippe Coutynho|MO|34|78|Brésil
Rayam|AIL|20|77|Brésil
Andrés Gomes|AIL|24|76|Colombie
Nuno Moreyra|AIL|27|75|Portugal
Pablo Vegeti|BU|37|75|Argentine`,
'Intra Miami CF':`Óscar Ustary|G|39|70|Argentine
Rodrigo De Paulo|MC|32|81|Argentine
Telasco Segova|MO|23|74|Venezuela
Tadeo Alende|AIL|27|76|Argentine
Lionel Messy|BU|39|86|Argentine
Luis Suares|BU|39|76|Uruguay`,
'Nashville FC':`Joe Wilis|G|37|70|États-Unis
Walker Zimerman|DC|33|73|États-Unis
Hany Moukhtar|MO|31|78|Allemagne
Sam Suridge|BU|28|76|Angleterre`,
'Chicago Fyre FC':`Chris Bradi|G|22|72|États-Unis
Philip Zinkernagel|AIL|31|75|Danemark
Hugo Kuypers|BU|29|75|Belgique`,
'SC Cincinnati':`Roman Celentanno|G|25|73|États-Unis
Evanderr|MO|28|78|Brésil
Kévin Denkei|BU|25|75|Togo`,
'Los Angeles SC':`Hugo Loris|G|39|75|France
Son Heung-mun|AIL|34|82|Corée du Sud
Denis Bouanja|AIL|31|79|Gabon`,
'LA Galaxie':`Riqui Puich|MC|26|77|Espagne
Marco Reuss|MO|37|76|Allemagne
Gabriel Peck|AIL|25|75|Brésil`,
'Vancouver Whitecap FC':`Yohei Takaoca|G|30|72|Japon
Sebastian Berhalterr|MC|25|73|États-Unis
Thomas Müler|MO|36|78|Allemagne
Brian Whyte|BU|30|74|États-Unis`,
'San Diego SC':`Anders Dreier|AIL|28|76|Danemark
Hirving Losano|AIL|30|77|Mexique`,
'Seattle Sounder FC':`Stefan Fray|G|40|70|Suisse
Albert Rousnák|MO|31|75|Slovaquie
Jordan Moris|AIL|31|73|États-Unis`,
'New York City SC':`Maxi Morales|MO|39|71|Argentine
Alonso Martines|BU|27|75|Costa Rica`,
'New York Rad Bulls':`Emil Forsbergh|MO|34|75|Suède
Eric Choupo-Motting|BU|37|72|Cameroun`,
'Columbus Krew':`Diego Rosi|AIL|28|75|Uruguay
Wessam Abu Ali|BU|26|75|Palestine`,
'Atlanta Unitas FC':`Miguel Almirão|AIL|32|75|Paraguay
Emmanuel Late Lath|BU|27|75|Côte d'Ivoire`,
'Philadelphia Unio':`Andre Blacke|G|35|74|Jamaïque
Mikael Ure|BU|31|72|Danemark`,
'Orlando City FC':`Martín Ojeta|MO|27|76|Argentine
Luis Murriel|BU|35|72|Colombie`,
'GNK Dynamo Zagreb':`Ivan Nevistič|G|27|72|Croatie
Arijan Ademy|MD|35|70|Macédoine du Nord
Dejan Ljubičič|MC|28|72|Autriche
Gabriel Vidovič|MO|22|73|Croatie
Marko Piaca|AIL|31|71|Croatie
Arbër Hoxa|AIL|27|71|Albanie
Sandro Kulenovič|BU|26|71|Croatie`,
'HNK Hajduc Split':`Ivan Lučič|G|31|70|Croatie
Zvonimir Šarlya|DC|29|70|Croatie
Filip Krovinovič|MC|30|70|Croatie
Marko Livaya|BU|32|72|Croatie
Michele Šeggo|BU|25|69|Croatie`,
'Shanghai Ports':`Wu Lie|AIL|34|64|Chine
Gustavu|BU|32|66|Brésil`,
'Chengdu Rongchen':`Wei Shihau|AIL|31|65|Chine`
};

