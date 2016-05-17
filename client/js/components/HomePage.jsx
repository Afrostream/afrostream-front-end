import React, { PropTypes }  from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../decorators'
import WelcomePage from './Welcome/WelcomePage'
import BrowsePage from './Browse/BrowsePage'
import * as CategoryActionCreators from '../actions/category'
import { withRouter } from 'react-router'

@prepareRoute(async ({store}) => {
  return await Promise.all([
    store.dispatch(CategoryActionCreators.getAllSpots()),
    store.dispatch(CategoryActionCreators.getMeaList())
  ])
})
@connect(({User, OAuth}) => ({User, OAuth}))
class HomePage extends React.Component {


  componenetDidUpdate () {
    this.checkAuth()
  }

  componentWillReceiveProps () {
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
        return (<BrowsePage {...this.props} />)
      }
    } else {
      return (<WelcomePage spinner={isPending} {...this.props} />)
    }
  }
}


HomePage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(HomePage)
