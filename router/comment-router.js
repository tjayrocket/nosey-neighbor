'use strict';

const jsonParser = require('body-parser').json();
const { Router } = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Comment = require('../model/comment.js');

const commentRouter = module.exports = new Router();

commentRouter.post(
  '/api/comments',
  jsonParser,
  bearerAuth,
  (req, res, next) => {
    new Comment(req.body)
      .save()
      .then(comment => res.status(201).json(comment))
      .catch(next);
  }
);

commentRouter.get('/api/comments/:id', (req, res, next) => {
  Comment.findById(req.params.id)
    .then(comment => res.status(200).json(comment))
    .catch(next);
});

commentRouter.get('/api/comments', (req, res, next) => {

  let pageNumber = Number(req.query.page);
  if (!pageNumber || pageNumber < 1) pageNumber = 1;
  pageNumber--;

  Comment.find({})
    .sort({ timeStamp: 'asc' })
    .skip(pageNumber * 5)
    .limit(5)
    .then(comment => res.status(200).json(comment))
    .catch(next);
});

commentRouter.put(
  '/api/comments/:id',
  jsonParser,
  bearerAuth,
  (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.id, req.body)
      .then(comment => res.status(202).json(comment))
      .catch(next);
  }
);

commentRouter.delete('/api/comments/:id', bearerAuth, (req, res, next) => {
  Comment.findByIdAndRemove(req.params.id)
    .then(() => res.sendStatus(204))
    .catch(next);
});
