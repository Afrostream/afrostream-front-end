import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import Welcome from './Welcome';

var Browse = React.createClass ({

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
				<h3>Logged In and Paid</h3>
				<p>You can now start to browse our video content!</p>
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

module.exports = Browse;
