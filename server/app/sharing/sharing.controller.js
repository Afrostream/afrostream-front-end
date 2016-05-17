import { getBodyWithoutAuth } from '../api-front';
import Q from 'q';

/**
 * @param res           express object
 * @param getLocation   function
 * @return function (err, location) { }
 *   @redirect res 302 on success
 *   @redirect res 302 on error     FIXME: should be a 404
 */
const redirectOr404 = async function (res, getLocation) {
  try {
    var location = await getLocation();
    console.log('location : ' + location);
    res.status(302).set('location', location).send('');
  } catch (err) {
    console.error(err);
    res.status(302).set('location', '/').send(''); // FIXME: should send a 404
  }
};

const getMovieLocation = async function (req, movieId) {
  const movie = await getBodyWithoutAuth(req, `/api/movies/${movieId}`);
  return `/${movie._id}/${movie.slug}/`;
};

const getSeasonLocation = async function (req, seasonId) {
  const season = await getBodyWithoutAuth(req, `/api/seasons/${seasonId}`);
  return `/${season.movie._id}/${season.movie.slug}/${season._id}/${season.slug}/`;
};

const getEpisodeLocation = async function (req, episodeId) {
  const episode = await getBodyWithoutAuth(req, `/api/episodes/${episodeId}`);
  const season = await getBodyWithoutAuth(req, `/api/seasons/${episode.season._id}`);
  return `/${season.movie._id}/${season.movie.slug}/${season._id}/${season.slug}/${episode._id}/${episode.slug}/`;
};

/**
 * @param req.params.movieId
 * @redirect 302 to /:movieId/:movieSlug/   success
 * @redirect 302 to /                       error     FIXME: should be a 404
 */
export async function movie(req, res) {
  redirectOr404(res, getMovieLocation.bind(null, req, req.params.movieId));
}

/**
 * @param req.params.movieId
 * @redirect 302 to /movieId:/:movieSlug/:seasonId/:seasonSlug/   success
 * @redirect 302 to /                       error     FIXME: should be a 404
 */
export function season(req, res) {
  redirectOr404(res, getSeasonLocation.bind(null, req, req.params.seasonId));
}

/**
 * @param req.params.movieId
 * @redirect 302 to /movieId:/:movieSlug/:seasonId/:seasonSlug/:episodeId/:episodeSlug/   success
 * @redirect 302 to /                       error     FIXME: should be a 404
 */
export function episode(req, res) {
  redirectOr404(res, getEpisodeLocation.bind(null, req, req.params.episodeId));
}

/**
 * @param req.params.movieId
 * @redirect 302 to /:movieId/:movieSlug/:videoId   success (video is a movie)
 * @redirect 302 to /movieId:/:movieSlug/:seasonId/:seasonSlug/:episodeId/:episodeSlug/:videoId   success (video is an episode)
 * @redirect 302 to /                       error     FIXME: should be a 404
 */
export function video(req, res) {
  redirectOr404(res, async function getLocation() {
    const video = await getBodyWithoutAuth(req, `/api/videos/${req.params.videoId}`);
    let location = (video.episode) ? await getEpisodeLocation(req, video.episode._id) : await getMovieLocation(req, video.movie._id);
    return location + video._id;
  });
}
