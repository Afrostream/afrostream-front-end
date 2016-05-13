import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../../actions/modal'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import { dict, promoCodes, metadata, images }from '../../../../../config'
import _ from 'lodash'
import MobileDetect from 'mobile-detect'
import SignUpButton from '../../User/SignUpButton'
import { withRouter } from 'react-router'

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
        height: 1280,
        width: 500
      }
    }
  }

  componentDidMount () {
    let isMobile = false
    if (canUseDOM) {
      const userAgent = (window.navigator && navigator.userAgent) || ''
      let agent = new MobileDetect(userAgent)
      isMobile = agent.mobile()
    }

    this.setState({
      isMobile: isMobile,
      size: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    })

    let promoCode = this.hasPromo()

    if (canUseDOM && promoCode) {
      //FIXME create countdown
    }
  }

  showLock () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open('showSignup'))
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

    let {movieId, seasonId, episodeId} = params
    let info = {
      title: dict.home.title,
      poster: `${metadata.shareImage}`,
      movie: {
        title: '',
        synopsis: ''
      }
    }

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


      let poster = data.get('poster')
      if (poster) {
        info.poster = poster.get('imgix')
      }
      info.movie = {
        title: title,
        synopsis: data.get('synopsis')
      }
    }

    //&h=${this.state.size.height}
    let imageStyle = {backgroundImage: `url(${info.poster}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=${this.state.size.width}&q=${images.quality}&fm=${images.type})`}

    let promoCode = this.hasPromo()

    let welcomeClassesSet = {
      'welcome-header': true,
      'welcome-header_movie': Boolean(movieData),
      'promo': promoCode
    }


    if (!promoCode) {
      return (
        <section className={classSet(welcomeClassesSet)}>
          <div className="afrostream-movie__poster" style={imageStyle}>
            <div className="afrostream-movie__mask"/>
          </div>
          {movieData ? <SignUpButton className="subscribe-button subscribe-button-mobile"/> : ''}
          <div className="afrostream-movie">
            <div className="afrostream-movie__info">
              <h1>{info.movie.title}</h1>
              <div className='detail-text'>{info.movie.synopsis}</div>
            </div>
            <div className="afrostream-movie__subscribe">
              <div className="afrostream-statement">{info.title.split('\n').map((statement, i) => {
                return (<span key={`statement-${i}`}>{statement}</span>)
              })}</div>
              <SignUpButton />
            </div>
          </div>
        </section>
      )
    }
    else {

      return (
        <section className={classSet(welcomeClassesSet)} style={imageStyle}>
          <div className="promo-content">
            <div className="promo-message">
              <h2>{promoCode.promoHeader}
                <div>avec le code promo: {promoCode.code}</div>
              </h2>
              <h5>Fin de l'offre promotionnelle dans</h5>
              <div id="countdown"></div>
              <button className="subscribe-button-promo" type=" button" onClick={::this.showLock}>PROFITEZ EN
                MAINTENANT
              </button>
            </div>
            <h6>{promoCode.promoConditions1}</h6>
            <h6>{promoCode.promoConditions2}</h6>
          </div>
        </section>
      )
    }
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
