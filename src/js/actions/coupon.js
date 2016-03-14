import ActionTypes from '../consts/ActionTypes';
import {notFound,notFoundArray} from './notFoundAction';

/**
 * validate an afrostream coupon
 *
 * @param data
 * @returns {Function}
 */
export function validate(data) {

  debugger;
  return (dispatch, getState) => {

    return async api => ({
      type: ActionTypes.Coupon.validate,
      res: await api(`/api/billings/coupons`, 'GET', data).catch(notFound)
    });
  };
}
