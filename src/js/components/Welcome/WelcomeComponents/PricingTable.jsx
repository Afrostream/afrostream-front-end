import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../../../decorators';
import * as ModalActionCreators from '../../../actions/modal';
import * as BillingActionCreators from '../../../actions/billing';
import { Link } from 'react-router';
import { dict } from '../../../../../config/client';
import { formatPrice, isBoolean } from '../../../lib/utils';
import _ from 'lodash'

if (process.env.BROWSER) {
  require('./PricingTable.less');
}
@connect(({User, Billing}) => ({User, Billing}))
@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(BillingActionCreators.getInternalplans('recurly'))
  ];
})
class PricingTable extends React.Component {

  getPlans () {
    const {
      props: {
        Billing
      }
    } = this;

    let validPlans = Billing.get('internalPlans');

    if (!validPlans) {
      return;
    }

    return validPlans.sort((a, b)=> a.get('amountInCents').localeCompare(b.get('amountInCents')));
  }

  openModal (e) {
    const {
      props: {
        dispatch
      }
    } = this;
    let internalPlanUuid = e.target.value;
    let type = (internalPlanUuid === 'afrostreamgift') ? 'showGift' : 'showSignup';
    dispatch(ModalActionCreators.open(type, true, `/select-plan/${internalPlanUuid}/checkout`));
  }

  getPlanRow (plan) {

    let cols = [
      'name',
      'price',
      'internalFreePeriod',
      'internalMaxScreens',
      'internalMobile',
      'internalUnlimited',
      'internalEngagment',
      'internalVip',
      'internalActionLabel'
    ];

    return _.map(cols, (label)=> {
      let objVal = plan.get(label) || plan.get('internalPlanOpts').get(label);
      if (objVal === undefined) {
        objVal = true;
      }

      let value = '';
      switch (label) {
        case 'internalActionLabel':
          value = (<button className="btn-plan" onClick={::this.openModal}>{`${dict.planCodes.action}`}</button>);
          break;
        case 'price':
          value = `${formatPrice(plan.get('amountInCents'), plan.get('currency'), true)}/${plan.get('periodLength')}${dict.account.billing.periods[plan.get('periodUnit')]}`;
          break;
        default :
          let isBool = (objVal === 'true' || objVal === 'false' || typeof objVal === 'boolean' ) && typeof isBoolean(objVal) === 'boolean';
          value = objVal;
          if (isBool && isBoolean(objVal)) {
            value = dict.planCodes.infos[label] || '';
          }
          break;
      }

      if (!value) {
        return '';
      }

      return (
        <div key={`row-plan-${label}`} className="row">
          {value}
        </div>
      );

    });
  }

  getPlanCol () {

    let validPlans = this.getPlans();

    if (!validPlans) {
      return;
    }

    return validPlans.map((plan)=> {
      let key = plan.get('internalPlanUuid');

      return (
        <div key={`col-plan-${key}`} className="col col-xs-4 col-sm-4 col-md-2 col-md-offset-1">
          {this.getPlanRow(plan)}
        </div>);
    });
  }

  getFirstCol () {

    let validPlans = this.getPlans();

    if (!validPlans) {
      return;
    }

    return (
      <div key={`line-plan-baseline`} className={`col col-xs-12 col-sm-12 col-md-${(12 - validPlans.size * 2)}`}>
        <h1>
          <span className="pricing-header-purple">Nos formules </span>
        </h1>
        <div className="pricing-baseline">Service uniquement disponible en France, DOM-TOM,
          Belgique, Luxembourg, Suisse, Sénégal, Côte d'Ivoire.
          <Link to="/faq">Les réponses à vos questions</Link>
        </div>
      </div>);
  }

  render () {


    return (
      <section className="pricing">
        <div className="row">

          {this.getFirstCol()}
          {this.getPlanCol()}

        </div>

        <div className="pricing-table">
          <div className="pricing-header-element">
            <h1>
              <span className="pricing-header-purple">Nos formules </span>
            </h1>
            <div className="pricing-baseline">Service uniquement disponible en France, DOM-TOM,
              Belgique, Luxembourg, Suisse, Sénégal, Côte d'Ivoire.
              <Link to="/faq">Les réponses à vos questions</Link>
            </div>
          </div>
          <div className="pricing-plans">

            <div className="pricing-plan">
              <img className="plan-image" src="/images/titre_abo_1.png" alt="Formule"/>

              <h3 className="plan-heading plan1-heading">MENSUEL</h3>

              <div className="plan-details-1">
                <div className="prices">
                  <span className="price">6,99€</span>
                  <span className="period">/MOIS</span>
                </div>
                <div className="plan-highlight plan1-highlight">Prélèvement mensuel</div>
                <ul className="plan-benefits-1">
                  <li>Une semaine d'éssai</li>
                  <li>Sans engagement</li>
                  <li>1 seul écran connecté</li>
                  <li>Films et séries illimités</li>
                </ul>
              </div>
              <button className="btn-plan plan1-button" value="afrostreammonthly" onClick={::this.openModal}>
                DÉMARREZ 7 JOURS D'ESSAI
              </button>

            </div>

            <div className="pricing-plan">
              <img className="plan-image" src="/images/titre_abo_2.png" alt="Formule"/>

              <h3 className="plan-heading plan2-heading">SÉRÉNITÉ</h3>

              <div className="plan-details-2">
                <div className="prices">
                  <span className="price">59,99€</span>
                  <span className="period">/AN</span>
                </div>
                <ul className="plan-benefits-2">
                  <li>Une semaine d'éssai</li>
                  <li>2 écrans connectés simultanément</li>
                  <li>Invitations VIP aux avant-premières de films</li>
                  <li>12 mois inclus</li>
                  <li>Films et séries illimités</li>
                </ul>
              </div>
              <button className="btn-plan plan2-button" value="afrostreamambassadeurs" onClick={::this.openModal}>
                DÉMARREZ 7 JOURS D'ESSAI
              </button>

            </div>

            <div className="pricing-plan">
              <img className="plan-image" src="/images/titre_abo_3.png" alt="Formule"/>

              <h3 className="plan-heading plan3-heading">CADEAU</h3>

              <div className="plan-details-3">
                <div className="prices">
                  <span className="price">59,99€</span>
                  <span className="period">/AN</span>
                </div>
                <ul className="plan-benefits-1">
                  <li>2 écrans connectés simultanément</li>
                  <li>Invitations VIP aux avant-premières de films</li>
                  <li>12 mois inclus</li>
                  <li>Films et séries illimités</li>
                </ul>
              </div>
              <button className="btn-plan plan3-button" value="afrostreamgift" onClick={::this.openModal}>
                OFFRIR UN ABONNEMENT
              </button>

            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default PricingTable;
