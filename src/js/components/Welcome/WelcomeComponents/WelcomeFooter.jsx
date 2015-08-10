import React from 'react';
import { connect } from 'react-redux';

if (process.env.BROWSER) {
	require('./WelcomeFooter.less');
}

var WelcomeFooter = React.createClass ({

	render: function() {
		const {
			props: {
				User
				}
			} = this;

		return (
			<div>Welcome Footer</div>
		);
	}
});

module.exports = WelcomeFooter;