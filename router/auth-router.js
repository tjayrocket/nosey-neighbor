'use strict';

const jsonParser = require('body-parser').json();
const { Router } = require('express');
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');

const authRouter = (module.exports = new Router());

authRouter.post('/api/signup', jsonParser, (req, res, next) => {
  User.create(req.body).then(token => res.send(token)).catch(next);
});

authRouter.get('/api/signin', basicAuth, (req, res, next) => {
  req.user.tokenCreate().then(token => res.send(token)).catch(next);
});

//DELETE THIS IN PRODUCTION VERSION

authRouter.get('/api/users', (req, res, next) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

//DELETE THIS IN PRODUCTION VERSION
