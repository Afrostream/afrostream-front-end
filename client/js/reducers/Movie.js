import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Movie.getMovie](state, {movieId, res}) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`movies/${movieId}`]: data
    });
  },

  [ActionTypes.Movie.getLast](state, {res}) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`movies/last`]: data
    });
  },

  [ActionTypes.Movie.getSeason](state, {movieId, res}) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`movies/${movieId}/seasons`]: data
    });
  }

});
