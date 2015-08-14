import React from 'react';
import { connect } from 'react-redux';

if (process.env.BROWSER) {
	require('./Partners.less');
}

var Partners = React.createClass ({

	render: function() {
		const {
			props: {
				User
				}
			} = this;

		return (
			<section className="partners">
				<div className="partners-image">
					<img src="/images/blind_date.jpg" />
				</div>
				<div className="partners-container">
						<div className="partners-text">
							<h2>Ils nous font confiance</h2>
						</div>
						<div className="partners-links">
							<div className="partners-link">
								<a href="http://www.ycombinator.com/" target="_blank">
									<img src="/images/logo_y.jpg" />
								</a>
							</div>
							<div className="partners-link">
								<a href="http://mytf1vod.tf1.fr/collection/674-Afrostream+VoD.html" target="_blank">
									<img src="/images/logo_mytf1.png" />
								</a>
							</div>
							<div className="partners-link">
								<a href="http://orangefabfrance.fr/les-startups/afrostream/" target="_blank">
									<img src="/images/logo_orange.jpg" />
								</a>
							</div>
						</div>
				</div>
			</section>
		);
	}
});

module.exports = Partners;