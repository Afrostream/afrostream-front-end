import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { connect } from 'react-redux'
import LoadVideo from '../LoadVideo'
import ShareButton from '../Share/ShareButton'
import FavoritesAddButton from '../Favorites/FavoritesAddButton'
import RateComponent from '../Recommendation/RateComponent'
import CsaIcon from './CsaIcon'

if (process.env.BROWSER) {
  require('./Billboard.less')
}

@connect(({Movie, Season}) => ({Movie, Season}))
class Billboard extends LoadVideo {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    active: PropTypes.bool.isRequired,
    maxLength: PropTypes.number.isRequired
  }

  static defaultProps = {
    data: null,
    active: false,
    maxLength: 450
  }

  getFavorite () {
    const {
      props: {data, dataId}
    } = this

    if (!this.isValid()) {
      return
    }

    return (<FavoritesAddButton {...{data, dataId}}/>)
  }

  getShareButton () {
    const {
      props: {data}
    } = this

    if (!this.isValid()) {
      return
    }

    let link = this.getLink()

    return <ShareButton link={link} title={data.get('title')} description={data.get('synopsis')}/>
  }

  getGenre (tags) {
    if (!tags || !this.isValid()) {
      return
    }
    return (
      <div className="billboard-row">
        <label> Genre : </label>
        {tags.map((tag) => <Link to={tag}> {tag} </Link>).toJS()}
      </div>
    )
  }

  getSeasons (seasons, data) {
    if (!seasons || !this.isValid()) {
      return
    }

    let label = ' saison' + (seasons.size > 1 ? 's' : '')
    let schedule = data.get('schedule') || ''
    return (seasons.size ?
      <div ref="slSeasons" className="billboard-seasons billboard-row">
        <label>{seasons.size}</label>
        {label}
        {schedule ? ' - ' : '' }
        {schedule ? <label className="yellow">{schedule}</label> : '' }
      </div> :
      <div ref="slSeasonNull"/>)
  }

  getCreator (creator) {
    if (!creator || !this.isValid()) {
      return
    }

    return (
      <div className="billboard-row">
        <label> Création : </label> {creator}
      </div>
    )
  }

  getCast (casts) {
    if (!casts || !casts.size) {
      return
    }
    return (
      <div className="billboard-row">
        <label> Avec : </label>
        {casts.map((cast, i) => {
          let thumb = cast.get('poster')
          if (thumb) {
            thumb = thumb.get('imgix')
          }
          return (<span key={`cast-${i}`} className="billboard-row_cast">
            {thumb ? <img src={thumb}/> : null}
            {`${(i ? ' | ' : '')} ${cast.get('firstName')} ${cast.get('lastName')} `}
          </span>)
        }).toJS()}
      </div>
    )
  }

  render () {
    const {
      props: {data, maxLength}
    } = this

    if (!data) {
      return (<div />)
    }

    let hasSubtiles = false
    let title = data.get('title')
    let type = data.get('type')
    let tags = data.get('tags')
    let creator = data.get('creator')
    let actors = data.get('actors')
    let synopsis = data.get('synopsis') || ''
    let slug = data.get('slug') || ''
    let seasons = data.get('seasons')
    let videoData = data.get('video')
    let videoId = data.get('videoId')
    let csa = data.get('CSA')
    let rating = data.get('rating') || 3
    if (seasons && seasons.size) {
      const season = seasons.get(0)
      const episodes = season.get('episodes')
      //TODO get last viewed episode
      const episode = episodes.get(0)
      if (episode) {
        videoData = episode.get('video')
      }
    }

    if (videoData) {
      let subtitles = videoData.get('captions')
      hasSubtiles = subtitles ? subtitles.size : false
    }

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength)
      if (cutIndex !== -1) {
        let shortDescription = synopsis.substring(0, cutIndex) + '...'
        synopsis = shortDescription
      }
    }

    let link = this.getLink()


    return (
      <div className="billboard-infos">
        {type ? <div ref="slTag" className="billboard-tag billboard-row">{type === 'movie' ? 'film' : type}</div> :
          <div ref="slNull"/>}
        {<CsaIcon {...{csa}}/>}
        <Link to={link} ref="slTitle" className="billboard-title billboard-row">{title}</Link>
        {<RateComponent defaultValue={rating} disabled={true} {...{videoId}}/>}
        {this.getSeasons(seasons, data)}
        {this.getGenre(tags)}
        {this.getCreator(creator)}
        {this.getCast(actors) }
        <Link to={link} ref="slSynopsis" className="billboard-synopsis billboard-row">{synopsis}</Link>
        <div className="billboard-info__btn">
          {hasSubtiles ? <button className="btn btn-xs btn-transparent" href="#">
            <i className="fa fa-align-left"></i>Audio et sous titres
          </button> : <div />}
          {this.getFavorite()}
          {this.getShareButton()}
        </div>
      </div>
    )
  }
}

export default Billboard
