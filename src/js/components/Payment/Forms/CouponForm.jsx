import React, { PropTypes } from 'react'
import { getI18n } from '../../../../../config/i18n'

class CouponForm extends React.Component {

  constructor (props) {
    super(props)
  }

  renderPromoCode () {
    const {
      props: {
        Billing
      }
    } = this
    let coupon = Billing.get('coupon')
    let couponProps = {}

    if (coupon && coupon.size) {
      couponProps.defaultValue = coupon.get('code')
    }

    return (
      <div className="form-group col-md-6">
        <label className="form-label" htmlFor="coupon_code">{getI18n().payment.promo.label}</label>
        <input
          type="text"
          className="form-control coupon-code"
          data-billing="coupon_code"
          name="coupon_code"
          id="coupon_code"
          ref="couponCode"
          {...couponProps}
          placeholder={getI18n().payment.promo.placeHolder}
        />
      </div>
    )
  }

  render () {
    return this.renderPromoCode()
  }
}

export default CouponForm
