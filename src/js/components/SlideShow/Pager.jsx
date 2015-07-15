import React from 'react';
import { connect } from 'redux/react';
import { prepareRoute } from '../../decorators';
import * as SlidesActionCreators from '../../actions/slides';

@prepareRoute(async function ({ redux }) {
  return await * [
      redux.dispatch(SlidesActionCreators.toggleSlide())
    ];
})
@connect(({ Slides }) => ({Slides})) class Pager extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired
  }

  render() {
    const {
      props: {
        Slides
        }
      } = this;
    return (
      <span className="pager" onClick={::this.toggleSlide}>{this.props.title}</span>
    );
  }

  toggleSlide() {
    const {
      props: {
        dispatch,
        params: { index }
        }
      } = this;

    dispatch(SlidesActionCreators.toggleSlide(index));
  }
}

export default Pager;
