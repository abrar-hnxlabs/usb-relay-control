#! /bin/bash

npx concurrently "cd frontend && npm run clean && npm run build"\
   "cd backend && npm run build"
 
cp -r ./frontend/build ./backend/build/public