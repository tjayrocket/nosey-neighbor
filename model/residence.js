'use strict';

const mongoose = require('mongoose');

const residenceSchema = mongoose.Schema({
  address: {type: String, required: true, minlength: 1, immutable: true},
  occupants: [{type: String}],
  incidents: [{type: mongoose.Schema.Types.ObjectId, ref: 'incident'}],
});

module.exports = mongoose.model('residence', residenceSchema);
