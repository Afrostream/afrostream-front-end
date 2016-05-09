import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import PaymentImages from './PaymentImages'
import { dict } from '../../../../config/client'
import _ from 'lodash'
import { formatPrice, isBoolean } from '../../lib/utils'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./SelectPlan.less')
}
@connect(({Billing}) => ({Billing}))
class SelectPlan extends React.Component {

  getPlans () {
    const {
      props: {history, router, Billing}
    } = this

    let isCash = router.isActive('cash')

    let validPlans = Billing.get(`internalPlans/${isCash ? 'cashway' : 'common'}`)

    if (!validPlans) {
      return
    }

    return validPlans.sort((a, b)=> b.get('amountInCents').localeCompare(a.get('amountInCents')))
  }

  getPlanCol (label) {

    const {
      props : {history,router}
    } = this

    let isCash = router.isActive('cash')

    let validPlans = this.getPlans()

    if (!validPlans) {
      return
    }
    return validPlans.map((plan, key)=> {

      let objVal = plan.get(label)

      if (objVal === undefined) {
        objVal = plan.get('internalPlanOpts').get(label)
      }

      if (objVal === undefined) {
        objVal = true
      }

      let value = ''
      switch (label) {
        case 'formule':
          value = dict.planCodes.infos[label] || ''
          break
        case 'internalActionLabel':
          value = (<Link className="btn btn-plan"
                         to={`${isCash ? '/cash' : ''}/select-plan/${plan.get('internalPlanUuid')}/checkout`}>{`${dict.planCodes.action}`}</Link>)
          break
        case 'price':
          value = (<div className="select-plan_price">
            {formatPrice(plan.get('amountInCents'), plan.get('currency'), true)}
            <span className="select-plan_period">
              {`/${plan.get('periodLength')}${dict.account.billing.periods[plan.get('periodUnit')]}`}
            </span>
          </div>)
          break
        default :
          value = objVal
          let isBool = (value === 'true' || value === 'false' || typeof value === 'boolean' ) && typeof isBoolean(value) === 'boolean'
          if (isBool) {
            value = isBoolean(value) ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>
          }
          break
      }

      return (
        <div key={`col-plan-${label}-${key}`}
             className={`col col-xs-${(12/validPlans.size)} col-sm-${(12/validPlans.size)} col-md-2`}>
          {value}
        </div>
      )
    })
  }

  getLabel (label) {

    let validPlans = this.getPlans()

    if (!validPlans) {
      return
    }

    return (
      <div key={`line-plan-${label}`} className={`col col-xs-12 col-sm-12 col-md-${(12 - validPlans.size * 2)}`}>
        {label !== 'formule' && dict.planCodes.infos[label] || ''}
      </div>)
  }

  getHeader () {
    let isCash = this.props.router.isActive('cash')

    if (isCash) {
      return <div className=" choose-plan">{dict.planCodes.cash.selectTitle}</div>
    }

    return <div className=" choose-plan">{dict.planCodes.selectTitle}
      <span className=" choose-plan__bolder"> {dict.planCodes.freePeriodLabel}</span>
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
    ]

    return (
      <div className="plan-container">

        {this.getHeader()}

        <div className="select-plan">
          {_.map(cols, (value, key) =>
            <div key={`line-plan-${key}`} className=" row">
              {this.getLabel(value)}
              {this.getPlanCol(value)}
            </div>
          )}
        </div>
        <PaymentImages />
      </div>
    )
  }
}


SelectPlan.propTypes = {
  history: React.PropTypes.object.isRequired
}

export default withRouter(SelectPlan)
