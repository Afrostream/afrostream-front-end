import config from '../../config';
import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fastly from 'fastly';
import allowOrigin from './middlewares/middleware-allowcrossdomain';
import cacheHandler from './middlewares/middleware-cachehandler';
const app = express();

const env = process.env.NODE_ENV || 'development';

// Serve static files
// --------------------------------------------------
import path from 'path';
const staticPath = path.resolve(__dirname, '../../client/static/');
const buildPath = path.resolve(process.cwd(), 'dist');

function errorHandler (err, req, res, next) {
  res.status(500);
  res.render('error', {error: err});
}

//Get hashed path webpack
const HASH_REGXP = /\.([a-f0-9]{32})\.js/;
// We point to our static assets
app.use(compression());
//
app.use(cacheHandler());

app.use('/static', function (req, res, next) {
  res.isStatic();
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
app.use(allowOrigin());
app.use(errorHandler);

// View engine
// --------------------------------------------------
import expressHandlebars from 'express-handlebars';
import handlebars from 'handlebars';

handlebars.registerHelper('json-stringify', ::JSON.stringify);
handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});

app.engine('hbs', expressHandlebars());
app.set('view engine', 'hbs');
app.set('etag', false);
app.set('x-powered-by', false);

//ROUTES
import routes from './routes';
routes(app, buildPath);

const server = app.listen(config.server.port, () => {
  const {address: host, port} = server.address();
  console.log(`Front-End server is running at ${host}:${port}`); // eslint-disable-line no-console
  //on production we decache all fasly routes
  if (env === 'production') {
    let fastLySdk = fastly(config.fastly.key);
    fastLySdk.purgeAll(config.fastly.serviceId, function (err, obj) {
      if (err) return console.dir(err);   // Oh no!
      console.dir(obj);                   // Response body from the fastly API
    });
  }
});
