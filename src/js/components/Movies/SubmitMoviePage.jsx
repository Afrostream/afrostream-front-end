import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import classSet from 'classnames'
import * as MovieActionCreators from '../../actions/movie'
import config from '../../../../config'
import MobileDetect from 'mobile-detect'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import SubmitMovie from './SubmitMovie'

if (process.env.BROWSER) {
  require('./SubmitMoviePage.less')
}

@connect(({Movie}) => ({Movie}))
class SubmitMoviePage extends React.Component {

  state = {
    isMobile: false,
    size: {
      height: 1280,
      width: 500
    }
  }

  static contextTypes = {
    location: PropTypes.object.isRequired
  }

  constructor () {
    super()
  }

  componentDidMount () {
    const {
      props: {
        dispatch, location
      }
    } = this

    let isMobile = false
    if (canUseDOM) {
      const userAgent = (window.navigator && navigator.userAgent) || ''
      let agent = new MobileDetect(userAgent)
      isMobile = agent.mobile()
      this.setState({
        isMobile: isMobile,
        size: {
          height: window.innerHeight,
          width: window.innerWidth
        }
      })
    }
  }

  render () {

    let imageStyle = {backgroundImage: `url(${config.metadata.shareImage}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=${this.state.size.width}&q=${config.images.quality}&fm=${config.images.type})`}

    return (
      <div className="row-fluid submit-movie-page" style={imageStyle}>
        <div className="backgroundima"/>
        <div className="container brand-bg no-padding">
          <SubmitMovie />
        </div>
      </div>
    )
  }
}

export default SubmitMoviePage
