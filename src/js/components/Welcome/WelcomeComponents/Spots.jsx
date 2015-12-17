import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../config';

if (process.env.BROWSER) {
  require('./Spots.less');
}

@connect(({ Category }) => ({Category}))
class Spots extends React.Component {

  /**
   * render two rows of thumbnails for the payment pages
   */
  render() {
    const {
      props: {
        Category
        }
      } = this;

    let categories = Category.get('categorys/spots') || [];

    return (
      <div className="spots-list">
        {categories ? movies.map((categories, i) => <Thumb
          key={`spot-home-${movie.get('_id')}-${i}`} {...{movie}}/>) : ''}
      </div>
    );

  }
}

export default Spots;
