import React from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import * as SlidesActionCreators from '../../actions/slides';

@connect(({ Slides,Category }) => ({Slides, Category})) class Controls extends React.Component {
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
        dispatch,Category
        }
      } = this;
    const categoryId = Category.get(`categoryId`);
    const total = Category.get(`categorys/${categoryId}/spots`);
    dispatch(SlidesActionCreators.toggleNext(total));
  }

  togglePrev() {
    const {
      props: {
        dispatch,Category
        }
      } = this;
    const categoryId = Category.get(`categoryId`);
    const total = Category.get(`categorys/${categoryId}/spots`);
    dispatch(SlidesActionCreators.togglePrev(total));
  }
}

export default Controls;
