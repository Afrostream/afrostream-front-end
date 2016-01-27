import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classSet from 'classnames';
import * as CategoryActionCreators from '../../actions/category';

@connect(({ Category }) => ({Category}))
class NavigationItem extends React.Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Map).isRequired,
    active: React.PropTypes.bool.isRequired
  };

  render() {
    const {
      props: {
        item,
        active
        }
      } = this;

    const classes = classSet({
      'active': active
    });

    return (
      <li className="navigation-item">
        <a className={classes} href={`/#${item.get('slug')}`}>{item.get('label')}</a>
      </li>
    );
  }

  changeSlide() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(CategoryActionCreators.getSpots(this.props.item.get('_id')));
  }
}

export default NavigationItem;
