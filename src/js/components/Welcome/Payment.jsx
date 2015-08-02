import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import SelectPlan from './SelectPlan';

var Payment = React.createClass ({

	onSubmit: function(e){

		e.preventDefault();
	},


	render: function() {
		const {
			props: {
				User
				}
			} = this;

		return (
			<div>
				<h3>Logged in, not yet paid</h3>
				<p>Please select a plan: </p>
				<SelectPlan profile={this.props.profile} />
			</div>
		);
	}
});

module.exports = Payment;