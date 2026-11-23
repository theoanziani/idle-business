#!/bin/sh
# Construit l'APK signé : sh build-apk.sh  (après python3 build.py ; nécessite keystore.properties, jamais commité)
set -e; cd "$(dirname "$0")"
V=$(grep -o "IB_VER='V[0-9.]*'" ../../idle-business/index.html | grep -o "[0-9][0-9.]*")
C=$(echo "$V" | tr -d .)
sed -i "s/versionCode [0-9]*; versionName '[0-9.]*'/versionCode $C; versionName '$V'/" app/build.gradle
gradle --no-daemon -q assembleRelease && cp app/build/outputs/apk/release/app-release.apk "IdleBusiness-$V.apk" && echo "IdleBusiness-$V.apk"
