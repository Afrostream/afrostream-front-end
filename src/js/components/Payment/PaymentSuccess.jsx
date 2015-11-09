import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import * as IntercomActionCreators from '../../actions/intercom';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./PaymentSuccess.less');
}

if (canUseDOM) {
  var paymentSuccessGa = require('react-ga');
}

@connect(({ User }) => ({User})) class PaymentSuccess extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillMount() {
    debugger;
    if (canUseDOM) {
      var pathName = this.props.pathName + '/success';
      paymentSuccessGa.initialize(config.google.analyticsKey, {debug: true});
      paymentSuccessGa.pageview(pathName);
      this.context.router.transitionTo(pathName);
    }
  }

  componentDidMount() {
    document.getElementsByTagName('BODY')[0].scrollTop = 0;
  }

  componentWillUnmount() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(IntercomActionCreators.removeIntercom());
    this.logOut();
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

    if (this.props.isGift) {
      return (
        <div className="payment-success">
          <h3>Votre cadeau a bien été enregistré</h3>

          <h3>merci pour votre support</h3>

          <p className="success">
            <button className="success-button" onClick={::this.logOut}>se deconnecter</button>
          </p>
        </div>
      );
    } else {
      return (
        <div className="payment-success">
          <h3>Votre abonnement a bien été enregistré</h3>

          <h3>merci pour votre inscription</h3>

          <p className="success">
            <button className="success-button" onClick={::this.logOut}>Commencez la visite sur le site</button>
          </p>
        </div>
      );
    }
  }

}

export default PaymentSuccess;
