import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import _ from 'lodash'
import { connect } from 'react-redux'
import config from '../../../../config'
import classSet from 'classnames'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import shallowEqual from 'react-pure-render/shallowEqual'
import * as PlayerActionCreators from '../../actions/player'
import * as EpisodeActionCreators from '../../actions/episode'
import * as UserActionCreators from '../../actions/user'
import Spinner from '../Spinner/Spinner'
import FavoritesAddButton from '../Favorites/FavoritesAddButton'
import { Billboard, CsaIcon } from '../Movies'
import NextEpisode from './NextEpisode'
import ShareButton from '../Share/ShareButton'
import RecommendationList from '../Recommendation/RecommendationList'
import RateComponent from '../Recommendation/RateComponent'
import { withRouter } from 'react-router'
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

  //componentDidUpdate () {
  //  const {props:{dispatch, videoId}} = this
  //  if (this.videoData) {
  //    this.videoData = this.videoData.set('target', this.refs.wrapper)
  //    this.videoData = this.videoData.set('videoId', videoId)
  //    dispatch(PlayerActionCreators.loadPlayer({
  //      data: this.videoData
  //    }))
  //    this.videoData = null;
  //  }
  //}

  componentWillReceiveProps (nextProps) {

    const {props:{dispatch, videoId}} = this

    if (!shallowEqual(nextProps.movieId, this.props.movieId)) {
      this.setState({
        nextAuto: true,
        numLoad: 0
      })
    }

    if (!shallowEqual(nextProps.Video, this.props.Video)) {
      let videoData = nextProps.Video.get(`videos/${nextProps.videoId}`)
      dispatch(PlayerActionCreators.killPlayer()).then(()=> {
        videoData = videoData.set('target', this.refs.wrapper)
        videoData = videoData.set('videoId', videoId)
        dispatch(PlayerActionCreators.loadPlayer({
          data: videoData
        }))
        //this.initState()
      })
    }

    //
    //if (!shallowEqual(nextProps.Video, this.props.Video)) {
    //  const videoData = nextProps.Video.get(`videos/${nextProps.videoId}`)
    //  this.initState()
    //  this.destroyPlayer().then(()=> {
    //    this.initPlayer(videoData)
    //  })
    //}
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
    const player = this.player()
    player.off('timeupdate')
    clearInterval(this.promiseLoadNextTimeout)
    this.setState({
      nextReco: false
    })
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
    const player = this.player()
    return player && player.options().controlBar.nextVideoButton && player.options().controlBar.nextVideoButton.link
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
    const player = this.player()
    player.off('timeupdate')
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
    const player = this.player()
    let currentTime = player.currentTime()
    let currentDuration = this.state.duration || player.duration() || 0
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


  //KOMENT
  showKoment () {
    const player = this.player()
    if (player && player.koment) {
      player.koment.toggleMenu(true)
      player.koment.toggleEdit(true)
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
        Player,
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
      'player-fullScreen': Player.get(`/player/fullscreen`),
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
