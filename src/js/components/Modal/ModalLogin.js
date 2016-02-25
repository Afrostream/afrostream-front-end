import React from 'react';
import ReactDOM from'react-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as OauthActionCreator from '../../actions/oauth';
import * as ModalActionCreator from '../../actions/modal';
import * as UserActionCreators from '../../actions/user';
import * as IntercomActionCreators from '../../actions/intercom';
import ModalComponent from './ModalComponent';
import {oauth2} from '../../../../config';
import MobileDetect from 'mobile-detect';
import _ from 'lodash';

if (process.env.BROWSER) {
  require('./ModalLogin.less');
}

@connect(({ User }) => ({User}))
class ModalLogin extends ModalComponent {

  constructor(props) {
    super(props);
    this.state = {
      success: false,
      loading: false,
      password: null,
      repeat_password: null,
      email: null,
      errors: {},
      timestamp: new Date()
    };
  }

  static contextTypes = {
    location: React.PropTypes.object,
    history: React.PropTypes.object
  };

  componentDidMount() {
    const {
      props: { dispatch },
      context: { location }
      } = this;
    let { query } = location;
    let token = query && query.k;
    if (token) {
      dispatch(OauthActionCreator.reset({k: token})).then(function () {
        //New password success validate, open login view
        dispatch(ModalActionCreator.open('show', false, '/'));
      }).catch(::this.onError);
    }
    const userAgent = (window.navigator && navigator.userAgent) || '';
    this.setState({
      ua: new MobileDetect(userAgent)
    });
  }

  isValid() {
    let valid = _.filter(this.state.errors, (value, key) => {
      return value;
    });
    return !valid.length;
  }

  validateSize(value, min = 0, max = 0) {
    if (!value) return 'empty';
    if (value.length < min) return 'min';
    if (value.length > max) return 'max';
    return null;
  }

  validate(targetName) {
    let errors = this.state.errors;
    errors[targetName] = null;
    let valueForm = this.state[targetName];
    let isValid = true;
    let valitationType = targetName;
    let regex = null;
    switch (targetName) {
      case 'email':
        regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = 'email' && regex.test(valueForm);
        break;
      case 'password':
      case 'repeat_password':
        //Minimum 6 and Maximum 50 characters :
        regex = /^.{6,50}$/;
        isValid = regex.test(valueForm) && this.state['password'] === valueForm;
        valitationType = this.validateSize(valueForm, 6, 50) || (this.state['password'] === valueForm ? '' : 'same');
        break;
    }

    if (!isValid) {
      const i18nValidMess = this.getTitle('language');
      let label = i18nValidMess[targetName];
      let errMess = i18nValidMess[valitationType];
      errors[targetName] = label + ' ' + errMess;
    }
    this.setState({
      errors: errors
    });
  }

  renderValidationMessages(target) {
    let errorMessage = this.state.errors[target];
    if (!errorMessage) return '';
    return (<div className="help-block">{ errorMessage }</div>);
  }

  handleInputChange(evt) {
    let formData = this.state;
    if (!evt.target) {
      return;
    }
    let name = evt.target.getAttribute('name');
    let value = evt.target.value;
    formData[name] = value;
    this.setState(formData, () => {
      this.validate(name);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      props: { dispatch}
      } = this;

    const self = this;

    let valitations = ['email', 'password'];

    if (self.props.type === 'showReset') {
      valitations.push('repeat_password');
    }

    let formData = this.state;
    _.forEach(valitations, (name)=> {
      let domNode = ReactDOM.findDOMNode(self.refs[name]);
      if (domNode) {
        formData[name] = domNode.value;
        this.setState(formData, () => {
          this.validate(name);
        });
      }
    });

    if (!self.isValid()) {
      return;
    }

    this.setState({
      loading: true,
      error: ''
    });

    let typeCall = self.getType();
    let postData = _.pick(self.state, ['email', 'password']);

    dispatch(OauthActionCreator[typeCall](postData)).then(() => {
      self.setState({
        success: true,
        loading: false
      });
      if (self.props.type !== 'showReset') {
        dispatch(UserActionCreators.getProfile());
        dispatch(ModalActionCreator.close());
        return;
      }
      dispatch(IntercomActionCreators.createIntercom());
    }).catch(::self.onError);
  }

  onError(err) {
    let errMess = err.message;
    if (err.response) {
      if (err.response.body) {
        errMess = err.response.body.message;
      } else if (err.response.text) {
        errMess = err.response.text;
      }
    }

    this.setState({
      loading: false,
      error: this.getTitle(errMess.toString()) || this.getTitle('wrongEmailPasswordErrorText')
    });
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
    this.context.history.pushState(null, '/')
    dispatch(ModalActionCreator.open('show'));
  }

  getI18n() {
    let keyType = 'signin';
    switch (this.props.type) {
      case 'show':
      case 'showSignin':
        keyType = 'signin';
        break;
      case 'showRelog':
        keyType = 'relog';
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
    return keyType;
  }

  getType() {
    let keyType = 'signin';
    switch (this.props.type) {
      case 'show':
      case 'showSignin':
      case 'showRelog':
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
    return keyType;
  }

  getTitle(key = 'title') {
    let keyType = this.getI18n();
    return oauth2.dict[keyType][key] || '';
  }

  getForm() {
    if (this.state.loading) {
      return (<div className="loading mode">
        <div className="spinner spin-container">
          <div className="spinner-css">
    <span className="side sp_left">
    <span className="fill"></span>
    </span>
    <span className="side sp_right">
    <span className="fill"></span>
    </span>
          </div>
          <div className="spin-message">
            <span>&nbsp;</span>
          </div>
        </div>
      </div>);
    }

    if (this.state.success) {
      return (<div />);
    }

    let formTemplate;
    let social = oauth2.facebook;
    switch (this.props.type) {
      case 'show':
      case 'showSignin':
      case 'showRelog':
        formTemplate = this.getSignIn();
        break;
      case 'showSignup':
      case 'showGift':
        formTemplate = this.getSignUp();
        break;
      case 'showReset':
        social = false;
        formTemplate = this.getReset();
        break;
    }

    return (
      <div className="notloggedin mode">
        <form noValidate="" onSubmit={::this.handleSubmit}>
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
        <div tabIndex="0" data-strategy="facebook" title="Login with Facebook" onClick={::this.facebookAuth}
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
          <input name="email" ref="email" id="easy_email" type="email" required
                 onChange={::this.handleInputChange}
                 placeholder={this.getTitle('emailPlaceholder')}
                 title={this.getTitle('emailPlaceholder')}/>
          {this.renderValidationMessages('email')}
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
          <input name="password" ref="password" id="easy_password" type="password" pattern=".{6,}" required
                 onChange={::this.handleInputChange}
                 placeholder={this.getTitle('passwordPlaceholder')}
                 title={this.getTitle('passwordPlaceholder') + ' 6 characters minimum'}/>
          {this.renderValidationMessages('password')}
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
          <button name="submit-btn" type="submit" className="primary next"
                  disabled={!::this.isValid}>{this.getTitle('action')}</button>
          <div className="options">
            <a href="#" onClick={::this.cancelAction}
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
          <button type="submit" className="primary next" disabled={!::this.isValid}>{this.getTitle('action')}</button>
          <div className="db-actions">
            <div className="create-account buttons-actions">
              <Link to="/reset" className="forgot-pass btn-small">{this.getTitle('forgotText')}</Link>
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
                <input name="repeat_password" ref="repeat_password" id="reset_easy_repeat_password" type="password"
                       required
                       onChange={::this.handleInputChange}
                       placeholder={this.getTitle('repeatPasswordPlaceholder')}
                       title={this.getTitle('repeatPasswordPlaceholder')}/>
                {this.renderValidationMessages('repeat_password')}
              </div>
            </div>

          </div>
          <div className="password_policy"></div>
        </div>
        <div className="action">
          <button type="submit" className="primary next"
                  disabled={!::this.isValid}>{this.getTitle('action')}</button>
          <div className="options">
            <a href="#" onClick={::this.cancelAction}
               className="centered btn-small cancel">{this.getTitle('cancelAction')}</a>
          </div>
        </div>

      </div>
    );
  }

  render() {

    const { props: { User } } = this;

    var errClass = classNames({
      'error': true,
      'hide': !this.state.error
    });

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    });

    let successClass = classNames({
      'success': true,
      'hide': !this.state.success
    });

    let ua = this.state.ua;

    let popupClass = classNames({
      'popup': true,
      'ios': ua && ua.is('iOS')
    });

    const classType = this.getType();

    const pending = User.get('pending');

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className={classType}>
            <div className={popupClass}>
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
                      <h2 className={errClass}>{this.state.error}</h2>
                      <h2 className={successClass}>{this.getTitle('successText')}</h2>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
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
      </div>
    )
  }
}

ModalLogin.propTypes = {
  type: React.PropTypes.string,
  dispatch: React.PropTypes.func
};

export default ModalLogin;
