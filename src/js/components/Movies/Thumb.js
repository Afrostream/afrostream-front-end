import React from 'react/addons';
import { Link } from 'react-router';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Expo,Sine} = window.GreenSockGlobals;
}

class Thumb extends React.Component {

  constructor(props) {
    super(props);
    this.tlIn = null;
    this.tlOut = null;
    this.thumbWidth = 422;
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

  triggerOver() {
    this.slider.dispatchEvent(new Event('thumbover'));
  }

  triggerOut() {
    this.slider.dispatchEvent(new Event('thumbout'));
  }

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
    this.tlIn = new TimelineMax({paused: true});
    this.tlIn.add(TweenMax.fromTo(thumb, .4,
      {
        transform: 'translate3D(0,0,0)',
        borderColor: 'transparent',
        width: 140
      },
      {
        transform: `translate3D(0,-15px,30px)`,
        borderColor: '#ffc809',
        width: this.thumbWidth,
        ease: Sine.easeOut
      }
    ), 0);
    this.tlIn.add(TweenMax.fromTo(this.container, .5,
      {marginLeft: 10, marginRight: 10},
      {marginLeft: 50, marginRight: 50, ease: Expo.easeOut}
    ), 0);

    this.tlIn.add(TweenMax.fromTo(info, .2,
      {
        autoAlpha: 0,
        left: 280
      },
      {
        autoAlpha: 1,
        left: 140,
        ease: Sine.easeOut
      }
    ), 0.2);
  }

  lunchTransition() {
    if (this.isMobileWebkit) return;
    clearTimeout(this.overTime);
    this.overTime = setTimeout(() => {
        this.tlIn.restart();
        this.triggerOver();
        const thumbWith = this.thumbWidth + this.thumbBackground.clientWidth;
        const thumbLeft = this.container.offsetLeft + thumbWith;
        const thumbRight = this.container.offsetLeft;
        const sliderPos = this.slider.scrollLeft;
        const thumbMargin = this.thumbOffset;
        const scrollPos = sliderPos + this.slider.clientWidth;
        const visibleLeft = this.slider.clientWidth - (this.container.offsetLeft - this.slider.scrollLeft);
        const hiddenLeft = thumbWith - (visibleLeft + (this.thumbBackground.clientWidth - (thumbMargin * 2 )));
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
        this.tlIn.reverse();
        this.triggerOut();
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

    const maxLength = 200;

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
    let type = movie.get('type');
    let slug = movie.get('slug') || '';

    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="thumb" className="thumb"
             onMouseEnter={::this.lunchTransition}
             onMouseLeave={::this.revertTransition}
          >
          <Link to={`${type}/${slug}`}>
            <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
              <i className="btn-play"></i>
            </div>
          </Link>

          <div ref="info" className="thumb-info" style={imageStyles}>
            <div className="thumb-info__txt">
              <div className="thumb-info__title">{title}</div>
              <div className="thumb-info__synopsis">{synopsis}</div>
            </div>
            <div className="thumb-info__btn">
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
