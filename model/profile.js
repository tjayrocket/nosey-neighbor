'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  name: {type: String, required: true, minlength: 1},
  residenceId: {type: mongoose.Schema.Types.ObjectId, ref: 'residence'},
  phone: {type: String, minlength: 1},
});






const residenceSchema = mongoose.Schema({
  address: {type: String, required: true, minlength: 1},
  occupants: [{type: String}],
  incidents: [{type: mongoose.Schema.Types.ObjectId, ref: 'incident'}],
});

module.exports = mongoose.model('residence', residenceSchema);
