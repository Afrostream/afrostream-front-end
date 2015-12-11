import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./PaymentSuccess.less');
}

@connect(({ User }) => ({User})) class BuyGiftSuccess extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    if (canUseDOM) {
      document.getElementsByTagName('BODY')[0].scrollTop = 0;
    }
  }

  browse() {
    const {
      props: {
        dispatch
        }
      } = this;
    this.context.router.transitionTo('/');
  }

  render() {
    return (
      <div className="payment-success">
        <h3>Votre abonnement a bien été enregistré</h3>
        <h3>merci pour votre support</h3>

        <p className="success">
          <button className="success-button" onClick={::this.browse}>Retourner a la page player</button>
        </p>
      </div>
    );
  }

}

export default BuyGiftSuccess;
