import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import classSet from 'classnames';
import Billboard from './Billboard'
import Spinner from '../Spinner/Spinner';

import * as VideoActionCreators from '../../actions/video';
import * as EventActionCreators from '../../actions/event';
import * as MovieActionCreators from '../../actions/movie';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./MovieInfo.less');
}

@connect(({ Movie }) => ({Movie}))
class MovieInfo extends React.Component {

  constructor(props) {
    super(props);
    this.tlIn = null;
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    loadEpisode: PropTypes.bool,
    movieId: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,
    movieObj: PropTypes.instanceOf(Immutable.Object)
  };

  static defaultProps = {
    maxLength: 450,
    loadEpisode: false,
  };

  initTransition() {
    const container = React.findDOMNode(this.refs.slContainer);
    const backGd = React.findDOMNode(this.refs.slBackground);
    this.tlIn = new TimelineMax({paused: true});
    if (!container || !backGd) {
      return;
    }
    this.tlIn.add(TweenMax.fromTo(container, 2, {autoAlpha: 0}, {autoAlpha: 1}));
    this.tlIn.add(TweenMax.fromTo(backGd, 22,
      {z: 0},
      {z: 5, force3D: true}
    ), 0);

  }

  lunchTransition() {
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

  componentDidUpdate() {
    this.lunchTransition();
  }

  componentDidMount() {
    this.lunchTransition();
  }

  render() {

    const {
      props: { Movie, active, movieId, movieObj,maxLength}
      } = this;

    const movieData = movieObj || Movie.get(`movies/${movieId}`);


    if (!movieData) {
      //TODO gerer le 404 sur la movie
      return (<Spinner />);
    }

    const classes = classSet({
      'movie': true,
      'serie': movieData.get('type') === 'serie',
      'movie--active': this.props.active
    });

    let poster = movieData.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imageStyles = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clamp&w=1280&h=720&q=70)`} : {};

    return (
      <div ref="slContainer" className={classes}>
        <a href="" onClick={::this.loadVideo}>
          <div ref="slBackground" className="movie-background" style={imageStyles}/>
          <a href="" className="btn-play"/>
          {movieData ? <Billboard {...{active, movieData, maxLength}} /> : ''}
        </a>
      </div>
    );
  }

  loadVideo(e) {
    e.preventDefault();
    const {
      props: {
        dispatch, await,Movie,movieId, movieObj,loadEpisode
        }
      } = this;

    const movieData = Movie.get(`movies/${movieId}`) || movieObj;
    const movieDataId = movieId || movieObj.get('_id');
    let type = movieData ? movieData.get('type') : '';
    let movieSlud = movieData ? movieData.get('slug') : '';
    let link = `/${movieDataId}/${movieSlud}`;
    let videoData = movieData.get('video');
    let videoId = null;
    if (type === 'serie') {
      const seasons = movieData.get('seasons');
      if (seasons && this.props.loadEpisode) {
        const season = seasons.get(0);
        const seasonId = season.get('_id');
        const seasonSlug = season.get('slug');
        const episodes = season.get('episodes');
        //TODO get last viewed episode
        const episode = episodes.get(0);
        if (episode) {
          const episodeId = episode.get('_id');
          const episodeSlug = episode.get('slug');
          link += `/${seasonId}/${seasonSlug}/${episodeId}/${episodeSlug}`;
          videoData = episode.get('video');
        }
      }
    }
    if (videoData) {
      videoId = videoData.get('_id');
      link += `/${videoId}`;
      return await * [
          dispatch(EventActionCreators.pinHeader(false)),
          dispatch(VideoActionCreators.getVideo(videoId)),
          this.context.router.transitionTo(link)
        ];
    }

    return await * [
        dispatch(MovieActionCreators.getMovie(movieDataId)),
        dispatch(MovieActionCreators.getSeason(movieDataId)),
        this.context.router.transitionTo(link)
      ];

  }
}

export default MovieInfo;
