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
    this.state = {
      pending: false
    }
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

    if (!subscription) {
      return;
    }

    this.setState({
      pending: true
    });

    dispatch(UserActionCreators.cancelSubscription(subscription))
      .then(()=> {
        dispatch(UserActionCreators.getSubscriptions());
      })
      .catch((err)=> {
        this.setState({
          pending: false
        });
      });
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
      return obj.get('isActive') === 'yes';// && obj.get('subStatus') !== 'canceled'
    });

    let activeSubscription = currentSubscription && currentSubscription.get('subStatus') !== 'canceled';
    let dictData = dict.account.cancel[activeSubscription ? 'active' : 'canceled'];

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
          <div className="col-md-12">
            <h1>{header}</h1>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row account-details__info">
            {infos}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            { activeSubscription ?
              <button className="btn btn-default button-cancel__subscription" {...inputAttributes}
                      disabled={this.state.pending}>
                {dict.account.cancel.submitBtn}
              </button> : ''}
            <Link className="btn btn-default btn-return__account" to="/compte">{dict.account.cancel.cancelBtn}</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default CancelSubscription;
