import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash';

const initialState = Immutable.fromJS({
  'categoryId': '1'
});

export default createReducer(initialState, {

  [ActionTypes.Category.getAllSpots](state, {res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`categorys/spots__res`]: res,
      [`categorys/spots`]: data
    });
  },

  [ActionTypes.Category.getSpots](state, { categoryId,res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['categoryId']: categoryId,
      [`categorys/${categoryId}/spots__res`]: res,
      [`categorys/${categoryId}/spots`]: data
    });
  },

  [ActionTypes.Category.getCategory](state, { categoryId, res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['categoryId']: categoryId,
      [`categorys/${categoryId}__res`]: res,
      [`categorys/${categoryId}`]: data
    });
  },
  [ActionTypes.Category.getMenu](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    const categoryId = data[0]._id;
    return state.merge({
      ['categoryId']: categoryId,
      ['menu']: data
    });
  },
  [ActionTypes.Category.getMeaList](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    console.log('Category.getMeaList', data);
    return state.merge({
      ['meaList']: data
    });
  }
});
