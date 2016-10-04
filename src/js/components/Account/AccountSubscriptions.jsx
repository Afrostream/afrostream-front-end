import React from 'react'
import { connect } from 'react-redux'
import { getI18n } from '../../../../config/i18n'
import moment from 'moment'
import { Link } from 'react-router'
import { formatPrice } from '../../lib/utils'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import LinearProgress from 'material-ui/LinearProgress'
import RaisedButton from 'material-ui/RaisedButton'

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
        Billing
      }
    } = this

    const subscriptionsList = Billing.get('subscriptions')

    const providerLogos = {
      'afr': '/images/payment/afr.png',
      'celery': '/images/payment/bank-cards-paypal.png',
      'stripe': '/images/payment/bank-cards-paypal.png',
      'recurly': '/images/payment/bank-cards-paypal.png',
      'braintree': '/images/payment/bank-cards-paypal.png',
      'gocardless': '/images/payment/virement.jpg',
      'cashway': '/images/payment/cashway-inline.png',
      'bouygues': '/images/payment/bouygues.png',
      'orange': '/images/payment/orange.png'
    }

    if (!subscriptionsList) {
      return <div />
    }
    let title = getI18n().account.plan.header

    let currentSubscription = subscriptionsList.find((obj)=> {
      return obj.get('isActive') === 'yes' && obj.get('isCancelable')
    })

    const isCancelable = currentSubscription && currentSubscription.get('isCancelable')
    const uuid = currentSubscription && currentSubscription.get('subscriptionBillingUuid')

    return (
      <div className="account-details__container col-md-12">
        <div className="panel-profil">
          <div className="pannel-header">{title}</div>
          <div className="row-fluid row-profil">
            {isCancelable &&
            <Link to={`/compte/cancel-subscription/${uuid}`} disabled={!isCancelable} style={style}>
              <RaisedButton label={getI18n().account.plan.cancelPlan}/></Link>
            }
            <Table displayRowCheckbox={false} style={{padding: '0'}}>
              <TableHeader style={{border: 'none'}} adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow style={{border: 'none'}} selectable={false}>
                  <TableHeaderColumn>{getI18n().account.billing.dateLabel}</TableHeaderColumn>
                  <TableHeaderColumn>{getI18n().account.billing.decriptionLabel}</TableHeaderColumn>
                  <TableHeaderColumn>{getI18n().account.billing.periodLabel}</TableHeaderColumn>
                  <TableHeaderColumn>{getI18n().account.billing.methodLabel}</TableHeaderColumn>
                  <TableHeaderColumn>{getI18n().account.billing.statusLabel}</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>

                {subscriptionsList.map((subscription, i) => {

                    let subscriptionDate = moment(subscription.get('subActivatedDate') || subscription.get('creationDate')).format('L')
                    let uuid = subscription.get('subscriptionBillingUuid')
                    let internalPlan = subscription.get('internalPlan')
                    let providerPlan = subscription.get('provider')
                    //PERIOD
                    let period = `${internalPlan.get('periodLength')} ${getI18n().account.billing.periods[internalPlan.get('periodUnit')]}`
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
                        statusLabel = getI18n().account.billing.status[subscriptionStatus]
                        break
                      case 'pending':
                      case 'pending_active':
                      case 'pending_canceled':
                      case 'pending_expired':
                      case 'requesting_canceled':
                        statusLabel = getI18n().account.billing.status['pending']
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
                        <TableRowColumn>{statusLabel}</TableRowColumn>
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
