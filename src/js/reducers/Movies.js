import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Movies.toggleNext](state, { page }) {
    return state.merge({
      [page]: page
    });
  },

  [ActionTypes.Movies.togglePrev](state, { page }) {
    return state.merge({
      [page]: page
    });
  }
});
