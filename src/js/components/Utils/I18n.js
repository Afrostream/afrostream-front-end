import React, { PropTypes } from 'react'
import includes from 'lodash/includes'
import {
  intlShape,
} from 'react-intl'

class I18n extends React.Component {
  getI18n () {
    return ''
  }

  _parseKeyLength(str) {
    return str.split('.').length
  }

  _getValueOrNewObject(key, row, collection){
    const keyLength = this._parseKeyLength(key)
    const rowLength = this._parseKeyLength(row)
    if ( keyLength + 1 === rowLength ) {
      return collection[row]
    } 
    return this._getObjectFromKey(row.split('.').slice(0, keyLength + 1).join('.'), collection)
  }

  _createKey(key, row) {
    const keyLength = this._parseKeyLength(key)
    return row.split('.')[keyLength]
  }

  _getObjectFromKey(key, collection) {
    return Object.keys(collection).reduce((acc, row) => {
      if (includes(row, key)) {
        return {
            ...acc,
            [this._createKey(key, row)]: this._getValueOrNewObject(key, row, collection)
        }
      }
      return acc
    }, {})
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

  getTitleAsObject (key = 'title') {
    const {props:{intl}} =this
    if (!intl) {
      return key
    }
    return this._getObjectFromKey(key, intl.messages)
  }
}

I18n.propTypes = {
  intl: intlShape.isRequired
}

export default I18n
