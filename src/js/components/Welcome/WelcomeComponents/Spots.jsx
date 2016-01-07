import React from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import config from '../../../../../config';
import Thumb from '../../../components/Movies/Thumb.jsx';
import createFragment from 'react-addons-create-fragment';
if (process.env.BROWSER) {
  require('./Spots.less');
}

@connect(({ Category }) => ({Category}))
class Spots extends React.Component {

  getMovies(categorie) {
    let movies = categorie.get('adSpots');
    return movies.map((movie, i) => <Thumb showImage={true}
                                           key={`spot-home-${movie.get('_id')}-${i}`} {...{movie}}/>);
  }

  /**
   * render two rows of thumbnails for the payment pages
   */
  render() {
    const {
      props: {
        Category
        }
      } = this;

    let categories = Category.get('categorys/spots');
    return (
      <div className="spots-list">
        {categories ? categories.map((categorie, i) => this.getMovies(categorie)).toJS() : ''}
      </div>
    );

  }
}

export default Spots;
