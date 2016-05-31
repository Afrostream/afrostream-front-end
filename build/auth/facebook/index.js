'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _facebook = require('./facebook.controller');

var controller = _interopRequireWildcard(_facebook);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/signin', controller.signin);
router.get('/signup', controller.signup);
router.get('/unlink', controller.unlink);
router.get('/link', controller.link);
router.get('/callback', controller.callback);
router.get('/failure', controller.failure);

module.exports = router;
//# sourceMappingURL=index.js.map