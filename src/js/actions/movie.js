import ActionTypes from '../consts/ActionTypes';

export function getMovie(movie) {
  console.log('getMovie', movie);
  return async api => ({
    type: ActionTypes.Movie.getMovie,
    movie,
    res: await api(`/movies/${movie}`)
  });
}

export function getSeason(movie) {
  return async api => ({
    type: ActionTypes.Movie.getSeason,
    movie,
    res: await api(`/movies/${movie}/season`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
