import React, { PropTypes } from 'react'
import { getI18n } from '../../../../../config/i18n'
import Spinner from '../../Spinner/Spinner'
import TextField from 'material-ui/TextField'
import * as BillingActionCreators from '../../../actions/billing'
import config from '../../../../../config'

class CouponForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      validCoupon: false,
      fetching: false
    }
  }

  async checkCoupon (value) {
    const {
      props: {
        dispatch
      }
    } = this

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
        let validCoupon = coupon && coupon.status === 'waiting'
        this.setState({
          validCoupon,
          fetching: false
        })
      }).catch((e)=> {
        this.setState({
          fetching: false
        })
      })
  }

  renderPromoCode () {
    const {
      props: {
        Billing
      }
    } = this
    let coupon = Billing.get('coupon')
    let couponName
    let inputAttributes = {
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
      const providerAfr = providers.find((provider)=> {
        return provider.get('providerName') === config.sponsors.billingProviderName
      })
      couponName = coupon.get('campaign').get('description')
      inputAttributes.defaultValue = couponCode
      if (providerAfr) {
        couponName = <Link to={`/coupon?code=${couponCode}`}>getI18n().payment.promo.activate</Link>
      }
    }

    return (
      <div className="col-md-12">
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
            <i className={`zmdi coupon-check ${this.state.validCoupon ? 'zmdi-check' : 'zmdi-block' } zmdi-hc-2x`}
               aria-hidden=" true"/>
            {this.state.fetching && <Spinner/>}
          </div>
        </div>
        {this.state.validCoupon && <div className="row no-padding">
          <div className="col-md-12">
            <div className=" col-md-12">{couponName}</div>
          </div>
        </div>}
      </div>
    )
  }

  render () {
    return this.renderPromoCode()
  }
}

export default CouponForm
