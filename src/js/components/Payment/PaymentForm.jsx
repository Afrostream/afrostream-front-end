import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import classSet from 'classnames';
import {planCodes,dict} from '../../../../config/client';
import * as UserActionCreators from '../../actions/user';
import Spinner from '../Spinner/Spinner';
import GiftDetails from './GiftDetails';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentMethod from './PaymentMethod';
import Query from 'dom-helpers/query';
import DomClass from 'dom-helpers/class';
import _ from 'lodash';

if (process.env.BROWSER) {
  require('./PaymentForm.less');
}

@connect(({ User}) => ({User}))
class PaymentForm extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    hasLib: true,
    subscriptionStatus: 0,
    loading: false,
    isGift: false,
    pageHeader: dict.payment.header
  };

  hasPlan() {
    const {
      props: {
        params: { planCode }
        }
      } = this;
    return _.find(planCodes, (plan) => {
      return planCode === plan.code;
    });
  }

  componentWillReceiveProps() {
    let hasOneLib = this.refs.methodForm ? this.refs.methodForm.hasLib() : true;
    this.setState({
      hasLib: hasOneLib
    });
  }

  componentWillMount() {
    const {
      props: {
        params: { planCode }
        }
      } = this;
    let currentPlan = this.hasPlan();
    this.setState({
      isGift: currentPlan && currentPlan.code === 'afrostreamgift',
      currentPlan: currentPlan
    });
  }

  renderUserForm() {
    return (<div className="row">
      <div className="form-group col-md-6">
        <label className="form-label" htmlFor="first_name">{dict.payment.name}</label>
        <input
          type="text"
          className="form-control first-name"
          data-billing="first_name"
          ref="firstName"
          id="first_name"
          name="first-name"
          placeholder={dict.payment.name} required
          disabled={this.state.disabledForm}/>
      </div>
      <div className="form-group col-md-6">
        <label className="form-label" htmlFor="last_name">{dict.payment.lastName}</label>
        <input
          type="text"
          className="form-control last-name"
          data-billing="last_name"
          ref="lastName"
          id="last_name"
          name="last-name"
          placeholder={dict.payment.lastName} required
          disabled={this.state.disabledForm}/>
      </div>
    </div>);
  }

  renderGift() {
    if (!this.state.isGift) {
      return;
    }
    return <GiftDetails ref="giftDetails" isVisible={this.state.isGift}/>;
  }

  renderSubmit() {
    return (<div className="row">
      <div className="form-group  col-md-12">
        <button
          id="subscribe"
          type="submit"
          form="subscription-create"
          className="button-create-subscription"
          disabled={this.state.disabledForm}
        >{this.state.isGift ? dict.payment.gift.sublit : dict.payment.sublit }
        </button>
      </div>
    </div>);
  }

  renderDroits() {

    let checkClass = {
      'form-group': true,
      'col-md-12': true,
      'checkbox': true,
      'checkbox-has-error': this.state.error ? ~this.state.error.fields.indexOf('droits') : false
    };

    return (<div className="row">
      <div className={classSet(checkClass)}>
        <input
          type="checkbox"
          className="checkbox"
          name="droit-retractation"
          id="droit-retractation"
          ref="droits"
          disabled={this.state.disabledForm}
          required
        />
        <div className="checkbox-label">{dict.payment.droits.label} <a href="/pdfs/formulaire-retractation.pdf"
                                                                       target="_blank">{dict.payment.droits.link}</a>
        </div>
      </div>
    </div>);
  }

  renderCGU() {

    let checkClass = {
      'form-group': true,
      'col-md-12': true,
      'checkbox': true,
      'checkbox-has-error': this.state.error ? ~this.state.error.fields.indexOf('cgu') : false
    };

    return (<div className="row">
      <div className={classSet(checkClass)}>
        <input
          type="checkbox"
          className="checkbox-conditions-generales"
          ref="cgu"
          name="accept-conditions-generales"
          id="accept-conditions-generales"
          disabled={this.state.disabledForm}
          required
        />

        <div className="checkbox-label">{dict.payment.cgu.label} <a href="/pdfs/conditions-utilisation.pdf"
                                                                    target="_blank">{dict.payment.cgu.link}</a>
        </div>
      </div>
    </div>);
  }

  async onSubmit(e) {
    const {
      props: {
        User,
        params: { planCode }
        }
      } = this;

    e.preventDefault();

    const self = this;
    const user = User.get('user');
    const currentPlan = this.hasPlan();

    this.setState({
      error: null
    });

    this.disableForm(true);

    if (!this.refs.cgu.checked || !this.refs.droits.checked) {
      return this.error({
        message: dict.payment.errors.checkbox,
        fields: ['cgu', 'droits']
      });
    }

    let billingInfo = {
      'email': user.get('email'),
      //NEW BILLING API
      internalPlanUuid: planCode,
      firstName: this.refs.firstName.value,
      lastName: this.refs.lastName.value
    };

    if (self.state.isGift) {
      billingInfo = _.merge(billingInfo, this.refs.giftDetails.value())
    }

    try {
      let subBillingInfo = await this.refs.methodForm.submit(billingInfo, currentPlan);
      billingInfo = _.merge(billingInfo, subBillingInfo);
      await this.submitSubscription(billingInfo);
    } catch (err) {
      self.error(err);
    }
  }


  async submitSubscription(formData) {
    const {
      props: {
        dispatch,
        params: { planCode }
        }
      } = this;

    const self = this;

    return await dispatch(UserActionCreators.subscribe(formData, self.state.isGift)).then(() => {
      self.disableForm(false, 1);
      dispatch(UserActionCreators.getProfile());
      self.context.history.pushState(null, `/select-plan/${planCode}/success`);
      //On merge les infos en faisait un new call a getProfile
    }).catch((err) => {
      let message = dict.payment.errors.global;

      // === TODO refactor this ===
      if (err.response && err.response.status === 400) {
        let errorMessage = JSON.parse(err.response.text);
        let errorField;
        switch (errorMessage.name) {
          case 'RecurlyError':
            errorField = errorMessage.errors && errorMessage.errors.length && errorMessage.errors[0];
            if (errorField) {
              if (errorField.field === 'subscription.account' && errorField.symbol === 'declined') {
                message = dict.payment.errors.card;
              }
              else if (errorField.field === 'subscription.base' && errorField.symbol === 'already_subscribed') {
                message = dict.payment.errors.already;
              }
              else if (errorField.field === 'subscription.coupon_code' && errorField.symbol === 'invalid') {
                message = dict.payment.errors.coupon;
              }
            }
            break;
          case 'SelfGiftError':
            message = dict.payment.errors.gift;
            break;
        }
      }
      // === TODO refactor this === ^
      if (err.response && err.response.body) {
        message = err.response.body.error;
      }

      self.disableForm(false, 2, message);
      self.context.history.pushState(null, `/select-plan/${planCode}/error`);
    });
  }

  // A simple error handling function to expose errors to the customer
  error(err) {
    let formatError = err;
    if (err instanceof Array) {
      formatError = err[0];
    }
    this.disableForm(false);
    this.setState({
      error: {
        message: formatError.message || dict.payment.errors.fields,
        fields: formatError.fields || []
      }
    });

    const containerDom = ReactDOM.findDOMNode(this);
    _.forEach(formatError.fields, (errorField)=> {
      let fields = Query.querySelectorAll(containerDom, `[data-billing=${errorField}]`);
      _.forEach(fields, (field)=> {
        DomClass.addClass(field, 'has-error');
      });
    });
  }

  disableForm(disabled, status = 0, message = '') {
    this.setState({
      disabledForm: disabled,
      message: message,
      subscriptionStatus: status,
      loading: disabled
    });
    const containerDom = ReactDOM.findDOMNode(this);
    let fields = Query.querySelectorAll(containerDom, '[data-billing]');
    _.forEach(fields, (field)=> {
      DomClass.removeClass(field, 'has-error');
    });
  }

  renderForm() {

    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    };

    const planLabel = dict.planCodes[this.state.currentPlan.code];

    return (
      <div className="payment-wrapper">
        <div className="enter-payment-details">{planLabel}</div>
        <div className="payment-form">
          <div className={classSet(spinnerClasses)}>
            <Spinner />
          </div>
          <form ref="form" onSubmit={::this.onSubmit} id="subscription-create"
                data-async>

            {this.state.error ? <section id="error" ref="error">{this.state.error.message}</section> : ''}

            {this.renderUserForm()}

            <PaymentMethod ref="methodForm" isGift={this.state.isGift} planCode={this.state.currentPlan.code}
                           planLabel={planLabel}/>

            {this.renderGift()}

            {this.renderCGU()}
            {this.renderDroits()}
            {this.renderSubmit()}

          </form>
        </div>
      </div>
    );
  }

  render() {
    const {
      props: {
        params: { status }
        }
      } = this;

    if (!this.state.hasLib) {
      return (<PaymentError
        title={dict.payment.errors.noLib.title}
        message={dict.payment.errors.noLib.message}
        link={dict.payment.errors.noLib.message}
        linkMessage={dict.payment.errors.noLib.linkMessage}
      />);
    }

    if (status === 'success') {
      return (<PaymentSuccess />);
    } else if (status === 'error') {
      return (<PaymentError message={this.state.message}/>);
    } else {
      return this.renderForm();
    }
  }
}

export default PaymentForm;
