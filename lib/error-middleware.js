'use strict';
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error(err.message);

  // if can't find objectId
  if(err.message.toLowerCase().includes('objectid failed'))
    return res.sendStatus(404);

  // on validation error, respond with 400 status code (bad request)
  if(err.message.toLowerCase().includes('validation failed') || (err.message.toLowerCase().includes('cast to') && err.message.toLowerCase().includes('failed')))
    return res.sendStatus(400);

  if(err.message.toLowerCase().includes('validation error'))
    return res.sendStatus(400);

  // if duplicate key, respond with 409 status code (not found)
  if(err.message.toLowerCase().includes('duplicate key'))
    return res.sendStatus(409);

  // if bad password
  if(err.message.toLowerCase().includes('unauthorized'))
    return res.sendStatus(401);

  // if missing body on POST
  if(err.message.toLowerCase().includes('data and salt arguments required'))
    return res.sendStatus(400);

  // on all other errors, respond with 500 status code (internal server error)
  res.sendStatus(500);
};
