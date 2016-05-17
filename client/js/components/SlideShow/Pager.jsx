import React from 'react';
import { connect } from 'react-redux';
import classSet from 'classnames';
import * as SlidesActionCreators from '../../actions/slides';

@connect(({ Slides }) => ({Slides})) class Pager extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired
  };

  render() {
    const {
      props: {
        active,index
        }
      } = this;

    const classes = classSet({
      'pager': true,
      'pager--active': active
    });

    return (
      <span className={classes} onClick={::this.toggleSlide}>{index + 1}</span>
    );
  }

  toggleSlide() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(SlidesActionCreators.toggleSlide(this.props.index));
  }
}

export default Pager;
