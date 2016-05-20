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
        history: PropTypes.object.isRequired
      }

      render () {
        return (
          <DecoratedComponent {...this.props} />
        )
      }

      componentWillReceiveProps (nextProps) {
        let {
          context: {store},
          props: {params, router, routes, categoryId}
        } = this


        if (!shallowEqual(nextProps.params, params)) {
          let lang = routes && routes.length > 3 && routes[3].path
          let nextParams = nextProps.params
          nextParams.lang = lang || {}
          prepareFn({store, params: nextParams, router, categoryId})
        }
      }

      componentDidMount () {
        let {
          context: {store},
          props: {params, router, routes, categoryId}
        } = this
        let lang = routes && routes.length > 3 && routes[3].path
        let nextParams = params || {}
        nextParams.lang = lang

        prepareFn({store, params: nextParams, router, categoryId})
      }

    }
}
