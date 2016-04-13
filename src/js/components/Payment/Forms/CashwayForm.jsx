import React, { PropTypes } from 'react';
import { dict } from '../../../../../config/client';

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

    const providerName = 'cashway';

    return await dispatch(CouponActionCreators.getCouponCampaigns('cashway'))
      .then(({res: {body: {couponsCampaigns = []}}}) => {

        const couponCampaign = _.find(couponsCampaigns, ({internalPlan : {internalPlanUuid}})=> {
          return internalPlanUuid === currentPlan.internalPlanUuid;
        });

        if (!couponCampaign) {
          throw new Error('Billing campaign not found');
        }

        return dispatch(CouponActionCreators.create({
          billingProvider: providerName,
          lastName: billingInfo.lastName,
          firstName: billingInfo.firstName,
          couponsCampaignBillingUuid: couponCampaign.couponsCampaignBillingUuid
        }));
      })
      .then(({res: {body: {coupon = {}}}}) => {
        if (!coupon.code) {
          throw new Error('Error on create coupon')
        }
        return {
          billingProvider: providerName,
          subOpts: {
            couponCode: coupon.code
          }
        }
      });
  }

  render () {
    return (<div className="row" ref="cashwayForm"/>);
  }
}

export default CashwayForm;
