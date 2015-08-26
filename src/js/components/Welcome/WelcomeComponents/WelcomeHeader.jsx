import React from 'react';
import { connect } from 'react-redux';

if (process.env.BROWSER) {
	require('./WelcomeHeader.less');
}

var WelcomeHeader = React.createClass ({

		showSigninLock: function() {

			this.props.lock.show(
				{
					dict: 'fr',
					connections: ['Username-Password-Authentication', 'facebook'],
					socialBigButtons: true,
					disableSignupAction: true,
					rememberLastLogin: false
				}
			);
		},

		showSignupLock: function() {

			this.props.lock.showSignup(
				{
					dict: 'fr',
					connections: ['Username-Password-Authentication', 'facebook'],
					socialBigButtons: true
				}
			);
		},

	render: function() {
		const {
			props: {
				User
				}
			} = this;

		return (
			<section className="welcome-header">
				<img src="/images/logo.png" className="afrostream-logo" alt="Afrostream.tv" />

				<button type="button" className="login-button" onClick={this.showSigninLock}>connexion</button>

				<h1>HALF OF <br /> A YELLOW <br />SUN</h1>

				<div className="detail-text"> Keisha, April et Valerie sont trois meilleures amies qui partagent tout et
				traversent des épreuves souvent difficiles et comples dans la ville d'Atlanta
				</div>

				<div className="afrostream-statement">Les meilleurs films et séries afro-américains et africaine en ilimité</div>

				<button className="subscribe-button" type="button" onClick={this.showSignupLock}>S'ABONNER MAINTENANT</button>
			</section>
		);
	}
});

module.exports = WelcomeHeader;
