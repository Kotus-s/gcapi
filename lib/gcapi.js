const request = require('request-promise');
const url = require('url');

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
   * @function
   * Creates a URI object for a given pathname
   * @param {object} [options] - an object containing path information
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
   * @function
   * Creates a requestOptions object based on the default template for one
   * @param {string} uri
   * @param {object} [options] - an object containing fields and formatting how the
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
   * @name doRequest
   * @function
   * Does a request based on the requestOptions object
   * @param {object} requestOptions - fields on this object get posted as a request header
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
   * Get all the experiences accumulated by a user
   * [Doc](https://gmod-creator-area.gitlab.io/website/#get-users-experience)
   * @param {integer} userId - the unique identifier of a user
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
   * Update a stat by his name
   * [Doc](https://gmod-creator-area.gitlab.io/website/#statistics-management)
   * @param {string} statName - the name of the stat to update
   * @param {integer} value - the value to add to the current value
   * @param {boolean} shouldAppend - should append or erase the stat?
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
   * Create a short link
   * [Doc](https://gmod-creator-area.gitlab.io/website/#short-link)
   * @param {string} longUrl - the url to make shorter
   * @param {Object=} options - Extras optional options
   * @param {string=} options.code - the code wanted
   * @param {Date=} options.expires_at - the date on which you want the link to expire
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
   * Get all the warns accumulated by a user
   * [Doc](https://gmod-creator-area.gitlab.io/website/#get-users-warn)
   * @param {integer} userId - the unique identifier of a user
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
   * Create a warn for a user
   * [Doc](https://gmod-creator-area.gitlab.io/website/#warn)
   * @param {userId} userId - The user discord id to warn
   * @param {bannerId} bannerId - The user discord id who warn
   * @param {reasonOfWarn} reasonOfWarn - The reason of the warn
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
