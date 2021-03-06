'use strict';

require('dotenv').config({ path: `${__dirname}/../.test.env` });
require('./lib/mock-aws.js');
const superagent = require('superagent');
const expect = require('expect');
const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockIncident = require('./lib/mock-incident.js');
const Incident = require('../model/incident.js');

const API_URL = process.env.API_URL;

describe('Testing Comment Model', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('Comment POST', () => {
    it('should return 201 and the incident', () => {
      return mockIncident.createOne().then(incidentData => {
        return superagent
          .post(`${API_URL}/api/comments`)
          .set('Authorization', `Bearer ${incidentData.userToken}`)
          .send({
            incidentId: incidentData.id,
            content: 'Jannets dog was in my yard, digging in garden'
          })
          .then(res => {
            expect(res.status).toEqual(201);
            expect(res.body._id).toExist();
            expect(res.body.content).toEqual(
              'Jannets dog was in my yard, digging in garden'
            );
            expect(res.body.timeStamp).toExist();
          });
      });
    });
    it('should return 401 unauthorized', () => {
      return mockIncident.createOne().then(incidentData => {
        return superagent
          .post(`${API_URL}/api/comments`)
          .set('Authorization', `Bearer`)
          .send({
            incidentId: incidentData.id,
            content: 'Jannets dog was in my yard, digging in garden'
          })
          .catch(res => {
            expect(res.status).toEqual(401);
          });
      });
    });

    it('should return 400 bad request', () => {
      return mockIncident.createOne().then(incidentData => {
        return superagent
          .post(`${API_URL}/api/comments/`)
          .set('Authorization', `Bearer ${incidentData.userToken}`)
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
      return mockIncident.createOne().then(incidentData => {
        return (
          superagent
            .post(`${API_URL}/api/comments`)
            .send({
              incidentId: incidentData.id,
              content: 'Jannets dog was in my yard, digging in garden'
            })
            .catch(err => {
              expect(err.status).toEqual(401);
            })
        );
      });
    });
    it('should return 404 not found', () => {
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

  describe('Comment GET', () => {
    it('should return 200 and an array', () => {
      return mockIncident
        .createOne()
        .then(incidentData => {
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(() => {
              return superagent
                .get(`${API_URL}/api/comments/`)
                .then(res => {
                  expect(res.status).toEqual(200);
                  expect(res.body[0]._id).toExist();
                  expect(res.body[0].content).toEqual(
                    'Neighbors are outside again, theres at least 20 cars at their house'
                  );
                  expect(res.body[0].timeStamp).toExist();
                });
            });
        });
    });
    it('should return 404 not found', () => {
      return superagent
        .get(`${API_URL}/api/comments/asdasdasdasd`)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('Comment PUT', () => {
    it('should return 202 and the new comment', () => {
      return mockIncident
        .createOne()
        .then(incidentData => {
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(res => {
              return superagent
                .put(`${API_URL}/api/comments/${res.body._id}`)
                .set('Authorization', `Bearer ${incidentData.userToken}`)
                .send({
                  incidentId: res.body.incidentId,
                  content: 'Neighbors are outside again, theres like 100 cars at their house'
                })
                .then(res => {
                  expect(res.status).toEqual(202);
                  expect(res.body._id).toExist();
                  expect(res.body.content).toEqual(
                    'Neighbors are outside again, theres like 100 cars at their house'
                  );
                  expect(res.body.timeStamp).toExist();
                });
            });
        });
    });
    it('should return 400 bad request', () => {
      return mockIncident
        .createOne()
        .then(incidentData => {
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(res => {
              return superagent
                .put(`${API_URL}/api/comments/${res.body._id}`)
                .set('Authorization', `Bearer ${incidentData.userToken}`)
                .send({})
                .catch(err => {
                  expect(err.status).toEqual(400);
                });
            });
        });
    });
    it('should return 404 not found', () => {
      return mockIncident
        .createOne()
        .then(incidentData => {
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(res => {
              return superagent
                .put(`${API_URL}/api/comments/jhfkalsjdhfaksldhf`)
                .set('Authorization', `Bearer ${incidentData.userToken}`)
                .send({
                  incidentId: res.body.incidentId,
                  content: 'Neighbors are outside again, theres like 100 cars at their house'
                })
                .catch(err => {
                  expect(err.status).toEqual(404);
                });
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockIncident
        .createOne()
        .then(incidentData => {
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(res => {
              return superagent
                .put(`${API_URL}/api/comments/${res.body._id}`)
                .send({
                  incidentId: res.body.incidentId,
                  content: 'Neighbors are outside again, theres like 100 cars at their house'
                })
                .catch(err => {
                  expect(err.status).toEqual(401);
                });
            });
        });
    });

  });

  describe('Comment DELETE', () => {
    it('should return 204 deleted', () => {
      let tempIncident;
      return mockIncident
        .createOne()
        .then(incidentData => {
          tempIncident = incidentData;
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(res => {
              return superagent.delete(`${API_URL}/api/comments/${res.body._id}`)
                .set('Authorization', `Bearer ${incidentData.userToken}`);
            })
            .then(res => {
              expect(res.status).toEqual(204);
              return Incident.findById(tempIncident.incident._id);
            })
            .then(incident => {
              expect(incident.comments.length).toEqual(0);
            });
        });
    });
    it('should return 404 not found', () => {
      return mockIncident
        .createOne()
        .then(incidentData => {
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(() => {
              return superagent
                .delete(`${API_URL}/api/comments/jhfkalsjdhfaksldhf`)
                .set('Authorization', `Bearer ${incidentData.userToken}`)
                .catch(res => {
                  expect(res.status).toEqual(404);
                });
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockIncident
        .createOne()
        .then(incidentData => {
          return superagent
            .post(`${API_URL}/api/comments/`)
            .set('Authorization', `Bearer ${incidentData.userToken}`)
            .send({
              incidentId: incidentData.id,
              content: 'Neighbors are outside again, theres at least 20 cars at their house'
            })
            .then(res => {
              return superagent
                .delete(`${API_URL}/api/comments/${res.body._id}`)
                .catch(err => {
                  expect(err.status).toEqual(401);
                });
            });
        });
    });

  });
});
