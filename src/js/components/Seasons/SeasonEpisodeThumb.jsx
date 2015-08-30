import React from 'react/addons';
import { Link } from 'react-router';
import Spinner from '../Spinner/Spinner';

class SeasonEpisodeThumb extends React.Component {

  static propTypes = {
    movie: React.PropTypes.object.isRequired,
    season: React.PropTypes.object.isRequired,
    episode: React.PropTypes.object.isRequired
  };


  render() {
    const {
      props: { movie,season,episode }
      } = this;

    const maxLength = 80;
    if (!episode) {
      return <Spinner/>
    }
    let poster = episode.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imagePoster = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clamp&w=200&h=110&q=65)`} : {};
    let title = episode.get('title');
    let synopsis = episode.get('synopsis') || '';

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      let shortDescription = synopsis.substring(0, cutIndex) + '...';
      synopsis = shortDescription;
    }

    let movieId = movie.get('_id') || '';
    let movieSlug = movie.get('slug') || '';
    let movieType = movie.get('type') || '';
    let videoId = movie.get('videoId') || '';
    let seasonId = season ? season.get('_id') : '';
    let seasonSlug = season ? season.get('slug') : '';
    let episodeId = episode ? episode.get('_id') : '';
    let episodeSlug = episode ? episode.get('slug') : '';
    videoId = episode ? episode.get('videoId') : videoId;
    let link = movieType === 'serie' ? `/${movieId}/${movieSlug}/${seasonId}/${seasonSlug}/${episodeId}/${episodeSlug}/${videoId}` : `/${movieId}/${movieSlug}/${videoId}`;
    let data = {
      movieId: movieId,
      movieSlug: movieSlug,
      seasonId: seasonId,
      seasonSlug: seasonSlug,
      episodeId: episodeId,
      episodeSlug: episodeSlug,
      videoId: videoId
    };
    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="player" className="thumb">
          <Link to={link}>
            <div ref="thumbBackground" className="thumb-background" style={imagePoster}>
              <i className="btn-play"></i>
            </div>
          </Link>

          <div ref="info" className="thumb-info">
            <div className="thumb-info__title">{title}</div>
            <div className="thumb-info__synopsis">{synopsis}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default SeasonEpisodeThumb;
