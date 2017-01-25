import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../../../config'
import classSet from 'classnames'
import { I18n } from '../../Utils'
import SlideShow from '../../SlideShow/SlideShow'
import BackgroundVideo from '../../Player/BackgroundVideo'
import SignUpButton from '../../User/SignUpButton'
import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./WelcomeHeader.less')
}

@connect(({Event, User, Movie, Video, Season, Episode}) => ({Event, User, Movie, Video, Season, Episode}))
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

  render () {

    const {
      props: {
        params,
        Event,
        location
      }
    } = this
    let {query} = location
    let {movieId} = params

    let welcomeClassesSet = {
      'welcome-header': true,
      'welcome-overlay': movieId,
      'welcome-header_movie': Boolean(movieId)
    }

    const isMobile = Event.get('isMobile')
    const isVideoQuery = query.videoHome
    let homeRTitle = this.getTitle('home.title')

    return (
      <section className={classSet(welcomeClassesSet)}>
        {!isMobile && isVideoQuery && <BackgroundVideo
          preload={'metadata'}
          videos={config.metadata.videos}
        >
          <div className="afrostream-movie__subscribe">
            <div className="afrostream-statement">{homeRTitle.split('\n').map((statement, i) => {
              return (<span key={`statement-${i}`}>{statement}</span>)
            })}
            </div>
            <SignUpButton className="subscribe-button" label="home.action"/>
          </div>
        </BackgroundVideo>}
        {(isMobile || !isVideoQuery) && <SlideShow {...this.props} dots={false} autoplay={true} infinite={true}
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
