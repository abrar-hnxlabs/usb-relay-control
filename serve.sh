#! /bin/bash

NODE_ENV=production pm2 start ./backend/build/index.js
