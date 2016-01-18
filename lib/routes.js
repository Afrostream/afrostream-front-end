'use strict';

import express from 'express';
import auth from './auth';
import avatar from './avatar';
import config from '../config';
import fs from 'fs';
import path from 'path';
// Render layout
// --------------------------------------------------
import render from '../lib/render';

export default function routes(app, buildPath) {

  const env = process.env.NODE_ENV || 'development';
  // SiteMap
  // --------------------------------------------------
  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.sendFile(path.join(staticPath, 'sitemap.xml'));
  });

  // OAUTH
  // --------------------------------------------------
  app.use('/auth', auth);

  // AVATAR
  // --------------------------------------------------
  app.use('/avatar', avatar);

  // RENDER
  // --------------------------------------------------
  //Get hashed path webpack
  const hashValue = (env !== 'development') ? fs.readFileSync(path.join(buildPath, 'hash.txt')) : new Date().getTime();

  app.get('/*', (req, res) => {
    res.set('Cache-Control', 'public, max-age=0');
    // Js files
    const jsPaths = ['vendor', 'main'].map(basename => {
      if (env === 'development') {
        let { webpackDevServer: { host, port } } = config;
        return `//${host}:${port}/static/${basename}.js`;
      }
      return `/static/${basename}.js?${hashValue}`;
    });
    // Css files
    const cssPaths = ['main'].map(basename => {
      if (env === 'development') {
        let { webpackDevServer: { host, port } } = config;
        return `//${host}:${port}/static/${basename}.css`;
      }
      return `/static/${basename}.css?${hashValue}`;
    });

    // Render
    const layout = 'layouts/main';
    const payload = {
      jsPaths,
      cssPaths,
      initialState: {},
      body: ''
    };

    render(req, res, layout, {
      payload
    });
  });

}
