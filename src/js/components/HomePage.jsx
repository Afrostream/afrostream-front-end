import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import WelcomePage from './Welcome/WelcomePage'
import BrowsePage from './Browse/BrowsePage'
import { withRouter } from 'react-router'
import config from '../../../config'
import {
  intlShape,
  injectIntl
} from 'react-intl'

@connect(({User, Billing}) => ({User, Billing}))
class HomePage extends React.Component {

  componentWillReceiveProps () {
    this.checkAuth()
  }

  componentWillUpdate () {
    this.checkAuth()
  }

  componentDidMount () {
    this.checkAuth()
  }

  checkAuth () {
    const {
      props: {intl, history, router, User, Billing}
    } = this
    const {locale, defaultLocale}= intl
    const user = User.get('user')
    if (user) {
      let isCash = router.isActive('cash')
      let planCode = user.get('planCode')
      let subscriptionsStatus = user.get('subscriptionsStatus')
      let status = subscriptionsStatus ? subscriptionsStatus.get('status') : null
      let langRoute = `${locale && locale !== defaultLocale && ('/' + locale) || ''}`
      const noRedirectRoute = router.isActive(`${langRoute}/compte`) || router.isActive(`${langRoute}/life`)
      if (!planCode && !noRedirectRoute) {
        let donePath = `${langRoute}${isCash ? '/cash' : ''}/select-plan`
        if (status && status !== 'active') {
          donePath = `${langRoute}/none/${status}`
        } else {
          let validPlans = Billing.get(`internalPlans`)
          if (validPlans) {
            let firstPlan = validPlans.find((plan) => {
              let planUuid = plan.get('internalPlanUuid')
              return planUuid === config.netsize.internalPlanUuid
            })

            if (!firstPlan && config.featuresFlip.redirectAllPlans) {
              firstPlan = validPlans.first()
            }

            if (firstPlan) {
              donePath = `${langRoute}/${firstPlan.get('internalPlanUuid')}/checkout`
            }
          }
        }
        history.push(donePath)
      }
    }
  }

  render () {
    const {props: {User, children}} = this
    const user = User.get('user')

    if (user) {
      if (children) {
        return children
      }
      else {
        return (<BrowsePage key="browse-page"  {...this.props}/>)
      }
    } else {
      return (<WelcomePage {...this.props} key="welcome-page"/>)
    }
  }
}


HomePage.contextTypes = {
  store: PropTypes.object.isRequired
}

HomePage.propTypes = {
  intl: intlShape.isRequired,
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(injectIntl(HomePage))
