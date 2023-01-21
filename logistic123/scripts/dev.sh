#!/bin/sh
echo '~~~~~~ Starting build dockerfile ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
ENV=dev
HOST=949377364782.dkr.ecr.ap-southeast-1.amazonaws.com
IMAGE=svm-admin-webapp

# Build source
yarn install && yarn build:$ENV

# Build image
cd ../ && docker build --cache-from=$HOST/$IMAGE:$ENV -t $HOST/$IMAGE:$ENV -f .docker/$ENV.dockerfile .

echo '~~~~~~ Ending build dockerfile ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
