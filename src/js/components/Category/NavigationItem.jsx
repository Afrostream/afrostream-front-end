import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';

class NavigationItem extends React.Component {

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
      'navigation-item': true,
      'navigation-item--active': active
    });

    return (
      <li className={classes}>
        <Link to={item.get('slug')}>{item.get('label')}</Link>
      </li>
    );
  }
}

export default NavigationItem;
