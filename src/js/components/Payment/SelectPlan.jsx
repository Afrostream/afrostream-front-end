import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import PaymentImages from './PaymentImages'
import { getI18n } from '../../../../config/i18n'
import _ from 'lodash'
import { formatPrice, isBoolean } from '../../lib/utils'
import { withRouter } from 'react-router'
import * as ModalActionCreators from '../../actions/modal'

if (process.env.BROWSER) {
  require('./SelectPlan.less')
}
@connect(({User, Billing}) => ({User, Billing}))
class SelectPlan extends React.Component {

  openModal (internalPlanUuid) {
    const {
      props: {
        dispatch
      }
    } = this
    let type = 'showSignup'

    const internalPlanQuery = this.getInternalQuery()

    dispatch(ModalActionCreators.open({
      target: type,
      donePath: `/select-plan/${internalPlanUuid}/checkout${internalPlanQuery}`
    }))
  }

  getInternalQuery () {
    const {
      props: {location}
    } = this
    let {query} = location

    let queryS = ''
    if (query && query.contextBillingUuid) {
      queryS = '?contextBillingUuid=' + query.contextBillingUuid
    }
    return queryS
  }

  getPlans () {
    const {
      props: {router, location, Billing}
    } = this
    let {query} = location
    let isCash = router.isActive('cash')
    const internalPlanQuery = query && query.contextBillingUuid
    let validPlans = Billing.get(`internalPlans/${isCash ? 'cashway' : (internalPlanQuery || 'common')}`)
    return validPlans
  }

  getPlanCol (label) {

    const {
      props : {router, User}
    } = this
    let isCash = router.isActive('cash')

    let validPlans = this.getPlans()

    if (!validPlans) {
      return
    }

    let user = User.get('user')

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
          value = getI18n().planCodes.infos[label] || ''
          break
        case 'internalActionLabel':

          const internalPlanQuery = this.getInternalQuery()

          if (!user) {
            const inputSignupAction = {
              onClick: event => ::this.openModal(plan.get('internalPlanUuid'))
            }
            value = (<button className="btn btn-plan" {...inputSignupAction}>{`${getI18n().planCodes.action}`}</button>)
          } else {
            value = (<Link className="btn btn-plan"
                           to={`${isCash ? '/cash' : ''}/select-plan/${plan.get('internalPlanUuid')}/checkout${internalPlanQuery}`}>{`${getI18n().planCodes.action}`}</Link>)
          }
          break
        case 'price':
          value = (<div className="select-plan_price">
            {formatPrice(plan.get('amountInCents'), plan.get('currency'), true)}
            <span className="select-plan_period">
              {`/${plan.get('periodLength')}${getI18n().account.billing.periods[plan.get('periodUnit')]}`}
            </span>
          </div>)
          break
        default :
          value = objVal
          let isBool = (value === 'true' || value === 'false' || typeof value === 'boolean' ) && typeof isBoolean(value) === 'boolean'
          if (isBool) {
            value = isBoolean(value) ? <i className="zmdi zmdi-check"></i> : <i className="zmdi zmdi-close"></i>
          }
          break
      }

      return (
        <div key={`col-plan-${label}-${key}`}
             className={`col col-xs-${(12 / validPlans.size)} col-sm-${(12 / validPlans.size)} col-md-2`}>
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
        {label !== 'formule' && getI18n().planCodes.infos[label] || ''}
      </div>)
  }

  getHeader () {
    let isCash = this.props.router.isActive('cash')
    let validPlans = this.getPlans()
    let periodTrialLabel = ''
    if (validPlans) {
      let trialPeriodPlan = validPlans.filter((plan)=> {
        return isBoolean(plan.get('trialEnabled'))
      }).first()
      if (trialPeriodPlan) {
        periodTrialLabel = getI18n().planCodes.freePeriodLabel
        let trialUnit = getI18n().account.billing.periods[trialPeriodPlan.get('trialPeriodUnit')]
        periodTrialLabel = periodTrialLabel.replace('{trialPeriodLength}', trialPeriodPlan.get('trialPeriodLength'))
        periodTrialLabel = periodTrialLabel.replace('{trialPeriodUnit}', trialUnit)
      }
    }

    return <div className="choose-plan">{getI18n().planCodes.selectTitle}
      {!isCash && <span className="choose-plan__bolder">{` ${periodTrialLabel}`}</span>}
    </div>
  }

  render () {
    let plans = this.getPlans()
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

    if (!plans || !plans.size) {
      return (
        <div className="container plan-container content-padding">
          <div className="choose-plan">{getI18n().planCodes.noPlans}</div>
        </div>
      )
    }

    return (
      <div className="container plan-container content-padding">

        {this.getHeader()}

        <div className="select-plan">
          {_.map(cols, (value, key) =>
            <div key={`line-plan-${key}`} className=" row">
              {this.getLabel(value)}
              {this.getPlanCol(value)}
            </div>
          )}
        </div>
        {this.props.showImages && <PaymentImages />}
      </div>
    )
  }
}


SelectPlan.propTypes = {
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  showImages: React.PropTypes.bool
}

SelectPlan.defaultProps = {
  showImages: true
}

export default withRouter(SelectPlan)
