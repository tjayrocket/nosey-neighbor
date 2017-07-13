'use strict';

const jsonParser = require('body-parser').json();
const { Router } = require('express');
// const fs = require('fs');
const uuid = require('uuid');
const { S3 } = require('aws-sdk');
const s3 = new S3();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Residence = require('../model/residence.js');
const superagent = require('superagent');
require('dotenv').config({path: `${__dirname}/../.env`});
const residenceRouter = module.exports = new Router();

residenceRouter.post(
  '/api/residences',
  jsonParser,
  bearerAuth,
  (req, res, next) => {
    let body = req.body;
    return superagent.get('https://maps.googleapis.com/maps/api/streetview')
      .query({
        size: process.env.STREET_VIEW_RES,
        key: process.env.STREET_VIEW_KEY,
        location: req.body.address,
      })
      .then(res => {
        return s3
          .upload({
            ACL: 'public-read',
            Bucket: process.env.AWS_BUCKET,
            Key: `${uuid.v1()}.jpg`,
            Body: res.body,
          })
          .promise();
      })
      .then(s3Data => {
        new Residence({
          address: body.address,
          image: s3Data.Location,
          occupants: body.occupants,
        })
          .save()
          .then(residence => res.status(201).json(residence))
          .catch(next);
      });

  });

residenceRouter.get('/api/residences/:id', (req, res, next) => {
  Residence.findById(req.params.id)
    .then(residence => res.status(200).json(residence))
    .catch(next);
});

residenceRouter.get('/api/residences', (req, res, next) => {

  let pageNumber = Number(req.query.page);
  if (!pageNumber || pageNumber < 1) pageNumber = 1;
  pageNumber--;

  Residence.find({})
    .sort({ title: 'asc' })
    .skip(pageNumber * 50)
    .limit(50)
    .then(residences => res.status(200).json(residences))
    .catch(next);
});

residenceRouter.put('/api/residences/:id', jsonParser, bearerAuth, (req, res, next) => {
  if(req.body.address) return res.sendStatus(400);
  if(!Object.keys(req.body).length) return res.sendStatus(400);

  Residence.findByIdAndUpdate(req.params.id, req.body)
    .then(residence => res.status(202).json(residence))
    .catch(next);
});
