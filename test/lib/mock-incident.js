'use strict';

const faker = require('faker');
const Incident = require('../../model/incident.js');
const mockUser = require('./mock-user.js');
const mockResidence = require('./mock-residence.js');


const mockIncident = module.exports = {};

mockIncident.createOne = () => {

  mockUser.createOne()

    .then(
      mockResidence.createOne()
        .then(residence => {
          let result = {};
          result.userId = mockUser.user._id,
          result.type = faker.lorem.word();
          result.description = faker.lorem.sentence();
          result.comments = faker.lorem.sentence();

          return new Incident({
            residenceId: residence.id,
            userId: result.userId,
            type: result.type,
            description: result.description,
            comments: result.comments,
          })
            .save()
            .then(incident => {
              result.id = incident._id;
              return result;
            });
        }
        )
    );
};
