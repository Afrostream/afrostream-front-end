import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as UserActionCreators from '../../actions/user'
import { Link, I18n } from '../Utils'
import {
  injectIntl
} from 'react-intl'

@connect(({User}) => ({User}))
class PaymentSuccess extends I18n {

  logOut () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(UserActionCreators.logOut())
  }

  render () {
    return (
      <div className="payment-wrapper">
        <div className="payment-success">
          <h2>{this.getTitle('payment.success.title')}</h2>

          <h3>{this.getTitle('payment.success.message')}</h3>

          <p className="success">
            <Link className="success-button"
                  to="/">{this.getTitle('payment.success.linkMessage')}
            </Link>
          </p>
        </div>
      </div>
    )
  }

}

export default injectIntl(PaymentSuccess)
