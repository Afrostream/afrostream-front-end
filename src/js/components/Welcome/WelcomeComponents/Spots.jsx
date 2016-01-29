import React from 'react';
import ReactDOM from'react-dom';
import { connect } from 'react-redux';
import config from '../../../../../config';
import Thumb from '../../../components/Movies/Thumb';
if (process.env.BROWSER) {
  require('./Spots.less');
}

@connect(({ Category }) => ({Category}))
class Spots extends React.Component {

  getMovies(categorie) {
    let movies = categorie.get('adSpots');
    return movies.map((data, i) => <Thumb favorite={false}
                                          key={`spot-home-${data.get('_id')}-${i}`} {...{data}}/>);
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
