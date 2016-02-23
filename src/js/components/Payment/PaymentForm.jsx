import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import classSet from 'classnames';
import config from '../../../../config/client';
import * as UserActionCreators from '../../actions/user';
import Spinner from '../Spinner/Spinner';
import GiftDetails from './GiftDetails';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import PaymentMethod from './PaymentMethod';
import {RecurlyForm,GocardlessForm} from './Forms';

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
    isGift: 0,
    pageHeader: 'Commencez votre abonnement'
  };

  hasPlan() {
    const {
      props: {
        params: { planCode }
        }
      } = this;
    return _.find(config.planCodes, function (plan) {
      return planCode === plan.code;
    });
  }

  componentWillMount() {
    const {
      props: {
        params: { planCode }
        }
      } = this;

    if (planCode === 'afrostreamgift') {
      this.setState({
        isGift: 1,
        pageHeader: 'Formule Cadeau - 1 an de films et séries afro pour 59,99€'
      });
    }
  }

  renderUserForm() {
    return (<div className="row">
      <div className="form-group col-md-6">
        <label className="form-label" htmlFor="first_name">Votre Prénom</label>
        <input
          type="text"
          className="form-control first-name"
          data-billing="first_name"
          ref="firstName"
          id="first_name"
          name="first-name"
          placeholder="Votre prénom" required
          disabled={this.state.disabledForm}/>
      </div>
      <div className="form-group col-md-6">
        <label className="form-label" htmlFor="last_name">Votre Nom</label>
        <input
          type="text"
          className="form-control last-name"
          data-billing="last_name"
          ref="lastName"
          id="last_name"
          name="last-name"
          placeholder="Votre nom" required
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
        >{this.state.isGift ? 'OFFREZ' : 'DÉMARREZ' } MAINTENANT
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
        <div className="checkbox-label">
          Je renonce au droit de rétractation <a href="/pdfs/formulaire-retractation.pdf" target="_blank">Télécharger
          le formulaire de rétractation</a>
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

        <div className="checkbox-label">
          J'accepte les Conditions Générales d'Utilisation <a href="/pdfs/conditions-utilisation.pdf"
                                                              target="_blank">( En savoir plus )</a>
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

    // Disable the submit button
    //$('[data-billing]').removeClass('has-error');
    //$('.conditions-generales').removeClass('checkbox-has-error');
    //$('.droit-retractation').removeClass('checkbox-has-error');

    this.setState({
      error: null
    });

    this.disableForm(true);

    if (!this.refs.cgu.checked || !this.refs.droits.checked) {
      //$('.conditions-generales').addClass('checkbox-has-error');
      return this.error({
        message: 'Vous devez cocher toutes les cases pour confirmer l‘abonnement.',
        fields: ['cgu', 'droits']
      });
    }

    let billingInfo = {
      'plan-code': planCode,
      'first_name': this.refs.firstName.value,
      'last_name': this.refs.lastName.value,
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

    return await dispatch(UserActionCreators.subscribe(formData, self.state.isGift)).then(function () {
      self.disableForm(false, 1);
      self.context.history.pushState(null, `/select-plan/${planCode}/success`);
    }).catch(function (err) {
      let message = '';
      let errorMessage = '';

      if (err.response.status === 400) {
        errorMessage = JSON.parse(err.response.text);

        if (errorMessage.name === 'RecurlyError' &&
          typeof errorMessage.errors !== 'undefined' &&
          typeof errorMessage.errors[0] !== 'undefined' &&
          errorMessage.errors[0].field === 'subscription.account.base' &&
          errorMessage.errors[0].symbol === 'declined') {

          message = 'Veuillez contacter votre banque ou utilisez une autre carte.';

        } else if (errorMessage.name === 'RecurlyError' &&
          typeof errorMessage.errors !== 'undefined' &&
          typeof errorMessage.errors[0] !== 'undefined' &&
          errorMessage.errors[0].field === 'subscription.coupon_code' &&
          errorMessage.errors[0].symbol === 'invalid') {

          message = 'Le code promo n\'est pas ou plus valide pour cette formule.';

        } else if (errorMessage.name === 'SelfGiftError') {

          message = 'Les courriels de l\'offrant et de destination sont identiques. ' +
            'Vérifiez le courriel de destination de votre cadeau';

        } else {

          message = 'une erreur inconnue s\'est produite, veuillez recommencer.';
        }
      } else {

        message = 'une erreur inconnue s\'est produite, veuillez recommencer.';
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
        message: formatError.message || 'Les champs indiqués semblent invalides: ',
        fields: formatError.fields || []
      }
    });
  }

  disableForm(disabled, status = 0, message = '') {
    this.setState({
      disabledForm: disabled,
      message: message,
      subscriptionStatus: status,
      loading: disabled
    });
  }

  renderForm() {

    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    };

    return (
      <div className="payment-wrapper">
        <div className="enter-payment-details">{this.state.pageHeader}</div>
        <div className="payment-form">
          <div className={classSet(spinnerClasses)}>
            <Spinner />
          </div>
          <form ref="form" onSubmit={::this.onSubmit} id="subscription-create"
                data-async>

            <section id="error" ref="error">{this.state.error ? this.state.error.message : ''}</section>

            {this.renderUserForm()}

            <PaymentMethod ref="methodForm" isGift={this.state.isGift}/>

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
        title="Paiement indisponible"
        message="Le paiement est momentanément indisponible,veuillez nous en éxcuser et recommencer l'opération ultérieurement."
        link="mailto:support@afrostream.tv"
        linkMessage="Si le probleme persiste, veuillez contacter notre support technique"
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
