'use strict';

const mongoose = require('mongoose');

const residenceSchema = mongoose.Schema({
  address: {type: String, required: true, minlength: 1, unique: true},
  occupants: [{type: String}],
  incidents: [{type: mongoose.Schema.Types.ObjectId, ref: 'incidents'}],
});

module.exports = mongoose.model('residence', residenceSchema);
