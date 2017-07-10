'use strict';

module.exports = (err, req, res, next) => {
  console.error(err.message);
  // on validation error, respond with 400 status code (bad request)
  if(err.message.toLowerCase().includes('validation failed'))
    return res.sendStatus(400);

  if(err.message.toLowerCase().includes('validationerror'))
    return res.sendStatus(400);

  // if duplicate key, respond with 409 status code (not found)
  if(err.message.toLowerCase().includes('duplicate key'))
    return res.sendStatus(409);

  // if can't find objectId
  if(err.message.toLowerCase().includes('objectid failed'))
    return res.sendStatus(404);

  // if bad password
  if(err.message.toLowerCase().includes('unauthorized'))
    return res.sendStatus(401);

  // if missing body on POST
  if(err.message.toLowerCase().includes('data and salt arguments required'))
    return res.sendStatus(400);

  // on all other errors, respond with 500 status code (internal server error)
  res.sendStatus(500);
};
