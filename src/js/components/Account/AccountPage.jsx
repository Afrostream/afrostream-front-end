import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {dict} from '../../../../config';
import classSet from 'classnames';
import moment from 'moment';

if (process.env.BROWSER) {
  require('./AccountPage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(UserActionCreators.getSubscriptions())
  ];
})
@connect(({ User }) => ({User}))
class AccountPage extends React.Component {

  state = {cardNumber: null};

  getUserInfos() {

    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    if (!user) {
      return '';
    }

    return (
      <div className="row account-details">
        <div className="account-details__header col-md-4">{dict.account.user.header}</div>
        <div className="account-details__container col-md-8">
          <div className="row">
            <div className="col-md-6">
              <span>{user.get('email')}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <span>{`${dict.account.user.password} : ******`}</span>
            </div>
            <div className="col-md-4">
              <Link className="btn btn-default" to="/reset">{dict.account.user.updatePassword}</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  formatPrice(price, currency) {
    const currencySymbols = {
      'USD': '$', // US Dollar
      'EUR': '€', // Euro
      'CRC': '₡', // Costa Rican Colón
      'GBP': '£', // British Pound Sterling
      'ILS': '₪', // Israeli New Sheqel
      'INR': '₹', // Indian Rupee
      'JPY': '¥', // Japanese Yen
      'KRW': '₩', // South Korean Won
      'NGN': '₦', // Nigerian Naira
      'PHP': '₱', // Philippine Peso
      'PLN': 'zł', // Polish Zloty
      'PYG': '₲', // Paraguayan Guarani
      'THB': '฿', // Thai Baht
      'UAH': '₴', // Ukrainian Hryvnia
      'VND': '₫' // Vietnamese Dong
    };

    return `${price / 100} ${currencySymbols[currency]}`;
  }

  getSubscriptions() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    if (!user) {
      return;
    }
    const subscriptionsList = user.get('subscriptions');

    const providerLogos = {
      'celery': '/images/payment/bank-cards-paypal.png',
      'recurly': '/images/payment/bank-cards-paypal.png',
      'gocardless': '/images/payment/virement.jpg'
    };

    if (!subscriptionsList) return;

    return (<div className="row account-details">
      <div className="col-md-12 table-responsive">
        <table className="table">
          <caption>{dict.account.billing.header}</caption>
          <thead>
          <tr>
            <th>{dict.account.billing.dateLabel}</th>
            <th>{dict.account.billing.decriptionLabel}</th>
            <th>{dict.account.billing.periodLabel}</th>
            <th>{dict.account.billing.methodLabel}</th>
            <th>{dict.account.billing.taxLabel}</th>
            <th>{dict.account.billing.totalLabel}</th>
            <th>{dict.account.billing.statusLabel}</th>
          </tr>
          </thead>
          <tbody>
          {subscriptionsList.map((subscription, i) => {

              let subscriptionDate = moment(subscription.get('subActivatedDate')).format('L');
              let internalPlan = subscription.get('internalPlan');
              let providerPlan = subscription.get('provider');
              //PERIOD
              let period = `${internalPlan.get('periodLength')} ${dict.account.billing.periods[internalPlan.get('periodUnit')]}`;
              let now = moment();
              let activeDate = moment(subscription.get('subPeriodStartedDate'));
              let endDate = moment(subscription.get('subPeriodEndsDate'));
              let percentComplete = (now - activeDate) / (endDate - activeDate) * 100;
              let periodPercent = {width: `${percentComplete}%`};
              //PRICE
              let currencyPlan = internalPlan.get('currency');
              let amountInCentsExclTax = this.formatPrice(internalPlan.get('amountInCentsExclTax'), currencyPlan);
              let amountInCents = this.formatPrice(internalPlan.get('amountInCents'), currencyPlan);
              //PROVIDER
              let providerName = providerPlan.get('providerName');
              let providerLogo = providerLogos.hasOwnProperty(providerName) ? providerLogos[providerName] : '';
              //STATUS
              let subscriptionStatus = subscription.get('subStatus');
              let statusClasses = {
                'fa': true,
                'fa-clock-o': subscriptionStatus == 'pending',
                'fa-toggle-off': subscriptionStatus == 'canceled',
                'fa-toggle-on': subscriptionStatus == 'active'
              };

              let statusLabel;
              switch (subscriptionStatus) {
                case 'active':
                case 'expired':
                case 'future':
                case 'canceled':
                  statusLabel = dict.account.billing.status[subscriptionStatus];
                  break;
                case 'pending':
                case 'pending_active':
                case 'pending_canceled':
                case 'pending_expired':
                case 'requesting_canceled':
                  statusLabel = dict.account.billing.status['pending'];
                  break;
              }
              return (
                <tr key={`subscription-${i}-info`}>
                  <th scope="row">{subscriptionDate}</th>
                  <td>{internalPlan.get('description')}</td>
                  <td>{period}
                    <div className="progress">
                      <div className="progress-bar progress-bar-info progress-bar-sm" role="progressbar"
                           aria-valuenow="70"
                           aria-valuemin="0" aria-valuemax="100" style={periodPercent}>
                      </div>
                    </div>
                  </td>
                  <td><img src={providerLogo} alt={providerName} className="img-responsive"/></td>
                  <td>{amountInCentsExclTax}</td>
                  <td>{amountInCents}</td>
                  <td><i className={classSet(statusClasses)} title={statusLabel}
                         data-toggle="tooltip"
                         data-placement="top"></i> {statusLabel}</td>
                </tr>)
            }
          ).toJS()}
          </tbody>
        </table>
      </div>
    </div>);
  }

  getPlan() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    if (!user) {
      return;
    }
    const planCode = user.get('planCode');

    if (!planCode) {
      return;
    }

    const subscriptionsList = user.get('subscriptions');

    if (!subscriptionsList) {
      return;
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

  renderChilds() {
    const {
      props: {
        User,children
        }
      } = this;

    const user = User.get('user');
    if (!user) {
      return 'no user found';
    }

    if (children) {
      return children
    }

    return (
      <div>
        <div className="row account-details">
          <h1>{dict.account.header}</h1>
        </div>
        {this.getUserInfos()}
        {this.getPlan()}
        {this.getSubscriptions()}
      </div>
    )
  }

  render() {
    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg account-page">
          {this.renderChilds()}
        </div>
      </div>)
  }
}

export default AccountPage;
