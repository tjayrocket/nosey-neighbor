'use strict';

const mongoose = require('mongoose');

const residenceSchema = mongoose.Schema({
<<<<<<< HEAD
  address: {type: String, required: true, minlength: 1, unique: true},
  occupants: [{type: String}],
  incidents: [{type: mongoose.Schema.Types.ObjectId, ref: 'incident'}],
=======
  address: { type: String, required: true, minlength: 1, immutable: true },
  occupants: [{ type: String }],
  incidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'incident' }]
>>>>>>> d3d0f88538b2ecd25f086e0610acdf9ba8185ec0
});

module.exports = mongoose.model('residence', residenceSchema);
