import React, { Component, PropTypes } from 'react'
import ReactDOM from'react-dom'
import Immutable from 'immutable'
import _ from 'lodash'
import { connect } from 'react-redux'
import config from '../../../../config'
import classSet from 'classnames'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import Raven from 'raven-js'
import { detectUA } from './PlayerUtils'
import shallowEqual from 'react-pure-render/shallowEqual'
import * as EpisodeActionCreators from '../../actions/episode'
import * as EventActionCreators from '../../actions/event'
import * as RecoActionCreators from '../../actions/reco'
import * as FacebookActionCreators from '../../actions/facebook'
import * as UserActionCreators from '../../actions/user'
import Spinner from '../Spinner/Spinner'
import FavoritesAddButton from '../Favorites/FavoritesAddButton'
import { Billboard, CsaIcon } from '../Movies'
import NextEpisode from './NextEpisode'
import ShareButton from '../Share/ShareButton'
import RecommendationList from '../Recommendation/RecommendationList'
import RateComponent from '../Recommendation/RateComponent'
import { withRouter } from 'react-router'
import { slugify } from '../../lib/utils'
import window from 'global/window'
import RaisedButton from 'material-ui/RaisedButton'

const {featuresFlip} = config

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
    this.player = null
    this.state = {
      numLoad: 0
    }

    this.initState()
  }

  static propTypes = {
    videoId: React.PropTypes.string.isRequired,
    movieId: React.PropTypes.string.isRequired,
    seasonId: React.PropTypes.string,
    episodeId: React.PropTypes.string
  }

  initState () {
    this.playerInit = false
    this.nextEpisode = false
    clearInterval(this.promiseLoadNextTimeout)
    this.promiseLoadNextTimeout = 0
    let numLoad = this.state.numLoad
    numLoad++
    this.state = {
      size: {
        height: 1920,
        width: 815
      },
      showStartTimeAlert: false,
      fullScreen: false,
      numLoad: numLoad,
      nextReco: false,
      nextAuto: Boolean(numLoad % 3)
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

  isTourShowed () {
    let isTourShow = null

    if (canUseDOM) {
      isTourShow = parseInt(localStorage.getItem('afrTourChat'))
    }
    return isTourShow
  }

  setTourShowed () {
    if (canUseDOM) {
      localStorage.setItem('afrTourChat', 1)
    }
  }

  componentWillUnmount () {
    this.destroyPlayer()
    console.log('player : componentWillUnmount', this.player)
  }

  componentWillReceiveProps (nextProps) {

    if (!shallowEqual(nextProps.movieId, this.props.movieId)) {
      this.setState({
        nextAuto: true,
        numLoad: 0
      })
    }

    if (!shallowEqual(nextProps.Video, this.props.Video)) {
      const videoData = nextProps.Video.get(`videos/${nextProps.videoId}`)
      this.initState()
      this.destroyPlayer().then(()=> {
        this.initPlayer(videoData)
      })
    }
  }

  getType (data) {
    return data && data.get('type')
  }

  isValid (data) {
    return data && this.getType(data) !== 'error'
  }

  getLazyImageUrl (data, type = 'poster') {
    let imgData = data.get(type)
    if (!imgData) {
      return
    }

    return imgData.get('path')
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
      props: {User, videoId}
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

  getPlayerTracks (type) {
    let tracks = []
    let audioIndex = this.player.tech['featuresAudioIndex']
    let metrics = this.player.getPlaybackStatistics()
    let bitrateIndex = metrics.video.bitrateIndex || this.player.tech['featuresBitrateIndex']
    let key
    switch (type) {
      case 'caption' :
        tracks = this.player.textTracks() || []
        key = 'language'
        break
      case 'audio' :
        tracks = this.player.audioTracks() || []
        key = 'lang'
        break
      case 'video' :
        tracks = this.player.videoTracks() || []
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

  /**
   * Start track video on start
   */
  onFirstPlay () {
    this.trackVideo()
  }

  onFirstPlay () {
    const {
      props: {
        dispatch, videoId
      }
    } = this

    this.trackVideo()
    const stored = this.getStoredPlayer()
    //TRACK video
    //FIXME connect le share une fois la demande approuvée
    if (videoId && stored && stored.socialSharing) {
      dispatch(FacebookActionCreators.watchVideo({
        duration: this.player.duration()
      }))
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
      props: {dispatch, videoId}
    } = this

    clearTimeout(this.trackTimeout)
    if (!this.player) {
      return
    }
    const playerAudio = this.getPlayerTracks('audio')
    const playerCaption = this.getPlayerTracks('caption')
    const playerBitrate = this.getPlayerTracks('video')
    const playerPosition = parseInt(this.player.currentTime(), 10)

    let data = {
      playerAudio: playerAudio,
      playerCaption: playerCaption,
      playerBitrate: playerBitrate,
      playerPosition: playerPosition
    }
    //this.player.youbora.plugin.data.media.bitrate = playerBitrate
    dispatch(RecoActionCreators.trackVideo(data, videoId))
    this.trackTimeout = setTimeout(::this.trackVideo, 60000)
  }

  getNextComponent () {
    const {
      props: {
        videoId
      }
    } = this

    if (!this.state.nextReco || !config.reco.enabled) {
      return
    }
    let nextEpisode = this.nextEpisode
    let time = this.state.nextReco
    let auto = this.state.nextAuto
    if (nextEpisode) {
      let episode = nextEpisode.episode
      return (<NextEpisode {...{episode, videoId, time, auto}}/>)
    }
    return (<RecommendationList {...{videoId}}/>)
  }

  getNextLink () {
    return this.player && this.player.options().controlBar.nextVideoButton && this.player.options().controlBar.nextVideoButton.link
  }

  //TODO refactor and split method
  async getNextVideo () {
    const {
      props: {
        Movie,
        videoId,
        movieId
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
    let posterImg = this.getLazyImageUrl(episode)
    let link = `/${movieData.get('_id')}/${movieData.get('slug')}/${season.get('_id')}/${season.get('slug')}/${episode.get('_id')}/${episode.get('slug')}/${nextVideo}`
    return {
      link: link,
      title: episode.get('title'),
      poster: `${config.images.urlPrefix}${posterImg}?crop=faces&fit=min&w=150&h=80&q=60&fm=${config.images.type}`
    }

  }

  async getNextEpisode () {
    const {
      props: {
        Video,
        Movie,
        Season,
        Episode,
        videoId,
        movieId,
        episodeId,
        seasonId,
        dispatch
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
        history,
        router
      }
    } = this

    if (!this.nextEpisode) return

    clearInterval(this.promiseLoadNextTimeout)
    let nextLink = this.getNextLink()
    this.backNextHandler()
    router.push(nextLink)

  }

  onTimeUpdate () {
    const {
      props: {
        User
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

  async initPlayer (videoData) {
    console.log('player : initPlayer')
    try {
      this.player = await this.generatePlayer(videoData)
      //On ajoute l'ecouteur au nextvideo automatique
      console.log('player : generatePlayer complete', this.player)
      this.container = ReactDOM.findDOMNode(this)
      this.container.removeEventListener('gobacknext', ::this.backNextHandler)
      this.container.addEventListener('gobacknext', ::this.backNextHandler)

      return this.player
    } catch (err) {
      console.log('player : ', err)
      return this.playerInit = false
    }
  }

  handleUserActive () {
    this.player.on('userinactive', ::this.triggerUserActive)
    this.setTourShowed()
  }

  async generateDomTag (videoData, komentData) {
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
    let video = document.createElement('video')
    video.id = 'afrostream-player'
    video.className = 'player-container video-js vjs-afrostream-skin vjs-big-play-centered vjs-controls-enabled afrostream-player-dimensions'
    video.crossOrigin = true
    video.setAttribute('crossorigin', true)

    try {
      video.setAttribute('data-setup', JSON.stringify(komentData))
    } catch (e) {
      console.log('parse koment json error', e)
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

  async getPlayerData (videoData) {
    const {
      props: {
        OAuth, Player, Movie, User, movieId, videoId
      }
    } = this

    console.log('player : Get player data')
    const user = User.get('user')
    let userId
    let token = OAuth.get('token')

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

    await this.generateDomTag(videoData, komentData)

    let videoOptions = videoData.toJS()

    const movie = Movie.get(`movies/${movieId}`)
    if (!movie) {
      throw new Error('no movie data ref')
    }

    let posterImgObj = {}

    if (movie) {
      let poster = movie.get('poster')
      let posterImg = poster ? poster.get('path') : ''
      if (posterImg) {
        posterImgObj.poster = `${config.images.urlPrefix}${posterImg}?crop=faces&fit=clip&w=${this.state.size.width}&h=${this.state.size.height}&q=${config.images.quality}&fm=${config.images.type}`
        videoOptions = _.merge(videoOptions, posterImgObj)
        videoOptions.live = movie.get('live')
      }
    }
    const apiPlayerConfig = Player.get(`/player/config`)
    if (!apiPlayerConfig) throw new Error('no player config api data')
    //initialize the player
    let apiPlayerConfigJs = {}
    if (apiPlayerConfig) {
      apiPlayerConfigJs = apiPlayerConfig.toJS()
    }
    let playerConfig = _.merge(_.cloneDeep(config.player), _.cloneDeep(apiPlayerConfigJs))
    //merge all configs
    let playerData = _.merge(videoOptions, playerConfig)
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
    playerData['vtt.js'] = require('videojs-vtt.js/dist/vtt.js')
    // ==== END hacks config
    playerData.dashas.swf = require('afrostream-player/dist/dashas.swf')

    let chromecastOptions = {
      metadata: {
        title: movie.get('title'),
        subtitle: movie.get('synopsis')
      }
    }

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
        let protUser = base64.encode(JSON.stringify({
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


    const user = User.get('user')
    const splashs = Config.get(`/config/splash`)


    if (!this.player || !user || !splashs || !splashs.size) {
      return
    }

    const splashList = splashs.filter((splash)=> {
      return splash && splash.get('type') === 'bubble'
    })

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

    let splashClass = {
      'splash': true,
      'splash-bubble': true,
      'right': true
    }

    const inputProps = {
      onClick: e =>::this.hideSplash(splash.get('_id'))
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

  async generatePlayer (videoData) {
    const {
      props: {
        videoId
      }
    } = this

    if (this.playerInit) throw new Error('old player was already generate, destroy it before')

    await this.destroyPlayer()
    this.playerInit = true
    if (!videoData) throw new Error(`no video data ${videoId} ${videoData}`)
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
      }
    )
    if (featuresFlip.koment && player.tech_.el_) {
      player.koment = await koment(player.tech_.el_)
    }
    //youbora data
    if (player.youbora) {
      player.youbora(playerData.youbora)
    }


    player.on('firstplay', ::this.onFirstPlay)
    player.on('ended', ::this.clearTrackVideo)
    player.on('seeked', ::this.trackVideo)
    player.on('fullscreenchange', ::this.onFullScreenHandler)
    player.on('timeupdate', ::this.onTimeUpdate)
    player.on('useractive', ::this.triggerUserActive)
    player.on('userinactive', ::this.triggerUserActive)
    player.on('error', ::this.triggerError)
    player.on('next', ::this.loadNextVideo)

    return player
  }

  //KOMENT
  showKoment () {
    if (this.player && this.player.koment) {
      this.player.koment.toggleMenu(true)
      this.player.koment.toggleEdit(true)
    }
  }

  onFullScreenHandler () {
    let isFullScreen = this.player.isFullscreen()
    this.setState({
      fullScreen: isFullScreen
    })
  }

  triggerUserActive () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(EventActionCreators.userActive(this.player ? (this.player.paused() || this.player.userActive()) : true))
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
      this.container = ReactDOM.findDOMNode(this)
      this.container.removeEventListener('gobacknext', ::this.backNextHandler)
      //Tracking Finalise tracking video
      return await new Promise((resolve) => {
        this.player.off('firstplay')
        this.player.off('ended')
        this.player.off('seeked')
        this.player.off('fullscreenchange')
        this.player.off('timeupdate')
        this.player.off('useractive')
        this.player.off('userinactive')
        this.player.off('error')
        this.player.off('next')
        dispatch(EventActionCreators.userActive(true))
        this.player.one('dispose', () => {
          this.player = null
          this.playerInit = false
          console.log('player : destroyed player')
          resolve(null)
        })
        this.player.dispose()
      })
    } else {
      console.log('player : destroy player impossible')
      //let wrapper = ReactDOM.findDOMNode(this.refs.wrapper)
      //if (wrapper) {
      //  let unmount = ReactDOM.unmountComponentAtNode(wrapper)
      //}
      //console.log('player : wrapper unmount')
      this.playerInit = false
      return null
    }
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

  render () {
    const {
      props: {
        Event,
        Season,
        Movie,
        Video,
        seasonId,
        movieId,
        videoId
      }
    } = this

    const hiddenMode = !Event.get('userActive')

    const videoData = Video.get(`videos/${videoId}`)
    if (!videoData) {
      return (<Spinner />)
    }

    if (!this.isValid(videoData)) {
      return (<div className="player"><Billboard data={videoData}/></div>)
    }

    let movieData = Movie.get(`movies/${movieId}`)
    let episodeData = videoData.get('episode')
    let seasonData = Season.get(`seasons/${seasonId}`)
    let videoDuration = this.formatTime(videoData.get('duration'))
    let csa = movieData.get('CSA')
    //si on a les données de l'episode alors, on remplace les infos affichées
    let infos = episodeData ? _.merge(episodeData.toJS() || {}, movieData.toJS() || {}) : movieData.toJS()
    if (seasonData) {
      infos.seasonNumber = seasonData.get('seasonNumber')
    }
    let renderData = episodeData ? episodeData : movieData

    const chatMode = Event.get('showChat')

    let playerClasses = {
      'player': true,
      'player-next-reco': this.state.nextReco,
      'player-fullScreen': this.state.fullScreen,
      'chat-on': chatMode
    }

    const textLength = infos.title.length
    let titleStyle
    if (textLength < 20) {
      titleStyle = 'small'
    } else if (textLength < 70) {
      titleStyle = 'medium'
    } else if (textLength >= 70) {
      titleStyle = 'large'
    }

    let videoInfoClasses = {
      'video-infos': true,
      'video-infos-hidden': hiddenMode,
      [`video-infos-${titleStyle}`]: true
    }


    return (
      <div className={classSet(playerClasses)}>
        <div ref="wrapper" className="wrapper"/>
        <div className={classSet(videoInfoClasses)}>
          <div className="video-infos_label">Vous regardez</div>
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
          <div className="player-buttons">
            <FavoritesAddButton data={renderData} dataId={renderData.get('_id')}/>
            <ShareButton />
            <RaisedButton onClick={::this.showKoment} label="Commenter" primary={true}
                          icon={<i className="zmdi zmdi-comment-more"></i>}/>
          </div>
          {videoDuration ?
            <div className="video-infos_duration"><label>Durée : </label>{videoDuration}</div> : ''}
        </div>
        {this.getNextComponent()}
        {this.renderSplashs()}
      </div>
    )
  }
}


PlayerComponent.propTypes = {
  history: React.PropTypes.object.isRequired
}

export default withRouter(PlayerComponent)
