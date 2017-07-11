'use strict';

const faker = require('faker');
const Residence = require('../../model/residence.js');

const mockResidence = module.exports = {};

mockResidence.createOne = () => {
  let result = {};
  result.address = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.stateAbbr() + ' ' + faker.address.zipCode();
  return new Residence({ address: result.address })
    .save()
    .then(residence => {
      result.id = residence._id;
      return result;
    });
};
