import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import CountrySelect from './CountrySelect';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

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
		recurly.configure('sjc-ZhO4HmKNWszC5LIA8BcsMJ');
		//$('.recurly-cc-number').payment('formatCardNumber');
		//$('.recurly-cc-exp').payment('formatCardExpiry');
		//$('.recurly-cc-cvc').payment('formatCardCVC');

		$( "#subscription-create" ).submit(function( event ) {
			event.preventDefault();
		});

		console.log('*** api being called ***');

		var billingInfo = {
			'plan-code': this.props.planName,
			// required attributes
			'number': $('.recurly-cc-number').val(),

			//TODO: use the form for the correct day/month values
			//'month': $('.recurly-cc-exp').payment('cardExpiryVal').month,
			//'year': $('.recurly-cc-exp').payment('cardExpiryVal').year,
			'month': '04',
			'year': '2016',

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
				self.setState({
					subscriptionStatus: 'not subscribed',
					message: err.message
				});
			}
			// Otherwise we continue with the form submission
			else {

				var formData = JSON.stringify($.extend(billingInfo, {
					'recurly-token': token.id
				}));

				$.ajax({
					type: 'POST',
					url: 'http://localhost:3002/api/subscriptions',
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
						console.log(err.message);
						console.log('*** end of error message ***');

						self.setState({
							subscriptionStatus: 'not subscribed',
							message: err.message
						});
					}
				});
				return false;
			}
		});
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

			return(
				<div className="payment-form">
					<h3>Subscription Confirmed</h3>
					<p>Thank you for subscribing!</p>
					<p>Please <a href="http://localhost:3000">log in</a> to start enjoying.</p>
				</div>
			);
		} else if (this.state.subscriptionStatus === 'not subscribed') {

			return(
				<div>
					<h3>Not subscribed</h3>
					<p>There was a problem with your subscription: {this.state.message}</p>
				</div>
			);

		} else {

			return (
				<div>
					<div className="enter-payment-details">Entrer les détails de paiement</div>
					<div className="payment-form">
						<form id="subscription-create" name="subscription-create" data-async>
							<div className="modal-body">
								<section id="errors"></section>

								<section id="subscription-form">
									<label className="name-details">Vos coordonnées</label>

									<div className="form-group">
										<input
											type="text"
											className="form-control first-name"
											data-recurly="first_name"
											id="first_name"
											name="first-name"
											placeholder="Votre prénom" required />
									</div>

									<div className="form-group">
										<input
											type="text"
											className="form-control last-name"
											data-recurly="last_name"
											id="last_name"
											name="last-name"
											placeholder="Votre nom" required />
									</div>

									<label className="payment-details">Information de paiement
										<small className="text-muted">[<span className="recurly-cc-brand"></span>]</small>
									</label>

									<div className="form-group has-feedback has-feedback-left">
										<input
											type="tel"
											className="form-control recurly-cc-number card-number"
											data-recurly="number"
											name="number"
											id="number"
											autoComplete="cc-number"
											placeholder="1234 5678 8901 1234" required />
										<i className="form-control-feedback fa fa-credit-card"></i>
									</div>

									<div className="form-inline">
										<div className="form-group has-feedback has-feedback-left col-md-6 inline-feedback">
											<input
												type="tel"
												className="form-control recurly-cc-exp card-date"
												data-recurly="month"
												name="month"
												id="month"
												autoComplete="cc-exp"
												placeholder="MM/AA" required />

											<i className="form-control-feedback fa fa-calendar-o"></i>
										</div>

										<div className="form-group has-feedback has-feedback-left col-md-6 inline-feedback">
											<input
												type="tel"
												className="form-control recurly-cc-cvc card-code"
												data-recurly="cvv"
												name="cvv"
												id="cvv"
												autoComplete="off"
												placeholder="123" required />

											<i className="form-control-feedback fa fa-barcode"></i>
										</div>
									</div>
									<CountrySelect />
									<label className="coupon-code-details">Code promo</label>

									<div className="form-group has-feedback has-feedback-left">
										<input
											type="text"
											className="form-control coupon-code"
											data-recurly="coupon_code"
											name="coupon_code"
											id="coupon_code"
											value=""
											placeholder="Entrez votre code" />
										<i className="form-control-feedback fa fa-ticket"></i>
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
							</div>
							<div className="modal-footer" id="recurly-form-footer">
								<span className="price" id="recurly-price"></span>
								<span className="term" id="recurly-term"></span>

								<button
									id="subscribe"
									type="submit"
									form="subscription-create"
									className="button-create-subscription"
									onClick={this.callApi}>S'inscrire
								</button>
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
