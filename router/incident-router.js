'use strict';

const jsonParser = require('body-parser').json();
const {Router} = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Incident = require('../model/incident.js');

const incidentRouter = module.exports = new Router();

incidentRouter.post('/api/incidents', jsonParser, bearerAuth, (req, res, next) =>{
  new Incident(req.body)
    .save()
    .then(incident => res.status(201).json(incident._id))
    .catch(next);
});

incidentRouter.get('/api/incidents/:id', (req, res, next) => {
  Incident.findById(req.params.id)
    .then(incident => res.status(200).json(incident))
    .catch(next);
});
