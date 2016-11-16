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
        const {
          context: {store},
          props:{route, location, params}
        } = this

        if (!shallowEqual(nextProps.route, route), !shallowEqual(nextProps.params, params)) {
          let lang = nextProps.routes && nextProps.routes.length > 3 && nextProps.routes[3].lang
          let nextParams = nextProps.params || {}
          nextParams.lang = lang
          prepareFn({
            store,
            location,
            params: nextParams,
            router: nextProps.router,
            route: nextProps.route,
            categoryId: nextProps.categoryId
          })
        }
      }

      componentDidMount () {
        const {
          context: {store},
          props: {params, location, router, routes, route, categoryId}
        } = this
        let lang = routes && routes.length > 3 && routes[3].lang
        let nextParams = params || {}
        nextParams.lang = lang

        prepareFn({store, location, params: nextParams, router, route, categoryId})
      }

    }
}
