import ActionTypes from '../consts/ActionTypes';
import {notFound,notFoundArray} from './notFoundAction';

/**
 * validate an afrostream coupon
 *
 * @param data
 * @returns {Function}
 */
export function validate(data) {

  return (dispatch, getState) => {

    return async api => ({
      type: ActionTypes.Coupon.validate,
      res: await api(`/api/billings/coupons`, 'GET', data)
    });
  };
}


/**
 * Get coupon from afrostream
 * @returns {Function}
 */
export function getCoupon() {
  return (dispatch, getState, actionDispatcher) => {
    return async () => {
      const coupon = getState().Coupon.get('coupon');
      return async () => {
        return mergeCoupon({
          type: ActionTypes.Coupon.getCoupon,
          user: null
        }, getState, actionDispatcher);
      }
    };
  };
}
