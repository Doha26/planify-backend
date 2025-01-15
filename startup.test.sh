#!/usr/bin/env bash
set -e

./wait-for-it.sh postgres:5432
./wait-for-it.sh maildev:1080
yarn install
yarn run migration:run
yarn run seed:run
yarn run start:dev
