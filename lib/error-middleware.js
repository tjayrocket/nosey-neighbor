'use strict';
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if(err.message.toLowerCase().includes('objectid failed'))
    return res.sendStatus(404);

  if(err.message.toLowerCase().includes('validation failed') || (err.message.toLowerCase().includes('cast to') && err.message.toLowerCase().includes('failed')))
    return res.sendStatus(400);

  if(err.message.toLowerCase().includes('validation error'))
    return res.sendStatus(400);

  if(err.message.toLowerCase().includes('duplicate key'))
    return res.sendStatus(409);

  if(err.message.toLowerCase().includes('unauthorized'))
    return res.sendStatus(401);

  if(err.message.toLowerCase().includes('data and salt arguments required'))
    return res.sendStatus(400);

  res.sendStatus(500);
};
