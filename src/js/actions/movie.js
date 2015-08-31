import ActionTypes from '../consts/ActionTypes';

export function getMovie(movieId) {
  console.log('getMovie', movieId);
  return async api => ({
    type: ActionTypes.Movie.getMovie,
    movieId,
    res: await api(`/movies/${movieId}`)
  });
}

export function getSeason(movieId) {
  return async api => ({
    type: ActionTypes.Movie.getSeason,
    movieId,
    res: await api(`/movies/${movieId}/seasons`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}
