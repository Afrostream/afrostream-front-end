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
        case 'internalMaxScreens':
          value = `${objVal} ${dict.planCodes.infos[label]}`;
          break;
        default :
          let isBool = (objVal === 'true' || objVal === 'false' || typeof objVal === 'boolean' ) && typeof isBoolean(objVal) === 'boolean';
          if (isBool) {
            if (isBoolean(objVal)) {
              value = dict.planCodes.infos[label] || '';
            }
          }
          else {
            value = objVal;
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
        <div key={`col-plan-${key}`} className="col col-xs-12 col-sm-12 col-md-2">
          <div className="plan-container">
            {this.getPlanRow(plan)}
          </div>
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
      </section>
    );
  }
}

export default PricingTable;
