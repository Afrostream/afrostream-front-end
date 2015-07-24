import React from 'react/addons';
import { Link } from 'react-router';

class SeasonEpisodeThumb extends React.Component {

  static propTypes = {
    episode: React.PropTypes.object.isRequired
  };


  render() {
    const {
      props: { episode }
      } = this;

    const maxLength = 140;

    let imageStyles = {backgroundImage: `url(${episode.get('poster')})`};
    let title = episode.get('title');
    let synopsis = episode.get('synopsis') || '';

    //wrap text
    if (synopsis.length >= maxLength) {
      let cutIndex = synopsis.indexOf(' ', maxLength);
      let shortDescription = synopsis.substring(0, cutIndex) + '...';
      synopsis = shortDescription;
    }

    let type = episode.get('type') || '';
    let slug = episode.get('slug') || '';

    return (
      <div ref="thumbContainer" className="thumb-containter">
        <div ref="thumb" className="thumb">
          <Link to={`/${type}/${slug}/player`}>
            <div ref="thumbBackground" className="thumb-background" style={imageStyles}>
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
