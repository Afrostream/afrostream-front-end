'use strict';

import { getDataWithoutAuth, fwd } from '../../api-front';

exports.checkAuth = function (req, res) {
  res.noCache();
  getDataWithoutAuth(req, '/auth/facebook', {followRedirect: false}).nodeify(fwd(res));
};

exports.callback = function (req, res) {
  res.noCache();
  getDataWithoutAuth(req, '/auth/facebook/callback', {followRedirect: false}).nodeify(fwd(res));
};

exports.failure = function (req, res) {
  res.noCache();
  res.json({type: 'failure'});
};
