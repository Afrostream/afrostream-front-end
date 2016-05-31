'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callback = exports.unlink = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var unlink = exports.unlink = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
    var facebookCompleteFlow, fbResponse, fbBody, layout;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            res.noCache();
            _context.prev = 1;
            _context.next = 4;
            return (0, _apiFront.getData)(req, '/auth/facebook/unlink', {
              followRedirect: false,
              header: {
                'Access-Token': req.query.access_token
              }
            });

          case 4:
            facebookCompleteFlow = _context.sent;
            fbResponse = facebookCompleteFlow[0], fbBody = facebookCompleteFlow[1];
            layout = 'layouts/oauth-social-unlink';

            res.status(fbResponse.statusCode).render(layout, fbBody);
            _context.next = 14;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](1);

            console.error(_context.t0);
            res.status(500).send('');

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 10]]);
  }));
  return function unlink(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var callback = exports.callback = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
    var facebookCompleteFlow, fbResponse, fbBody, layout;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            res.noCache();
            _context2.prev = 1;
            _context2.next = 4;
            return (0, _apiFront.getData)(req, '/auth/facebook/callback', { followRedirect: false });

          case 4:
            facebookCompleteFlow = _context2.sent;
            fbResponse = facebookCompleteFlow[0], fbBody = facebookCompleteFlow[1];
            layout = 'layouts/oauth-success';

            if (fbResponse.statusCode !== 200) {
              fbBody.error = fbResponse.statusMessage;
            }
            res.status(fbResponse.statusCode).render(layout, {
              statusCode: fbResponse.statusCode,
              statusMessage: fbResponse.statusMessage,
              tokenData: fbBody,
              storageId: apiClient.token
            });
            _context2.next = 15;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](1);

            console.error(_context2.t0);
            res.status(500).send('');

          case 15:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 11]]);
  }));
  return function callback(_x3, _x4) {
    return ref.apply(this, arguments);
  };
}();

exports.signin = signin;
exports.signup = signup;
exports.link = link;
exports.failure = failure;

var _apiFront = require('../../app/api/api-front');

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiClient = _config2.default.apiClient;
function signin(req, res) {
  res.noCache();
  (0, _apiFront.getData)(req, '/auth/facebook/signin', { followRedirect: false }).nodeify((0, _apiFront.fwd)(res));
}

function signup(req, res) {
  res.noCache();
  (0, _apiFront.getData)(req, '/auth/facebook/signup', { followRedirect: false }).nodeify((0, _apiFront.fwd)(res));
}

function link(req, res) {
  res.noCache();
  (0, _apiFront.getData)(req, '/auth/facebook/link', {
    followRedirect: false,
    header: {
      'Access-Token': req.query.access_token
    }
  }).nodeify((0, _apiFront.fwd)(res));
}

function failure(req, res) {
  res.noCache();
  res.json({ type: 'failure' });
}
//# sourceMappingURL=facebook.controller.js.map