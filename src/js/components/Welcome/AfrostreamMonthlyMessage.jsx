import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import Welcome from './Welcome';

if (process.env.BROWSER) {
	require('./AfrostreamMonthlyMessage.less');
}

var AfrostreamMonthlyMessage = React.createClass ({

	getInitialState: function() {

		return {
			loggedIn: true
		}
	},

	logOut: function() {

		console.log('*** this dude is logging out!!! ***');
		localStorage.removeItem('afroToken');

		this.setState({
			loggedIn: false
		});
	},


	render: function() {
		const {
			props: {
				User
				}
			} = this;

		if (this.state.loggedIn === true) {

			return (
				<section className="afrostream-monthly-message">
					<div className="header">
						<img className="create-account-logo" src="/images/logo.png" />
					</div>
					<div className="message-container">
						<h3>Merci d'avoir réservé la formule THINK LIKE A MAN. </h3>
						<p>Rendez vous le 1er octobre pour profiter de votre abonnement.</p>
						<button
							className="logout-button"
							onClick={this.logOut}>se déconnecter
						</button>
					</div>
				</section>
			);

		} else {

			return (<Welcome lock={this.props.lock} />);
		}
	}
});

module.exports = AfrostreamMonthlyMessage;
