import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import LogOutButton from '../../components/User/LogOutButton';
import * as UserActionCreators from '../../actions/user';
import * as IntercomActionCreators from '../../actions/intercom';
import {dict} from '../../../../config';

@connect(({ User }) => ({User}))
class PaymentError extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    link: React.PropTypes.string,
    linkMessage: React.PropTypes.string
  };

  static defaultProps = {
    title: dict.payment.errors.abo,
    message: '',
    link: '/',
    linkMessage: dict.payment.errors.retry
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
      <div className="payment-wrapper">
        <div className="payment-error">
          <h3>{this.props.title}</h3>
          <h4>{this.props.message}</h4>
          <p className="error">
            <a className="error-link" href={this.props.link}>{this.props.linkMessage}</a>
          </p>
        </div>
      </div>
    );
  }

}

export default PaymentError;
