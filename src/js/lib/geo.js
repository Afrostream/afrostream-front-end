import config from '../../../config';
import request from 'superagent';

const { apiClient: { protocol, authority }} = config;

export async function isAuthorized() {
  return await new Promise((resolve, reject) => {
    const url = protocol + '://' + authority + '/auth/geo';

    request
      .get(url)
      .type('json')
      .end((err, response) => {
        if (err) {
          return reject(err);
        }
        if (!response ||
            !response.body ||
            typeof response.body.authorized === 'undefined') {
          return resolve(true);
        }
        return resolve(response.body.authorized);
      });
  });
}