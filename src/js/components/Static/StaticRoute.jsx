import React from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import * as StaticActionCreators from '../../actions/static'
import { withRouter } from 'react-router'
import window from 'global/window'

@prepareRoute(async function ({store, route}) {
  return await Promise.all([
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

  print () {
    window.print()
  }

  render () {
    return (
      <div className="row-fluid static-route ">
        <i className="zmdi zmdi-print zmdi-hc-4x" onClick={::this.print}></i>
        <div className="container content-padding" dangerouslySetInnerHTML={this.renderPage()}/>
      </div>
    )
  }
}

StaticRoute.propTypes = {
  history: React.PropTypes.object.isRequired,
  route: React.PropTypes.object.isRequired,
}

export default withRouter(StaticRoute)
