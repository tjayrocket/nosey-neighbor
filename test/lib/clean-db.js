'use strict';

const User = require('../../model/user.js');
const Comment = require('../../model/comment.js');
const Incident = require('../../incident.js');
const Profile = require('../../profile.js');
const Residence = require('../../model/residence.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Comment.remove({}),
    Incident.remove({}),
    Profile.remove({}),
    Residence.remove({}),
  ]);
};
