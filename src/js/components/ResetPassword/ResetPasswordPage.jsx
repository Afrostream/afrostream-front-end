import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';

if (process.env.BROWSER) {
  require('./ResetPasswordPage.less');
}

@connect(({ User }) => ({User})) class ResetPasswordPage extends React.Component {

  componentDidMount() {
    this.showLock();
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(UserActionCreators.showLock('showReset', 'reset-container'));
  }

  render() {
    return (
      <div className="row-fluid">
        <div className="reset-page">
          <div className="auth-container">
            <div id="reset-container">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPasswordPage;
