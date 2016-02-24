import React, { PropTypes } from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import CountrySelect from './CountrySelect';
import GiftDetails from './GiftDetails';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import Spinner from '../Spinner/Spinner';
import classSet from 'classnames';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../../config/client';
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
    hasRecurly: true,
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

  componentDidMount() {
    $('.recurly-cc-number').payment('formatCardNumber');
    $('.recurly-cc-exp').payment('formatCardExpiry');
    $('.recurly-cc-cvc').payment('formatCardCVC');

    //Detect si le payment via la lib recurly est dispo
    this.setState({
      hasRecurly: recurly
    });

    if (recurly && !recurly.configured) {
      recurly.configure(config.recurly.key);
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const {
      props: {
        User,
        dispatch,
        params: { planCode }
        }
      } = this;

    const self = this;
    const user = User.get('user');
    const cardNumber = $('.recurly-cc-number').val();
    const excludedCards = ['visaelectron', 'maestro'];
    // Disable the submit button
    $('[data-recurly]').removeClass('has-error');
    $('.conditions-generales').removeClass('checkbox-has-error');
    $('.droit-retractation').removeClass('checkbox-has-error');
    $('#errors').text('');
    $('input').removeClass('error');
    this.disableForm(true);

    if (!$('.checkbox-conditions-generales').is(':checked')) {
      $('#errors').text("Vous devez cocher toutes les cases pour confirmer l'abonnement.");
      $('.conditions-generales').addClass('checkbox-has-error');
      self.disableForm(false);
      return;
    }

    if (!$('.checkbox-droit-retractation').is(':checked')) {
        $('#errors').text("Vous devez cocher toutes les cases pour confirmer l'abonnement.");
        $('.droit-retractation').addClass('checkbox-has-error');
        self.disableForm(false);
        return;
    }

    //Excluded cart type message
    if (~excludedCards.indexOf($.payment.cardType(cardNumber))) {
      $('#errors').text("Ce type ne carte n'est pas pris en charge actuellement");
      $('.recurly-cc-number').addClass('has-error');
      self.disableForm(false);
      return;
    }

    let currentPlan = this.hasPlan();

    let billingInfo = {
      'plan-code': planCode,
      // required attributes
      'number': $('.recurly-cc-number').val(),

      'month': $('.recurly-cc-exp').payment('cardExpiryVal').month,
      'year': $('.recurly-cc-exp').payment('cardExpiryVal').year,

      'cvv': $('.recurly-cc-cvc').val(),
      'first_name': $('#first_name').val(),
      'last_name': $('#last_name').val(),
      'email': user.get('email'),
      'unit-amount-in-cents': currentPlan.price,
      // optional attributes
      'starts_at': currentPlan.date,
      'coupon_code': $('#coupon_code').val(),
      'country': $('#country').val(),
      'is_gift': '0'
    };
    recurly.token(billingInfo, function (err, token) {
      // send any errors to the error function below
      if (err) {
        return self.error(err);
      }
      // Otherwise we continue with the form submission
      let formData = $.extend(billingInfo, {
        'recurly-token': token.id
      });

      if (self.state.isGift) {
        billingInfo['gift_first_name'] = $('#gift_first_name').val();
        billingInfo['gift_last_name'] = $('#gift_last_name').val();
        billingInfo['gift_email'] = $('#gift_email').val();
      }

      dispatch(UserActionCreators.subscribe(formData, self.state.isGift)).then(function () {
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
        }  else {

          message = 'une erreur inconnue s\'est produite, veuillez recommencer.';
        }

        self.disableForm(false, 2, message);
        self.context.history.pushState(null, `/select-plan/${planCode}/error`);
      });
    });
  }

  // A simple error handling function to expose errors to the customer
  error(err) {
    $('#errors').text('Les champs indiqués semblent invalides: ');
    $.each(err.fields, function (i, field) {
      $('[data-recurly=' + field + ']').addClass('has-error');
    });
    this.disableForm(false);
  }

  disableForm(disabled, status = 0, message = '') {
    $('button').prop('disabled', disabled);
    $('input').prop('disabled', disabled);
    this.setState({
      message: message,
      subscriptionStatus: status,
      loading: disabled
    });
  }

  render() {

    const {
      props: {
        params: { status }
        }
      } = this;

    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    };

    if (!this.state.hasRecurly) {
      return (<PaymentError
        title="Paiement indisponible"
        message="Le paiement est momentanément indisponible,veuillez nous en éxcuser et recommencer l'opération ultérieurement."
        link="mailto:support@afrostream.tv"
        linkMessage="Si le probleme persiste, veuillez contacter notre support technique"
      />);
    }
    if (status === 'success') {
      return (<PaymentSuccess isGift={this.state.isGift}/>);
    } else if (status === 'error') {
      return (<PaymentError message={this.state.message}/>);
    } else {
      return (
        <div className="payment-wrapper">
          <div className="enter-payment-details">{this.state.pageHeader}</div>
          <div className="payment-form">
            <div className={classSet(spinnerClasses)}>
              <Spinner />
            </div>
            <form ref="form" onSubmit={::this.onSubmit} id="subscription-create"
                  data-async>
              <section id="errors"></section>

              <div className="row">
                <div className="card-details">
                  <div className="card-details-text">CARTE BANCAIRE</div>
                  <div className="card-details-img">
                    <img src="/images/bank-cards.png"/>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label className="form-label" htmlFor="first_name">Votre Prénom</label>
                  <input
                    type="text"
                    className="form-control first-name"
                    data-recurly="first_name"
                    id="first_name"
                    name="first-name"
                    placeholder="Votre prénom" required/>
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label" htmlFor="last_name">Votre Nom</label>
                  <input
                    type="text"
                    className="form-control last-name"
                    data-recurly="last_name"
                    id="last_name"
                    name="last-name"
                    placeholder="Votre nom" required/>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label className="form-label" htmlFor="number">Numéro de carte</label>
                  <input
                    type="tel"
                    className="form-control recurly-cc-number card-number"
                    data-recurly="number"
                    name="number"
                    id="number"
                    autoComplete="cc-number"
                    placeholder="1234 5678 8901 1234" required/>
                </div>
                <CountrySelect />
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="form-label" htmlFor="month">Date de validité</label>
                  <input type="tel" className="form-control recurly-cc-exp" data-recurly="month"
                         name="month" id="month"
                         autoComplete="cc-exp"
                         placeholder="MM/AA" required/>
                </div>
                <div className="form-group col-md-4">
                  <label className="form-label" htmlFor="cvv">Code sécurité</label>
                  <input type="tel" className="form-control recurly-cc-cvc" data-recurly="cvv"
                         name="cvv" id="cvv" autoComplete="off"
                         placeholder="123" required/>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="form-label" htmlFor="coupon_code">Entrer le code promo</label>
                  <input
                    type="text"
                    className="form-control coupon-code"
                    data-recurly="coupon_code"
                    name="coupon_code"
                    id="coupon_code"
                    placeholder="Entrez votre code"/>
                </div>
              </div>

              <GiftDetails isVisible={this.state.isGift}/>

              <div className="row">
                <div className="form-group col-md-12 conditions-generales">
                  <input
                    type="checkbox"
                    className="checkbox-conditions-generales"
                    name="accept-conditions-generales"
                    id="accept-conditions-generales"/>

                  <div className="text-conditions-generales">
                    J'accepte les Conditions Générales d'Utilisation <a href="/pdfs/conditions-utilisation.pdf"
                                                                        target="_blank">( En savoir plus )</a>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="form-group  col-md-12">
                  <button
                    id="subscribe"
                    type="submit"
                    form="subscription-create"
                    className="button-create-subscription"
                  >{this.state.isGift ? 'OFFREZ' : 'DÉMARREZ' } MAINTENANT
                  </button>
                </div>
              </div>
              <input
                type="hidden"
                data-recurly="token"
                name="recurly-token"/>

              <input
                type="hidden"
                id="is_gift"
                name="is-gift"/>

              <input
                type="hidden"
                id="plan_code"
                data-recurly="plan_code"
                name="plan-code"/>

              <input
                type="hidden"
                id="plan_name"
                data-recurly="plan_name"
                name="plan-name"/>

              <input
                type="hidden"
                id="unit_amount_in_cents"
                data-recurly="unit_amount_in_cents"
                name="unit-amount-in-cents"/>

              <input
                type="hidden"
                id="starts_at"
                data-recurly="starts_at"
                name="starts-at"/>

              <div id="recurly-form-footer">
                <span className="price" id="recurly-price"></span>
                <span className="term" id="recurly-term"></span>

                <div className="recurly-note"></div>
              </div>
            </form>
          </div>
        </div >
      );
    }
  }
}

export default PaymentForm;
