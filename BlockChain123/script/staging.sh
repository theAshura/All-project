#!/bin/sh
echo "~~~~~ Staging build ~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
ENV=staging

cd ../
rm -rf dist/apps/vmo-rental-webapp
aws s3 sync s3://sdc2-deployment/vmo22142/build/$ENV ./dist/apps/vmo-rental-webapp
pm2 restart ecosystem-$ENV.config.js

echo '~~~~~~ Ending build ~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
