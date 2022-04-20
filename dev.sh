#! /bin/bash

npx concurrently "cd frontend && npm start"\
   "cd backend && npm start"\
   "cd backend && npm run watch"
