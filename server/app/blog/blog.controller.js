'use strict';

import request from 'superagent';
import config from '../../../config';

const { apiClient: { protocol, authority }} = config;

/**
 * redirecting route
 *    /blog/Afrostream-24-hour-love.html
 * to
 *    /blog/761b1042-7d0a-40a9-83ac-1b2ee5918b24/Afrostream-24-hour-love
 */
export function redirect(req, res, next) {
  res.redirect('/blog/');

  /* redirect to specific entry
  const url = protocol + '://' + authority + '/api/posts';
  const slug = req.params.slug;

  request
    .get(url)
    .query({slug:slug})
    .type('json')
    .end((err, response) => {
      if (err) {
        // FIXME: test the global error handler.
        return next(err);
      }
      if (!Array.isArray(response.body) ||
        response.body.length === 0 ||
        !response.body[0]._id) {
        // FIXME: design the 404.
        return res.status(404).send('post not found');
      }
      res.redirect('/blog/'+response.body[0]._id+'/'+slug);
    });
    */
};
