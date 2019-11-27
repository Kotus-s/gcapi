const assert = require('assert');
const GCApi = require('../');

describe('GCApi', () => {
  it('should throw an error when no api key was provided', () => {
    assert.throws(() => new GCApi({}), 'Api key is required.');
  });
});
