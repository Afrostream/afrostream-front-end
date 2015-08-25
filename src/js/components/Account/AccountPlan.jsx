import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';

if (process.env.BROWSER) {
  require('./AccountPage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(UserActionCreators.getProfile())
    ];
})
@connect(({ User }) => ({User})) class AccountPlan extends React.Component {

  getInitialState() {

    return {
      cardNumber: null
    }
  };

  componentDidMount() {

  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');

    if (user) {

      return (
        <div className="row-fluid">
        <div className="container">
        <h1>Change your plan</h1>
      </div>
      </div>
    );
    } else {

      return (
        <div className="row-fluid">
        no user found
      </div>
    );
    }
  }
}

export default AccountPlan;
