import ActionTypes from '../consts/ActionTypes'
/**
 * Get subscriptions list for user
 * @returns {Function}
 */
export function getSubscriptions () {
  return (dispatch, getState) => {
    const user = getState().User.get('user')
    if (!user) {
      return {
        type: ActionTypes.Billing.getSubscriptions,
        res: null
      }
    }
    return async api => {
      return {
        type: ActionTypes.Billing.getSubscriptions,
        res: await api({path: `/api/subscriptions/status`})
      }
    }
  }
}

/**
 * Subscribe to afrostream plan
 * @param data
 * @returns {Function}
 */
export function subscribe (data, isGift = false) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.subscribe,
      res: await api({path: `/api/billings/${isGift ? 'gifts' : 'subscriptions'}`, method: 'POST', params: data}),
      isGift
    })
  }
}

export function cancelSubscription (subscription) {
  return (dispatch, getState) => {
    let uuid = subscription.get('subscriptionBillingUuid')
    return async api => ({
      type: ActionTypes.Billing.cancelSubscription,
      res: await api({path: `/api/billings/subscriptions/${uuid}/cancel`, method: 'PUT', params: {}})
    })
  }
}

/**
 * validate an afrostream coupon
 *
 * @param data
 * @returns {Function}
 */
export function validate (data) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.validate,
      res: await api({path: `/api/billings/coupons`, params: data})
    })
  }
}
/**
 * create new coupon
 *
 *
 * @param data {
 *  "couponCampaignBillingUuid" : "80bc2f24-bf54-4e13-9ecc-9d8bbe5e08ed"
 * }
 * @returns {Function}
 */
export function createCoupon (data) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.createCoupon,
      res: await api({path: `/api/billings/coupons`, method: 'POST', params: data})
    })
  }
}

/**
 * list coupons
 *
 *
 * @param data {
 *  "billingProviderName" :"afr",
 *  "couponCampaignBillingUuid" : "a94bb541-090d-44b2-b9d2-6e557c212566"
 * }
 * @returns {Function}
 */
export function getSponsorsList (params) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.sponsorsList,
      res: await api({
        path: `/api/billings/coupons/list`, params
      })
    })
  }
}

/**
 * Get coupon campain from billingProviderUuid
 * @returns {Function}
 */
export function getCouponCampaigns (params) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.getCouponCampaigns,
      couponsCampaignBillingUuid: params.couponsCampaignBillingUuid,
      res: await api({
        path: `/api/billings/couponscampaigns`,
        params
      })
    })
  }
}

/**
 * Get internalplans billing api
 * @returns {Function}
 */
export function getInternalplans (contextBillingUuid = 'common') {

  return (dispatch, getState) => {
    let readyPlans = getState().Billing.get(`internalPlans/${contextBillingUuid}`)

    if (readyPlans) {
      console.log('plans already present in data store')
      return {
        type: ActionTypes.Billing.getInternalplans,
        contextBillingUuid,
        res: {
          body: readyPlans.toJS()
        }
      }
    }

    return async api => ({
      type: ActionTypes.Billing.getInternalplans,
      contextBillingUuid,
      res: await api({
        path: `/api/billings/internalplans`, params: {
          contextBillingUuid: contextBillingUuid
        }
      })
    })
  }
}
