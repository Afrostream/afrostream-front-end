import React from 'react';
import { connect } from 'react-redux';
import {dict} from '../../../../config';
import classSet from 'classnames';
import moment from 'moment';

if (process.env.BROWSER) {
  require('./AccountSubscriptions.less');
}

@connect(({ User }) => ({User}))
class AccountSubscriptions extends React.Component {

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

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    if (!user) {
      return <div />;
    }
    const subscriptionsList = user.get('subscriptions');

    const providerLogos = {
      'celery': '/images/payment/bank-cards-paypal.png',
      'recurly': '/images/payment/bank-cards-paypal.png',
      'gocardless': '/images/payment/virement.jpg'
    };

    if (!subscriptionsList) {
      return <div />;
    }

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
                  <td>{statusLabel}</td>
                </tr>)
            }
          ).toJS()}
          </tbody>
        </table>
      </div>
    </div>);
  }
}

export default AccountSubscriptions;
