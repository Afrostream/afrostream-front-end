import React from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import config from '../../../../config'
import classNames from 'classnames'
import { prepareRoute } from '../../decorators'
import * as ModalActionCreators from '../../actions/modal'
import * as ConfigActionCreators from '../../actions/config'
import * as UserActionCreators from '../../actions/user'
import shallowEqual from 'react-pure-render/shallowEqual'

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

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.User, this.props.User)) {
      this.getSplash()
    }
  }

  hideSplash () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(UserActionCreators.setSplash(this.state.splash.get('_id')))
  }

  getSplash () {
    const {
      props: {
        dispatch,
        Config,
        User
      }
    } = this


    const user = User.get('user')
    const splashs = Config.get(`/config/splash`)

    if (!user || !splashs || !splashs.size) {
      return
    }

    let splashList = splashs.filter((splash)=> {
      return ~'screen,modal'.indexOf(splash.get('type'))
    })

    splashList = splashList.filter((splash)=> {
      const splashRole = splash.get('role')
      return !splashRole || user.get(splashRole)
    })


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
      let userHasShowedSplash = false
      if (userSplashList) {
        userHasShowedSplash = userSplashList.find((usrSplash)=> {
          return usrSplash.get('_id') === splashId
        })
      }
      return !userHasShowedSplash
    })


    if (!splash || splash === this.state.splash) {
      return
    }

    const splashType = splash.get('type')
    if (splashType === 'modal') {
      dispatch(ModalActionCreators.open({
        target: 'image',
        className: 'large',
        data: splash,
        cb: this.hideSplash.bind(this)
      }))
    }

    this.setState({
      splash
    })

  }

  renderSplash () {
    const splash = this.state.splash
    if (!splash) {
      return
    }
    let imageStyle = {backgroundImage: `url(${splash.get('src')}?crop=faces&fit=clip&w=1080&q=${config.images.quality}&fm=${config.images.type})`}

    let splashClass = {
      'splash': true,
      'splash-image': true,
      'slide-top': splash
    }

    return (
      <a href={splash.get('link')} onClick={::this.hideSplash}>
        <div className={classNames(splashClass)} key={`splash-${splash.get('_id')}`} style={imageStyle}/>
      </a>
    )
  }

  render () {
    const splash = this.state.splash
    let closeClass = classNames({
      'close': true,
      'hidden': splash
    })

    if (!splash || splash.get('type') !== 'screen') {
      return <div />
    }
    return (
      <div className="splash-screen">
        <a className={closeClass} href="#" onClick={::this.handleClose}>
          <i className="zmdi zmdi-close-circle-o zmdi-hc-2x"/>
        </a>
        {this.renderSplash()}}
      </div>
    )
  }
}

export default SplashScreen
