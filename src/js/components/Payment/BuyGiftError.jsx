import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import LogOutButton from '../../components/User/LogOutButton';
import * as UserActionCreators from '../../actions/user';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./PaymentError.less');
}

@connect(({ User }) => ({User})) class BuyGiftError extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    link: React.PropTypes.string,
    linkMessage: React.PropTypes.string
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: 'Erreur lors de la création de l’abonnement:',
    message: '',
    link: '/',
    linkMessage: 'merci de réessayer'
  };

  componentDidMount() {
    document.getElementsByTagName('BODY')[0].scrollTop = 0;
  }

  componentWillUnmount() {
    const {
      props: {
        dispatch
        }
      } = this;
    this.context.router.transitionTo('/');
  }

  retry() {
    const {
      props: {
        dispatch
        }
      } = this;
    this.context.router.transitionTo('/');
  }

  render() {

    if (typeof this.props.message !== 'undefined' && this.props.message === 'Votre session a expiré, veuillez recommencer.') {

      return (
        <div className="payment-error">
          <h3>{this.props.title}</h3>

          <h4>{this.props.message}</h4>

          <p className="error">
            <button className="error-button" onClick={::this.retry}>merci de réessayer</button>
          </p>
        </div>
      );
    } else {

      return (
        <div className="payment-error">
          <h3>{this.props.title}</h3>

          <h4>{this.props.message}</h4>
          <button className="error-button" onClick={::this.retry}>merci de réessayer</button>
        </div>
      );
    }
  }

}

export default BuyGiftError;
