import React from 'react';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../../config/client';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./AccountPage.less');
}

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(UserActionCreators.getProfile())
  ];
})
@connect(({ User }) => ({User}))
class AccountPage extends React.Component {

  state = {cardNumber: null};

  getPlan() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');
    if (!user) {
      return '';
    }
    const planCode = user.get('planCode');

    if (!planCode) {
      return '';
    }

    const plans = {
      afrostreammonthly: 'THINK LIKE A MAN',
      afrostreamambassadeurs: 'Ambassadeurs',
      afrostreampremium: 'DO THE RIGHT THING'
    };

    let cancelSubscriptionClasses = {
      'cancel-plan': true,
      'cancel-plan-hidden': (planCode === 'afrostreammonthly' ? false : true)
    };

    return ( <div className="plan-details">
      <div className="plan-details-header">DÉTAIL DU FORFAIT</div>
      <div className="plan-details-container">
        <div className="plan-details-plan-name">
          <div className="plan-name">{plans[user.get('planCode')]}</div>
          <div className={classSet(cancelSubscriptionClasses)}>
            <Link to="/cancel-subscription">Annuler votre abonnement</Link>
          </div>
        </div>
      </div>
    </div>)
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
        <div className="row-fluid brand-bg">
          <div className="container brand-bg">
            <div className="account-page">
              <h1>Mon compte</h1>

              <div className="account-details">
                <div className="billing-details-header">
                  ABONNEMENT ET FACTURATION
                </div>
                <div className="billing-details-container">
                  <div className="billing-details-email">
                    <div className="email">{user.get('email')}</div>
                  </div>

                  <div className="billing-details-password">
                    <div className="password">Mot de passe: ******</div>
                    <div className="change-password">
                      <Link to="/reset">Modifier le mot de passe</Link>
                    </div>
                  </div>
                </div>
              </div>
              {this.getPlan()}
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

export default AccountPage;
