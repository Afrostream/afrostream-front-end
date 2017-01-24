import React, { PropTypes } from 'react'
import { Link } from '../Utils'
import Poster from './Poster'
import { connect } from 'react-redux'
import classSet from 'classnames'

if (process.env.BROWSER) {
  require('./Thumb.less')
}

@connect(({Movie, Season}) => ({Movie, Season}))
class Thumb extends Poster {


  constructor (props) {
    super(props)
  }

  static propTypes = {
    thumbW: React.PropTypes.number,
    thumbH: React.PropTypes.number,
    preload: React.PropTypes.bool,
    favorite: React.PropTypes.bool,
    share: React.PropTypes.bool,
    showDescription: React.PropTypes.bool,
    showTitle: React.PropTypes.bool,
    type: React.PropTypes.string,
    fit: React.PropTypes.string,
    crop: React.PropTypes.string
  }

  static defaultProps = {
    thumbW: 140,
    thumbH: 200,
    preload: false,
    favorite: true,
    share: true,
    showDescription: true,
    showTitle: true,
    type: 'movie',
    fit: 'min',
    crop: 'faces'
  }

  triggerOver () {
    this.setState({
      hover: true
    })
  }

  triggerOut () {
    this.setState({
      hover: false
    })
  }

  getInfos () {
    const {
      props: {data, showTitle, showDescription}
    } = this

    const type = this.getType()

    if (type === 'movie') {
      return null
    }
    const maxLength = 80

    let episodeNumber = data.get('episodeNumber')
    let seasonNumber = data.get('seasonNumber')
    let title = data.get('title')
    switch (type) {
      case 'episode':
        if (episodeNumber) {
          title = this.getTitle('thumb.episodeLabel', {episodeNumber, title})
        }
        break
      case 'season':
        title = this.getTitle('thumb.seasonLabel', {seasonNumber, title})
        break
      default:
        break
    }
    let synopsis = data.get('synopsis') || ''
    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength)
      if (cutIndex !== -1) {
        let shortDescription = synopsis.substring(0, cutIndex) + '...'
        synopsis = shortDescription
      }
    }

    return (<div ref="info" className="thumb-info">
      {showTitle && <div className="thumb-info__title">{title}</div>  }
      {showDescription && <div className="thumb-info__synopsis">{synopsis}</div>  }
    </div>)
  }

  getButtons () {
    if (!this.state.hover) {
      return <div className="thumb-buttons"/>
    }

    return <div className="thumb-buttons">
      {this.getFavorite()}
      {this.getShareButton()}
    </div>
  }

  getBtnPlay () {
    const type = this.getType()
    return type === 'episode' ? <div className="btn-play"/> : null
  }

  render () {
    let imageStyles = this.getLazyImageUrl()
    let link = this.getLink()
    const type = this.getType()

    let thumbClass = {
      'thumb': true,
    }
    thumbClass[type] = true
    thumbClass.movie = false

    return (
      <div ref="thumb" className={classSet(thumbClass)}
           onMouseEnter={::this.triggerOver}
           onMouseLeave={::this.triggerOut}>
        <Link to={link}>
          <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
            {this.getBtnPlay()}
            {this.getNew()}
          </div>
          {this.getInfos()}
        </Link>
        {this.getButtons()}
      </div>
    )
  }
}

export default Thumb
