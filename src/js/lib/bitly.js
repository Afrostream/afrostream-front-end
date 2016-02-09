'use strict';
import request from 'superagent';
import Promise from 'bluebird';
import _ from 'lodash';
import qs from 'qs';
import {bitly} from '../../../config';

const config = {
  bitUrl: {
    access_token: 'https://api-ssl.bitly.com/oauth/access_token',
    shorten: 'https://api-ssl.bitly.com/v3/shorten'
  }
};

const headers =
{
  'content-type': 'application/x-www-form-urlencoded',
  'X-Accept': 'application/json'
};

export async function shorten(optional) {

  let options = _.merge({
    access_token: bitly.accessToken,
    format: 'json',
    domain: bitly.domain
  }, optional);

  let body = {};

  return await new Promise((resolve, reject) => {
    request('GET', config.bitUrl.shorten)
      .query(qs.stringify(options))
      .set(headers)
      .send(body)
      .end((err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
  });
}
