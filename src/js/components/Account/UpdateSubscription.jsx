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

import scriptLoader from '../../lib/script-loader'
import config from '../../../../config'
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
class UpdateSubscription extends React.Component {
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
      disabled: false
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

    // FIXME: le processing de la data pourrait être calculé hors du render()
    const subscriptionsList = Billing.get('subscriptions')
    const user = User.get('user')

    // FIXME: message d'erreur spécifique
    if (!subscriptionsList ||
        !user ||
        !subscriptionBillingUuid) {
      return this.setState({pending: false, error: new Error('user'), disabled: true})
    }

    let subscription = subscriptionsList.find((obj, i) => {
      console.log('subscription ', i, ' uuid ', obj.get('subscriptionBillingUuid'),
       'provider', obj.get('provider').get('providerName'))
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
    let billingInfo = {
      firstName: this.state.user.firstName,
      lastName: this.state.user.lastName
    }

    e.preventDefault()

    const result = await this.refs.stripe.submit(billingInfo, null)

    console.log(result)
    console.log(result.subOpts.customerBankAccountToken)
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
        user, subscription, stripeId, disabled
      }
    } = this

    if (!subscription) {
      return (<div><pre>{JSON.stringify(this.state)}</pre></div>)
    }

    return (
      <div className="payment-wrapper">
        <form ref="form" onSubmit={::this.onSubmit} id="subscription-update" data-async className="payment-form">
          <div className="enter-payment-details">
            Mise à jour des coordonnées bancaires
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
