import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as IntercomActionCreators from '../../actions/intercom'
import * as BillingActionCreators from '../../actions/billing'
import SelectPlan from './SelectPlan'

import { withRouter } from 'react-router'
import {
  injectIntl
} from 'react-intl'
import InternalPlansCountDown from '../CountDown/InternalPlansCountDown'

if (process.env.BROWSER) {
  require('./PaymentPage.less')
}

@prepareRoute(async function ({store, location, router, params: {planCode}}) {
  let {query} = location
  let isCash = router && router.isActive('cash')
  let contextBillingUuid = isCash ? 'cashway' : (query && query.contextBillingUuid || 'common')
  let country = query && query.contextCountry
  return await Promise.all([
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

    this.checkAuth()
    dispatch(IntercomActionCreators.createIntercom())
  }

  componentWillReceiveProps () {
    this.checkAuth()
  }

  componentWillUpdate () {
    this.checkAuth()
  }

  componentWillUnmount () {
    const {
      props: {
        dispatch
      }
    } = this
    dispatch(IntercomActionCreators.removeIntercom())
  }

  checkAuth () {
    const {
      props: {intl, history, router, route, User}
    } = this
    const {locale, defaultLocale} = intl
    const user = User.get('user')
    if (user) {
      let subscriptionsStatus = user.get('subscriptionsStatus')
      let status = subscriptionsStatus ? subscriptionsStatus.get('status') : null
      let planCode = subscriptionsStatus && subscriptionsStatus.get('planCode') || user.get('planCode')
      let langRoute = `${locale && locale !== defaultLocale && ('/' + locale) || ''}`
      const noRedirectRoute = router.isActive(`${langRoute}/select-plan`) || (route && route.name === 'payment')
      if (status === 'active' && planCode && noRedirectRoute) {
        history.push(`${langRoute}/account`)
      }
    }
  }

  render () {
    const {props: {children}} = this

    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg content-padding payment-page">
          {children ? children : <SelectPlan {...this.props}/>}
          {!children && <InternalPlansCountDown bgImage={true} action=""/>}
        </div>
      </div>
    )
  }
}

PaymentPage.propTypes = {}

export default withRouter(injectIntl(PaymentPage))
