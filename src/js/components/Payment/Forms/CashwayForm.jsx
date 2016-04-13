import React, { PropTypes } from 'react';
import { dict } from '../../../../../config/client';
import * as CouponActionCreators from '../../../actions/coupon';

class CashwayForm extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      hasLib: true
    };
  }

  hasLib () {
    return this.state.hasLib;
  }

  async submit (billingInfo, currentPlan) {

    const {
      props: {
        dispatch
      }
    } = this;
    return await dispatch(CouponActionCreators.getCouponCampaigns('cashway'))
      .then((result) => {
        return dispatch(CouponActionCreators.create({
          userBillingUuid: 'toto',
          couponCampaignBillingUuid: 'toto'
        }))
      });
  }

  render () {
    return (<div className="row" ref="cashwayForm"/>);
  }
}

export default CashwayForm;
