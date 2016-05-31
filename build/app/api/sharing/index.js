'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _sharingController = require('./sharing.controller.js');

var controllerSharing = _interopRequireWildcard(_sharingController);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use(function (req, res, next) {
  res.noCache();
  next();
});

router.get('/movie/:movieId', controllerSharing.movie);
router.get('/season/:seasonId', controllerSharing.season);
router.get('/episode/:episodeId', controllerSharing.episode);
router.get('/video/:videoId', controllerSharing.video);

module.exports = router;
//# sourceMappingURL=index.js.map