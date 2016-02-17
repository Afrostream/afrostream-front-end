'use strict';
import createAPI from '../../../src/js/lib/createAPI';
import { apiServer } from '../../../config';
import request from 'request';
import qs from 'qs';
import Q from 'q';
import _ from 'lodash';
import config from '../../../config';

/**
 * call this method when you don't need the token (faster & safer)
 * @param req
 * @param path
 */
let getDataWithoutAuth = function (req, path, requestOptions) {
  path = path.replace(new RegExp(`^${apiServer.urlPrefix}`), '');
  var url = `${apiServer.urlPrefix}${path}`;
  console.log('createAPI url', url);

  return Q.nfcall(request,
    _.merge(
      {
        method: 'GET',
        json: true,
        qs: req.query,
        uri: url,
        headers: {
          'x-forwarded-clientip': req.clientIp, // FIXME: to be removed
          'x-forwarded-client-ip': req.clientIp
        }
      },
      requestOptions || {}
    )
  );
};

/*
 * forward backend result to the frontend.
 *
 * ex: backend.getData(req, '/api/categorys/4242').nodeify(backend.fwd(res));
 */
let fwd = function (res) {
  return function (err, data) {
    if (err) {
      res.status(500).json({error: String(err)});
    } else {
      var backendResponse = data[0]
        , backendBody = data[1];
      switch (backendResponse.statusCode) {
        case 301:
        case 302:
          if (backendResponse.headers &&
            backendResponse.headers.location) {
            res.set('location', backendResponse.headers.location);
          }
          break;
        default:
          break;
      }
      const layout = 'layouts/payment-success';
      res.status(backendResponse.statusCode).render(layout, _.merge({
        token: null,
        refreshToken: null,
        storageId: config.apiClient.token,
        storageRefreshId: config.apiClient.tokenRefresh
      }, backendBody));
    }
  };
};

exports.getIdToken = function (req, res) {
  res.noCache();
  getDataWithoutAuth(req, '/billing/gocardless', {followRedirect: false}).nodeify(fwd(res));
};

exports.callback = function (req, res) {
  res.noCache();
  getDataWithoutAuth(req, '/billing/gocardless/callback', {followRedirect: false}).nodeify(fwd(res));
};

exports.failure = function (req, res) {
  res.noCache();
  res.json({type: 'failure'});
};
