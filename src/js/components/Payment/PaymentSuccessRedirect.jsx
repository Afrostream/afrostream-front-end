import React from 'react';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';
import { prepareRoute } from '../../decorators';

if (process.env.BROWSER) {
	require('./PaymentSuccess.less');
}

@prepareRoute(async function ({ store }) {
	return await * [
			store.dispatch(UserActionCreators.logOut()),
			store.dispatch(UserActionCreators.routeHome())
		];
}) class PaymentSuccessRedirect extends React.Component {

	render() {
		return (
			<div />
		);
	}

}

export default PaymentSuccessRedirect;
