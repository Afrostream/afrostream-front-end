import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../../../config'
import classSet from 'classnames'
import { I18n } from '../../Utils'
import SlideShow from '../../SlideShow/SlideShow'
import BackgroundVideo from '../../Player/BackgroundVideo'
import SignUpButton from '../../User/SignUpButton'
import * as ModalActionCreators from '../../../actions/modal'
import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./WelcomeHeader.less')
}

const {metadata, images} = config

@connect(({Event, User, Movie, Video, Season, Episode, GA}) => ({Event, User, Movie, Video, Season, Episode, GA}))
class WelcomeHeader extends I18n {

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

  showLock () {
    const {
      props: {
        dispatch,
      }
    } = this

    /*
    dispatch(ModalActionCreators.open({
      target: 'showSignup'
    }))
    */
  }

  render () {

    const {
      props: {
        params,
        Event,
        Movie,
        GA,
        router
      }
    } = this
    let {movieId} = params

    let welcomeClassesSet = {
      'welcome-header': true,
      'welcome-overlay': movieId,
      'welcome-header_movie': Boolean(movieId)
    }

    let trailers = config.metadata.videos

    const currentMovie = Movie.get(`movies/${movieId}`)
    const isMobile = Event.get('isMobile')
    const movieName = (currentMovie && `${currentMovie.get('title')} ${this.getTitle('and')} `) || ''
    const homeRTitle = this.getTitle('home.title', {movieName})
    const videoData = currentMovie && currentMovie.get('video')
    const isOnUk = router.isActive('uk')

    if (videoData && videoData.get('sourceMp4Deciphered')) {
      trailers = []
      trailers.push({src: videoData.get('sourceMp4Deciphered'), type: 'video/mp4'})
    }

    const isHomeAB = GA.get('variations').find(variation => {
      return variation.get('name') === 'promo1euro' && variation.get('choose') === 1
    })


    let posterImg = `${images.urlPrefix}${metadata.screen && metadata.screen.image || metadata.shareImage}?crop=faces&fit=clip&w=${this.state.size.width}&q=${images.quality}&fm=${images.type}`

    if (isOnUk) {
      trailers = []
      posterImg = `${images.urlPrefix}${metadata.screen && metadata.screen.imageUK || metadata.shareImage}?crop=faces&fit=clip&w=${this.state.size.width}&q=${images.quality}&fm=${images.type}`
    }

    return (
      <section className={classSet(welcomeClassesSet)}>
        {<BackgroundVideo
          {...{isMobile, videos: trailers}}
          poster={posterImg}
          onClick={::this.showLock}
        >
          <div className="afrostream-movie__subscribe">
            <div className="afrostream-statement">{homeRTitle.split('\n').map((statement, i) => {
              return (<span key={`statement-${i}`}>{statement}</span>)
            })}
            </div>
            <div className="mouse"/>
          </div>
        </BackgroundVideo>}
        {movieId && <SlideShow
          {...this.props} showTrailer={true} dots={false} autoplay={true} infinite={true}
          maxLength={450} {...{movieId}}
          movieInfo={Boolean(movieId)}/>}
      </section>
    )
  }
}

WelcomeHeader.propTypes = {
  location: React.PropTypes.object.isRequired
}

WelcomeHeader.defaultProps = {}

export default injectIntl(WelcomeHeader)
