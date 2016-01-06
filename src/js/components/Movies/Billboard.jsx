import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import Immutable from 'immutable';
import { Link } from 'react-router';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment'
import { connect } from 'react-redux';
import LoadVideo from '../LoadVideo';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./Billboard.less');
}

@connect(({ Movie }) => ({Movie}))
class Billboard extends LoadVideo {

  constructor(props) {
    super(props);
    this.tlIn = null;
    this.oldId = null;
  }

  static propTypes = {
    movie: PropTypes.instanceOf(Immutable.Map).isRequired,
    active: PropTypes.bool.isRequired,
    maxLength: PropTypes.number.isRequired
  };

  static defaultProps = {
    movie: null,
    active: false,
    maxLength: 450
  };

  isMobile() {
    //Detect mobile
    const ua = navigator.userAgent;
    return /WebKit/.test(ua) && /Mobile/.test(ua);
  }

  initTransition() {
    const titleEl = ReactDOM.findDOMNode(this.refs.slTitle);
    const synopsisE = ReactDOM.findDOMNode(this.refs.slSynopsis);
    const slTag = ReactDOM.findDOMNode(this.refs.slTag || this.refs.slNull);
    const slSeasons = ReactDOM.findDOMNode(this.refs.slSeasons || this.refs.slSeasonNull);
    this.tlIn = new TimelineMax({paused: true});
    this.tlIn.add(TweenMax.staggerFromTo([synopsisE, slSeasons, titleEl, slTag], 0.3,
      {transform: 'translateX(-200px)'},
      {transform: 'translateX(0)', ease: Sine.easeOut}
      , 0.05), 0);
  }

  lunchTransition() {
    //if (this.isMobile()) {
    return;
    //}
    let newId = this.props.movie.get('_id');
    if (!this.props.active) {
      return;
    }
    if (!this.tlIn) {
      this.initTransition();
    }
    //SameId to animate
    if (this.oldId === newId) {
      return;
    }
    this.oldId = this.props.movie.get('_id');
    this.tlIn.restart();
  }

  componentDidUpdate() {
    this.lunchTransition();
  }

  componentDidMount() {
    this.lunchTransition();
  }

  getGenre(tags) {
    return (
      <div className="billboard-row">
        <label> Genre : </label>
        {tags.map((tag) => <Link to={tag}> {tag} </Link>)}
      </div>
    );
  }

  getSeasons(seasons, movie) {
    let label = ' saison' + (seasons.size > 1 ? 's' : '');
    let schedule = movie.get('schedule') || '';
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
          key={`cast-${i}`}> {`${(i ? ' | ' : '')}${cast.get('firstName')} ${cast.get('lastName')}`}</span>)}
      </div>
    );
  }

  render() {
    const {
      props: { movie , maxLength}
      } = this;

    if (!movie) {
      return (<div />);
    }

    let hasSubtiles = false;
    let title = movie.get('title');
    let type = movie.get('type');
    let tags = movie.get('tags');
    let creator = movie.get('creator');
    let actors = movie.get('actors');
    let synopsis = movie.get('synopsis') || '';
    let slug = movie.get('slug') || '';
    let seasons = movie.get('seasons');
    let videoData = movie.get('video');
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
        {seasons ? this.getSeasons(seasons, movie) : ''}
        {tags ? this.getGenre(tags) : ''}
        {creator ? this.getCreator(creator) : ''}
        {actors && actors.size ? this.getCast(actors) : ''}
        <Link to={link} ref="slSynopsis" className="billboard-synopsis billboard-row">{synopsis}</Link>
        {/*<Link to={movie.get('link')}>{movie.get('link')}</Link>*/}
        <div className="billboard-info__btn">
          {hasSubtiles ? <button className="btn btn-xs btn-transparent" href="#">
            <i className="fa fa-align-left"></i>Audio et sous titres
          </button> : <div />}
          {/* <button className=" btn btn-xs btn-transparent" href="#">
           <i className="fa fa-heart"></i>Ajouter à ma liste
           </button> */}
        </div>
      </div>
    );
  }
}

export default Billboard;
