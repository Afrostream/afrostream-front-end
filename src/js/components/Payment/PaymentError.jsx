import React from 'react';
import LogOutButton from '../../components/User/LogOutButton';
if (process.env.BROWSER) {
  require('./PaymentError.less');
}

class PaymentSuccess extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    link: React.PropTypes.string,
    linkMessage: React.PropTypes.string
  };

  static defaultProps = {
    title: 'Erreur lors de la création de l’abonnement:',
    message: '',
    link: '/',
    linkMessage: 'merci de réessayer'
  };

  render() {

    return (
      <div className="payment-error">
        <h3>{this.props.title}</h3>

        <p>{this.props.message}</p>

        <p className="error"><a className="error-link" href={this.props.link}>{this.props.linkMessage}</a></p>

        <LogOutButton />

      </div>
    );
  }

}

export default PaymentSuccess;
