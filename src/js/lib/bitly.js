'use strict';
import request from 'superagent';
import Promise from 'bluebird';
import _ from 'lodash';
import qs from 'qs';
import xhr from 'xhr';
import {bitly} from '../../../config';

const config = {
  bitUrl: {
    access_token: 'https://api-ssl.bitly.com/oauth/access_token',
    shorten: 'https://api-ssl.bitly.com/v3/shorten'
  }
};

export async function shorten(optional) {

  let options = _.merge({
    access_token: bitly.accessToken,
    format: 'json',
    domain: bitly.domain
  }, optional);

  return await new Promise((resolve, reject) => {
    xhr({
      uri: `${config.bitUrl.shorten}/?${qs.stringify(options)}`
    }, function (err, resp, body) {
      if (err) {
        return reject(xhr);
      }
      return resolve(JSON.parse(body));
    });
  });
}
