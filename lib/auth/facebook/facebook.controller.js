'use strict';

import { getData, fwd } from '../../api-front';
import {apiClient} from '../../../config';

export function checkAuth(req, res) {
  res.noCache();
  getData(req, '/auth/facebook', {followRedirect: false}).nodeify(fwd(res));
};


export function failure(req, res) {
  res.noCache();
  res.json({type: 'failure'});
};

export async function unlink(req, res) {
  res.noCache();
  try {
    console.log('unlink', req.query)
    const facebookCompleteFlow = await getData(req, '/auth/facebook/unlink', {
      followRedirect: false,
      header: {
        'Access-Token': req.query.access_token
      }
    });
    var fbResponse = facebookCompleteFlow[0]
      , fbBody = facebookCompleteFlow[1];

    const layout = 'layouts/oauth-social-unlink';
    res.status(fbResponse.statusCode).render(layout, fbBody);
  }
  catch (err) {
    console.error(err);
    res.status(500).send('');
  }
};

export async function callback(req, res) {
  res.noCache();
  try {

    const facebookCompleteFlow = await getData(req, '/auth/facebook/callback', {followRedirect: false});
    var fbResponse = facebookCompleteFlow[0]
      , fbBody = facebookCompleteFlow[1];

    const layout = 'layouts/oauth-success';
    res.status(fbResponse.statusCode).render(layout, {
      tokenData: fbBody,
      storageId: apiClient.token
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).send('');
  }
};
