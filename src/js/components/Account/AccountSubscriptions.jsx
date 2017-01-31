import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from '../Utils'
import { formatPrice } from '../../lib/utils'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import LinearProgress from 'material-ui/LinearProgress'
import RaisedButton from 'material-ui/RaisedButton'
import {
  FormattedMessage,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./AccountSubscriptions.less')
}
const style = {
  margin: 20
}

@connect(({User, Billing}) => ({User, Billing}))
class AccountSubscriptions extends React.Component {

  render () {
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

    const isCancelable = currentSubscription && currentSubscription.get('isCancelable')
    const uuid = currentSubscription && currentSubscription.get('subscriptionBillingUuid')

    return (
      <div className="account-details__container col-md-12">
        <div className="panel-profil">
          <div className="pannel-header"><FormattedMessage id={ 'account.plan.header' }/></div>
          <div className="row-fluid row-profil">
            {isCancelable &&
            <Link to={`/compte/cancel-subscription/${uuid}`} disabled={!isCancelable} style={style}>
              <RaisedButton label={<FormattedMessage id={ 'account.plan.cancelPlan' }/>}/></Link>
            }
            <Table displayRowCheckbox={false} style={{padding: '0'}}>
              <TableHeader style={{border: 'none'}} adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow style={{border: 'none'}} selectable={false}>
                  <TableHeaderColumn><FormattedMessage id={ `account.billing.dateLabel`}/></TableHeaderColumn>
                  <TableHeaderColumn><FormattedMessage id={ `account.billing.decriptionLabel`}/></TableHeaderColumn>
                  <TableHeaderColumn><FormattedMessage id={ `account.billing.periodLabel`}/></TableHeaderColumn>
                  <TableHeaderColumn><FormattedMessage id={ `account.billing.methodLabel`}/></TableHeaderColumn>
                  <TableHeaderColumn><FormattedMessage id={ `account.billing.statusLabel`}/></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>

                {subscriptionsList.map((subscription, i) => {

                    let subscriptionDate = moment(subscription.get('subActivatedDate') || subscription.get('creationDate')).format('L')
                    let uuid = subscription.get('subscriptionBillingUuid')
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

                    let isCancelable = (subscription.get('subStatus') === 'canceled') || (subscription.get('isCancelable') === 'no')


                    return (
                      <TableRow key={`subscription-${i}-info`}>
                        <TableRowColumn scope="row">{subscriptionDate}</TableRowColumn>
                        <TableRowColumn>{internalPlan.get('description')}</TableRowColumn>
                        <TableRowColumn>{period}
                          <LinearProgress style={{height: '0.7em'}} mode="determinate" value={percentComplete}/>
                        </TableRowColumn>
                        <TableRowColumn><img src={providerLogo} alt={providerName}
                                             className="img-responsive"/></TableRowColumn>
                        <TableRowColumn><FormattedMessage
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

export default AccountSubscriptions
