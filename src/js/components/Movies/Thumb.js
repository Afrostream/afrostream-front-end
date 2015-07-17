import React from 'react/addons';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import { Link } from 'react-router';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax, TweenMax, Sine} = window.GreenSockGlobals;
}

class Thumb extends React.Component {

  constructor(props) {
    super(props);
    this.tl = null;
    this.thumbWidth = 250;
    this.overTime = 0;
    this.perspective = 100;
    this.thumbOffset = 15;
    this.scollSpeed = 1.4;
    this.container = null;
    this.slider = null;
    this.thumbBackground = null;
  }

  static propTypes = {
    movie: React.PropTypes.object.isRequired
  };

  initTransition() {
    this.container = React.findDOMNode(this.refs.thumbContainer);
    this.slider = this.container.parentNode;
    this.thumbBackground = React.findDOMNode(this.refs.thumbBackground);
    const thumb = React.findDOMNode(this.refs.thumb);
    const info = React.findDOMNode(this.refs.info);
    TweenMax.set(this.container, {
      transformStyle: 'preserve-3d',
      perspective: this.perspective,
      perspectiveOrigin: '50% 50%'
    });
    this.tl = new TimelineMax({paused: true, align: 'start'});
    this.tl.add(TweenMax.fromTo(thumb, 0.4,
      {
        transform: 'translate3D(0,0,0)',
        backgroundColor: 'transparent',
        borderColor: 'transparent'
      },
      {
        transform: `translate3D(0,0,10px)`,
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        ease: Sine.easeOut
      }
    ), 0);
    this.tl.add(TweenMax.fromTo(info, 0.4,
      {display: 'none', width: 0},
      {display: 'inline-block', width: this.thumbWidth, ease: Sine.easeOut}
    ), 0);
  }

  lunchTransition() {
    clearTimeout(this.overTime);
    this.overTime = setTimeout(() => {
        this.tl.restart();
        const thumbWith = this.thumbWidth + this.thumbBackground.clientWidth;
        const thumbLeft = this.container.offsetLeft + thumbWith;
        const thumbRight = this.container.offsetLeft;
        const sliderPos = this.slider.scrollLeft;
        const thumbMargin = this.perspective + (this.thumbOffset);
        const scrollPos = sliderPos + this.slider.clientWidth;
        switch (true) {
          case thumbLeft > scrollPos:
            TweenMax.to(this.slider, this.scollSpeed,
              {scrollLeft: sliderPos + (thumbWith - thumbMargin), ease: Sine.easeOut}
            );
            break;
          case thumbRight < sliderPos:
            TweenMax.to(this.slider, this.scollSpeed,
              {scrollLeft: (thumbRight - thumbMargin), ease: Sine.easeOut}
            );
            break;
        }
      }, 200
    );
  }

  revertTransition() {
    clearTimeout(this.overTime);
    this.overTime = setTimeout(() => {
        this.tl.reverse();
      }, 100
    );
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
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="thumb" className="thumb" onMouseEnter={::this.lunchTransition}
             onMouseLeave={::this.revertTransition}>
          <div ref="thumbBackground" className="thumb-background" style={imageStyles}/>
          <div ref="info" className="thumb-info">
            <div className="thumb-info__title">{title}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Thumb;
