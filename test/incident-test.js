'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
const superagent = require('superagent');
const expect = require('expect');

const incidentRouter = require('../router/incident-router.js')
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
      return mockIncident.createone()
        .then(userData => {
          return superagent.post(`${API_URL}/api/incidents`)
            .send({
              id: userData._id,
              timeStamp: Date.now(),
              type: 'HOA-Explosion',
              description: 'Bob Blew up.',
              residenceId: userData.residenceId,
              comments: 'Blah'
            })
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.id).toEqual(userData._id);
              expect(res.timeStamp).toEqual(Date.now());
              expect(res.type).toEqual('HOA-Explosion');
              expect(res.description).toEqual('Bob Blew up.');
              expect(res.residenceId).toEqual(userData.residenceId);
              expect(res.comments).toEqual('Blah');
            });
        });
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

    });
  });

});
