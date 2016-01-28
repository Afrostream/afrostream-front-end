import React from 'react';
import { connect } from 'react-redux';
import MoviesSlider from '../Movies/MoviesSlider';

if (process.env.BROWSER) {
  require('./FavoritesList.less');
}

@connect(({ User }) => ({User}))
class FavoritesList extends React.Component {

  constructor(props) {
    super(props);
  }

  renderList(dataList, label, slug) {
    return <MoviesSlider key={`favorite-${slug}`} {...{dataList, label, slug}} />
  }

  render() {
    const {
      props: {
        User
        }
      } = this;

    const favoritesDataMovies = User.get('favorites/movies');
    const favoritesDataEpisodes = User.get('favorites/episodes');
    return (
      <div className="favorites-list">
        { this.renderList(favoritesDataMovies, 'Films / Series', 'movies') }
        { this.renderList(favoritesDataEpisodes, 'Episodes', 'episodes') }
      </div>
    );
  }
}

export default FavoritesList;
