import React ,{ PropTypes } from 'react';
import { Link } from 'react-router';
import Spinner from '../Spinner/Spinner';
import { connect } from 'react-redux';
import * as MovieActionCreators from '../../actions/movie';
import * as VideoActionCreators from '../../actions/video';
import * as EventActionCreators from '../../actions/event';
import config from '../../../../config';

@connect(({ Movie }) => ({Movie})) class SeasonEpisodeThumb extends React.Component {

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    movie: React.PropTypes.object.isRequired,
    season: React.PropTypes.object.isRequired,
    episode: React.PropTypes.object.isRequired
  };


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

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      if (cutIndex !== -1) {
        let shortDescription = synopsis.substring(0, cutIndex) + '...';
        synopsis = shortDescription;
      }
    }

    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="player" className="thumb">
          <a onClick={::this.loadVideo}>
            <div ref="thumbBackground" className="thumb-background" style={imagePoster}>
              <i className="btn-play"></i>
            </div>
          </a>

          <div ref="info" className="thumb-info">
            <div className="thumb-info__title">{title}</div>
            <div className="thumb-info__synopsis">{synopsis}</div>
          </div>
        </div>
      </div>
    );
  }

  //TODO Connect to last video or first video of season/video
  loadVideo() {
    const {
      props: {
        dispatch,movie,season,episode,Movie,await
        }
      } = this;

    const movieDataId = movie.get('_id');
    const movieData = movie || Movie.get(`movies/${movieDataId}`);
    let movieSlud = movieData ? movieData.get('slug') : '';
    let link = `/${movieDataId}/${movieSlud}`;
    let videoId = null;
    const seasonId = season.get('_id');
    const seasonSlug = season.get('slug');
    const episodes = season.get('episodes');
    //TODO get last viewed episode
    if (episode) {
      const episodeId = episode.get('_id');
      const episodeSlug = episode.get('slug');
      link += `/${seasonId}/${seasonSlug}/${episodeId}/${episodeSlug}`;
      videoId = episode.get('videoId');
    }
    if (videoId) {
      link += `/${videoId}`;
      return await * [
          dispatch(EventActionCreators.pinHeader(false)),
          dispatch(VideoActionCreators.getVideo(videoId)),
          this.context.router.transitionTo(link)
        ];
    }
  }
}

export default SeasonEpisodeThumb;
