import React from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import ReactDOM from'react-dom'
import { connect } from 'react-redux'
import config from '../../../../config'
import classNames from 'classnames'
import { isBoolean } from '../../lib/utils'

if (process.env.BROWSER) {
  require('./SplashScreen.less')
}

@connect(({User}) => ({User}))
class SplashScreen extends React.Component {

  // do not render cookie message on server-side
  state = {
    isCookieSet: '1',
    splash: 0
  }

  timeoutSplash = 0

  componentDidMount () {
    let isCookieAccepted = this.isCookieAccepted()

    if (isCookieAccepted !== '1') {
      this.setState({splash: 0})
    }

    this.timeoutSplash = setTimeout(()=> {
      this.hideSplash()
    }, 10000)

    const elTarget = ReactDOM.findDOMNode(this)
    elTarget.addEventListener('mousewheel', ::this.hideSplash, false)
    elTarget.addEventListener('DOMMouseScroll', ::this.hideSplash, false)
  }

  hideSplash () {
    clearTimeout(this.timeoutSplash)
    this.setState({splash: 1})
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
    if (!splash || isBoolean(splash.get('showed'))) {
      return
    }

    let imageStyle = {backgroundImage: `url(${splash.get('poster')}?crop=faces&fit=clip&w=1080&q=${config.images.quality}&fm=${config.images.type})`}

    let splashClass = {
      'splash': true,
      'slide-top': this.state.splash
    }

    return (
      <a href={splash.link} onClick={::this.hideSplash}>
        <div className={classNames(splashClass)} key={`splash-${i}`} style={imageStyle}>
        </div>
      </a>
    )
  }

  render () {
    const {
      props: {User}
    } = this

    const user = User.get('user')
    if (!user) {
      return <div />
    }
    const splashs = user.get('splashs')
    return (
      <div className="splash-screen">
        {splashs && splashs.map((splash, i) => this.getSplash(i, splash))}
      </div>
    )
  }
}

export default SplashScreen
