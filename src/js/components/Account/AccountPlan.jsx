import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getI18n } from '../../../../config/i18n'
import classSet from 'classnames'

if (process.env.BROWSER) {
  require('./AccountPlan.less')
}

@connect(({User, Billing}) => ({User, Billing}))
class AccountPlan extends React.Component {

  render () {
    const {
      props: {
        User, Billing
      }
    } = this

    const user = User.get('user')
    if (!user) {
      return <div />
    }
    const planCode = user.get('planCode')

    if (!planCode) {
      return <div />
    }

    const subscriptionsList = Billing.get('subscriptions')

    if (!subscriptionsList) {
      return <div />
    }

    let currentSubscription = subscriptionsList.find((obj)=> {
      return obj.get('isActive') === 'yes'// && obj.get('subStatus') !== 'canceled'
    })


    let subStatus = currentSubscription && currentSubscription.get('subStatus')
    let isReactivable = currentSubscription && currentSubscription.get('isReactivable')
    let isCancelable = currentSubscription && currentSubscription.get('isCancelable')

    let updateSubscriptionClasses = {
      'btn': true,
      'btn-default': true,
      'cancel-plan-hidden': !currentSubscription || isCancelable === 'no' || (subStatus === 'canceled' && isReactivable === 'no') || (currentSubscription.get('provider').get('providerName') === 'celery')
    }

    const planLabel = getI18n().planCodes[planCode]

    let updateLabel = getI18n().account.plan.cancelPlan
    if (subStatus === 'canceled' && isReactivable === 'yes') {
      updateLabel = getI18n().account.plan.reactivePlan
    }

    return (
      <div className="row account-details">
        <div className="account-details__header col-md-4">{getI18n().account.plan.header}</div>
        <div className="account-details__container col-md-8">
          <div className="row">
            <div className="col-md-8">
              <span>{planLabel}</span>
            </div>
            <div className="col-md-4">
              <Link className={classSet(updateSubscriptionClasses)}
                    to="/compte/update-subscription">{updateLabel}</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountPlan
