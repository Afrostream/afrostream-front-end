import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as IntercomActionCreators from '../../actions/intercom'
import * as BillingActionCreators from '../../actions/billing'
import WelcomePage from '../Welcome/WelcomePage'
import SelectPlan from './SelectPlan'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./PaymentPage.less')
}

@prepareRoute(async function ({store, router}) {
  let isCash = router && router.isActive('cash')
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(BillingActionCreators.getInternalplans(isCash ? 'cashway' : 'common'))
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
    const {props: {User, children}} = this

    const user = User.get('user')

    if (!user) {
      return <WelcomePage {...this.props}/>
    }

    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg">
          {children ? children : <SelectPlan {...this.props}/>}
        </div>
      </div>
    )
  }
}

PaymentPage.propTypes = {
  history: React.PropTypes.object.isRequired
}

export default withRouter(PaymentPage)
