import React from 'react';
import * as UserActionCreators from '../../actions/user';
import { connect } from 'react-redux';
import PaymentForm from './PaymentForm';

if (process.env.BROWSER) {
	require('./SelectPlan.less');
}

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
				<div>
					<div className="choose-plan">Choissisez la formule qui vous ressemble</div>
					<div className="select-plan">
						<div className="formule-row-no-decoration">
							<div className="row-element-left"></div>
							<div className="row-element">
								<span className="blue-text">FORMULE</span>
							</div>
							<div className="row-element">
								<span className="yellow-text">FORMULE</span>
							</div>
							<div className="row-element">
								<span className="purple-text">FORMULE</span>
							</div>
						</div>
						<div className="formule-row-no-decoration">
							<div className="row-element-left-header"></div>
							<div className="blue-background">
									THINK LIKE A MAN
							</div>
							<div className="yellow-background">
								ABASSADEUR
							</div>
							<div className="purple-background">
								DO THE RIGHT THING
							</div>
						</div>
						<div className="formule-row-decorated-prices">
							<div className="row-element-left">Tarif après le mois gratuit</div>
							<div className="row-element-prices">
								<span className="plan-price">6,99€</span>
								<span className="plan-period">/MOIS</span>
							</div>
							<div className="row-element-prices">
								<span className="plan-price">59,99€</span>
								<span className="plan-period">/AN</span>
							</div>
							<div className="row-element-prices">
								<span className="plan-price">99,99€</span>
								<span className="plan-period">/AN</span>
							</div>
						</div>
						<div className="formule-row-decorated">
							<div className="row-element-left">HD disponible</div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
						</div>
						<div className="formule-row-decorated">
							<div className="row-element-left">Ultra HD (si disponible)</div>
							<div className="row-element"><i className="fa fa-times"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
						</div>
						<div className="formule-row-decorated">
							<div className="row-element-left">Écrans disponibles en simultané</div>
							<div className="row-element"><strong>1</strong></div>
							<div className="row-element"><strong>2</strong></div>
							<div className="row-element"><strong>4</strong></div>
						</div>
						<div className="formule-row-decorated">
							<div className="row-element-left-twolines">Sur votre ordinateur, TV, smartphone et tablette</div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
						</div>
							<div className="formule-row-decorated">
							<div className="row-element-left">Films et séries TV en illimité</div>
						<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
						</div>
						<div className="formule-row-decorated">
							<div className="row-element-left">Annulable à tout moment</div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
						</div>
						<div className="formule-row-decorated">
							<div className="row-element-left">Invitations avant première film</div>
							<div className="row-element"><i className="fa fa-times"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-times"></i></div>
						</div>
						<div className="formule-row-no-decoration">
							<div className="row-element-left">Premier mois gratuit</div>
							<div className="row-element"><i className="fa fa-times"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
							<div className="row-element"><i className="fa fa-check"></i></div>
						</div>
						<div className="formule-row-no-decoration">
							<div className="row-element-left"></div>
							<div className="row-element">
								<button className="button-blue" onClick={this.selectPlan.bind(this, 'afrostreammonthly', '699', '2015-10-01T00:00:00:00Z')}>S'ABONNER</button>
							</div>
							<div className="row-element">
								<button className="button-yellow" onClick={this.selectPlan.bind(this, 'afrostreamambassadeurs', '5999', '2015-09-01T00:00:00:00Z')}>S'ABONNER</button>
							</div>
							<div className="row-element">
								<button className="button-purple" onClick={this.selectPlan.bind(this, 'afrostreampremium', '9999', '2015-09-01T00:00:00:00Z')}>S'ABONNER</button>
							</div>
						</div>
					</div>
				</div>
			);
		}
	}
});

module.exports = SelectPlan;
