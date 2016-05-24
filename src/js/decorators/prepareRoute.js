import React, { PropTypes } from 'react'
import shallowEqual from 'react-pure-render/shallowEqual'

export default function prepareRoute (prepareFn) {

  return DecoratedComponent =>

    class PrepareRouteDecorator extends React.Component {

      static prepareRoute = prepareFn

      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      static propsTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired
      }

      render () {
        return (
          <DecoratedComponent {...this.props} />
        )
      }

      componentWillReceiveProps (nextProps) {
        let {
          context: {store}
        } = this

        if (!shallowEqual(nextProps, this.props)) {
          let lang = nextProps.routes && nextProps.routes.length > 3 && nextProps.routes[3].path
          let nextParams = nextProps.params || {}
          nextParams.lang = lang
          prepareFn({
            store,
            params: nextParams,
            router: nextProps.router,
            route: nextProps.route,
            categoryId: nextProps.categoryId
          })
        }
      }

      componentDidMount () {
        let {
          context: {store},
          props: {params, router, routes, route, categoryId}
        } = this
        let lang = routes && routes.length > 3 && routes[3].path
        let nextParams = params || {}
        nextParams.lang = lang

        prepareFn({store, params: nextParams, router, route, categoryId})
      }

    }
}
