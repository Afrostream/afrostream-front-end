import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import Welcome from './Welcome';


if (process.env.BROWSER) {
	require('./PaymentError.less');
}


var PaymentSuccess = React.createClass ({

	render: function() {

		return(
			<div className="payment-error">
				<h3>Erreur lors de la création de l'abonnement:</h3>
				<p>{this.props.message}</p>
				<p className="error"><a className="error-link" href="/">merci de réessayer</a></p>
			</div>
		);
	}

});

module.exports = PaymentSuccess;
