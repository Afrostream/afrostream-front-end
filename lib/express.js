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
const assetsPath = path.resolve(__dirname, '../assets/');
const buildPath = path.resolve(process.cwd(), 'dist');

// We point to our static assets
app.use(express.static(assetsPath));
app.use(express.static(buildPath));
app.use(favicon(path.join(assetsPath, 'favicon.ico')));
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
    return `/js/${basename}.js`;
  });

  // Render
  const layout = 'layouts/main';
  const payload = {
    jsPaths,
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
