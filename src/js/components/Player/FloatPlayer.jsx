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

import SponsorshipAddButton from '../Sponsors/SponsorshipAddButton'
import FavoritesAddButton from '../Favorites/FavoritesAddButton'
import { Billboard, CsaIcon } from '../Movies'
import ShareButton from '../Share/ShareButton'
import RateComponent from '../Recommendation/RateComponent'
import RaisedButton from 'material-ui/RaisedButton'

import { withRouter } from 'react-router'

import * as EpisodeActionCreators from '../../actions/episode'
import * as FacebookActionCreators from '../../actions/facebook'
import * as PlayerActionCreators from '../../actions/player'
import * as EventActionCreators from '../../actions/event'
import * as RecoActionCreators from '../../actions/reco'

import NextEpisode from './NextEpisode'
import RecommendationList from '../Recommendation/RecommendationList'

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

    const videoData = nextProps.Player.get('/player/data')

    if (!shallowEqual(nextProps.movieId, this.props.movieId)) {
      this.setState({
        nextAuto: true,
        numLoad: 0
      })
    }

    if (!shallowEqual(nextProps.Player.get('/player/data'), this.props.Player.get('/player/data'))) {
      if (!videoData) {
        return
      }
      this.destroyPlayer().then(() => {
        this.initPlayer(videoData)
      })
    }


    if (nextProps.location.pathname !== this.props.location.pathname) {
      if (nextProps.params.videoId) {
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
    }, () => this.player)
  }

  onTimeUpdate () {
    const {
      props: {
        User,
        params: {
          videoId
        }
      }
    } = this

    if (!config.reco.enabled) {
      return
    }

    const user = User.get('user')

    if (user && user.get('playerAutoNext') === false) {
      return
    }

    let currentTime = this.player.currentTime()
    let currentDuration = this.state.duration || this.player.duration() || 0
    if (!currentDuration) {
      return
    }
    let duration = currentDuration - config.reco.time
    //Si l'episode est trop court on attends la fin de episode et on switch au bout de 10 sec
    let time = Math.round(currentDuration - currentTime, 10)
    if (duration < 200) {
      duration = currentDuration - 1
    }
    let nextReco = currentTime >= duration
    if (nextReco !== this.state.nextReco) {
      if (time === 0 && this.state.nextAuto) {
        return this.promiseLoadNextVideo(9)
      }
      this.setState({
        nextReco: time + 9
      })
    }
  }

  getNextLink () {
    return this.player && this.player.options().controlBar.nextVideoButton && this.player.options().controlBar.nextVideoButton.link
  }

  promiseLoadNextVideo (time = 9) {
    this.player.off('timeupdate')
    clearInterval(this.promiseLoadNextTimeout)
    this.promiseLoadNextTimeout = setInterval(function () {
      let loadNextTime = time--
      this.setState({
        nextReco: loadNextTime
      })
      if (loadNextTime === 0) {
        this.loadNextVideo()
      }
    }.bind(this), 1000)
  }

  loadNextVideo () {
    const {
      props: {
        history
      }
    } = this

    if (!this.nextEpisode) return

    clearInterval(this.promiseLoadNextTimeout)
    let nextLink = this.getNextLink()
    this.backNextHandler()
    this.destroyPlayer()
    history.push(nextLink)
  }

  async getNextEpisode () {
    const {
      props: {
        Video,
        Movie,
        Season,
        Episode,
        dispatch,
        params: {
          videoId,
          movieId,
          episodeId,
          seasonId
        }
      }
    } = this

    const movieData = Movie.get(`movies/${movieId}`)
    if (!movieData) {
      return
    }
    const videoData = Video.get(`videos/${videoId}`)
    if (!videoData) {
      return
    }
    let episodeData = videoData.get('episode')
    if (!episodeData) {
      return
    }
    if (!seasonId) {
      return
    }
    let seasonData = Season.get(`seasons/${seasonId}`)
    if (!seasonData) {
      return
    }
    let nextEpisode
    let nextEpisodeId
    let episodeIndex
    let episodesList = seasonData.get('episodes')

    if (!episodesList) {
      return
    }
    episodeIndex = await episodesList.findIndex((obj) => {
      return obj.get('_id') == episodeId
    })

    nextEpisode = episodesList.get(episodeIndex + 1)
    if (nextEpisode) {
      return {
        season: seasonData,
        episode: nextEpisode
      }
    }
    //try to load next season
    let seasonList = movieData.get('seasons')
    let seasonIndex = await seasonList.findIndex((obj) => {
      return obj.get('_id') == seasonId
    })
    if (seasonIndex < 0) {
      return
    }
    let nextSeason = await seasonList.get(seasonIndex + 1)
    if (!nextSeason) {
      return
    }

    episodesList = nextSeason.get('episodes')
    if (episodesList && episodesList.size) {
      nextEpisode = episodesList.first()
      if (!nextEpisode) {
        return
      }
    }
    //Try to fetch next episode
    nextEpisodeId = nextEpisode.get('_id')
    let fetchEpisode = Episode.get(`episodes/${nextEpisodeId}`)
    if (!fetchEpisode) {
      try {
        //L'episode n'a jamais été chargé , on le fetch
        fetchEpisode = await dispatch(EpisodeActionCreators.getEpisode(nextEpisodeId)).then((result) => {
          if (!result || !result.res) {
            return null
          }
          return Immutable.fromJS(result.res.body)
        })
      } catch (err) {
        console.log('player : ', err)
      }
    }
    return {
      season: nextSeason,
      episode: fetchEpisode
    }
  }

  //TODO refactor and split method
  async getNextVideo () {
    const {
      props: {
        Movie,
        intl,
        params: {
          videoId,
          movieId
        }
      }
    } = this
    const movieData = Movie.get(`movies/${movieId}`)
    this.nextEpisode = await this.getNextEpisode()
    if (!this.nextEpisode) {
      return null
    }
    let season = this.nextEpisode.season
    let episode = this.nextEpisode.episode
    if (!episode) {
      return null
    }
    let nextVideo = episode.get('videoId') || episode.get('video').get('_id')
    let poster = extractImg({
      data: episode,
      key: 'poster',
      width: 150,
      height: 80
    })
    let link = `/${movieData.get('_id')}/${movieData.get('slug')}/${season.get('_id')}/${season.get('slug')}/${episode.get('_id')}/${episode.get('slug')}/${nextVideo}`
    return {
      link: link,
      title: episode.get('title'),
      poster
    }

  }

  async getPlayerData (videoData) {
    const {
      props: {
        OAuth, Player, User, Movie, playerId,
        intl,
        params: {movieId, videoId}
      }
    } = this

    console.log('player : Get player data')

    const user = User.get('user')
    let token = OAuth.get('token')

    let userId = user && user.get('_id')
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
    }
    if (user) {
      //KOMENT
      komentData = {
        komentBar: {
          komentToggle: {
            attributes: {
              'data-position': 'left',
              'data-intro': this.getTitle('player.koment.info')
            }
          }
        },
        koment: {
          videoId: videoData.videoId,
          open: true,
          user: (user && {
            id: user.get('_id').toString(),
            provider: config.domain.host,
            token: token && token.get('access_token'),
            avatar: user.get('picture')
          }),
        }
      }
      if (user.get('nickname')) {
        komentData.koment.user = _.merge(komentData.koment.user, {nickname: user.get('nickname')})
      }
      //L'user a choisi de ne pas afficher les comentaires par default
      komentData.koment.open = user.get('playerKoment')
    }

    await this.generateDomTag(videoOptions)
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
    let playerData = _.merge(playerConfig, videoOptions, komentData)

    try {
      let nextButton = await this.getNextVideo()
      if (nextButton) {
        playerData.controlBar = _.merge(playerData.controlBar, {
          nextVideoButton: nextButton
        })
      }

    } catch (e) {
      console.log('player : Next video error', e)
    }

    // ==== START hacks config
    let isLive = playerData.hasOwnProperty('live') && playerData.live
    const ua = detectUA()
    let browserVersion = ua.getBrowser()
    let mobileVersion = ua.getMobile()
    let canUseDrms = true

    if (ua.isIE()) {
      canUseDrms = browserVersion > 11
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

    if (ua.isFirefox()) {
      canUseDrms = browserVersion > 47
    }

    if (ua.isSafari()) {
      canUseDrms = false
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
    playerData['vtt.js'] = require('videojs-vtt.js/dist/vtt.min.js')
    // ==== END hacks config
    playerData.dashas.swf = require('afrostream-player/dist/dashas.swf')

    playerData.chromecast = _.merge(playerData.chromecast || {}, chromecastOptions)

    //Hack drm blackish
    playerData.sources = _.forEach(playerData.sources, (k) => {
      if (canUseDrms && ~k.src.indexOf('pblackish')) {
        k.src = k.src.replace(/.ism/g, '-drm.ism')
        playerData.drm = true
      }
    })

    if (user) {
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

    playerData.language = intl.locale

    //MUX QOS Initialize mux monitoring
    if (playerData.plugins && playerData.plugins.mux) {
      playerData.plugins = _.merge(playerData.plugins || {}, {
        mux: {
          data: {
            page_type: 'watchpage',
            viewer_user_id: userId, // ex: '12345'
            // Player Metadata
            player_init_time: Date.now(),

            // Video Metadata (cleared with 'videochange' event)
            video_id: videoData.videoId,
            video_title: videoSlug,
            video_variant_name: videoSlug,
            video_content_type: videoData.get('type'),
            video_language_code: intl.locale,
            video_duration: videoData.get('duration'),
            video_stream_type: isLive ? 'live' : 'on-demand',
            video_encoding_variant: '', // ex: 'Variant 1'
            video_cdn: '' // ex: 'Fastly', 'Akamai'
          }
        }
      })
    }

    return playerData
  }

  backNextHandler () {
    this.player.off('timeupdate')
    clearInterval(this.promiseLoadNextTimeout)
    this.setState({
      nextReco: false
    })
  }

  getStoredPlayer () {
    const {
      props: {
        User,
        params: {videoId}
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
      this.container = ReactDOM.findDOMNode(this.refs.container)
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
    if (playerData.scroll !== false) {
      videojs.on(window, 'scroll', ::this.requestTick)
    }
    videojs.on(window, 'resize', ::this.requestTick)
    player.on('error', ::this.triggerError)
    player.on('useractive', ::this.triggerUserActive)
    player.on('userinactive', ::this.triggerUserActive)
    player.on('firstplay', ::this.onFirstPlay)
    player.on('ended', ::this.clearTrackVideo)
    player.on('timeupdate', ::this.onTimeUpdate)
    player.on('seeked', ::this.trackVideo)
    player.on('fullscreenchange', ::this.onFullScreenHandler)
    player.on('next', ::this.loadNextVideo)

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
        this.player.off('timeupdate')
        this.player.off('seeked')
        this.player.off('error')
        this.player.off('next')
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
        dispatch, params: {videoId}, User
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
        dispatch, params: {videoId}
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

  async generateDomTag (videoData) {
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
    video.id = this.props.playerId
    video.className = 'player-container video-js vjs-fluid vjs-afrostream-skin vjs-big-play-centered'
    video.crossOrigin = true
    video.setAttribute('crossorigin', true)

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
    const target = playerData && playerData.get('target') || document.getElementById('player-container')
    const scroll = playerData && playerData.get('scroll')
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

  getNextComponent () {
    const {
      props: {
        params: {
          videoId
        }
      }
    } = this

    if (!this.state.nextReco || !config.reco.enabled || !videoId) {
      return
    }

    let nextEpisode = this.nextEpisode
    let time = this.state.nextReco
    let auto = this.state.nextAuto
    if (nextEpisode) {
      let episode = nextEpisode.episode
      return (<NextEpisode {...{episode, videoId, time, auto}} {...this.props}/>)
    }
    return (<RecommendationList {...{videoId}} {...this.props}/>)
  }

  render () {
    const {
      props: {
        Player,
        Event,
        Season,
        Movie,
        Video,
        params: {
          seasonId,
          movieId,
          videoId
        },
        data
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
    const playerData = data || Player.get('/player/data')
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
      videoDuration = videoData.get('duration') && this.formatTime(videoData.get('duration'))
      csa = movieData.get('CSA')
      //si on a les données de l'episode alors, on remplace les infos affichées
      infos = episodeData ? _.merge(episodeData.toJS() || {}, movieData.toJS() || {}) : movieData.toJS()
      if (seasonData) {
        infos.seasonNumber = seasonData.get('seasonNumber')
      }

      renderData = episodeData ? episodeData : movieData

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
      'fixed': (playerData && playerData.get('scroll') !== false) || this.props.float,
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
            <FavoritesAddButton direction="top" data={renderData} dataId={renderData.get('_id')}/>
            <ShareButton direction="top"/>
            <SponsorshipAddButton direction="top"/>
          </div>}
          {videoDuration ?
            <div className="video-infos_duration"><label>Durée : </label>{videoDuration}</div> : ''}
        </div>}
        {this.getNextComponent()}
      </div>
    )
  }
}


FloatPlayer.propTypes = {
  history: React.PropTypes.object.isRequired,
  data: PropTypes.instanceOf(Immutable.Map),
  float: PropTypes.bool,
  playerId: PropTypes.string,
  className: PropTypes.string,
}

FloatPlayer.defaultProps = {
  playerId: 'afrostream-player',
  className: '',
  float: true
}
export default withRouter(injectIntl(FloatPlayer))
