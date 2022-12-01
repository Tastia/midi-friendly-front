#!/bin/sh

git pull origin main
git checkout $RELEASE_VERSION
sudo docker-compose up -d --build
sudo nginx -s reload