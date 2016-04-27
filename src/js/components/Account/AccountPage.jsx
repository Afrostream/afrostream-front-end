import React from 'react';
import { prepareRoute } from '../../decorators';
import * as BillingActionCreators from '../../actions/billing';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { dict } from '../../../../config';
import classSet from 'classnames';

import AccountPlan from './AccountPlan';
import AccountSubscriptions from './AccountSubscriptions';
import AccountSocial from './AccountSocial';

if (process.env.BROWSER) {
  require('./AccountPage.less');
}

@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(BillingActionCreators.getSubscriptions())
  ];
})
@connect(({User}) => ({User}))
class AccountPage extends React.Component {

  state = {cardNumber: null};

  getUserInfos () {

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

  renderChilds () {
    const {
      props: {
        User, children
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
        <AccountPlan />
        <AccountSubscriptions />
        <AccountSocial />
      </div>
    )
  }

  render () {
    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg account-page">
          {this.renderChilds()}
        </div>
      </div>)
  }
}

export default AccountPage;
