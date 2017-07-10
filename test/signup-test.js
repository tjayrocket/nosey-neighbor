'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');

const API_URL = process.env.API_URL;

describe('Sign Up', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('POST', () => {
    it('Should return 200 and a token', () => {
      return superagent.post(`${API_URL}/api/signup`)
        .send({
          email: 'bill@test.com',
          password: 'testPASS',
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.text).toExist();
          expect(res.text.length > 1).toBeTruthy();
        });
    });
    it('Should return 400 bad request', () => {
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
});
