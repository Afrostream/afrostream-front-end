import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import SeasonTabButton from './SeasonTabButton';
import SeasonEpisodeThumb from './SeasonEpisodeThumb';

import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

if (process.env.BROWSER) {
  require('./SeasonList.less');
}

@connect(({ Movie, Season }) => ({Movie, Season})) class SeasonList extends React.Component {

  constructor(props) {
    super(props);
    this.tlIn = null;
  }

  static propTypes = {
    movie: PropTypes.string.isRequired
  };

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
      //transform: 'translate3D(0,50,0)'
      y: 30
    }, {
      autoAlpha: 1,
      //transform: 'translate3D(0,0,0)',
      y: 0,
      ease: Sine.easeOut
    }, 0.03));
  }

  render() {
    const {
      props: {
        Movie,movie
        }
      } = this;

    const seasons = Movie.get(`movie/${movie}/season`);


    return (
      <div>
        {seasons.size ? this.parseSeasonList(seasons) : ''}
      </div>
    );
  }

  parseSeasonList(seasons) {

    const page = Season.get('season');

    return (
      <div className="season-list">
        <div className="selection">
          {seasons ? seasons.map((season, i) => <SeasonTabButton
            key={`season-${season.get('_id')}-${i}`}
            active={page === i}
            index={i}
            {...{season}}/>) : ''}
        </div>

        <div className="season-list__container">
          <Slider>
            <div ref="slContainer" className="slider-container">
              {seasons ? seasons.map((episode, i) => <SeasonEpisodeThumb
                key={`episode-${episode.get('_id')}-${i}`} {...{episode}}/>) : ''}
            </div>
          </Slider>
        </div>
      </div>
    );

  }
}

export default SeasonList;
