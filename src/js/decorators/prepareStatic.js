import React, { PropTypes } from 'react'
import shallowEqual from 'react-pure-render/shallowEqual'
import * as StaticActionCreators from '../actions/static'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { connect } from 'react-redux'

export default function prepareStatic (staticRoute) {

  return DecoratedComponent => {

    @connect(({Static}) => ({Static}))
    class PrepareStaticDecorator extends React.Component {

      static staticRoute = staticRoute

      static contextTypes = {
        store: PropTypes.object.isRequired
      }

      static defaultProps = {
        isStatic: false
      }

      static propsTypes = {
        isStatic: PropTypes.bool
      }

      createMarkup () {
        const {
          context: {store}
        } = this

        const contentObj = store.getState().Static.get(staticRoute)
        let contentHtml = contentObj || ''

        console.log('createMarkup : ', contentHtml, store.getState().Static)
        return {__html: contentHtml}
      }

      render () {

        if (!this.props.isStatic && !canUseDOM) {
          return <div dangerouslySetInnerHTML={this.createMarkup()}/>
        }

        return (
          <DecoratedComponent {...this.props} />
        )
      }

      componentWillMount () {
        const {
          context: {store},
        } = this

        store.dispatch(StaticActionCreators.getComponentRoute(staticRoute))
      }

    }
  }
}
