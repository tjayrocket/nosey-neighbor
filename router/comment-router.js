'use strict';

const jsonParser = require('body-parser').json();
const { Router } = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Comment = require('../model/comment.js');

const commentRouter = (module.exports = new Router());

commentRouter.post(
  '/api/comments',
  jsonParser,
  bearerAuth,
  (req, res, next) => {
    console.log('hit POST /api/comments');
    new Comment(req.body)
      .save()
      .then(comment => res.status(201).json(comment._id))
      .catch(next);
  }
);

commentRouter.get('/api/comments/:id', (req, res, next) => {
  console.log('hit GET /api/comments/:id');
  Comment.findById(req.params.id)
    .then(comment => res.status(200).json(comment))
    .catch(next);
});

commentRouter.get('/api/comments', (req, res, next) => {
  console.log('hit GET /api/comments');

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
    console.log('hit PUT /api/comments/:id');

    Comment.findByIdAndUpdate(req.params.id, req.body)
      .then(comment => res.status(202).json(comment))
      .catch(next);
  }
);

commentRouter.delete('/api/comments/:id', (req, res, next) => {
  console.log('hit DELETE /api/comments/:id');

  Comment.findByIdAndRemove(req.params.id).then(res.status(204)).catch(next);
});
