import React from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import * as SlidesActionCreators from '../../actions/slides';

@connect(({ Slides }) => ({Slides})) class Controls extends React.Component {
  render() {
    const {
      props: {
        Slides
        }
      } = this;

    return (
      <div className="controls">
        <div className="toggle toggle--prev" onClick={::this.togglePrev}>Prev</div>
        <div className="toggle toggle--next" onClick={::this.toggleNext}>Next</div>
      </div>
    );
  }

  toggleNext() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SlidesActionCreators.toggleNext());
  }

  togglePrev() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SlidesActionCreators.togglePrev());
  }
}

export default Controls;
