import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import config from '../../../../config/client';

@connect(({ User }) => ({User})) class Welcome extends React.Component {

  showSigninLock() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.showLock());
  }

  showSignupLock() {
    const {
      props: {
        dispatch
        }
      } = this;
    //todo make signin action in params showLock('signin')
    dispatch(UserActionCreators.showLock());
  }

  render() {

    return (
      <div>
        <h3>In the welcome page</h3>

        <div className="btn-group navbar-collapse collapse navbar-left">
          <button type="button" className="btn btn-user btn-default dropdown-toggle" data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false" onClick={::this.showSignupLock}>abonnez-vous
          </button>
        </div>

        <div className="btn-group navbar-collapse collapse navbar-left">
          <button type="button" className="btn btn-user btn-default dropdown-toggle" data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false" onClick={::this.showSigninLock}>se connecter
          </button>
        </div>
      </div>
    );
  }
}

export default  Welcome;