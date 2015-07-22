import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import * as MoviesActionCreators from '../../actions/movies';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import Thumb from './Thumb';

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

@connect(({ Category }) => ({Category})) class MoviesList extends React.Component {

  render() {
    const {
      props: {
        Category
        }
      } = this;

    const category = Category.get('current');
    const movies = Category.get(`category/${category}`);

    return (
      <div className="movies-list">
        <div className="selection">Notre sélection</div>

        <div className="movies-list__container">
          <Slider>
            <div className="slider-container">
              {movies.map((movie, i) => <Thumb key={`movie-${movie.get('_id')}-${i}`} {...{movie}}/>)}
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default MoviesList;
