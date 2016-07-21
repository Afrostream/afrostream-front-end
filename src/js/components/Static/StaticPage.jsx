import React from 'react'
import { prepareRoute } from '../../decorators'
import * as EventActionCreators from '../../actions/event'
import StaticMenu from './StaticMenu'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./StaticPage.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true))
  ])
})
class StaticPage extends React.Component {

  render () {

    const {props: {children}} = this

    return (
      <div className="row-fluid">
        <div className="container-fluid brand-bg press-page">
          <div className="column-left fixed">
            <StaticMenu {...this.props} />
          </div>
          {children || <div />}
        </div>
      </div>
    )
  }
}

StaticPage.propTypes = {
  history: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}

export default withRouter(StaticPage)
