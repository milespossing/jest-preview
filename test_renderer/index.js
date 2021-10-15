#!/usr/bin/env node

const fileLoader = require('./src/fileLoader');

// start a file watcher

fileLoader('__testoutput__', 'node_modules/jest-preview/public');

// start the server
require('./server');