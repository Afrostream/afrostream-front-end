import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import LifeUsersList from './LifeUsersList'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./LifeCommunity.less')
}

@prepareRoute(async function ({store, params:{themeId, pinId}}) {
  await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(LifeActionCreators.fetchUsers({}))
  ])

})
class LifeCommunity extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {
        children
      }
    } = this

    return (
      <div className="life-theme">
        <LifeUsersList {...this.props}/>
      </div>
    )
  }
}

export default withRouter(LifeCommunity)
