import React, { PropTypes } from 'react'
import {
  intlShape,
} from 'react-intl'


export default function I18n(I18nComponent) {
  return class I18nDecorated extends React.Component {

    getI18nValue (key = 'title', values = {}) {
      const {props:{intl}} =this
      if (!intl) {
        return key
      }
      let keyType = this.getI18n()
      const keyI18n = `${keyType && keyType + '.'}${key}`
      const hasI18n = intl.messages[keyI18n]
      return hasI18n && intl.formatMessage({id: keyI18n}, values) || key
    }

    render() {
      return (
        <I18nComponent getI18nValue={this.getI18nValue} {...this.props}/>
      )
    }
  }
}
