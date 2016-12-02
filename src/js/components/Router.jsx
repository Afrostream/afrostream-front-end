import React from 'react'
import { ReduxRouter } from 'redux-router'
import { RouterContext } from 'react-router'
import routes from '../routes'
import { applyRouterMiddleware } from 'react-router'
import useScroll from 'react-router-scroll/lib/useScroll'


class AppRouter extends React.Component {


  render () {

    // Add `scroll-bevahiour` for scroll position management
    const RoutingContext = (props) => {
      // https://github.com/taion/react-router-scroll/blob/master/src/index.js
      return useScroll().renderRouterContext(<RouterContext {...props}/>, props)
    }

    return (
      <ReduxRouter
        {...this.props}
        {...{RoutingContext}}>
        {routes}
      </ReduxRouter>
    )
  }
}

export default AppRouter
