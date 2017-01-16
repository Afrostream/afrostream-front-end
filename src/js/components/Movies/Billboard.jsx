import React, { PropTypes } from 'react'
import { Link } from '../Utils'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { connect } from 'react-redux'
import LoadVideo from '../LoadVideo'
import ShareButton from '../Share/ShareButton'
import FavoritesAddButton from '../Favorites/FavoritesAddButton'
import RateComponent from '../Recommendation/RateComponent'
import CsaIcon from './CsaIcon'
import ReactImgix from '../Image/ReactImgix'
import { extractImg } from '../../lib/utils'
import SignUpButton from '../User/SignUpButton'
import {
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./Billboard.less')
}

@connect(({Movie, Season, User}) => ({Movie, Season, User}))
class Billboard extends LoadVideo {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    active: PropTypes.bool.isRequired,
    movieInfo: PropTypes.bool,
    maxLength: PropTypes.number.isRequired
  }

  static defaultProps = {
    data: null,
    active: false,
    movieInfo: true,
    maxLength: 450
  }

  getFavorite () {
    const {
      props: {data, dataId}
    } = this

    if (!this.isValid()) {
      return
    }

    return (<FavoritesAddButton direction="right" {...{data, dataId}}/>)
  }

  getShareButton () {
    const {
      props: {data}
    } = this

    if (!this.isValid()) {
      return
    }

    let link = this.getLink()

    return <ShareButton direction="right" link={link} title={data.get('title')} description={data.get('synopsis')}/>
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
            thumb = thumb.get('path')
          }
          return (<span key={`cast-${i}`} className="billboard-row_cast">
            {thumb ? <img
                src={`${config.images.urlPrefix}${thumb}?crop=faces&fit=clip&w=1120&h=630&q=${config.images.quality}&fm=${config.images.type}`}/> : null}
            {`${(i ? ' | ' : '')} ${cast.get('firstName')} ${cast.get('lastName')} `}
          </span>)
        }).toJS()}
      </div>
    )
  }

  render () {
    const {
      props: {User, data, maxLength, movieInfo}
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
      const season = seasons.first()
      if (season) {
        const episodes = season.get('episodes')
        //TODO get last viewed episode
        if (episodes && episodes.size) {
          const episode = episodes.first()
          if (episode) {
            videoData = episode.get('video')
          }
        }
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


    const user = User.get('user')

    let logo = data.get('logo') && extractImg({
        data,
        key: 'logo',
        fit: 'none',
        width: 500,
        height: 380,
        format: 'png'
      })

    if (!user) {


      let homeRTitle = this.getTitle('home.title')

      return (
        <div className="billboard-no-users">
          {logo && <ReactImgix className="afrostream-movie__logo" src={logo} bg={true}/>}
          <div className="afrostream-movie__subscribe">
            <div className="afrostream-statement">{homeRTitle.split('\n').map((statement, i) => {
              return (<span key={`statement-${i}`}>{statement}</span>)
            })}
            </div>
            <SignUpButton className="subscribe-button" label="home.action"/>
          </div>
          {movieInfo && <div className="billboard-infos text-left">
            <div className="billboard-title billboard-row">{title}</div>
            <div className="billboard-synopsis billboard-row">{synopsis}</div>
          </div>}
        </div>
      )
    }

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
              <i className="zmdi zmdi-view-subtitles"></i>Audio et sous titres
            </button> : <div />}
          {this.getFavorite()}
          {this.getShareButton()}
        </div>
      </div>
    )
  }
}

export default injectIntl(Billboard)
