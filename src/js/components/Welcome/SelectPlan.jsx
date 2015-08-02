import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import PaymentForm from './PaymentForm';

var SelectPlan = React.createClass ({

	getInitialState: function() {

		return {
			planName: '',
			unitAmountInCents: '',
			startDate: ''
		};
	},

	selectPlan: function(planName, unitAmountInCents, startDate) {

		console.log('*** plan selected ***');
		console.log(planName + ' ' + unitAmountInCents);
		console.log('*** end of selected Plan ***');

		this.setState({
			planName: planName,
			unitAmountInCents: unitAmountInCents,
			startDate: startDate
		});
	},


	render: function() {
		const {
			props: {
				User
				}
			} = this;

		if (this.state.planName !== '') {

			return(
				<PaymentForm profile={this.props.profile}
					planName={this.state.planName}
					unitAmountInCents={this.state.unitAmountInCents}
					startDate={this.state.startDate} />
			);

		} else {

			return (
				<div className="row">
					<div className="plan plan1 col-sm-12 col-md-4 col-lg-4 text-center pull-down">
						<div className="header">"Think Like A Man"</div>
						<div className="price">6,99€/mois</div>
						<div className="monthly">prélèvement mensuel</div>
						<ul>
							<li>À partir du 1er octobre</li>
							<li>Sans engagement</li>
							<li>1 seul écran connecté</li>
							<li>Films et séries illimités</li>
						</ul>
						<button
							onClick={this.selectPlan.bind(this, 'afrostreammonthly', '699', '2015-10-01T00:00:00:00Z')}
							className="signup">Sabonner <br />maintenant démarrer le 1er octobre
						</button>
					</div>

					<div className="plan plan2 col-sm-12 col-md-4 col-lg-4 text-center pull-down">
						<div className="header">** Ambassadeurs **</div>
						<div className="price">59,99€/an</div>
						<div className="monthly">5 mois offerts inclus</div>
						<ul>
							<li><b>Accès Dès le 1er septembre</b></li>
							<li>2 écrans connectés simultanément</li>
							<li>Invitations VIP aux avant-premières de films</li>
							<li>12 mois inclus</li>
							<li>Films et séries illimités</li>
						</ul>
						<button
							onClick={this.selectPlan.bind(this, 'afrostreamambassadeurs', '5999', '2015-09-01T00:00:00:00Z')}
							className="signup">Sabonner <br />maintenant
						</button>
					</div>

					<div className="plan plan3 col-sm-12 col-md-4 col-lg-4 text-center pull-down">
						<div className="header">"Do the right thing"</div>
						<div className="price">99,99€/an</div>
						<div className="monthly">Économisez 68 euros !</div>
						<ul>
							<li><b>4 écrans connectés simultanément</b></li>
							<li><b>1 clé <a href="http://www.google.com/chrome/devices/chromecast/"
								target="_blank">Chromecast</a> offerte</b>
							</li>
							<li>1 T-shirt collector Afrostream</li>
							<li>Accès dès le 1er septembre</li>
							<li>12 mois inclus</li>
							<li>Films et séries illimités</li>
						</ul>
						<button
							onClick={this.selectPlan.bind(this, 'afrostreampremium', '9999', '2015-09-01T00:00:00:00Z')}
							className="signup">Sabonner <br />maintenant
						</button>
					</div>
				</div>
			);
		}
	}
});

module.exports = SelectPlan;
