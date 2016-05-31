'use strict';

require('babel-register');

var _expressCluster = require('express-cluster');

var _expressCluster2 = _interopRequireDefault(_expressCluster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clusterConf = { count: process.env.WEB_CONCURRENCY || 1, verbose: true };

(0, _expressCluster2.default)(function (worker) {
  console.log('worker ' + worker.id + ' is up');
  return require('./app');
}, clusterConf);
//# sourceMappingURL=index.js.map