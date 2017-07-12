'use strict';

const faker = require('faker');
const Incident = require('../../model/incident.js');
const mockUser = require('./mock-user.js');

const mockIncident = module.exports = {};

let mockUserData = mockUser.createOne()

  .then(
    mockIncident.createOne = () => {
      let result = {};
      result.userId = mockUserData.user._id,
      result.type = faker.lorem.word();
      result.description = faker.lorem.sentence();
      result.comments = faker.lorem.sentence();

      return new Incident({
        userId: result.userId,
        type: result.type,
        description: result.description,
        comments: result.comments,
      })
        .save()
        .then(incident => {
          result.id = incident._id;
          console.log('mock incident',result);
          return result;
        });
    }
  );
