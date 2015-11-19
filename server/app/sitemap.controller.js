'use strict';

import config from '../../config';

import sitemap from 'sitemap';

const sm = sitemap.createSitemap({
  hostname: config.server.host,
  cacheTime: 1000 * 60 * 24  //keep the sitemap cached for 24 hours
});

export function index(req, res, next) {
  sm.toXML(function (xml) {
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });
};