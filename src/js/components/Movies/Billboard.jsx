import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import Immutable from 'immutable';
import { Link } from 'react-router';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment'
import { connect } from 'react-redux';
import LoadVideo from '../LoadVideo';
import ShareButton from '../Share/ShareButton';
import FavoritesAddButton from '../Favorites/FavoritesAddButton';

if (process.env.BROWSER) {
  require('./Billboard.less');
}

@connect(({ Movie,Season }) => ({Movie, Season}))
class Billboard extends LoadVideo {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    active: PropTypes.bool.isRequired,
    maxLength: PropTypes.number.isRequired
  };

  static defaultProps = {
    data: null,
    active: false,
    maxLength: 450
  };

  getFavorite() {
    const {
      props: { data, dataId }
      } = this;
    return (<FavoritesAddButton {...{data, dataId}}/>)
  }

  getShareButton() {
    const {
      props: { data }
      } = this;

    let link = this.getLink();

    return <ShareButton link={link} title={data.get('title')} description={data.get('synopsis')}/>
  }

  getGenre(tags) {
    return (
      <div className="billboard-row">
        <label> Genre : </label>
        {tags.map((tag) => <Link to={tag}> {tag} </Link>).toJS()}
      </div>
    );
  }

  getSeasons(seasons, data) {
    let label = ' saison' + (seasons.size > 1 ? 's' : '');
    let schedule = data.get('schedule') || '';
    return (seasons.size ?
      <div ref="slSeasons" className="billboard-seasons billboard-row">
        <label>{seasons.size}</label>
        {label}
        {schedule ? ' - ' : '' }
        {schedule ? <label className="yellow">{schedule}</label> : '' }
      </div> :
      <div ref="slSeasonNull"/>);
  }

  getCreator(creator) {
    return (
      <div className="billboard-row">
        <label> Création : </label> {creator}
      </div>
    );
  }

  getCast(casts) {
    return (
      <div className="billboard-row">
        <label> Avec : </label>
        {casts.map((cast, i) => <span
          key={`cast-${i}`}> {`${(i ? ' | ' : '')}${cast.get('firstName')} ${cast.get('lastName')}`}</span>).toJS()}
      </div>
    );
  }

  render() {
    const {
      props: { data , maxLength}
      } = this;

    if (!data) {
      return (<div />);
    }

    let hasSubtiles = false;
    let title = data.get('title');
    let type = data.get('type');
    let tags = data.get('tags');
    let creator = data.get('creator');
    let actors = data.get('actors');
    let synopsis = data.get('synopsis') || '';
    let slug = data.get('slug') || '';
    let seasons = data.get('seasons');
    let videoData = data.get('video');
    if (seasons && seasons.size) {
      const season = seasons.get(0);
      const episodes = season.get('episodes');
      //TODO get last viewed episode
      const episode = episodes.get(0);
      if (episode) {
        videoData = episode.get('video');
      }
    }
    if (videoData) {
      let subtitles = videoData.get('captions');
      hasSubtiles = subtitles ? subtitles.size : false;
    }

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      if (cutIndex !== -1) {
        let shortDescription = synopsis.substring(0, cutIndex) + '...';
        synopsis = shortDescription;
      }
    }
    let link = this.getLink();

    return (
      <div className="billboard-infos">
        {type ? <div ref="slTag" className="billboard-tag billboard-row">{type === 'movie' ? 'film' : type}</div> :
          <div ref="slNull"/>}
        <Link to={link} ref="slTitle" className="billboard-title billboard-row">{title}</Link>
        {seasons ? this.getSeasons(seasons, data) : ''}
        {tags ? this.getGenre(tags) : ''}
        {creator ? this.getCreator(creator) : ''}
        {actors && actors.size ? this.getCast(actors) : ''}
        <Link to={link} ref="slSynopsis" className="billboard-synopsis billboard-row">{synopsis}</Link>
        <div className="billboard-info__btn">
          {hasSubtiles ? <button className="btn btn-xs btn-transparent" href="#">
            <i className="fa fa-align-left"></i>Audio et sous titres
          </button> : <div />}
          {this.getFavorite()}
          {this.getShareButton()}
        </div>
      </div>
    );
  }
}

export default Billboard;
