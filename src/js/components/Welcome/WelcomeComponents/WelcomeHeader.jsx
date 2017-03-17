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
import InternalPlansCountDown from '../../CountDown/InternalPlansCountDown'

if (process.env.BROWSER) {
  require('./WelcomeHeader.less')
}

const {metadata, images} =config

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

    dispatch(ModalActionCreators.open({
      target: 'showSignup'
    }))
  }

  render () {

    const {
      props: {
        params,
        Event,
        Movie
      }
    } = this
    let {movieId} = params

    let welcomeClassesSet = {
      'welcome-header': true,
      'welcome-overlay': movieId,
      'welcome-header_movie': Boolean(movieId)
    }

    const currentMovie = Movie.get(`movies/${movieId}`)
    const movieName = currentMovie && currentMovie.get('title') || this.getTitle('home.title').toLowerCase()
    const isMobile = Event.get('isMobile')
    const homeRTitle = this.getTitle('home.title')
    const titleMeta = this.getTitle('home.titleMeta', {movieName})

    let posterImg = `${images.urlPrefix}${metadata.screen && metadata.screen.image || metadata.shareImage}?crop=faces&fit=clip&w=${this.state.size.width}&q=${images.quality}&fm=${images.type}`


    return (
      <section className={classSet(welcomeClassesSet)} title={titleMeta}>
        {!movieId && <BackgroundVideo
          {...{isMobile}}
          preload={'metadata'}
          poster={posterImg}
          videos={config.metadata.videos}
          onClick={::this.showLock}
        >
          <InternalPlansCountDown {...this.props} >
            <div className="afrostream-movie__subscribe">
              <div className="afrostream-statement">{homeRTitle.split('\n').map((statement, i) => {
                return (<span key={`statement-${i}`}>{statement}</span>)
              })}
              </div>
              <div className="mouse"/>
            </div>
          </InternalPlansCountDown>
        </BackgroundVideo>}
        {movieId && <SlideShow
          {...this.props} dots={false} autoplay={true} infinite={true}
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
