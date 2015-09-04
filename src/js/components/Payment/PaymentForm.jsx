import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import CountrySelect from './CountrySelect';
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
  require('jquery');
  require('jquery.payment');
}

@connect(({ User}) => ({User})) class PaymentForm extends React.Component {


  state = {
    subscriptionStatus: 0,
    loading: false
  };

  componentDidMount() {
    window.$('.recurly-cc-number').payment('formatCardNumber');
    window.$('.recurly-cc-exp').payment('formatCardExpiry');
    window.$('.recurly-cc-cvc').payment('formatCardCVC');
    try {
      recurly.configure(config.recurly.key);
    } catch (err) {
      console.log(err);
      return;
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
    // Disable the submit button
    $('[data-recurly]').removeClass('has-error');
    $('#errors').text('');
    $('input').removeClass('error');
    this.disableForm(true);

    var billingInfo = {
      'plan-code': this.props.planName,
      // required attributes
      'number': $('.recurly-cc-number').val(),

      'month': window.$('.recurly-cc-exp').payment('cardExpiryVal').month,
      'year': window.$('.recurly-cc-exp').payment('cardExpiryVal').year,

      'cvv': $('.recurly-cc-cvc').val(),
      'first_name': $('#first_name').val(),
      'last_name': $('#last_name').val(),
      'email': user.get('email'),
      // optional attributes
      'coupon_code': $('#coupon_code').val(),
      'unit-amount-in-cents': this.props.unitAmountInCents,
      'country': $('#country').val(),
      'starts_at': this.props.startDate,
      'is_gift': '0',
      'gift_first_name': '',
      'gift_last_name': '',
      'gift_email': ''
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

      dispatch(UserActionCreators.subscribe(formData)).then(function () {
        self.disableForm(false, 1);
        ga.event({
          category: 'User',
          action: 'Created an Account'
        });
      }).catch(function (err) {
        let errors = err.response.body;
        let message = '';
        $.each(errors, function (i, error) {
          message += error['#'];
        });
        self.disableForm(false, 2, message);
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

    var spinnerClasses = {
      'spinner-payment': true,
      'spinner-loading': this.state.loading
    };
    if (this.state.subscriptionStatus === 1) {
      return (<PaymentSuccess />);
    } else if (this.state.subscriptionStatus === 2) {
      return (<PaymentError message={this.state.message}/>);
    } else {

      return (
        <div>

          <div className="enter-payment-details">Entrer les détails de paiement</div>
          <div className="payment-form">
            <div className={classSet(spinnerClasses)}>
              <Spinner />
            </div>
            <form ref="form" onSubmit={::this.onSubmit} id="subscription-create"
                  data-async>
              <section id="errors"></section>

              <div className="row">
                <div className="name-details">COORDONNÉES</div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label className="form-label" for="first_name">Prénom</label>
                  <input
                    type="text"
                    className="form-control first-name"
                    data-recurly="first_name"
                    id="first_name"
                    name="first-name"
                    placeholder="Votre prénom" required/>
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label" for="last_name">Nom</label>
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

                <label className="name-details">DÉTAILS DE PAIEMENT
                  <small className="text-muted">[<span className="recurly-cc-brand"></span>]</small>
                </label>
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
                <CountrySelect />
              </div>
              <div className="row">
                <div className="form-group col-md-8">
                  <label className="form-label" for="coupon_code">Entrer le code promo</label>
                  <input
                    type="text"
                    className="form-control coupon-code"
                    data-recurly="coupon_code"
                    name="coupon_code"
                    id="coupon_code"
                    placeholder="Entrez votre code"/>
                </div>
                <div className="form-group  col-md-4">
                  <button
                    id="subscribe"
                    type="submit"
                    form="subscription-create"
                    className="button-create-subscription"
                    >VALIDER
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
