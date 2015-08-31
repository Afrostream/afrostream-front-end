import React from 'react';

if (process.env.BROWSER) {
  require('./PaymentError.less');
}

class PaymentSuccess extends React.Component {

  render() {

    return (
      <div className="payment-error">
        <h3>Erreur lors de la création de l'abonnement:</h3>

        <p>{this.props.message}</p>

        <p className="error"><a className="error-link" href="/">merci de réessayer</a></p>
      </div>
    );
  }

}

export default PaymentSuccess;
