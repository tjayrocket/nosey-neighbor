'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  tokenSeed: { type: String, required: true, unique: true }
});

userSchema.methods.passwordHashCreate = function(password) {
  return bcrypt.hash(password, 8).then(hash => {
    this.passwordHash = hash;
    return this;
  });
};

userSchema.methods.passwordHashCompare = function(password) {
  return bcrypt.compare(password, this.passwordHash).then(isCorrect => {
    if (isCorrect) return this;
    throw new Error('Unauthorized, password does not match');
  });
};

userSchema.methods.tokenSeedCreate = function() {
  return new Promise((resolve, reject) => {
    let tries = 1;

    let _tokenSeedCreate = () => {
      this.tokenSeed = crypto.randomBytes(32).toString('hex');
      this.save().then(() => resolve(this)).catch((err) => {
        if (tries < 1)
          return reject(new Error(err));
        tries--;
        _tokenSeedCreate();
      });
    };
    _tokenSeedCreate();
  });
};

userSchema.methods.tokenCreate = function() {
  return this.tokenSeedCreate().then(() =>
    jwt.sign({ tokenSeed: this.tokenSeed }, process.env.APP_SECRET)
  );
};

const User = module.exports = mongoose.model('user', userSchema);

User.create = data => {
  let password = data.password;
  delete data.password;
  return new User(data)
    .passwordHashCreate(password)
    .then(user => user.tokenCreate());
};
