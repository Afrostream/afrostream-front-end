import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash'
const initialState = Immutable.fromJS({
  'coupon': {}
});


export default createReducer(initialState, {

  [ActionTypes.Coupon.validate](state, { res}) {

    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['coupon']: _.merge(state.get('coupon').toJS(), data)
    });
  }
});
