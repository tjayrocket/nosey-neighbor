'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockIncident = require('./lib/mock-incident.js');
const mockUser = require('./lib/mock-user.js');

const mockResidence = require('./lib/mock-residence.js');


const API_URL = process.env.API_URL;

describe('Testing Incident Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Incident POST', () => {
    it('should return 201 and the residence', () => {
      return mockUser.createOne()
        .then(mockUserData => {
          return mockResidence.createOne()
            .then(mockResidenceData => {
              return superagent.post(`${API_URL}/api/incidents`)
                .set('Authorization', `Bearer ${mockUserData.token}`)
                .send({
                  type: 'HOA',
                  description: 'Turd On lawn',
                  residenceId: mockResidenceData.id,
                })
                .then(res => {
                  expect(res.status).toEqual(201);
                  expect(res.body.type).toEqual('HOA');
                  expect(res.body.description).toEqual('Turd On lawn');
                  expect(res.body.residenceId.toString()).toEqual(mockResidenceData.id.toString());
                });
            });
        });
    });

    it('should return 400 bad request', () => {
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

    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(() => {
          return mockResidence.createOne()
            .then(mockResidenceData => {
              return superagent.post(`${API_URL}/api/incidents`)
                .send({
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

    it('should return 404 not found', () => {
      return superagent
        .post(`${API_URL}/api/incidents/chunk`)
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

  describe('Incident GET', () => {
    it('should return 200 and an array of incidents', () => {
      return mockIncident.createOne().then(() => {
        return superagent
          .get(`${API_URL}/api/incidents`)
          .then(res => {
            expect(res.body).toBeAn('array');
            expect(res.status).toBe(200);
          });
      });
    });
  });

  describe('Incident GET', () => {
    it('should return 200 and the incident', () => {
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

    it('should return 404 not found', () => {
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
