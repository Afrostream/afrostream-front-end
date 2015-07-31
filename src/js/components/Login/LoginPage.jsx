import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';

if (process.env.BROWSER) {
  require('./LoginPage.less');
}

@connect(({ User }) => ({User})) class LoginPage extends React.Component {

  render() {
    return (
      <div className="row-fluid">
        <div className="login-page"/>
      </div>
    );
  }
}

export default LoginPage;
