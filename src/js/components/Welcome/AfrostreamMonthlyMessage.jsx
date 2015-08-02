import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import Welcome from './Welcome';

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
				<div>
					<h3>You are subscribed to the formule "Think like a Man"</h3>
					<p>To start watching great movies and series on Afrostream,
						please visit us again on 1 October 2015!</p>
					<button
						id="subscribe"
						form="subscription-create"
						className="btn btn-primary"
						onClick={this.logOut}>Log Out
					</button>
				</div>
			);

		} else {

			return (<Welcome lock={this.props.lock} />);
		}
	}
});

module.exports = AfrostreamMonthlyMessage;
