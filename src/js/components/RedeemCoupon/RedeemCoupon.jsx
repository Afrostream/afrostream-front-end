import React from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'

if (process.env.BROWSER) {
  require('./RedeemCoupon.less')
}

@connect(({}) => ({}))
class RedeemCoupon extends React.Component {

  componentDidMount () {
    const {

      props: {
        dispatch
      }
    } = this
    dispatch(ModalActionCreators.open({target: 'redeemCoupon', closable: false}))
  }

  render () {
    return (
      <div className="row-fluid">
        <div className="redeem-coupon-page">
          <div className="auth-container">
            <div id="reset-container">
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RedeemCoupon
