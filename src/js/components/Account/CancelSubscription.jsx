import React,{PropTypes } from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {dict} from '../../../../config';
import moment from 'moment';

if (process.env.BROWSER) {
  require('./CancelSubscription.less');
}

@connect(({ User }) => ({User}))
class CancelSubscription extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  cancelSubscription(subscription) {

    const {
      props: {
        dispatch
        }
      } = this;

    if (!subscription) return;

    dispatch(UserActionCreators.cancelSubscription(subscription));
  }

  render() {
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

    if (!subscriptionsList) {
      return (
        <div />
      );
    }
    let currentSubscription = subscriptionsList.find((obj)=> {
      return obj.get('isActive') === 'yes' && obj.get('subStatus') !== 'canceled'
    });

    let dictData = dict.account.cancel[currentSubscription ? 'active' : 'canceled'];

    let header = dictData.header;
    let endDate;
    if (currentSubscription) {
      endDate = moment(currentSubscription.get('subPeriodEndsDate')).format('LLL');
    }
    let infos = dictData.info.replace(/{endDate}/gm, endDate);

    const inputAttributes = {
      onClick: event => ::this.cancelSubscription(currentSubscription)
    };

    return (
      <div className="account-credit-card">
        <div className="row account-details">
          <h1>{header}</h1>
        </div>
        <div className="row account-details__info">
          {infos}
        </div>
        <div className="row">
          { currentSubscription ?
            <button className="btn btn-default button-cancel__subscription" {...inputAttributes}>
              {dict.account.cancel.submitBtn}
            </button> : ''}
          <Link className="btn btn-default btn-return__account" to="/compte">{dict.account.cancel.cancelBtn}</Link>
        </div>
      </div>
    );
  }
}

export default CancelSubscription;
