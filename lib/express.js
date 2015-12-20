'use strict';

import config from '../config';
import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import appPackage from '../package.json';
import fastly from 'fastly';
import child_process from 'child_process';
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

//Get hashed path webpack
const HASH_REGXP = /\.([a-f0-9]{32})\.js/;
// We point to our static assets
app.enable('trust proxy');
app.use(compression());
app.use('/static', function (req, res, next) {
  res.set('Cache-Control', 'public, max-age=31536000');
  next();
});
app.use(express.static(staticPath));
app.use('/static', express.static(buildPath));
app.use('/static', function (req, res, next) {
  // faire une regexp sur req.url
  if (req.url.match(HASH_REGXP)) {
    res.sendFile(req.url.replace(HASH_REGXP, hashValue));
  }
  next();
});
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

handlebars.registerHelper('json-stringify', ::JSON.stringify);

app.engine('hbs', expressHandlebars());
app.set('view engine', 'hbs');
app.set('etag', false);
app.set('x-powered-by', false);

// SiteMap
// --------------------------------------------------
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.sendFile(path.join(staticPath, 'sitemap.xml'));
});

// Render layout
// --------------------------------------------------
import render from '../lib/render';
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

const server = app.listen(config.server.port, () => {
  const { address: host, port } = server.address();
  console.log(`Front-End server is running at ${host}:${port}`); // eslint-disable-line no-console
  //on production we decache all fasly routes
  if (env === 'production') {
    let fastLySdk = fastly(config.fastly.key);
    fastLySdk.purgeAll(config.fastly.serviceId, function (err, obj) {
      if (err) return console.dir(err);   // Oh no!
      console.dir(obj);                   // Response body from the fastly API
    });
  }

  let generateSiemap = function () {
    child_process.exec(`./node_modules/.bin/sitemap-generator --path=./static https://afrostream.tv`, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  };

  //Generate sitemap for 1 day
  setInterval(generateSiemap, 86400 * 1000);
  generateSiemap();
});
