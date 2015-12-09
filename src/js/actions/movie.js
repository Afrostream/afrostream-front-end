import ActionTypes from '../consts/ActionTypes';

export function getMovie(movieId) {
  return (dispatch, getState) => {
    if (!movieId) {
      console.log('no movie id passed in action', movieId);
      return {
        type: ActionTypes.Movie.getMovie,
        movieId: movieId,
        res: {body: null}
      };
    }
    let readyMovie = getState().Movie.get(`/movies/${movieId}`);
    if (readyMovie) {
      console.log('movie already present in data store', movieId);
      return {
        type: ActionTypes.Movie.getMovie,
        movieId: movieId,
        res: {body: readyMovie}
      };
    }
    console.log('getMovie', movieId);
    return async api => ({
      type: ActionTypes.Movie.getMovie,
      movieId,
      res: await api(`/movies/${movieId}`)
    });
  };
}

export function getSeason(movieId) {
  return (dispatch, getState) => {
    if (!movieId) {
      console.log('no movie id passed in action', movieId);
      return {
        type: ActionTypes.Movie.getSeason,
        movieId,
        res: {body: null}
      };
    }
    let readySeason = getState().Movie.get(`/movies/${movieId}/seasons`);
    if (readySeason) {
      console.log('season already present in data store', movieId);
      return {
        type: ActionTypes.Movie.getSeason,
        movieId,
        res: {body: readySeason}
      };
    }
    return async api => ({
      type: ActionTypes.Movie.getSeason,
      movieId,
      res: await api(`/movies/${movieId}/seasons`)
    });
  };
}
