import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';

if (process.env.BROWSER) {
  require('./AccountPlan.less');
}

@connect(({ User }) => ({User})) class AccountPlan extends React.Component {

  getInitialState() {

    return {
      cardNumber: null
    }
  };

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
            <div className="account-plan">
              <h1>Changer de forfait</h1>
              <div className="account-plan-details">
                Cette page n’est pas encore active. Pour changer de forfait, veuillez contacter notre
                service client a l’adresse suivante:
                <a href="mailto:support@afrostream.tv?Subject=Changer%20mail" target="_top"> support@afrostream.tv</a>
              </div>
            </div>
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
