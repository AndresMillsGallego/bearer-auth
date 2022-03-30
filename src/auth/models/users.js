'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.API_SECRET || 'toes';

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    token: {
      type: DataTypes.VIRTUAL,
      // Adds a 15min expiration to the JWT token
      get() {
        return jwt.sign({ username: this.username, exp: Math.floor(Date.now() / 1000) + (30 * 30) }, SECRET); 
      },
      set(payload) {
        return jwt.sign(payload, SECRET);
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    try {
      const user = await this.findOne({ where: { username } });
      const valid = await bcrypt.compare(password, user.password);
      if (valid) { return user; }

    } catch (error) {
      console.error(error);
      return error;
    }
  };

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      
      const parsedToken = jwt.verify(token, SECRET);
      const user = await this.findOne({where: {username: parsedToken.username} });
      if (user) { return user; }
      // throw new Error('User Not Found');
    } catch (error) {
      console.error(error);
      return error;
    }
  };
  return model;
};

module.exports = userSchema;