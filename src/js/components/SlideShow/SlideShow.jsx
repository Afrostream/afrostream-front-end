import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import SlidesContainer from './Slides';
import Pagination from './Pagination';
import Controls from './Controls';
import * as SlidesActionCreators from '../../actions/slides';
import * as CategoryActionCreators from '../../actions/category';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./SlideShow.less');
}
@prepareRoute(async function ({ store }) {
  return await * [
      store.dispatch(CategoryActionCreators.getSpots())
    ];
})
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

    const categoryId = Category.get(`categoryId`);
    const slides = Category.get(`categorys/${categoryId}/spots`);
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
        dispatch,
        Category
        }
      } = this;
    const categoryId = Category.get(`categoryId`);
    const total = Category.get(`categorys/${categoryId}/spots`);
    console.log(categoryId, total);
    dispatch(SlidesActionCreators.toggleNext(total.size));
  }
}

export default SlideShow;
