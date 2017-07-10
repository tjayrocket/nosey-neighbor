'use strict';

require('dotenv').config({ path: `${__dirname}/../.test.env` });

const expect = require('expect');
const superagent = require('superagent');

const server = require('../lib/server.js');
const cleanDB = require('./lib/clean-db.js');
const mockUser = require('./lib/mock-user.js');

const API_URL = process.env.API_URL;

describe('testing comment router', () => {
  before(server.start);
  after(server.stop);
  afterEach(cleanDB);

  describe('testing POST /api/comments', () => {
    it('should respond with a comment', () => {
      let tempUserData;
      return mockUser
        .createOne()
        .then(userData => {
          tempUserData = userData;
          return superagent
            .post(`${API_URL}/api/profilepics`)
            .set('Authorization', `Bearer ${tempUserData.token}`)
            .field('title', 'example title')
            .field('date', Date.now())
            .attach('image', `${__dirname}/assets/data.gif`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.date).toExist();
          expect(res.body.title).toEqual('example title');
          expect(res.body.userID).toEqual(tempUserData.user._id.toString());
          expect(res.body.photoURI).toExist();
        });
    });
    it('should respond with status 400 validation failed', () => {
      let tempUserData;
      return mockUser
        .createOne()
        .then(userData => {
          tempUserData = userData;
          return superagent
            .post(`${API_URL}/api/profilepics`)
            .set('Authorization', `Bearer ${tempUserData.token}`)
            .field('title', 'example title')
            .field('date', '')
            .attach('image', `${__dirname}/assets/data.gif`);
        })
        .catch(err => {
          expect(err.status).toEqual(400);
        });
    });
    it('should respond with status 401 unauthorized', () => {
      let tempUserData;
      return mockUser
        .createOne()
        .then(userData => {
          tempUserData = userData;
          return superagent
            .post(`${API_URL}/api/profilepics`)
            .field('title', 'example title')
            .field('date', Date.now())
            .attach('image', `${__dirname}/assets/data.gif`);
        })
        .catch(err => {
          expect(err.status).toEqual(401);
        });
    });
  });
});
