import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import * as UserActionCreators from '../../actions/user';
import * as IntercomActionCreators from '../../actions/intercom';
import { dict } from '../../../../config';
import { Link } from 'react-router';

@connect(({User}) => ({User}))
class PaymentError extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    link: React.PropTypes.string,
    linkMessage: React.PropTypes.string,
    to: React.PropTypes.string,
    toMessage: React.PropTypes.string
  };

  static defaultProps = {
    title: dict.payment.errors.abo,
    message: '',
    link: '/',
    linkMessage: dict.payment.errors.retry,
    to: null,
    toMessage: null
  };

  componentWillUnmount () {
    const {
      props: {
        dispatch
      }
    } = this;
    dispatch(IntercomActionCreators.removeIntercom());
  }

  logOut () {
    const {
      props: {
        dispatch
      }
    } = this;

    dispatch(UserActionCreators.logOut());
  }

  render () {

    return (
      <div className="payment-wrapper">
        <div className="payment-error">
          <h3>{this.props.title}</h3>
          <h4>{this.props.message}</h4>
          <p className="error">
            <a href={this.props.link}>{this.props.linkMessage}</a>
          </p>{this.props.toMessage ?
          <Link to={this.props.to}>{this.props.toMessage}</Link> : ''}
        </div>
      </div>
    );
  }

}

export default PaymentError;
