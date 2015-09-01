import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./Billboard.less');
}

class Billboard extends React.Component {

  constructor(props) {
    super(props);
    this.tlIn = null;
    this.oldId = null;
  }

  static propTypes = {
    movieData: PropTypes.instanceOf(Object.List).isRequired,
    active: PropTypes.bool.isRequired,
    maxLength: PropTypes.number.isRequired
  };

  static defaultProps = {
    maxLength: 450
  };

  initTransition() {
    const titleEl = React.findDOMNode(this.refs.slTitle);
    const synopsisE = React.findDOMNode(this.refs.slSynopsis);
    const slTag = React.findDOMNode(this.refs.slTag || this.refs.slNull);
    const slSeasons = React.findDOMNode(this.refs.slSeasons || this.refs.slSeasonNull);
    this.tlIn = new TimelineMax({paused: true});
    this.tlIn.add(TweenMax.staggerFromTo([synopsisE, slSeasons, titleEl, slTag], 0.3,
      {transform: 'translateX(-200px)'},
      {transform: 'translateX(0)', ease: Sine.easeOut}
      , 0.05), 0);
  }

  lunchTransition() {
    let newId = this.props.movieData.get('_id');
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
    this.oldId = this.props.movieData.get('_id');
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

  getSeasons(seasons) {
    let label = ' saison' + (seasons.size > 1 ? 's' : '');

    return (seasons.size ?
      <div ref="slSeasons" className="billboard-seasons billboard-row"><label>{seasons.size}</label>{label}</div> :
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
        <label> Acteurs principaux : </label>
        {casts.map((cast) => <Link to={cast}> {cast} </Link>)}
      </div>
    );
  }

  render() {
    const {
      props: { movieData , maxLength}
      } = this;

    let hasSubtiles = false;
    let title = movieData.get('title');
    let type = movieData.get('type');
    let tags = movieData.get('tags');
    let creator = movieData.get('creator');
    let casts = movieData.get('casts');
    let synopsis = movieData.get('synopsis') || '';
    let slug = movieData.get('slug') || '';
    let seasons = movieData.get('seasons');
    let videoData = movieData.get('video');
    if (seasons) {
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
      console.log(subtitles);

      hasSubtiles = subtitles ? subtitles.size : false;
    }

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      let shortDescription = synopsis.substring(0, cutIndex) + '...';
      synopsis = shortDescription;
    }

    return (
      <div className="billboard-infos">
        {type ? <div ref="slTag" className="billboard-tag billboard-row">{type}</div> : <div ref="slNull"/>}
        <div ref="slTitle" className="billboard-title billboard-row">{title}</div>
        {seasons ? this.getSeasons(seasons) : ''}
        {tags ? this.getGenre(tags) : ''}
        {creator ? this.getCreator(creator) : ''}
        {casts ? this.getCast(casts) : ''}
        <div ref="slSynopsis" className="billboard-synopsis billboard-row">{synopsis}</div>
        <a href={movieData.get('link')}>{movieData.get('link')}</a>

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
