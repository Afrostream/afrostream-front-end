import React from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';

if (process.env.BROWSER) {
  require('./ResetPasswordPage.less');
}

@connect(({ User }) => ({User}))
class ResetPasswordPage extends React.Component {

  componentDidMount() {
    this.showLock();
  }

  showLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(ModalActionCreators.showLock('showReset', 'reset-container'));
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
