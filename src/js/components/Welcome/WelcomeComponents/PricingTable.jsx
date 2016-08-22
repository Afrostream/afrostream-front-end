import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../../actions/modal'
import { Link } from 'react-router'
import { getI18n } from '../../../../../config/i18n'
import { formatPrice, isBoolean } from '../../../lib/utils'
import ModalCoupon from '../../Modal/ModalCoupon'
import _ from 'lodash'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./PricingTable.less')
}
@connect(({User, Billing}) => ({User, Billing}))
class PricingTable extends React.Component {

  getPlans () {
    const {
      props: {
        Billing
      }
    } = this

    let validPlans = Billing.get(`internalPlans/common`)

    if (!validPlans) {
      return
    }

    return validPlans.sort((a, b)=> b.get('amountInCents').localeCompare(a.get('amountInCents')))
  }

  openModal (internalPlanUuid) {
    const {
      props: {
        dispatch
      }
    } = this
    let type = 'showSignup'
    dispatch(ModalActionCreators.open({target: type, donePath: `/select-plan/${internalPlanUuid}/checkout`}))
  }

  getPlanRow (plan) {

    const {
      props: {
        params
      }
    } = this

    let getI18nionnary = getI18n(params.lang)
    let cols = [
      'formule',
      'name',
      'price',
      'prelevementMensuel',
      'trialEnabled',
      'internalMaxScreens',
      'internalMobile',
      'internalUnlimited',
      'internalEngagment',
      'internalVip',
      'internalActionLabel'
    ]

    return _.map(cols, (label)=> {
      let internalPlanUuid = plan.get('internalPlanUuid')
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
          value = getI18nionnary.planCodes.infos[label] || ''
          break
        case 'prelevementMensuel':
          if (plan.get('periodUnit') === 'month') {
            value = <div className="plan-highlight">{getI18nionnary.planCodes.infos[label]}</div>
          }
          break
        case 'internalActionLabel':
          const inputSignupAction = {
            onClick: event => ::this.openModal(internalPlanUuid)
          }
          value = (<button className="btn-plan" {...inputSignupAction}>{`${getI18nionnary.planCodes.action}`}</button>)
          break
        case 'price':
          value = `${formatPrice(plan.get('amountInCents'), plan.get('currency'), true)}/${plan.get('periodLength')}${getI18nionnary.account.billing.periods[plan.get('periodUnit')]}`
          break
        case 'internalMaxScreens':
          value =
            <span>{`${objVal} ${getI18nionnary.planCodes.infos[label].replace(/{s}/g, parseInt(objVal) > 1 ? 's' : '')}`}</span>
          break
        case 'internalEngagment':
          let periodLabel = getI18nionnary.planCodes.infos[label]
          periodLabel = periodLabel.replace('{periodLength}', plan.get('periodLength'))
          periodLabel = periodLabel.replace('{periodUnit}', plan.get('periodUnit'))
          value = <span>{periodLabel}</span>
          break
        default :
          let isBool = (objVal === 'true' || objVal === 'false' || typeof objVal === 'boolean' ) && typeof isBoolean(objVal) === 'boolean'
          if (isBool) {
            if (isBoolean(objVal)) {
              value = <span>{ getI18nionnary.planCodes.infos[label] || ''}</span>
            }
          }
          else {
            value = objVal
          }
          break
      }

      if (!value) {
        return ''
      }

      return (
        <div key={`row-plan-${label}`} className="row">
          {value}
        </div>
      )

    })
  }

  getPlanCol () {

    let validPlans = this.getPlans()

    if (!validPlans) {
      return
    }

    return validPlans.map((plan)=> {
      let key = plan.get('internalPlanUuid')

      return (
        <div key={`col-plan-${key}`} className="col col-xs-12 col-sm-12 col-md-3">
          <div className="plan-container">
            {this.getPlanRow(plan)}
          </div>
        </div>)
    })
  }

  getCouponCol () {
    return (
      <div key={`col-plan-coupon`} className="col col-xs-12 col-sm-12 col-md-3">
        <div className="plan-container">
          <div className="row">
            Coupon
          </div>
          <div className="row">
            <ModalCoupon type="redeemCoupon" closable={false} modal={false} {...this.props}/>
          </div>
        </div>
      </div>)
  }

  getFirstCol () {

    const {
      props: {
        params
      }
    } = this

    let info = getI18n(params.lang).home.plans

    let validPlans = this.getPlans()

    if (!validPlans) {
      return
    }

    return (
      <div key={`line-plan-baseline`} className={`col col-xs-12 col-sm-12 col-md-${(12 - (validPlans.size + 1) * 3)}`}>
        <h1>
          <span className="pricing-header-purple">{info.title}</span>
        </h1>
        <div className="pricing-baseline">{info.baseline}
          <Link to="/faq">{info.link}</Link>
        </div>
      </div>)
  }

  render () {
    return (
      <section className="pricing">
        <div className="row">
          {this.getFirstCol()}
          {this.getPlanCol()}
          {this.getCouponCol()}
        </div>
      </section>
    )
  }
}

PricingTable.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(PricingTable)
