'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {

  // eslint-disable-next-line no-undef
  if (!req.headers.authorization) {
    res.status(403).send('Invalid Login');
  }
  try {

    let basic = req.headers.authorization;
    let encodedString = basic.split(' ')[1];
    let [username, pass] = base64.decode(encodedString).split(':');
    console.log(username, pass);

    req.user = await users.authenticateBasic(username, pass);
   
    next();
  } catch (error) {
    console.log(error.message);
    res.status(403).send('Invalid Login');
  }

};
