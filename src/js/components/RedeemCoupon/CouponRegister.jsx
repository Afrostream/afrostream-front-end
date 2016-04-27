import React from 'react';
import { connect } from 'react-redux';
import classSet from 'classnames';
import * as BillingActionCreators from '../../actions/billing';
import * as UserActionCreators from '../../actions/user';
import * as OauthActionCreator from '../../actions/oauth';
import PaymentSuccess from '../Payment/PaymentSuccess';
import Spinner from '../Spinner/Spinner';
import { oauth2 } from '../../../../config';

if (process.env.BROWSER) {
  require('./CouponRegister.less');
}

@connect(({Billing, User}) => ({Billing, User}))
class CouponRegister extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      success: false,
      loading: false,
      password: null,
      email: null,
      errors: {},
      signinError: null,
      timestamp: new Date()
    };
  }

  redeemCoupon (e) {
    e.preventDefault();

    let loginType = (e.target.id == 'create-account-coupon') ? 'signup' : 'signin';

    const {
      props: {
        dispatch,
        Billing,
        User
      }
    } = this;

    const coupon = Billing.get('coupon');
    const user = User.get('user');

    const self = this;

    let validations = ['email', 'password'];

    if (!self.isValid()) {
      return;
    }

    this.setState({
      loading: true,
      error: ''
    });

    let postData = _.pick(self.state, ['email', 'password']);

    dispatch(OauthActionCreator[loginType](postData)).then((result) => {

      dispatch(UserActionCreators.getProfile()).then((getProfileResult) => {
        let billingInfo = {
          email: getProfileResult.user.email,
          id: getProfileResult.user._id,
          internalPlanUuid: self.props.Billing.get('coupon').get('coupon').get('internalPlan').get('internalPlanUuid'),
          billingProvider: self.props.Billing.get('coupon').get('coupon').get('campaign').get('provider').get('providerName'),
          firstName: null,
          lastName: null,
          subOpts: {
            couponCode: self.props.Billing.get('coupon').get('coupon').get('code')
          }
        };

        dispatch(BillingActionCreators.subscribe(billingInfo)).then((subscribeResult) => {
          var planCode = self.props.Billing.get('coupon').get('coupon').get('internalPlan').get('internalPlanUuid');
          dispatch(UserActionCreators.getProfile());
          self.setState({
            signinError: false,
            success: true,
            loading: false
          });
        });
      });
    }).catch((err)=> {

      let signinErrorText = (err.status === 403)
        ? this.getTitle('wrongEmailPasswordErrorText') : this.getTitle('serverErrorText');

      self.setState({
        signinError: signinErrorText,
        success: false,
        loading: false
      });

    });
  }

  validate (targetName) {
    let errors = this.state.errors;
    errors[targetName] = null;
    let isValid = true;
    let valitationType = targetName.split('-')[0];
    let targetType = valitationType;
    let valueForm = this.state[targetType];
    let regex = null;

    switch (targetName) {
      case 'email-create-account-coupon':
      case 'email-signin-account-coupon':
        regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        isValid = 'email' && regex.test(valueForm);
        break;
      case 'password-create-account-coupon':
      case 'password-signin-account-coupon':
        //Minimum 6 and Maximum 50 characters :
        regex = /^.{6,50}$/;
        isValid = regex.test(valueForm);
        valitationType = this.validateSize(valueForm, 6, 50);
        break;
    }

    if (!isValid) {
      const i18nValidMess = this.getTitle('language');
      let label = i18nValidMess[targetType];
      let errMess = (targetType === 'email') ? '' : i18nValidMess[valitationType];
      errors[targetName] = label + ' ' + errMess;
    }
    this.setState({
      errors: errors
    });
  }

  validateSize (value, min = 0, max = 0) {
    if (!value) return 'empty';
    if (value.length < min) return 'min';
    if (value.length > max) return 'max';
    return null;
  }

  handleInputChange (evt) {
    let formData = this.state;
    if (!evt.target) {
      return;
    }
    let name = evt.target.getAttribute('name');//.split('-')[0];
    let shortName = name.split('-')[0];
    let value = evt.target.value;
    formData[shortName] = value;
    this.setState(formData, () => {
      this.validate(name);
    });
  }

  getTitle (key = 'title') {
    let keyType = this.getI18n();
    return oauth2.dict[keyType][key] || '';
  }

  getI18n () {
    let keyType = 'signin';
    switch (this.props.type) {
      case 'show':
      case 'showSignin':
        keyType = 'signin';
        break;
      case 'showSignup':
        keyType = 'signup';
        break;
    }
    return keyType;
  }

  isValid () {
    let valid = _.filter(this.state.errors, (value, key) => {
      return value;
    });
    return !valid.length;
  }

  renderValidationMessages (target) {
    let errorMessage = this.state.errors[target];
    if (!errorMessage) return '';
    return (<div className="help-block">{ errorMessage }</div>);
  }

  render () {
    if (this.state.success === true) {
      return (
        <div className="row-fluid brand-bg">
          <div className="container brand-bg account-page">
            <PaymentSuccess />
          </div>
        </div>
      );
    } else {

      let spinnerClasses = {
        'spinner-payment': true,
        'spinner-loading': this.state.loading
      };

      return (
        <div className="row-fluid brand-bg coupon-register-page">

          <div className="container brand-bg account-page">
            {this.state.signinError ? <section id="error" ref="error">{this.state.signinError}</section> : ''}
            <h2>Félicitations !</h2>
            <h4>Vous pouvez activer votre abonnement par:</h4>

            <div className={classSet(spinnerClasses)}>
              <Spinner />
            </div>

            <form id="create-account-coupon" className="create-account-coupon" onSubmit={::this.redeemCoupon}>
              <h3>Créez votre compte</h3>
              <h5>Vous pouvez commencer par la création d'un compte.</h5>
              <label className="email-label" htmlFor="email">Votre e-mail:</label>
              <input
                type="email"
                className="email"
                ref="email"
                id="email-create-account-coupon"
                name="email-create-account-coupon"
                onChange={::this.handleInputChange}
                placeholder="" required/>
              {this.renderValidationMessages('email-create-account-coupon')}

              <label className="password-label" htmlFor="password">Creer un mot de passe:</label>
              <input
                type="password"
                className="password"
                ref="password"
                id="password-create-account-coupon"
                name="password-create-account-coupon"
                onChange={::this.handleInputChange}
                placeholder=""
                required/>
              {this.renderValidationMessages('password-create-account-coupon')}
              <button
                id="button-create-account-coupon"
                type="submit"
                form="create-account-coupon"
                className="button-change-email btn btn-default">ENREGISTRER
              </button>
            </form>
            <h3 className="coupon-or">** OU **</h3>
            <form id="signin-account-coupon" className="signin-account-coupon" onSubmit={::this.redeemCoupon}>
              <h3>Déjà enregistré ?</h3>
              <h5>Veuillez entrer votre courriel et un mot de passe.</h5>
              <label className="email-label" htmlFor="email">Votre e-mail:</label>
              <input
                type="text"
                className="email"
                ref="email"
                id="email-signin-account-coupon"
                name="email-signin-account-coupon"
                onChange={::this.handleInputChange}
                placeholder="" required/>
              {this.renderValidationMessages('email-signin-account-coupon')}
              <label className="password-label" htmlFor="password">{this.getTitle('passwordPlaceholder')}</label>
              <input
                type="password"
                className="password"
                ref="password"
                id="password-signin-account-coupon"
                name="password-signin-account-coupon"
                onChange={::this.handleInputChange}
                placeholder="" required/>
              {this.renderValidationMessages('password-signin-account-coupon')}
              <button
                id="button-signin-account-coupon"
                type="submit"
                form="signin-account-coupon"
                className="button-change-email btn btn-default">CONNEXION
              </button>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default CouponRegister;
