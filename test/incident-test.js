'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockIncident = require('./lib/mock-incident.js');

const API_URL = process.env.API_URL;

let tempIncident;

describe('Testing Incident Model (TJay) :', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Testing POST', () => {
    it('should return 200 - blah blah', () => {
      return superagent.get(`${API_URL}/api/incidents/${tempIncident._id}`)
        .then(res => {
          expect(res.status).toEqual(200);
          // expect(res.body._id).toEqual(tempIncident._id);
          // expect(new Date(res.body.timeStamp).toEqual(tempIncident.timeStamp));
          // expect(res.body.type).toEqual('Incident');
          // expect(res.body.description).toEqual('Description of Incident');
          // expect(res.body.residenceId).toEqual(8675309);
          // expect(res.body.comments).toExist();
        })
    });

    it('should return 400 bad request', () => {
      return mockIncident.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/incidents`)
            .send({
              userId: userData._id,
              fight: 'yes',
            })
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });

    it('should return with 400 - invalid body :', () => {
      return superagent.post(`${API_URL}/api/incidents`)
        .send({})
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

  });

  describe('Testing GET - Incident Array', () => {
    it('should return 200 - blah blah', () => {

    });

    it('should return 200 - blah blah', () => {
    });

    it('Should return 404', () => {
      expect(res.status).toEqual(404);
    });
  });

});
