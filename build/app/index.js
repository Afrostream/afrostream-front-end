'use strict';

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _fastly = require('fastly');

var _fastly2 = _interopRequireDefault(_fastly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var server = _app2.default.listen(_config2.default.server.port, function () {
  var _server$address = server.address();

  var host = _server$address.address;
  var port = _server$address.port;

  console.log('Front-End server is running at ' + host + ':' + port); // eslint-disable-line no-console
  //on production we decache all fasly routes
  if (process.env.NODE_ENV === 'production') {
    var fastLySdk = (0, _fastly2.default)(_config2.default.fastly.key);
    fastLySdk.purgeAll(_config2.default.fastly.serviceId, function (err, obj) {
      if (err) return console.dir(err); // Oh no!
      console.dir(obj); // Response body from the fastly API
    });
  }
});
//# sourceMappingURL=index.js.map