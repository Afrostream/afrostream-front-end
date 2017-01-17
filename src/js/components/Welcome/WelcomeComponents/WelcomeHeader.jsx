import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import config from '../../../../../config'
import SlideShow from '../../SlideShow/SlideShow'

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
        params
      }
    } = this

    let {movieId} = params

    let welcomeClassesSet = {
      'welcome-header': true,
      'welcome-overlay': movieId,
      'welcome-header_movie': Boolean(movieId)
    }


    return (
      <section className={classSet(welcomeClassesSet)}>
        <SlideShow {...this.props} dots={false} autoplay={true} infinite={true} maxLength={450} {...{movieId}}
                   movieInfo={Boolean(movieId)}/>
      </section>
    )
  }
}

WelcomeHeader.propTypes = {
  location: React.PropTypes.object.isRequired
}

WelcomeHeader.defaultProps = {}

export default WelcomeHeader
