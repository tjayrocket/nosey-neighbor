'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');
const mockResidence = require('./lib/mock-residence.js');

const API_URL = process.env.API_URL;

describe('Testing Profile Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 200', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profile/${userData._id}`)
            .send({
              name: 'Phil',
              phone: 1236530000,
              bio: 'I am Phil',
            })
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res._id).toEqual(userData._id);
              expect(res.name).toEqual('Phil');
              expect(res.phone).toEqual(1236530000);
              expect(res.bio).toEqual('I am Phil');
            });
        });
    });
    it('should return 400 bad request', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profile/${userData._id}`)
            .send({
              nope: 'non existent',
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
    it('should return 200', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              return superagent.post(`${API_URL}/api/profile/${userData._id}`)
                .send({
                  residenceId: residence._id,
                  name: 'Phil',
                  phone: 1236530000,
                  bio: 'I am Phil',
                })
                .then(() => {
                  return superagent.get(`${API_URL}/api/profile/${userData._id}`)
                    .then(res => {
                      expect(res.status).toEqual(200);
                      expect(res.userId).toEqual(userData._id);
                      expect(res.name).toEqual('Phil');
                      expect(res.phone).toEqual(1236530000);
                      expect(res.bio).toEqual('I am Phil');
                      expect(res.residenceId).toEqual(residence._id);
                    });
                });
            });
        });
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
