'use strict';

import config from '../config';
import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';

const app = express();
const env = process.env.NODE_ENV || 'development';

// Serve static files
// --------------------------------------------------
import path from 'path';
const staticPath = path.resolve(__dirname, '../static/');
const buildPath = path.resolve(process.cwd(), 'dist');

// We point to our static assets
app.use(express.static(staticPath));
app.use(express.static(buildPath));
app.use(favicon(path.join(staticPath, 'favicon.ico')));
app.use(compression());
// View engine
// --------------------------------------------------
import expressHandlebars from 'express-handlebars';
import handlebars from 'handlebars';

handlebars.registerHelper('json-stringify',::JSON.stringify
)
;

app.engine('hbs', expressHandlebars());
app.set('view engine', 'hbs');


// Render layout
// --------------------------------------------------
import render from '../lib/render';

app.get('/*', (req, res) => {

  // Js files
  const jsPaths = ['vendor', 'main'].map(basename => {
    if (env === 'development') {
      let { webpackDevServer: { host, port } } = config;
      return `//${host}:${port}/static/${basename}.js`;
    }
    return `/static/${basename}.js`;
  });
  // Css files
  const cssPaths = ['main'].map(basename => {
    if (env === 'development') {
      let { webpackDevServer: { host, port } } = config;
      return `//${host}:${port}/static/${basename}.css`;
    }
    return `/static/${basename}.css`;
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

const server = app.listen(config.server.port, () => {
  const { address: host, port } = server.address();
  console.log(`Front-End server is running at ${host}:${port}`); // eslint-disable-line no-console
});
