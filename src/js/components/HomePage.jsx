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
import { prepareRoute } from '../decorators'
import * as LifeActionCreators from '../actions/life'
import * as CategoryActionCreators from '../actions/category'

@connect(({User, Billing, Geo}) => ({User, Billing, Geo}))
@prepareRoute(async function ({store, params: {movieId, seasonId, episodeId}}) {
  await store.dispatch(CategoryActionCreators.getMenu())
  await store.dispatch(CategoryActionCreators.getSpots())
})
class HomePage extends React.Component {

  constructor (props) {
    super(props)
  }

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
      props: {intl, history, router, params, User, Billing}
    } = this
    const {locale, defaultLocale}= intl
    const user = User.get('user')
    if (user) {
      let isCash = router.isActive('cash')
      let subscriptionsStatus = user.get('subscriptionsStatus')
      let status = subscriptionsStatus ? subscriptionsStatus.get('status') : null
      let planCode = subscriptionsStatus && subscriptionsStatus.get('planCode') || user.get('planCode')
      let langRoute = `${locale && locale !== defaultLocale && ('/' + locale) || ''}`
      const noRedirectRoute = router.isActive(`${langRoute}/compte`) || router.isActive(`${langRoute}/life`) || router.isActive(`${langRoute}/select-plan`)
      if (!planCode && !noRedirectRoute) {
        let donePath = `${langRoute}${isCash ? '/cash' : ''}/select-plan`
        if (status && status !== 'active') {
          donePath = `${donePath}/none/${status}`
        } else {
          let validPlans = Billing.get(`internalPlans`)
          if (validPlans) {
            let firstPlan = (!params || !params.planCode) && validPlans.find((plan) => {
                let planUuid = plan.get('internalPlanUuid')
                return planUuid === config.netsize.internalPlanUuid
              })

            if (!firstPlan && config.featuresFlip.redirectAllPlans) {
              firstPlan = validPlans.first()
            }

            if (firstPlan) {
              donePath = `${donePath}/${firstPlan.get('internalPlanUuid')}/checkout`
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
