import React from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../../config'

if (process.env.BROWSER) {
  require('./SplashScreen.less')
}

class SplashScreen extends React.Component {

  // do not render cookie message on server-side
  state = {
    isCookieSet: '1',
    splash: 1
  }

  componentDidMount () {
    let isCookieAccepted = this.isCookieAccepted()

    if (isCookieAccepted !== '1') {
      this.setState({splash: 0})
    }

    setTimeout(()=> {
      this.setState({splash: 1})
    }, 5000)
  }

  isCookieAccepted () {
    let isCookieAccepted = null

    if (canUseDOM) {
      isCookieAccepted = localStorage.getItem('splash')
    }
    return Boolean(parseInt(isCookieAccepted))
  }

  setCookieToken () {
    if (canUseDOM) {
      localStorage.setItem('splash', '1')
      this.setState({splash: 1})
    }
  }

  getSplash (i, splash) {
    if (!splash || this.state.splash) {
      return ''
    }
    return (
      <div className="splash" key={`splash-${i}`}>
        <h1>{splash.label}</h1>
      </div>
    )
  }

  render () {
    return (
      <div className="splash-screen">
        {config.splashs ? config.splashs.map((splash, i) => this.getSplash(i, splash)) : ''}
      </div>
    )
  }
}

export default SplashScreen
