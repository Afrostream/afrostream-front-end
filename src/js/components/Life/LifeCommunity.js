import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import LifeUsersList from './LifeUsersList'
import { withRouter } from 'react-router'
import LifeSticky from './LifeSticky'
import SubNavigation from '../Header/SubNavigation'

if (process.env.BROWSER) {
  require('./LifeCommunity.less')
}

@prepareRoute(async function ({store}) {
  await Promise.all([
    store.dispatch(LifeActionCreators.fetchUsers({}))
  ])
})
@connect(({Life}) => ({Life}))
class LifeCommunity extends Component {

  constructor (props, context) {
    super(props, context)
  }

  render () {
    const {
      props: {children, Life}
    } = this

    if (children) {
      return children
    }

    const themesList = Life.get('communityMenu')

    return (
      <div className="life-theme life-community" style={{paddingTop:'50px'}}>
        <SubNavigation {...{themesList}} to="/life/{_id}/{slug}" streaming={true}>
          <LifeSticky {...this.props}/>
        </SubNavigation>
        <LifeUsersList {...this.props}/>
      </div>
    )
  }
}

export default withRouter(LifeCommunity)
