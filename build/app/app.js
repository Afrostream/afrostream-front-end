'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _middlewareAllowcrossdomain = require('./middlewares/middleware-allowcrossdomain');

var _middlewareAllowcrossdomain2 = _interopRequireDefault(_middlewareAllowcrossdomain);

var _middlewareCachehandler = require('./middlewares/middleware-cachehandler');

var _middlewareCachehandler2 = _interopRequireDefault(_middlewareCachehandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// Serve static files
// --------------------------------------------------

var staticPath = _path2.default.resolve(__dirname, '../../static/');
var buildPath = _path2.default.resolve(process.cwd(), 'dist');

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

//Get hashed path webpack
var HASH_REGXP = /\.([a-f0-9]{32})\.js/;
// We point to our static assets
app.use((0, _compression2.default)());
//
app.use((0, _middlewareCachehandler2.default)());

app.use('/static', function (req, res, next) {
  res.isStatic();
  next();
});
app.use(_express2.default.static(staticPath));
app.use('/static', _express2.default.static(buildPath));
app.use('/static', function (req, res, next) {
  // faire une regexp sur req.url
  if (req.url.match(HASH_REGXP)) {
    res.sendFile(req.url.replace(HASH_REGXP, hashValue));
  }
  next();
});
app.use((0, _serveFavicon2.default)(_path2.default.join(staticPath, 'favicon.ico')));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use((0, _cookieParser2.default)());
app.use((0, _middlewareAllowcrossdomain2.default)());
app.use(errorHandler);

// View engine
// --------------------------------------------------

_handlebars2.default.registerHelper('json-stringify', _stringify2.default.bind(JSON));
_handlebars2.default.registerHelper('json', function (context) {
  return (0, _stringify2.default)(context);
});

app.engine('hbs', (0, _expressHandlebars2.default)());
app.set('view engine', 'hbs');
app.set('etag', false);
app.set('x-powered-by', false);

//ROUTES
(0, _routes2.default)(app, buildPath);

exports.default = app;
//# sourceMappingURL=app.js.map