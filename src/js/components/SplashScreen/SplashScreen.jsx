import React from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import ReactDOM from'react-dom'
import { connect } from 'react-redux'
import config from '../../../../config'
import classNames from 'classnames'
import { prepareRoute } from '../../decorators'
import * as ConfigActionCreators from '../../actions/config'
import * as UserActionCreators from '../../actions/user'

if (process.env.BROWSER) {
  require('./SplashScreen.less')
}

@prepareRoute(async function ({store}) {
  store.dispatch(ConfigActionCreators.getConfig('splash'))
})
@connect(({User, Config}) => ({User, Config}))
class SplashScreen extends React.Component {

  // do not render cookie message on server-side
  state = {
    splash: false
  }

  splash = null

  timeoutSplash = 0

  componentDidMount () {
    const elTarget = ReactDOM.findDOMNode(this)
    elTarget.addEventListener('mousewheel', ::this.mouseWheelHandler)
    elTarget.addEventListener('DOMMouseScroll', ::this.mouseWheelHandler)
  }

  handleClose (e) {
    e.preventDefault()
    this.mouseWheelHandler()
  }

  mouseWheelHandler () {
    clearTimeout(this.timeoutSplash)

    const elTarget = ReactDOM.findDOMNode(this)
    elTarget.removeEventListener('mousewheel')
    elTarget.removeEventListener('DOMMouseScroll')

    this.timeoutSplash = setTimeout(()=> {
      this.hideSplash()
    }, 200)
  }

  hideSplash () {
    clearTimeout(this.timeoutSplash)
    this.setState({splash: true})
    const {
      props: {
        dispatch
      }
    } = this

    if (this.splash) {
      dispatch(UserActionCreators.setSplash(this.splash.get('_id')))
      this.splash = null
    }
  }

  renderSplash () {
    const {
      props: {
        Config,
        User
      }
    } = this


    const user = User.get('user')
    const splashList = Config.get(`/config/splash`)


    if (!user || !splashList || !splashList.size) {
      return
    }


    let canSponsorshipSubscription = false
    const subscriptionsStatus = user.get('subscriptionsStatus')
    if (subscriptionsStatus) {
      const subscriptions = subscriptionsStatus.get('subscriptions')
      canSponsorshipSubscription = Boolean(subscriptions && subscriptions.filter((a) => a.get('isActive') === 'yes' && a.get('inTrial') === 'no').size)
    }
    //FIXME not all splash are blocked if user payed so add filter option in config
    if (!canSponsorshipSubscription) {
      return
    }

    const userSplashList = user.get('splashList')

    let splash = splashList.find((spl) => {
      const splashId = spl.get('_id')
      if (userSplashList) {
        const userHasShowedSplash = userSplashList.find((usrSplash)=> {
          return usrSplash.get('_id') === splashId
        })
        return !userHasShowedSplash
      }
      return true
    })


    if (!splash) {
      return
    }

    this.splash = splash

    let imageStyle = {backgroundImage: `url(${splash.get('src')}?crop=faces&fit=clip&w=1080&q=${config.images.quality}&fm=${config.images.type})`}

    let splashClass = {
      'splash': true,
      'slide-top': this.state.splash
    }

    this.timeoutSplash = setTimeout(()=> {
      this.hideSplash()
    }, 60000)

    return (
      <a href={splash.get('link')} onClick={::this.hideSplash}>
        <div className={classNames(splashClass)} key={`splash-${splash.get('_id')}`} style={imageStyle}/>
      </a>
    )
  }

  render () {

    let closeClass = classNames({
      'close': true,
      'hidden': this.state.splash || !this.splash
    })

    return (
      <div className="splash-screen">
        <a className={closeClass} href="#" onClick={::this.handleClose}><i
          className="zmdi zmdi-close-circle-o zmdi-hc-2x"></i></a>
        {this.renderSplash()}
      </div>
    )
  }
}

export default SplashScreen
