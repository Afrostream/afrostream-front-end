import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import LazyLoader from './LazyLoader';
import Thumb from '../Movies/Thumb';
import ReactList from 'react-list';
import MobileDetect from 'mobile-detect';

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
        preload={true}
        key={`movie-thumb-${index}`} {...{movie}} />
    );
  }

  getMobile() {
    const userAgent = (window.navigator && navigator.userAgent) || '';
    return new MobileDetect(userAgent);
  }

  render() {
    const {
      props: {
        category
        }
      } = this;

    const label = category.get('label');
    const movies = category.get('movies');
    let isMobile = this.getMobile().mobile();
    return (
      <div className="movies-category-list">
        <div className="movies-list__selection">{label}</div>
        <Slider>

          {!isMobile ? <div className="slider-container"><ReactList
            useTranslate3d
            axis="x"
            itemRenderer={::this.renderItem}
            length={movies.size}
            type='uniform'
          /></div> : <LazyLoader ref="slContainer" {... {movies}} />}

        </Slider>
      </div>
    );
  }
}

export default MoviesCategorySlider;
