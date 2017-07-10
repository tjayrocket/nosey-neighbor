'use strict';

const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  incidentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  commentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content: { type: String, required: true, minlength: 1 },
  timeStamp: { type: Date, required: true }
});

module.exports = mongoose.model('comment', commentSchema);
