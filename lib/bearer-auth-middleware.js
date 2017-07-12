'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/user.js');
const universalify = require('universalify');

module.exports = (req, res, next) => {
  // if any of the following logic returns an error, next will return 401 unauthorized

  // first check if the auth header exists
  let {authorization} = req.headers;
  if (!authorization)
    return next(new Error('Unauthorized: No auth header!'));

  // check for a bearer token
  let token = authorization.split('Bearer ')[1];
  if (!token)
    return next(new Error('Unauthorized: No token found!'));

  //decrypt the token
  universalify.fromCallback(jwt.verify)(token, process.env.APP_SECRET)

  // find the user by the tokenSeed
    .then(decoded => User.findOne({tokenSeed: decoded.tokenSeed}))
    .then(user => {
      if (!user)
        throw new Error('Unauthorized: No user found!');
      // add the user to the req object
      req.user = user;
      next();
    })
    .catch(next);
};
