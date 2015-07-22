import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import SlidesContainer from './Slides';
import Pagination from './Pagination';
import Controls from './Controls';
import * as SlidesActionCreators from '../../actions/slides';
import * as CategoryActionCreators from '../../actions/category';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./SlideShow.less');
}

@connect(({ Category, Slides }) => ({Category, Slides})) class SlideShow extends React.Component {

  constructor(props) {
    super(props);
    this.interval = 0;
  }

  render() {
    const {
      props: {
        Category,
        Slides
        }
      } = this;

    const category = Category.get('current');
    const slides = Category.get(`category/${category}/top`);
    const page = Slides.get('page') || 0;

    return (
      <div className="SlideShow">
        {slides ? <SlidesContainer page={page} {...{slides}}/> : 'Loading...'}
        {slides ? <Pagination page={page} {...{slides}}/> : 'Loading...'}
      </div>
    );
  }

  //Next prev button
  //<Controls />

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  componentDidUpdate() {
    clearTimeout(this.interval);
    this.interval = setTimeout(() => this.toggleNext(), config.carousel.interval);
  }

  toggleNext() {

    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SlidesActionCreators.toggleNext());
  }
}

export default SlideShow;
