'use strict';

const path = require('path');

const fs = require('fs-extra');
const { S3 } = require('aws-sdk');
const multer = require('multer');

const s3 = new S3();
const upload = multer({ dest: `${__dirname}/temp-assets` });

module.exports = fieldName => (req, res, next) => {
  upload.single(fieldName)(req, res, err => {
    if (err) return next(err);
    if (!req.file) return next(new Error('validation failed no file added'));

    s3
      .upload({
        ACL: 'public-read',
        Bucket: process.env.AWS_BUCKET,
        Key: `${req.file.filename}${path.extname(req.file.originalname)}`,
        Body: fs.createReadStream(req.file.path)
      })
      .promise()
      .then(s3Data => {
        req.s3Data = s3Data;
        return fs.remove(req.file.filename);
      })
      .then(() => {
        next();
      })
      .catch(next);
  });
};
