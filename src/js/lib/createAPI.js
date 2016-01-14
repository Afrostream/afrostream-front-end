import Promise from 'bluebird';
import _ from 'lodash';
import qs from 'qs';
import URL from 'url';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
/**
 * return api function base on createRequest function
 * Usage:
 *   api('/users/facebook')
 *   api('/users/facebook/repos')
 *   ...
 *
 * createRequest() may different from client and server sides
 * You can see createRequest() at:
 * Client: ../main.js
 * Server: /lib/render.js
 */
export default function createAPI(createRequest) {
  return async function api(path, method = 'GET', params = {}, token = null, refreshToken = null) {
    var { pathname, query: queryStr } = URL.parse(path);
    var query, headers, body;

    if (_.isObject(method)) {
      params = method;
      method = 'GET';
    }

    query = qs.parse(queryStr);

    if (method === 'GET') {
      if (token) {
        params.afro_token = token;
      }
      if (refreshToken) {
        params.afro_refresh_token = refreshToken;
      }
      if (params && _.isObject(params)) {
        _.assign(query, params);
      }

    } else {
      body = params;
      if (token) {
        body.afro_token = token;
      }
      if (refreshToken) {
        body.afro_refresh_token = refreshToken;
      }
    }
    return await new Promise((resolve, reject) => {
      createRequest({method, headers, pathname, query, body})
        .end((err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res);
        });
    });
  };
}
