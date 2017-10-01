'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

const API_URL = process.env.API_URL;

describe('Testing Authentication', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Sign Up POST', () => {
    it('should return 201 and a token', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          email: 'bill@test.com',
          password: 'testPASS',
        })
        .then(res => {
          expect(res.status).toEqual(201);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });
    it('should return 400 bad request', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          email: 'mike@test.com',
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(400);
          expect(res.body).toNotExist();
        });
    });
  });

  describe('Sign In GET', () => {
    it('should return 200 and a token', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.user.email}:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.email}:wrongPASS`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('Basic Auth Error GET', () => {
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`${userData.user.email}:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
            .set('Authorization', `Advanced ${encoded}`);
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
            .set('Authorization', `Basic ${encoded}`);
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          let encoded = new Buffer(`nonexistent@email.com:${userData.password}`).toString('base64');
          return superagent.get(`${API_URL}/api/signin`)
            .set('Authorization', `Advanced ${encoded}`);
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });
});
