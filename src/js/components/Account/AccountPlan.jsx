import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { dict } from '../../../../config';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./AccountPlan.less');
}

@connect(({User, Billing}) => ({User, Billing}))
class AccountPlan extends React.Component {

  render () {
    const {
      props: {
        User, Billing
      }
    } = this;

    const user = User.get('user');
    if (!user) {
      return <div />;
    }
    const planCode = user.get('planCode');

    if (!planCode) {
      return <div />;
    }

    const subscriptionsList = Billing.get('subscriptions');

    if (!subscriptionsList) {
      return <div />;
    }

    let currentSubscription = subscriptionsList.find((obj)=> {
      return obj.get('isActive') === 'yes';// && obj.get('subStatus') !== 'canceled'
    });

    let cancelSubscriptionClasses = {
      'btn': true,
      'btn-default': true,
      'cancel-plan-hidden': !currentSubscription || (currentSubscription.get('subStatus') === 'canceled') || (currentSubscription.get('provider').get('providerName') === 'celery')
    };

    const planLabel = dict.planCodes[planCode];

    return (
      <div className="row account-details">
        <div className="account-details__header col-md-4">{dict.account.plan.header}</div>
        <div className="account-details__container col-md-8">
          <div className="row">
            <div className="col-md-8">
              <span>{planLabel}</span>
            </div>
            <div className="col-md-4">
              <Link className={classSet(cancelSubscriptionClasses)}
                    to="/compte/cancel-subscription">{dict.account.plan.cancelPlan}</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AccountPlan;
