import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import NavigationItem from './NavigationItem';

if (process.env.BROWSER) {
  require('./Navigation.less');
}

@connect(({ Category }) => ({Category})) class Navigation extends React.Component {

  render() {
    const {
      props: {
        Category
        }
      } = this;

    const menu = Category.get('menu');
    const slug = Category.get('menu-active');
    return (
      <div className="navigation">
        <ul className="navigation-list" role="navigation">
          {menu.map((item, i) => <NavigationItem active={slug === item.slug}
                                                 key={`menu-${item.get('_id')}-${i}`}
            { ...{item}}/>)}
        </ul>
      </div>
    );
  }
}

export default Navigation;
