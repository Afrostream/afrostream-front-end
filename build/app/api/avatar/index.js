'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _avatarController = require('./avatar.controller.js');

var _avatarController2 = _interopRequireDefault(_avatarController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:email', _avatarController2.default.getAvatar);

module.exports = router;
//# sourceMappingURL=index.js.map