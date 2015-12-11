import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment'
import classSet from 'classnames';
import Billboard from './Billboard'
import Spinner from '../Spinner/Spinner';
import config from '../../../../config';
import LoadVideo from '../LoadVideo';

import * as VideoActionCreators from '../../actions/video';
import * as EventActionCreators from '../../actions/event';
import * as MovieActionCreators from '../../actions/movie';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./MovieInfo.less');
}

@connect(({ Movie }) => ({Movie}))
class MovieInfo extends LoadVideo {

  constructor(props) {
    super(props);
    this.tlIn = null;
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    load: PropTypes.bool.isRequired,
    maxLength: PropTypes.number.isRequired
  };

  static defaultProps = {
    maxLength: 450,
    load: true
  };

  initTransition() {

    const container = React.findDOMNode(this.refs.slContainer);
    const backGd = React.findDOMNode(this.refs.slBackground);
    this.tlIn = new TimelineMax({paused: true});
    if (!container || !backGd) {
      return;
    }
    this.tlIn.add(TweenMax.fromTo(container, 2, {autoAlpha: 0}, {autoAlpha: 1}));
    //this.tlIn.add(TweenMax.fromTo(backGd, 22,
    //  {z: 0},
    //  {z: 5, force3D: true}
    //), 0);

  }

  lunchTransition() {
    if (this.isMobile()) {
      return;
    }
    if (!this.props.active) {
      return;
    }
    if (!this.tlIn) {
      this.initTransition();
    }
    if (this.tlIn.isActive()) {
      return;
    }
    this.tlIn.restart();
  }

  isMobile() {
    //Detect mobile
    const ua = navigator.userAgent;
    return /WebKit/.test(ua) && /Mobile/.test(ua);
  }

  componentDidUpdate() {
    this.lunchTransition();
  }

  componentDidMount() {
    this.lunchTransition();
  }

  render() {

    const {
      props: { Movie, active, movieId, movie,maxLength}
      } = this;

    const movieData = movie || Movie.get(`movies/${movieId}`);


    if (!movieData) {
      //TODO gerer le 404 sur la movie
      return (<Spinner />);
    }
    const isSerie = movieData.get('type') === 'serie';
    const classes = classSet({
      'movie': true,
      'serie': isSerie,
      'movie--active': this.props.active,
      'movie--btn_play': !this.props.load && isSerie
    });

    let poster = movieData.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imageStyles = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clamp&w=1280&h=720&q=${config.images.quality}&fm=${config.images.type})`} : {};

    return (
      <div ref="slContainer" className={classes}>
        <a href="" onClick={::this.loadVideo} onTouchEnd={::this.loadVideo}>
          <div ref="slBackground" className="movie-background" style={imageStyles}/>
          <a href="" className="btn-play"/>
          {movieData ? <Billboard {...{active, movieData, maxLength}} /> : ''}
        </a>
      </div>
    );
  }
}

export default MovieInfo;
