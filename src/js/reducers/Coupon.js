import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash'
const initialState = Immutable.fromJS({
  'coupon': {}
});


export default createReducer(initialState, {

  [ActionTypes.Coupon.validate](state, { res}) {

    debugger;
    console.log('*** inside the reducer ***');
    console.log(res);
    console.log('*** end of response inside reducer ***');

    if (!res) {
      return state;
    }
    const data = res.body;
    debugger;
    return state.merge({
      ['coupon']: _.merge(state.get('coupon').toJS(), data)
    });
  }
});
