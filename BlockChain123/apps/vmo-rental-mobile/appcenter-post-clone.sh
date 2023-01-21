#!/bin/bash

# Backup the package.json
rm -rf ./node_modules
cp ../../package.json package.json
cp ../../yarn.lock yarn.lock
cp -r ../../patches patches
sed -i '' '/"prepare": "husky install"/d' ./package.json
# Erase all dependencies from package.json
# Prevents App Center from installing dependencies from this directory
