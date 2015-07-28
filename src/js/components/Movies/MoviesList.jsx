import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import Thumb from './Thumb';

import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

@connect(({ Category }) => ({Category})) class MoviesList extends React.Component {

  constructor(props) {
    super(props);
    this.tlIn = null;
  }

  componentDidMount() {
    this.initTransition();
    this.tlIn.play();
  }

  componentDidUpdate() {
    this.initTransition();
    this.tlIn.play();
  }

  initTransition() {
    //Detect mobile
    const ua = navigator.userAgent;
    this.isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);
    if (this.isMobileWebkit) return;

    this.container = React.findDOMNode(this.refs.slContainer);

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
        Category
        }
      } = this;

    const category = Category.get('current') || 'selection';
    const movies = Category.get(`category/${category}`);

    return (
      <div className="movies-list">
        <div className="selection">Notre sélection</div>

        <div className="movies-list__container">
          <Slider>
            <div ref="slContainer" className="slider-container">
              {movies ? movies.map((movie, i) => <Thumb key={`movie-${movie.get('_id')}-${i}`} {...{movie}}/>) : ''}
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default MoviesList;
