import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import WelcomePage from './Welcome/WelcomePage'
import BrowsePage from './Browse/BrowsePage'
import { withRouter } from 'react-router'

@connect(({User}) => ({User}))
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
      props: {location, history, router, User}
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
        history.push(donePath)
      }
    }
  }

  render () {
    const {props: {User, children}} = this
    const pending = User.get('pending')
    const user = User.get('user')
    let isPending = Boolean(pending)
    if (user) {
      if (children) {
        return children
      }
      else {
        return (<BrowsePage key="browse-page"/>)
      }
    } else {
      return (<WelcomePage spinner={isPending} {...this.props} key="welcome-page"/>)
    }
  }
}


HomePage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(HomePage)
