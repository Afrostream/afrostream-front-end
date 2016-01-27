import React from 'react';
import { connect } from 'react-redux';
import MoviesCategorySlider from './MoviesCategorySlider';

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

@connect(({ Category }) => ({Category}))
class MoviesList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      props: {
        Category
        }
      } = this;

    const categories = Category.get('meaList');

    return (
      <div className="movies-list">
        {categories ? categories.map((category, i) => <MoviesCategorySlider
          key={`category-${category.get('_id')}-${i}`} {...{category}} />).toJS() : ''}
      </div>
    );
  }
}

export default MoviesList;
