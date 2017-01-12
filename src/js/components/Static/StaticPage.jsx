import React from 'react'
import StaticMenu from './StaticMenu'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./StaticPage.less')
}

class StaticPage extends React.Component {

  render () {

    const {props: {children}} = this

    return (
      <div className="row-fluid brand-grey">
        <div className="container-fluid press-page">
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
