/**
 * Expose API encapsuled methods
 * @module GCApi
 */

const request = require('request-promise');
const url = require('url');

module.exports = class GCApi {
  /**
   * @constructor
   * @function
   * @param {GCApiOption} options
   */
  constructor(options = {}) {
    if (!(this instanceof GCApi)) {
      return new GCApi(options);
    }

    if (!options.apiKey) {
      throw new Error('Api key is required.');
    }

    this.setDefaultsOptions(options);
  }

  /**
   * @name setDefaultsOptions
   * @function
   * @private
   * @description Set default options
   * @param {GCApiOption} options
   */
  setDefaultsOptions(options) {
    this.host = options.host || 'api.g-ca.fr';
    this.protocol = options.protocol || 'https';
    this.apiKey = options.apiKey;
    this.apiVersion = options.apiVersion || '1';
    this.request = options.request || request;

    this.baseOptions = {
      sendImmediately: true,
    };

    if (options.timeout) {
      this.baseOptions.timeout = options.timeout || '1';
    }
  }

  /**
   * @typedef GCApiOption
   * @type {object}
   * @property {string} [host=api.g-ca.fr] - The client api host endpoint
   * @property {string} [protocol=https] - What protocol to use to connect to
   * @property {string} [apiKey] - The client api key which can be find on website preferences
   * @property {string} [apiVersion=1] - What version of the GCA rest api is the instance the
   * tool is connecting to?
   * @property {string} [timeout] - Integer containing the number of milliseconds to wait for a
   * server to send response headers (and start the response body) before aborting the request. Note
   * that if the underlying TCP connection cannot be established, the OS-wide TCP connection timeout
   * will overrule the timeout option ([the default in Linux can be anywhere from 20-120 *
   * seconds](http://www.sekuda.com/overriding_the_default_linux_kernel_20_second_tcp_socket_connect_timeout))
   * @property {function} [request] - What method does this tool use to make its requests?
   * Defaults to request from request-promise
   */

  /**
   * @name makeUri
   * @private
   * @function
   * @description Creates a URI object for a given pathname
   * @param {object} [options] - An object containing path information
   * @param {string} [options.pathname] - Path to the API endpoint
   * @param {string} [options.query] - Extras query parameters
   * @return {string} Value representing the encoded URI endpoint
   */
  makeUri({ pathname, query }) {
    const versionPath = `/v${this.apiVersion}`;
    const uri = url.format({
      protocol: this.protocol,
      hostname: this.host,
      pathname: `${versionPath}${pathname}`,
      query,
    });
    return decodeURIComponent(uri);
  }

  /**
   * @name makeRequestHeader
   * @private
   * @function
   * @description Creates a requestOptions object based on the default template
   * @param {string} uri -
   * @param {object} [options] - An object containing fields and formatting how the
   * @param {string} [options.method] - HTTP Method that should be used
   * @param {object} [options.body] - Body parameters to send
   * @return {GCApiRequestHeaders} Object representing and containing all request headers
   * @see {@link GCApiRequestHeaders}
   */
  makeRequestHeader(uri, options = {}) {
    return {
      ...this.baseOptions,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: options.method || 'GET',
      uri,
      json: true,
      ...options,
    };
  }

  /**
   * @typedef GCApiRequestHeaders
   * @type {object}
   * @property {string} [method] - HTTP Method to use
   * @property {string} [uri] - Encoded URI endpoint
   * @property {string} [json=true] - Is a Json request ?
   * @property {options} [options] - Additional request headers
   * @property {objects} [headers] - The client api host endpoint
   * @property {string} [headers.Authorization=Bearer {token}] - Token to authenticate the request
   * @property {string} [headers.Accept=application/json] - Json headers
   * @property {string} [headers.Content-Type=application/json] - Json headers
   */

  /**
   * @name doRequest
   * @private
   * @function
   * @description Build a request based on the requestOptions object
   * @throws {Error} Throw the errors messages of the responses
   * @param {GCApiRequestHeaders} requestOptions - All headers of the request
   * @return {Promise}
   * @see {@link GCApiRequestHeaders}
   */
  async doRequest(requestOptions) {
    const response = await this.request(requestOptions || {});

    if (response) {
      if (Array.isArray(response.errorMessages) && response.errorMessages.length > 0) {
        throw new Error(response.errorMessages.join(', '));
      }
    }

    return response;
  }

  /**
   * @name getUserExperience
   * @function
   * @public
   * @description Get all the experiences accumulated by a user
   * @async
   * @see {@link https://gmod-creator-area.gitlab.io/website/#get-users-experience|Documentation}
   * @param {integer} userId - The unique identifier of a user
   * @return {Promise}
   */
  async getUserExperience(userId) {
    const requestHeaders = this.makeRequestHeader(
      this.makeUri({
        pathname: `/users/${userId}/experience`,
      }),
    );
    const response = await this.doRequest(requestHeaders);
    return response;
  }

  /**
   * @name updateStats
   * @function
   * @public
   * @description Update a stat by his name
   * @async
   * @see {@link https://gmod-creator-area.gitlab.io/website/#statistics-management|Documentation}
   * @param {string} statName - The name of the stat to update
   * @param {integer} value - The value to add to the current value
   * @param {boolean} shouldAppend - Should append or erase the stat?
   * @return {Promise}
   */
  async updateStats(statName, statValue, shouldAppend = true) {
    const requestHeaders = this.makeRequestHeader(
      this.makeUri({
        pathname: `/stats/${statName}`,
      }),
      {
        method: 'PUT',
        body: {
          value: statValue,
          append: shouldAppend,
        },
      },
    );
    const response = await this.doRequest(requestHeaders);
    return response;
  }

  /**
   * @name createShortLink
   * @function
   * @public
   * @description Create a short link
   * @async
   * @see {@link https://gmod-creator-area.gitlab.io/website/#short-link|Documentation}
   * @param {string} longUrl - The url to make shorter
   * @param {Object=} options - Extras optional options
   * @param {string=} options.code - The code wanted
   * @param {Date=} options.expires_at - The date on which you want the link to expire
   * @return {Promise}
   */
  async createShortLink(longUrl, options = {}) {
    const parameters = {
      url: longUrl,
    };
    if (options.code) parameters.code = options.code;
    if (options.expires_at) parameters.expires_at = options.expires_at;

    const requestHeaders = this.makeRequestHeader(
      this.makeUri({
        pathname: '/shortlinks',
      }),
      {
        method: 'POST',
        body: parameters,
      },
    );
    const response = await this.doRequest(requestHeaders);
    return response;
  }

  /**
   * @name getUserWarns
   * @function
   * @public
   * @description Get all the warns accumulated by a user
   * @async
   * @see {@link https://gmod-creator-area.gitlab.io/website/#get-users-warn|Documentation}
   * @param {integer} userId - The unique identifier of a user
   * @return {Promise}
   */
  async getUserWarns(userId) {
    const requestHeaders = this.makeRequestHeader(
      this.makeUri({
        pathname: `/users/${userId}/warn`,
      }),
    );
    const response = await this.doRequest(requestHeaders);
    return response;
  }

  /**
   * @name createUserWarn
   * @function
   * @public
   * @description Create a warn for a user
   * @async
   * @see {@link https://gmod-creator-area.gitlab.io/website/#warn|Documentation}
   * @param {userId} userId - The user discord id to warn
   * @param {bannerId} bannerId - The user discord id who warn
   * @param {reasonOfWarn} reasonOfWarn - The reason of the warn
   * @return {Promise}
   */
  async createUserWarn(userId, bannerId, reasonOfWarn) {
    const requestHeaders = this.makeRequestHeader(
      this.makeUri({
        pathname: `/users/${userId}/warn`,
      }),
      {
        method: 'POST',
        body: {
          banned_by: bannerId,
          reason: reasonOfWarn,
        },
      },
    );
    const response = await this.doRequest(requestHeaders);
    return response;
  }
};
