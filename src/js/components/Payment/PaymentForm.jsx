import React, { PropTypes } from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import CountrySelect from './CountrySelect';
import GiftGiverEmail from './GiftGiverEmail';
import GiftDetails from './GiftDetails';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import Spinner from '../Spinner/Spinner';
import classSet from 'classnames';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config/client';
if (process.env.BROWSER) {
  require('./PaymentForm.less');
}

if (canUseDOM) {
  var paymentFormGa = require('react-ga');
}

@connect(({ User}) => ({User})) class PaymentForm extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    hasRecurly: true,
    subscriptionStatus: 0,
    loading: false,
    isGift: 0,
    pageHeader: 'Commencez votre abonnement'
  };

  componentWillMount() {
    debugger;
    if (canUseDOM) {
      var pathName = '/select-plan/' + this.props.planName + '/checkout';
      paymentFormGa.initialize(config.google.analyticsKey, {debug: true});
      paymentFormGa.pageview(pathName);
      this.context.router.transitionTo(pathName);
    }
  }

  componentDidMount() {
    debugger;
    document.getElementsByTagName('BODY')[0].scrollTop = 0;
    window.$('.recurly-cc-number').payment('formatCardNumber');
    window.$('.recurly-cc-exp').payment('formatCardExpiry');
    window.$('.recurly-cc-cvc').payment('formatCardCVC');

    if (this.props.planName === 'afrostreamgift') {
      this.setState({
        isGift: 1,
        pageHeader: 'AFROSTREAM - Formule Cadeau - 59,99€'
      });
    }

    try {
      debugger;
      recurly.configure(config.recurly.key);
    } catch (err) {
      console.log(err);
      if (typeof err.code !== 'undefined' && err.code !== 'already-configured') {
        this.setState({
          hasRecurly: false
        });
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const {
      props: {
        User,dispatch
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
    if (~excludedCards.indexOf(window.$.payment.cardType(cardNumber))) {
      $('#errors').text("Ce type ne carte n'est pas pris en charge actuellement");
      $('.recurly-cc-number').addClass('has-error');
      self.disableForm(false);
      return;
    }

    var billingEmail = (self.state.isGift) ? $('#giver_email').val() : user.get('email');

    var billingInfo = {
      'plan-code': this.props.planName,
      // required attributes
      'number': $('.recurly-cc-number').val(),

      'month': window.$('.recurly-cc-exp').payment('cardExpiryVal').month,
      'year': window.$('.recurly-cc-exp').payment('cardExpiryVal').year,

      'cvv': $('.recurly-cc-cvc').val(),
      'first_name': $('#first_name').val(),
      'last_name': $('#last_name').val(),
      'email': billingEmail,
      // optional attributes
      'coupon_code': $('#coupon_code').val(),
      'unit-amount-in-cents': this.props.unitAmountInCents,
      'country': $('#country').val(),
      'starts_at': this.props.startDate,
      'is_gift': '0'
    };

    recurly.token(billingInfo, function (err, token) {
      // send any errors to the error function below
      if (err) {
        return self.error(err);
      }
      // Otherwise we continue with the form submission
      var formData = $.extend(billingInfo, {
        'recurly-token': token.id
      });

      if (self.state.isGift) {

        billingInfo['gift_first_name'] = $('#gift_first_name').val();
        billingInfo['gift_last_name'] = $('#gift_last_name').val();
        billingInfo['gift_email'] = $('#gift_email').val();

        dispatch(UserActionCreators.gift(formData)).then(function () {
          self.disableForm(false, 1);
          ga.event({
            category: 'User',
            action: 'Created an Account'
          });
        }).catch(function (err) {
          let errors = '';
          let message = '';

          if (typeof err.response !== 'undefined' && typeof err.response.statusText !== 'undefined'
            && err.response.status === 401) {
            errors = err.response.statusText;
            message = 'Votre session a expiré, veuillez recommencer.';

          } else if (typeof err.response !== 'undefined' && typeof err.response.statusText !== 'undefined'
            && err.response.status === 500) {
            errors = err.response.statusText;
            message = 'une erreur inconnue s\'est produite, veuillez recommencer.';

          } else {
            $.each(errors, function (i, error) {
              message += error['#'];
            });
          }

          self.disableForm(false, 2, message);
        });
      } else {
        dispatch(UserActionCreators.subscribe(formData)).then(function () {
          self.disableForm(false, 1);
          ga.event({
            category: 'User',
            action: 'Created an Account'
          });
        }).catch(function (err) {
          let errors = '';
          let message = '';

          if (typeof err.response !== 'undefined' && typeof err.response.statusText !== 'undefined'
            && err.response.statusText === 'Unauthorized') {

            errors = err.response.statusText;
            message = 'Votre session a expiré, veuillez recommencer.';

          } else {
            errors = err.response.body;
            message = '';
            $.each(errors, function (i, error) {
              message += error['#'];
            });
          }

          self.disableForm(false, 2, message);
        });
      }
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
    debugger;
    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    };

    if (!this.state.hasRecurly) {
      var pathName;
      if (canUseDOM) {
        pathName = document.location.pathname;
      }

      return (<PaymentError
        title="Paiement indisponible"
        message="Le paiement est momentanément indisponible,veuillez nous en éxcuser et recommencer l'opération ultérieurement."
        link="mailto:support@afrostream.tv"
        linkMessage="Si le probleme persiste, veuillez contacter notre support technique"
        pathName={pathName}
        />);
    }
    if (this.state.subscriptionStatus === 1) {
      return (<PaymentSuccess isGift={this.state.isGift} />);
    } else if (this.state.subscriptionStatus === 2) {
      var pathName;
      if (canUseDOM) {
        pathName = document.location.pathname;
      }
      return (<PaymentError message={this.state.message} pathName={pathName} />);
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
              <GiftGiverEmail isVisible={this.state.isGift} />
              <div className="row">
                <div className="form-group col-md-6">
                  <label className="form-label" for="first_name">Votre Prénom</label>
                  <input
                    type="text"
                    className="form-control first-name"
                    data-recurly="first_name"
                    id="first_name"
                    name="first-name"
                    placeholder="Votre prénom" required/>
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label" for="last_name">Votre Nom</label>
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
                  <label className="form-label" for="number">Numéro de carte</label>
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
                  <label className="form-label" for="month">Date de validité</label>
                  <input type="tel" className="form-control recurly-cc-exp" data-recurly="month"
                         name="month" id="month"
                         autocomplete="cc-exp"
                         placeholder="MM/AA" required/>
                </div>
                <div className="form-group col-md-4">
                  <label className="form-label" for="cvv">Code sécurité</label>
                  <input type="tel" className="form-control recurly-cc-cvc" data-recurly="cvv"
                         name="cvv" id="cvv" autocomplete="off"
                         placeholder="123" required/>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <label className="form-label" for="coupon_code">Entrer le code promo</label>
                  <input
                    type="text"
                    className="form-control coupon-code"
                    data-recurly="coupon_code"
                    name="coupon_code"
                    id="coupon_code"
                    placeholder="Entrez votre code"/>
                </div>
              </div>

              <GiftDetails isVisible={this.state.isGift} />

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
                <div className="form-group  col-md-12 droit-retractation">
                  <input
                    type="checkbox"
                    className="checkbox-droit-retractation"
                    name="droit-retractation"
                    id="droit-retractation"/>

                  <div className="text-droit-retractation">
                    Je renonce au droit de rétractation <a href="/pdfs/formulaire-retractation.pdf" target="_blank">Télécharger
                    le formulaire de rétractation</a>
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
                    >DÉMARREZ MAINTENANT
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
