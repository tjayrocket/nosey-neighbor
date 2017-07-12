'use strict';

const awsMock = require('aws-sdk-mock');

awsMock.mock('S3', 'upload', function(params, callback) {
  if(params.ACL !== 'public-read')
    return callback(new Error('ACL must be public-read'));
  if(params.Bucket !== 'nosy-neighbor-profile')
    return callback(new Error('bucket must be nosy-neighbor-profile'));
  if(!params.Key)
    return callback(new Error('key must be set'));
  if(!params.Body)
    return callback(new Error('body must be set'));

  callback(null, {
    Key: params.Key,
    Location: `fakeaws.s3.com/nosy-neighbor-profile/${params.Key}`,
  });
});

awsMock.mock('S3', 'deleteObject', function(params, callback){
  if(!params.Key)
    return callback(new Error('must have key set'));
  if(!params.Bucket)
    return callback(new Error('bucket must be nosy-neighbor-profile'));

  callback();
});
