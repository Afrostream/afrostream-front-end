import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import config from '../../../../config'
import classSet from 'classnames'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import shallowEqual from 'react-pure-render/shallowEqual'
import * as PlayerActionCreators from '../../actions/player'
import * as EpisodeActionCreators from '../../actions/episode'
import * as UserActionCreators from '../../actions/user'
import Spinner from '../Spinner/Spinner'
import { withRouter } from 'react-router'
import window from 'global/window'

if (process.env.BROWSER) {
  require('./PlayerComponent.less')
}

if (canUseDOM) {
  var base64 = require('js-base64').Base64
}

@connect(({Config, OAuth, Video, Movie, Season, Episode, Event, User, Player}) => ({
  Config,
  OAuth,
  Video,
  Movie,
  Event,
  Season,
  Episode,
  User,
  Player
}))
class PlayerComponent extends Component {

  constructor (props) {
    super(props)
    this.initState()
  }

  static propTypes = {
    videoId: React.PropTypes.string.isRequired,
    movieId: React.PropTypes.string.isRequired,
    seasonId: React.PropTypes.string,
    episodeId: React.PropTypes.string
  }

  initState () {
    this.state = {
      size: {
        height: 1920,
        width: 815
      }
    }
  }

  componentDidMount () {
    this.setState({
      size: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    })

  }

  componentWillUnmount () {
    const {props:{dispatch}} = this
    dispatch(PlayerActionCreators.killPlayer())
  }


  componentWillReceiveProps (nextProps) {

    const {props:{dispatch, videoId}} = this

    if (!shallowEqual(nextProps.Video, this.props.Video)) {
      dispatch(PlayerActionCreators.killPlayer()).then(() => {
        let videoData = nextProps.Video.get(`videos/${nextProps.videoId}`)
        videoData = videoData.set('type', videoData.get('type'))
        videoData = videoData.set('videoId', videoId)
        videoData = videoData.set('target', this.refs.wrapper)
        videoData = videoData.set('scroll', false)
        dispatch(PlayerActionCreators.loadPlayer({
          data: videoData
        }))
      })
    }
  }

  player () {
    const {
      props:{
        Player
      }
    }=this

    return Player.get('player')
  }

  //SPLASH BUBBLE
  hideSplash (splashId) {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(UserActionCreators.setSplash(splashId))
  }

  renderSplashs () {
    const {
      props: {
        Config,
        User
      }
    } = this


    const player = this.player()
    const user = User.get('user')
    const splashs = Config.get(`/config/splash`)


    if (!player || !user || !splashs || !splashs.size) {
      return
    }

    const splashList = splashs.filter((splash) => {
      return splash && splash.get('type') === 'bubble'
    })

    const userSplashList = user.get('splashList')

    let splash = splashList.find((spl) => {
      const splashId = spl.get('_id')
      if (userSplashList) {
        const userHasShowedSplash = userSplashList.find((usrSplash) => {
          return usrSplash.get('_id') === splashId
        })
        return !userHasShowedSplash
      }
      return true
    })

    if (!splash) {
      return
    }

    let splashClass = {
      'splash': true,
      'splash-bubble': true,
      'right': true
    }

    const inputProps = {
      onClick: e => ::this.hideSplash(splash.get('_id'))
    }

    return (
      <div className={classSet(splashClass)} key={`splash-bubble-${splash.get('_id')}`}>
        <i className="zmdi zmdi-close zmdi-hc-2x close" {...inputProps}></i>
        <div className="splash-title">
          {splash.get('title')}
        </div>
        <div className="splash-desc">
          {splash.get('description')}
        </div>
      </div>
    )
  }

  render () {
    const {
      props: {
        Video,
        videoId
      }
    } = this

    const videoData = Video.get(`videos/${videoId}`)
    if (!videoData) {
      return (<Spinner />)
    }


    return (
      <div className="player">
        <div ref="wrapper" className="wrapper" id="player-container"/>
        {this.renderSplashs()}
      </div>
    )
  }
}


PlayerComponent.propTypes = {
  history: React.PropTypes.object.isRequired
}

export default withRouter(PlayerComponent)
