'use strict';

describe('Lets make this TRUE!', () => {
  before(server.start);
  after(server.stop);

  it('should be true', () => {
    expect(true).toEqual(true);
  });
});
