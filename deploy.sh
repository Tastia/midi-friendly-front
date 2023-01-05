#!/bin/sh

sudo docker container prune -f
docker volume prune -f
sudo docker-compose up -d --build
sudo nginx -s reload
sudo nginx -s reload