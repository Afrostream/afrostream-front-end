import React, { PropTypes } from 'react'
import * as BillingActionCreators from '../../../actions/billing'
import CouponForm from './CouponForm'

class CashwayForm extends CouponForm {

  constructor (props) {
    super(props)
    this.state = {
      hasLib: true
    }
  }

  hasLib () {
    return this.state.hasLib
  }

  async submit (billingInfo, currentPlan) {

    const {
      props: {
        dispatch,
        provider
      }
    } = this

    const {couponCode} = this.refs


    return await dispatch(BillingActionCreators.getCouponCampaigns({
      provider
    }))
      .then(({res: {body: {couponsCampaigns = []}}}) => {

        const couponCampaign = _.find(couponsCampaigns, ({internalPlans}) => {

          return _.find(internalPlans, ({internalPlanUuid}) => {
            return internalPlanUuid === currentPlan.get('internalPlanUuid')
          })

        })

        if (!couponCampaign) {
          throw new Error('Billing campaign not found')
        }

        return dispatch(BillingActionCreators.createCoupon({
          billingProviderName: provider,
          lastName: billingInfo.lastName,
          firstName: billingInfo.firstName,
          couponsCampaignBillingUuid: couponCampaign.couponsCampaignBillingUuid
        }))

      })
      .then(({res: {body: {coupon = {}}}}) => {
        if (!coupon.code) {
          throw new Error('Error on create coupon')
        }
        return {
          billingProviderName: provider,
          subOpts: {
            couponCode: coupon.code
          }
        }
      })
  }

  render () {
    return (<div className="row" ref="cashwayForm"/>)
  }
}

export default CashwayForm
