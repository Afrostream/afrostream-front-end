import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import LogOutButton from '../../components/User/LogOutButton';
import * as UserActionCreators from '../../actions/user';
import * as IntercomActionCreators from '../../actions/intercom';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./PaymentError.less');
}
if (canUseDOM) {
  var paymentErrorGa = require('react-ga');
}

@connect(({ User }) => ({User})) class PaymentError extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    link: React.PropTypes.string,
    linkMessage: React.PropTypes.string,
    pathName: React.PropTypes.string
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    title: 'Erreur lors de la création de l’abonnement:',
    message: '',
    link: '/',
    linkMessage: 'merci de réessayer',
    pathName: '/error'
  };

  componentWillMount() {
    if (canUseDOM) {
      var pathName = this.props.pathName + '/error';
      paymentErrorGa.initialize(config.google.analyticsKey, {debug: true});
      paymentErrorGa.pageview(pathName);
      this.context.router.transitionTo(pathName);
    }
  }

  componentWillUnmount() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(IntercomActionCreators.removeIntercom());
    this.context.router.transitionTo('/');
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

          <h4>{this.props.message}</h4>

          <p className="error">
            <button className="error-button" onClick={::this.logOut}>merci de réessayer</button>
          </p>
        </div>
      );
    } else {

      return (
        <div className="payment-error">
          <h3>{this.props.title}</h3>

          <h4>{this.props.message}</h4>

          <p className="error"><a className="error-link" href={this.props.link}>{this.props.linkMessage}</a></p>
          <LogOutButton />
        </div>
      );
    }
  }

}

export default PaymentError;
