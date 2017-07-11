'use strict';

const faker = require('faker');
const Incident = require('../../model/incident.js');

const mockIncident = module.exports = {};

mockIncident.createOne = () => {
  let result = {};
  return new Incident({
    userId: faker.userId,
    timeStamp: Date.now(),
    type: 'Fake Type',
    description: 'Fake  Description',
    residenceId: faker.residenceId,
    comments: 'Blergh'
  });
};
