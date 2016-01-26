import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import LazyLoader from './LazyLoader';
import Thumb from '../Movies/Thumb';
import ReactList from 'react-list';

if (process.env.BROWSER) {
  require('./MoviesList.less');
}

class MoviesCategorySlider extends React.Component {

  static propTypes = {
    category: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  renderItem(index, key) {
    const {
      props: {
        category
        }
      } = this;

    const movies = category.get('movies');
    let movie = movies.get(index);

    return (
      <Thumb
        key={key} {...{movie}}/>
    );
  }

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
        <Slider>
          <div className="slider-container">
            <ReactList
              axis="x"
              itemRenderer={::this.renderItem}
              length={movies.size}
              type='uniform'
            />
          </div>
        </Slider>
      </div>
    );
  }
}

export default MoviesCategorySlider;
