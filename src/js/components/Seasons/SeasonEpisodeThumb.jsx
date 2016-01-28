import React ,{ PropTypes } from 'react';
import { Link } from 'react-router';
import Spinner from '../Spinner/Spinner';
import { connect } from 'react-redux';
import * as MovieActionCreators from '../../actions/movie';
import * as VideoActionCreators from '../../actions/video';
import * as EventActionCreators from '../../actions/event';
import config from '../../../../config';
import Poster from '../Movies/Poster';

@connect(({ Movie,Season }) => ({Movie, Season}))
class SeasonEpisodeThumb extends Poster {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    thumbW: 200,
    thumbH: 110,
    keyMap: 'poster'
  };

  render() {
    const {
      props: { data }
      } = this;

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

    let imageStyles = this.getLazyImageUrl();
    let link = this.getLink();

    return (
      <div className="thumb">
        <Link to={link}>
          <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
            <i className="btn-play"></i>
            {this.getNew()}
          </div>

          <div ref="info" className="thumb-info">
            <div className="thumb-info__title">{title}</div>
            <div className="thumb-info__synopsis">{synopsis}</div>
          </div>
        </Link>
      </div>
    );
  }
}

export default SeasonEpisodeThumb;
