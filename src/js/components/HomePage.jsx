import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import WelcomePage from './Welcome/WelcomePage'
import BrowsePage from './Browse/BrowsePage'
import { withRouter } from 'react-router'

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
      props: {location, history, router, User, Billing}
    } = this

    const user = User.get('user')
    if (user) {
      let isCash = router.isActive('cash')
      let planCode = user.get('planCode')
      let subscriptionsStatus = user.get('subscriptionsStatus')
      let status = subscriptionsStatus ? subscriptionsStatus.get('status') : null
      if ((!planCode) && (location.pathname !== '/compte')) {
        let donePath = `${isCash ? '/cash' : ''}/select-plan`
        if (status && status !== 'active') {
          donePath = `${donePath}/none/${status}`
        }
        let validPlans = Billing.get(`common`)
        if (validPlans) {
          const mobilePlan = validPlans.find((plan)=> {
            let planUuid = plan.get('internalPlanUuid')
            return planUuid === config.netsize.internalPlanUuid
          })
          if (mobilePlan) {
            donePath = `${donePath}/${mobilePlan.get('internalPlanUuid')}/checkout`
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
        return (<BrowsePage key="browse-page"/>)
      }
    } else {
      return (<WelcomePage {...this.props} key="welcome-page"/>)
    }
  }
}


HomePage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(HomePage)
