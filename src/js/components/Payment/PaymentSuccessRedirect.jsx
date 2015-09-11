import React from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import * as UserActionCreators from '../../actions/user';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

if (process.env.BROWSER) {
	require('./PaymentSuccess.less');
}

@prepareRoute(async function ({ store }) {
	return await * [
			store.dispatch(UserActionCreators.logOut()),
			store.dispatch(UserActionCreators.routeHome())
		];
})
@connect(({ User }) => ({User}))class PaymentSuccessRedirect extends React.Component {

	render() {

		return (
			<div />
		);
	}

}

export default PaymentSuccessRedirect;
