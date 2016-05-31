'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.movie = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * @param req.params.movieId
 * @redirect 302 to /:movieId/:movieSlug/   success
 * @redirect 302 to /                       error     FIXME: should be a 404
 */

var movie = exports.movie = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(req, res) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            redirectOr404(res, getMovieLocation.bind(null, req, req.params.movieId));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return function movie(_x9, _x10) {
    return ref.apply(this, arguments);
  };
}();

/**
 * @param req.params.movieId
 * @redirect 302 to /movieId:/:movieSlug/:seasonId/:seasonSlug/   success
 * @redirect 302 to /                       error     FIXME: should be a 404
 */


exports.season = season;
exports.episode = episode;
exports.video = video;

var _apiFront = require('../api-front');

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param res           express object
 * @param getLocation   function
 * @return function (err, location) { }
 *   @redirect res 302 on success
 *   @redirect res 302 on error     FIXME: should be a 404
 */
var redirectOr404 = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(res, getLocation) {
    var location;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return getLocation();

          case 3:
            location = _context.sent;

            console.log('location : ' + location);
            res.status(302).set('location', location).send('');
            _context.next = 12;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);

            console.error(_context.t0);
            res.status(302).set('location', '/').send(''); // FIXME: should send a 404

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 8]]);
  }));
  return function redirectOr404(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

var getMovieLocation = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, movieId) {
    var movie;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _apiFront.getBodyWithoutAuth)(req, '/api/movies/' + movieId);

          case 2:
            movie = _context2.sent;
            return _context2.abrupt('return', '/' + movie._id + '/' + movie.slug + '/');

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return function getMovieLocation(_x3, _x4) {
    return ref.apply(this, arguments);
  };
}();

var getSeasonLocation = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, seasonId) {
    var season;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _apiFront.getBodyWithoutAuth)(req, '/api/seasons/' + seasonId);

          case 2:
            season = _context3.sent;
            return _context3.abrupt('return', '/' + season.movie._id + '/' + season.movie.slug + '/' + season._id + '/' + season.slug + '/');

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return function getSeasonLocation(_x5, _x6) {
    return ref.apply(this, arguments);
  };
}();

var getEpisodeLocation = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(req, episodeId) {
    var episode, season;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _apiFront.getBodyWithoutAuth)(req, '/api/episodes/' + episodeId);

          case 2:
            episode = _context4.sent;
            _context4.next = 5;
            return (0, _apiFront.getBodyWithoutAuth)(req, '/api/seasons/' + episode.season._id);

          case 5:
            season = _context4.sent;
            return _context4.abrupt('return', '/' + season.movie._id + '/' + season.movie.slug + '/' + season._id + '/' + season.slug + '/' + episode._id + '/' + episode.slug + '/');

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return function getEpisodeLocation(_x7, _x8) {
    return ref.apply(this, arguments);
  };
}();function season(req, res) {
  redirectOr404(res, getSeasonLocation.bind(null, req, req.params.seasonId));
}

/**
 * @param req.params.movieId
 * @redirect 302 to /movieId:/:movieSlug/:seasonId/:seasonSlug/:episodeId/:episodeSlug/   success
 * @redirect 302 to /                       error     FIXME: should be a 404
 */
function episode(req, res) {
  redirectOr404(res, getEpisodeLocation.bind(null, req, req.params.episodeId));
}

/**
 * @param req.params.movieId
 * @redirect 302 to /:movieId/:movieSlug/:videoId   success (video is a movie)
 * @redirect 302 to /movieId:/:movieSlug/:seasonId/:seasonSlug/:episodeId/:episodeSlug/:videoId   success (video is an episode)
 * @redirect 302 to /                       error     FIXME: should be a 404
 */
function video(req, res) {
  redirectOr404(res, function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var video, location;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _apiFront.getBodyWithoutAuth)(req, '/api/videos/' + req.params.videoId);

            case 2:
              video = _context6.sent;

              if (!video.episode) {
                _context6.next = 9;
                break;
              }

              _context6.next = 6;
              return getEpisodeLocation(req, video.episode._id);

            case 6:
              _context6.t0 = _context6.sent;
              _context6.next = 12;
              break;

            case 9:
              _context6.next = 11;
              return getMovieLocation(req, video.movie._id);

            case 11:
              _context6.t0 = _context6.sent;

            case 12:
              location = _context6.t0;
              return _context6.abrupt('return', location + video._id);

            case 14:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function getLocation() {
      return ref.apply(this, arguments);
    }

    return getLocation;
  }());
}
//# sourceMappingURL=sharing.controller.js.map