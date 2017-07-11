'use strict';

const jsonParser = require('body-parser').json();
const {Router} = require('express');
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profile/:id', jsonParser, basicAuth, (req, res, next) => {

});

profileRouter.get('/api/profile/:id', (req, res, next) => {

});
