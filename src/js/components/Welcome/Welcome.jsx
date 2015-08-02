import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import SignupButton from './../User/SignupButton';
import SigninButton from './../User/SigninButton';

var Welcome = React.createClass ({

	render: function() {
		const {
			props: {
				User
				}
			} = this;

		return (
			<div>
				<SignupButton />
				<SigninButton />
			</div>
		);
	}
});

module.exports = Welcome;