# Idle Business : sources

- `src/index.html` : page, avec `/*@CSS*/` et `/*@JS*/` à la place du style et du script.
- `src/css/*.css`, `src/js/NNN-*.js` : concaténés dans l'ordre des numéros.
- `python3 build.py` : reconstruit `../idle-business/index.html` (le site, branche `main`).
- `python3 release.py V2.x.y "Titre" "Texte"` : version, actualité, cache du service worker, build.
- `tests/` : simulations Playwright (`node tests/xxx.js`, le site doit être construit).
- Nouveau module : ajouter un fichier `src/js/NNN-nom.js` avec un numéro libre à la bonne place.

Ne jamais ajouter ici la clé de signature Android (`keystore/`, `keystore.properties`, `*.jks`).

## Android
- `android/` : appli WebView (`fr.theoanziani.idlebusiness`) qui embarque le site construit.
- `sh android/build-apk.sh` : version reprise de `IB_VER`, APK signé dans `android/`.
- Il faut `android/keystore.properties` et la clé `.jks` : gardés hors du dépôt, sauvegardés par Théo.
- Empreinte SHA-256 de la clé (novembre 2026) : 29:6C:EE:3A:10:BB:09:5C:5A:41:E1:11:01:4F:68:56:35:C2:B4:33:C4:BF:EB:15:A5:DD:AC:26:33:37:60:EB
