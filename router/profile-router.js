'use strict';

const jsonParser = require('body-parser').json();
const {Router} = require('express');
const s3Upload = require('../lib/s3-upload-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profiles', bearerAuth, s3Upload('image'), (req, res, next) => {
  new Profile({
    name: req.body.name,
    residenceId: req.body.residenceId,
    phone: req.body.phone,
    bio: req.body.bio,
    photoURI: req.s3Data.Location,
    userId: req.user._id,
  })
    .save()
    .then(profile => res.status(201).json(profile))
    .catch(next);
});

profileRouter.put('/api/profiles/:id', bearerAuth, jsonParser, (req, res, next) => {
  let options = {
    new: true,
    runValidators: true,
  };
  Profile.findByIdAndUpdate(req.params.id, req.body, options)
    .then(profile => res.json(profile))
    .catch(next);
});

profileRouter.get('/api/profiles/:id', (req, res, next) => {
  Profile.findOne({ _id: req.params.id })
    .then(profile => res.status(202).json(profile))
    .catch(next);
});
