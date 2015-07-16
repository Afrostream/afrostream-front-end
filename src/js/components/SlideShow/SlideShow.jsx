import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import SlidesContainer from './Slides';
import Pagination from './Pagination';
import Controls from './Controls';
import * as SlidesActionCreators from '../../actions/slides';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./SlideShow.less');
}

@connect(({ Slides }) => ({Slides})) class SlideShow extends React.Component {

  constructor(props) {
    super(props);
    this.interval = 0;
  }

  render() {
    const {
      props: {
        Slides
        }
      } = this;

    const category = Slides.get(`current`);
    const slides = Slides.get(`category/${category}/top`);
    const page = Slides.get(`page`);

    return (
      <div className="SlideShow">
        <SlidesContainer  {...{slides, page}}/>
        <Pagination {...{slides, page}}/>
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
