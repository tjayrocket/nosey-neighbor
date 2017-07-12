'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockIncident = require('./lib/mock-incident.js');
const mockUser = require('./lib/mock-user.js');
// const mockComment = require('./lib/mock-comment.js');
// const mockResidence = require('./lib/mock-residence.js');

const API_URL = process.env.API_URL;

describe('Testing Incident Model (TJay) :', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 200 - blah blah', () => {
      return mockIncident.createOne().then(userData => {
        return superagent.post(`${API_URL}/api/incidents/${userData._id}`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send({
            timeStamp: Date.now(),
            type: 'HOA',
            description: 'Turd on Lawn'
          })
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body.date).toExist();
            expect(res.body.type).toEqual('HOA');
            expect(res.body.description).toEqual('Turd on Lawn');
          });
      });

    });

    it('should return 400 bad request', () => {
      return mockUser.createOne().then(userData => {
        return superagent
          .post(`${API_URL}/api/incidents/${userData._id}`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send({
            drinks: 'plentiful'
          })
          .then(res => {
            throw res;
          })
          .catch(res => {
            expect(res.status).toEqual(400);
          });
      });
    });

    it('should return with 404 - invalid body :', () => {
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

  describe('Testing GET - Incident Array', () => {
    it('should return 200 - blah blah', () => {
      return mockIncident.createOne().then(() => {
        return mockUser.createOne().then(userData => {
          return superagent
            .post(`${API_URL}/api/incidents/${userData._id}`)
            .set('Authorization', `Bearer ${userData.token}`)
            .send({
              timeStamp: Date.now(),
              type: 'HOA',
              description: 'Turd on Lawn',
            })
            .then(() => {
              return superagent
                .get(`${API_URL}/api/incidents/${userData._id}`)
                .then(res => {
                  expect(res.status).toEqual(200);
                  expect(res._id).toEqual(userData._id);
                  expect(res.body.timeStamp).toExist();
                  expect(res.body.type).toEqual('HOA');
                  expect(res.body.description).toEqual('Turd on Lawn');
                });
            });
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
