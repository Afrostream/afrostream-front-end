import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Movie.getMovie](state, { movieId, res }) {
    const data = res.body;
    return state.merge({
      [`movies/${movieId}`]: data
    });
  },

  [ActionTypes.Movie.getSeason](state, { movieId, res }) {
    const data = res.body;
    return state.merge({
      [`movies/${movieId}/seasons`]: data
    });
  }

});
