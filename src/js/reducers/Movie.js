import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Movie.getMovie](state, { movie, res }) {
    const data = res.body;
    return state.merge({
      [`movie/${movie}`]: data
    });
  },

  [ActionTypes.Movie.getSeason](state, { movie, res }) {
    const data = res.body;
    return state.merge({
      [`movie/${movie}/season`]: data
    });
  }

});
