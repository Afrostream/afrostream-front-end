import ActionTypes from '../consts/ActionTypes';
import {notFound,notFoundArray} from './notFoundAction';
export function getMovie(movieId) {
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
      res: await api(`/api/movies/${movieId}`).catch(notFound)
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
      res: await api(`/api/movies/${movieId}/seasons`).catch(notFoundArray)
    });
  };
}
