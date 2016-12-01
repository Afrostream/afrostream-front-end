import React, { PropTypes } from 'react'
import {
  intlShape,
} from 'react-intl'

class I18n extends React.Component {
  getI18n () {
    return ''
  }

  getTitle (key = 'title', values = {}) {
    const {props:{intl}} =this
    if (!intl) {
      return key
    }
    let keyType = this.getI18n()
    const keyI18n = `${keyType && keyType + '.'}${key}`
    const hasI18n = intl.messages[keyI18n]
    return hasI18n && intl.formatMessage({id: keyI18n}, values) || key
  }
}

I18n.propTypes = {
  intl: intlShape.isRequired
}

export default I18n
