import React from 'react'
import ReactDOM from'react-dom'
import { I18n } from '../Utils'

if (process.env.BROWSER) {
  require('./NextGoBack.less')
}


class NextGoBack extends I18n {
  constructor (props, context) {
    super(props, context)
  }

  goBackHandler () {
    let component = ReactDOM.findDOMNode(this)
    if (component) {
      component.dispatchEvent(new CustomEvent('gobacknext', {bubbles: true}))
    }
  }

  render () {
    return (
      <button className="btn btn-end__video" onClick={::this.goBackHandler}>{this.getTitle('next.goBackBtn')}</button>
    )
  }
}

export default NextGoBack
