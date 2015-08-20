import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  initial: 2
});

export default createReducer(initialState, {

  [ActionTypes.Category.getTop](state, { res }) {
    const catList = res.body;
    return state.merge({
      ['total']: catList.length - 1,
      [`category/top__res`]: res,
      [`category/top`]: catList
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
    const defaultSection = menu[0];
    return state.merge({
      ['initial']: defaultSection._id,
      ['menu']: menu
    });
  },
  [ActionTypes.Category.getMeaList](state, { res }) {
    const meaList = res.body;
    return state.merge({
      ['meaList']: meaList
    });
  }
});
