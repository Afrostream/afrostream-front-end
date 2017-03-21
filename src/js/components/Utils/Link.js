import React, { PropTypes } from 'react'
import { Link as ReactLink } from 'react-router'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import URL from 'url'
import _ from 'lodash'

import {
  injectIntl
} from 'react-intl'

class Link extends React.Component {

  parseTo (to) {
    return URL.parse(to || '')
  }

  isInternal (toLocation) {
    return !toLocation.host && toLocation.href && !~toLocation.href.indexOf('mailto')
  }

  render () {
    const {to, children, intl, ...rest} = this.props
    const {locale, defaultLocale}= intl
    const toLocation = this.parseTo(to)
    const isInternal = this.isInternal(toLocation)
    const toWithLang = `${locale && locale !== defaultLocale && ('/' + locale) || ''}${toLocation.pathname}`
    if (isInternal) {
      return (<ReactLink to={toWithLang} {...rest}>{children}</ReactLink>)
    } else {
      const restOmit = _.omit(rest, ['activeClassName', 'onlyActiveOnIndex', 'intl'])
      return (<a href={toLocation.href} rel="nofollow" target="_blank" {...restOmit}>{children}</a>)
    }
  }
}

Link.contextTypes = {
  store: PropTypes.object.isRequired
}

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

export default injectIntl(Link)
