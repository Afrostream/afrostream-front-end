import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Link } from '../Utils'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames'
import Billboard from './Billboard'
import Spinner from '../Spinner/Spinner'
import config from '../../../../config'
import LoadVideo from '../LoadVideo'
import MobileDetect from 'mobile-detect'
import ReactImgix from '../Image/ReactImgix'

import * as VideoActionCreators from '../../actions/video'
import SignUpButton from '../User/SignUpButton'
import { extractImg } from '../../lib/utils'
import BackgroundVideo from '../Player/BackgroundVideo'

if (process.env.BROWSER) {
  require('./MovieInfo.less')
}

@connect(({Movie, Season, User, Event}) => ({Movie, Season, User, Event}))
class MovieInfo extends LoadVideo {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    active: PropTypes.bool,
    showTrailer: PropTypes.bool,
    overlay: PropTypes.bool,
    showBtn: PropTypes.bool,
    load: PropTypes.bool,
    maxLength: PropTypes.number
  }

  static defaultProps = {
    maxLength: 450,
    showTrailer: false,
    overlay: false,
    showBtn: true,
    load: true,
    active: false
  }

  render () {

    let {
      props: {Movie, User, Event, active, dataId, data, overlay,showTrailer, maxLength, load, showBtn, movieInfo}
    } = this

    data = data || Movie.get(`movies/${dataId}`)

    if (!data) {
      return (<Spinner />)
    }

    let trailers = []
    const isMobile = Event.get('isMobile')
    const videoData = data.get('video')
    const user = User.get('user')
    const isSerie = data.get('type') === 'serie' || data.get('type') === 'error'
    const classes = classSet({
      'movie': true,
      'serie': isSerie,
      'overlay': this.props.gradient,
      'movie--active': this.props.active,
      'movie--btn_play': showBtn === true || !isSerie
    })

    if (videoData && videoData.get('sourceMp4Deciphered')) {
      trailers.push({src: videoData.get('sourceMp4Deciphered'), type: 'video/mp4'})
    }

    let imageUrl = extractImg({
      data,
      //isMobile,
      key: 'poster',
      crop: 'faces',
      fit: 'crop',
      height: 'none'
    })

    const link = this.getLink()
    const content = (<div className="movie-info_content">
      {!showTrailer && <ReactImgix ref="slBackground" bg={true} blur={false} src={imageUrl} className="movie-background">
        <div className="afrostream-movie__mask"/>
      </ReactImgix>}
      {user && <Link to={link}>
        <div className="btn-play"/>
      </Link>}
      {data && <Billboard {...{active, data, dataId, maxLength, load, movieInfo}} />}
    </div>)

    return (
      <div ref="slContainer" className={classes}>
        {showTrailer && <BackgroundVideo
          {...{videos: trailers, poster: imageUrl}}
          preload={'metadata'}>
          {!isMobile && content}
        </BackgroundVideo>}
        {isMobile && content}
      </div>
    )
  }
}

export default MovieInfo
