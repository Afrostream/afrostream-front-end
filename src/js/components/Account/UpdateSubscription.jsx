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

import {
  injectIntl
} from 'react-intl'

import {
  StripeForm
} from '../Payment/Forms'
// i18n ?
//import config from '../../../../config'
//import { I18n } from '../Utils'

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

  async submit(billingInfo, currentPlan) {
    return await this.refs.stripe.submit(billingInfo, currentPlan)
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
      }
    } = this

    // FIXME: le processing de la data pourrait être calculé hors du render()
    const subscriptionsList = Billing.get('subscriptions')
    const user = User.get('user')

    // FIXME: message d'erreur spécifique
    if (!subscriptionsList ||
        !user ||
        !subscriptionBillingUuid) {
      return (
        <div />
      )
    }

    let currentSubscription = subscriptionsList.find((obj) => {
      console.log( obj.get('subscriptionBillingUuid')
    , obj.toJSON(), obj.get('provider').get('providerName'))
      return obj.get('subscriptionBillingUuid') === subscriptionBillingUuid &&
             obj.get('provider').get('providerName') === 'stripe'
    })

    if (!currentSubscription ||
        !currentSubscription.get('user') ||
        !currentSubscription.get('user').get('userProviderUuid')) {
      return (
        <div />
      )
    }

    const stripeId = currentSubscription.get('user').get('userProviderUuid')

    console.log('stripe id = ', stripeId)

    return (
      <div className="panel-group">
        Mise à jour des coordonnées bancaires (stripe ID: {stripeId})
        <br/>
        <StripeForm
          key="method-stripe"
          ref="stripe"
          provider="stripe"
          {...this.props}
          selected={true}/>
      </div>
    )
  }
}

export default withRouter(injectIntl(UpdateSubscription))
