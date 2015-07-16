import React from 'react/addons';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import { Link } from 'react-router';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax, Sine} = window.GreenSockGlobals;
}

class Thumb extends React.Component {

  constructor(props) {
    super(props);
    this.tl = null;
    this.thumbWidth = 250;
  }

  static propTypes = {
    movie: React.PropTypes.object.isRequired
  };

  initTransition() {
    const container = React.findDOMNode(this.refs.thumbContainer);
    const thumb = React.findDOMNode(this.refs.thumb);
    const info = React.findDOMNode(this.refs.info);
    TweenMax.set(container, {transformStyle: 'preserve-3d', perspective: 100, perspectiveOrigin: '50% 50%'});
    this.tl = new TimelineMax({paused: true, delay: 0.2, align: 'start'});
    this.tl.add(TweenMax.fromTo(thumb, 0.4,
      {transform: 'translateZ(0)'},
      {transform: 'translateZ(10px)', ease: Sine.easeOut}
    ), 0);
    this.tl.add(TweenMax.fromTo(info, 0.6,
      {display: 'none', width: 0},
      {display: 'inline-block', width: this.thumbWidth, ease: Sine.easeOut}
    ), 0);
  }

  lunchTransition() {
    this.tl.timeScale(1);
    this.tl.restart();
  }

  revertTransition() {
    this.tl.timeScale(2);
    this.tl.reverse();
  }

  componentDidMount() {
    this.initTransition();
  }

  render() {
    const {
      props: { movie }
      } = this;

    let imageStyles = {backgroundImage: `url(${movie.get('poster')})`};
    let title = movie.get('title');

    return (
      <div ref="thumbContainer" className="thumb-containter" onMouseOver={::this.lunchTransition}
           onMouseOut={::this.revertTransition}>
        <div ref="thumb" className="thumb">
          <div className="thumb-background" style={imageStyles}/>
          <div ref="info" className="thumb-info">
            <div className="thumb-info__title">{title}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Thumb;
