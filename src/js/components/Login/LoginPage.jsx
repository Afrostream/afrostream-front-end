import React,{PropTypes} from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';

if (process.env.BROWSER) {
  require('./LoginPage.less');
}

@connect(({ User }) => ({User}))
class LoginPage extends React.Component {

  static contextTypes = {
    location: PropTypes.object.isRequired
  };

  componentDidMount() {
    const {
      props: {
        dispatch,location
        }
      } = this;
    let method;
    switch (location.pathname) {
      case '/signup':
        method = 'showSignup';
        break;
      case '/signin':
        method = 'showSignin';
        break;
      default :
        method = 'show';
        break;
    }
    dispatch(ModalActionCreators.open(method, false));
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
