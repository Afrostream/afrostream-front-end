import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import PaymentImages from './PaymentImages'
import { getI18n } from '../../../../config/i18n'
import _ from 'lodash'
import { formatPrice, isBoolean } from '../../lib/utils'
import { withRouter } from 'react-router'
import ModalCoupon from '../Modal/ModalCoupon'
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
    dispatch(ModalActionCreators.open({target: type, donePath: `/select-plan/${internalPlanUuid}/checkout`}))
  }

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
      props : {history, router, User}
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

          if (!user) {
            const inputSignupAction = {
              onClick: event => ::this.openModal(plan.get('internalPlanUuid'))
            }
            value = (<button className="btn btn-plan" {...inputSignupAction}>{`${getI18n().planCodes.action}`}</button>)
          } else {
            value = (<Link className="btn btn-plan"
                           to={`${isCash ? '/cash' : ''}/select-plan/${plan.get('internalPlanUuid')}/checkout`}>{`${getI18n().planCodes.action}`}</Link>)
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

    if (isCash) {
      return <div className=" choose-plan">{getI18n().planCodes.cash.selectTitle}</div>
    }

    return <div className=" choose-plan">{getI18n().planCodes.selectTitle}
      <span className=" choose-plan__bolder"> {getI18n().planCodes.freePeriodLabel}</span>
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
        {this.props.showImages && <PaymentImages />}
      </div>
    )
  }
}


SelectPlan.propTypes = {
  history: React.PropTypes.object.isRequired,
  showImages: React.PropTypes.bool
}

SelectPlan.defaultProps = {
  showImages: true
}

export default withRouter(SelectPlan)
