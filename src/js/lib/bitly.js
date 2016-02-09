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

export async function shorten(optional) {

  let options = _.merge({
    access_token: bitly.accessToken,
    format: 'json',
    domain: bitly.domain
  }, optional);

  return await new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', config.bitUrl.shorten + '/?' + qs.stringify(options));
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log('CORS works!', xhr.responseText);
          return resolve(JSON.parse(xhr.responseText));

        } else {
          console.log('Oops', xhr);
          return reject(xhr);
        }
      }
    }
    xhr.send();
  });
}
