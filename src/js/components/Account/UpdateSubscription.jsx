import React, { PropTypes } from 'react'
import * as BillingActionCreators from '../../actions/billing'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { Link } from '../Utils'
import moment from 'moment'
import PaymentImages from '../Payment/PaymentImages'
import { withRouter } from 'react-router'
import { isBoolean } from '../../lib/utils'
import RaisedButton from 'material-ui/RaisedButton'
import classSet from 'classnames'
import Spinner from '../Spinner/Spinner'
import scriptLoader from '../../lib/script-loader'
import config from '../../../../config'
import { I18n } from '../Utils'
const {
  stripeApi
} = config

import {
  injectIntl
} from 'react-intl'

import {
  StripeForm
} from '../Payment/Forms'

if (process.env.BROWSER) {
  require('../Payment/PaymentPage.less')
}

const style = {
  margin: 12
}

@connect(({Billing, User}) => ({Billing, User}))
class UpdateSubscription extends I18n {
  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      pending: true,
      error: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const state = {
      subscription: null,
      user: null,
      stripeId: null,
      loading: false,
      disabled: false,
      error: null
    }

    const {
      Billing,
      User,
      params: {
        subscriptionBillingUuid
      },
      location: {
        pathname
      }
    } = nextProps

    const subscriptionsList = Billing.get('subscriptions')
    const user = User.get('user')

    if (!subscriptionsList ||
        !user ||
        !subscriptionBillingUuid) {
      return this.setState({pending: false, error: new Error('user'), disabled: true})
    }

    let subscription = subscriptionsList.find((obj, i) => {
      // debug:
      //console.log('subscription ', i, ' uuid ', obj.get('subscriptionBillingUuid'),
      // 'provider', obj.get('provider').get('providerName'), obj.toJSON())
      return obj.get('subscriptionBillingUuid') === subscriptionBillingUuid &&
             obj.get('provider').get('providerName') === 'stripe'
    })

    if (!subscription ||
        !subscription.get('user') ||
        !subscription.get('user').get('userProviderUuid')) {
      return this.setState({pending: false, error: new Error('subscription'), disabled: true})
    }

    const stripeId = subscription.get('user').get('userProviderUuid')

    state.subscription = subscription
    state.user = user
    state.stripeId = stripeId
    state.pending = false
    this.setState(state)
  }

  getUserSubscription (user) {
    let subscription = user.getIn(['subscriptionsStatus', 'subscriptions'])
      .filter(sub => {
        return sub.get('isActive') === 'yes' && sub.get('isCancellable') === 'yes'
      })
      .first()

    if (!subscription) {
      subscription = user.getIn(['subscriptionsStatus', 'subscriptions'])
        .filter(sub => {
          return sub.get('isActive') === 'yes'
        })
        .first()
    }

    return subscription.get('subscriptionBillingUuid')
  }

  async onSubmit(e) {
    e.preventDefault()

    this.setState({disabled: true, loading: true, error: null})

    try {
      const result = await this.refs.stripe.submit({
        firstName: this.state.user.firstName,
        lastName: this.state.user.lastName
      }, null)

      // debug:
      // console.log(result.subOpts.customerBankAccountToken)

      const {
        props: {
          dispatch
        }
      } = this

      // debug:
      // console.log(this.state.subscription)

      let billingResult = await dispatch(BillingActionCreators.updateUser({
        billingUserUuid: this.state.subscription.get('user').get('userBillingUuid'),
        billingUserInfos: { subOpts: { customerBankAccountToken: result.subOpts.customerBankAccountToken } }
      }))

      this.setState({disabled: false, loading: false, error: null})

      // success: returning to account page
      browserHistory.push('/account')
    } catch(e) {
      this.setState({disabled: false, loading: false, error: e})
    }

  }

  render () {
    const {
      props: {
        Billing,
        User,
        params: {
          subscriptionBillingUuid
        },
        location: {
          pathname
        }
      },
      state: {
        user, subscription, stripeId, disabled, loading
      }
    } = this

    if (!subscription) {
      return (<div />)
    }

    const error = this.state.error ? this.getTitle('payment.errors.cannotUpdateSubscription') : ''

    return (
      <div className="payment-wrapper">
        <form ref="form" onSubmit={::this.onSubmit} id="subscription-update" data-async className="payment-form">
          <div className="enter-payment-details">
            {this.getTitle('payment.updateCreditCard')}
          </div>
          <div className="panel">
            <StripeForm
              key="method-stripe"
              ref="stripe"
              provider="stripe"
              noPromoCode={true}
              {...this.props}
              selected={true}/>
          </div>
          <div className="col-md-12">
            <span className="payment-error" style={{display:'inline-block',width:'inherit',color:'red'}}>{error}</span>

            <span className={classSet({
              'spinner-payment': true,
              'spinner-loading': this.state.loading
            })}>
              <Spinner />
            </span>

            <button
              type="submit"
              form="subscription-update"
              className="button-create-subscription pull-right wecashup_button"
              disabled={disabled}>
              UPDATE
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default scriptLoader(
  [
    stripeApi
  ]
)(withRouter(injectIntl(UpdateSubscription)))
