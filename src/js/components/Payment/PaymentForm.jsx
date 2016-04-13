import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import classSet from 'classnames';
import { planCodes, dict } from '../../../../config/client';
import * as BillingActionCreators from '../../actions/billing';
import * as UserActionCreators from '../../actions/user';
import * as EventActionCreators from '../../actions/event';
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

@connect(({User}) => ({User}))
@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true))
  ];
})
class PaymentForm extends React.Component {

  constructor (props) {
    super(props);
  }

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

  hasPlan () {
    const {
      props: {
        params: {planCode}
      }
    } = this;
    return _.find(planCodes, (plan) => {
      return planCode === plan.internalPlanUuid;
    });
  }

  setupPlan () {
    let currentPlan = this.hasPlan();
    this.setState({
      isGift: currentPlan && currentPlan.internalPlanUuid === 'afrostreamgift',
      currentPlan: currentPlan
    });
  }

  setupLib () {
    let hasOneLib = this.refs.methodForm ? this.refs.methodForm.hasLib() : true;
    this.setState({
      hasLib: hasOneLib
    });
  }

  componentWillReceiveProps () {
    this.setupLib();
  }

  componentWillMount () {
    this.setupPlan();
  }

  renderUserForm () {

    const {
      props: {
        User
      }
    } = this;


    const user = User.get('user').toJS();

    let firstName = user && user.facebook && user.facebook.first_name || user && user.first_name;
    let lastName = user && user.facebook && user.facebook.last_name || user && user.last_name;

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
          defaultValue={firstName}
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
          defaultValue={lastName}
          placeholder={dict.payment.lastName} required
          disabled={this.state.disabledForm}/>
      </div>
    </div>);
  }

  renderGift () {
    if (!this.state.isGift) {
      return;
    }
    return <GiftDetails ref="giftDetails" isVisible={this.state.isGift}/>;
  }

  renderSubmit () {
    return (<div className="row">
      <div className="form-group  col-md-12">
        <button
          id="subscribe"
          type="submit"
          form="subscription-create"
          className="button-create-subscription"
          disabled={this.state.disabledForm}
        >{this.state.currentPlan.internalPlanOpts.internalActionLabel }
        </button>
      </div>
    </div>);
  }

  renderDroits () {

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

  renderCGU () {

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

  async onSubmit (e) {
    const {
      props: {
        User,
        params: {planCode}
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


  async submitSubscription (formData) {
    const {
      props: {
        dispatch,
        params: {planCode}
      }
    } = this;

    const self = this;
    let isCash = this.context.history.isActive('cash');

    return await dispatch(BillingActionCreators.subscribe(formData, self.state.isGift)).then(() => {
        self.disableForm(false, 1);
        //On merge les infos en faisant un new call a getProfile
        return dispatch(UserActionCreators.getProfile());
      })
      .then(()=> {
        self.context.history.pushState(null, `${isCash ? '/cash' : ''}/select-plan/${planCode}/${isCash ? 'future' : 'success'}`);
      }).catch((err) => {
        let message = dict.payment.errors.global;

        if (err.response && err.response.body) {
          message = err.response.body.error;
        }

        self.disableForm(false, 2, message);
        self.context.history.pushState(null, `${isCash ? '/cash' : ''}/select-plan/${planCode}/error`);
      });
  }

  // A simple error handling function to expose errors to the customer
  error (err) {
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

  disableForm (disabled, status = 0, message = '') {
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

  renderPaymentMethod (planLabel) {
    return (
      <PaymentMethod ref="methodForm" isGift={this.state.isGift}
                     planCode={this.state.currentPlan.internalPlanUuid} {...this.props}
                     planLabel={planLabel}/>);
  }

  renderForm () {

    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    };

    const planLabel = dict.planCodes[this.state.currentPlan.internalPlanUuid];

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

            {this.renderPaymentMethod(planLabel)}

            {this.renderGift()}

            {this.renderCGU()}
            {this.renderDroits()}
            {this.renderSubmit()}

          </form>
        </div>
      </div>
    );
  }

  render () {
    const {
      props: {
        params: {status}
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

    switch (status) {
      case 'success':
        return (<PaymentSuccess isGift={this.state.isGift}/>);
        break;
      case 'future':
        return (<PaymentError title={dict.payment.future.title}
                              message={dict.payment.future.message}
                              link={dict.payment.future.message}
                              linkMessage={dict.payment.future.linkMessage}/>);
        break;
      case 'error':
        return (<PaymentError message={this.state.message}/>);
        break;
      default:
        return this.renderForm();
        break;
    }
  }
}

export default PaymentForm;
