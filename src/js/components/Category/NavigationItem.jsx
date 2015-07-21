import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import * as CategoryActionCreators from '../../actions/category';

@connect(({ Category }) => ({Category})) class Pager extends React.Component {

  static propTypes = {
    index: React.PropTypes.number.isRequired,
    menu: PropTypes.instanceOf(Immutable.Object).isRequired
  };

  render() {
    const {
      props: {
        Category
        }
      } = this;

    const classes = React.addons.classSet({
      'pager': true,
      'pager--active': this.props.active
    });

    return (
      <ul className={classes} onClick={::this.toggleCategory}>{this.props.index + 1}</ul>
    );
  }

  toggleCategory() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(CategoryActionCreators.getFilteredCategory(this.props.index));
  }
}

export default Pager;
