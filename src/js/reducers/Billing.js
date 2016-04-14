import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import _ from 'lodash'
const initialState = Immutable.fromJS({
  'coupon': {}
});


function mergeData (origin, data) {
  if (!origin) {
    return data;
  }
  return _.merge(origin.toJS(), data);
}

export default createReducer(initialState, {

  // #### SUBSCRIPTIONS ####
  [ActionTypes.Billing.getSubscriptions](state, {res}) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`subscriptions`]: mergeData(state.get('subscriptions'), data.subscriptions)
    });
  },
  // #### INTERNAL PLANS ####
  [ActionTypes.Billing.getInternalplans](state, {res}) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`internalPlans`]: data
    });
  },

  [ActionTypes.Billing.subscribe](state, {res, isGift}) {
    if (!res) {
      return state;
    }
    const data = isGift ? {} : res.body;
    return state.merge({
      ['subscriptions']: mergeData(state.get('subscriptions'), data)
    });
  },

  [ActionTypes.Billing.cancelSubscription](state, {res}) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['subscriptions']: mergeData(state.get('subscriptions'), data)
    });
  },

  [ActionTypes.Billing.validate](state, {res}) {

    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['coupon']: data
    });
  },

  [ActionTypes.Billing.getCouponCampaigns](state, {res}) {

    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['couponcampaigns']: data
    });
  },

  [ActionTypes.Billing.create](state, {res}) {

    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      ['coupon']: data
    });
  }
});
