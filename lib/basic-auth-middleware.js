'use strict';

const User = require('../model/user.js');

module.exports = (req, res, next) => {
  const {authorization} = req.headers;

  let encoded = authorization.split('Basic ')[1];
  if(!encoded)
    return next(new Error('unauthorized: no basic auth provided.'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [email, password] = decoded.split(':');

  if (!email || !password)
    return next(new Error('unauthorized: no email or password provided.'));

  User.findOne({email})
    .then(user => {
      if(!user)
        return next(new Error('unauthorized: user does not exist.'));
      return user.passwordHashCompare(password);
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => {
      next(new Error('unauthorized: findOne falied in basic-auth-middleware.js'));
    });
};
