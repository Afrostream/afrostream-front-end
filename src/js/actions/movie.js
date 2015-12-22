import ActionTypes from '../consts/ActionTypes';

export function getMovie(movieId, location) {
  console.log('getMovie', movieId)
  return (dispatch, getState) => {
    if (!movieId) {
      console.log('no movie id passed in action', movieId);
      return {
        type: ActionTypes.Movie.getMovie,
        movieId
      };
    }

    let readyMovie = getState().Movie.get(`movies/${movieId}`);
    const user = getState().User.get('user');

    if (user && location) {
      let planCode = user.get('planCode');
      if (!planCode) {
        location.transitionTo('/select-plan');
        return {
          type: ActionTypes.Movie.getMovie,
          movieId
        };
      }
    }

    if (readyMovie) {
      console.log('movie already present in data store', movieId);
      return {
        type: ActionTypes.Movie.getMovie,
        movieId,
        res: {
          body: readyMovie.toJS()
        }
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
        movieId
      };
    }
    let readySeason = getState().Movie.get(`movies/${movieId}/seasons`);
    if (readySeason) {
      console.log('season already present in data store', movieId);
      return {
        type: ActionTypes.Movie.getSeason,
        movieId,
        res: {
          body: readySeason.toJS()
        }
      };
    }
    return async api => ({
      type: ActionTypes.Movie.getSeason,
      movieId,
      res: await api(`/movies/${movieId}/seasons`)
    });
  };
}
