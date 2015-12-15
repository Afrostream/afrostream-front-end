import React ,{ PropTypes } from 'react';
import Router from 'react-router';
import ReactDOM from'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import config from '../../../../config';
import LoadVideo from '../LoadVideo';

if (process.env.BROWSER) {
  require('./Thumb.less');
}

@connect(({ Movie, Video}) => ({Movie, Video}))
class Thumb extends LoadVideo {

  constructor(props) {
    super(props);
    this.thumbW = 140;
    this.thumbH = 200;
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
    let thumbMouse = React.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new Event('thumbover', {bubbles: true}));
    }
  }

  triggerOut() {
    let thumbMouse = React.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new Event('thumbout', {bubbles: true}));
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.showImages && prevProps.viewport) {
      let element = ReactDOM.findDOMNode(this);
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
    let max = this.props.viewport.left + (this.props.viewport.width * 2);

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

  getNew() {
    const {
      props: { movie }
      } = this;
    let dateFrom = movie.get('dateFrom');

    if (!dateFrom) {
      return '';
    }
    let dateNow = Date.now();
    let compare = dateNow - new Date(dateFrom).getTime();
    if (compare <= (1000 * 3600 * 240)) {
      return (<div className="thumb-new__item"></div>)
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
      imageStyles = `${imgix}?crop=faces&fit=crop&w=${this.thumbW}&h=${this.thumbH}&q=${config.images.quality}&fm=${config.images.type}`;
    }
    return {backgroundImage: `url(${imageStyles})`};
  }

  render() {
    let imageStyles = this.getLazyImageUrl();
    let link = this.getLink();
    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="thumb" className="thumb"
             onMouseEnter={::this.triggerOver}
             onMouseLeave={::this.triggerOut}>
          <Link to={link}>
            <div ref="thumbBackground" className="thumb-background" style={imageStyles}></div>
            {this.getNew()}
          </Link>
        </div>
      </div>
    );
  }
}

export default Thumb;
