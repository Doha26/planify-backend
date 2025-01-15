#!/usr/bin/env bash
set -e

./wait-for-it.sh postgres:5432
yarn run migration:run
yarn run seed:run
yarn run start:prod
