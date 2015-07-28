import React from 'react';
import { connect } from 'react-redux';
import NavigationItem from './NavigationItem';

if (process.env.BROWSER) {
  require('./Navigation.less');
}

@connect(({ Category }) => ({Category})) export default
class Navigation extends React.Component {

  render() {
    const {
      props: {
        Category
        }
      } = this;

    const menu = Category.get('menu');
    const slug = Category.get('current');
    return (
      <div className="navigation">
        <ul className="navigation-list" role="navigation">
          {menu.map((item, i) => <NavigationItem active={slug === item.get('slug')}
                                                 key={`menu-${item.get('_id')}-${i}`}
            { ...{item}}/>)}
        </ul>
      </div>
    );
  }
}

export default Navigation;
