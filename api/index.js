// api/index.js - Vercel Serverless Function Entrypoint for Express API
const path = require('path');

// Load compiled Express backend application
const serverModule = require('../backend/dist/server.js');
const app = serverModule.default || serverModule;

module.exports = app;
module.exports.default = app;
