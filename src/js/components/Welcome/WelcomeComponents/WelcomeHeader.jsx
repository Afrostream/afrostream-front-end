import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../../actions/modal'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import config from '../../../../../config'
import { getI18n } from '../../../../../config/i18n'
import _ from 'lodash'
import MobileDetect from 'mobile-detect'
import SignUpButton from '../../User/SignUpButton'
import { withRouter } from 'react-router'
import Player from '../../Player/Player'
import window from 'global/window'

const {promoCodes, metadata, images} =config

if (process.env.BROWSER) {
  require('./WelcomeHeader.less')
}

@connect(({User, Movie, Video, Season, Episode}) => ({User, Movie, Video, Season, Episode}))
class WelcomeHeader extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isMobile: false,
      size: {
        width: 1280,
        height: 500
      }
    }
  }

  showLock () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({target: 'showSignup'}))
  }

  hasPromo () {
    const {
      props: {
        location
      }
    } = this
    let pathName = location.pathname.split('/').join('')
    let HasProm = _.find(promoCodes, function (promo) {
      return pathName === promo.code
    })
    return HasProm
  }

  render () {

    const {
      props: {
        Movie, Season, Episode, params
      }
    } = this
    let {movieId, seasonId, episodeId, lang} = params

    let info = {
      title: getI18n(lang).home.title,
      action: getI18n(lang).home.action,
      poster: `${metadata.shareImage}`,
      movie: {
        title: '',
        synopsis: ''
      }
    }
    let trailer
    let movieData
    //let videoData
    let seasonData
    let episodeData
    if (movieId) {
      movieData = Movie.get(`movies/${movieId}`)
    }
    if (movieData) {
      if (seasonId) {
        seasonData = Season.get(`seasons/${seasonId}`)
      }
      if (episodeId) {
        if (seasonData) {
          let episodesList = seasonData.get('episodes')
          if (episodesList) {
            episodeData = episodesList.find(function (obj) {
              return obj.get('_id') == episodeId
            })
          }
        } else {
          episodeData = Episode.get(`episodes/${episodeId}`)
        }
      }
      //si on a les données de l'episode alors, on remplace les infos affichées
      const data = episodeData ? movieData.merge(episodeData) : movieData

      let title = movieData.get('title')

      if (seasonData) {
        let seasonNumber = seasonData.get('seasonNumber')
        title = `${title} Saison ${seasonNumber}`
      }
      if (episodeData) {
        let episodeNumber = episodeData.get('episodeNumber')
        title = `${title} Épisode ${episodeNumber}`
      }

      trailer = !this.state.isMobile && movieData.get('youtubeTrailer')


      let poster = data.get('poster')
      if (poster) {
        info.poster = poster.get('path')
      }
      info.movie = {
        title: title,
        synopsis: data.get('synopsis')
      }
    }
    let posterImg = `${images.urlPrefix}${info.poster}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=${this.state.size.width}&q=${images.quality}&fm=${images.type}`
    let imageStyle = {backgroundImage: `url(${posterImg})`}

    let promoCode = this.hasPromo()

    let welcomeClassesSet = {
      'welcome-header': true,
      'welcome-header_movie': Boolean(movieData),
      'promo': promoCode
    }

    return (
      <section className={classSet(welcomeClassesSet)}>
        {trailer && <Player src={{src: trailer, type: 'video/youtube'}}
                            options={{autoplay: true, poster: posterImg}}/> }

        {!trailer && <div className="afrostream-movie__poster" style={imageStyle}>
          <div className="afrostream-movie__mask"/>
        </div>}
        {movieData ? <SignUpButton className="subscribe-button subscribe-button-mobile" label={info.action}/> : ''}
        <div className="afrostream-movie">
          <div className="afrostream-movie__info">
            <h1>{info.movie.title}</h1>
            <div className='detail-text'>{info.movie.synopsis}</div>
          </div>
          <div className="afrostream-movie__subscribe">
            <div className="afrostream-statement">{info.title.split('\n').map((statement, i) => {
              return (<span key={`statement-${i}`}>{statement}</span>)
            })}</div>
            <SignUpButton label={info.action}/>
          </div>
        </div>
      </section>
    )
  }
}

WelcomeHeader.propTypes = {
  location: React.PropTypes.object.isRequired,
  promoCode: React.PropTypes.string
}

WelcomeHeader.defaultProps = {
  promoCode: ''
}

export default withRouter(WelcomeHeader)
