'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');

const API_URL = process.env.API_URL;

describe('Testing Incident Model', () => {
  before(server.start);
  after(server.stop);
  // afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 200 - blah blah', () => {
    });
  });

  describe('Testing GET - Incident Array', () => {
    it('should return 200 - blah blah', () => {
    });
  });

  describe('Testing GET - Whole Object', () => {
    it('should return 200 - blah blah', () => {
    });
  });

  it('should return with 404 - Valid request, no id :', () => {
    return superagent.get(`${API_URL}/api/incidents/`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
  });
});
