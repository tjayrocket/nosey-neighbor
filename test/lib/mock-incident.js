'use strict';

const faker = require('faker');
const Incident = require('../../model/incident.js');

const mockIncident = module.exports = {};

mockIncident.createOne = () => {
  let result = {};
  return new Incident({
    userId: faker.userId,
    timeStamp: faker.date.recent(),
    type: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    comments: faker.lorem.sentence()
  });
};
