import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';

if (process.env.BROWSER) {
  require('./LoginPage.less');
}

@connect(({ User }) => ({User})) class LoginPage extends React.Component {

  componentDidMount() {
    this.showLock();
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(UserActionCreators.showLock('login-container'));
  }

  render() {
    return (
      <div className="row-fluid">
        <div className="login-page">
          <div className="auth-container">
            <div id="login-container">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
