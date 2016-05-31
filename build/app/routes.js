'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routes;

var _auth = require('../auth');

var _auth2 = _interopRequireDefault(_auth);

var _avatar = require('./api/avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _sharing = require('./api/sharing');

var _sharing2 = _interopRequireDefault(_sharing);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// --------------------------------------------------
// Render layout

function routes(app, buildPath) {

  var env = process.env.NODE_ENV || 'development';
  // SiteMap
  // --------------------------------------------------
  app.get('/sitemap.xml', function (req, res) {
    res.header('Content-Type', 'application/xml');
    res.sendFile(_path2.default.join(staticPath, 'sitemap.xml'));
  });

  // OAUTH
  // --------------------------------------------------
  app.use('/auth', _auth2.default);

  // AVATAR
  // --------------------------------------------------
  app.use('/avatar', _avatar2.default);

  // SHARING
  // --------------------------------------------------
  app.use('/sharing', _sharing2.default);
  // SHARING
  // --------------------------------------------------

  // RENDER
  // --------------------------------------------------
  //Get hashed path webpack
  var hashValue = env !== 'development' ? _fs2.default.readFileSync(_path2.default.join(buildPath, 'hash.txt')) : new Date().getTime();

  app.get('/*', function (req, res) {
    res.set('Cache-Control', 'public, max-age=0');
    // Js files
    var jsPaths = ['vendor', 'main'].map(function (basename) {
      if (env === 'development') {
        var _config$webpackDevSer = _config2.default.webpackDevServer;
        var host = _config$webpackDevSer.host;
        var port = _config$webpackDevSer.port;

        return '//' + host + ':' + port + '/static/' + basename + '.js';
      }
      return '/static/' + basename + '.js?' + hashValue;
    });
    // Css files
    var cssPaths = ['main'].map(function (basename) {
      if (env === 'development') {
        var _config$webpackDevSer2 = _config2.default.webpackDevServer;
        var host = _config$webpackDevSer2.host;
        var port = _config$webpackDevSer2.port;

        return '//' + host + ':' + port + '/static/' + basename + '.css';
      }
      return '/static/' + basename + '.css?' + hashValue;
    });

    var externalsJs = _config2.default.externalsJs;

    // Render
    var layout = 'layouts/main';
    var payload = {
      jsPaths: jsPaths,
      externalsJs: externalsJs,
      cssPaths: cssPaths,
      initialState: {},
      body: ''
    };

    (0, _render2.default)(req, res, layout, {
      payload: payload
    });
  });
}
//# sourceMappingURL=routes.js.map