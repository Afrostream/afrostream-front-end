import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as OauthActionCreator from '../../actions/oauth';
import * as ModalActionCreator from '../../actions/modal';
import ModalComponent from './ModalComponent';
import config from '../../../../config';

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

  facebookAuth(event) {
    event.preventDefault();
    const {
      dispatch
      } = this.props;

    dispatch(OauthActionCreator.facebook());
  }

  cancelAction(event) {
    event.preventDefault();
    const {
      dispatch
      } = this.props;

    dispatch(ModalActionCreator.open('show'));
  }

  getTitle(key = 'title') {
    let keyType = 'signin';
    switch (this.props.type) {
      case 'show':
      case 'showSignin':
        keyType = 'signin';
        break;
      case 'showSignup':
        keyType = 'signup';
        break;
      case 'showGift':
        keyType = 'gift';
        break;
      case 'showReset':
        keyType = 'reset';
        break;
    }

    return config.auth2.dict[keyType][key];
  }

  getForm() {
    let formTemplate;
    let social = true;
    switch (this.props.type) {
      case 'show':
      case 'showSignin':
        formTemplate = this.getSignIn();
        break;
      case 'showSignup':
        formTemplate = this.getSignUp();
        break;
      case 'showReset':
        social = false;
        formTemplate = this.getReset();
        break;
    }

    return (
      <div className="notloggedin mode">
        <form noValidate="" onChange={::this.handleInputChange} onSubmit={::this.handleSubmit}>
          {social ? this.getSocial() : ''}
          <div className="instructions">{this.getTitle('headerText')}</div>
          {formTemplate}
        </form>
      </div>
    );
  }

  getSocial() {
    return (
      <div className="collapse-social">
        <div className="iconlist hide"><p className="hide">... ou connectez-vous à l'aide de</p></div>
        <div tabindex="0" data-strategy="facebook" title="Login with Facebook" onclick={this.facebookAuth}
             className="zocial icon facebook "
             dir="ltr">
          <span>Login with Facebook</span>
        </div>
        <div className="separator"><span>ou</span></div>
      </div>
    );
  }

  getEmail() {
    return (
      <div className="email">
        <label htmlFor="easy_email" className="sad-placeholder">
          {this.getTitle('emailPlaceholder')}
        </label>
        <div className="input-box">
          <i className="icon-budicon-5"></i>
          <input name="email" id="easy_email" type="email"
                 placeholder={this.getTitle('emailPlaceholder')}
                 title={this.getTitle('emailPlaceholder')}/>
        </div>
      </div>
    );
  }

  getPassword() {
    return (
      <div className="password">
        <label htmlFor="easy_password" className="sad-placeholder">
          {this.getTitle('passwordPlaceholder')}
        </label>

        <div className="input-box">
          <i className="icon-budicon"></i>
          <input name="password" id="easy_password" type="password"
                 placeholder={this.getTitle('passwordPlaceholder')} title={this.getTitle('passwordPlaceholder')}/>

        </div>
      </div>
    );
  }

  getSignUp() {
    return (
      <div className="emailPassword">
        <div className="inputs-wrapper">
          <div className="inputs">
            {this.getEmail()}
            {this.getPassword()}
          </div>
          <div className="password_policy"></div>
        </div>
        <div className="action">
          <button type="submit" className="primary next">{this.getTitle('action')}</button>
          <div className="options">
            <a href="#" onclick={::this.cancelAction}
               className="centered btn-small cancel">{this.getTitle('cancelAction')}</a>
          </div>
        </div>

      </div>
    );
  }

  getSignIn() {
    return (
      <div className="emailPassword">
        <div className="inputs">
          {this.getEmail()}
          {this.getPassword()}
        </div>
        <div className="sso-notice-container hide">
          <i className="icon-budicon"></i><span className="sso-notice">Single Sign-on enabled</span>
        </div>
        <div className="action">
          <button type="submit" className="primary next">{this.getTitle('action')}</button>
          <div className="db-actions">
            <div className="create-account buttons-actions">
              <Link to="/reset" className="forgot-pass btn-small">Vous avez oublié votre mot de passe ?</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getReset() {
    return (
      <div className="emailPassword">
        <div className="inputs-wrapper">
          <div className="inputs">
            {this.getEmail()}
            {this.getPassword()}
            <div className="repeatPassword">
              <label htmlFor="reset_easy_repeat_password" className="sad-placeholder">
                {this.getTitle('repeatPasswordPlaceholder')}
              </label>
              <div className="input-box">
                <i className="icon-budicon"></i>
                <input name="repeat_password" id="reset_easy_repeat_password" type="password"
                       placeholder={this.getTitle('repeatPasswordPlaceholder')}
                       title={this.getTitle('repeatPasswordPlaceholder')}/>
              </div>
            </div>

          </div>
          <div className="password_policy"></div>
        </div>
        <div className="action">
          <button type="submit" className="primary next">{this.getTitle('action')}</button>
          <div className="options">
            <a href="#" onclick={::this.cancelAction}
               className="centered btn-small cancel">{this.getTitle('cancelAction')}</a>
          </div>
        </div>

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
      <div id="lock" className="lock theme-default">
        <div className="signin">
          <div className="popup">
            <div className="overlay active">
              <div className="centrix">
                <div id="onestep" className="panel onestep active">
                  {/*HEADER*/}
                  <div className="header top-header ">
                    <div className="bg-gradient"></div>
                    <div className="icon-container">
                      <div className="avatar">
                        <i className="avatar-guest icon-budicon-2"></i>
                      </div>
                    </div>
                    <h1>{this.getTitle()}</h1>
                    <h2 className="error hide"></h2>
                    <h2 className="success hide">&nbsp;</h2>
                    <a className="close icon-budicon-3 " href="#" onClick={::this.handleClose}></a>
                  </div>
                  <div className="mode-container">
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

ModalLogin.propTypes = {
  type: React.PropTypes.string,
  location: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  history: React.PropTypes.object
};

export default ModalLogin;
