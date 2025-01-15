#!/usr/bin/env bash
set -e

./wait-for-it.sh postgres:5432
yarn run migration:run
yarn run seed:run
yarn run start:prod > prod.log 2>&1 &
./wait-for-it.sh maildev:1080
./wait-for-it.sh localhost:3000
yarn run lint
yarn run test:e2e -- --runInBand
