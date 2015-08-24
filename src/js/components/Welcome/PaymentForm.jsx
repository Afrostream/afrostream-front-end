import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import CountrySelect from './CountrySelect';
import PaymentSuccess from './PaymentSuccess';
import PaymentError from './PaymentError';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config/client';


if (canUseDOM) {
	require('jquery');
	require('bootstrap');
}

if (process.env.BROWSER) {
	require('./PaymentForm.less');
}

var PaymentForm = React.createClass ({

	getInitialState: function() {

		return {
			userEmail: '',
			subscriptionStatus: '',
			message: ''
		};
	},

	callApi: function() {

		var self = this;

		// Configure recurly.js
		//recurly.configure('sjc-WOBbERhzqRX5AJ6hVGOPzv');
		try {
			recurly.configure('sjc-ZhO4HmKNWszC5LIA8BcsMJ');
		} catch(err) {
			console.log(err);
		}
		//$('.recurly-cc-number').payment('formatCardNumber');
		//$('.recurly-cc-exp').payment('formatCardExpiry');
		//$('.recurly-cc-cvc').payment('formatCardCVC');

		$( "#subscription-create" ).submit(function( event ) {
			event.preventDefault();
		});

		$('#errors').text('');
		$('input').removeClass('error');
		// Disable the submit button
		disableForm(true);
		$('[data-recurly]').removeClass('has-error');

		console.log('*** api being called ***');

		var billingInfo = {
			'plan-code': this.props.planName,
			// required attributes
			'number': $('.recurly-cc-number').val(),

			'month': $('#month').val(),
			'year': $('#year').val(),

			'cvv': $('.recurly-cc-cvc').val(),
			'first_name': $('#first_name').val(),
			'last_name': $('#last_name').val(),
			'email': this.props.profile.email,
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

			console.log('*** about to attempt the ajax request ***');

			// send any errors to the error function below
			if (err) {
				console.log('*** recurly token error ***');
				console.log(err.message);
				error(err);

				//TODO: remove this commented code, on a utilisé ça pour arriver sur une page d'ereur
				/*self.setState({
					subscriptionStatus: 'not subscribed',
					message: err.message
				});*/
			}
			// Otherwise we continue with the form submission
			else {
				var subscriptionPath = config.apiClient.urlPrefix + '/subscriptions';
				var formData = JSON.stringify($.extend(billingInfo, {
					'recurly-token': token.id
				}));

				$.ajax({
					type: 'POST',
					url: subscriptionPath,
					//url: 'https://afrostream-api-v1-staging.herokuapp.com/api/subscriptions',
					data: formData,
					contentType: 'application/json',
					success: function () {

						console.log('*** there was some kind of success ***');
						self.setState({
							subscriptionStatus: 'subscribed',
							message: 'You have been subscribed! Thank you.'
						});
					},
					error: function (err) {
						var errorMessage;

						console.log('**** there was an error ***');
						console.log(err);
						console.log('*** end of error message ***');

						self.setState({
							subscriptionStatus: 'not subscribed',
							message: err.responseText
						});
					}
				});
				return false;
			}
		});

		// A simple error handling function to expose errors to the customer
		function error(err) {
			console.log('*** there is an error ***');
			console.log(err);
			$('#errors').text('Les champs indiqués semblent invalides: ');
			$.each(err.fields, function (i, field) {
				$('[data-recurly=' + field + ']').addClass('has-error');
			});
			disableForm(false);
		};

		function disableForm(disabled) {

			$('button').prop('disabled', disabled);
			$('input').prop('disabled', disabled);
		};
	},

	render: function() {
		const {
			props: {
				User
				}
			} = this;

		console.log('*** initial subscription state ***');
		console.log(this.state.subscriptionStatus);
		console.log('*** end of subscription state ***');

		if (this.state.subscriptionStatus === 'subscribed'){

			localStorage.removeItem('afroToken');

			return(<PaymentSuccess />);

		} else if (this.state.subscriptionStatus === 'not subscribed') {

			return(
				<PaymentError message={this.state.message} />
			);

		} else {

			return (
				<div>
					<div className="enter-payment-details">Entrer les détails de paiement</div>
					<div className="payment-form">
						<form id="subscription-create" className="subscription-form" name="subscription-create" data-async>
								<section id="errors"></section>

								<section id="subscription-form">
									<div className="name-details">COORDONNÉES</div>
									<div className="form-group">
										<label className="first-name-label" htmlFor="first_name">Prénom</label>
										<label className="last-name-label" htmlFor="last_name">Nom</label>
										<input
											type="text"
											className="form-control first-name"
											data-recurly="first_name"
											id="first_name"
											name="first-name"
											placeholder="Votre prénom" required />
										<input
											type="text"
											className="form-control last-name"
											data-recurly="last_name"
											id="last_name"
											name="last-name"
											placeholder="Votre nom" required />
									</div>

									<label className="payment-details">DÉTAILS DE PAIEMENT
										<small className="text-muted">[<span className="recurly-cc-brand"></span>]</small>
									</label>

									<div className="form-group has-feedback has-feedback-left">
										<label className="card-label" htmlFor="number">Numéro de carte</label>
										<input
											type="tel"
											className="form-control recurly-cc-number card-number"
											data-recurly="number"
											name="number"
											id="number"
											autoComplete="cc-number"
											placeholder="1234 5678 8901 1234" required />
									</div>

									<div className="form-group">
										<label className="date-label" htmlFor="month">Numéro de carte</label>
										<label className="card-code-label" htmlFor="cvv">Code sécurité</label>
										<select
											className="form-control recurly-cc-exp card-date-month"
											data-recurly="month"
											name="month"
											id="month"
											placeholder="MM" required>
											<option value="01">01 jan</option>
											<option value="02">02 fév</option>
											<option value="03">03 mar</option>
											<option value="04">04 avr</option>
											<option value="05">05 mai</option>
											<option value="06">06 jun</option>
											<option value="07">07 jul</option>
											<option value="08">08 aoû</option>
											<option value="09">09 sep</option>
											<option value="10">10 oct</option>
											<option value="11">11 nov</option>
											<option value="12">12 déc</option>
										</select>
										<select
											className="form-control recurly-cc-exp card-date-year"
											data-recurly="year"
											name="year"
											id="year"
											placeholder="AAAA" required>
											<option value="2015">2015</option>
											<option value="2016">2016</option>
											<option value="2017">2017</option>
											<option value="2018">2018</option>
											<option value="2019">2019</option>
											<option value="2020">2020</option>
											<option value="2021">2021</option>
											<option value="2022">2022</option>
											<option value="2023">2023</option>
											<option value="2024">2024</option>
											<option value="2025">2025</option>
											<option value="2026">2026</option>
											<option value="2027">2027</option>
											<option value="2028">2028</option>
											<option value="2029">2029</option>
											<option value="2030">2030</option>
											<option value="2031">2031</option>
											<option value="2032">2032</option>
											<option value="2033">2033</option>
										</select>

										<input
											type="tel"
											className="form-control recurly-cc-cvc card-code"
											data-recurly="cvv"
											name="cvv"
											id="cvv"
											autoComplete="off"
											placeholder="123" required />
										</div>
									<CountrySelect />

									<div className="form-group">
										<label className="coupon-code-label" htmlFor="coupon_code">Entrer le code promo</label>
										<input
											type="text"
											className="form-control coupon-code"
											data-recurly="coupon_code"
											name="coupon_code"
											id="coupon_code"
											placeholder="Entrez votre code" />
										<button
											id="subscribe"
											type="submit"
											form="subscription-create"
											className="button-create-subscription"
											onClick={this.callApi}>VALIDER
										</button>
									</div>

									<input
										type="hidden"
										data-recurly="token"
										name="recurly-token" />

									<input
										type="hidden"
										id="is_gift"
										name="is-gift" />

									<input
										type="hidden"
										id="plan_code"
										data-recurly="plan_code"
										name="plan-code" />

									<input
										type="hidden"
										id="plan_name"
										data-recurly="plan_name"
										name="plan-name" />

									<input
										type="hidden"
										id="unit_amount_in_cents"
										data-recurly="unit_amount_in_cents"
										name="unit-amount-in-cents" />

									<input
										type="hidden"
										id="starts_at"
										data-recurly="starts_at"
										name="starts-at" />

								</section>
							<div id="recurly-form-footer">
								<span className="price" id="recurly-price"></span>
								<span className="term" id="recurly-term"></span>
								<div className="recurly-note"></div>
							</div>
						</form>
					</div>
				</div>
			);
		}
	}
});

module.exports = PaymentForm;
