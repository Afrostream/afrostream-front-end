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
    this.thumbWidth = 420;
    this.overTime = 0;
    this.perspective = 200;
    this.thumbOffset = 30;
    this.scollSpeed = 1.4;
    this.container = null;
    this.slider = null;
    this.thumbBackground = null;
    this.isMobileWebkit = false;
  }

  static propTypes = {
    movie: React.PropTypes.object.isRequired
  };

  initTransition() {
    //Detect mobile
    const ua = navigator.userAgent;
    this.isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);
    if (this.isMobileWebkit) return;

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
    this.tl = new TimelineMax({paused: true});
    this.tl.add(TweenMax.fromTo(thumb, 0.4,
      {
        //transform: 'translate3D(0,0,0)',
        scale: 1,
        zIndex: 0,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        width: 140
      },
      {
        //transform: `translate3D(0,0,10px)`,
        scale: 1.1,
        zIndex: 9000,
        backgroundColor: '#FFF',
        borderColor: '#FFF',
        width: this.thumbWidth,
        ease: Sine.easeOut
      }
    ), 0);
    this.tl.add(TweenMax.fromTo(info, 0.4,
      {autoAlpha: 0},
      {autoAlpha: 1, ease: Sine.easeOut}
    ), 0.2);
  }

  lunchTransition() {
    if (this.isMobileWebkit) return;
    clearTimeout(this.overTime);
    this.overTime = setTimeout(() => {
        this.tl.restart();
        const thumbWith = this.thumbWidth + this.thumbBackground.clientWidth;
        const thumbLeft = this.container.offsetLeft + thumbWith;
        const thumbRight = this.container.offsetLeft;
        const sliderPos = this.slider.scrollLeft;
        const thumbMargin = this.thumbOffset;
        const scrollPos = sliderPos + this.slider.clientWidth;
        const visibleLeft = this.slider.clientWidth - (this.container.offsetLeft - this.slider.scrollLeft);
        const hiddenLeft = thumbWith - (visibleLeft + (this.thumbBackground.clientWidth - (thumbMargin * 2 )));
        console.log(thumbWith, this.slider.scrollLeft, this.container.offsetLeft, hiddenLeft);
        switch (true) {
          case thumbLeft > scrollPos:
            TweenMax.to(this.slider, this.scollSpeed,
              {scrollLeft: sliderPos + (hiddenLeft), ease: Sine.easeOut}
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

    const maxLength = 400;

    let imageStyles = {backgroundImage: `url(${movie.get('poster')})`};
    let title = movie.get('title');
    let synopsis = movie.get('synopsis') || '';

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      let shortDescription = synopsis.substring(0, cutIndex) + '...';
      synopsis = shortDescription;
    }

    let dateFrom = movie.get('dateFrom');
    let dateTo = movie.get('dateTo');
    let nBSeasons = movie.get('seasons') || [];
    let finalDate = `${dateFrom}-${dateTo} - ${nBSeasons.size}`;

    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="thumb" className="thumb"
             onMouseEnter={::this.lunchTransition}
             onMouseLeave={::this.revertTransition}
          >
          <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
            <i className="fa fa-play-circle-o"></i>
          </div>
          <div ref="info" className="thumb-info">
            <div className="thumb-info__title">{title}</div>
            <div className="thumb-info__date">{finalDate}</div>
            <div className="thumb-info__synopsis">{synopsis}</div>
            <div className="row">
              <button className="btn btn-xs btn-thumb" href="compte/add">
                <i className="fa fa-heart"></i>Ajouter à ma liste
              </button>
              <button className="btn btn-xs btn-thumb" href="compte/recommander">Recommander</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Thumb;
