import React from 'react'
import ReactDOM from'react-dom'
import { getI18n } from '../../../../config/i18n'

if (process.env.BROWSER) {
  require('./NextGoBack.less')
}


class NextGoBack extends React.Component {
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
      <button className="btn btn-end__video" onClick={::this.goBackHandler}>{getI18n().next.goBackBtn}</button>
    )
  }
}

export default NextGoBack
