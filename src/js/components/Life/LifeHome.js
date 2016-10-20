import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import LifeTheme from './LifeTheme'
import LifeNavigation from './LifeNavigation'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./LifeHome.less')
}

@prepareRoute(async function ({store, params:{themeId, pinId}}) {
  await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(LifeActionCreators.fetchThemes(themeId)),
    store.dispatch(LifeActionCreators.fetchPins({}))
  ])

  if (pinId) {
    await store.dispatch(LifeActionCreators.fetchPin(pinId))
  }

})
class LifeHome extends Component {

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
      <div className="container-fluid no-padding life-themes brand-grey">
        <LifeNavigation />
        <div className="row-fluid no-padding brand-grey">
          {children || <LifeTheme {...this.props}/>}
        </div>
      </div>
    )
  }
}

export default withRouter(LifeHome)
