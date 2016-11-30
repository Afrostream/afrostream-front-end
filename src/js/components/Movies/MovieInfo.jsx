import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
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

if (process.env.BROWSER) {
  require('./MovieInfo.less')
}

@connect(({Movie, Season, User}) => ({Movie, Season, User}))
class MovieInfo extends LoadVideo {

  constructor (props) {
    super(props)
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
      props: {Movie, User, active, dataId, data, maxLength, load, showBtn}
    } = this

    data = data || Movie.get(`movies/${dataId}`)

    if (!data) {
      return (<Spinner />)
    }

    const user = User.get('user')
    const isSerie = data.get('type') === 'serie' || data.get('type') === 'error'
    const classes = classSet({
      'movie': true,
      'serie': isSerie,
      'movie--active': this.props.active,
      'movie--btn_play': showBtn === true || !isSerie
    })

    let imageUrl = extractImg({
      data,
      key: 'poster',
      crop: 'faces',
      fit: 'crop',
      height: 'none'
    })

    const link = this.getLink()
    return (
      <div ref="slContainer" className={classes}>
        <div className="movie-info_content">
          <ReactImgix ref="slBackground" bg={true} src={imageUrl} className="movie-background">
            <div className="afrostream-movie__mask"/>
          </ReactImgix>
          {user && <Link to={link}>
            <div className="btn-play"/>
          </Link>}
          {data && <Billboard {...{active, data, dataId, maxLength, load}} />}
        </div>
      </div>
    )
  }
}

export default MovieInfo
