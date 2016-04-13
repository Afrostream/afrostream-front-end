import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import PaymentImages from './PaymentImages';
import { planCodes, dict } from '../../../../config/client';
import _ from 'lodash';
import { formatPrice } from '../../lib/utils';
import { prepareRoute } from '../../decorators';
import * as EventActionCreators from '../../actions/event';

if (process.env.BROWSER) {
  require('./SelectPlan.less');
}
@prepareRoute(async function ({store}) {
  return await * [
    store.dispatch(EventActionCreators.pinHeader(true))
  ];
})
class SelectPlan extends React.Component {

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  getPlans () {
    let isCash = this.context.history.isActive('cash');

    let validPlans = _.filter(planCodes, function (o) {
      return o.cash == isCash;
    });

    return validPlans;
  }

  getPlanRow (label) {

    let isCash = this.context.history.isActive('cash');

    let validPlans = this.getPlans();

    return _.map(validPlans, (plan, key)=> {

      let objVal = plan[label] || plan.internalPlanOpts[label];

      if (objVal === undefined) {
        objVal = true;
      }

      let value = '';
      switch (label) {
        case 'formule':
          value = 'Formule';
          break;
        case 'internalActionLabel':
          value = (<Link className="btn btn-plan"
                         to={`${isCash ? '/cash' : ''}/select-plan/${plan.internalPlanUuid}/checkout`}>{`${objVal}`}</Link>);
          break;
        case 'price':
          value = `${formatPrice(plan['amount_in_cents'], plan.currency, true)} / ${plan.periodLength}${dict.account.billing.periods[plan.periodUnit]}`;
          break;
        default :
          value = objVal;
          break;
      }

      if (typeof value === 'boolean') {
        value = value ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>;
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

    return (
      <div key={`line-plan-${label}`} className={`col col-xs-12 col-sm-12 col-md-${(12 - validPlans.length * 2)}`}>
        {dict.planCodes.infos[label] || ''}
      </div>);
  }

  getHeader () {
    let isCash = this.context.history.isActive('cash');

    if (isCash) {
      return <div className="choose-plan">Choisissez votre formule</div>
    }

    return <div className="choose-plan">Choisissez votre formule et profitez de
      <span className="choose-plan__bolder"> 7 jours d'essai</span>
    </div>
  }

  render () {

    let cols = [
      'formule',
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

    return (
      <div className="plan-container">

        {this.getHeader()}

        <div className="select-plan">
          {_.map(cols, (value, key) =>
            <div key={`line-plan-${key}`} className="row">
              {this.getLabel(value)}{}
              {this.getPlanRow(value)}
            </div>
          )}
        </div>
        <PaymentImages />
      </div>
    );
  }
}

export default SelectPlan;
