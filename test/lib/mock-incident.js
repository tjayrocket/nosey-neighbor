'use strict';

const faker = require('faker');
const Incident = require('../../model/incident.js');

const mockIncident = module.exports = {};

mockIncident.createOne = () => {
  let result = {};
  result.userId = faker.internet.userName();
  result.timeStamp = faker.date.recent();
  result.type = faker.lorem.word();
  result.description = faker.lorem.description();
  result.comments = faker.lorem.sentence();

  return new Incident({
    userId: result.userId,
    timeStamp: result.timeStamp,
    type: result.type,
    description: result.description,
    comments: result.comments,
  })
    .save()
    .then(incident => {
      result.id = incident._id;
      return result;
    });
};
