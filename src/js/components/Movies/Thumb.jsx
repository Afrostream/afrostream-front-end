import React ,{ PropTypes } from 'react';
import ReactDOM from'react-dom';
import { Link } from 'react-router';
import Poster from './Poster';
import { connect } from 'react-redux';
import classSet from 'classnames';

if (process.env.BROWSER) {
  require('./Thumb.less');
}

@connect(({ Movie,Season, Video, User}) => ({Movie, Season, Video, User}))
class Thumb extends Poster {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    thumbW: React.PropTypes.number,
    thumbH: React.PropTypes.number,
    preload: React.PropTypes.bool,
    favorite: React.PropTypes.bool,
    share: React.PropTypes.bool,
    showDescription: React.PropTypes.bool,
    showTitle: React.PropTypes.bool,
    type: React.PropTypes.string
  };

  static defaultProps = {
    thumbW: 140,
    thumbH: 200,
    preload: false,
    favorite: true,
    share: true,
    showDescription: true,
    showTitle: true,
    type: 'movie'
  };

  triggerOver() {
    let thumbMouse = ReactDOM.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new CustomEvent('thumbover', {bubbles: true}));
    }
  }

  triggerOut() {
    let thumbMouse = ReactDOM.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new CustomEvent('thumbout', {bubbles: true}));
    }
  }

  getInfos() {
    const {
      props: { data,showTitle,showDescription }
      } = this;

    const type = this.getType();

    if (type !== 'episode') {
      return '';
    }
    const maxLength = 80;
    let title = data.get('title');
    let synopsis = data.get('synopsis') || '';
    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      if (cutIndex !== -1) {
        let shortDescription = synopsis.substring(0, cutIndex) + '...';
        synopsis = shortDescription;
      }
    }

    return (<div ref="info" className="thumb-info">
      {showTitle ? <div className="thumb-info__title">{title}</div> : '' }
      {showDescription ? <div className="thumb-info__synopsis">{synopsis}</div> : '' }
    </div>)
  }

  getBtnPlay() {
    const type = this.getType();
    return type === 'episode' ? <i className="btn-play"></i> : '';
  }

  render() {
    let imageStyles = this.getLazyImageUrl();
    let link = this.getLink();
    const type = this.getType();

    let thumbClass = {
      'thumb': true,
      'episode': type === 'episode'
    };

    return (
      <div ref="thumb" className={classSet(thumbClass)}
           onMouseEnter={::this.triggerOver}
           onMouseLeave={::this.triggerOut}>
        <Link to={link}>
          <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
            {this.getBtnPlay()}
            {this.getNew()}
          </div>
          {this.getInfos()}
        </Link>
        <div className="thumb-buttons">
          {this.getFavorite()}
          {this.getShareButton()}
        </div>
      </div>
    );
  }
}

export default Thumb;
