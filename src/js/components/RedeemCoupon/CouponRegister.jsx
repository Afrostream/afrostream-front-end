import React from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../actions/modal';
import * as UserActionCreators from '../../actions/user';
import * as OauthActionCreator from '../../actions/oauth';
import PaymentSuccess from '../Payment/PaymentSuccess';

import {oauth2} from '../../../../config';

if (process.env.BROWSER) {
  require('./RedeemCoupon.less');
}

@connect(({ Coupon,User }) => ({Coupon, User}))
class CouponRegister extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      success: false,
      loading: false,
      password: null,
      email: null,
      errors: {},
      timestamp: new Date()
    };
  }

  componentDidMount() {
    const {
      props: {
        Coupon,
        User,
        dispatch
        }
      } = this;

    debugger;
  }

  redeemCoupon(e) {
    debugger;
    e.preventDefault();

    const {
      props: {
        dispatch,
        Coupon,
        User
        }
      } = this;

    const coupon = Coupon.get('coupon');
    const user = User.get('user');

    const self = this;

    let validations = ['email', 'password'];
    debugger;

    let formData = this.state;
    _.forEach(validations, (name)=> {
      let domNode = ReactDOM.findDOMNode(self.refs[name]);
      debugger;
      if (domNode) {
        formData[name] = domNode.value;
        this.setState(formData, () => {
          this.validate(name);
        });
      }
    });
    debugger;

    if (!self.isValid()) {
      debugger;
      return;
    }
    debugger;

    this.setState({
      loading: true,
      error: ''
    });
    debugger;

    let postData = _.pick(self.state, ['email', 'password']);
    debugger;

    dispatch(OauthActionCreator.signup(postData)).then((result) => {

      debugger;

      dispatch(UserActionCreators.getProfile()).then((getProfileResult) => {
        debugger;
        let billingInfo = {
          email: getProfileResult.user.email,
          id: getProfileResult.user._id,
          internalPlanUuid: self.props.Coupon.get('coupon').get('coupon').get('internalPlan').get('internalPlanUuid'),
          billingProvider: self.props.Coupon.get('coupon').get('coupon').get('campaign').get('provider').get('providerName'),
          firstName: null,
          lastName: null
        }
        debugger;

        dispatch(UserActionCreators.subscribe(billingInfo)).then((subscribeResult) => {
          debugger;
          self.setState({
            success: true,
            loading: false
          });

        });
      });
    });
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

  validateSize(value, min = 0, max = 0) {
    if (!value) return 'empty';
    if (value.length < min) return 'min';
    if (value.length > max) return 'max';
    return null;
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

  getTitle(key = 'title') {
    let keyType = this.getI18n();
    return oauth2.dict[keyType][key] || '';
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

  isValid() {
    let valid = _.filter(this.state.errors, (value, key) => {
      return value;
    });
    return !valid.length;
  }

  render() {
    debugger;
    if (this.state.success === true) {
      return(<PaymentSuccess />);
    } else {

      return (
        <div className="row-fluid">
          <h2>Félicitations ! Votre compte est activé !</h2>
          <h3>Vous pouvez voir les détails de votre abonnement dans la rubrique "mon compte"</h3>

          <form id="change-email" className="change-email">
            Enregistrez-vous
            <label className="email-label" htmlFor="email">Votre e-mail</label>
            <input
              type="text"
              className="email"
              ref="email"
              id="email"
              name="email"
              onChange={::this.handleInputChange}
              placeholder="" required />
            <label className="password-label" htmlFor="password">Mot de pass actuel</label>
            <input
              type="text"
              className="password"
              ref="password"
              id="password"
              name="password"
              onChange={::this.handleInputChange}
              placeholder="" required />
            <button
              id="button-change-email"
              type="submit"
              form="change-email"
              className="button-change-email"
              onClick={::this.redeemCoupon}>ENREGISTRER
            </button>
          </form>

        </div>
      );
    }
  }
}

export default CouponRegister;
