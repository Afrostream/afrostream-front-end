import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import LazyLoader from './LazyLoader';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

class MoviesCategorySlider extends React.Component {

  static propTypes = {
    category: PropTypes.instanceOf(Immutable.Object).isRequired,
  };

  constructor(props) {
    super(props);
    this.tlIn = null;
  }

  componentDidMount() {
    this.initTransition();
    if (this.tlIn) {
      this.tlIn.play();
    }
  }

  componentDidUpdate() {
    this.initTransition();
    if (this.tlIn) {
      this.tlIn.play();
    }
  }


  initTransition() {
    //Detect mobile
    const ua = navigator.userAgent;
    this.isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);
    if (this.isMobileWebkit) return;

    this.container = React.findDOMNode(this.refs.slContainer);

    if (!this.container.children) return;

    this.tlIn = new TimelineMax({paused: true});

    this.tlIn.add(TweenMax.staggerFromTo(this.container.children, 0.2, {
      autoAlpha: 0,
      y: 30
    }, {
      autoAlpha: 1,
      y: 0,
      ease: Sine.easeOut
    }, 0.03));
  }

  render() {
    const {
      props: {
        category
        }
      } = this;

    const label = category.get('label');
    const movies = category.get('movies');

    return (
      <div className="movies-category-list">
        <div className="movies-list__selection">{label}</div>

        <div className="movies-list__container">
          <Slider>
            <LazyLoader ref="slContainer" {... {movies}} />
          </Slider>
        </div>
      </div>
    );
  }
}

export default MoviesCategorySlider;
