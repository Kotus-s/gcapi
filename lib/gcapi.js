module.exports = class GCAPi {
  /**
   * @constructor
   * @function
   * @param {GCApiOption} options
   */
  constructor(options = {}) {
    if (!(this instanceof GCAPi)) {
      return new GCAPi(options);
    }

    if (!options.apiKey) {
      throw new Error('Api key is required.');
    }

    this.setDefaultsOptions(options);
  }

  /**
   * Set default options
   *
   * @param {GCApiOption} options
   */
  setDefaultsOptions(options) {
    this.apiKey = options.apiKey;
    this.apiVersion = options.apiVersion || '1';
  }

  /**
   * @typedef GCApiOption
   * @type {object}
   * @property {string} apiKey - The client api key wich can be find on website preferences
   * @property {string} [apiVersion=1] - What version of the GCA rest api is the instance the
   * tool is connecting to?
   */
};
