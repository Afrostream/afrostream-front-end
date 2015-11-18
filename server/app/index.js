'use strict';

import config from '../../config';
import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';

import appPackage from '../../package.json';

const app = express();
const env = process.env.NODE_ENV || 'development';

//Get hashed path webpack
const buildPath = path.resolve(process.cwd(), 'dist');
const hashValue = (env !== 'development') ? fs.readFileSync(path.join(buildPath, 'hash.txt')) : null;

// Js files
app.set('jsPaths', ['vendor', 'main'].map(basename => {
  if (env === 'development') {
    let { webpackDevServer: { host, port } } = config;
    return `//${host}:${port}/static/${basename}.js`;
  }
  return `/static/${basename}.${hashValue}.js`;
}));

// Css files
app.set('cssPaths', ['main'].map(basename => {
  if (env === 'development') {
    let { webpackDevServer: { host, port } } = config;
    return `//${host}:${port}/static/${basename}.css`;
  }
  return `/static/${basename}.${hashValue}.css`;
}));

// Serve static files
// --------------------------------------------------
import path from 'path';
const staticPath = path.resolve(__dirname, '../../static/');

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
app.enable('trust proxy');
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

//app.route(/\/(blog)/)
//  .get(function (req, res) {
//    res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
//  });

// View engine
// --------------------------------------------------
import expressHandlebars from 'express-handlebars';
import handlebars from 'handlebars';

handlebars.registerHelper('json-stringify',::JSON.stringify);

// Render default template values
app.locals = {
  version: appPackage.version
};

app.engine('hbs', expressHandlebars());
app.set('view engine', 'hbs');

// Render layout
// --------------------------------------------------

import routes from './routes';
routes(app);

export default app;