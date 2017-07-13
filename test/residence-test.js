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

  describe('Testing GET', () => {
    it('should return 200 status code and an array of residences.', () => {
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
    it('should return 200 status code and a single residence object.', () => {
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

  describe('Testing POST', () => {
    it('should return 201 status code and a residence ID.', () => {
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
            });
        });
    });
    it('should return 401 status code.', () => {
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
    it('should return 409 status code.', () => {
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
  describe('Testing PUT', () => {
    it('should return 202 status code and GET request should return proper modifications.', () => {
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
              return superagent.put(`${API_URL}/api/residences/${res.body}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .send({
                  occupants: newOccupants
                })
                .then(res => {
                  expect(res.status).toEqual(202);
                  return superagent.get(`${API_URL}/api/residences/${res.body._id}`)
                    .then((res) => {
                      expect(res.body.occupants).toEqual(newOccupants);
                    });
                });
            });
        });
    });
    it('should return 401 status code.', () => {
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
              return superagent.put(`${API_URL}/api/residences/${res.body}`)
                .send({
                  occupants: newOccupants
                })
                .catch(res => {
                  expect(res.status).toEqual(401);
                });
            });
        });
    });
    it('should return 400 status code when address is attempted to be modified.', () => {
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
              return superagent.put(`${API_URL}/api/residences/${res.body}`)
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
    it('should return 400 status code when no body is sent.', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield',
              occupants: ['homer', 'marge']
            })
            .then((res) => {
              return superagent.put(`${API_URL}/api/residences/${res.body}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .catch(res => {
                  expect(res.status).toEqual(400);
                });
            });
        });
    });
  });
});
