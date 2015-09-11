import React from 'react';

if (process.env.BROWSER) {
	require('./PaymentSuccess.less');
}

class PaymentSuccessRedirect extends React.Component {

	render() {

		return (
			<div className="payment-success">
				Payment Success Redirect Page
			</div>
		);
	}

}

export default PaymentSuccessRedirect;
