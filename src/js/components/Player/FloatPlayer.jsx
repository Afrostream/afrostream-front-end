import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import Immutable from 'immutable'
import _ from 'lodash'
import shallowEqual from 'react-pure-render/shallowEqual'
import { connect } from 'react-redux'
import config from '../../../../config'
import { detectUA } from './PlayerUtils'
import window from 'global/window'
import { isElementInViewPort } from '../../lib/utils'
import classSet from 'classnames'
const {featuresFlip} = config
import Raven from 'raven-js'
import { slugify, extractImg } from '../../lib/utils'

import * as PlayerActionCreators from '../../actions/player'
import * as EventActionCreators from '../../actions/event'
import * as RecoActionCreators from '../../actions/reco'

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
    position: {},
    numLoad: 0
  }

  constructor (props) {
    super(props)
    this.player = null
    this.initState()
  }

  initState () {
    this.playerInit = false
    this.nextEpisode = false
    clearInterval(this.promiseLoadNextTimeout)
    this.promiseLoadNextTimeout = 0
    let numLoad = this.state.numLoad
    numLoad++
    this.state = {
      elVisible: false,
      size: {
        height: 1920,
        width: 815
      },
      position: {},
      showStartTimeAlert: false,
      numLoad: numLoad,
      nextReco: false,
      nextAuto: Boolean(numLoad % 3)
    }
  }

  componentWillUnmount () {
    this.destroyPlayer()
    console.log('player : componentWillUnmount', this.player)
  }

  componentWillReceiveProps (nextProps) {

    if (nextProps.data && (!shallowEqual(nextProps.data, this.props.data))) {
      const videoData = nextProps.data
      if (!videoData) {
        return
      }
      this.destroyPlayer().then(()=> {
        this.initPlayer(videoData)
      })
    }

    else if (!shallowEqual(nextProps.Player.get('/player/data'), this.props.Player.get('/player/data'))) {
      const videoData = nextProps.Player.get('/player/data')
      if (!videoData) {
        return
      }
      this.destroyPlayer().then(()=> {
        this.initPlayer(videoData)
      })
    }

    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.updatePlayerPosition()
    }
  }

  async getPlayerData (videoData) {
    const {
      props: {
        OAuth, Player, User, Movie,
        params:{movieId, videoId}
      }
    } = this

    console.log('player : Get player data')
    let userId
    const user = User.get('user')
    let token = OAuth.get('token')

    await this.generateDomTag(videoData)

    let videoOptions = videoData.toJS()
    //ADD MOVIE INFO
    const movie = Movie.get(`movies/${movieId}`)
    let posterImgObj = {}
    let chromecastOptions = {}

    if (movie) {
      const posterImg = extractImg({
        data: movie,
        key: 'poster',
        width: this.state.size.width,
        height: this.state.size.height
      })

      posterImgObj.poster = posterImg
      videoOptions = _.merge(videoOptions, posterImgObj)
      videoOptions.live = movie.get('live')
      //CHROMECAST
      chromecastOptions = {
        metadata: {
          title: movie.get('title'),
          subtitle: movie.get('synopsis')
        }
      }
      //KOMENT
      let komentData = {
        open: true,
        videoId,
        controlBar: {
          komentToggle: {
            attributes: {
              'data-position': 'left',
              'data-intro': 'Vous pouvez desormais commenter les video'
            }
          }
        },
        user: (user && {
          id: user.get('_id').toString(),
          provider: config.domain.host,
          token: token && token.get('access_token'),
          avatar: user.get('picture')
        }),
        languages: config.player.languages
      }

      if (user && user.get('nickname')) {
        komentData.user = _.merge(komentData.user, {nickname: user.get('nickname')})
      }

      //L'user a choisi de ne pas afficher les comentaires par default
      if (user && user.get('playerKoment')) {
        komentData.open = user.get('playerKoment')
      }

      videoOptions.komentData = komentData
      //END KOMENT
    }
    //MERGE PLAYER DATA API
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

    playerData.chromecast = _.merge(playerData.chromecast || {}, chromecastOptions)

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
      //OVERRIDE USER SETTINGS
      if (user.get('playerAudio')) {
        playerData.dash = _.merge(playerData.dash, {
          inititalMediaSettings: {
            audio: {
              lang: user.get('playerAudio')
            }
          }
        })
      }
      if (user.get('playerCaption')) {
        playerData.dash = _.merge(playerData.dash, {
          inititalMediaSettings: {
            text: {
              lang: user.get('playerCaption')
            }
          }
        })
      }

      //OVERIDE USER QUALITY

      let playerQuality = user.get('playerQuality') || 0
      const qualityList = [0, 400, 800, 1600, 3000]

      playerData.dash = _.merge(playerData.dash, {
        autoSwitch: !playerQuality,
        bolaEnabled: !playerQuality,
        initialBitrate: qualityList[playerQuality]
      })
      //Tracking
      const videoTracking = this.getStoredPlayer()
      if (videoTracking) {
        const position = videoTracking.playerPosition
        const duration = videoData.get('duration')
        //Store duration
        this.setState({
          duration: duration
        })

        if (position > 300 && position < (duration - 300)) {
          playerData.starttime = position
        }
        if (videoTracking.playerCaption) {
          playerData.dash.inititalMediaSettings.text.lang = videoTracking.playerCaption
        }
        if (videoTracking.playerAudio) {
          playerData.dash.inititalMediaSettings.audio.lang = videoTracking.playerAudio
        }
        if (videoTracking.playerAudio) {
          playerData.dash.inititalMediaSettings.video.lang = videoTracking.playerAudio
        }
      }
    }

    console.log('player : playerData', playerData)

    const videoSlug = slugify(`${videoData.get('_id')}_${videoData.get('name')}`)
    playerData.streamroot = _.merge(playerData.dash, _.clone(playerData.streamroot), {
      p2pConfig: {
        contentId: videoSlug
      }
    })

    playerData.youbora = _.merge(playerData.youbora || {}, {
      username: userId,
      media: {
        title: videoSlug,
        duration: videoData.get('duration'),
        isLive: isLive
      },
      properties: {
        content_id: videoData.get('_id'),
      }
    })

    return playerData
  }

  backNextHandler () {
    const player = this.player
    player.off('timeupdate')
    clearInterval(this.promiseLoadNextTimeout)
    this.setState({
      nextReco: false
    })
  }

  getStoredPlayer () {
    const {
      props: {
        User,
        params:{videoId}
      }
    } = this

    let stored = User.get(`video/${videoId}`)

    stored = stored && stored.toJS()

    let baseData = {
      playerAudio: null,
      playerCaption: null,
      playerBitrate: 0,
      playerPosition: 0
    }

    return _.merge(baseData, stored || {})
  }

  async initPlayer (videoData) {
    console.log('player : initPlayer')
    try {
      this.player = await this.generatePlayer(videoData)
      this.props.dispatch(PlayerActionCreators.setPlayer(this.player))
      //On ajoute l'ecouteur au nextvideo automatique
      console.log('player : generatePlayer complete', this.player)
      this.container = ReactDOM.findDOMNode(videoData.get('target'))
      if (this.container) {
        this.container.removeEventListener('gobacknext', ::this.backNextHandler)
        this.container.addEventListener('gobacknext', ::this.backNextHandler)
      }

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
    const videoTracking = this.getStoredPlayer()
    const storedCaption = videoTracking.playerCaption

    let player = await videojs('afrostream-player', playerData).ready(()=> {
        if (storedCaption) {
          let tracks = player.textTracks() // get list of tracks
          if (!tracks) {
            return
          }
          _.forEach(tracks, (track) => {
            let lang = track.language
            track.mode = lang === storedCaption ? 'showing' : 'hidden' // show this track
          })
        }

        player.volume(player.options_.defaultVolume)
        this.requestTick(true)
      }
    )

    if (featuresFlip.koment && player.tech_.el_) {
      player.koment = await koment(player.tech_.el_)
    }
    //youbora data
    if (player.youbora) {
      player.youbora(playerData.youbora)
    }

    videojs.on(window, 'scroll', ::this.requestTick)
    videojs.on(window, 'resize', ::this.requestTick)
    player.on('error', ::this.triggerError)
    player.on('useractive', ::this.triggerUserActive)
    player.on('userinactive', ::this.triggerUserActive)
    player.on('firstplay', ::this.onFirstPlay)
    player.on('ended', ::this.clearTrackVideo)
    player.on('seeked', ::this.trackVideo)
    player.on('fullscreenchange', ::this.onFullScreenHandler)

    this.requestTick(true)
    return player
  }

  async destroyPlayer () {
    const {
      props: {
        dispatch
      }
    } = this

    if (this.player) {
      console.log('player : destroy player', this.player)
      //Tracking Finalise tracking video
      this.trackVideo()
      this.initState()
      //Tracking Finalise tracking video
      return await new Promise((resolve) => {
        dispatch(EventActionCreators.userActive(true))
        videojs.off(window, 'scroll')
        videojs.off(window, 'resize')
        this.player.off('fullscreenchange')
        this.player.off('firstplay')
        this.player.off('useractive')
        this.player.off('userinactive')
        this.player.off('ended')
        this.player.off('seeked')
        this.player.off('error')
        this.player.one('dispose', () => {
          this.player = null
          this.playerInit = false
          console.log('player : destroyed player')
          //dispatch(PlayerActionCreators.killPlayer()).then(()=> {
          this.requestTick(true)
          resolve(null)
          //})
        })
        if (this.container) {
          this.container.removeEventListener('gobacknext', ::this.backNextHandler)
        }
        this.player.dispose()
      })
    } else {
      console.log('player : destroy player impossible')
      this.playerInit = false
      return null
    }
  }

  /**
   * Start track video on start
   */
  onFirstPlay () {
    this.trackVideo()
  }

  onFullScreenHandler () {
    const {
      props: {
        dispatch
      }
    } = this

    let isFullScreen = this.player.isFullscreen()
    dispatch(PlayerActionCreators.setFullScreen(isFullScreen))
  }

  triggerUserActive () {
    const {
      props: {
        dispatch
      }
    } = this

    const player = this.player
    dispatch(EventActionCreators.userActive(player ? (player.paused() || player.userActive()) : true))
  }

  triggerError (e) {
    if (Raven && Raven.isSetup()) {
      // Send the report.
      Raven.captureException(e, {
        extra: {
          error: this.player.error(),
          cache: this.player.getCache()
        }
      })
    }
  }

  /**
   * Stop track video on ended
   */
  clearTrackVideo () {
    this.trackVideo()
    clearTimeout(this.trackTimeout)
  }


  /**
   * Track User video playing
   */
  trackVideo () {
    const {
      props: {
        dispatch, params:{videoId}
      }
    } = this

    clearTimeout(this.trackTimeout)

    const player = this.player
    if (!player || !videoId) {
      return
    }
    const playerAudio = this.getPlayerTracks('audio')
    const playerCaption = this.getPlayerTracks('caption')
    const playerBitrate = this.getPlayerTracks('video')
    const playerPosition = parseInt(player.currentTime(), 10)

    let data = {
      playerAudio: playerAudio,
      playerCaption: playerCaption,
      playerBitrate: playerBitrate,
      playerPosition: playerPosition
    }
    //player.youbora.plugin.data.media.bitrate = playerBitrate
    dispatch(RecoActionCreators.trackVideo(data, videoId))
    this.trackTimeout = setTimeout(::this.trackVideo, 60000)
  }

  getPlayerTracks (type) {
    const player = this.player
    let tracks = []
    let audioIndex = player.tech['featuresAudioIndex']
    let metrics = player.getPlaybackStatistics()
    let bitrateIndex = metrics.video.bitrateIndex || player.tech['featuresBitrateIndex']
    let key
    switch (type) {
      case 'caption' :
        tracks = player.textTracks() || []
        key = 'language'
        break
      case 'audio' :
        tracks = player.audioTracks() || []
        key = 'lang'
        break
      case 'video' :
        tracks = player.videoTracks() || []
        key = 'bitrate'
        break
    }
    const selectedTrack = _.find(tracks, (track)=> {
      switch (type) {
        case 'caption' :
          return track.mode === 'showing'
          break
        case 'audio' :
          return track.index === audioIndex
          break
        case 'video' :
          return track.qualityIndex === bitrateIndex
          break
      }
    })

    if (!selectedTrack && type === 'video') {
      return metrics.video.bandwidth
    }

    return selectedTrack ? selectedTrack[key] : null
  }

  async generateDomTag (videoData) {
    console.log('player : generate dom tag')
    const ua = detectUA()
    const mobileVersion = ua.getMobile()
    const videoTracking = this.getStoredPlayer()
    const storedCaption = videoTracking.playerCaption
    let excludeSafari = (!ua.isSafari() || (ua.isSafari() && ua.getBrowser().version === 537))
    let excludeBrowser = excludeSafari
    let captions = excludeBrowser && videoData.get('captions')
    let hasSubtiles = captions ? captions.size : false

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
    video.id = 'afrostream-player'
    video.className = 'player-container video-js vjs-fluid vjs-afrostream-skin vjs-big-play-centered'
    //video.className = `player-container video-js vjs-fluid vjs-big-play-centered`
    video.crossOrigin = true
    video.setAttribute('crossorigin', true)

    if (videoData.komentData) {
      try {
        video.setAttribute('data-setup', JSON.stringify(videoData.komentData))
      } catch (e) {
        console.log('parse koment json error', e)
      }
    }

    if (hasSubtiles) {
      captions.map((caption) => {
        let track = document.createElement('track')
        track.setAttribute('kind', 'captions')
        track.setAttribute('src', caption.get('src'))
        track.setAttribute('id', caption.get('_id'))
        let lang = caption.get('lang')
        if (lang) {
          track.setAttribute('srclang', lang.get('ISO6392T'))
          track.setAttribute('label', lang.get('label'))
        }
        let isDefault = false
        if (lang.get('ISO6392T') === storedCaption) {
          isDefault = true
          track.setAttribute('default', isDefault)
        }
        track.setAttribute('mode', isDefault ? 'showing' : 'hidden')
        video.appendChild(track)
      })
    }

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
    const elVisible = this.player && target && isElementInViewPort(target, 0.60)

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
      'hidden': !this.player,
      'float-player': true,
      'fixed': this.props.float,
      'pinned': this.state.elVisible,
      'unpinned': !this.state.elVisible
    }

    classFloatPlayer[this.props.className] = true

    if (!this.props.float) {
      return <div ref="wrapper" className="wrapper"/>
    }

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
  className: '',
  float: true
}
export default FloatPlayer
