'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

const API_URL = process.env.API_URL;

describe('Testing Profile Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 200', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profile`)
            .send({
              id: userData._id,
              name: 'Yooooo',
              phone: 1236530000,
              bio: 'yo whattup',
            })
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.id).toEqual(userData._id);
              expect(res.name).toEqual('Yooooo');
              expect(res.phone).toEqual(1236530000);
              expect(res.bio).toEqual('yo whattup');
            });
        });
    });
    it('should return 400 bad request', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profile`)
            .send({
              id: userData._id,
              yo: 'yo',
            })
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });
  });

  describe('Testing GET - Incident Array', () => {
    it('should return 200 - blah blah', () => {

    });

    it('should return 200 - blah blah', () => {

    });

    it('Should return with 404 not found', () => {
      return superagent.get(`${API_URL}/api/profile/asdasdasdasd`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
