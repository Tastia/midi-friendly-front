#!/bin/sh

git pull origin master
git checkout $RELEASE_VERSION
npm i && npm run build
dc up -d --build
nginx -s reload