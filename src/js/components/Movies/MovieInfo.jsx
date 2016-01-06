import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
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

  static propTypes = {
    active: PropTypes.bool,
    load: PropTypes.bool,
    maxLength: PropTypes.number
  };

  static defaultProps = {
    maxLength: 450,
    load: true,
    active: false
  };

  initTransition() {

    const container = ReactDOM.findDOMNode(this.refs.slContainer);
    const backGd = ReactDOM.findDOMNode(this.refs.slBackground);
    this.tlIn = new TimelineMax({paused: true});
    if (!container || !backGd) {
      return;
    }
    this.tlIn.add(TweenMax.fromTo(container, 2, {autoAlpha: 0}, {autoAlpha: 1}));
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

    let {
      props: { Movie, active, movieId, movie,maxLength}
      } = this;

    movie = movie || Movie.get(`movies/${movieId}`);

    if (!movie) {
      return (<Spinner />);
    }

    const isSerie = movie.get('type') === 'serie';
    const classes = classSet({
      'movie': true,
      'serie': isSerie,
      'movie--active': this.props.active,
      'movie--btn_play': !this.props.load && isSerie
    });

    let poster = movie.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imageStyles = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clamp&w=1280&h=720&q=${config.images.quality}&fm=${config.images.type})`} : {};
    let link = this.getLink();
    return (
      <div ref="slContainer" className={classes}>
        <Link to={link}>
          <div ref="slBackground" className="movie-background" style={imageStyles}/>
          <div className="btn-play"/>
        </Link>
        {movie ? <Billboard {...{active, movie, maxLength}} /> : ''}
      </div>
    );
  }
}

export default MovieInfo;
