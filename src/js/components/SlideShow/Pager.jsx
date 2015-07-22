import React from 'react';
import { connect } from 'redux/react';
import * as SlidesActionCreators from '../../actions/slides';

@connect(({ Slides }) => ({Slides})) class Pager extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired
  };

  render() {
    const {
      props: {
        }
      } = this;

    const classes = React.addons.classSet({
      'pager': true,
      'pager--active': this.props.active
    });

    return (
      <span className={classes} onClick={::this.toggleSlide}>{this.props.index + 1}</span>
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
