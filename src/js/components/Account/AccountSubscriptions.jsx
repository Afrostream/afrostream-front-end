import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import { Link, I18n } from '../Utils'
import { formatPrice } from '../../lib/utils'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import LinearProgress from 'material-ui/LinearProgress'
import RaisedButton from 'material-ui/RaisedButton'
import Q from 'q'
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl'
import * as BillingActionCreators from '../../actions/billing'
import * as ModalActionCreators from '../../actions/modal'

if (process.env.BROWSER) {
  require('./AccountSubscriptions.less')
}
const style = {
  margin: 20
}

@connect(({User, Billing}) => ({User, Billing}))
class AccountSubscriptions extends I18n {

  async discountModal(currentSubscription) {
    const {
      props: {
        User,
        history,
        dispatch
      }
    } = this

    const user = User.get('user')
    const internalPlan = currentSubscription.get('internalPlan')
    const internalPlanUuid = internalPlan.get('internalPlanUuid')
    const isPlanChangeCompatible = currentSubscription && (currentSubscription.get('isPlanChangeCompatible') === 'yes')

    return await Q()
      .then(() => {
        if (!isPlanChangeCompatible) {
          throw new Error('user cant switch plan now')
        }
        return isPlanChangeCompatible
      })
      .then(() => {
        return dispatch(BillingActionCreators.getConfig())
      })
      .then(({
               res: {
                 body: {
                   response: {config}
                 }
               }
             }) => {
        return _.find(config.planChangeProposalsOnCancel.internalPlans, (switchPlan) => {
          return switchPlan.fromInternalPlanUuid === internalPlanUuid
        })
      })
      .then((switchPlan) => {
        if (!switchPlan) {
          throw new Error('cant switch plan for the moment')
        }
        const {toInternalPlanUuid} = switchPlan
        return dispatch(BillingActionCreators.getInternalplans({internalPlanUuid: toInternalPlanUuid}))
      })
      .then(({res: {body}}) => {
        if (!body || !body.length) {
          throw new Error('switch plan not compatible')
        }

        const plan = _.first(body)
        if (!plan) {
          throw new Error('switch plan not compatible')
        }

        const format = {
          switchPrice: formatPrice(plan.amountInCents, plan.currency, true),
          switchTime: this.getTitle(`account.billing.periods.${plan.periodUnit}`),
          originalPrice: formatPrice(internalPlan.get('amountInCents'), internalPlan.get('currency'), true),
          originalTime: this.getTitle(`account.billing.periods.${internalPlan.get('periodUnit')}`)
        }

        dispatch(ModalActionCreators.open({
          target: 'discount',
          className: 'large',
          data: {
            donePath: `/compte/cancel-subscription/${internalPlanUuid}`,
            switchPlan: plan,
            currentSubscription,
            format
          }
        }))
      }).catch(() => {
        history.push(`/compte/cancel-subscription/${internalPlanUuid}`)
      })

  }

  render() {
    const {
      props: {
        Billing,
        intl
      }
    } = this

    const subscriptionsList = Billing.get('subscriptions')

    const providerLogos = {
      'wecashup': '/images/payment/wecashup.png',
      'afr': '/images/payment/afr.png',
      'celery': '/images/payment/bank-cards-paypal.png',
      'stripe': '/images/payment/bank-cards-paypal.png',
      'recurly': '/images/payment/bank-cards-paypal.png',
      'braintree': '/images/payment/bank-cards-paypal.png',
      'gocardless': '/images/payment/virement.jpg',
      'cashway': '/images/payment/cashway-inline.png',
      'bouygues': '/images/payment/bouygues.png',
      'netsize': '/images/payment/netsize.png',
      'orange': '/images/payment/orange.png'
    }

    if (!subscriptionsList) {
      return <div />
    }

    let currentSubscription = subscriptionsList.find((obj) => {
      return obj.get('isActive') === 'yes' && obj.get('isCancelable')
    })
    const isCancelable = currentSubscription && currentSubscription.get('isCancelable') && currentSubscription.get('subStatus') !== 'canceled'

    return (
      <div className="account-details__container col-md-12">
        <div className="panel-profil">
          <div className="pannel-header"><FormattedMessage id={ 'account.plan.header' }/></div>
          <div className="row-fluid row-profil">
            {isCancelable &&
            <RaisedButton
              onClick={(e) => this.discountModal(currentSubscription)}
              disabled={!isCancelable}
              style={style}
              label={<FormattedMessage id={ 'account.plan.cancelPlan' }/>}/>
            }
            <Table displayRowCheckbox={false} style={{padding: '0'}}>
              <TableHeader style={{border: 'none'}} adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow style={{border: 'none'}} selectable={false}>
                  <TableHeaderColumn width="15%"><FormattedMessage
                    id={ `account.billing.dateLabel`}/></TableHeaderColumn>
                  <TableHeaderColumn width="50%"><FormattedMessage
                    id={ `account.billing.decriptionLabel`}/></TableHeaderColumn>
                  <TableHeaderColumn width="20%"><FormattedMessage
                    id={ `account.billing.methodLabel`}/></TableHeaderColumn>
                  <TableHeaderColumn width="15%"><FormattedMessage
                    id={ `account.billing.statusLabel`}/></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>

                {subscriptionsList.map((subscription, i) => {

                    let subscriptionDate = moment(subscription.get('subActivatedDate') || subscription.get('creationDate')).format('L')
                    let internalPlan = subscription.get('internalPlan')
                    let providerPlan = subscription.get('provider')
                    //PERIOD
                    let period = `${internalPlan.get('periodLength')} ${intl.formatMessage({id: `account.billing.periods.${internalPlan.get('periodUnit')}`})}`
                    let now = moment()
                    let activeDate = moment(subscription.get('subPeriodStartedDate'))
                    let endDate = moment(subscription.get('subPeriodEndsDate'))
                    let percentComplete = (now - activeDate) / (endDate - activeDate) * 100
                    //PRICE
                    let currencyPlan = internalPlan.get('currency')
                    let amountInCentsExclTax = formatPrice(internalPlan.get('amountInCentsExclTax'), currencyPlan)
                    let amountInCents = formatPrice(internalPlan.get('amountInCents'), currencyPlan)
                    //PROVIDER
                    let providerName = providerPlan.get('providerName')
                    let providerLogo = providerLogos.hasOwnProperty(providerName) ? providerLogos[providerName] : ''
                    //STATUS
                    let subscriptionStatus = subscription.get('subStatus')

                    let statusLabel
                    switch (subscriptionStatus) {
                      case 'active':
                      case 'expired':
                      case 'future':
                      case 'canceled':
                        statusLabel = subscriptionStatus
                        break
                      case 'pending':
                      case 'pending_active':
                      case 'pending_canceled':
                      case 'pending_expired':
                      case 'requesting_canceled':
                      default:
                        statusLabel = 'pending'
                        break
                    }

                    return (
                      <TableRow key={`subscription-${i}-info`}>
                        <TableRowColumn scope="row" width="15%">{subscriptionDate}</TableRowColumn>
                        <TableRowColumn width="50%">
                          {internalPlan.get('description')}
                          {period}
                          <LinearProgress style={{height: '0.7em'}} mode="determinate" value={percentComplete}/>
                        </TableRowColumn>
                        <TableRowColumn width="20%"><img src={providerLogo} alt={providerName}
                                                         className="img-responsive"/></TableRowColumn>
                        <TableRowColumn width="15%"><FormattedMessage
                          id={ `account.billing.status.${statusLabel}` }/></TableRowColumn>
                      </TableRow>)
                  }
                ).toJS()}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>)
  }
}

AccountSubscriptions.propTypes = {
  dispatch: React.PropTypes.func,
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default injectIntl(AccountSubscriptions)
