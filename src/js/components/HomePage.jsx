import React from 'react';
import { connect } from 'redux/react';
import { prepareRoute } from '../decorators';
import * as SlidesActionCreators from '../actions/slides';
import { Link } from 'react-router';
import SlideShow from './SlideShow/SlideShow';

@prepareRoute(async function ({ redux, params: { category } }) {
  return await * [
      redux.dispatch(SlidesActionCreators.getTopByCategory(category))
    ];
})
@connect(({ Slides }) => ({Slides})) class HomePage extends React.Component {

  render() {
    const {
      props: {
        Slides,
        params: { category }
        }
      } = this;

    const slides = Slides.get(`category/${category}`);
    const page = Slides.get(`page`);

    return (
      <div className="container">
        {slides ? <SlideShow {...{slides, page}} /> : 'Loading...'}
      </div>
    );
  }
}

export default HomePage;
