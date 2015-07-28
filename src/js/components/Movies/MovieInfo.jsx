import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import classSet from 'classnames';
import Billboard from './Billboard'
import * as AssetActionCreators from '../../actions/asset';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./MovieInfo.less');
}

@connect(({ Movie }) => ({Movie})) class MovieInfo extends React.Component {

  constructor(props) {
    super(props);
    this.tlIn = null;
  }

  static propTypes = {
    active: PropTypes.bool.isRequired,
    movie: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired,
    movieObj: PropTypes.instanceOf(Immutable.Object)
  };

  static defaultProps = {
    maxLength: 450
  };

  initTransition() {
    const container = React.findDOMNode(this.refs.slContainer);
    const backGd = React.findDOMNode(this.refs.slBackground);
    this.tlIn = new TimelineMax({paused: true});
    //TweenMax.set(container, {transformStyle: 'preserve-3d', perspective: 100, perspectiveOrigin: '50% 50%'});
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
    const classes = classSet({
      'movie': true,
      'movie--active': this.props.active
    });

    const {
      props: { Movie, active, movie, movieObj,maxLength}
      } = this;

    const movieData = movieObj || Movie.get(`movie/${movie}`);

    if (!movieData) {
      //TODO gerer le 404 sur la movie
      console.log('pas de données');
    }
    let imageStyles = {backgroundImage: `url(${movieData ? movieData.get('poster') : ''})`};
    let idMovie = movieData ? movieData.get('_id') : '';
    let type = movieData ? movieData.get('type') : '';
    let slug = movieData ? movieData.get('slug') : '';
    let link = `/${type}/${idMovie}/${slug}/player/${idMovie}`;

    return (
      <div ref="slContainer" className={classes}>

        <Link to={link} onClick={::this.loadAsset}>
          <div ref="slBackground" className="movie-background" style={imageStyles}/>
        </Link>

        <Link className="btn-play" to={link} onClick={::this.loadAsset}/>

        {movieData ? <Billboard {...{active, movieData, maxLength}}/> : ''}
      </div>
    );
  }

  loadAsset() {
    const {
      props: {
        dispatch, Movie, movie, movieObj
        }
      } = this;

    const movieData = movieObj || Movie.get(`movie/${movie}`);

    dispatch(AssetActionCreators.getToken(movieData.get('_id')));
  }
}

export default MovieInfo;
