import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import Billboard from './Billboard'
import Spinner from '../Spinner/Spinner'
import config from '../../../../config'
import LoadVideo from '../LoadVideo'
import MobileDetect from 'mobile-detect'

import * as VideoActionCreators from '../../actions/video'

if (process.env.BROWSER) {
  require('./MovieInfo.less')
}

@connect(({Movie, Season}) => ({Movie, Season}))
class MovieInfo extends LoadVideo {

  constructor (props) {
    super(props)
    this.state = {
      isMobile: false,
      size: {
        height: 1280,
        width: 800
      }
    }
  }

  static propTypes = {
    active: PropTypes.bool,
    showBtn: PropTypes.bool,
    load: PropTypes.bool,
    maxLength: PropTypes.number
  }

  static defaultProps = {
    maxLength: 450,
    showBtn: true,
    load: true,
    active: false
  }

  render () {

    let {
      props: {Movie, active, dataId, data, maxLength, load, showBtn}
    } = this

    data = data || Movie.get(`movies/${dataId}`)

    if (!data) {
      return (<Spinner />)
    }

    const isSerie = data.get('type') === 'serie' || data.get('type') === 'error'
    const classes = classSet({
      'movie': true,
      'serie': isSerie,
      'movie--active': this.props.active,
      'movie--btn_play': showBtn === true || !isSerie
    })

    let poster = data.get('poster')
    let posterImg = poster ? poster.get('path') : ''
    //&h=${this.state.size.height}
    let imageStyles = posterImg ? {backgroundImage: `url(${config.images.urlPrefix}${posterImg}?crop=faces&fit=${this.state.isMobile ? 'min' : 'clip'}&w=${this.state.size.width}&q=${config.images.quality}&fm=${config.images.type})`} : {}
    const link = this.getLink()
    return (
      <div ref="slContainer" className={classes}>
        <div ref="slBackground" className="movie-background" style={imageStyles}>
          <div className="afrostream-movie__mask"/>
        </div>
        <Link to={link}>
          <div className="btn-play"/>
        </Link>
        {data ? <Billboard {...{active, data, dataId, maxLength, load}} /> : ''}
      </div>
    )
  }
}

export default MovieInfo
