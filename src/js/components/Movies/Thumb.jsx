import React ,{ PropTypes } from 'react';
import ReactDOM from'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Poster from './Poster';
import classSet from 'classnames';
import * as UserActionCreators from '../../actions/user';

if (process.env.BROWSER) {
  require('./Thumb.less');
}

@connect(({ Movie, Video, User}) => ({Movie, Video, User}))
class Thumb extends Poster {

  constructor(props) {
    super(props);
  }

  triggerOver() {
    let thumbMouse = ReactDOM.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new Event('thumbover', {bubbles: true}));
    }
  }

  triggerOut() {
    let thumbMouse = ReactDOM.findDOMNode(this);
    if (thumbMouse) {
      thumbMouse.dispatchEvent(new Event('thumbout', {bubbles: true}));
    }
  }

  setFavorite(active, movieId) {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(UserActionCreators.setFavoriteMovies(active, movieId));
  }

  getFavorite() {

    const {
      props: {
        User,movie
        }
      } = this;

    const movieId = movie.get('_id');
    const favoritesData = User.get('favorites/movies');
    let isFavorite = false;
    if (favoritesData) {
      isFavorite = favoritesData.find(function (obj) {
        return obj.get('_id') === movieId;
      });
    }

    let favoriteClass = {
      'fa': true,
      'fa-heart': isFavorite,
      'fa-heart-o': !isFavorite
    };

    const inputAttributes = {
      onTouchEnd: event => ::this.setFavorite(!isFavorite, movieId),
      onClick: event => ::this.setFavorite(!isFavorite, movieId)
    };

    return (<div className="btn favorite-button" role="button"  {...inputAttributes}>
      <i className={classSet(favoriteClass)}></i>
    </div>)
  }

  getNew() {
    const {
      props: { movie }
      } = this;

    let dateFrom = movie.get('dateFrom');

    if (!dateFrom) {
      return '';
    }
    let dateNow = Date.now();
    let compare = dateNow - new Date(dateFrom).getTime();
    if (compare <= (1000 * 3600 * 240)) {
      return (<div className="thumb-new__item"></div>)
    }
  }

  render() {
    let imageStyles = this.getLazyImageUrl();
    let link = this.getLink();
    return (
      <div ref="thumb" className="thumb"
           onMouseEnter={::this.triggerOver}
           onMouseLeave={::this.triggerOut}>
        <Link to={link}>
          <div ref="thumbBackground" className="thumb-background" style={imageStyles}></div>
          {this.getNew()}
        </Link>
        {this.getFavorite()}
      </div>
    );
  }
}

export default Thumb;
