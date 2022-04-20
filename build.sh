#! /bin/bash

cd frontend && npm run clean && npm run build
cd ..
cd backend && npm run build
cd ..
cp -r ./frontend/build ./backend/build/public
