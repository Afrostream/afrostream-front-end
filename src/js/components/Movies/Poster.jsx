import React ,{ PropTypes } from 'react';
import Immutable from 'immutable';
import LoadVideo from '../LoadVideo';
import config from '../../../../config';
import shallowEqual from 'react-pure-render/shallowEqual';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import * as UserActionCreators from '../../actions/user';
import classSet from 'classnames';
import Spinner from '../Spinner/Spinner';

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed'
};

class Poster extends LoadVideo {

  constructor(props) {
    super(props);
    this.state = {status: props.data ? Status.LOADING : Status.PENDING, src: '', pendingFavorite: false};
  }

  static propTypes = {
    thumbW: React.PropTypes.number,
    thumbH: React.PropTypes.number,
    preload: React.PropTypes.bool,
    keyMap: React.PropTypes.string,
    favorite: React.PropTypes.bool
  };

  static defaultProps = {
    thumbW: 140,
    thumbH: 200,
    preload: false,
    keyMap: 'thumb',
    favorite: true
  };

  componentDidMount() {
    if (this.state.status === Status.LOADING) {
      this.createLoader();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!shallowEqual(nextContext, this.context)) {
      this.setState({
        status: nextProps.data ? Status.LOADING : Status.PENDING
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
      props: { data, thumbW, thumbH,keyMap}
      } = this;


    if (!data) {
      return;
    }

    let thumb = data.get(keyMap);
    if (!thumb) {
      return;
    }

    let imgix = thumb.get('imgix');

    if (!imgix) {
      return;
    }

    let imageStyles = `${imgix}?crop=faces&fit=crop&w=${thumbW}&h=${thumbH}&q=${config.images.quality}&fm=${config.images.type}`;

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

  setFavorite(active, dataId) {
    const {
      props: {
        dispatch
        }
      } = this;
    let self = this;

    self.setState({
      pendingFavorite: true
    });

    dispatch(UserActionCreators.setFavoriteMovies(active, dataId))
      .then(()=> {
        self.setState({
          pendingFavorite: false
        });
      })
      .catch((err)=> {
        self.setState({
          pendingFavorite: false
        });
      });
  }

  getFavorite() {
    const {
      props: {
        User,dataId,favorite
        }
      } = this;

    if (!favorite) {
      return;
    }

    const favoritesData = User.get('favorites/movies');
    let isFavorite = false;
    if (favoritesData) {
      isFavorite = favoritesData.find(function (obj) {
        return obj.get('_id') === dataId;
      });
    }

    let favoriteClass = {
      'fa': true,
      'fa-heart': isFavorite,
      'fa-heart-o': !isFavorite,
      'pending': this.state.pending
    };

    const inputAttributes = {
      onTouchEnd: event => ::this.setFavorite(!isFavorite, dataId),
      onClick: event => ::this.setFavorite(!isFavorite, dataId)
    };

    return (<div className="btn favorite-button" role="button"  {...inputAttributes}>
      <i className={classSet(favoriteClass)}></i>
      {this.state.pendingFavorite ? <Spinner /> : ''}
    </div>)
  }

  getNew() {
    const {
      props: { data }
      } = this;

    let dateFrom = data.get('dateFrom');

    if (!dateFrom) {
      return '';
    }
    let dateNow = Date.now();
    let compare = dateNow - new Date(dateFrom).getTime();
    if (compare <= (1000 * 3600 * 240)) {
      return (<div className="thumb-new__item"></div>)
    }
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
