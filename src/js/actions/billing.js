import ActionTypes from '../consts/ActionTypes';
/**
 * Get subscriptions list for user
 * @returns {Function}
 */
export function getSubscriptions () {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    if (!user) {
      return {
        type: ActionTypes.Billing.getSubscriptions,
        res: null
      }
    }
    return async api => {
      return {
        type: ActionTypes.Billing.getSubscriptions,
        res: await api(`/api/subscriptions/status`)
      };
    };
  };
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
      res: await api(`/api/billings/${isGift ? 'gifts' : 'subscriptions'}`, 'POST', data),
      isGift
    });
  };
}

export function cancelSubscription (subscription) {
  return (dispatch, getState) => {
    let uuid = subscription.get('subscriptionBillingUuid');
    return async api => ({
      type: ActionTypes.Billing.cancelSubscription,
      res: await api(`/api/billings/subscriptions/${uuid}/cancel`, 'PUT', {})
    });
  };
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
      res: await api(`/api/billings/coupons`, 'GET', data)
    });
  };
}
/**
 * create new coupon
 *
 *
 * @param data {
 *  "userBillingUuid" : "48776f1a-ac29-264f-6100-bad807bbf062",
 *  "couponCampaignBillingUuid" : "80bc2f24-bf54-4e13-9ecc-9d8bbe5e08ed"
 * }
 * @returns {Function}
 */
export function create (data) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.create,
      res: await api(`/api/billings/coupons`, 'POST', data)
    });
  };
}

/**
 * Get coupon campain from billingProviderUuid
 * @returns {Function}
 */
export function getCouponCampaigns (providerName) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Billing.getCouponCampaigns,
      res: await api(`/api/billings/couponscampaigns`, 'GET', {
        billingProvider: providerName
      })
    });
  };
}

/**
 * Get internalplans billing api
 * @returns {Function}
 */
export function getInternalplans (providerName = 'recurly') {

  return (dispatch, getState) => {
    let readyPlans = getState().Billing.get(`internalPlans/${providerName}`);

    if (readyPlans) {
      console.log('plans already present in data store');
      return {
        type: ActionTypes.Billing.getInternalplans,
        providerName,
        res: {
          body: readyPlans.toJS()
        }
      };
    }

    return async api => ({
      type: ActionTypes.Billing.getInternalplans,
      providerName,
      res: await api(`/api/billings/internalplans`, 'GET', {
        providerName: providerName
      })
    });
  }
}
