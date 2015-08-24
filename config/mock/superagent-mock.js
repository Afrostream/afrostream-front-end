'use strict';

import qs from 'qs';
import config from './superagent-mock-config';
import argv from 'optimist';
argv.describe('mock')
  .alias('m', 'mock')
  .default(false)
  .argv;
/**
 * Installs the `mock` extension to superagent.
 * based on https://github.com/M6Web/superagent-mock thk's to @oziks https://twitter.com/oziks
 */
export default function (superagent) {
  const env = process.env.NODE_ENV || 'development';
  if (argv.mock === undefined || !~'development'.indexOf(env)) {
    return;
  }
  var Request = superagent.Request;
  var parsers = [];

  var oldSend = Request.prototype.send;
  var oldEnd = Request.prototype.end;
  /**
   * Attempt to match url against the patterns in fixtures.
   */
  const testUrlForPatterns = function (url) {

    if (parsers[url]) {
      return;
    }

    let match = config.filter((parser) => {
        return new RegExp(parser.pattern, 'g').test(url);
      })[0] || null;

    if (match) {
      parsers[url] = match;
    }
  };


  /**
   * Override send function
   */
  Request.prototype.send = function (data) {

    testUrlForPatterns(this.url);

    var parser = parsers[this.url];
    if (parser) {
      this.params = data;

      return this;
    } else {
      return oldSend.call(this, data);
    }

  };

  /**
   * Override end function
   */
  Request.prototype.end = function (fn) {

    var path = this.url;
    var querystring = '';

    if (this._query) {
      querystring += this._query.join('&');
    } else {
      if (this.qs) {
        querystring += qs.stringify(this.qs);
      }
      if (this.qsRaw) {
        querystring += this.qsRaw.join('&');
      }
    }


    if (querystring.length) {
      path += (~path.indexOf('?') ? '&' : '?') + querystring;
    }

    var parser = parsers[this.url];

    if (parser) {
      var match = new RegExp(parser.pattern, 'g').exec(path);

      try {
        var fixtures = parser.fixtures(match, this.params);
        fn(null, parsers[this.url].callback(match, fixtures));
      } catch (err) {
        fn(err, undefined);
      }
    } else {
      oldEnd.call(this, fn);
    }
  };
}
