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

@connect(({ Movies }) => ({Movies})) class MoviesList extends React.Component {

  static propTypes = {
    movies: PropTypes.instanceOf(Immutable.List).isRequired
  };

  render() {
    const {
      props: {
        Movies,movies
        }
      } = this;

    const page = Movies.get(`page`);

    return (
      <div className="movies-list">
        <div className="selection">Notre sélection</div>

        <div className="movies-list__container">
          <Slider>
            <div className="slider-conatiner">
              {movies.map((movie, i) => <Thumb key={`movie-${movie.get('_id')}-${i}`} {...{movie}}/>)}
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default MoviesList;
