import React ,{ PropTypes } from 'react';
import Immutable from 'immutable';
import LoadVideo from '../LoadVideo';
import config from '../../../../config';
import shallowEqual from 'react-pure-render/shallowEqual';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed'
};

class Poster extends LoadVideo {


  constructor(props) {
    super(props);
    this.state = {status: props.movie ? Status.LOADING : Status.PENDING, src: ''};
  }

  static propTypes = {
    thumbW: React.PropTypes.number,
    thumbH: React.PropTypes.number
  };

  static defaultProps = {
    thumbW: 140,
    thumbH: 200
  };

  componentDidMount() {
    if (this.state.status === Status.LOADING) {
      this.createLoader();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.movie, this.props.movie)) {
      this.setState({
        status: nextProps.movie ? Status.LOADING : Status.PENDING
      });
    }
  }

  componentDidUpdate() {
    if (this.state.status === Status.LOADING && !this.img) {
      this.createLoader();
    }
  }

  componentWillUnmount() {
    this.destroyLoader();
  }

  createLoader() {
    const {
      props: { movie, thumbW, thumbH}
      } = this;


    if (!movie) {
      return;
    }

    let thumb = movie.get('thumb');
    if (!thumb) {
      return;
    }

    let imgix = thumb.get('imgix');

    if (!imgix) {
      return;
    }

    let imageStyles = `${imgix}?crop=faces&fit=crop&w=${thumbW}&h=${thumbH}&q=${config.images.quality}&fm=${config.images.type}`;


    this.destroyLoader();  // We can only have one loader at a time.

    this.img = new Image();
    this.img.onload = ::this.handleLoad;
    this.img.onerror = ::this.handleError;
    this.img.src = imageStyles;
  }

  destroyLoader() {
    let imgSrouce = '';
    if (this.img) {
      imgSrouce = this.img.src;
      this.img.onload = null;
      this.img.onerror = null;
      this.img = null;
    }
    return imgSrouce;
  }

  handleLoad(event) {
    let imgSrouce = this.destroyLoader();
    this.setState({status: Status.LOADED, src: imgSrouce});
  }

  handleError(error) {
    let imgSrouce = this.destroyLoader();
    this.setState({status: Status.FAILED, src: imgSrouce});
  }

  getLazyImageUrl() {
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
