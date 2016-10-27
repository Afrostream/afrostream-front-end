import React from 'react'
import { ReduxRouter } from 'redux-router'
import useScroll from 'react-router-scroll'
import { applyRouterMiddleware } from 'react-router'
import routes from '../routes'

class AppRouter extends React.Component {

  render () {
    return (
      <ReduxRouter {...this.props} >
        {routes}
      </ReduxRouter>
    )
  }
}

export default AppRouter
