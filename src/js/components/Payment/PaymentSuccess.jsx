import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import * as IntercomActionCreators from '../../actions/intercom';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./PaymentSuccess.less');
}

@connect(({ User }) => ({User}))
class PaymentSuccess extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentWillUnmount() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(IntercomActionCreators.removeIntercom());
    this.logOut();
  }

  logOut() {
    const {
      props: {
        dispatch
        }
      } = this;

    if (this.props.isGift) {
      dispatch(UserActionCreators.logOut());
    } else {
      this.context.router.transitionTo(`/`);
    }
  }

  render() {
    return (
      <div className="payment-success">
        <h3>{this.props.isGift ? 'Votre cadeau a bien été enregistré' : 'Votre abonnement a bien été enregistré'}</h3>

        <h3>merci pour votre {this.props.isGift ? 'support' : 'inscription'}</h3>

        <p className="success">
          <button className="success-button"
                  onClick={::this.logOut}>{this.props.isGift ? 'se deconnecter' : 'Commencez la visite sur le site'}</button>
        </p>
      </div>
    );
  }

}

export default PaymentSuccess;
