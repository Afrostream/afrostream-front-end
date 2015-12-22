import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import LogOutButton from '../../components/User/LogOutButton';
import * as UserActionCreators from '../../actions/user';
import * as IntercomActionCreators from '../../actions/intercom';
import config from '../../../../config';
import { analytics } from '../../decorators';

if (process.env.BROWSER) {
  require('./PaymentError.less');
}
@analytics()
@connect(({ User }) => ({User}))
class PaymentError extends React.Component {

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

  componentWillUnmount() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(IntercomActionCreators.removeIntercom());
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
      <div className="payment-error">
        <h3>{this.props.title}</h3>

        <h4>{this.props.message}</h4>

        <p className="error">
          {typeof this.props.message !== 'undefined' && this.props.message === 'Votre session a expiré, veuillez recommencer.'
            ?
            <button className="error-button" onClick={::this.logOut}>merci de réessayer</button>
            :
            <a className="error-link" href={this.props.link}>{this.props.linkMessage}</a>
          }
        </p>
      </div>
    );
  }

}

export default PaymentError;
