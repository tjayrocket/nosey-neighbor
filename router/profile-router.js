'use strict';

const jsonParser = require('body-parser').json();
const {Router} = require('express');
const s3Upload = require('../lib/s3-upload-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profiles', bearerAuth, s3Upload('image'), (req, res, next) => {
  req.body.image = req.s3Data.Location;
  req.body.userId = req.user._id;
  new Profile(req.body)
    .save()
    .then(profile => res.json(profile))
    .catch(next);
});

profileRouter.put('/api/profiles/:id', bearerAuth, jsonParser, (req, res, next) => {
  let options = {
    new: true,
    runValidators: true,
  };
  req.body.userId = req.user._id;
  Profile.findByIdAndUpdate(req.params.id, req.body, options)
    .then(profile => res.json(profile))
    .catch(next);
});

profileRouter.get('/api/profiles/:id', (req, res, next) => {
  Profile.findOne({ _id: req.params.id })
    .then(profile => res.json(profile))
    .catch(next);
});
