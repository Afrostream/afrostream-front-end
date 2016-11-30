import React from 'react'
import { ReduxRouter } from 'redux-router'
import routes from '../routes'
import { applyRouterMiddleware } from 'react-router'
import { useScroll } from 'react-router-scroll'


class AppRouter extends React.Component {

  render () {
    return (
      <ReduxRouter
        {...this.props}
        render={applyRouterMiddleware(useScroll())}>
        {routes}
      </ReduxRouter>
    )
  }
}

export default AppRouter
