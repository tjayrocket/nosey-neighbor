'use strict';

const mongoose = require('mongoose');

const incidentSchema = mongoose.schema({
  userId: {type:mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
  timeStamp: {type:Date, default: Date.now()},
  type: {type:String, required: true},
  description: {type:String, required: true},
  residenceId: {type: mongoose.Schema.Types.ObjectId, ref: 'residence', required: true},
  comments: [{type:String}],
});

incidentSchema.pre('save', function(next){
  Residence.findById(this.residence)
    .then(() => next())
    .catch(() => next(new Error('Validation failed - failed to create Incident, residence does not exist')));
});

incidentSchema.pre('save', function(next){
  Residence.findById(doc.residence)
    .then(residence => {
      let incidentIDSet = new Set(residence.incidents);
      incidentIDSet.add(this._id.toString());
      residence.incidents = Array.from(incidentIDSet);
      return residence.save();
    })
    .then(() => next())
    .catch(next);
});

incidentSchema.post('remove', function(doc, next) {
  Residence.findById(doc.residence)
    .then(residence => {
      residence.incidents = residence.incidents.filter(incident => incident._id !== doc._id);
      return residence.save();
    })
    .then(() => next)
    .catch(next);
});
