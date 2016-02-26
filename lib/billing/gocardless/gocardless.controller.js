'use strict';
import { getBodyWithoutAuth,getExternal, fwd } from '../../api-front';
import {gocardless,apiServer} from '../../../config';

export async function getRedirectFlow(req, res) {
  res.noCache();
  try {
    const gocardlessRedirectFlow = await getExternal(req, {
      body: {
        'redirect_flows': {
          'description': req.query.title,
          'success_redirect_url': `http://localhost:3000/billing/gocardless/success?session_token=${req.query.access_token}`,
          'session_token': req.query.access_token
        }
      },
      uri: 'https://api-sandbox.gocardless.com/redirect_flows',
      headers: {
        'Authorization': `Bearer ${gocardless.key}`,
        'GoCardless-Version': gocardless.version
      }
    });

    var gocardlessResponse = gocardlessRedirectFlow[0],
      gocardlessBody = gocardlessRedirectFlow[1];
    if (gocardlessBody && gocardlessBody.redirect_flows) {
      res.redirect(gocardlessBody.redirect_flows.redirect_url);
    } else {
      throw new Error('gocardless redirect flow request error');
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(''); // FIXME: should send a 404
  }
};

export async function subscription(req, res) {
  res.noCache();
  try {
    const gocardlessCompleteFlow = await getExternal(req, {
      body: {
        'data': {
          'session_token': req.query.session_token
        }
      },
      uri: `https://api-sandbox.gocardless.com/redirect_flows/${req.query.redirect_flow_id}/actions/complete`,
      headers: {
        'Authorization': `Bearer ${gocardless.key}`,
        'GoCardless-Version': gocardless.version
      }
    });

    var gocardlessResponse = gocardlessCompleteFlow[0]
      , gocardlessBody = gocardlessCompleteFlow[1];
    if (gocardlessBody && gocardlessBody.redirect_flows) {
      const layout = 'layouts/gocardless-mandat-success';

      res.status(gocardlessResponse.statusCode).render(layout, {redirect_flows: gocardlessBody.redirect_flows.links});
    } else {
      throw new Error('gocardless redirect flow complete error');
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).send(''); // FIXME: should send a 404
  }
};

exports.failure = function (req, res) {
  res.noCache();
  res.json({type: 'failure'});
};
