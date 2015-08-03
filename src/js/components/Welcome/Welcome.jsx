import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import config from '../../../../config/client';

var Welcome = React.createClass ({

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

		return (
			<div>
				<h3>In the welcome  page</h3>
				<div className="btn-group navbar-collapse collapse navbar-left">
					<button type="button" className="btn btn-user btn-default dropdown-toggle" data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false" onClick={this.showSignupLock}>abonnez-vous
					</button>
				</div>

				<div className="btn-group navbar-collapse collapse navbar-left">
					<button type="button" className="btn btn-user btn-default dropdown-toggle" data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false" onClick={this.showSigninLock}>se connecter
					</button>
				</div>
			</div>
		);
	}
});

module.exports = Welcome;