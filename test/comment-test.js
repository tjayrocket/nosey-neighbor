'use strict';

require('dotenv').config({ path: `${__dirname}/../.test.env` });
const superagent = require('superagent');
const expect = require('expect');
const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockIncident = require('./lib/mock-incident.js');

const API_URL = process.env.API_URL;

describe.only('Testing Comment Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 200', () => {
      return mockIncident.createOne().then(userData => {
        return superagent
          .post(`${API_URL}/api/comments`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send({
            content:'Jannet\'s dog was in my yard, digging in garden',
            date: Date.now()})
          .then(res => {
            expect(res.status).toEqual(200);
            expect(res.body._id).toExist();
            expect(res.body.content).toEqual('Jannet\'s dog was in my yard, digging in garden');
            expect(res.body.date).toExist();
          });
      });
    });

    it('should return 400 bad request', () => {
      return mockIncident.createOne().then(userData => {
        return superagent
          .post(`${API_URL}/api/comments/${userData._id}`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send({
            nope: 'non existent'
          })
          .then(res => {
            throw res;
          })
          .catch(res => {
            expect(res.status).toEqual(400);
          });
      });
    });
    it('should return 401 unauthorized', () => {
      return mockIncident.createOne().then(userData => {
        return superagent
          .post(`${API_URL}/api/comments/${userData._id}`)
          .set('Authorization', `Bearer skdfhskjdfhakdjf`)
          .send({
            content:
              'Neighbors are outside again, there\'s at least 20 cars at their house',
            date: Date.now()
          })
          .then(res => {
            throw res;
          })
          .catch(res => {
            expect(res.status).toEqual(401);
          });
      });
    });
    it('Should return with 404 not found', () => {
      return superagent
        .post(`${API_URL}/api/comments/asdasdasdasd`)
        .send({
          nope: 'non existent'
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

    it('should return 200', () => {
      return mockIncident.createOne().then(userData => {
        return superagent
          .post(`${API_URL}/api/comments/${userData._id}`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send({
            content:
              'Neighbors are outside again, there\'s at least 20 cars at their house',
            date: Date.now()
          })
          .then(() => {
            return superagent
              .get(`${API_URL}/api/comments/${userData._id}`)
              .then(res => {
                expect(res.status).toEqual(200);
                expect(res.body._id).toEqual(userData._id);
                expect(res.body.content).toEqual('Neighbors are outside again, there\'s at least 20 cars at their house');
                expect(res.body.date).toExist();
              });
          });
      });
    });
    it('Should return with 404 not found', () => {
      return superagent
        .get(`${API_URL}/api/comments/asdasdasdasd`)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('Testing PUT', () => {
    it('should return 200', () => {
      return mockIncident.createOne().then(userData => {
        return superagent
          .post(`${API_URL}/api/comments/${userData._id}`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send({
            content:
              'Neighbors are outside again, there\'s at least 20 cars at their house',
            date: Date.now()
          })
          .then(() => {
            return superagent
              .put(`${API_URL}/api/comments/${userData._id}`)
              .set('Authorization', `Bearer ${userData.token}`)
              .send({
                content:
                  'Neighbors are outside again, there\'s like 100 cars at their house',
                date: Date.now()
              })
              .then(res => {
                expect(res.status).toEqual(200);
                expect(res.body._id).toEqual(userData._id);
                expect(res.body.content).toEqual('Neighbors are outside again, there\'s like 100 cars at their house');
                expect(res.body.date).toExist();
              });
          });
      });
    });
    it('should return 400 bad request', () => {
      return mockIncident.createOne().then(userData => {
        return superagent
          .post(`${API_URL}/api/comments/${userData._id}`)
          .set('Authorization', `Bearer ${userData.token}`)
          .send({
            content:
              'Neighbors are outside again, there\'s at least 20 cars at their house',
            date: Date.now()
          })
          .then(() => {
            return superagent
              .put(`${API_URL}/api/comments/${userData._id}`)
              .set('Authorization', `Bearer ${userData.token}`)
              .send({
                content:
                  'Neighbors are outside again, there\'s like 100 cars at their house',
                date: Date.now()
              })
              .then(res => {
                expect(res.status).toEqual(400);
              });
          });
      });
    });
    it('Should return with 401 not found', () => {
      return superagent
        .put(`${API_URL}/api/comments/asdasdasdasd`)
        .send({
          nope: 'non existent'
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('Should return with 404 not found', () => {
      return superagent
        .put(`${API_URL}/api/comments/asdasdasdasd`)
        .send({
          nope: 'non existent'
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
