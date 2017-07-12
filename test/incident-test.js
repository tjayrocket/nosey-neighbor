'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockIncident = require('./lib/mock-incident.js');
const mockUser = require('./lib/mock-user.js');

// const mockComment = require('./lib/mock-comment.js');
const mockResidence = require('./lib/mock-residence.js');


const API_URL = process.env.API_URL;

describe('Testing Incident Model (TJay) :', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 201 - blah blah', () => {
      return mockUser.createOne()
        .then(mockUserData => {
          return mockResidence.createOne()
            .then(mockResidenceData => {
              return superagent.post(`${API_URL}/api/incidents`)
                .set('Authorization', `Bearer ${mockUserData.token}`)
                .send({
                  userId: mockUserData.user._id,
                  type: 'HOA',
                  description: 'Turd On lawn',
                  residenceId: mockResidenceData.id,
                })
                .then(res => {
                  expect(res.status).toEqual(201);
                });
            });
        });
    });

    it('should return 400 - Invalid Body', () => {
      return mockUser.createOne()
        .then(mockUserData => {
          return superagent.post(`${API_URL}/api/incidents`)
            .set('Authorization', `Bearer ${mockUserData.token}`)
            .send({})
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });

    it('should return 401 - Unauthorized Access', () => {
      return mockUser.createOne()
        .then(mockUserData => {
          return mockResidence.createOne()
            .then(mockResidenceData => {
              return superagent.post(`${API_URL}/api/incidents`)
                .send({
                  userId: mockUserData.user._id,
                  type: 'HOA',
                  description: 'Turd On lawn',
                  residenceId: mockResidenceData.id,
                })
                .catch(res => {
                  expect(res.status).toEqual(401);
                });
            });
        });
    });

    it('should return with 404 - invalid body :', () => {
      return superagent
        .post(`${API_URL}/api/incidents/chunks`)
        .send({
          number: '30 Billion'
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('Testing GET - Incident Array', () => {
    it('should return 200 - Array of Incidents', () => {
      return mockIncident.createOne().then(() => {
        return superagent
          .get(`${API_URL}/api/incidents/`)
          .then(res => {
            expect(res.body).toBeAn('array');
            expect(res.status).toBe(200);
          });
      });
    });
  });

  describe('Testing GET - Single Incident', () => {
    it('should return 200 - Single Incidenrt Report', () => {
      return mockIncident.createOne().then(mockIncidentData => {
        return superagent
          .get(`${API_URL}/api/incidents/${mockIncidentData.id}`)
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body._id).toExist();
            expect(res.body.userId).toEqual(mockIncidentData.userId);
            expect(res.body.timeStamp).toExist();
            expect(res.body.type).toEqual(mockIncidentData.type);
            expect(res.body.description).toEqual(mockIncidentData.description);
            expect(res.body.residenceId).toEqual(mockIncidentData.residenceId);
          });
      });
    });

    it('Should return 404', () => {
      return superagent.get(`${API_URL}/api/incidents/chunks`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
