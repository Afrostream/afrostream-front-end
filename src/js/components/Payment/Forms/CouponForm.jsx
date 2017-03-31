import React, { PropTypes } from 'react'
import Spinner from '../../Spinner/Spinner'
import TextField from 'material-ui/TextField'
import * as BillingActionCreators from '../../../actions/billing'
import config from '../../../../../config'
import { Link, I18n } from '../../Utils'
import shallowEqual from 'react-pure-render/shallowEqual'
import ReactTooltip from 'react-tooltip'

const {defaultCouponCode, promoFlashInternalPlanUUID} = config

class CouponForm extends I18n {

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

  componentWillReceiveProps (nextProps) {
    const {
      props: {
        plan
      }
    } = this

    if (nextProps.selected !== this.props.selected && nextProps.selected) {
      if (plan && plan.get('internalPlanUuid') === promoFlashInternalPlanUUID) {
        this.checkCoupon(defaultCouponCode)
      }
    }
    if (!shallowEqual(nextProps, this.props)) {
      this.attachTooltip()
    }
  }

  isCouponCodeCompatible () {
    const {
      props: {
        plan,
        provider
      }
    } = this

    let isCouponCodeCompatible = true
    if (plan) {
      const providerPlans = plan.get('providerPlans')
      const currentProvider = providerPlans.find((prov) => prov.get('provider').get('providerName') === provider)
      if (currentProvider) {
        isCouponCodeCompatible = currentProvider.get('isCouponCodeCompatible')
      }
    }
    return isCouponCodeCompatible
  }

  attachTooltip () {
    ReactTooltip.rebuild()
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
               res: {
                 body: {
                   coupon
                 }
               }
             }) => {
        const validCoupon = coupon && coupon.status === 'waiting'
        this.setState({
          validCoupon,
          fetching: false
        })
      }).catch((e) => {
        this.setState({
          validCoupon: false,
          fetching: false
        })
      })
  }

  renderPromoCode () {
    const {
      props: {
        plan,
        Billing
      }
    } = this

    const isCouponCodeCompatible = this.isCouponCodeCompatible()
    let coupon = Billing.get('coupon')
    let validCoupon = this.state.validCoupon
    let couponName = ''
    let couponIcon = 'zmdi-block'
    let dataTip = {
      ['data-tip']: !isCouponCodeCompatible ? this.getTitle('payment.promo.disabledLabel') : ''
    }
    let inputAttributes = {
      disabled: Boolean(!isCouponCodeCompatible),
      onChange: (event, payload) => {
        clearTimeout(this.updateTimeout)
        this.updateTimeout = setTimeout(() => {
          this.checkCoupon(payload)
        }, 200)
      }
    }


    const promoPlan = (plan && (plan.get('internalPlanUuid') === promoFlashInternalPlanUUID && defaultCouponCode)) || ''

    if (coupon && coupon.size) {
      const couponCode = coupon.get('code')
      const providers = coupon.get('internalCouponsCampaign').get('providers')
      const couponCampeign = coupon.get('campaign')
      const couponType = couponCampeign.get('couponsCampaignType')
      validCoupon = coupon && coupon.get('status') === 'waiting'
      inputAttributes.defaultValue = couponCode || promoPlan
      if (couponType !== 'promo') {
        couponName = (
          <Link className="coupon-warning"
                to={`/coupon?code=${couponCode}`}>{this.getTitle('payment.promo.activate')}</Link>)
        couponIcon = 'zmdi-alert-triangle'
      } else {
        couponIcon = 'zmdi-check'
        couponName = couponCampeign.get('description')
      }
    } else {
      if (isCouponCodeCompatible) {
        inputAttributes.defaultValue = promoPlan
      }
    }


    return (
      <div className="col-md-12" ref="couponContainer" {...dataTip}>
        <ReactTooltip place="top" type="dark"
                      effect="solid"/>
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
              floatingLabelText={this.getTitle('payment.promo.label')}
              {...inputAttributes}
              hintText={this.getTitle('payment.promo.placeHolder')}
            />
          </div>
          <div className="col-md-1">
            <i className={`zmdi coupon-check
                                ${couponIcon }
                                zmdi-hc-2x`}
               aria-hidden="true"/>
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
