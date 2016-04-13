import ActionTypes from '../consts/ActionTypes';
import { notFound, notFoundArray } from './notFoundAction';

/**
 * validate an afrostream coupon
 *
 * @param data
 * @returns {Function}
 */
export function validate (data) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Coupon.validate,
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
      type: ActionTypes.Coupon.create,
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
      type: ActionTypes.Coupon.getCouponCampaigns,
      res: await api(`/api/billings/couponscampaigns`, 'GET', {
        billingProvider: providerName
      })
    });
  };
}
