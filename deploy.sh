#!/bin/sh

git pull origin main
git checkout $RELEASE_VERSION
dc up -d --build
nginx -s reload