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

@connect(({ Movie, Video, User }) => ({Movie, Video, User}))
class Thumb extends LoadVideo {

  constructor(props) {
    super(props);
    this.thumbW = 140;
    this.thumbH = 200;
    this.slider = null;
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
    React.findDOMNode(this).dispatchEvent(new Event('thumbover', {bubbles: true}));
  }

  triggerOut() {
    React.findDOMNode(this).dispatchEvent(new Event('thumbout', {bubbles: true}));
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
    let imageStyles = this.getLazyImageUrl();
    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="thumb" className="thumb"
             onMouseEnter={::this.triggerOver}
             onMouseLeave={::this.triggerOut}>
          <a onClick={::this.loadVideo}>
            <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
            </div>
          </a>
        </div>
      </div>
    );
  }
}

export default Thumb;
