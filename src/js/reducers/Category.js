import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Category.getTopByCategory](state, { category, res }) {
    const catList = res.body;
    return state.merge({
      ['total']: catList.length - 1,
      [`category/${category}/top__res`]: res,
      [`category/${category}/top`]: catList
    });
  },

  [ActionTypes.Category.getCategory](state, { category, res }) {
    const list = res.body;
    return state.merge({
      ['current']: category,
      [`category/${category}__res`]: res,
      [`category/${category}`]: list
    });
  },
  [ActionTypes.Category.getMenu](state, { res }) {
    const menu = res.body;
    const current = menu[0].slug;
    return state.merge({
      ['menu-active']: current,
      ['menu']: menu
    });
  }
});
