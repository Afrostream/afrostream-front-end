import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Category.getTopByCategory](state, { category, page, res }) {
    const catList = res.body;
    console.log('ActionTypes.Category.getTopByCategory', catList.length);
    return state.merge({
      ['total']: catList.length - 1,
      ['page']: page,
      [`category/${category}/top__res`]: res,
      [`category/${category}/top`]: catList
    });
  },

  [ActionTypes.Category.getCategory](state, { category, res }) {
    const list = res.body;
    console.log('ActionTypes.Category.getCategory', list.length);
    return state.merge({
      ['current']: category,
      [`category/${category}__res`]: res,
      [`category/${category}`]: list
    });
  },
  [ActionTypes.Category.getMenu](state, { res }) {
    const menu = res.body;
    console.log('ActionTypes.Category.getMenu', menu.length);
    const current = menu[0].slug;
    return state.merge({
      ['menu-active']: current,
      ['menu']: menu
    });
  }
});
