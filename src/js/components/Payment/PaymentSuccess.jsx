import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';

if (process.env.BROWSER) {
  require('./PaymentSuccess.less');
}

@connect(({ User }) => ({User}))  class PaymentSuccess extends React.Component {

  componentWillUnmount() {
    document.getElementById('intercom-container').style.display = 'none';
  }

  logOut() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.logOut());
  }

  render() {

    return (
      <div className="payment-success">
        <h3>Votre abonnement a bien été enregistré</h3>

        <p>merci pour votre inscription</p>

        <p className="success"><button className="success-button" onClick={::this.logOut}>Commencez la visite sur le site</button></p>
      </div>
    );
  }

}

export default PaymentSuccess;
