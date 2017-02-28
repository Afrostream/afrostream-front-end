import React, { PropTypes } from 'react'
import { Link } from '../Utils'
import { connect } from 'react-redux'
import PaymentImages from './PaymentImages'
import config from '../../../../config'
import _ from 'lodash'
import { formatPrice, isBoolean } from '../../lib/utils'
import { withRouter } from 'react-router'
import * as ModalActionCreators from '../../actions/modal'
import * as BillingActionCreators from '../../actions/billing'
import { I18n } from '../Utils'

if (process.env.BROWSER) {
  require('./SelectPlan.less')
}

@connect(({User, Billing, OAuth}) => ({User, Billing, OAuth}))
class SelectPlan extends I18n {

  constructor (props, context) {
    super(props, context)
  }

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
      props : {router, User, Billing}
    } = this

    let isCash = router.isActive('cash')

    let validPlans = this.getPlans()

    if (!validPlans) {
      return
    }

    let user = User.get('user')
    let coupon = Billing.get('coupon')

    return validPlans.map((plan, key) => {
      const internalPlanUuid = plan.get('internalPlanUuid')

      let objVal = plan.get(label)

      if (objVal === undefined) {
        objVal = plan.get('internalPlanOpts').get(label)
      }

      if (objVal === undefined) {
        objVal = true
      }

      //COUPON Filter availlable discount for plan with current active coupon
      if (label === 'coupon' && coupon && coupon.size) {
        const couponPlans = coupon.get('internalPlans')
        objVal = Boolean(couponPlans.find((a) => a.get('internalPlanUuid') === internalPlanUuid))
      }


      let value = ''
      switch (label) {

        case 'formule':
          value = this.getTitle(`planCodes.infos.${label}`)
          break

        case 'internalActionLabel':
          const internalPlanQuery = this.getInternalQuery()
          let buttonLabel = this.getTitle(`planCodes.action`)
          if (plan && internalPlanUuid === config.netsize.internalPlanUuid) {
            buttonLabel = this.getTitle(`planCodes.actionMobile`)
          }
          if (!user) {
            const inputSignupAction = {
              onClick: event => ::this.openModal(internalPlanUuid)
            }
            value = (<button className="btn btn-plan full-width" {...inputSignupAction}>{`${buttonLabel}`}</button>)
          } else {
            value = (<Link className="btn btn-plan full-width"
                           to={`${isCash ? '/cash' : ''}/select-plan/${plan.get('internalPlanUuid')}/checkout${internalPlanQuery}`}>{`${buttonLabel}`}</Link>)
          }

          break

        case 'price':
          let period = `/${plan.get('periodLength')} ${this.getTitle(`account.billing.periods.${plan.get('periodUnit')}`)}`
          value = (<div className="select-plan_price">
            {formatPrice(plan.get('amountInCents'), plan.get('currency'), true)}
            <span className="select-plan_period">
            {period}
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
        <div key={`col-plan-${label}-${key}`
        }
             className={
               `col col-xs-${(12 / validPlans.size)} col-sm-${(12 / validPlans.size)} col-md-2 no-padding pull-right`
             }>
          {value}
        </div>
      )
    })
  }

  getLabel (label) {
    const {
      props: {
        Billing
      }
    } = this

    let validPlans = this.getPlans()

    if (!validPlans || label === 'formule') {
      return
    }

    let labelDisplay = ''

    switch (label) {
      case 'coupon':
        const coupon = Billing.get('coupon')
        if (coupon && coupon.size) {
          const couponName = coupon.get('campaign').get('name')
          labelDisplay = this.getTitle(`planCodes.infos.${label}`, {couponName})
        }
        break
      case 'internalActionLabel':
        break
      default:
        labelDisplay = this.getTitle(`planCodes.infos.${label}`)
        break
    }

    return (
      <div key={
        `line-plan-${label}`
      } className={
        `col col-xs-12 col-sm-12 col-md-${(12 - validPlans.size * 2)}`
      }>
        {labelDisplay}
      </div>)
  }

  getFooter () {

    const {
      props: {
        dispatch
      }
    } = this

    let validPlans = this.getPlans()
    let netsizePlan
    if (validPlans) {
      netsizePlan = validPlans.filter((plan) => {
        const internalPlanUuid = plan.get('internalPlanUuid')
        return internalPlanUuid === config.netsize.internalPlanUuid
      }).first()

    }
    if (!netsizePlan) {
      return
    }

    const inputChangeAction = {
      onClick: event => {
        //get InternalPlan
        dispatch(BillingActionCreators.getInternalplans({
          reload: true,
          checkMobile: false
        }))
      }
    }

    return (<div className="row">
      <div className="col-md-12 text-center">
        <button
          className="btn btn-plan" {...inputChangeAction}>{
          `${this.getTitle(`planCodes.noMobilePlans`)}`
        }</button>
      </div>
    </div>)
  }

  getHeader () {
    let isCash = this.props.router.isActive('cash')
    let validPlans = this.getPlans()
    let periodTrialLabel = ''
    if (validPlans) {
      let trialPeriodPlan = validPlans.filter((plan) => {
        return isBoolean(plan.get('trialEnabled'))
      }).first()
      if (trialPeriodPlan) {
        const trialPeriodLength = trialPeriodPlan.get('trialPeriodLength')
        const trialPeriodUnit = this.getTitle(
          `account.billing.periods.${trialPeriodPlan.get('trialPeriodUnit')}`
        )
        periodTrialLabel = this.getTitle(
          `planCodes.freePeriodLabel`
          , {
            trialPeriodLength,
            trialPeriodUnit
          })
      }

    }

    const chooseLabel = this.getTitle(
      `planCodes.${validPlans && validPlans.size > 1 ? 'selectTitle' : 'onePlanTitle'}`
    )
    return <div
      className="choose-plan">{chooseLabel}
      {!isCash && <span className="choose-plan__bolder">{
        ` ${periodTrialLabel}`
      }</span>}
    </div>
  }

  renderCouponRow () {
    const {
      props: {
        Billing
      }
    } = this

    let coupon = Billing.get('coupon')
    if (!coupon || !coupon.size) {
      return
    }

    return (<div className="row">
      {this.getLabel('coupon')}
      {this.getPlanCol('coupon')}
    </div>)
  }

  render () {
    let plans = this.getPlans()
    let cols = [
      'formule',
      'name',
      'internalActionLabel',
      'price',
      'trialEnabled',
      'internalMaxScreens',
      'internalMobile',
      'internalUnlimited',
      'internalEngagment',
      //'internalVip',
      'internalActionLabel'
    ]

    if (!plans || !plans.size) {

      const noPlanLabel = this.getTitle(
        `planCodes.noPlans`
      )
      return (
        <div className="container-fluid plan-container">
          <div className="choose-plan">{noPlanLabel}</div>
        </div>
      )
    }

    return (
      <div className="plan-container">

        {this.getHeader()}

        <div className="select-plan">
          {_.map(cols, (value, key) =>
            <div key={
              `line-plan-${key}`
            } className=" row">
              {this.getLabel(value)}
              {this.getPlanCol(value)}
            </div>
          )}
          {this.renderCouponRow()}
        </div>

        {this.getFooter()}
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
