import React from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';

if (process.env.BROWSER) {
  require('./ResetPasswordPage.less');
}

@connect(({}) => ({}))
class ResetPasswordPage extends React.Component {

  componentDidMount() {
    const {
      props: {
        dispatch
        }
      } = this;
    dispatch(ModalActionCreators.open('showReset', false, '/'));
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
