import React, { PropTypes } from 'react'
import { getI18n } from '../../../../../config/i18n'
import * as BillingActionCreators from '../../../actions/billing'

class CashwayForm extends React.Component {

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
        dispatch
      }
    } = this

    const providerName = 'cashway'

    return await dispatch(BillingActionCreators.getCouponCampaigns('cashway'))
      .then(({res: {body: {couponsCampaigns = []}}}) => {

        const couponCampaign = _.find(couponsCampaigns, ({internalPlan : {internalPlanUuid}})=> {
          return internalPlanUuid === currentPlan.get('internalPlanUuid')
        })

        if (!couponCampaign) {
          throw new Error('Billing campaign not found')
        }

        return dispatch(BillingActionCreators.create({
          billingProvider: providerName,
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
          billingProvider: providerName,
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
