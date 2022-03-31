'use strict';

const express = require('express');
const authRouter = express.Router();

const { users } = require('./models/index.js');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');

authRouter.post('/signup', async (request, response, next) => {
  try {
    let userRecord = await users.create(request.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    response.status(201).json(output);
  } catch (error) {
    next(error.message);
  }
});

authRouter.post('/signin', basicAuth, (request, response, next) => {
  const user = {
    user: request.user,
    token: request.user.token,
  };
  response.status(200).json(user);
});

authRouter.get('/users', bearerAuth, async (request, response, next) => {
  const allUsers = await users.findAll({});
  
  const list = allUsers.map(user => user.username);
  response.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (request, response, next) => {
  response.status(200).send('Welcome to the secret area!');
});


module.exports = authRouter;