'use strict';

import config from '../config';
import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
const app = express();
const env = process.env.NODE_ENV || 'development';
// Serve static files
// --------------------------------------------------
import fs from 'fs';
import path from 'path';
const staticPath = path.resolve(__dirname, '../static/');
const buildPath = path.resolve(process.cwd(), 'dist');

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({error: 'Something blew up!'});
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', {error: err});
}
// We point to our static assets
app.use(compression());
app.use(express.static(staticPath));
app.use('/static', express.static(buildPath));
app.use(favicon(path.join(staticPath, 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
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
//Get hashed path webpack
const hashValue = (env !== 'development') ? fs.readFileSync(path.join(buildPath, 'hash.txt')) : null;

app.get('/*', (req, res) => {
  // Js files
  const jsPaths = ['vendor', 'main'].map(basename => {
    if (env === 'development') {
      let { webpackDevServer: { host, port } } = config;
      return `//${host}:${port}/static/${basename}.js`;
    }
    return `/static/${basename}.${hashValue}.js`;
  });
  // Css files
  const cssPaths = ['main'].map(basename => {
    if (env === 'development') {
      let { webpackDevServer: { host, port } } = config;
      return `//${host}:${port}/static/${basename}.css`;
    }
    return `/static/${basename}.${hashValue}.css`;
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
