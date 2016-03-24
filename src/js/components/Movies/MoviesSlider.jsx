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
    selectedId: React.PropTypes.string,
    label: React.PropTypes.string,
    slug: React.PropTypes.string
  };

  static defaultProps = {
    selectedId: null,
    label: '',
    slug: ''
  };

  renderItem(index) {
    const {
      props: {
        dataList,thumbW,thumbH,type
        }
      } = this;

    let data = dataList.get(index);
    let dataId = data.get('_id');
    return (
      <Thumb
        id={dataId}
        key={`data-thumb-${index}`} {...this.props} {...{data, dataId}}  />
    );
  }

  render() {
    const {
      props: {
        dataList,
        selectedId,
        label,
        slug}
      } = this;

    if (!dataList || !dataList.size) {
      return (<div/>);
    }

    let index = null;

    //Si on a un episode ou movie dans les params url, on scroll to this point
    if (selectedId) {
      index = dataList.findIndex((obj) => {
        return obj.get('_id') == selectedId;
      });
    }

    return (
      <div className="movies-data-list">
        {slug ? <div id={slug} className="movies-list__anchor"/> : ''}
        {label ? <div className="movies-list__selection">{label}</div> : ''}
        <Slider>
          <div className="slider-container">
            <ReactList
              ref="react-list"
              useTranslate3d
              initialIndex={index}
              axis="x"
              itemRenderer={::this.renderItem}
              length={dataList.size}
              type='uniform'
            />
          </div>
        </Slider>
      </div>
    );
  }
}

export default MoviesSlider;
