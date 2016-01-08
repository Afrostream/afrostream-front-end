import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as OauthActionCreator from '../../actions/oauth';
import ModalComponent from './ModalComponent';

if (process.env.BROWSER) {
  require('./ModalLogin.less');
}

class ModalLogin extends ModalComponent {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      password: null,
      loginFailed: false,
      timestamp: new Date()
    };
  }

  handleInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      dispatch
      } = this.props;

    dispatch(OauthActionCreator.login(this.state));
  }

  getForm() {
    return (
      <div className="a0-notloggedin a0-mode">
        <form noValidate="" onChange={::this.handleInputChange} onSubmit={::this.handleSubmit}>
          <div className="a0-collapse-social">
            <div className="a0-iconlist a0-hide"><p className="a0-hide">... ou connectez-vous à l'aide de</p></div>
            <div className="a0-separator a0-hide"><span>ou</span></div>
          </div>
          <div className="a0-corporate-credentials a0-hide">Please enter your <strong>corporate</strong> credentials at
            <span className="a0-domain"></span>.
          </div>
          <div className="a0-emailPassword">
            <div className="a0-inputs">

              <div className="a0-email">

                <label htmlFor="a0-signin_easy_email" className="a0-sad-placeholder">
                  Courriel
                </label>

                <div className="a0-input-box">
                  <i className="a0-icon-budicon-5"></i>
                  <input name="email" id="a0-signin_easy_email" type="email" placeholder="Courriel" title="Courriel"/>
                </div>
              </div>

              <div className="a0-password">
                <label htmlFor="a0-signin_easy_password" className="a0-sad-placeholder">
                  Mot de passe
                </label>

                <div className="a0-input-box">
                  <i className="a0-icon-budicon"></i>
                  <input name="password" id="a0-signin_easy_password" type="password" placeholder="Mot de passe"
                         title="Mot de passe"/>
                </div>

              </div>

            </div>
            <div className="a0-sso-notice-container a0-hide">
              <i className="a0-icon-budicon"></i><span className="a0-sso-notice">Single Sign-on enabled</span>
            </div>
            <div className="a0-action">
              <button type="submit" className="a0-primary a0-next">Se connecter</button>
              <div className="a0-db-actions">
                <div className="a0-create-account a0-buttons-actions">
                  <Link to="/reset" className="a0-forgot-pass  a0-btn-small">Vous avez oublié votre mot de passe
                    ?</Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  render() {
    var fieldClass = classNames({
      'field': true,
      'error': this.state.loginFailed
    });

    var errClass = classNames({
      'ui': true,
      'error': true,
      'message': true,
      'visible': this.state.loginFailed
    });

    return (
      <div id="a0-lock" className="a0-lock a0-theme-default">
        <div className="a0-signin">
          <div className="a0-popup">
            <div className="a0-overlay a0-active">
              <div className="a0-centrix">
                <div id="a0-onestep" className="a0-panel a0-onestep a0-active">
                  {/*HEADER*/}
                  <div className="a0-header a0-top-header ">
                    <div className="a0-bg-gradient"></div>
                    <div className="a0-icon-container">
                      <div className="a0-avatar">
                        <i className="a0-avatar-guest a0-icon-budicon-2"></i>
                      </div>
                    </div>
                    <h1>S’identifier</h1>
                    <h2 className="a0-error a0-hide"></h2>
                    <h2 className="a0-success a0-hide">&nbsp;</h2>
                    <a className="a0-close a0-icon-budicon-3 " href="#" onClick={::this.handleClose}></a>
                  </div>
                  <div className="a0-mode-container">
                    {this.getForm()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ModalLogin;
