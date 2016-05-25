import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as StaticActionCreators from '../../actions/static'
import { withRouter } from 'react-router'

@prepareRoute(async function ({store, route}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(StaticActionCreators.getStatic(route.name))
  ])
})
@connect(({Static}) => ({Static}))
class StaticRoute extends React.Component {

  renderPage () {
    const {
      props: {route, Static}
    } = this

    const data = Static.get(`static/${route.name }`)

    return {__html: data ? data.get('html') : ''}
  }

  render () {
    return (
      <div className="row-fluid" dangerouslySetInnerHTML={this.renderPage()}/>
    )
  }
}

StaticRoute.propTypes = {
  history: React.PropTypes.object.isRequired,
  route: React.PropTypes.object.isRequired,
}

export default withRouter(StaticRoute)