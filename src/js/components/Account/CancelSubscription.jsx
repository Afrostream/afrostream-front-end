import React, { PropTypes } from 'react'
import * as BillingActionCreators from '../../actions/billing'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getI18n } from '../../../../config/i18n'
import moment from 'moment'
import PaymentImages from '../Payment/PaymentImages'
import { withRouter } from 'react-router'
import { isBoolean } from '../../lib/utils'
import RaisedButton from 'material-ui/RaisedButton'

if (process.env.BROWSER) {
  require('./CancelSubscription.less')
}

const style = {
  margin: 12
}

@connect(({Billing}) => ({Billing}))
class CancelSubscription extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pending: false
    }
  }

  static contextTypes = {
    history: PropTypes.object.isRequired
  }

  cancelSubscription (subscription) {

    const {
      props: {
        dispatch
      }
    } = this

    if (!subscription) {
      return
    }

    this.setState({
      pending: true
    })

    dispatch(BillingActionCreators.cancelSubscription(subscription))
      .then(()=> {
        dispatch(BillingActionCreators.getSubscriptions())
      })
      .catch((err)=> {
        this.setState({
          pending: false
        })
      })
  }

  render () {
    const {
      props: {
        Billing,
        params:{
          subscriptionBillingUuid
        }
      }
    } = this

    const subscriptionsList = Billing.get('subscriptions')

    if (!subscriptionsList) {
      return (
        <div />
      )
    }
    let currentSubscription = subscriptionsList.find((obj)=> {
      return obj.get('subscriptionBillingUuid') == subscriptionBillingUuid
    })

    let isCancelable = isBoolean(currentSubscription.get('isCancelable'))
    let subStatus = currentSubscription.get('subStatus')
    let activeSubscription = currentSubscription && subStatus !== 'canceled' && isCancelable
    let status = currentSubscription.get('status')

    if (!isCancelable) {
      status = 'unCancelable'
    }

    let header = getI18n().account.cancel.status[status]

    let endDate
    if (currentSubscription) {
      endDate = moment(currentSubscription.get('subPeriodEndsDate')).format('LLL')
    }
    let infos = getI18n().account.cancel.info.replace(/{endDate}/gm, endDate)

    const inputAttributes = {
      onClick: event => ::this.cancelSubscription(currentSubscription)
    }

    return (
      <div className="account-credit-card">
        <div className="row account-details">
          <div className="col-md-12">
            <h1>{header}</h1>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row account-details__info">
            {infos}
          </div>
        </div>
        { activeSubscription &&
        <div className="row">
          <div className="col-md-12">
            <RaisedButton {...inputAttributes} label={getI18n().account.cancel.submitBtn} secondary={true} style={style}
                          disabled={this.state.pending}/>
            <Link to="/">
              <RaisedButton label={getI18n().account.cancel.cancelBtn} style={style}
                            disabled={this.state.pending}/>
            </Link>
          </div>
        </div>
        }

        <PaymentImages catIds={[18, 17]}/>

      </div>
    )
  }
}

export default withRouter(CancelSubscription)
