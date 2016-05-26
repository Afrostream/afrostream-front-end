'use strict';

import Q from 'q';
import _ from 'lodash';
import config from '../config';
import request from 'request';
const {apps, apiServer} = config
/**
 * call request on external api
 * @param req
 * @param path
 */
export async function getExternal (req, requestOptions) {
  return await Q.nfcall(request,
    _.merge({
        method: 'POST',
        json: true
      },
      requestOptions || {}
    )
  );
}

/**
 * call this method when you don't need the token (faster & safer)
 * @param req
 * @param path
 */
export function getData (req, path, requestOptions) {
  path = path.replace(new RegExp(`^${apiServer.urlPrefix}`), '');
  var url = `${apiServer.urlPrefix}${path}`;

  console.log('request api-front', url);

  var queryOptions = _.merge({}, req.query || {});

  return Q.nfcall(request,
    _.merge(
      {
        method: 'GET',
        json: true,
        qs: queryOptions,
        uri: url,
        headers: {
          'x-forwarded-client-ip': req.clientIp,
          'x-forwarded-user-ip': req.clientIp
        }
      },
      requestOptions || {}
    )
  );
}

/**
 * call the front-api & return the json body
 * @param req             express request object
 * @param path            front-api path
 * @param requestOptions  request options
 * @return promise<json>
 */
export async function getBodyWithoutAuth (...args) {
  const [, body] = await getData.apply(null, args);
  return body;
}

/*
 * forward backend result to the frontend.
 *
 * ex: backend.getData(req, '/api/categorys/4242').nodeify(backend.fwd(res));
 */
export function fwd (res) {
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

      res.status(backendResponse.statusCode).send(backendBody);
    }
  };
}
