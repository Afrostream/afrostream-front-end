'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBodyWithoutAuth = exports.getExternal = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * call request on external api
 * @param req
 * @param path
 */

var getExternal = exports.getExternal = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, requestOptions) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _q2.default.nfcall(_request2.default, _lodash2.default.merge({
              method: 'POST',
              json: true
            }, requestOptions || {}));

          case 2:
            return _context.abrupt('return', _context.sent);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function getExternal(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

/**
 * call this method when you don't need the token (faster & safer)
 * @param req
 * @param path
 */


/**
 * call the front-api & return the json body
 * @param req             express request object
 * @param path            front-api path
 * @param requestOptions  request options
 * @return promise<json>
 */

var getBodyWithoutAuth = exports.getBodyWithoutAuth = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _ref, _ref2, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getData.apply(null, args);

          case 2:
            _ref = _context2.sent;
            _ref2 = (0, _slicedToArray3.default)(_ref, 2);
            body = _ref2[1];
            return _context2.abrupt('return', body);

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function getBodyWithoutAuth(_x3) {
    return ref.apply(this, arguments);
  };
}();

/*
 * forward backend result to the frontend.
 *
 * ex: backend.getData(req, '/api/categorys/4242').nodeify(backend.fwd(res))
 */


exports.getData = getData;
exports.fwd = fwd;

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiServer = _config2.default.apiServer;
function getData(req, path, requestOptions) {
  path = path.replace(new RegExp('^' + apiServer.urlPrefix), '');
  var url = '' + apiServer.urlPrefix + path;

  console.log('request api-front', url);

  var queryOptions = _lodash2.default.merge({}, req.query || {});

  return _q2.default.nfcall(_request2.default, _lodash2.default.merge({
    method: 'GET',
    json: true,
    qs: queryOptions,
    uri: url,
    headers: {
      'x-forwarded-client-ip': req.clientIp,
      'x-forwarded-user-ip': req.clientIp
    }
  }, requestOptions || {}));
}function fwd(res) {
  return function (err, data) {
    if (err) {
      res.status(500).json({ error: String(err) });
    } else {
      var backendResponse = data[0],
          backendBody = data[1];
      switch (backendResponse.statusCode) {
        case 301:
        case 302:
          if (backendResponse.headers && backendResponse.headers.location) {
            res.set('location', backendResponse.headers.location);
          }
          break;
        default:
          break;
      }

      res.status(backendResponse.statusCode).send(backendBody);
    }
  };
}
//# sourceMappingURL=api-front.js.map