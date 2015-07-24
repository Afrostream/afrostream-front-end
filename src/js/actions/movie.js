import ActionTypes from '../consts/ActionTypes';

export function getMovie(movie) {
  return async api => ({
    type: ActionTypes.Movie.getMovie,
    movie,
    res: await api(`/movie/${movie}`)
  });
}

export function getSeason(movie) {
  return async api => ({
    type: ActionTypes.Movie.getSeason,
    movie,
    res: await api(`/movie/${movie}/season`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
