#!/bin/bash
set -e

# Install vue-cloudfront
npm i
npm run build

# Install http-server globally
npm i -g http-server

# Serve dist content
cd dist
http-server -p 3000 -s
