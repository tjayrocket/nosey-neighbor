'use strict';

const jsonParser = require('body-parser').json();
const {Router} = require('express');
const s3Upload = require('../lib/s3-upload-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/api/profiles/:id', bearerAuth, s3Upload('image'), (req, res, next) => {
  new Profile({
    name: req.body.name,
    residenceId: req.body.residenceId.toString(),
    phone: req.body.phone,
    bio: req.body.bio,
    photoURI: req.s3Data.Location,
    userId: req.params.id,
  })
    .save()
    .then(profile => res.json(profile))
    .catch(next);
});

profileRouter.put('/api/profiles/:id', bearerAuth, (req, res, next) => {
  Profile.findOneAndUpdate({ userId: req.params.id }, req.body, { new: true })
    .then(profile => res.json(profile))
    .catch(next);
});

profileRouter.get('/api/profiles/:id', (req, res, next) => {
  Profile.findOne({ userId: req.params.id })
    .then(profile => res.json(profile))
    .catch(next);
});
