# Idle Business : sources

- `src/index.html` : page, avec `/*@CSS*/` et `/*@JS*/` à la place du style et du script.
- `src/css/*.css`, `src/js/NNN-*.js` : concaténés dans l'ordre des numéros.
- `python3 build.py` : reconstruit `../idle-business/index.html` (le site, branche `main`).
- `python3 release.py V2.x.y "Titre" "Texte"` : version, actualité, cache du service worker, build.
- `tests/` : simulations Playwright (`node tests/xxx.js`, le site doit être construit).
- Nouveau module : ajouter un fichier `src/js/NNN-nom.js` avec un numéro libre à la bonne place.

Ne jamais ajouter ici la clé de signature Android (`keystore/`, `keystore.properties`, `*.jks`).
