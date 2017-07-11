'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', unique: true},
  name: {type: String, required: true, minlength: 1},
  residenceId: {type: mongoose.Schema.Types.ObjectId, ref: 'residence'},
  phone: {type: String, minlength: 1},
  bio: {type: String, minlength: 1},
});

module.exports = mongoose.model('profile', profileSchema);
