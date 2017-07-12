'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', unique: true, required: true},
  name: {type: String, minlength: 1, required: true},
  photoURI: {type: String, minlength: 1, required: true},
  residenceId: {type: mongoose.Schema.Types.ObjectId, ref: 'residence', required: true},
  phone: {type: String, minlength: 1, required: true},
  bio: {type: String, minlength: 1, required: true},
});

module.exports = mongoose.model('profile', profileSchema);
