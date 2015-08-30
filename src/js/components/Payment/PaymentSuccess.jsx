import React from 'react';

if (process.env.BROWSER) {
  require('./PaymentSuccess.less');
}

class PaymentSuccess extends React.Component {

  render() {

    return (
      <div className="payment-success">
        <h3>Votre abonnement a bien été enregistré</h3>

        <p>merci pour votre inscription</p>

        <p className="success"><a className="success-link" href="/">Commencez la visite sur le site</a></p>
      </div>
    );
  }

}

export default PaymentSuccess;
