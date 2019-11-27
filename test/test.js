const assert = require('assert');
const GCApi = require('../');

const hostname = 'dev-api.g-ca.fr';

describe('GCApi', () => {
  it('should throw an error when no api key was provided', () => {
    assert.throws(() => new GCApi({}));
  });

  const app = new GCApi({
    host: hostname,
    apiKey: 'API_KEY_HERE',
  });

  it('default uri should be well formed', () => {
    const uri = app.makeUri({ pathname: '/path/test' });
    assert.equal(uri, `https://${hostname}/v1/path/test`);
  });
});
