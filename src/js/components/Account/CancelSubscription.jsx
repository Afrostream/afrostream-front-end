import React, { PropTypes } from 'react'
import * as BillingActionCreators from '../../actions/billing'
import { connect } from 'react-redux'
import { Link } from '../Utils'
import moment from 'moment'
import PaymentImages from '../Payment/PaymentImages'
import { withRouter } from 'react-router'
import { isBoolean } from '../../lib/utils'
import RaisedButton from 'material-ui/RaisedButton'
import {
  FormattedMessage,
} from 'react-intl'

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

    if (!isCancelable) {
      subStatus = 'unCancelable'
    }


    let endDate
    if (currentSubscription) {
      endDate = moment(currentSubscription.get('subPeriodEndsDate')).format('LLL')
    }

    const inputAttributes = {
      onClick: event => ::this.cancelSubscription(currentSubscription)
    }

    return (
      <div className="account-credit-card">
        <div className="row account-details">
          <div className="col-md-12">
            <FormattedMessage tagName="h1" id={`account.cancel.status.${subStatus}`}/>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row account-details__info">
            <FormattedMessage id={`account.cancel.info`} values={{endDate}}/>
          </div>
        </div>
        { activeSubscription &&
        <div className="row">
          <div className="col-md-12">
            <RaisedButton {...inputAttributes} label={<FormattedMessage id={`account.cancel.submitBtn`}/>}
                          secondary={true} style={style}
                          disabled={this.state.pending}/>
            <Link to="/">
              <RaisedButton label={<FormattedMessage id={`account.cancel.cancelBtn`}/>} style={style}
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
