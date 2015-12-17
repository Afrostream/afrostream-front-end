import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash';

const initialState = Immutable.fromJS({
  'categoryId': '1'
});

export default createReducer(initialState, {

  [ActionTypes.Category.getAllSpots](state, {res }) {
    const data = res.body;
    let mergeData = {}
    if (data) {
      _.forEach(data, function (category) {
        mergeData[`categorys/${category['_id']}/spots`] = category;
      });
    }

    return state.merge(mergeData);
  },

  [ActionTypes.Category.getSpots](state, { categoryId,res }) {
    const data = res.body;
    console.log('Category.getSpots', categoryId, data);
    return state.merge({
      ['categoryId']: categoryId,
      [`categorys/${categoryId}/spots__res`]: res,
      [`categorys/${categoryId}/spots`]: data
    });
  },

  [ActionTypes.Category.getCategory](state, { categoryId, res }) {
    const data = res.body;
    console.log('Category.getCategory', categoryId, data);
    return state.merge({
      ['categoryId']: categoryId,
      [`categorys/${categoryId}__res`]: res,
      [`categorys/${categoryId}`]: data
    });
  },
  [ActionTypes.Category.getMenu](state, { res }) {
    const data = res.body;
    console.log('Category.getMenu', data);
    const categoryId = data[0]._id;
    console.log('default categoryId', categoryId);
    return state.merge({
      ['categoryId']: categoryId,
      ['menu']: data
    });
  },
  [ActionTypes.Category.getMeaList](state, { res }) {
    const data = res.body;
    console.log('Category.getMeaList', data);
    return state.merge({
      ['meaList']: data
    });
  }
});
