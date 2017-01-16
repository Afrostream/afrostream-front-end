import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import config from '../../../../../config'
import MobileDetect from 'mobile-detect'
import SignUpButton from '../../User/SignUpButton'
import window from 'global/window'
import ReactImgix from '../../Image/ReactImgix'
import SlideShow from '../../SlideShow/SlideShow'

const {metadata, images} =config

if (process.env.BROWSER) {
  require('./WelcomeHeader.less')
}

@connect(({User, Movie, Video, Season, Episode}) => ({User, Movie, Video, Season, Episode}))
class WelcomeHeader extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isMobile: true,
      size: {
        width: 1080,
        height: 500
      }
    }
  }

  render () {

    const {
      props: {
        Movie, Season, Episode, params, intl
      }
    } = this
    let {movieId, seasonId, episodeId} = params

    let info = {
      title: intl.formatMessage({id: 'home.title'}),
      action: 'home.action',
      poster: `${metadata.screen && metadata.screen.image || metadata.shareImage}`,
      logo: `${metadata.screen && metadata.screen.logo}`,
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
        synopsis: data.get('synopsis'),
      }
      info.logo = null
    }
    let posterImg = `${images.urlPrefix}${info.poster}?crop=faces&fit=clip&w=${this.state.size.width}&q=${images.quality}&fm=${images.type}`
    let logoImg = `${images.urlPrefix}${info.logo}?crop=faces&fit=clip&w=500&q=70&fm=png`
    let logoStyle = {backgroundImage: `url(${logoImg})`}


    let welcomeClassesSet = {
      'welcome-header': true,
      'welcome-overlay': info.logo || movieData,
      'welcome-header_movie': Boolean(movieData)
    }


    return (
      <section className={classSet(welcomeClassesSet)}>
        <SlideShow {...this.props} dots={false} autoplay={true} infinite={false} maxLength={Infinity}
                   movieInfo={Boolean(movieData)}/>

        <SignUpButton key="welcome-pgm-signup" className="subscribe-button subscribe-button-mobile"
                      label={info.action}/>
      </section>
    )
  }
}

WelcomeHeader.propTypes = {
  location: React.PropTypes.object.isRequired
}

WelcomeHeader.defaultProps = {}

export default WelcomeHeader
