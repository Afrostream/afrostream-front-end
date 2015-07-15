import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {
  [ActionTypes.Category.getCategory](state, { category, res }) {
    const list = res.body;
    return state.merge({
      [`current`]: category,
      [`category/${category}__res`]: res,
      [`category/${category}`]: list
    });
  }
});
