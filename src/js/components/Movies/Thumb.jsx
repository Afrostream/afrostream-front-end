import React ,{ PropTypes } from 'react';
import ReactDOM from'react-dom';
import { Link } from 'react-router';
import Poster from './Poster';
import { connect } from 'react-redux';

if (process.env.BROWSER) {
  require('./Thumb.less');
}

@connect(({ Movie, Video, User}) => ({Movie, Video, User}))
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
        {this.getFavorite()}
      </div>
    );
  }
}

export default Thumb;
