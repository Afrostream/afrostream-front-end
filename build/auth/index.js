'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _facebook = require('./facebook');

var _facebook2 = _interopRequireDefault(_facebook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use(function (req, res, next) {
  res.noCache();
  next();
});

router.use('/facebook', _facebook2.default);

module.exports = router;
//# sourceMappingURL=index.js.map