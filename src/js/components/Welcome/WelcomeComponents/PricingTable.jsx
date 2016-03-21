import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as ModalActionCreators from '../../../actions/modal';
import { Link } from 'react-router';
import config from '../../../../../config'
import _ from 'lodash'

if (process.env.BROWSER) {
  require('./PricingTable.less');
}
@connect(({ User }) => ({User}))
class PricingTable extends React.Component {

  openModal(e) {
    const {
      props: {
        dispatch
        }
      } = this;
    let plan = e.target.value;
    let selectedPlan = _.find(config.planCodes, function (item) {
      return item.code === plan
    });
    let type = selectedPlan.code === 'afrostreamgift' ? 'showGift' : 'showSignup';
    dispatch(ModalActionCreators.open(type, true, `/select-plan/${selectedPlan.code}/checkout`));
  }

  render() {

    return (
      <section className="pricing-table">
        <div className="pricing-header-element">
          <h1>
            <span className="pricing-header-purple">Choisissez la formule </span>
            <span className="pricing-header-gray">qui vous ressemble</span>
            <span
              className="pricing-header-gray pricing-header-bolder">et profitez <b>GRATUITEMENT</b> de 7 jours
              d'essais</span>
          </h1>

          <div className="pricing-header-text">Service uniquement disponible en France, DOM-TOM,
            Belgique, Luxembourg, Suisse, Sénégal, Côte d'Ivoire.
            <Link className="pricing-header-link" to="/faq">Les réponses à vos questions</Link>
          </div>
        </div>
        <div className="pricing-plans">

          <div className="pricing-plan">
            <img className="plan-image" src="/images/titre_abo_1.png" alt="Formule"/>

            <h3 className="plan1-heading">MENSUEL</h3>

            <div className="plan-details-1">
              <div>
                <span className="price">6,99€</span>
                <span className="period">/MOIS</span>
              </div>
              <div className="plan1-highlight">Prélèvement mensuel</div>
              <ul className="plan-benefits-1">
                <li>Sans engagement</li>
                <li>1 seul écran connecté</li>
                <li>Films et séries illimités</li>
              </ul>
            </div>
            <button className="plan1-button" value="afrostreammonthly" onClick={::this.openModal}>
              DÉMARREZ L’ESSAI GRATUIT
            </button>

          </div>

          <div className="pricing-plan">
            <img className="plan-image" src="/images/titre_abo_2.png" alt="Formule"/>

            <h3 className="plan2-heading">AMBASSADEURS</h3>

            <div className="plan-details-2">
              <div>
                <span className="price">59,99€</span>
                <span className="period">/AN</span>
              </div>
              <div className="plan2-highlight">4 mois offerts inclus</div>
              <ul className="plan-benefits-2">
                <li>2 écrans connectés simultanément</li>
                <li>Invitations VIP aux avant-premières de films</li>
                <li>12 mois inclus</li>
                <li>Films et séries illimités</li>
              </ul>
            </div>
            <button className="plan2-button" value="afrostreamambassadeurs" onClick={::this.openModal}>
              DÉMARREZ L’ESSAI GRATUIT
            </button>

          </div>

          <div className="pricing-plan">
            <img className="plan-image" src="/images/titre_abo_3.png" alt="Formule"/>

            <h3 className="plan3-heading">CADEAU</h3>

            <div className="plan-details-3">
              <div>
                <span className="price">59,99€</span>
                <span className="period">/AN</span>
              </div>
              <div className="plan3-highlight">4 mois offerts inclus</div>
              <ul className="plan-benefits-1">
                <li>2 écrans connectés simultanément</li>
                <li>Invitations VIP aux avant-premières de films</li>
                <li>12 mois inclus</li>
                <li>Films et séries illimités</li>
              </ul>
            </div>
            <button className="plan3-button" value="afrostreamgift" onClick={::this.openModal}>
              OFFRIR UN ABONNEMENT
            </button>

          </div>
        </div>
      </section>
    );
  }
}

export default PricingTable;
