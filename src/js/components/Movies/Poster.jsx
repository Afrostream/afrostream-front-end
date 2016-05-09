import React, { PropTypes } from 'react';
import LoadVideo from '../LoadVideo';
import config from '../../../../config';
import shallowEqual from 'react-pure-render/shallowEqual';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
import FavoritesAddButton from '../Favorites/FavoritesAddButton';
import ShareButton from '../Share/ShareButton';
import _ from 'lodash';

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed'
};

class Poster extends LoadVideo {

  constructor (props) {
    super(props);
    this.state = {status: props.data ? Status.LOADING : Status.PENDING, src: ''};
  }

  componentDidMount () {
    if (this.state.status === Status.LOADING) {
      this.createLoader();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.data, this.props.data)) {
      if (nextProps.data) {
        this.setState({
          status: nextProps.data ? Status.LOADING : Status.PENDING
        });
      }
    }
  }

  componentDidUpdate () {
    if (this.state.status === Status.LOADING && !this.img) {
      this.createLoader();
    }
  }

  componentWillUnmount () {
    this.destroyLoader();
  }

  getType () {
    const {
      props: {data, type}
    } = this;

    return type || data.get('type');
  }

  extractProfile (image, ratio = '16:31') {
    if (!image) {
      return;
    }
    var rect;
    var profiles = image.get('profiles');
    if (!profiles) {
      return `&crop=${this.props.crop}&fit=${this.props.fit}`
    }
    try {
      rect = profiles.get(ratio);
    } catch (e) {
      console.log(e);
    }
    return rect && `&rect=${_.values(rect.toJS()).join()}`
  }

  createLoader () {
    const {
      props: {data, thumbW, thumbH}
    } = this;


    if (!data) {
      return;
    }

    let type = this.getType();
    let thumb = data.get(type === 'movie' ? 'thumb' : 'poster');
    if (!thumb) {
      return;
    }

    let imgix = thumb.get('imgix');

    if (!imgix) {
      return;
    }

    let rect = this.extractProfile(thumb, '16:31');
    let imageStyles = `${imgix}?w=${thumbW}&h=${thumbH}&q=${config.images.quality}&fm=${config.images.type}&facepad=1.5${rect}`;

    if (this.props.preload) {

      this.destroyLoader();  // We can only have one loader at a time.

      this.img = new Image();
      this.img.onload = ::this.handleLoad;
      this.img.onerror = ::this.handleError;
      this.img.src = imageStyles;
    } else {
      this.setState({status: Status.LOADED, src: imageStyles});
    }
  }

  destroyLoader () {
    let imgSrouce = '';
    if (this.img) {
      imgSrouce = this.img.src;
      this.img.onload = null;
      this.img.onerror = null;
      this.img = null;
    }
    return imgSrouce;
  }

  handleLoad () {
    let imgSrouce = this.destroyLoader();
    this.setState({status: Status.LOADED, src: imgSrouce});
  }

  handleError () {
    let imgSrouce = this.destroyLoader();
    this.setState({status: Status.FAILED, src: imgSrouce});
  }

  getLazyImageUrl () {
    let imageStyles;
    if (canUseDOM) {
      imageStyles = require('../../../assets/images/default/134x200.jpg');
    }
    switch (this.state.status) {
      case Status.LOADED:
        imageStyles = this.state.src;
        break;
      default:
        break;
    }
    return {backgroundImage: `url(${imageStyles})`};
  }

  getShareButton () {
    const {
      props: {data, share}
    } = this;

    if (!share) {
      return;
    }

    let link = this.getLink();

    return <ShareButton link={link} title={data.get('title')} description={data.get('synopsis')}/>
  }

  getFavorite () {
    const {
      props: {
        favorite
      }
    } = this;

    if (!favorite) {
      return;
    }

    return (<FavoritesAddButton {...this.props}/>)
  }

  getNew () {
    const {
      props: {data}
    } = this;

    let dateFrom = data.get('dateFrom');

    if (!dateFrom) {
      return '';
    }
    let dateNow = Date.now();
    let compare = dateNow - new Date(dateFrom).getTime();
    const type = this.getType();
    let nbDay = config.movies.isNew[type] || 10;
    if (compare <= (nbDay * 24 * 3600 * 1000)) {
      return (<div className="thumb-new__item"></div>);
    }
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render () {
    let imageStyles = this.getLazyImageUrl();

    return (
      <div className="payment-page__thumb" style={imageStyles}></div>
    );

  }
}

Poster.propTypes = {
  thumbW: React.PropTypes.number,
  thumbH: React.PropTypes.number,
  preload: React.PropTypes.bool,
  favorite: React.PropTypes.bool,
  share: React.PropTypes.bool,
  type: React.PropTypes.string,
  crop: React.PropTypes.string,
  fit: React.PropTypes.string,
  facepad: React.PropTypes.string
};

Poster.defaultProps = {
  thumbW: 140,
  thumbH: 200,
  preload: false,
  favorite: true,
  share: true,
  type: 'movie',
  crop: 'faces',
  fit: 'min',
  facepad: '1'
};

export default Poster;
