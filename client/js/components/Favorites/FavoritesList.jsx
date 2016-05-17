import React from 'react';
import { connect } from 'react-redux';
import MoviesSlider from '../Movies/MoviesSlider';
import {favorites,dict} from '../../../../config';

if (process.env.BROWSER) {
  require('./FavoritesList.less');
}

@connect(({ User }) => ({User}))
class FavoritesList extends React.Component {

  constructor(props) {
    super(props);
  }

  renderList(dataList, label, slug, type, thumbW, thumbH, load) {
    if (!dataList) {
      return;
    }
    return <MoviesSlider key={`favorite-${slug}`} {...{dataList, label, slug, type, thumbW, thumbH, load}} />
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const favoritesDataMovies = User.get('favorites/movies');
    const favoritesDataEpisodes = User.get('favorites/episodes');
    let labelPage = dict().favorites['labelPage'];
    if ((!favoritesDataMovies || !favoritesDataMovies.size) && (!favoritesDataEpisodes || !favoritesDataEpisodes.size)) {
      labelPage = dict().favorites['noData']
    }
    return (
      <div className="favorites-list">
        <div className="favorites-list__label">{labelPage}</div>
        { this.renderList(favoritesDataMovies, 'Films / Series', 'movies') }
        { this.renderList(favoritesDataEpisodes, 'Episodes', 'episodes', 'episode', 200, 110, true) }
      </div>
    );
  }
}

export default FavoritesList;
