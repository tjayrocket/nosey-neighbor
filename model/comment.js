'use strict';

const mongoose = require('mongoose');
const Incident = require('./incident.js');

const commentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'incident', required: true },
  content: { type: String, required: true, minlength: 1 },
  timeStamp: { type: Date, default: Date.now() }
});

commentSchema.pre('save', function(next) {
  Incident.findById(this.incidentId)
    .then(() => next())
    .catch(() =>
      next(
        new Error(
          'Validation failed - failed to create Incident, incident does not exist'
        )
      )
    );
});

commentSchema.post('save', function(doc, next) {
  Incident.findById(doc.incidentId)
    .then(incident => {
      let commentIDSet = new Set(incident.comments);
      commentIDSet.add(this._id.toString());
      incident.comments = Array.from(commentIDSet);
      return incident.save();
    })
    .then(() => next())
    .catch(next);
});

commentSchema.post('remove', function(doc, next) {
  Incident.findById(doc.incidentId)
    .then(incident => {
      incident.comments = incident.comments.filter(
        comment => comment._id !== doc._id
      );
      return incident.save();
    })
    .then(() => next)
    .catch(next);
});

module.exports = mongoose.model('comment', commentSchema);
