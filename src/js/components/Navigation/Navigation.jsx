import React from 'react';
import { connect } from 'react-redux';
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
    const categoryId = Category.get('categoryId');

    return (
      <div className="navigation hidden-xs">
        {
          menu ?
            <ul className="navigation-list" role="navigation">
              {menu.map((item, i) => <NavigationItem active={categoryId === item.get('_id')}
                                                     key={`menu-${item.get('_id')}-${i}`}
                { ...{item}}/>)}
            </ul>
            :
            <div />
        }
      </div>
    );
  }
}

export default Navigation;
