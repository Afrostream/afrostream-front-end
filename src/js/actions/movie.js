import ActionTypes from '../consts/ActionTypes';

export function getMovie(movieId, router) {
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
    const user = getState().User.get('user');

    if (user && router) {
      let planCode = user.get('planCode');
      if (!planCode) {
        router.transitionTo('/select-plan');
        return {
          type: ActionTypes.Movie.getMovie,
          movieId: movieId,
          res: {body: readyMovie}
        };
      }
    }

    if (readyMovie) {
      console.log('movie already present in data store', movieId);
      return {
        type: ActionTypes.Movie.getMovie,
        movieId: movieId,
        res: {body: readyMovie}
      };
    }
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
