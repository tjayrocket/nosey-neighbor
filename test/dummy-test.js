'use strict';

let expect = require('expect');
require('./lib/mock-aws.js');

describe('Testing Basic true test', () => {
  it('should pass', () =>{
    expect(true).toEqual(true);
  });
});
