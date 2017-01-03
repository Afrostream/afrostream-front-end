import React from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

if (process.env.BROWSER) {
  require('./CookieMessage.less')
}

class CookieMessage extends React.Component {

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
          Afrostream utilise des cookies pour vous proposer des contenus et services
          adaptés à vos centres d'intérêts. <a href="/articles/cookies_policy.pdf"
                                               onClick={this.setCookieToken.bind(this)} target="_blank">En savoir
          plus</a>
          <button className="alert-button" onClick={::this.setCookieToken}>OK
          </button>
          <div dangerouslySetInnerHTML={{__html: '<!--googleon: all-->'}}/>
        </div>
      )
    }
  }
}

export default CookieMessage
