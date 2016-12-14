import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as IntercomActionCreators from '../../actions/intercom'
import * as BillingActionCreators from '../../actions/billing'
import SelectPlan from './SelectPlan'
import InternalPlansCountDown from '../CountDown/InternalPlansCountDown'

import { withRouter } from 'react-router'
import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./PaymentPage.less')
}

@prepareRoute(async function ({store, location, router, params:{planCode}}) {
  let {query} = location
  let isCash = router && router.isActive('cash')
  let contextBillingUuid = isCash ? 'cashway' : (query && query.contextBillingUuid || 'common')
  let country = query && query.contextCountry
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(BillingActionCreators.getInternalplans({internalPlanUuid: planCode, contextBillingUuid, country}))
  ])
})
@connect(({Intercom, User}) => ({Intercom, User}))
class PaymentPage extends React.Component {

  componentDidMount () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(IntercomActionCreators.createIntercom())
  }

  componentWillUnmount () {
    const {
      props: {
        dispatch
      }
    } = this
    dispatch(IntercomActionCreators.removeIntercom())
  }

  render () {
    const {props: {children}} = this

    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg content-padding payment-page">
          {!children && <InternalPlansCountDown />}
          {children ? children : <SelectPlan {...this.props}/>}
        </div>
      </div>
    )
  }
}

PaymentPage.propTypes = {
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default withRouter(injectIntl(PaymentPage))
