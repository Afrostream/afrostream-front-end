import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../../config'
import * as ModalActionCreators from '../../actions/modal'
import MobileDetect from 'mobile-detect'

if (process.env.BROWSER) {
  require('./LoginPage.less')
}

@connect(({User}) => ({User}))
class LoginPage extends React.Component {

  state = {
    isMobile: false,
    size: {
      height: 1280,
      width: 500
    }
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }

  componentDidMount () {
    const {
      props: {
        dispatch, location
      }
    } = this
    let method
    let closable = false

    let isMobile = false
    if (canUseDOM) {
      const userAgent = (window.navigator && navigator.userAgent) || ''
      let agent = new MobileDetect(userAgent)
      isMobile = agent.mobile()
      this.setState({
        isMobile: isMobile,
        size: {
          height: window.innerHeight,
          width: window.innerWidth
        }
      })
    }

    switch (location.pathname) {
      case '/signup':
        method = 'showSignup'
        break
      case '/signin':
        method = 'showSignin'
        break
      case '/newsletter':
        method = 'newsletter'
        closable = true
        break
      default :
        method = 'show'
        break
    }
    dispatch(ModalActionCreators.open(method, closable))
  }

  render () {

    let imageStyle = {backgroundImage: `url(${config.metadata.shareImage}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=${this.state.size.width}&q=${config.images.quality}&fm=${config.images.type})`}


    return (
      <div className="row-fluid">
        <div className="login-page" style={imageStyle}>
          <div className="auth-container">
            <div id="login-container">
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginPage
