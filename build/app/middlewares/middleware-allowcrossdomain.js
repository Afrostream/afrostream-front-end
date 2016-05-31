'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allowOrigin = function allowOrigin(options) {
  return function (req, res, next) {
    res.header('Access-Control-Allow-Origin', _config2.default.apiClient.urlPrefix);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  };
};

exports.default = allowOrigin;
//# sourceMappingURL=middleware-allowcrossdomain.js.map