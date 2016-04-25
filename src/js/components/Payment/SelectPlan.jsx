import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import PaymentImages from './PaymentImages';
import { dict } from '../../../../config/client';
import _ from 'lodash';
import { formatPrice, isBoolean } from '../../lib/utils';
import * as EventActionCreators from '../../actions/event';
import * as BillingActionCreators from '../../actions/billing';

if (process.env.BROWSER) {
  require('./SelectPlan.less');
}
@prepareRoute(async function ({store}) {
  let isCash = store.history.isActive('cash');
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(BillingActionCreators.getInternalplans(isCash ? 'cashway' : 'common'))
  ];
})
@connect(({Billing}) => ({Billing}))
class SelectPlan extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  getPlans () {
    const {
      context : {history},
      props: {Billing}
    } = this;

    let isCash = history.isActive('cash');

    let validPlans = Billing.get(`internalPlans/${isCash ? 'cashway' : 'common'}`);

    if (!validPlans) {
      return;
    }

    return validPlans.sort((a, b)=> b.get('amountInCents').localeCompare(a.get('amountInCents')));
  }

  getPlanCol (label) {

    const {
      context : {history}
    } = this;

    let isCash = history.isActive('cash');

    let validPlans = this.getPlans();

    if (!validPlans) {
      return;
    }
    return validPlans.map((plan, key)=> {

      let objVal = plan.get(label);

      if (objVal === undefined) {
        objVal = plan.get('internalPlanOpts').get(label);
      }

      if (objVal === undefined) {
        objVal = true;
      }

      let value = '';
      switch (label) {
        case 'formule':
          value = dict.planCodes.infos[label] || '';
          break;
        case 'internalActionLabel':
          value = (<Link className="btn btn-plan"
                         to={`${isCash ? '/cash' : ''}/select-plan/${plan.get('internalPlanUuid')}/checkout`}>{`${dict.planCodes.action}`}</Link>);
          break;
        case 'price':
          value = `${formatPrice(plan.get('amountInCents'), plan.get('currency'), true)}/${plan.get('periodLength')}${dict.account.billing.periods[plan.get('periodUnit')]}`;
          break;
        default :
          value = objVal;
          let isBool = (value === 'true' || value === 'false' || typeof value === 'boolean' ) && typeof isBoolean(value) === 'boolean';
          if (isBool) {
            value = isBoolean(value) ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>;
          }
          break;
      }

      return (
        <div key={`col-plan-${label}-${key}`} className="col col-xs-4 col-sm-4 col-md-2">
          {value}
        </div>
      )
    });
  }

  getLabel (label) {

    let validPlans = this.getPlans();

    if (!validPlans) {
      return;
    }

    return (
      <div key={`line-plan-${label}`} className={`col col-xs-12 col-sm-12 col-md-${(12 - validPlans.size * 2)}`}>
        {dict.planCodes.infos[label] || ''}
      </div>);
  }

  getHeader () {
    let isCash = this.context.history.isActive('cash');

    if (isCash) {
      return <div className="choose-plan">{dict.planCodes.cash.selectTitle}</div>
    }

    return <div className="choose-plan">{dict.planCodes.selectTitle}
      <span className="choose-plan__bolder"> {dict.planCodes.freePeriodLabel}</span>
    </div>
  }

  render () {

    let cols = [
      'formule',
      'name',
      'price',
      'trialEnabled',
      'internalMaxScreens',
      'internalMobile',
      'internalUnlimited',
      'internalEngagment',
      'internalVip',
      'internalActionLabel'
    ];

    return (
      <div className="plan-container">

        {this.getHeader()}

        <div className="select-plan">
          {_.map(cols, (value, key) =>
            <div key={`line-plan-${key}`} className="row">
              {this.getLabel(value)}
              {this.getPlanCol(value)}
            </div>
          )}
        </div>
        <PaymentImages />
      </div>
    );
  }
}

export default SelectPlan;
