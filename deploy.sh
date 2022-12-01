#!/bin/sh

git pull origin main
git checkout $RELEASE_VERSION
docker-compose up -d --build
nginx -s reload