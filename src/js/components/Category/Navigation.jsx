import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'redux/react';
import { Link } from 'react-router';
import NavigationItem from './NavigationItem';

if (process.env.BROWSER) {
  require('./Navigation.less');
}

@connect(({ Category }) => ({Category})) class Navigation extends React.Component {


  render() {
    const {
      props: {
        Slides
        }
      } = this;

    const category = Category.get(`current`);
    const menu = Category.get(`category/${category}/menu`);
    return (
      <div className="navigation">
        <ul className="navigation-list" role="navigation">
          {menu.map((item, i) => <NavigationItem active={page === item.slug}
                                                 key={`menu-${item.get('_id')}-${i}`}
            { ...{item}}/>)}
        </ul>
      </div>
    );
  }
}

export default Navigation;
