import React ,{PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import * as UserActionCreators from '../../actions/user';
import classSet from 'classnames';
import Spinner from '../Spinner/Spinner';

if (process.env.BROWSER) {
  require('./FavoritesAddButton.less');
}

@connect(({ User}) => ({User}))
class FavoritesAddButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {pendingFavorite: false};
  }

  static propTypes = {
    data: PropTypes.instanceOf(Immutable.Map),
    dataId: PropTypes.number
  };

  static defaultProps = {
    data: null,
    dataId: null
  };

  getType() {
    const {
      props: { data }
      } = this;

    return data.get('type');
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

    let type = this.getType() === 'episode' ? 'episodes' : 'movies';

    dispatch(UserActionCreators[`setFavorites`](type, active, dataId))
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

  render() {
    const {
      props: {
        User,dataId
        }
      } = this;

    const type = this.getType();
    const favoritesData = User.get(`favorites/${type === 'episode' ? 'episode' : 'movie'}s`);
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
      onClick: event => ::this.setFavorite(!isFavorite, dataId)
    };

    return (<div className="btn favorite-add_button" role="button"  {...inputAttributes}>
      <i className={classSet(favoriteClass)}></i>
      {this.state.pendingFavorite ? <Spinner /> : ''}
    </div>)
  }
}

export default FavoritesAddButton;
