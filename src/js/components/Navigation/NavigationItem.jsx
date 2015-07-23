import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import { Link } from 'react-router';
import * as CategoryActionCreators from '../../actions/category';

@connect(({ Category }) => ({Category})) class NavigationItem extends React.Component {

  static propTypes = {
    item: PropTypes.instanceOf(Immutable.Object).isRequired,
    active: React.PropTypes.bool.isRequired
  };

  render() {
    const {
      props: {
        item,
        active
        }
      } = this;

    const classes = React.addons.classSet({
      'active': active
    });

    return (
      <li className="navigation-item">
        <Link className={classes} onClick={::this.changeSlide} to={item.get('slug')}>{item.get('label')}</Link>
      </li>
    );
    //<Link className={classes} to={item.get('slug')}>{item.get('label')}</Link>
  }

  changeSlide() {
    const {
      props: {
        dispatch
        }
      } = this;

    dispatch(CategoryActionCreators.getCategory(this.props.item.get('slug')));
  }
}

export default NavigationItem;
