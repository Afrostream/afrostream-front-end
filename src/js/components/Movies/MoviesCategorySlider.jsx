import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import LazyLoader from './LazyLoader';

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

class MoviesCategorySlider extends React.Component {

  static propTypes = {
    category: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {
    const {
      props: {
        category
        }
      } = this;

    const label = category.get('label');
    const movies = category.get('movies');

    return (
      <div className="movies-category-list">
        <div className="movies-list__selection">{label}</div>

        <div className="movies-list__container">
          <Slider>
            <LazyLoader ref="slContainer" {... {movies}} />
          </Slider>
        </div>
      </div>
    );
  }
}

export default MoviesCategorySlider;
