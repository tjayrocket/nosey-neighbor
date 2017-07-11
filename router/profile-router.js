'use strict';

const jsonParser = require('body-parser').json();
const {Router} = require('express');
const s3Upload = require('../lib/s3-upload-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const User = require('../model/user.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profile/:id', jsonParser, basicAuth, (req, res, next) => {

});

profileRouter.get('/api/profile/:id', (req, res, next) => {

});

petRouter.post('/api/pets', bearerAuth, s3Upload('image'), (req, res, next) => {
  new Pet({
    name: req.body.name,
    type: req.body.type,
    photoURI: req.s3Data.Location,
    userID: req.user._id.toString(),
  })
  .save()
  .then(pet => res.json(pet))
  .catch(next);
});
