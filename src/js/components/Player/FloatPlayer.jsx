import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import _ from 'lodash'
import shallowEqual from 'react-pure-render/shallowEqual'
import { connect } from 'react-redux'
import config from '../../../../config'
import { detectUA } from './PlayerUtils'
import window from 'global/window'
import { isElementInViewPort } from '../../lib/utils'
import classSet from 'classnames'
import { slugify, extractImg } from '../../lib/utils'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

import FavoritesAddButton from '../Favorites/FavoritesAddButton'
import { Billboard, CsaIcon } from '../Movies'
import ShareButton from '../Share/ShareButton'
import RateComponent from '../Recommendation/RateComponent'
import RaisedButton from 'material-ui/RaisedButton'

import { withRouter } from 'react-router'

import * as FacebookActionCreators from '../../actions/facebook'
import * as PlayerActionCreators from '../../actions/player'
import * as EventActionCreators from '../../actions/event'
import * as RecoActionCreators from '../../actions/reco'
import { I18n } from '../Utils'
import {
  injectIntl,
  FormattedMessage
} from 'react-intl'

const {featuresFlip} = config

if (process.env.BROWSER) {
  require('./FloatPlayer.less')
}

if (canUseDOM) {
  var Raven = require('raven-js')
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
class FloatPlayer extends I18n {

  state = {
    elVisible: false,
    position: {},
    numLoad: 0,
    savedData: {}
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
      elVisible: true,
      savedData: {},
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

    //if (nextProps.data && (!shallowEqual(nextProps.data, this.props.data))) {
    //  const videoData = nextProps.data
    //  if (!videoData) {
    //    return
    //  }
    //  this.destroyPlayer().then(()=> {
    //    this.initPlayer(videoData)
    //  })
    //}
    const videoData = nextProps.Player.get('/player/data')
    if (nextProps.Player.get('/player/data') !== this.props.Player.get('/player/data')) {
      if (!videoData) {
        return
      }
      this.destroyPlayer().then(() => {
        this.initPlayer(videoData)
      })
    }


    if (nextProps.location.pathname !== this.props.location.pathname) {
      if(nextProps.params.videoId) {
        this.destroyPlayer().then(() => {
          this.initPlayer(videoData)
        })
      } 
      this.updatePlayerPosition()
    }

    this.props.User.get('user') && !nextProps.User.get('user') && this.destroyPlayer()
  }


  saveVideoData () {
    return this.setState({
      savedData: {
         pathname: this.props.location.pathname,
         videoId: this.props.params.videoId
       }
    }, () => this.player )
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

    let videoOptions = videoData.toJS()
    //ADD MOVIE INFO
    const movie = Movie.get(`movies/${movieId}`)
    let posterImgObj = {}
    let chromecastOptions = {}
    let komentData = null
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
      //END KOMENT


      //KOMENT
      komentData = {
        open: true,
        videoId: videoId || videoData.videoId,
        controlBar: {
          komentToggle: {
            attributes: {
              'data-position': 'left',
              'data-intro': this.getTitle('player.koment.info')
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
    }
    await this.generateDomTag(videoOptions, komentData)
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
    playerData.sources = _.sortBy(playerData.sources, (k) => {
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
        playerData.techOrder = _.sortBy(playerData.techOrder, (k) => {
          return k !== 'html5'
        })
        playerData.sources = _.sortBy(playerData.sources, (k) => {
          return k.type === 'application/dash+xml'
        })
      }
    }


    //Fix android live hls only
    //Fix ios hls only
    if (mobileVersion.is('iOS') || mobileVersion.match('playstation|xbox') || (mobileVersion.is('AndroidOS') && isLive)) {
      playerData.sources = _.sortBy(playerData.sources, (k) => {
        return k.type === 'application/dash+xml'
      })
      playerData.techOrder = _.sortBy(playerData.techOrder, (k) => {
        return k !== 'html5'
      })
    }

    //VTT flash vtt.js
    //playerData['vtt.js'] = ''
    playerData['vtt.js'] = require('videojs-vtt.js/dist/vtt.js')
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
        let protUser = window.btoa(JSON.stringify({
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

        if (position > 10 && position < (duration - 10)) {
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
    //YOUBORA PLUGIN (metrics QOS)
    playerData.dash = _.merge(playerData.dash || {}, {
      youbora: {
        username: userId,
        media: {
          title: videoSlug,
          duration: videoData.get('duration'),
          isLive: isLive
        },
        properties: {
          content_id: videoData.get('_id'),
        }
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
      return this.saveVideoData()
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

    let player = await videojs('afrostream-player', playerData).ready(() => {
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
          setTimeout(() => {
            console.log('player : destroy player', this.player)
            this.player = null
            this.playerInit = false
            console.log('player : destroyed player')
            dispatch(PlayerActionCreators.killPlayer())
            this.requestTick(true)
            resolve(null)
          }, 0)
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
    const {
      props: {
        dispatch, params:{videoId}, User
      }
    } = this

    this.trackVideo()
    const stored = this.getStoredPlayer()
    const user = User.get('user')
    //TRACK video
    //FIXME connect le share une fois la demande approuvée
    if (videoId && stored && user && user.get('socialSharing') === true) {
      dispatch(FacebookActionCreators.watchVideo({
        duration: this.player.duration()
      }))
    }
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
    let {
      props: {
        dispatch, params:{videoId}
      }
    } = this

    clearTimeout(this.trackTimeout)

    const player = this.player
    videoId = videoId || this.state.savedData.videoId
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
    const selectedTrack = _.find(tracks, (track) => {
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

  async generateDomTag (videoData, komentData) {
    console.log('player : generate dom tag')
    const ua = detectUA()
    const videoTracking = this.getStoredPlayer()
    const storedCaption = videoTracking.playerCaption
    let excludeBrowser = !(ua.isSafari() || (ua.isSafari() && !ua.getBrowser().version === 537) || ua.isChrome())
    let captions = excludeBrowser && videoData.captions
    let hasSubtiles = captions ? captions.size : false

    let wrapper = ReactDOM.findDOMNode(this.refs.wrapper)
    let elementType = 'video'
    switch (videoData.type) {
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

    if (komentData) {
      try {
        video.setAttribute('data-setup', JSON.stringify(komentData))
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

  handleReopen () {
    const {pathname, videoId} = this.state.savedData
    this.destroyPlayer()
    this.props.history.push(pathname)
  }

  getType (data) {
    return data && data.get('type')
  }

  isValid (data) {
    return data && this.getType(data) !== 'error'
  }

  updatePlayerPosition () {

    const {
      props: {Player, data, float}
    } = this

    if (!float) {
      return
    }

    const playerData = data || Player.get('/player/data')
    const target = playerData && playerData.get('target')
    const elVisible = this.player && target && isElementInViewPort(target, 0.60)

    let position = elVisible && target && target.getBoundingClientRect() || {
        bottom: 0,
        left: 0
      }

    position.transform = `translate3d(${position.left}px, ${elVisible && ( position.bottom - window.innerHeight) || 0}px, 0)`

    this.ticking = false

    this.setState({
      position,
      elVisible
    })

  }

  formatTime (seconds) {
    if (!isFinite(seconds)) {
      return null
    }
    var h = Math.floor(((seconds / 86400) % 1) * 24),
      m = Math.floor(((seconds / 3600) % 1) * 60),
      s = Math.round(((seconds / 60) % 1) * 60) + 's', time

    time = s
    if (m) {
      time = m + 'm ' + time
    }
    if (h) {
      time = h + 'h ' + time
    }
    return ' ' + time
  }

  //KOMENT
  showKoment () {
    const player = this.player
    if (player && player.koment) {
      player.koment.toggleMenu(true)
      player.koment.toggleEdit(true)
    }
  }

  render () {
    const {
      props: {
        Player,
        Event,
        Season,
        Movie,
        Video,
        params:{
          seasonId,
          movieId,
          videoId
        }
      },
      state: {
        savedData
      }
    } = this

    const hiddenMode = !Event.get('userActive')

    const position = {
      width: this.state.position.width,
      height: this.state.position.height,
      transform: this.state.position.transform
    }

    let closeClass = classSet({
      'close': true,
      'hide': !this.player
    })

    let reopenClass = classSet({
      'reopen': true,
      'hide': this.state.elVisible || !savedData.videoId || savedData.pathname === this.props.location.pathname
    })

    const videoData = Video.get(`videos/${videoId}`)
    let movieData
    let episodeData
    let seasonData
    let videoDuration
    let csa
    let infos = {
      title: '',
      seasonNumber: 0,
      episodeNumber: 0
    }
    let renderData
    let chatMode
    let titleStyle

    if (this.isValid(videoData)) {
      //  return (<div className="player"><Billboard data={videoData}/></div>)
      movieData = Movie.get(`movies/${movieId}`)
      episodeData = videoData.get('episode')
      seasonData = Season.get(`seasons/${seasonId}`)
      videoDuration = this.formatTime(videoData.get('duration'))
      csa = movieData.get('CSA')
      //si on a les données de l'episode alors, on remplace les infos affichées
      infos = episodeData ? _.merge(episodeData.toJS() || {}, movieData.toJS() || {}) : movieData.toJS()
      if (seasonData) {
        infos.seasonNumber = seasonData.get('seasonNumber')
      }

      renderData = episodeData ? episodeData : movieData

      chatMode = Event.get('showChat')

      const textLength = infos.title.length

      if (textLength < 20) {
        titleStyle = 'small'
      } else if (textLength < 70) {
        titleStyle = 'medium'
      } else if (textLength >= 70) {
        titleStyle = 'large'
      }

    }

    const videoInfoClasses = {
      'video-infos': true,
      'video-infos-hidden': hiddenMode,
      [`video-infos-${titleStyle}`]: true
    }

    const classFloatPlayer = {
      'hidden': !this.player,
      'player': videoData,
      'float-player': true,
      'fixed': this.props.float,
      'pinned': this.state.elVisible,
      'unpinned': !this.state.elVisible,
      'player-next-reco': this.state.nextReco,
      'player-fullScreen': this.player && this.player.isFullscreen()
    }

    classFloatPlayer[this.props.className] = true

    if (!this.props.float) {
      return <div ref="wrapper" className="wrapper"/>
    }

    return (
      <div className={classSet(classFloatPlayer)} style={position} ref="container">
        <a className={closeClass} href="#" onClick={::this.handleClose}><i className="zmdi zmdi-hc-2x zmdi-close"/></a>
        <a className={reopenClass} href="#" onClick={::this.handleReopen}><i
          className="zmdi zmdi-hc-2x zmdi-open-in-new"/></a>
        <div ref="wrapper" className="wrapper"/>
        {videoData && <div className={classSet(videoInfoClasses)}>
          <div className="video-infos_label"><FormattedMessage id="player.watch"/></div>
          <div className="video-infos_title">{infos.title}
            {<CsaIcon {...{csa}}/>}
          </div>
          <div>
            {infos.seasonNumber ?
              <label className="tag video-infos_episode">{`Saison ${infos.seasonNumber}`}</label> : ''}
            {infos.episodeNumber ?
              <label className="tag video-infos_episode">{`Épisode ${infos.episodeNumber}`}</label> : ''}
          </div>
          {<RateComponent {...{videoId}}/>}
          {renderData && <div className="player-buttons">
            <FavoritesAddButton direction="right" data={renderData} dataId={renderData.get('_id')}/>
            <ShareButton direction="right"/>
            <RaisedButton onClick={::this.showKoment}
                          label={
                            <FormattedMessage id="comment.label"/>
                          }
                          primary={true}
                          icon={<i className="zmdi zmdi-comment-more"></i>}/>
          </div>}
          {videoDuration ?
            <div className="video-infos_duration"><label>Durée : </label>{videoDuration}</div> : ''}
        </div>}
      </div>
    )
  }
}


FloatPlayer.propTypes = {
  history: React.PropTypes.object.isRequired,
  data: PropTypes.instanceOf(Immutable.Map),
  float: PropTypes.bool,
  className: PropTypes.string,
}

FloatPlayer.defaultProps = {
  className: '',
  float: true
}
export default withRouter(injectIntl(FloatPlayer))
