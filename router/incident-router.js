'use strict';

const jsonParser = require('body-parser').json();
const {Router} = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Incident = require('../model/incident.js');

const incidentRouter = module.exports = new Router();

authRouter.get('/api/incidents', )
