'use strict';

const mongoose = require('mongoose');

const incidentSchema = mongoose.schema({
  userId: {type:mongoose.Schema.Types.ObjectId, required: true},
  timeStamp: {type:Date, default: Date.now},
  type: {type:String, required: true},
  description: {type:String, required: true},
  residenceId: {type: mongoose.Schema.Types.ObjectId, ref: 'residence'},
  comments: {type:String},
});
