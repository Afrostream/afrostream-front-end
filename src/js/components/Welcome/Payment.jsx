import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import SelectPlan from './SelectPlan';

if (process.env.BROWSER) {
	require('./Payment.less');
}

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
			<section className="payment">
				<div className="header">
					<img className="create-account-logo" src="/images/logo.png" />
				</div>
				<div className="choose-plan">Choissisez la formule qui vous ressemble</div>
				<SelectPlan profile={this.props.profile} />
			</section>
		);
	}
});

module.exports = Payment;