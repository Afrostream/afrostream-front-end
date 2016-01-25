import React ,{ PropTypes } from 'react';
import { Link } from 'react-router';
import Spinner from '../Spinner/Spinner';
import { connect } from 'react-redux';
import * as MovieActionCreators from '../../actions/movie';
import * as VideoActionCreators from '../../actions/video';
import * as EventActionCreators from '../../actions/event';
import config from '../../../../config';
import LoadVideo from '../LoadVideo';

@connect(({ Movie }) => ({Movie}))
class SeasonEpisodeThumb extends LoadVideo {

  static propTypes = {
    episode: React.PropTypes.object.isRequired
  };

  getNew() {
    const {
      props: { episode }
      } = this;
    let dateFrom = episode.get('dateFrom');

    if (!dateFrom) {
      return '';
    }
    let dateNow = Date.now();
    let compare = dateNow - new Date(dateFrom).getTime();
    if (compare <= (1000 * 3600 * 24)) {
      return (<div className="thumb-new__item"></div>)
    }
  }

  render() {
    const {
      props: { episode }
      } = this;

    const maxLength = 80;
    if (!episode) {
      return <Spinner/>
    }
    let poster = episode.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imagePoster = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clamp&w=200&h=110&q=${config.images.quality}&fm=${config.images.type})`} : {};
    let title = episode.get('title');
    let synopsis = episode.get('synopsis') || '';
    let link = this.getLink();
    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      if (cutIndex !== -1) {
        let shortDescription = synopsis.substring(0, cutIndex) + '...';
        synopsis = shortDescription;
      }
    }

    return (
      <div className="thumb">
        <Link to={link}>
          <div ref="thumbBackground" className="thumb-background" style={imagePoster}>
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
