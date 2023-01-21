#!/bin/bash

## Restore backup package.json
#mv package.json.backup package.json
#
## Install monorepo dependencies instead
#yarn --cwd ../../
yarn prepare:mobile
