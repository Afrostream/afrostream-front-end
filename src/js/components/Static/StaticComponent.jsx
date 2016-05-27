import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import * as StaticActionCreators from '../../actions/static'

@prepareRoute(async function ({store, route}) {
  await store.dispatch(StaticActionCreators.getComponentRoute(route))
})
@connect(({Static}) => ({Static}))
class StaticComponent extends React.Component {

  constructor (props) {
    super(props)
  }

  createMarkup () {
    const {props: {Static, route}} = this

    const contentObj = Static.get(route)
    let contentHtml = contentObj || ''
    return {__html: contentHtml}
  }

  render () {
    return (
      <div dangerouslySetInnerHTML={this.createMarkup()}/>
    )
  }
}

StaticComponent.propTypes = {
  route: React.PropTypes.string.isRequired
}

export default StaticComponent
