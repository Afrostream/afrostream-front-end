import React from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';

if (process.env.BROWSER) {
  require('./LoginPage.less');
}

@connect(({ User }) => ({User}))
class LoginPage extends React.Component {

  componentDidMount() {
    this.showLock();
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(ModalActionCreators.showLock('show', 'login-container'));
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
