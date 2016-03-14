import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash'
const initialState = Immutable.fromJS({
  'coupon': null
});


export default createReducer(initialState, {

  [ActionTypes.Coupon.validate](state, { res}) {
    console.log('*** inside the reducer ***');
    console.log(res);
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['coupon']: _.merge(state.get('coupon').toJS(), data)
    });
  }
});
