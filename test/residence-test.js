'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

const API_URL = process.env.API_URL;

describe('Testing Residence Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 201 status code and a residence ID', () => {
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
    it('should return 401 status code', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/residences`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              address: '742 Evergreen Terrace, Springfield'
            })
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
    });
    it('should return 409 status code', () => {
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
});
