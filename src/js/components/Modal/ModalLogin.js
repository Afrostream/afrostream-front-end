import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as OauthActionCreator from '../../actions/oauth';
import * as ModalActionCreator from '../../actions/modal';
import ModalComponent from './ModalComponent';
import config from '../../../../config';
import {Validation, Joi} from 'react-validation-decorator';

if (process.env.BROWSER) {
  require('./ModalLogin.less');
}

@connect(({ User }) => ({User}))
@Validation
class ModalLogin extends ModalComponent {

  constructor(props) {
    super(props);
    this.state = {
      success: false,
      loading: false,
      password: null,
      email: null,
      timestamp: new Date()
    };
  }

  static contextTypes = {
    location: React.PropTypes.object,
    history: React.PropTypes.object
  };

  validationSchema = Joi.object().keys({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().min(6).max(30).required().label('Le mot de passe'),
    repeat_password: Joi.string().valid(Joi.ref('password')).required().label('Le mot de passe de verification')
  });

  validationOptions = () => {
    let keyType = this.getI18n();
    let options = config.oauth2.dict[keyType];
    return {
      language: options.language
    };
  }

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
        dispatch(ModalActionCreator.open('show'));
      }).catch(::this.onError);
    }
  }

  handleInputChange(evt) {
    let formData = this.state;
    formData[evt.target.name] = evt.target.value;
    this.setState(formData, () => {
      this.validate(evt.target.name);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      props: { dispatch },
      context: { history }
      } = this;

    const self = this;
    this.setState({
      loading: true,
      error: ''
    });

    let typeCall = this.getI18n();
    let postData = _.pick(this.state, ['email', 'password']);

    dispatch(OauthActionCreator[typeCall](postData)).then(function () {
      self.setState({
        success: true,
        loading: false
      });
      if (self.props.type !== 'showReset') {
        dispatch(ModalActionCreator.close());
        dispatch(OauthActionCreator.getIdToken());
        history.pushState(null, '/');
      }
    }).catch(::this.onError);
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

    dispatch(ModalActionCreator.open('show'));
  }

  getI18n() {
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
    return keyType;
  }

  getTitle(key = 'title') {
    let keyType = this.getI18n();
    return config.oauth2.dict[keyType][key] || '';
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
      return (<div/>);
    }

    let formTemplate;
    let social = config.oauth2.facebook;
    switch (this.props.type) {
      case 'show':
      case 'showSignin':
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
          <input name="email" id="easy_email" type="email" value={this.state.email}
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
          <input name="password" id="easy_password" type="password" pattern=".{6,}" required
                 placeholder={this.getTitle('passwordPlaceholder')}
                 title={this.getTitle('passwordPlaceholder') +' 6 characters minimum'}/>
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
          <button type="submit" className="primary next">{this.getTitle('action')}</button>
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
          <button type="submit" className="primary next">{this.getTitle('action')}</button>
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
                <input name="repeat_password" id="reset_easy_repeat_password" type="password"
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
                  disabled={!this.isDirty() || !this.isValid()}>{this.getTitle('action')}</button>
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

    var fieldClass = classNames({
      'field': true,
      'error': !this.state.error
    });

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

    const pending = User.get('pending');

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
    )
  }
}

ModalLogin.propTypes = {
  type: React.PropTypes.string,
  dispatch: React.PropTypes.func
};

export default ModalLogin;
