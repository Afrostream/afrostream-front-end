import React ,{ PropTypes } from 'react';
import Router from 'react-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import * as MovieActionCreators from '../../actions/movie';
import * as VideoActionCreators from '../../actions/video';
import * as EventActionCreators from '../../actions/event';
import config from '../../../../config';
import LoadVideo from '../LoadVideo';

if (canUseDOM) {
  require('gsap');
  var {TimelineMax,TweenMax,Sine} = window.GreenSockGlobals;
}

@connect(({ Movie, Video, User }) => ({Movie, Video, User}))
class Thumb extends LoadVideo {

  constructor(props) {
    super(props);
    this.tlIn = null;
    this.thumbWidth = 422;
    this.thumbW = 140;
    this.thumbH = 200;
    this.overTime = 0;
    this.perspective = 200;
    this.thumbOffset = 30;
    this.scollSpeed = 0.5;
    this.container = null;
    this.slider = null;
    this.thumbBackground = null;
    this.isMobileWebkit = false;
  }

  static propTypes = {
    showImage: React.PropTypes.bool,
    viewport: React.PropTypes.object
  };

  static defaultProps = {
    showImage: false,
    viewport: {
      left: 0,
      width: 0
    }
  };

  state = {
    showImage: this.props.showImage,
    viewport: this.props.viewport
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

    //TODO test perf with only on transition timeline in parentContainer
    this.tlIn = new TimelineMax({paused: true, onComplete: this.scrollContent.bind(this)});
    this.tlIn.add(TweenMax.fromTo(thumb, .5,
      {
        //transform: 'translate3D(0,0,0)',
        y: 0,
        z: 0,
        borderColor: 'transparent',
        width: 140
      },
      {
        //transform: `translate3D(0,-15px,30px)`,
        y: -15,
        z: 30, force3D: true,
        borderColor: '#ffc809',
        width: this.thumbWidth,
        ease: Sine.easeInOut
      }
    ), 0);
    this.tlIn.add(TweenMax.fromTo(this.container, .8,
      {marginLeft: 10, marginRight: 10},
      {marginLeft: 50, marginRight: 50, ease: Sine.easeInOut}
    ), 0);

    this.tlIn.add(TweenMax.fromTo(info, .4,
      {
        autoAlpha: 0,
        left: 200
      },
      {
        autoAlpha: 1,
        left: 140,
        ease: Sine.easeInOut
      }
    ), 0.1);
  }

  scrollContent() {
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
          {scrollLeft: sliderPos + (hiddenLeft), ease: Sine.easeInOut}
        );
        //this.slider.scrollLeft = sliderPos + (hiddenLeft);
        break;
      case thumbRight < sliderPos:
        TweenMax.to(this.slider, this.scollSpeed,
          {scrollLeft: (thumbRight - thumbMargin), ease: Sine.easeInOut}
        );
        //this.slider.scrollLeft = (thumbRight - thumbMargin);
        break;
    }
  }

  lunchTransition() {
    if (this.isMobileWebkit) return;
    clearTimeout(this.overTime);
    this.overTime = setTimeout(() => {
        this.tlIn.restart();
        this.triggerOver();
      }, 300
    );
  }

  revertTransition() {
    clearTimeout(this.overTime);
    this.overTime = setTimeout(() => {
        this.tlIn.reverse();
        this.triggerOut();
      }, 300
    );
  }

  componentDidUpdate(prevProps) {
    if (!this.props.showImages && prevProps.viewport) {
      let element = React.findDOMNode(this);
      this.updateImagePosition(element.offsetLeft, element.offsetHeight);
    }
  }

  updateImagePosition(left, width) {
    // image is already displayed, no need to check anything
    if (this.state.showImage) {
      return;
    }

    let threshold = 10;
    // update showImage state if component element is in the viewport
    let min = this.props.viewport.left;
    let max = this.props.viewport.left + this.props.viewport.width;

    if ((min <= (left + width) && left <= (max - threshold))) {
      this.setShowImage(true);
    }
    //let element = React.findDOMNode(this);
    //
    //if (element.getBoundingClientRect().left < window.innerWidth + threshold) {
    //  this.setShowImage(true);
    //}
  }

  setShowImage(show) {
    this.setState({
      showImage: !!(show)
    });
  }

  componentWillMount() {
    // allow image display override
    if (this.props.showImage) {
      this.setShowImage(true);
    }
  }

  componentDidMount() {
    this.initTransition();
  }

  getLazyImageUrl() {
    const {
      props: { movie }
      } = this;

    const baseUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    let imageStyles = baseUrl;
    let thumb = movie.get('thumb');
    if (!thumb) {
      return {};
    }
    if (this.state.showImage && thumb) {
      let imgix = thumb.get('imgix');
      if (!imgix) {
        return {};
      }
      imageStyles = imgix;
    }
    return {backgroundImage: `url(${imageStyles}?crop=faces&fit=crop&w=${this.thumbW}&h=${this.thumbH}&q=${config.images.quality}&fm=${config.images.type})`};
  }

  render() {
    const {
      props: { movie }
      } = this;
    const maxLength = 200;
    let imageStyles = this.getLazyImageUrl();
    let poster = movie.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imagePoster = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clamp&w=${this.thumbWidth}&h=${this.thumbH}&q=${config.images.quality}&fm=${config.images.type})`} : {};
    let title = movie.get('title');
    let synopsis = movie.get('synopsis') || '';

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      if (cutIndex !== -1) {
        let shortDescription = synopsis.substring(0, cutIndex) + '...';
        synopsis = shortDescription;
      }
    }

    let movieId = movie.get('_id');
    let movieSlug = movie.get('slug') || '';
    let data = {
      movieId: movieId,
      movieSlug: movieSlug
    };
    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="thumb" className="thumb"
             onMouseEnter={::this.lunchTransition}
             onMouseLeave={::this.revertTransition}>
          <a onClick={::this.loadVideo}>
            <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
              <i className="btn-play"></i>
            </div>
          </a>

          <div ref="info" className="thumb-info" style={imagePoster}>
            <div className="thumb-info__txt">
              <div className="thumb-info__title"><a
                onClick={::this.loadMovie}>{title}</a></div>
              <div className="thumb-info__synopsis"><a
                onClick={::this.loadMovie}>{synopsis}</a></div>
            </div>
            {/*<div className="thumb-info__btn">
             <button className="btn btn-xs btn-thumb" href="compte/add">
             <i className="fa fa-heart"></i>Ajouter à ma liste
             </button>
             <button className="btn btn-xs btn-thumb" href="compte/recommander">Recommander</button>
             </div>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default Thumb;
