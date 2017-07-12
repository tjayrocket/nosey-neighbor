'use strict';

let expect = require('expect');
require('./lib/mock-aws.js');

describe('basic true test', () => {
  it('should return as passing/true', () =>{
    expect(true).toEqual(true);
  });
});
