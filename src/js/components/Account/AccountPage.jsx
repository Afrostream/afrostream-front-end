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
@connect(({ User }) => ({User})) class AccountPage extends React.Component {

  getCardNumber(accountCode) {

    var apiPath = config.apiClient.urlPrefix + '/subscriptions/billing/' + accountCode;
    var cardNumber;

    $.ajax({
      type: 'GET',
      url: apiPath,
      dataType: 'json',
      success: function (responseData) {
        //console.log(responseData);
        cardNumber = responseData.data.billing_info.last_four;
        console.log(cardNumber);
      },
      error: function (err) {

        console.log('**** there was an error ***');
        console.log(err);
        console.log('*** end of error message ***');
        cardNumber = '';
      }
    });

    return cardNumber;
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const user = User.get('user');

    if (user) {

      console.log('*** here is the user in the account page ***');
      console.log(user.get('accountCode'));
      console.log('*** end of the user in the account page ***');
      var cardNumber = this.getCardNumber(user.get('accountCode'));
      console.log('*** the card number ***');
      //console.log(cardNumber);

      return (
        <div className="row-fluid">
          <div className="container">
            <h1>Mon compte</h1>
            <div className="account-details">
              <div className="billing-details-header">
                ABONNEMENT ET FACTURATION
              </div>
              <div className="billing-details-container">
                <div className="billing-details-email">
                  <div className="email">{user.get('email')}</div>
                  <div className="change-email">
                    <Link to="/compte/email">Modifier l'addresse e-mail</Link>
                  </div>
                </div>

                <div className="billing-details-password">
                  <div className="password">Mot de passe: ******</div>
                  <div className="change-word">
                    <Link to="/compte/password">Modifier le mot de passe</Link>
                  </div>
                </div>

                <div className="billing-details-credit-card">
                  <div className="credit-card">**** **** **** {this.getCardNumber(user.get('accountCode'))}</div>
                  <div className="change-credit-card">
                    <Link to="/compte/credit-card">Mettre à jour les informations de paiement</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="plan-details">
              <div className="plan-details-header">DÉTAIL DU FORFAIT</div>
              <div className="plan-details-container">
                <div className="plan-details-plan-name">
                  <div className="plan-name">{user.get('planCode')}</div>
                  <div className="change-plan">
                    <Link to="/compte/plan">Changer de forfait</Link>
                  </div>
                </div>
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

export default AccountPage;
