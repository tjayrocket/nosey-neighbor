'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
const universalify = require('universalify');

module.exports = (req, res, next) => {

  let {authorization} = req.headers;
  if (!authorization)
    return next(new Error('Unauthorized: No auth header!'));

  let token = authorization.split('Bearer ')[1];
  if (!token)
    return next(new Error('Unauthorized: No token found!'));

  universalify.fromCallback(jwt.verify)(token, process.env.APP_SECRET)

    .then(decoded => User.findOne({tokenSeed: decoded.tokenSeed}))
    .then(user => {

      if (!user) throw new Error('Unauthorized: No user found!');

      req.user = user;
      next();
    })
    .catch(next);
};
