import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import * as StaticActionCreators from '../../actions/static'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

@prepareRoute(async function ({store, route}) {
  await store.dispatch(StaticActionCreators.getComponentRoute(route))
})
@connect(({Static}) => ({Static}))
class StaticComponent extends React.Component {

  constructor (props) {
    super(props)
  }

  createMarkup () {
    const {props: {Static, staticRoute}} = this

    const contentObj = Static.get(staticRoute)
    let contentHtml = contentObj || ''
    return {__html: contentHtml}
  }

  render () {
    return <div dangerouslySetInnerHTML={this.createMarkup()}/>
  }
}

StaticComponent.propTypes = {
  staticRoute: React.PropTypes.string
}

export default StaticComponent
