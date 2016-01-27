import React ,{ PropTypes } from 'react';
import ReactDOM from'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Poster from './Poster';

if (process.env.BROWSER) {
  require('./Thumb.less');
}

@connect(({ Movie, Video}) => ({Movie, Video}))
class Thumb extends Poster {

  constructor(props) {
    super(props);
  }

  triggerOver() {
    let thumbMouse = ReactDOM.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new Event('thumbover', {bubbles: true}));
    }
  }

  triggerOut() {
    let thumbMouse = ReactDOM.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new Event('thumbout', {bubbles: true}));
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

  render() {
    let imageStyles = this.getLazyImageUrl();
    let link = this.getLink();
    return (
      <div ref="thumb" className="thumb"
           onMouseEnter={::this.triggerOver}
           onMouseLeave={::this.triggerOut}>
        <Link to={link}>
          <div ref="thumbBackground" className="thumb-background" style={imageStyles}></div>
          {this.getNew()}
        </Link>
      </div>
    );
  }
}

export default Thumb;
