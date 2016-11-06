import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import Immutable from 'immutable'
import shallowEqual from 'react-pure-render/shallowEqual'
import { connect } from 'react-redux'
import config from '../../../../config'
import { detectUA } from './PlayerUtils'
import window from 'global/window'
import { isElementInViewPort } from '../../lib/utils'
import classSet from 'classnames'
const {featuresFlip} = config
import * as PlayerActionCreators from '../../actions/player'

if (process.env.BROWSER) {
  require('./FloatPlayer.less')
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
class FloatPlayer extends React.Component {

  state = {
    elVisible: false,
    position: {}
  }

  constructor (props) {
    super(props)
    this.player = null
  }

  initState () {
    this.playerInit = false
    this.setState({
      elVisible: false
    })
  }

  componentWillUnmount () {
    this.destroyPlayer()
    console.log('player : componentWillUnmount', this.player)
  }

  componentWillReceiveProps (nextProps) {

    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.updatePlayerPosition()
    }

    if (!shallowEqual(nextProps.data, this.props.data)) {
      const videoData = nextProps.data
      if (!videoData) {
        return
      }
      this.initState()
      this.destroyPlayer().then(()=> {
        this.initPlayer(videoData)
      })
    }

    if (!shallowEqual(nextProps.Player, this.props.Player)) {
      const videoData = nextProps.Player.get('/player/data')
      if (!videoData) {
        return
      }
      this.initState()
      this.destroyPlayer().then(()=> {
        this.initPlayer(videoData)
      })
    }
  }

  async getPlayerData (videoData) {
    const {
      props: {
        OAuth, Player, User
      }
    } = this

    console.log('player : Get player data')
    const user = User.get('user')
    let userId
    let token = OAuth.get('token')

    await this.generateDomTag(videoData)

    let videoOptions = videoData.toJS()

    let apiPlayerConfig = Player.get(`/player/config`)
    let apiPlayerConfigJs = {}
    //if (!apiPlayerConfig) throw new Error('no player config api data')
    //initialize the player
    if (apiPlayerConfig) {
      apiPlayerConfigJs = apiPlayerConfig.toJS()
    }
    let playerConfig = _.merge(_.cloneDeep(config.player), _.cloneDeep(apiPlayerConfigJs))
    //merge all configs
    let playerData = _.merge(playerConfig, videoOptions)
    // ==== START hacks config
    let isLive = playerData.hasOwnProperty('live') && playerData.live
    const ua = detectUA()
    let browserVersion = ua.getBrowser()
    let mobileVersion = ua.getMobile()

    if (ua.isIE()) {
      playerData.html5 = {
        nativeCaptions: false,
        nativeTextTracks: false
      }
      playerData.dash = _.merge(playerData.dash, _.clone(playerData.html5))
    }

    //on force dash en tech par default pour tous les browsers )
    playerData.sources = _.sortBy(playerData.sources, (k)=> {
      return k.type !== 'application/dash+xml'
    })

    if (ua.isSafari()) {
      //Fix Safari < 6.2 can't play hls
      if (browserVersion.version < 537 || (isLive && browserVersion.version === 537 )) {
        playerData.techOrder = _.sortBy(playerData.techOrder, (k) => {
          return k !== 'dashas'
        })
      }
      //Safari 8 can't play dashjs
      if (browserVersion.version >= 538 && browserVersion.version <= 600) {
        playerData.techOrder = _.sortBy(playerData.techOrder, (k)=> {
          return k !== 'html5'
        })
        playerData.sources = _.sortBy(playerData.sources, (k)=> {
          return k.type === 'application/dash+xml'
        })
      }
    }


    //Fix android live hls only
    //Fix ios hls only
    if (mobileVersion.is('iOS') || mobileVersion.match('playstation|xbox') || (mobileVersion.is('AndroidOS') && isLive)) {
      playerData.sources = _.sortBy(playerData.sources, (k)=> {
        return k.type === 'application/dash+xml'
      })
      playerData.techOrder = _.sortBy(playerData.techOrder, (k)=> {
        return k !== 'html5'
      })
    }

    //VTT flash vtt.js
    //playerData['vtt.js'] = ''
    //playerData['vtt.js'] = require('videojs-vtt.js/dist/vtt.js')
    // ==== END hacks config
    playerData.dashas.swf = require('afrostream-player/dist/dashas.swf')

    if (user) {
      userId = user.get('user_id')
      let splitUser = typeof userId === 'string' ? userId.split('|') : [userId]
      userId = _.find(splitUser, (val) => {
        return parseInt(val, 10)
      })
      if (playerData.metrics) {
        playerData.metrics.user_id = userId
      }
      //encode data to pass it into drmtoday
      if (token && playerData.drm && playerData.dash && playerData.dash.protData) {
        let protUser = window.atob(JSON.stringify({
          userId: userId,
          sessionId: token.get('access_token'),
          merchant: 'afrostream'
        }))

        let protData = {
          'com.widevine.alpha': {
            'httpRequestHeaders': {
              'dt-custom-data': protUser
            }
          },
          'com.microsoft.playready': {
            'httpRequestHeaders': {
              'http-header-CustomData': protUser
            }
          },
          'com.adobe.flashaccess': {
            'httpRequestHeaders': {
              'customData': protUser
            }
          }
        }
        playerData.dashas.protData = playerData.dash.protData = _.merge(playerData.dash.protData, protData)
      }

    }

    console.log('player : playerData', playerData)
    return playerData
  }

  async destroyPlayer () {
    const {
      props: {
        dispatch
      }
    } = this

    if (this.player) {

      console.log('player : destroy player', this.player)
      this.initState()
      //Tracking Finalise tracking video
      return await new Promise((resolve) => {
        videojs.off(window, 'scroll')
        videojs.off(window, 'resize')
        this.player.one('dispose', () => {
          this.player = null
          this.playerInit = false
          this.initState()
          console.log('player : destroyed player')
          resolve(null)
        })
        this.player.dispose()
      })
    } else {
      console.log('player : destroy player impossible')
      this.playerInit = false
      return null
    }
  }

  async initPlayer (videoData) {
    console.log('player : initPlayer')
    try {
      this.player = await this.generatePlayer(videoData)
      //On ajoute l'ecouteur au nextvideo automatique
      console.log('player : generatePlayer complete', this.player)
      this.container = ReactDOM.findDOMNode(this)
      return this.player
    } catch (err) {
      console.log('player : ', err)
      return this.playerInit = false
    }
  }

  async generatePlayer (videoData) {
    const {
      props: {}
    } = this

    if (this.playerInit) throw new Error('old player was already generate, destroy it before')

    await this.destroyPlayer()
    this.playerInit = true
    if (!videoData) throw new Error(`no video data ${videoData}`)
    let playerData = await this.getPlayerData(videoData)
    let player = await videojs('afrostream-float-player', playerData).ready(()=> {
        player.volume(player.options_.defaultVolume)
        this.requestTick(true)
      }
    )
    videojs.on(window, 'scroll', ::this.requestTick)
    videojs.on(window, 'resize', ::this.requestTick)
    this.requestTick(true)
    return player
  }

  async generateDomTag (videoData) {
    console.log('player : generate dom tag')
    let wrapper = ReactDOM.findDOMNode(this.refs.wrapper)
    let elementType = 'video'
    switch (videoData.get('type')) {
      case 'rich':
      case 'audio':
        elementType = 'audio'
        break
      default:
        break
    }
    let video = document.createElement('video')
    video.id = 'afrostream-float-player'
    video.className = `player-container video-js vjs-fluid vjs-big-play-centered`
    video.crossOrigin = true
    video.setAttribute('crossorigin', true)

    if (wrapper) {
      wrapper.appendChild(video)
    } else {
      console.log('cant set wrapper elements')
    }
    return video
  }

  /**
   * Calls rAF if it's not already
   * been done already
   */
  requestTick (force) {
    if (force !== undefined) {
      this.ticking = !force
    }
    if (!this.ticking) {
      requestAnimationFrame(::this.updatePlayerPosition)
      this.ticking = true
    }
  }

  handleClose (e) {
    const {
      props: {dispatch}
    } = this
    e.preventDefault()
    this.destroyPlayer()
    dispatch(PlayerActionCreators.killPlayer()).then(()=> {
      this.requestTick(true)
    })
  }

  updatePlayerPosition () {

    const {
      props: {Player, data, float}
    } = this

    if (!float) {
      return
    }

    const playerData = data || Player.get('/player/data')
    const target = playerData && playerData.get('target') || this.refs.container
    const elVisible = target && isElementInViewPort(target, 0.60) && this.player

    let position = elVisible && target && target.getBoundingClientRect() || {
        bottom: 0,
        left: 0
      }

    //FIXME why position 157 ?
    position.transform = `translate3d(${position.left}px, ${elVisible && ( position.bottom - window.innerHeight) || 0}px, 0)`

    this.ticking = false

    this.setState({
      position,
      elVisible
    })

  }

  render () {

    const position = {
      width: this.state.position.width,
      height: this.state.position.height,
      transform: this.state.position.transform
    }

    let closeClass = classSet({
      'close': true,
      'hide': !this.player
    })

    const classFloatPlayer = {
      'float-player': true,
      'fixed': this.props.float,
      'pinned': this.state.elVisible,
      'unpinned': !this.state.elVisible
    }

    classFloatPlayer[this.props.className] = true

    return (
      <div className={classSet(classFloatPlayer)} style={position} ref="container">
        <a className={closeClass} href="#" onClick={::this.handleClose}><i className="zmdi zmdi-hc-2x zmdi-close"/></a>
        <div ref="wrapper" className="wrapper"/>
      </div>
    )
  }
}


FloatPlayer.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map),
  float: PropTypes.bool,
  className: PropTypes.string,
}

FloatPlayer.defaultProps = {
  float: true
}
export default FloatPlayer
