'use strict';

const User = require('../model/user.js');

//basic auth middleware for login route
//find user in DB and compare PW
//add user to the req object for lter user
//if failure on next, respond with 401 status code (unauthorized)

module.exports = (req, res, next) => {
  const {authorization} = req.headers;

  if(!authorization)
    return next(new Error('unauthorized: no authorization provided.'));

  let encoded =  authorization.split('Basic ')[1];  //splits off user:password
  if(!encoded)
    return next(new Error('unauthorized: no basic auth provided.'));

  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');

  if (!username || !password)
    return next(new Error('unauthorized: no username or password provided.'));

  console.log('decoded: ', decoded);
  console.log('username: ', username);
  console.log('password: ', password);

  User.findOne({username})
    .then(user => {
      if(!user)
        return next(new Error('unauthorized: user does not exist.'));
      return user.passwordHashCompare(password);
    })
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log('Error: ', err);
      next(new Error('unauthorized: findOne falied in basic-auth-middleware.js'));
    });
};
