import React from 'react';
import { connect } from 'react-redux';
import MoviesSlider from '../Movies/MoviesSlider';
import {favorites} from '../../../../config';

if (process.env.BROWSER) {
  require('./FavoritesList.less');
}

@connect(({ User }) => ({User}))
class FavoritesList extends React.Component {

  constructor(props) {
    super(props);
  }

  renderList(dataList, label, slug, thumbW, thumbH) {
    if (!dataList) {
      return;
    }
    return <MoviesSlider key={`favorite-${slug}`} {...{dataList, label, slug, thumbW, thumbH}} />
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const favoritesDataMovies = User.get('favorites/movies');
    const favoritesDataEpisodes = User.get('favorites/episodes');
    let labelPage = favorites.dict['labelPage'];
    if ((!favoritesDataMovies || !favoritesDataMovies.size) && (!favoritesDataEpisodes || !favoritesDataEpisodes.size)) {
      labelPage = favorites.dict['noData']
    }
    return (
      <div className="favorites-list">
        <div className="favorites-list__label">{labelPage}</div>
        { this.renderList(favoritesDataMovies, 'Films / Series', 'movies') }
        { this.renderList(favoritesDataEpisodes, 'Episodes', 'episodes', 200, 110) }
      </div>
    );
  }
}

export default FavoritesList;
