'use strict';

require('dotenv').config({path: `${__dirname}/../.test.env`});
// require('./lib/mock-aws.js');
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
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              tempUser = userData;
              return superagent.post(`${API_URL}/api/profiles`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('residenceId', residence.id.toString())
                .field('phone', '9998881234')
                .field('bio', 'I am Phil')
                .attach('image', `${__dirname}/assets/me.jpg`);
            })
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.userId).toEqual(tempUser.user._id.toString());
              expect(res.body.name).toEqual('Phil');
              expect(res.body.phone).toEqual('9998881234');
              expect(res.body.residenceId).toEqual(residence.id.toString());
              expect(res.body.bio).toEqual('I am Phil');
              expect(res.body.photoURI).toExist();
            });
        });
    });
    it('should return 400 bad request', () => {
      return mockUser.createOne()
        .then(userData => {
          return superagent.post(`${API_URL}/api/profiles`)
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
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(() => {
              return superagent.post(`${API_URL}/api/profiles`)
                .field('name', 'Phil')
                .field('phone', '9998881234')
                .field('residenceId', residence.id.toString())
                .field('bio', 'I am Phil')
                .attach('image', `${__dirname}/assets/me.jpg`)
                .then(res => {
                  throw res;
                })
                .catch(res => {
                  expect(res.status).toEqual(401);
                });
            });
        });
    });
  });

  describe('Testing GET', () => {
    let tempUser;
    it('should return 200', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              tempUser = userData;
              return superagent.post(`${API_URL}/api/profiles`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', '9998881234')
                .field('residenceId', residence.id.toString())
                .field('bio', 'I am Phil')
                .attach('image', `${__dirname}/assets/me.jpg`);
            })
            .then(profile => {
              return superagent.get(`${API_URL}/api/profiles/${profile.body._id}`)
                .then(res => {
                  expect(res.status).toEqual(200);
                  expect(res.body.userId).toEqual(tempUser.user._id.toString());
                  expect(res.body.name).toEqual('Phil');
                  expect(res.body.phone).toEqual('9998881234');
                  expect(res.body.bio).toEqual('I am Phil');
                  expect(res.body.residenceId).toEqual(residence.id.toString());
                  expect(res.body.photoURI).toExist();
                });
            });
        });
    });
    it('Should return with 404 not found', () => {
      return superagent.get(`${API_URL}/api/profiles/dasdasdasdasd`)
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
      let tempUser, tempProfile;
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              tempUser = userData;
              return superagent.post(`${API_URL}/api/profiles`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', '9998881234')
                .field('bio', 'I am Phil')
                .field('residenceId', residence.id.toString())
                .attach('image', `${__dirname}/assets/me.jpg`);
            })
            .then(profile => {
              tempProfile = profile;
              return superagent.put(`${API_URL}/api/profiles/${profile.body._id}`)
                .set('Authorization', `Bearer ${tempUser.token}`)
                .send({
                  name: 'Paul',
                  bio: 'I am no longer Phil, I am Paul'
                });
            })
            .then(res => {
              expect(res.status).toEqual(200);
              return superagent.get(`${API_URL}/api/profiles/${tempProfile.body._id}`)
                .then(res => {
                  expect(res.body.userId).toEqual(tempUser.user._id.toString());
                  expect(res.body.name).toEqual('Paul');
                  expect(res.body.phone).toEqual('9998881234');
                  expect(res.body.bio).toEqual('I am no longer Phil, I am Paul');
                  expect(res.body.residenceId).toEqual(residence.id.toString());
                  expect(res.body.photoURI).toExist();
                });
            });
        });
    });
    it('should return 400 bad request', () => {
      let tempUser;
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              tempUser = userData;
              return superagent.post(`${API_URL}/api/profiles`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', '9998881234')
                .field('bio', 'I am Phil')
                .field('residenceId', residence.id.toString())
                .attach('image', `${__dirname}/assets/me.jpg`);
            })
            .then(profile => {
              return superagent.put(`${API_URL}/api/profiles/${profile.body._id}`)
                .set('Authorization', `Bearer ${tempUser.token}`)
                .send({
                  userId: 123,
                  name: 321,
                  bio: {none: 'none'},
                });
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
      return mockResidence.createOne()
        .then(residence => {
          return superagent.post(`${API_URL}/api/profiles`)
            .field('name', 'Phil')
            .field('phone', '9998881234')
            .field('bio', 'I am Phil')
            .field('residenceId', residence.id.toString())
            .attach('image', `${__dirname}/assets/me.jpg`);
        })
        .then(profile => {
          return superagent.put(`${API_URL}/api/profiles/${profile.body._id}`)
            .field('name', 'Mike')
            .field('phone', '1234881234')
            .field('bio', 'I am mike');
        })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('Should return with 404 not found', () => {
      return mockResidence.createOne()
        .then(residence => {
          return mockUser.createOne()
            .then(userData => {
              return superagent.post(`${API_URL}/api/profiles`)
                .set('Authorization', `Bearer ${userData.token}`)
                .field('name', 'Phil')
                .field('phone', '9998881234')
                .field('bio', 'I am Phil')
                .field('residenceId', residence.id.toString())
                .attach('image', `${__dirname}/assets/me.jpg`)
                .then(() => {
                  return superagent.put(`${API_URL}/api/profiles/sdasdasdasdasdasdasdasdasdasd`)
                    .set('Authorization', `Bearer ${userData.token}`)
                    .send({
                      userId: 'jflkasjdlksajdl',
                      name: 'Paul',
                      bio: 'I am no longer Phil, I am Paul',
                    });
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
  });
});
