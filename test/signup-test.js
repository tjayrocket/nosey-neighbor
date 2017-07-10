'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const mockUser = require('./lib/mockUser.js');

const API_URL = process.env.API_URL;

describe('Sign Up', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);
  
  describe('POST', () => {
    it('Should return a token', () => {
      return superagent.post('/api/signup')
        .send({
          email: 'bill@test.com',
          password: 'testPASS',
        })
        .then(res => {

          expect(res.body.token).toExist();
        });
    });
  });
});
