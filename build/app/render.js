'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

exports.default = render;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _reactRouter = require('react-router');

var _history = require('history');

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _createStore = require('../../src/js/lib/createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _createAPI = require('../../src/js/lib/createAPI');

var _createAPI2 = _interopRequireDefault(_createAPI);

var _routes2 = require('../../src/js/routes');

var _routes3 = _interopRequireDefault(_routes2);

var _Router = require('../../src/js/components/Router');

var _Router2 = _interopRequireDefault(_Router);

var _reactRedux = require('react-redux');

var _prettyError = require('pretty-error');

var _prettyError2 = _interopRequireDefault(_prettyError);

var _ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');

var _reactHelmet = require('react-helmet');

var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pretty = new _prettyError2.default();
var apps = _config2.default.apps;
var apiServer = _config2.default.apiServer;
function render(req, res, layout, _ref) {
  var _this = this;

  var payload = _ref.payload;
  var path = req.path;

  var history = (0, _history.createMemoryHistory)(path);
  var location = history.createLocation(path);

  var api = (0, _createAPI2.default)(
  /**
   * Server's createRequest() method
   * You can modify headers, pathname, query, body to make different request
   * from client's createRequest() method
   *
   * Example:
   * You API server is `http://api.example.com` and it require accessToken
   * on query, then you can assign accessToken (get from req) to query object
   * before calling API
   */
  function (_ref2) {
    var method = _ref2.method;
    var _ref2$headers = _ref2.headers;
    var headers = _ref2$headers === undefined ? {} : _ref2$headers;
    var _ref2$pathname = _ref2.pathname;
    var pathname = _ref2$pathname === undefined ? '' : _ref2$pathname;
    var _ref2$query = _ref2.query;
    var query = _ref2$query === undefined ? {} : _ref2$query;
    var _ref2$body = _ref2.body;
    var body = _ref2$body === undefined ? {} : _ref2$body;
    var _ref2$local = _ref2.local;
    var local = _ref2$local === undefined ? false : _ref2$local;

    var url = '' + apiServer.urlPrefix + pathname;
    if (local) {
      url = pathname;
    }
    return (0, _superagent2.default)(method, url).query(_qs2.default.stringify(query)).set(headers).send(body);
  });

  var store = (0, _createStore2.default)(api, history);

  (0, _reactRouter.match)({
    routes: _routes3.default,
    location: location
  }, function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(err, redirectLocation, renderProps) {
      var params, _location, _routes, route, prepareRouteMethods, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, prepareRoute, body, initialState, metadata;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              if (!redirectLocation) {
                _context.next = 5;
                break;
              }

              res.redirect(301, redirectLocation.pathname + redirectLocation.search);
              _context.next = 57;
              break;

            case 5:
              if (!err) {
                _context.next = 9;
                break;
              }

              throw err;

            case 9:
              if (!(renderProps === null)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt('return', res.status(404).send('Not found'));

            case 13:
              params = renderProps.params;
              _location = renderProps.location;
              _routes = renderProps.routes;
              route = _routes && _routes[_routes.length - 1];

              params.lang = _routes && _routes.length > 2 && _routes[2].path;

              prepareRouteMethods = _lodash2.default.map(renderProps.components, function (component) {
                return component && component.prepareRoute;
              });
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 22;
              _iterator = (0, _getIterator3.default)(prepareRouteMethods);

            case 24:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 39;
                break;
              }

              prepareRoute = _step.value;

              if (prepareRoute) {
                _context.next = 28;
                break;
              }

              return _context.abrupt('continue', 36);

            case 28:
              _context.prev = 28;
              _context.next = 31;
              return prepareRoute({ store: store, params: params, location: _location, route: route });

            case 31:
              _context.next = 36;
              break;

            case 33:
              _context.prev = 33;
              _context.t0 = _context['catch'](28);

              console.error('Prepare route ERROR:', pretty.render(_context.t0));

            case 36:
              _iteratorNormalCompletion = true;
              _context.next = 24;
              break;

            case 39:
              _context.next = 45;
              break;

            case 41:
              _context.prev = 41;
              _context.t1 = _context['catch'](22);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 45:
              _context.prev = 45;
              _context.prev = 46;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 48:
              _context.prev = 48;

              if (!_didIteratorError) {
                _context.next = 51;
                break;
              }

              throw _iteratorError;

            case 51:
              return _context.finish(48);

            case 52:
              return _context.finish(45);

            case 53:
              body = _server2.default.renderToStaticMarkup(_react2.default.createElement(
                _reactRedux.Provider,
                { store: store },
                _react2.default.createElement(_Router2.default, (0, _extends3.default)({}, renderProps, { location: _location }))
              ));
              initialState = store.getState();
              metadata = _reactHelmet2.default.rewind();
              return _context.abrupt('return', res.render(layout, (0, _extends3.default)({}, payload, {
                title: metadata.title,
                meta: metadata.meta,
                name: 'Afrostream',
                link: metadata.link,
                iosAppId: apps.iosAppId,
                androidAppId: apps.androidAppId,
                body: body,
                share: {
                  twitterUrl: 'http://twitter.com/share?url=http://bit.ly/AFROSTREAMTV&text='
                },
                initialState: initialState
              })));

            case 57:
              _context.next = 67;
              break;

            case 59:
              _context.prev = 59;
              _context.t2 = _context['catch'](0);

              _reactHelmet2.default.rewind();

              if (!_context.t2.redirect) {
                _context.next = 65;
                break;
              }

              res.redirect(_context.t2.redirect);
              return _context.abrupt('return');

            case 65:
              console.error('ROUTER ERROR:', pretty.render(_context.t2));
              res.status(404).send('');

            case 67:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[0, 59], [22, 41, 45, 53], [28, 33], [46,, 48, 52]]);
    }));
    return function (_x, _x2, _x3) {
      return ref.apply(this, arguments);
    };
  }());
}
//# sourceMappingURL=render.js.map