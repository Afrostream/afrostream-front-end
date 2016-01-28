import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import config from '../../../../config';
import Slider from '../Slider/Slider';
import LazyLoader from './LazyLoader';
import Thumb from '../Movies/Thumb';
import ReactList from 'react-list';

if (process.env.BROWSER) {
  require('./MoviesSlider.less');
}

class MoviesSlider extends React.Component {

  static propTypes = {
    dataList: PropTypes.instanceOf(Immutable.List).isRequired,
    label: React.PropTypes.string,
    slug: React.PropTypes.string
  };

  static defaultProps = {
    label: '',
    slug: ''
  };

  renderItem(index) {
    const {
      props: {
        dataList
        }
      } = this;

    let data = dataList.get(index);
    let dataId = data.get('_id');

    return (
      <Thumb
        preload={true}
        key={`data-thumb-${index}`} {...{data, dataId}} />
    );
  }

  render() {
    const {
      props: {
        dataList,label,slug
        }
      } = this;

    if (!dataList || !dataList.size) {
      return (<div/>);
    }
    return (
      <div className="movies-data-list">
        <div id={slug} className="movies-list__anchor"/>
        <div className="movies-list__selection">{label}</div>
        <Slider>
          <ReactList
            useTranslate3d
            axis="x"
            itemRenderer={::this.renderItem}
            length={dataList.size}
            type='uniform'
          />
        </Slider>
      </div>
    );
  }
}

export default MoviesSlider;
