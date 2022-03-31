'use strict';

const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {

  try {
    // note to self, passing the error in this if statement was causing all my testing problems
    if (!req.headers.authorization) { next('Invalid Login'); }

    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
  
    next();
  } catch (e) {
    console.log(e);
    res.status(403).send('Invalid Login');
  }
};