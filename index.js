'use strict';

require('dotenv').config();

// Start up DB Server
const { db } = require('./src/auth/models');
const server = require('./src/server');

const PORT = process.env.PORT || 3001;

db.sync()
  .then(() => {

    // Start the web server
    server.start(PORT);
  }).catch(console.log);
