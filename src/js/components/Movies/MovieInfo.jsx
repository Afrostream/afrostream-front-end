import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import { connect } from 'redux/react';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import Billboard from './Billboard'

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
    TweenMax.set(container, {transformStyle: 'preserve-3d', perspective: 100, perspectiveOrigin: '50% 50%'});
    this.tlIn.add(TweenMax.fromTo(container, 2, {autoAlpha: 0}, {autoAlpha: 1}));
    this.tlIn.add(TweenMax.fromTo(backGd, 22,
      {transform: 'translateZ(0)'},
      {transform: 'translateZ(5px)'}
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
    const classes = React.addons.classSet({
      'movie': true,
      'movie--active': this.props.active
    });

    const {
      props: { Movie, active, movie, movieObj,maxLength}
      } = this;

    const movieData = movieObj || Movie.get(`movie/${movie}`);

    if (!movieData) {
      //TODO gerer le 404 sur la movie
      return (<div>No data yet</div>)
    }
    let imageStyles = {backgroundImage: `url(${movieData.get('poster')})`};
    let slug = movieData.get('slug') || '';
    let type = movieData.get('type') || '';
    return (
      <div ref="slContainer" className={classes}>

        <Link to={`/${type}/${slug}/player`}>
          <div ref="slBackground" className="movie-background" style={imageStyles}/>
          <div className="btn-play"/>
        </Link>


        <Billboard {...{active, movieData, maxLength}}/>
      </div>
    );
  }
}

export default MovieInfo;
