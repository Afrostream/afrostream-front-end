import React, { PropTypes } from 'react'
import { Link as ReactLink } from 'react-router'
import document from 'global/document'
import window from 'global/window'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { withRouter } from 'react-router'

class Link extends React.Component {

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
    const {store} = this.context
    const {to, children, router, ...rest} = this.props
    const state = store.getState()
    const {intl:{locale, defaultLocale}}= state
    const lang = /*router && router.isActive(locale) && */locale
    const toLocation = this.parseTo(to)
    const isInternal = this.isInternal(toLocation)
    const toWithLang = `${lang && lang !== defaultLocale && ('/' + lang) || ''}${toLocation.pathname}`
    if (isInternal) {
      return (<ReactLink to={toWithLang} {...rest}>{children}</ReactLink>)
    } else {
      return (<a href={to} target="_blank" {...rest}>{children}</a>)
    }
  }
}

Link.contextTypes = {
  store: PropTypes.object.isRequired
}

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

export default withRouter(Link)
