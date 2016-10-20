import React from 'react'
import { Link as ReactLink } from 'react-router'
import document from 'global/document'
import window from 'global/window'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

export default class Link extends React.Component {
  parseTo (to) {
    if (!canUseDOM) {
      return to
    }
    let parser = document.createElement('a')
    parser.href = to
    return parser
  }

  isInternal (toLocation) {
    if (!canUseDOM) {
      return toLocation
    }
    return window.location.host === toLocation.host
  }

  render () {
    const {to, children, ...rest} = this.props
    const toLocation = this.parseTo(to)
    const isInternal = this.isInternal(toLocation)
    if (isInternal) {
      return (<ReactLink to={toLocation.pathname} {...rest}>{children}</ReactLink>)
    } else {
      return (<a href={to} target="_blank" {...rest}>{children}</a>)
    }
  }
}
