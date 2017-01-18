import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'
import _ from 'lodash'
const initialState = Immutable.fromJS({
  'coupon': {}
})


function mergeData (origin, data) {
  if (!origin) {
    return data
  }
  return _.merge(origin.toJS(), data)
}

export default createReducer(initialState, {

  // #### SUBSCRIPTIONS ####
  [ActionTypes.Billing.getSubscriptions](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`subscriptions`]: mergeData(state.get('subscriptions'), data.subscriptions)
    })
  },
  // #### INTERNAL PLANS ####
  [ActionTypes.Billing.getInternalplans](state, {contextBillingUuid, res}) {
    if (!res) {
      return state
    }
    const data = res.body || []

    let mergedValues = {
      [`internalPlans/${contextBillingUuid}/plans__res`]: res,
      [`internalPlans/${contextBillingUuid}`]: data,
      [`internalPlans`]: data
    }

    _.forEach(data, (plan) => {
      return mergedValues[`internalPlans/${plan.internalPlanUuid}`] = plan
    })
    return state.merge(mergedValues)
  },

  [ActionTypes.Billing.subscribe](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      ['subscriptions']: mergeData(state.get('subscriptions'), [data])
    })
  },

  [ActionTypes.Billing.cancelSubscription](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      ['subscriptions']: mergeData(state.get('subscriptions'), data)
    })
  },

  [ActionTypes.Billing.couponValidate](state, {res}) {
    const data = res && res.body
    return state.merge({
      ['coupon']: data && data.coupon
    })
  },

  [ActionTypes.Billing.couponActivate](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      ['coupon']: null
    })
  },

  [ActionTypes.Billing.getCouponCampaigns](state, {couponsCampaignBillingUuid = 'coupon', res}) {

    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`coupons/${couponsCampaignBillingUuid}`]: data
    })
  },

  [ActionTypes.Billing.createCoupon](state, {res}) {

    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      ['coupon']: data
    })
  },

  [ActionTypes.Billing.sponsorsList](state, {res}) {

    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      ['sponsorsList']: data
    })
  }
})
