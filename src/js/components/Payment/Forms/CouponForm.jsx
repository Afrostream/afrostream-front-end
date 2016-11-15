import React, { PropTypes } from 'react'
import { getI18n } from '../../../../../config/i18n'
import Spinner from '../../Spinner/Spinner'
import TextField from 'material-ui/TextField'
import * as BillingActionCreators from '../../../actions/billing'
import config from '../../../../../config'
import { Link } from 'react-router'
import shallowEqual from 'react-pure-render/shallowEqual'

class CouponForm extends React.Component {

  constructor (props, context) {
    super(props, context)
    this.state = {
      validCoupon: false,
      fetching: false
    }
  }

  componentDidMount () {
    this.attachTooltip()
  }

  componentDidUpdate () {
    this.attachTooltip()
  }

  attachTooltip () {
    const {couponContainer} = this.refs
    if (couponContainer) {
      $(couponContainer).tooltip()
    }
  }


  async checkCoupon (value) {
    const {
      props: {
        dispatch,
        selected
      }
    } = this

    if (!value || !selected) {
      return
    }

    let formData = {
      billingProviderName: config.sponsors.billingProviderName,
      coupon: value
    }
    this.setState({
      fetching: true
    })

    //Validate coupon
    return await dispatch(BillingActionCreators.couponValidate(formData))
      .then(({
        res:{
          body:{
            coupon
          }
        }
      }) => {
        const validCoupon = coupon && coupon.status === 'waiting'
        this.setState({
          validCoupon,
          fetching: false
        })
      }).catch((e)=> {
        this.setState({
          validCoupon: false,
          fetching: false
        })
      })
  }

  renderPromoCode () {
    const {
      props: {
        Billing,
        plan,
        provider
      }
    } = this

    const providerSelected = provider
    let isCouponCodeCompatible = false

    if (plan) {
      const providerPlans = plan.get('providerPlans')
      const currentProvider = providerPlans.find((prov) => prov.get('provider').get('providerName') === providerSelected)
      if (currentProvider) {
        isCouponCodeCompatible = currentProvider.get('isCouponCodeCompatible')
      }
    }

    let coupon = Billing.get('coupon')
    let validCoupon = this.state.validCoupon
    let couponName = ''
    let couponIcon = 'zmdi-block'
    let inputAttributes = {
      disabled: Boolean(!isCouponCodeCompatible),
      onChange: (event, payload) => {
        clearTimeout(this.updateTimeout)
        this.updateTimeout = setTimeout(()=> {
          this.checkCoupon(payload)
        }, 200)
      }
    }

    if (coupon && coupon.size) {
      const couponCode = coupon.get('code')
      const providers = coupon.get('internalCouponsCampaign').get('providers')
      const couponCampeign = coupon.get('campaign')
      const couponType = couponCampeign.get('couponsCampaignType')
      validCoupon = coupon && coupon.get('status') === 'waiting'
      inputAttributes.defaultValue = couponCode
      if (couponType !== 'promo') {
        couponName = (
          <Link className="coupon-warning" to={`/coupon?code=${couponCode}`}>{getI18n().payment.promo.activate}</Link>)
        couponIcon = 'zmdi-alert-triangle'
      } else {
        couponIcon = 'zmdi-check'
        couponName = couponCampeign.get('description')
      }
    }

    return (
      <div className="col-md-12"
           data-original-title={getI18n().payment.promo.disabledLabel}
           ref="couponContainer"
           data-placement="top"
           data-toggle="tooltip">
        <div className="row no-padding">
          <div className="col-md-11">
            <TextField
              floatingLabelFixed={true}
              fullWidth={true}
              type="text"
              data-billing="coupon_code"
              name="coupon_code"
              id="coupon_code"
              ref="couponCode"
              floatingLabelText={getI18n().payment.promo.label}
              {...inputAttributes}
              hintText={getI18n().payment.promo.placeHolder}
            />
          </div>
          <div className="col-md-1">
            <i className={`zmdi coupon-check
                                ${couponIcon }
                                zmdi-hc-2x`}
               aria-hidden=" true"/>
            {this.state.fetching && <Spinner/>}
          </div>
        </div>
        {validCoupon && <div className="row no-padding">
          <div className="col-md-12 coupon-desc">
            {couponName}
          </div>
        </div>}
      </div>
    )
  }

  render () {
    return this.renderPromoCode()
  }
}


CouponForm.propTypes = {
  selected: React.PropTypes.bool.isRequired,
  provider: React.PropTypes.string.isRequired
}

export default CouponForm