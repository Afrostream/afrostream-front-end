import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import Welcome from './Welcome';


if (process.env.BROWSER) {
	require('./PaymentSuccess.less');
}


var PaymentSuccess = React.createClass ({

	render: function() {

		return(
			<div className="payment-success">
				<h3>Votre abonnement a bien été enregistré</h3>
				<p>merci pour votre inscription</p>
				<p className="success"><a className="success-link" href="/">Commencez la visite sur le site</a></p>
			</div>
		);
	}

});

module.exports = PaymentSuccess;
