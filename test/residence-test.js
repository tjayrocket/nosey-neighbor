'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');
const mockResidence = require('./lib/mock-residence.js');

const API_URL = process.env.API_URL;

describe('Testing Residence Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Residence GET', () => {
    it('should return 200 and an array of residences', () => {
      return mockResidence.createOne()
        .then(tempResidence => {
          return superagent.get(`${API_URL}/api/residences`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body[0].address).toEqual(tempResidence.address);
              expect(res.body[0]._id).toEqual(tempResidence.id);
            });
        });
    });
    it('should return 200 and the residence', () => {
      return mockResidence.createOne()
        .then(tempResidence => {
          return superagent.get(`${API_URL}/api/residences/${tempResidence.id}`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.address).toEqual(tempResidence.address);
              expect(res.body._id).toEqual(tempResidence.id);
            });
        });
    });
  });

  describe('Residence POST', () => {
    it('should return 201 and the residence', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield'
            })
            .then(res => {
              expect(res.status).toEqual(201);
              expect(res.body).toExist();
              expect(res.body.image).toExist();
              expect(res.body.address).toEqual('742 Evergreen Terrace, Springfield');
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(() => {
          return superagent.post(`${API_URL}/api/residences`)
            .send({
              address: '742 Evergreen Terrace, Springfield'
            })
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
    it('should return 409 database conflict', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield'
            })
            .then(() => {
              return superagent.post(`${API_URL}/api/residences`)
                .set('Authorization', `Bearer ${userData.token}`)
                .send({
                  address: '742 Evergreen Terrace, Springfield'
                })
                .catch(res => {
                  expect(res.status).toEqual(409);
                });
            });
        });
    });
  });
  describe('Residence PUT', () => {
    it('should return 202 and the new residence', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield',
              occupants: ['homer', 'marge']
            })
            .then((res) => {
              let newOccupants = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
              return superagent.put(`${API_URL}/api/residences/${res.body._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .send({
                  occupants: newOccupants
                })
                .then(res => {
                  expect(res.status).toEqual(202);
                  expect(res.body.address).toEqual('742 Evergreen Terrace, Springfield');
                  expect(res.body.occupants).toEqual(newOccupants);
                });
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield',
              occupants: ['homer', 'marge']
            })
            .then((res) => {
              let newOccupants = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
              return superagent.put(`${API_URL}/api/residences/${res.body._id}`)
                .send({
                  occupants: newOccupants
                })
                .catch(res => {
                  expect(res.status).toEqual(401);
                });
            });
        });
    });
    it('should return 400 bad request when invalid body is sent', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield',
              occupants: ['homer', 'marge']
            })
            .then((res) => {
              let newOccupants = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
              return superagent.put(`${API_URL}/api/residences/${res.body._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .send({
                  address: '742 Evergreen Terrace, Springfield, Anystate, USA',
                  occupants: newOccupants
                })
                .catch(res => {
                  expect(res.status).toEqual(400);
                });
            });
        });
    });
    it('should return 400 bad request when no body is sent', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield',
              occupants: ['homer', 'marge']
            })
            .then((res) => {
              return superagent.put(`${API_URL}/api/residences/${res.body._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .catch(res => {
                  expect(res.status).toEqual(400);
                });
            });
        });
    });
  });
});
