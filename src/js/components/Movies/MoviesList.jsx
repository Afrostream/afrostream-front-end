import React from 'react';
import { connect } from 'react-redux';
import MoviesSlider from './MoviesSlider';

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
        {categories ? categories.map((categorie, i) => {
          const dataList = categorie.get('movies');
          const label = categorie.get('label');
          const slug = categorie.get('slug');
          return <MoviesSlider
            key={`categorie-${categorie.get('_id')}-${i}`} {...{dataList, label, slug}} />
        }).toJS() : ''}
      </div>
    );
  }
}

export default MoviesList;
