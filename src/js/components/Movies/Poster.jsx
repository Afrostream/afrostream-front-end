import React ,{ PropTypes } from 'react';
import Immutable from 'immutable';
import LoadVideo from '../LoadVideo';
import config from '../../../../config';

class Poster extends LoadVideo {

  static defaultProps = {
    thumbW: 140,
    thumbH: 200
  };

  state = {
    showImage: true
  };

  getLazyImageUrl() {
    const {
      props: { movie, thumbW, thumbH}
      } = this;

    const baseUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    let imageStyles = baseUrl;

    if (!movie) {
      return {};
    }

    let thumb = movie.get('thumb');
    if (!thumb) {
      return {};
    }
    if (this.state.showImage && thumb) {
      let imgix = thumb.get('imgix');
      if (!imgix) {
        return {};
      }
      imageStyles = `${imgix}?crop=faces&fit=crop&w=${thumbW}&h=${thumbH}&q=${config.images.quality}&fm=${config.images.type}`;
    }
    return {backgroundImage: `url(${imageStyles})`};
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render() {
    let imageStyles = this.getLazyImageUrl();

    return (
      <div className="payment-page__thumb" style={imageStyles}></div>
    );

  }
}

export default Poster;
