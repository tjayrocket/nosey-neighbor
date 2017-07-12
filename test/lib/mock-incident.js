'use strict';

const faker = require('faker');
const Incident = require('../../model/incident.js');
const mockUser = require('./mock-user.js');
const mockResidence = require('./mock-residence.js');

const mockIncident = module.exports = {};

mockIncident.createOne = () => {
  return mockUser.createOne()
    .then(mockUserData => {
      // console.log('mockUserData: ', mockUserData);
      let result = {};
      result.userId = mockUserData.user._id;
      result.type = faker.lorem.word();
      result.description = faker.lorem.sentence();
      result.userToken = mockUserData.token;
      return mockResidence.createOne()
        .then(mockResidenceData => {
          result.residenceId = mockResidenceData.id;
          return new Incident({
            userId: result.userId,
            type: result.type,
            description: result.description,
            residenceId: result.residenceId,
          })
            .save()
            .then(incident => {
              result.id = incident._id;
              // console.log('result: ', result);
              return result;
            });
        });
    });
};
