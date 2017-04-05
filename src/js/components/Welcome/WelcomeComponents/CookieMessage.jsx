import React from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { I18n } from '../../Utils'
import {
  injectIntl,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./CookieMessage.less')
}

class CookieMessage extends I18n {

  // do not render cookie message on server-side
  state = {
    isCookieSet: 'true'
  }

  componentDidMount () {
    let isCookieAccepted = this.isCookieAccepted()

    if (isCookieAccepted !== 'true') {
      this.setState({isCookieSet: 'false'})
    }
  }

  isCookieAccepted () {
    let isCookieAccepted = null

    if (canUseDOM) {
      isCookieAccepted = localStorage.getItem('afrostreamAcceptedCookies')
    }
    return isCookieAccepted
  }

  setCookieToken () {
    if (canUseDOM) {
      localStorage.setItem('afrostreamAcceptedCookies', 'true')
      this.setState({isCookieSet: 'true'})
    }
  }

  render () {

    if (this.state.isCookieSet === 'true') {

      return (<div />)

    } else {

      return (
        <div className="alert-message">
          <div dangerouslySetInnerHTML={{__html: '<!--googleoff: all-->'}}/>
          {this.getTitle('cookies.message')}
          <a href="/articles/cookies_policy.pdf"
             onClick={this.setCookieToken.bind(this)} target="_blank">{this.getTitle('cookies.link')}</a>
          <button className="alert-button" onClick={::this.setCookieToken}>OK
          </button>
          <div dangerouslySetInnerHTML={{__html: '<!--googleon: all-->'}}/>
        </div>
      )
    }
  }
}

export default injectIntl(CookieMessage)
