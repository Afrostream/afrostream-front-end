import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./LogOutButton.less');
}

@connect(({ User }) => ({User})) class LogOutButton extends React.Component {

  static contextTypes = {
    location: PropTypes.object.isRequired
  };

  logOut() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.logOut());
  }

  componentWillUnmount() {
    this.context.location.transitionTo('/');
  }

  render() {
    return (<button
      className="logout-button"
      onClick={::this.logOut}>se déconnecter
    </button>);
  }
}

export default LogOutButton;
