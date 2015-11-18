'use strict';

export function show(req, res, next) {
  // FIXME: read in the api
  res.send(req.params.postUUID);
};