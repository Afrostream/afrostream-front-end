import React from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';

if (process.env.BROWSER) {
  require('./LoginPage.less');
}

@connect(({ User }) => ({User}))
class LoginPage extends React.Component {

  componentDidMount() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(ModalActionCreators.open('show', false));
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
