'use strict';

import config from '../config';
import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
//import https from 'https';
//import fs from 'fs';
const app = express();
const env = process.env.NODE_ENV || 'development';
// Serve static files
// --------------------------------------------------
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
app.use(express.static(staticPath));
app.use('/static', express.static(buildPath));
app.use(favicon(path.join(staticPath, 'favicon.ico')));
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

//if (env === 'development') {
//  https.createServer({
//    key: fs.readFileSync(path.join(staticPath, 'key.pem')),
//    cert: fs.readFileSync(path.join(staticPath, 'csr.pem'))
//  }, app).listen(443);
//}

if (env === 'production' || env === 'staging') {
// enable ssl redirect
  app.use(function (req, res, next) {
    var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase(),
      hasW = ~req.headers.host.indexOf('www');

    //if token is in querystring we retaget in ssl
    if (req.query[config.auth0.token]) {
      if (schema === 'https' && !hasW) {
        next();
      } else {
        res.redirect('https://' + req.headers.host.replace(/^www\./, '') + req.url);
      }
    } else {
      if (schema === 'http') {
        next();
      } else {
        res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
      }
    }
  });
}

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
