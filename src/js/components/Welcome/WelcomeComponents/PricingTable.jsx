import React from 'react';
import { connect } from 'react-redux';

if (process.env.BROWSER) {
	require('./PricingTable.less');
}

var PricingTable = React.createClass ({

	render: function() {
		const {
			props: {
				User
				}
			} = this;

		return (
			<section className="pricing-table">
				<div className="pricing-header-element">
					<h1>
						<span className="pricing-header-purple">Choissisez la formule </span>
						<span className="pricing-header-gray">qui vous ressemble</span>
					</h1>
					<div className="pricing-header-text">Service uniquement disponible en France, DOM-TOM,
						Belgique, Luxembourg, Suisse, Sénégal, Côte d'Ivoire.
						<a className="pricing-header-link">Les réponses à vos questions</a>
					</div>
				</div>
					<div className="pricing-plans">

						<div className="pricing-plan">
							<img className="plan-image" src="/images/titre_abo_1.png" alt="Formule" />
							<h3 className="plan1-heading">THINK LIKE A MAN</h3>
							<div className="plan-details-1">
								<div>
									<span className="price">6,99€</span>
									<span className="period">/MOIS</span>
								</div>
								<div className="plan1-highlight">Prélèvenment mensuel</div>
								<div className="begin-date-1">A PARTIR DU 1er OCTOBRE</div>
								<ul className="plan-benefits-1">
									<li>Sans engagement</li>
									<li>1 seul écran connecté</li>
									<li>Films et séries illimités</li>
								</ul>
							</div>
								<button className="plan1-button">
									S'ABONNER MAINTENANT
								</button>

						</div>

						<div className="pricing-plan">
							<img className="plan-image" src="/images/titre_abo_2.png" alt="Formule" />
							<h3 className="plan2-heading">AMBASSADEURS</h3>
							<div className="plan-details-2">
								<div>
									<span className="price">59,99€</span>
									<span className="period">/AN</span>
								</div>
								<div className="plan2-highlight">4 mois offerts inclus</div>
								<div className="begin-date-2">ACCÉS DÈS LE 1er SEPTEMBRE</div>
								<ul className="plan-benefits-2">
									<li>2 écrans connectés simultanément</li>
									<li>Invitations VIP aux avant-premières de films</li>
									<li>12 mois inclus</li>
									<li>Films et séries illimités</li>
								</ul>
							</div>
								<button className="plan2-button">
									S'ABONNER MAINTENANT
								</button>

						</div>

						<div className="pricing-plan">
							<img className="plan-image" src="/images/titre_abo_3.png" alt="Formule" />
							<h3  className="plan3-heading">DO THE RIGHT THING</h3>
							<div className="plan-details-3">
								<div>
									<span className="price">99,99€</span>
									<span className="period">/AN</span>
								</div>
								<div className="plan3-highlight">Economisez 68 euros!</div>
								<div className="begin-date-2">ACCÉS DÈS LE 1er SEPTEMBRE</div>
								<ul className="plan-benefits-1">
									<li>4 écrans connectés simultanément</li>
									<li>1 clé Chromcast offerte</li>
									<li>1 T-shirt collector Afrostream</li>
									<li>Invitations VIP aux avant-premières de films</li>
									<li>12 mois inclus</li>
									<li>Films et séries illimités</li>
								</ul>
							</div>
								<button className="plan3-button">
									S'ABONNER MAINTENANT
								</button>

						</div>
					</div>
			</section>
		);
	}
});

module.exports = PricingTable;
