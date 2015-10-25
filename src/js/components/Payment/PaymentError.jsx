import React from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../../components/User/LogOutButton';
import * as UserActionCreators from '../../actions/user';

if (process.env.BROWSER) {
  require('./PaymentError.less');
}

@connect(({ User }) => ({User})) class PaymentError extends React.Component {

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

  componentWillMount() {
    document.getElementsByTagName('BODY')[0].scrollTop = 0;
  }

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

    if (typeof this.props.message !== 'undefined' && this.props.message === 'Votre session a expiré, veuillez recommencer.') {

      return (
        <div className="payment-error">
          <h3>{this.props.title}</h3>
          <p>{this.props.message}</p>
          <p className="error"><button className="error-button" onClick={::this.logOut}>merci de réessayer</button></p>
        </div>
      );
    } else {

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

}

export default PaymentError;
