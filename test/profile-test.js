'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
require('./lib/mock-aws.js');
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
      let tempUser;
      return mockUser.createOne()
        .then(userData => {
          tempUser = userData;
          return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
            .set('Authorization', `Bearer ${userData.token}`)
            .field('name', 'Phil')
            .field('phone', 9998881234)
            .field('bio', 'I am Phil')
            .attach('image', `${__dirname}/assets/me.jpg`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res._id).toEqual(tempUser._id);
          expect(res.body.name).toEqual('Phil');
          expect(res.body.phone).toEqual(9998881234);
          expect(res.body.bio).toEqual('I am Phil');
          expect(res.body.imageURI).toExist();
        });
    });
    it('should return 400 bad request', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
            .set('Authorization', `Bearer ${userData.token}`)
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
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
            .set('Authorization', `Bearer skdfhskjdfhakdjf`)
            .then(userData => {
              return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', 9998881234)
                .field('bio', 'I am Phil')
                .attach('image', `${__dirname}/assets/me.jpg`);
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
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profiles/asdasdasdasd`)
            .set('Authorization', `Bearer ${userData.token}`)
            .then(userData => {
              return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', 9998881234)
                .field('bio', 'I am Phil')
                .attach('image', `${__dirname}/assets/me.jpg`);
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

  describe('Testing GET - Incident Array', () => {
    it('should return 200', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', 9998881234)
                .field('bio', 'I am Phil')
                .attach('image', `${__dirname}/assets/me.jpg`)
                .then(() => {
                  return superagent.get(`${API_URL}/api/profiles/${userData._id}`)
                    .then(res => {
                      expect(res.status).toEqual(200);
                      expect(res.body.userId).toEqual(userData._id);
                      expect(res.body.name).toEqual('Phil');
                      expect(res.body.phone).toEqual(1236530000);
                      expect(res.body.bio).toEqual('I am Phil');
                      expect(res.body.residenceId).toEqual(residence._id);
                      expect(res.body.imageURI).toExist();
                    });
                });
            });
        });
    });
    it('Should return with 404 not found', () => {
      return superagent.get(`${API_URL}/api/profiles/asdasdasdasd`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });

  describe('Testing PUT', () => {
    it('should return 200', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', 9998881234)
                .field('bio', 'I am Phil')
                .field('residenceId', residence._id)
                .attach('image', `${__dirname}/assets/me.jpg`)
                .then(() => {
                  return superagent.put(`${API_URL}/api/profiles/${userData._id}`)
                    .set('Authorization', `Bearer ${userData.token}`)
                    .send({
                      name: 'Paul',
                      bio: 'I am no longer Phil, I am Paul',
                    })
                    .then(res => {
                      expect(res.body.status).toEqual(200);
                      expect(res.body.userId).toEqual(userData._id);
                      expect(res.body.name).toEqual('Paul');
                      expect(res.body.phone).toEqual(1236530000);
                      expect(res.body.bio).toEqual('I am no longer Phil, I am Paul');
                      expect(res.body.residenceId).toEqual(residence._id);
                      expect(res.body.imageURI).toExist();
                    });
                });
            });
        });
    });
    it('should return 400 bad request', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              return superagent.post(`${API_URL}/api/profiles/${userData._id}`)
                .set('Authorization', `Bearer ${userData.token}`)
                .send({
                  residenceId: residence._id,
                  name: 'Phil',
                  phone: 1236530000,
                  bio: 'I am Phil',
                })
                .then(() => {
                  return superagent.put(`${API_URL}/api/profiles/${userData._id}`)
                    .set('Authorization', `Bearer ${userData.token}`)
                    .send({
                      userId: 'jflkasjdlksajdl',
                      name: 'Paul',
                      bio: 'I am no longer Phil, I am Paul',
                    })
                    .then(res => {
                      expect(res.status).toEqual(400);
                      expect(res.body.userId).toEqual(userData._id);
                      expect(res.body.name).toEqual('Paul');
                      expect(res.body.phone).toEqual(1236530000);
                      expect(res.body.bio).toEqual('I am no longer Phil, I am Paul');
                      expect(res.body.residenceId).toEqual(residence._id);
                      expect(res.body.imageURI).toExist();
                    });
                });
            });
        });
    });
    it('should return 401 unauthorized', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.put(`${API_URL}/api/profiles/${userData._id}`)
            .set('Authorization', `Bearer skdfhskjdfhakdjf`)
            .send({
              name: 'Phil',
              phone: 1236530000,
              bio: 'I am Phil',
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
      return superagent.put(`${API_URL}/api/profiles/asdasdasdasd`)
        .send({
          nope: 'non existent',
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
